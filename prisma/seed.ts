
import { PrismaClient, CatalogType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const products = [
    "Mobile App Protection",
    "MDM",
    "GRC Automation",
    "EDR",
  ];

  const services = [
    "VAPT",
    "IT GRC",
    "QA",
    "DFIR",
    "SOC Managed Service",
    "Brand Monitoring Managed Service",
  ];

  for (const name of products) {
    await prisma.catalogItem.upsert({
      where: {
        name_type: {
          name,
          type: CatalogType.PRODUCT,
        },
      },
      update: {},
      create: {
        name,
        type: CatalogType.PRODUCT,
      },
    });
  }

  for (const name of services) {
    await prisma.catalogItem.upsert({
      where: {
        name_type: {
          name,
          type: CatalogType.SERVICE,
        },
      },
      update: {},
      create: {
        name,
        type: CatalogType.SERVICE,
      },
    });
  }

  console.log("Products and services added successfully!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
