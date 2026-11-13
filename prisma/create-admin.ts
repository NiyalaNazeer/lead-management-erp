
import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import * as readline from "node:readline/promises";
import { stdin, stdout } from "node:process";

const prisma = new PrismaClient();
const rl = readline.createInterface({ input: stdin, output: stdout });

async function main() {
  const email = (
    await rl.question("Enter administrator email: ")
  ).trim().toLowerCase();

  const password = await rl.question(
    "Enter a strong administrator password: "
  );

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Enter a valid email address.");
  }

  if (password.length < 12 || password.length > 72) {
    throw new Error(
      "Password must contain 12 to 72 characters for this setup."
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: UserRole.ADMIN,
    },
    create: {
      name: "Administrator",
      email,
      passwordHash,
      role: UserRole.ADMIN,
    },
  });

  console.log(`Administrator account is ready for ${user.email}.`);
}

main()
  .catch((error) => {
    console.error("Could not create administrator:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    rl.close();
    await prisma.$disconnect();
  });
