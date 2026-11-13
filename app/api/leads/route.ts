
import { getSessionUser } from "../../../lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../lib/prisma";

const leadSchema = z.object({
  personName: z.string().optional(),
  companyName: z.string().optional(),
  mobileNumber: z.string().trim().min(1, "Mobile number is required"),
  email: z.string().trim().email("Enter a valid email address"),
  requirement: z.string().trim().min(1, "Requirement is required"),
  nextStep: z.enum([
    "SEND_PRICING",
    "CALL_TOMORROW",
    "BOOK_MEETING",
    "JUST_A_NOTE",
  ]),
  warmth: z.enum(["CURIOUS", "INTERESTED", "READY_NOW"]),
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
    const validation = leadSchema.safeParse(body);

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

    // 3. Save the lead to PostgreSQL
    const lead = await prisma.lead.create({
      data: {
        ...validation.data,
        personName: validation.data.personName ?? null,
        companyName: validation.data.companyName ?? null,
      },
    });

    // 4. Return success
    return NextResponse.json(
      { message: "Lead saved successfully", lead },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to save lead:", error);

    return NextResponse.json(
      { error: "Could not save the lead. Check the server terminal." },
      { status: 500 }
    );
  }
}
