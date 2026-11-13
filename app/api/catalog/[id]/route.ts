import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../lib/prisma";
import { getSessionUser } from "../../../../lib/auth";

const updateCatalogSchema = z
  .object({
    name: z.string().trim().min(2).max(100).optional(),
    type: z.enum(["PRODUCT", "SERVICE"]).optional(),
    description: z.string().trim().max(1000).nullable().optional(),
    active: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please log in." },
        { status: 401 }
      );
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body: unknown = await request.json();
    const validation = updateCatalogSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid catalog details." },
        { status: 400 }
      );
    }
const data = validation.data;

const updatedItem = await prisma.catalogItem.update({
  where: { id },
  data: {
    ...(data.name !== undefined && { name: data.name }),
    ...(data.type !== undefined && { type: data.type }),
    ...(data.description !== undefined && {
      description: data.description,
    }),
    ...(data.active !== undefined && { active: data.active }),
  },
});

    return NextResponse.json(updatedItem);
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Catalog item not found." },
        { status: 404 }
      );
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "An item with this name and type already exists." },
        { status: 409 }
      );
    }

    console.error("Catalog update failed:", error);

    return NextResponse.json(
      { error: "Could not update catalog item." },
      { status: 500 }
    );
  }
}
