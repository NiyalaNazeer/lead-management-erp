"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogout() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Logout failed.");
      }

      router.replace("/login");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to log out."
      );
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "6px 8px", width: "fit-content" }}>
      <button
        type="button"
        onClick={handleLogout}
        disabled={loading}
        style={{
          width: "fit-content",
          boxSizing: "border-box",
          padding: "6px 12px",
          border: "1px solid #d1d5db",
          borderRadius: "8px",
          background: "transparent",
          color: "inherit",
          cursor: loading ? "wait" : "pointer",
          textAlign: "center",
          fontSize: "15px",
          fontWeight: 500,
        }}
      >
        {loading ? "Logging out..." : "Logout"}
      </button>

      {error && (
        <p role="alert" style={{ color: "crimson", fontSize: 13 }}>
          {error}
        </p>
      )}
    </div>
  );
}