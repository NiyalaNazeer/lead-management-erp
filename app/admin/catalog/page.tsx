import { getSessionUser } from "../../../lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import CatalogManager from "../../../components/CatalogManager";

export const dynamic = "force-dynamic";

export default async function CatalogAdminPage() {
  // 1. Check whether the user is logged in
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  // 2. Allow only administrators
  if (user.role !== "ADMIN") {
    redirect("/");
  }

  // 3. Fetch catalog items
  const items = await prisma.catalogItem.findMany({
    orderBy: [{ type: "asc" }, { name: "asc" }],
  });

  // 4. Prepare items for the CatalogManager component
  const initialItems = items.map((item) => ({
    id: item.id,
    name: item.name,
    type: item.type,
    description: item.description,
    active: item.active,
  }));

  // 5. Render the administration page
  return (
    <main>
      <h1 className="page-title">
        Product &amp; Service Administration
      </h1>

      <p className="page-description">
        Add, edit, activate, and deactivate the products and services
        available for opportunity conversion.
      </p>

      <CatalogManager initialItems={initialItems} />
    </main>
  );
}
