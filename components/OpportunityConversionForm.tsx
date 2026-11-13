
"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type CatalogItem = {
  id: string;
  name: string;
  type: "PRODUCT" | "SERVICE";
};

type Props = {
  leadId: string;
  leadName: string;
  items: CatalogItem[];
};

export default function OpportunityConversionForm({
  leadId,
  leadName,
  items,
}: Props) {
  const router = useRouter();
  const [catalogType, setCatalogType] = useState<"PRODUCT" | "SERVICE">("PRODUCT");
  const [catalogItemId, setCatalogItemId] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [margin, setMargin] = useState("20");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filteredItems = useMemo(
    () => items.filter((item) => item.type === catalogType),
    [items, catalogType]
  );

  const selectedItemExists = filteredItems.some(
    (item) => item.id === catalogItemId
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!catalogItemId || !selectedItemExists) {
      setError("Please select an available product or service.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId,
          catalogType,
          catalogItemId,
          totalAmount,
          expectedMarginPct: margin,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to create opportunity.");
      }

      router.push("/opportunities");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel">
      <h2>Opportunity Information</h2>
      <p className="page-description">
        Converting lead: <strong>{leadName}</strong>
      </p>

      {error && (
        <p role="alert" style={{ color: "#b91c1c", marginBottom: 16 }}>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="lead-form-grid">
          <div className="lead-field">
            <label htmlFor="catalogType">Type *</label>
            <select
              id="catalogType"
              value={catalogType}
              onChange={(event) => {
                setCatalogType(event.target.value as "PRODUCT" | "SERVICE");
                setCatalogItemId("");
              }}
              required
            >
              <option value="PRODUCT">Products</option>
              <option value="SERVICE">Services</option>
            </select>
          </div>

          <div className="lead-field">
            <label htmlFor="catalogItemId">Product / Service *</label>
            <select
              id="catalogItemId"
              value={catalogItemId}
              onChange={(event) => setCatalogItemId(event.target.value)}
              required
            >
              <option value="">Select an item</option>
              {filteredItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            {filteredItems.length === 0 && (
              <small>No active items found for this type.</small>
            )}
          </div>

          <div className="lead-field">
            <label htmlFor="totalAmount">Total Amount *</label>
            <input
              id="totalAmount"
              type="number"
              min="0.01"
              step="0.01"
              value={totalAmount}
              onChange={(event) => setTotalAmount(event.target.value)}
              placeholder="Enter total amount"
              required
            />
          </div>

          <div className="lead-field">
            <label htmlFor="margin">Expected Margin (%) *</label>
            <input
              id="margin"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={margin}
              onChange={(event) => setMargin(event.target.value)}
              required
            />
            <small>For example, enter 20 for a 20% expected margin.</small>
          </div>
        </div>

        <div className="lead-form-actions">
          <button
            type="button"
            className="lead-cancel-button"
            onClick={() => router.push(`/leads/${leadId}`)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="lead-submit-button"
            disabled={loading || filteredItems.length === 0}
          >
            {loading ? "Saving..." : "Create Opportunity"}
          </button>
        </div>
      </form>
    </section>
  );
}
