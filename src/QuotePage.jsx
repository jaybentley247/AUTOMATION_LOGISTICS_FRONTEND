import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import NavBar from "./NavBar";
import { API_BASE } from "./api";

const styles = `
  .qt-head .back-link { margin-bottom: 24px; }
  .qt-head .lead { margin-top: 14px; max-width: 620px; }

  .qt-form { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .qt-card { padding: clamp(20px, 3vw, 30px); }
  .qt-title { display: flex; align-items: center; gap: 12px; font-size: 1.15rem; margin-bottom: 22px; }
  .qt-step {
    width: 30px; height: 30px; flex-shrink: 0;
    border-radius: 50%;
    display: grid; place-items: center;
    background: var(--accent);
    color: #fff;
    font-family: var(--font-body);
    font-size: 0.85rem;
    font-weight: 700;
  }
  .qt-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .qt-fields .full { grid-column: 1 / -1; }
  .qt-dims { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
  .qt-dims .full { grid-column: 1 / -1; }

  .qt-services { display: grid; gap: 10px; }
  .qt-option {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius);
    cursor: pointer;
    transition: border-color 0.2s ease, background-color 0.2s ease;
  }
  .qt-option:hover { border-color: var(--accent); }
  .qt-option.selected { border-color: var(--accent); background: var(--accent-soft); }
  .qt-option input { position: absolute; opacity: 0; pointer-events: none; }
  .qt-option:focus-within { box-shadow: 0 0 0 3px var(--accent-soft); }
  .qt-radio {
    width: 18px; height: 18px; flex-shrink: 0;
    border-radius: 50%;
    border: 2px solid var(--border-strong);
    display: grid; place-items: center;
  }
  .qt-option.selected .qt-radio { border-color: var(--accent); }
  .qt-option.selected .qt-radio::after { content: ""; width: 8px; height: 8px; border-radius: 50%; background: var(--accent); }
  .qt-option-name { font-weight: 700; color: var(--text); }
  .qt-option-days { margin-left: auto; font-size: 0.85rem; color: var(--text-3); }

  .qt-submit { grid-column: 1 / -1; display: flex; flex-direction: column; align-items: flex-end; gap: 12px; }
  .qt-submit .btn { min-width: 260px; }

  .qt-success { max-width: 620px; margin: 0 auto; text-align: center; padding: clamp(36px, 6vw, 56px) clamp(20px, 4vw, 40px); }
  .qt-success .icon-tile { width: 68px; height: 68px; border-radius: 50%; margin: 0 auto 20px; }
  .qt-success h2 { font-size: clamp(1.5rem, 3vw, 1.9rem); margin-bottom: 10px; }
  .qt-success p { color: var(--text-2); }
  .qt-ref {
    display: inline-block;
    margin: 18px 0 22px;
    padding: 10px 22px;
    border-radius: var(--radius-sm);
    background: var(--accent-soft);
    color: var(--accent-text);
    font-size: 1.25rem;
    font-weight: 700;
    letter-spacing: 0.06em;
  }
  .qt-success .btn { margin-top: 26px; }

  @media (max-width: 900px) {
    .qt-form { grid-template-columns: 1fr; }
  }
  @media (max-width: 560px) {
    .qt-fields, .qt-dims { grid-template-columns: 1fr 1fr; }
    .qt-fields > .field { grid-column: 1 / -1; }
    .qt-submit .btn { width: 100%; min-width: 0; }
  }
`;

const serviceOptions = [
  { id: "economy", name: "Economy", days: "5–7 business days" },
  { id: "standard", name: "Standard", days: "3–5 business days" },
  { id: "express", name: "Express", days: "1–2 business days" },
];

