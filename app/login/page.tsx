
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Login failed.");
      }

      router.replace(
        result.role === "ADMIN" ? "/admin/catalog" : "/"
      );
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to log in."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{
      maxWidth: 440,
      margin: "60px auto",
      padding: 24,
    }}>
      <section className="panel">
        <h1 className="page-title">LeadFlow Login</h1>
        <p className="page-description">
          Sign in to access your account.
        </p>

        {error && (
          <p role="alert" style={{ color: "crimson" }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="lead-field" style={{ marginBottom: 18 }}>
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="lead-field" style={{ marginBottom: 22 }}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="lead-submit-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p style={{ marginTop: 20 }}>
          <Link href="/">Back to Dashboard</Link>
        </p>
      </section>
    </main>
  );
}
