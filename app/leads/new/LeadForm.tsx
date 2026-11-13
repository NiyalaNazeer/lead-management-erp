"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function NewLeadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const data = {
      personName: String(formData.get("personName") || ""),
      companyName: String(formData.get("companyName") || ""),
      mobileNumber: String(formData.get("mobileNumber") || ""),
      email: String(formData.get("email") || ""),
      requirement: String(formData.get("requirement") || ""),
      nextStep: String(formData.get("nextStep") || ""),
      warmth: String(formData.get("warmth") || ""),
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to save lead.");
      }

      setMessage("Lead saved successfully to the database!");
      form.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="lead-form-page">
      <div className="lead-form-heading">
        <h1>Add New Lead</h1>
        <p>Enter the potential customer's details and requirements.</p>
      </div>

      <section className="lead-form-card">
        <div className="lead-form-card-heading">
          <h2>Lead Information</h2>
          <p>Fields marked with * are required.</p>
        </div>

        {message && <div className="lead-alert lead-success" role="status">{message}</div>}
        {error && <div className="lead-alert lead-error" role="alert">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="lead-form-grid">
            <div className="lead-field">
              <label htmlFor="personName">Person Name</label>
              <input id="personName" name="personName" placeholder="Enter person's name" />
            </div>

            <div className="lead-field">
              <label htmlFor="companyName">Company Name</label>
              <input id="companyName" name="companyName" placeholder="Enter company name" />
            </div>

            <div className="lead-field">
              <label htmlFor="mobileNumber">Mobile Number <span>*</span></label>
              <input
                id="mobileNumber"
                name="mobileNumber"
                type="tel"
                placeholder="Enter mobile number"
                required
              />
            </div>

            <div className="lead-field">
              <label htmlFor="email">Email Address <span>*</span></label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="lead-field">
              <label htmlFor="nextStep">Next Step <span>*</span></label>
              <select id="nextStep" name="nextStep" defaultValue="" required>
                <option value="" disabled>Select next step</option>
                <option value="SEND_PRICING">Send Pricing</option>
                <option value="CALL_TOMORROW">Call Tomorrow</option>
                <option value="BOOK_MEETING">Book a Meeting</option>
                <option value="JUST_A_NOTE">Just a Note</option>
              </select>
            </div>

            <div className="lead-field">
              <label htmlFor="warmth">Lead Warmth <span>*</span></label>
              <select id="warmth" name="warmth" defaultValue="" required>
                <option value="" disabled>Select lead warmth</option>
                <option value="CURIOUS">Curious</option>
                <option value="INTERESTED">Interested</option>
                <option value="READY_NOW">Ready Now</option>
              </select>
            </div>

            <div className="lead-field lead-field-full">
              <label htmlFor="requirement">What They Need <span>*</span></label>
              <textarea
                id="requirement"
                name="requirement"
                placeholder="Describe the customer's needs, challenges, or requested services..."
                rows={5}
                required
              />
            </div>
          </div>

          <div className="lead-form-actions">
            <button type="button" className="lead-cancel-button" onClick={() => router.push("/leads")}>
              Cancel
            </button>
            <button type="submit" className="lead-submit-button" disabled={loading}>
              {loading ? "Saving..." : "Save Lead"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
