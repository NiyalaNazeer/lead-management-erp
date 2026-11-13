
import { NextResponse } from "next/server";
import { getSessionUser } from "../../../lib/auth";
import { z } from "zod";
import { prisma } from "../../../lib/prisma";

const catalogSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  type: z.enum(["PRODUCT", "SERVICE"]),
  description: z.string().trim().max(500).optional(),
});

// GET: Retrieve catalog items (Admin only)
export async function GET() {
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

    const items = await prisma.catalogItem.findMany({
      orderBy: [
        { type: "asc" },
        { name: "asc" },
      ],
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Catalog retrieval failed:", error);

    return NextResponse.json(
      { error: "Could not retrieve catalog items." },
      { status: 500 }
    );
  }
}

// POST: Add a catalog item (Admin only)
export async function POST(request: Request) {
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

    const body: unknown = await request.json();
    const validation = catalogSchema.safeParse(body);

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

    const { name, type, description } = validation.data;

    const item = await prisma.catalogItem.create({
      data: {
        name,
        type,
        description: description || null,
      },
    });

    return NextResponse.json(
      {
        message: "Catalog item added successfully.",
        item,
      },
      { status: 201 }
    );
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          error:
            "An item with this name and type already exists.",
        },
        { status: 409 }
      );
    }

    console.error("Catalog creation failed:", error);

    return NextResponse.json(
      { error: "Could not add catalog item." },
      { status: 500 }
    );
  }
}

