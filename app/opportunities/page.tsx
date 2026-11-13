import { getSessionUser } from "../../lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "../../lib/prisma";

export const dynamic = "force-dynamic";

export default async function OpportunitiesPage() {
  // 1. Check whether the user is logged in
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  // 2. Fetch opportunities only after authentication
  const opportunities = await prisma.opportunity.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      lead: true,
      catalogItem: true,
    },
  });

  // 3. Display opportunities
  return (
    <main>
      <h1 className="page-title">Opportunities</h1>
      <p className="page-description">
        View and track sales opportunities created from your leads.
      </p>

      <section className="panel">
        {opportunities.length === 0 ? (
          <div className="empty-state">
            <h3>No opportunities yet</h3>
            <p>
              Open a lead and select Convert to Opportunity to create your first
              opportunity.
            </p>
            <Link href="/leads" className="btn">
              View Leads
            </Link>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Lead</th>
                  <th>Company</th>
                  <th>Type</th>
                  <th>Product / Service</th>
                  <th>Total Amount</th>
                  <th>Expected Margin</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {opportunities.map((opportunity) => (
                  <tr key={opportunity.id}>
                    <td>
                      <Link href={`/leads/${opportunity.lead.id}`}>
                        {opportunity.lead.personName ||
                          opportunity.lead.email}
                      </Link>
                    </td>
                    <td>
                      {opportunity.lead.companyName || "Not provided"}
                    </td>
                    <td>{opportunity.catalogItem.type}</td>
                    <td>{opportunity.catalogItem.name}</td>
                    <td>
                      {Number(opportunity.totalAmount).toLocaleString(
                        "en-IN",
                        {
                          style: "currency",
                          currency: "INR",
                          maximumFractionDigits: 2,
                        }
                      )}
                    </td>
                    <td>
                      {Number(opportunity.expectedMarginPct).toFixed(2)}%
                    </td>
                    <td>
                      {opportunity.createdAt.toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}