
import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import * as readline from "node:readline/promises";
import { stdin, stdout } from "node:process";

const prisma = new PrismaClient();
const rl = readline.createInterface({ input: stdin, output: stdout });

async function main() {
  const name = (await rl.question("Enter user name: ")).trim();
  const email = (
    await rl.question("Enter user email: ")
  ).trim().toLowerCase();
  const password = await rl.question("Enter a password (12–72 characters): ");

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Enter a valid name and email.");
  }

  if (password.length < 12 || password.length > 72) {
    throw new Error("Password must contain 12–72 characters.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {
      name,
      passwordHash,
      role: UserRole.USER,
    },
    create: {
      name,
      email,
      passwordHash,
      role: UserRole.USER,
    },
  });

  console.log(`Regular user account is ready for ${email}.`);
}

main()
  .catch((error) => {
    console.error("Could not create user:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    rl.close();
    await prisma.$disconnect();
  });
