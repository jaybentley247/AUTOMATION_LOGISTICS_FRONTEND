import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Mail, MapPin } from "lucide-react";
import NavBar from "./NavBar";
import { API_BASE } from "./api";

const styles = `
  .ct-head { display: grid; grid-template-columns: 1fr 1.1fr; gap: clamp(28px, 5vw, 64px); align-items: center; }
  .ct-head .back-link { margin-bottom: 24px; }
  .ct-head .lead { margin-top: 16px; }
  .ct-photo { border-radius: var(--radius-lg); overflow: hidden; aspect-ratio: 16 / 10; }
  .ct-photo img { width: 100%; height: 100%; object-fit: cover; }

  .ct-layout { display: grid; grid-template-columns: 1.6fr 1fr; gap: 24px; align-items: start; }

  .ct-form { padding: clamp(22px, 4vw, 36px); }
  .ct-form h2 { font-size: 1.5rem; margin-bottom: 24px; }
  .ct-form form { display: grid; gap: 16px; }
  .ct-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

  .ct-side { display: grid; gap: 16px; position: sticky; top: 96px; }
  .ct-box { padding: 24px; }
  .ct-box h2 { font-size: 1.1rem; margin-bottom: 18px; }
  .ct-item { display: flex; gap: 14px; align-items: flex-start; }
  .ct-item + .ct-item { margin-top: 16px; }
  .ct-item .icon-tile { width: 40px; height: 40px; border-radius: 12px; }
  .ct-item-label { display: block; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-3); }
  .ct-item-value { font-weight: 600; color: var(--text); }

  .ct-hours { display: grid; }
  .ct-hours div { display: flex; justify-content: space-between; gap: 12px; padding: 10px 0; font-size: 0.93rem; border-bottom: 1px solid var(--border); }
  .ct-hours div:last-child { border-bottom: 0; padding-bottom: 0; }
  .ct-hours span:first-child { color: var(--text-2); }
  .ct-hours span:last-child { font-weight: 600; }
  .ct-hours .closed { color: var(--text-3); }

  .ct-quote { padding: 24px; border-radius: var(--radius-lg); background: var(--accent); color: #fff; }
  .ct-quote h3 { color: #fff; font-size: 1.1rem; margin-bottom: 8px; }
  .ct-quote p { color: rgba(255,255,255,0.86); font-size: 0.93rem; margin-bottom: 18px; }
  .ct-quote .btn { background: #fff; color: #b91c1c; }
  .ct-quote .btn:hover { background: #fef2f2; }

  .ct-success { text-align: center; padding: 32px 8px; animation: ct-fade 0.3s ease; }
  .ct-success .icon-tile { width: 64px; height: 64px; border-radius: 50%; margin: 0 auto 18px; }
  .ct-success h3 { font-size: 1.5rem; margin-bottom: 8px; }
  .ct-success p { color: var(--text-2); margin-bottom: 24px; }
  @keyframes ct-fade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

  @media (max-width: 900px) {
    .ct-head, .ct-layout { grid-template-columns: 1fr; }
    .ct-side { position: static; }
  }
  @media (max-width: 560px) {
    .ct-row { grid-template-columns: 1fr; }
  }
`;

const topics = [
  "General Inquiry",
  "Get a Quote",
  "Track a Shipment",
  "Billing & Invoices",
  "Complaint / Issue",
  "Partnership",
  "Other",
];

export default function ContactPage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", topic: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  // The backend saves the message and emails our team and the sender.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Something went wrong. Please try again.");
      setSubmitted(true);
      setForm({ firstName: "", lastName: "", email: "", phone: "", topic: "", message: "" });
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

  return (
    <>
      <NavBar />
      <style>{styles}</style>
      <main>
        <section className="page-head">
          <div className="container ct-head">
            <div>
              <button className="back-link" onClick={() => window.history.back()}>
                <ArrowLeft size={16} /> Back to Home
              </button>
              <h1 className="display">
                Get in <span>Touch</span>
              </h1>
              <p className="lead">
                We're here to help. Reach out and our team will respond within 2
                business hours.
              </p>
            </div>
            <div className="ct-photo">
              <img
                src="https://www.image2url.com/r2/default/images/1779534829460-4f0aadf0-8b86-40c1-82be-c67cd8876852.jpg"
                alt="AUTOMATION LOGISTICS Customer Support Center"
              />
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container ct-layout">
            <div className="card ct-form">
              {submitted ? (
                <div className="ct-success">
                  <div className="icon-tile">
                    <Check size={28} />
                  </div>
                  <h3>Message Sent!</h3>
                  <p>
                    Thanks for reaching out. A member of our team will get back to
                    you within 2 business hours.
                  </p>
                  <button className="btn btn-secondary" onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h2>Send Us a Message</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="ct-row">
                      <label className="field">
                        <span className="label">First Name</span>
                        <input className="input" placeholder="John" value={form.firstName} onChange={set("firstName")} required />
                      </label>
                      <label className="field">
                        <span className="label">Last Name</span>
                        <input className="input" placeholder="Smith" value={form.lastName} onChange={set("lastName")} required />
                      </label>
                    </div>
                    <div className="ct-row">
                      <label className="field">
                        <span className="label">Email Address</span>
                        <input className="input" type="email" placeholder="john@example.com" value={form.email} onChange={set("email")} required />
                      </label>
                      <label className="field">
                        <span className="label">Phone (optional)</span>
                        <input className="input" type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={set("phone")} />
                      </label>
                    </div>
                    <label className="field">
                      <span className="label">Topic</span>
                      <select className="input" value={form.topic} onChange={set("topic")} required>
                        <option value="">Select a topic...</option>
                        {topics.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </label>
                    <label className="field">
                      <span className="label">Message</span>
                      <textarea className="input" placeholder="Tell us how we can help..." value={form.message} onChange={set("message")} required />
                    </label>
                    {error && <div className="form-error" role="alert">{error}</div>}
                    <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={sending}>
                      {sending ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                </>
              )}
            </div>

            <aside className="ct-side">
              <div className="card ct-box">
                <h2>Contact Information</h2>
                <div className="ct-item">
                  <span className="icon-tile"><Mail size={18} /></span>
                  <span>
                    <span className="ct-item-label">Email</span>
                    <span className="ct-item-value">info@automationlogistics.com</span>
                  </span>
                </div>
                <div className="ct-item">
                  <span className="icon-tile"><MapPin size={18} /></span>
                  <span>
                    <span className="ct-item-label">Address</span>
                    <span className="ct-item-value">56039 Nehalem Hwy S, Vernonia, OR 97064</span>
                  </span>
                </div>
              </div>

              <div className="card ct-box">
                <h2>Business Hours</h2>
                <div className="ct-hours">
                  {[
                    { day: "Monday – Friday", time: "8:00 AM – 7:00 PM" },
                    { day: "Saturday", time: "9:00 AM – 4:00 PM" },
                    { day: "Sunday", time: "Closed", closed: true },
                  ].map((r) => (
                    <div key={r.day}>
                      <span>{r.day}</span>
                      <span className={r.closed ? "closed" : ""}>{r.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="ct-quote">
                <h3>Need a quote fast?</h3>
                <p>Skip the message and get an instant shipping estimate in under a minute.</p>
                <Link className="btn" to="/quote">
                  Get a Quote <ArrowRight size={16} />
                </Link>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}
