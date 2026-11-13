import { getSessionUser } from "../../lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "../../lib/prisma";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  // 1. Check whether the user is logged in
  const user = await getSessionUser();

  // 2. Redirect logged-out users to the login page
  if (!user) {
    redirect("/login");
  }

  // 3. Fetch leads only after authentication
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: { opportunity: true },
  });

  return (
    <>
      <h2 className="page-title">Leads</h2>

      <p className="page-description">
        View and manage potential customers and their requirements.
      </p>

      <div className="panel">
        <div className="quick-actions">
          <Link href="/leads/new" className="btn">
            + Add New Lead
          </Link>
        </div>

        {leads.length === 0 ? (
          <div className="empty-state">
            <h3>No leads yet</h3>
            <p>Create your first lead to get started.</p>
          </div>
        ) : (
          <div className="table-wrap" style={{ marginTop: 20 }}>
            <table>
              <thead>
                <tr>
                  <th>Person</th>
                  <th>Company</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Lead Warmth</th>
                  <th>Created</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <Link href={`/leads/${lead.id}`}>
                        {lead.personName || "Not provided"}
                      </Link>
                    </td>
                    <td>{lead.companyName || "Not provided"}</td>
                    <td>{lead.email}</td>
                    <td>{lead.mobileNumber}</td>
                    <td>{lead.warmth.replaceAll("_", " ")}</td>
                    <td>{lead.createdAt.toLocaleDateString()}</td>
                    <td>
                      {lead.opportunity ? "Converted" : "New Lead"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}