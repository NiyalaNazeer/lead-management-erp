
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type CatalogItem = {
  id: string;
  name: string;
  type: "PRODUCT" | "SERVICE";
  description: string | null;
  active: boolean;
};

export default function CatalogManager({
  initialItems,
}: {
  initialItems: CatalogItem[];
}) {
  const router = useRouter();

  const [items, setItems] = useState(initialItems);
  const [name, setName] = useState("");
  const [type, setType] = useState<"PRODUCT" | "SERVICE">("PRODUCT");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("ALL");

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const url = editingId
        ? `/api/catalog/${editingId}`
        : "/api/catalog";

      const response = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          type,
          description,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong.");
      }

      if (editingId) {
        setItems((old) =>
          old.map((item) =>
            item.id === editingId ? result.item : item
          )
        );
        setMessage("Catalog item updated successfully.");
      } else {
        setItems((old) => [...old, result.item]);
        setMessage("Catalog item added successfully.");
      }

      resetForm();
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Request failed."
      );
    } finally {
      setLoading(false);
    }
  }

  function startEdit(item: CatalogItem) {
    setEditingId(item.id);
    setName(item.name);
    setType(item.type);
    setDescription(item.description || "");
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setName("");
    setType("PRODUCT");
    setDescription("");
  }

  async function toggleActive(item: CatalogItem) {
    setMessage("");
    setError("");

    try {
      const response = await fetch(`/api/catalog/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !item.active }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not update status.");
      }

      setItems((old) =>
        old.map((current) =>
          current.id === item.id ? result.item : current
        )
      );

      setMessage(
        `${item.name} is now ${result.item.active ? "active" : "inactive"}.`
      );
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Request failed."
      );
    }
  }

  const visibleItems = items.filter(
    (item) => filter === "ALL" || item.type === filter
  );

  return (
    <div>
      <section className="panel" style={{ marginBottom: 24 }}>
        <h2>{editingId ? "Edit Catalog Item" : "Add Product or Service"}</h2>

        {message && (
          <p role="status" style={{ color: "green" }}>{message}</p>
        )}

        {error && (
          <p role="alert" style={{ color: "crimson" }}>{error}</p>
        )}

        <form onSubmit={submitForm}>
          <div className="lead-form-grid">
            <div className="lead-field">
              <label htmlFor="catalog-name">Name *</label>
              <input
                id="catalog-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                maxLength={100}
                placeholder="Enter product or service name"
              />
            </div>

            <div className="lead-field">
              <label htmlFor="catalog-type">Type *</label>
              <select
                id="catalog-type"
                value={type}
                onChange={(event) =>
                  setType(event.target.value as "PRODUCT" | "SERVICE")
                }
                disabled={Boolean(editingId)}
              >
                <option value="PRODUCT">Product</option>
                <option value="SERVICE">Service</option>
              </select>
            </div>

            <div className="lead-field" style={{ gridColumn: "1 / -1" }}>
              <label htmlFor="catalog-description">Description</label>
              <textarea
                id="catalog-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                maxLength={500}
                rows={3}
                placeholder="Optional description"
              />
            </div>
          </div>

          <div className="lead-form-actions">
            <button
              type="submit"
              disabled={loading}
              className="lead-submit-button"
            >
              {loading
                ? "Saving..."
                : editingId
                  ? "Save Changes"
                  : "Add Item"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="lead-cancel-button"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="panel">
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 20,
        }}>
          <h2>Products &amp; Services</h2>

          <select
            aria-label="Filter catalog by type"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="ALL">All Items</option>
            <option value="PRODUCT">Products</option>
            <option value="SERVICE">Services</option>
          </select>
        </div>

        {visibleItems.length === 0 ? (
          <p>No catalog items found.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {visibleItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.type === "PRODUCT" ? "Product" : "Service"}</td>
                    <td>{item.description || "—"}</td>
                    <td>
                      <span style={{
                        color: item.active ? "green" : "crimson",
                        fontWeight: 600,
                      }}>
                        {item.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 8,
                      }}>
                        <button
                          type="button"
                          onClick={() => startEdit(item)}
                          className="lead-cancel-button"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleActive(item)}
                          className="lead-cancel-button"
                        >
                          {item.active ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
