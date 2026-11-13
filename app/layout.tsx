
import { getSessionUser } from "../lib/auth";
import LogoutButton from "../components/LogoutButton";
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lead Management ERP",
  description: "Lead and opportunity management system",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSessionUser();

  return (
    <html lang="en">
      <body>
        {user ? (
          <div className="app-shell">
            <aside className="sidebar">
              <div className="brand">
                <div className="brand-icon">L</div>
                <div>
                  <h2>LeadFlow</h2>
                  <p>Management ERP</p>
                </div>
              </div>

              <p className="nav-heading">WORKSPACE</p>

              <nav className="navigation">
                <Link href="/" className="nav-link">
                  <span>▦</span> Dashboard
                </Link>

                <Link href="/leads" className="nav-link">
                  <span>♙</span> Leads
                </Link>

                <Link href="/opportunities" className="nav-link">
                  <span>◇</span> Opportunities
                </Link>

                {user.role === "ADMIN" && (
                  <Link href="/admin/catalog" className="nav-link">
                    <span>▤</span> Products & Services
                  </Link>
                )}
              </nav>

<div className="sidebar-footer">
  <div className="status-dot" />
  PostgreSQL connected
</div>

<div
  style={{
    padding: "8px 12px",
    borderTop: "1px solid #e5e7eb",
    marginTop: 8,
  }}
>
  <div
    style={{
      fontSize: 12,
      marginBottom: 6,
      overflowWrap: "anywhere",
    }}
  >
    {user.email}
  </div>
  <LogoutButton />
</div>

            </aside>

            <main className="main-content">
              <header className="topbar">
                <div>
                  <p className="eyebrow">BUSINESS MANAGEMENT</p>
                  <h1>Lead Management System</h1>
                </div>

                <div className="profile">
                  <div className="avatar">
                    {user.role === "ADMIN" ? "A" : "U"}
                  </div>
                  <div>
                    <strong>
                      {user.role === "ADMIN" ? "Administrator" : "User"}
                    </strong>
                    <p>Workspace</p>
                  </div>
                </div>
              </header>

              <div className="page-content">{children}</div>
            </main>
          </div>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
