
import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/prisma";
import { createSession } from "../../../../lib/auth";

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1).max(200),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Enter a valid email and password." },
        { status: 400 }
      );
    }

    const email = validation.data.email.toLowerCase();
    const password = validation.data.password;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatches) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    await createSession({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      message: "Login successful.",
      role: user.role,
    });
  } catch (error) {
    console.error("Login failed:", error);

    return NextResponse.json(
      { error: "Login failed. Check the server terminal." },
      { status: 500 }
    );
  }
}
