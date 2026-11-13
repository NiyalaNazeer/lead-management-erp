
import { getSessionUser } from "../../../lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../lib/prisma";

const opportunitySchema = z.object({
  leadId: z.string().min(1, "Lead is required"),
  catalogType: z.enum(["PRODUCT", "SERVICE"]),
  catalogItemId: z.string().min(1, "Select a product or service"),
  totalAmount: z.coerce
    .number()
    .finite()
    .positive("Total amount must be greater than zero"),
  expectedMarginPct: z.coerce
    .number()
    .finite()
    .min(0, "Margin cannot be below 0%")
    .max(100, "Margin cannot exceed 100%"),
});

export async function POST(request: Request) {
  try {
    // 1. Check whether the user is logged in
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please log in." },
        { status: 401 }
      );
    }

    // 2. Read and validate the request body
    const body: unknown = await request.json();
    const validation = opportunitySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: validation.error.issues
            .map((issue) => issue.message)
            .join(", "),
        },
        { status: 400 }
      );
    }
 
    const {
      leadId,
      catalogType,
      catalogItemId,
      totalAmount,
      expectedMarginPct,
    } = validation.data;

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: { opportunity: true },
    });

    if (!lead) {
      return NextResponse.json(
        { error: "Lead not found." },
        { status: 404 }
      );
    }

    if (lead.opportunity) {
      return NextResponse.json(
        { error: "This lead has already been converted." },
        { status: 409 }
      );
    }

    const item = await prisma.catalogItem.findFirst({
      where: {
        id: catalogItemId,
        type: catalogType,
        active: true,
      },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Select an active item of the chosen type." },
        { status: 400 }
      );
    }

    const opportunity = await prisma.opportunity.create({
      data: {
        leadId,
        catalogItemId,
        totalAmount,
        expectedMarginPct,
      },
      include: {
        lead: true,
        catalogItem: true,
      },
    });

    return NextResponse.json(
      {
        message: "Opportunity created successfully.",
        opportunity,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Opportunity creation failed:", error);

    return NextResponse.json(
      { error: "Could not create the opportunity. Check the server terminal." },
      { status: 500 }
    );
  }
}
