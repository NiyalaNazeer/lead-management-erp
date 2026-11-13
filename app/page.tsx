
import Link from "next/link";
import { prisma } from "../lib/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [leadCount, opportunityCount, catalogCount, recentLeads] =
    await Promise.all([
      prisma.lead.count(),
      prisma.opportunity.count(),
      prisma.catalogItem.count({ where: { active: true } }),
      prisma.lead.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { opportunity: true },
      }),
    ]);

  return (
    <>
      <h2 className="page-title">Dashboard</h2>
      <p className="page-description">
        Welcome to LeadFlow. Track leads, manage opportunities, and maintain
        your product and service catalog.
      </p>

      <div className="stats-grid">
        <section className="stat-card">
          <span className="stat-label">Total Leads</span>
          <p className="stat-value">{leadCount}</p>
          <span className="stat-note">Leads saved in the database</span>
        </section>

        <section className="stat-card">
          <span className="stat-label">Opportunities</span>
          <p className="stat-value">{opportunityCount}</p>
          <span className="stat-note">Leads converted to opportunities</span>
        </section>

        <section className="stat-card">
          <span className="stat-label">Active Catalog Items</span>
          <p className="stat-value">{catalogCount}</p>
          <span className="stat-note">Available products and services</span>
        </section>
      </div>

      <section className="panel">
        <h3 className="section-heading">Quick Actions</h3>
        <div className="quick-actions">
          <Link className="btn" href="/leads/new">
            + Add New Lead
          </Link>
          <Link className="btn btn-secondary" href="/leads">
            View Leads
          </Link>
          <Link className="btn btn-secondary" href="/opportunities">
            View Opportunities
          </Link>
          <Link className="btn btn-secondary" href="/admin/catalog">
            Manage Catalog
          </Link>
        </div>
      </section>

      <section className="panel" style={{ marginTop: 22 }}>
        <h3 className="section-heading">Recent Leads</h3>
        {recentLeads.length === 0 ? (
          <div className="empty-state">
            <p>No leads have been added yet.</p>
            <p>Use “Add New Lead” to create your first record.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Person</th>
                  <th>Company</th>
                  <th>Email</th>
                  <th>Created</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td>{lead.personName || "Not provided"}</td>
                    <td>{lead.companyName || "Not provided"}</td>
                    <td>{lead.email}</td>
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
      </section>
    </>
  );
}
