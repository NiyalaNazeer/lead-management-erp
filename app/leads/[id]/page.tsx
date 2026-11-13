 
import { getSessionUser } from "../../../lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "../../../lib/prisma";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function LeadDetailsPage({ params }: PageProps) {
  // 1. Check whether the user is logged in
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  // 2. Get the lead ID
  const { id } = await params;

  // 3. Fetch the lead from the database
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: { opportunity: true },
  });

  // 4. Show 404 if the lead does not exist
  if (!lead) {
    notFound();
  }

  // 5. Format labels for display
  const formatLabel = (value: string) =>
    value
      .split("_")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ");

  return (
    <main>
      <div className="page-header">
        <div>
          <h1 className="page-title">Lead Details</h1>
          <p className="page-description">
            View the contact information and requirements for this lead.
          </p>
        </div>
      </div>

      <section className="panel">
        <div className="quick-actions">
          <Link href="/leads" className="btn">
            Back to Leads
          </Link>
        </div>

        <h2 style={{ marginTop: 24 }}>
          {lead.personName || "Unnamed Contact"}
        </h2>

        <p className="page-description">
          {lead.companyName || "Company not provided"}
        </p>

        <div className="lead-details-grid">
          <div>
            <span className="detail-label">Mobile Number</span>
            <p>{lead.mobileNumber}</p>
          </div>

          <div>
            <span className="detail-label">Email Address</span>
            <p>{lead.email}</p>
          </div>

          <div>
            <span className="detail-label">Lead Warmth</span>
            <p>{formatLabel(lead.warmth)}</p>
          </div>

          <div>
            <span className="detail-label">Next Step</span>
            <p>{formatLabel(lead.nextStep)}</p>
          </div>

          <div>
            <span className="detail-label">Created On</span>
            <p>{lead.createdAt.toLocaleString()}</p>
          </div>

          <div>
            <span className="detail-label">Conversion Status</span>
            <p>
              {lead.opportunity ? "Converted" : "Not Converted"}
            </p>
          </div>

          <div className="detail-requirement">
            <span className="detail-label">What They Need</span>
            <p>{lead.requirement}</p>
          </div>
        </div>

        <div style={{ marginTop: 28 }}>
          {lead.opportunity ? (
            <p>
              This lead has already been converted to an opportunity.
            </p>
          ) : (
            <Link
              href={`/leads/${lead.id}/convert`}
              className="btn"
            >
              Convert to Opportunity
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
 