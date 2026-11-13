import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import OpportunityConversionForm from "../../../../components/OpportunityConversionForm";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ConvertLeadPage({ params }: PageProps) {
  // 1. Check whether the user is logged in
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  // 2. Get the lead ID
  const { id } = await params;

  // 3. Fetch the lead
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: { opportunity: true },
  });

  if (!lead) {
    notFound();
  }

  // 4. Prevent converting the same lead twice
  if (lead.opportunity) {
    redirect("/opportunities");
  }

  // 5. Fetch active products and services
  const items = await prisma.catalogItem.findMany({
    where: { active: true },
    orderBy: [{ type: "asc" }, { name: "asc" }],
    select: { id: true, name: true, type: true },
  });

  // 6. Render the conversion page
  return (
    <main>
      <h1 className="page-title">Convert Lead to Opportunity</h1>

      <p className="page-description">
        Create a sales opportunity from this lead.
      </p>

      <div style={{ marginBottom: 20 }}>
        <Link href={`/leads/${id}`} className="btn">
          Back to Lead Details
        </Link>
      </div>

      <OpportunityConversionForm
        leadId={lead.id}
        leadName={lead.personName || lead.companyName || lead.email}
        items={items}
      />
    </main>
  );
}