export default function QuotePage() {
  const [form, setForm] = useState({
    fromName: "", fromAddress: "", fromCity: "", fromZip: "", fromPhone: "", fromEmail: "",
    toName: "", toAddress: "", toCity: "", toZip: "", toPhone: "", toEmail: "",
    weight: "", length: "", width: "", height: "",
    service: "standard",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [ref, setRef] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  // The backend saves the request, assigns the reference, and emails our team
  // and the sender. The page shows that same reference.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/quotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.id) throw new Error(data?.error || "Something went wrong. Please try again.");
      setRef(data.id);
      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch (err) {
      setError(
        err instanceof TypeError
          ? "We couldn't reach our server. Please check your connection and try again."
          : err.message,
      );
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <>
        <NavBar />
        <style>{styles}</style>
        <main className="section">
          <div className="container">
            <div className="card qt-success">
              <div className="icon-tile">
                <Check size={32} />
              </div>
              <h2>Quote Request Submitted!</h2>
              <p>We've received your shipment details. Your quote reference is:</p>
              <div className="qt-ref">{ref}</div>
              <p>Our team will contact you within 2 business hours to confirm pricing and arrange pickup.</p>
              <button className="btn btn-secondary" onClick={() => setSubmitted(false)}>
                Request Another Quote
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  const field = (key, label, props = {}, className = "") => (
    <label className={`field ${className}`}>
      <span className="label">{label}</span>
      <input className="input" value={form[key]} onChange={set(key)} {...props} />
    </label>
  );

  return (
    <>
      <NavBar />
      <style>{styles}</style>
      <main>
        <section className="page-head">
          <div className="container qt-head">
            <button className="back-link" onClick={() => window.history.back()}>
              <ArrowLeft size={16} /> Back to Home
            </button>
            <h1 className="display">Get a <span>Shipping Quote</span></h1>
            <p className="lead">Fill in your shipment details and we'll get back to you with the best rate.</p>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <form className="qt-form" onSubmit={handleSubmit}>
              <div className="card qt-card">
                <h2 className="qt-title"><span className="qt-step">1</span> Pickup Details</h2>
                <div className="qt-fields">
                  {field("fromName", "Full Name / Company", { placeholder: "e.g. Acme Corp", required: true }, "full")}
                  {field("fromAddress", "Street Address", { placeholder: "123 Main St", required: true }, "full")}
                  {field("fromCity", "City", { placeholder: "Boston", required: true })}
                  {field("fromZip", "ZIP / Postal Code", { placeholder: "02101", required: true })}
                  {field("fromPhone", "Phone Number", { placeholder: "+1 (555) 000-0000", required: true })}
                  {field("fromEmail", "Email Address", { type: "email", placeholder: "email@example.com", required: true })}
                </div>
              </div>

              <div className="card qt-card">
                <h2 className="qt-title"><span className="qt-step">2</span> Delivery Details</h2>
                <div className="qt-fields">
                  {field("toName", "Recipient Name / Company", { placeholder: "e.g. John Smith", required: true }, "full")}
                  {field("toAddress", "Street Address", { placeholder: "456 Oak Ave", required: true }, "full")}
                  {field("toCity", "City", { placeholder: "New York", required: true })}
                  {field("toZip", "ZIP / Postal Code", { placeholder: "10001", required: true })}
                  {field("toPhone", "Recipient Phone Number", { placeholder: "+1 (555) 000-0000", required: true })}
                  {field("toEmail", "Recipient Email Address", { type: "email", placeholder: "recipient@example.com", required: true })}
                </div>
              </div>

              <div className="card qt-card">
                <h2 className="qt-title"><span className="qt-step">3</span> Package Details</h2>
                <div className="qt-dims">
                  {field("weight", "Weight (kg)", { type: "number", min: "0.1", step: "0.1", placeholder: "2.5", required: true })}
                  {field("length", "Length (cm)", { type: "number", min: "1", placeholder: "30" })}
                  {field("width", "Width (cm)", { type: "number", min: "1", placeholder: "20" })}
                  {field("height", "Height (cm)", { type: "number", min: "1", placeholder: "15" })}
                  {field("notes", "Notes (optional)", { placeholder: "Fragile, keep upright, etc." }, "full")}
                </div>
              </div>

              <div className="card qt-card">
                <h2 className="qt-title"><span className="qt-step">4</span> Choose Service</h2>
                <div className="qt-services">
                  {serviceOptions.map((s) => (
                    <label key={s.id} className={`qt-option${form.service === s.id ? " selected" : ""}`}>
                      <input
                        type="radio"
                        name="service"
                        value={s.id}
                        checked={form.service === s.id}
                        onChange={set("service")}
                      />
                      <span className="qt-radio" aria-hidden="true" />
                      <span className="qt-option-name">{s.name}</span>
                      <span className="qt-option-days">{s.days}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="qt-submit">
                {error && <div className="form-error" role="alert">{error}</div>}
                <button type="submit" className="btn btn-primary btn-lg" disabled={sending}>
                  {sending ? "Submitting..." : "Submit Quote Request"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}
