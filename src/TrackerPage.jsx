import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Search } from "lucide-react";
import NavBar from "./NavBar";
import { API_BASE } from "./api";

const styles = `
  .tr-hero {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    border-radius: var(--radius-lg);
    padding: clamp(32px, 6vw, 72px) clamp(22px, 5vw, 64px);
    background: linear-gradient(125deg, #0f1b2b 0%, #1c3a62 55%, #193f68 100%);
    color: #fff;
  }
  .tr-hero::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    background: url('https://images.unsplash.com/photo-1519895609934-64e796e7f4c1?auto=format&fit=crop&w=1600&q=80') center/cover no-repeat;
    opacity: 0.2;
  }
  .tr-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 7px 14px;
    border-radius: 999px;
    background: rgba(255,255,255,0.12);
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }
  .tr-label::before { content: ""; width: 7px; height: 7px; border-radius: 50%; background: #4ade80; }
  .tr-hero h1 { color: #fff; margin: 18px 0 14px; max-width: 760px; }
  .tr-hero h1 span { color: #fca5a5; }
  .tr-hero p { color: rgba(255,255,255,0.84); max-width: 620px; font-size: 1.05rem; line-height: 1.75; }

  .tr-search {
    margin-top: clamp(24px, 4vw, 36px);
    max-width: 680px;
    display: flex;
    gap: 8px;
    padding: 8px;
    border-radius: var(--radius);
    background: #fff;
    box-shadow: 0 20px 50px rgba(0,0,0,0.25);
  }
  .tr-search label { flex: 1; display: flex; align-items: center; gap: 10px; padding-left: 12px; color: #6c717a; }
  .tr-search input {
    flex: 1;
    min-width: 0;
    padding: 12px 0;
    border: 0;
    outline: none;
    background: transparent;
    color: #111214;
    font-size: 1.05rem;
    letter-spacing: 0.03em;
  }
  .tr-search input::placeholder { color: #6c717a; letter-spacing: 0; }
  .tr-search .btn { border-radius: var(--radius-sm); }
  .tr-search:focus-within { box-shadow: 0 0 0 3px rgba(220, 38, 38,0.5), 0 20px 50px rgba(0,0,0,0.25); }

  .tr-error {
    margin-top: 14px;
    max-width: 680px;
    padding: 12px 16px;
    border-radius: var(--radius-sm);
    background: rgba(239, 68, 68, 0.2);
    border: 1px solid rgba(255, 107, 107, 0.45);
    color: #fff;
    font-weight: 600;
  }

  .tr-info { display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 20px; }
  .tr-panel { padding: clamp(22px, 3vw, 32px); }
  .tr-panel h2 { margin-bottom: 14px; }
  .tr-panel p { color: var(--text-2); line-height: 1.8; }
  .tr-stat { padding: 24px; display: grid; gap: 12px; align-content: start; }
  .tr-stat h3 { font-size: 1.1rem; }
  .tr-stat p { color: var(--text-2); font-size: 0.95rem; }

  .tr-links { display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid var(--border); }
  .tr-link-col { padding: 28px 24px 0 0; }
  .tr-link-col + .tr-link-col { padding-left: 24px; border-left: 1px solid var(--border); }
  .tr-link-col h3 { font-size: 1.05rem; margin-bottom: 10px; }
  .tr-link-col p { color: var(--text-2); font-size: 0.95rem; margin-bottom: 12px; }
  .tr-link { display: inline-flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 600; color: var(--accent-text); text-decoration: none; }
  .tr-link:hover { text-decoration: underline; }
  .tr-list { list-style: none; display: grid; gap: 8px; }
  .tr-list li { display: flex; align-items: center; gap: 10px; color: var(--text); }
  .tr-list li::before { content: "→"; color: var(--accent-text); }

  @media (max-width: 900px) {
    .tr-info { grid-template-columns: 1fr 1fr; }
    .tr-panel { grid-column: 1 / -1; }
  }
  @media (max-width: 640px) {
    .tr-info, .tr-links { grid-template-columns: 1fr; }
    .tr-link-col, .tr-link-col + .tr-link-col { padding: 22px 0; border-left: 0; border-bottom: 1px solid var(--border); }
    .tr-search { flex-direction: column; }
    .tr-search label { padding: 4px 8px; }
  }
`;

export default function TrackerPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    const key = input.trim().toUpperCase();
    if (!key) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/tracking/${encodeURIComponent(key)}`);
      if (res.ok) {
        navigate(`/shipment/${encodeURIComponent(key)}`);
      } else {
        setError("Invalid tracking number. Please check and try again.");
      }
    } catch (err) {
      setError("Unable to reach the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <>
      <style>{styles}</style>
      <NavBar />
      <main>
        <section className="section" style={{ paddingBottom: 0, paddingTop: "clamp(24px, 4vw, 48px)" }}>
          <div className="container">
            <div className="tr-hero">
              <span className="tr-label">Real-time Logistics Tracking</span>
              <h1 className="display">Track your <span>Global</span> Shipments</h1>
              <p>
                Get instant updates on your cargo's location and status. Our advanced
                tracking system provides end-to-end visibility for all your logistics needs.
              </p>

              <form className="tr-search" onSubmit={handleSubmit}>
                <label>
                  <Search size={20} />
                  <span className="sr-only">Tracking Number</span>
                  <input
                    type="text"
                    placeholder="e.g. AWB123456789"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                </label>
                <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                  {loading ? "Searching..." : "Track Package"}
                </button>
              </form>

              {error && <div className="tr-error" role="alert">{error}</div>}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container tr-info">
            <div className="card tr-panel">
              <h2 className="h2">Track Smarter</h2>
              <p>
                Our unified tracking platform integrates with multiple carriers to give you a
                single point of truth for all your shipments. Whether it's air freight,
                ocean cargo, or road transport, stay informed every step of the way.
              </p>
            </div>
            <div className="card tr-stat">
              <div className="icon-tile">✓</div>
              <h3>99.9% Accuracy</h3>
              <p>Real-time data synchronization with global ports.</p>
            </div>
            <div className="card tr-stat">
              <div className="icon-tile">⚡</div>
              <h3>Instant Alerts</h3>
              <p>Get notified of any status changes immediately.</p>
            </div>
          </div>

          <div className="container" style={{ marginTop: "clamp(40px, 6vw, 64px)" }}>
            <div className="tr-links">
              <div className="tr-link-col">
                <h3>Support & Help</h3>
                <p>Need assistance with your shipment?</p>
                <div>
                  <Link to="/contact" className="tr-link">Contact Support <ArrowRight size={15} /></Link>
                </div>
                <div>
                  <Link to="/about" className="tr-link">FAQs <ArrowRight size={15} /></Link>
                </div>
              </div>
              <div className="tr-link-col">
                <h3>Our Services</h3>
                <ul className="tr-list">
                  <li>Air Freight</li>
                  <li>Ocean Cargo</li>
                  <li>Express Delivery</li>
                </ul>
              </div>
              <div className="tr-link-col">
                <h3>Business Solutions</h3>
                <p>Looking for enterprise-grade logistics management?</p>
                <Link to="/quote" className="tr-link">Get a Quote <ArrowRight size={15} /></Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
