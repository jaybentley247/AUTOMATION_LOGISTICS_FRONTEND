import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import NavBar from "./NavBar";

const styles = `
  .ab-head { text-align: center; max-width: 860px; margin: 0 auto; }
  .ab-head .back-link { margin-bottom: 28px; }
  .ab-head .lead { margin: 20px auto 30px; max-width: 680px; }

  .ab-banner { border-radius: var(--radius-lg); overflow: hidden; aspect-ratio: 21 / 9; }
  .ab-banner img { width: 100%; height: 100%; object-fit: cover; }

  .ab-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    margin-top: clamp(32px, 5vw, 56px);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }
  .ab-stat { padding: 28px clamp(16px, 3vw, 32px); }
  .ab-stat + .ab-stat { border-left: 1px solid var(--border); }
  .ab-stat h3 { font-size: clamp(1.6rem, 3vw, 2.2rem); color: var(--accent-text); margin-bottom: 8px; }
  .ab-stat p { color: var(--text-2); }

  .ab-bento {
    display: grid;
    grid-template-columns: 1.15fr 1fr;
    grid-template-rows: auto auto;
    gap: 20px;
  }
  .ab-feature { overflow: hidden; display: flex; flex-direction: column; }
  .ab-feature img { width: 100%; object-fit: cover; }
  .ab-feature-body { padding: clamp(20px, 3vw, 28px); display: grid; gap: 10px; align-content: start; }
  .ab-feature-body h3 { font-size: 1.25rem; }
  .ab-feature-body p { color: var(--text-2); line-height: 1.75; }
  .ab-chip {
    justify-self: start;
    padding: 5px 12px;
    border-radius: 999px;
    background: var(--accent-soft);
    color: var(--accent-text);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .ab-feature.big { grid-row: 1 / span 2; }
  .ab-feature.big img { flex: 1; min-height: 280px; }
  .ab-feature.row { flex-direction: row; }
  .ab-feature.row img { width: 42%; flex-shrink: 0; }

  .ab-values { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
  .ab-value { padding-top: 22px; border-top: 2px solid var(--accent); }
  .ab-value-num { font-size: 0.8rem; font-weight: 700; color: var(--text-3); letter-spacing: 0.1em; margin-bottom: 10px; }
  .ab-value h3 { font-size: 1.15rem; margin-bottom: 10px; }
  .ab-value p { color: var(--text-2); line-height: 1.75; }

  @media (max-width: 900px) {
    .ab-bento { grid-template-columns: 1fr; }
    .ab-feature.big { grid-row: auto; }
    .ab-banner { aspect-ratio: 16 / 10; }
  }
  @media (max-width: 700px) {
    .ab-stats, .ab-values { grid-template-columns: 1fr; }
    .ab-stat + .ab-stat { border-left: 0; border-top: 1px solid var(--border); }
    .ab-stat { padding-inline: 0; }
    .ab-feature.row { flex-direction: column; }
    .ab-feature.row img { width: 100%; height: 200px; }
  }
`;

const values = [
  {
    title: "Fast Global Shipping",
    desc: "We deliver quickly and safely, with tailored solutions for every route and cargo size.",
  },
  {
    title: "Transparent Pricing",
    desc: "No surprises — clear quotes, dependable timelines, and smart logistics support.",
  },
  {
    title: "Customer-first Service",
    desc: "Every shipment is handled with care, from pickup to final delivery.",
  },
];

const highlights = [
  {
    img: "https://www.image2url.com/r2/default/images/1779651143214-6d19fd15-326b-4c3f-8ed1-be8a8035ff57.png",
    alt: "Specialized freight logistics",
    chip: "Specialized Logistics",
    title: "Tailored freight moving for every industry",
    copy: "From heavy-lift rail and ocean freights to last-mile road delivery, AUTOMATION LOGISTICS provides precise, specialized transport built around your cargo type.",
  },
  {
    img: "https://www.image2url.com/r2/default/images/1779650653855-7832a9d3-978a-4c46-a454-a29f3a1de4f7.png",
    alt: "Vaccine cold-chain logistics",
    chip: "Critical Supply Chain",
    title: "Moving essential goods safely and reliably",
    copy: "We support sensitive and time-critical shipments with strict handling standards, temperature control, and dependable routing for high-value cargo.",
  },
  {
    img: "https://www.image2url.com/r2/default/images/1779650244857-cf377053-d2cb-40f5-84db-ccf34b04f65c.png",
    alt: "Global maritime logistics",
    chip: "Global Reach",
    title: "Scaling international routes with confidence",
    copy: "Our network connects seaports, air hubs, and inland terminals worldwide, so you can move shipments across borders with complete visibility.",
  },
];

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <NavBar />
      <style>{styles}</style>
      <main>
        <section className="page-head">
          <div className="container">
            <div className="ab-head">
              <Link className="back-link" to="/">
                <ArrowLeft size={16} /> Back to Home
              </Link>
              <div>
                <div className="eyebrow">About AUTOMATION LOGISTICS</div>
              </div>
              <h1 className="display">We move your business forward with smarter logistics.</h1>
              <p className="lead">
                AUTOMATION LOGISTICS is built for companies that need reliable, flexible
                shipping — whether road, air, sea, or rail. We combine fast
                service with expert operational support so your cargo arrives on
                time, every time.
              </p>
              <Link className="btn btn-primary btn-lg" to="/contact">
                Talk to our team <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        <section>
          <div className="container">
            <div className="ab-banner">
              <img
                src="https://www.image2url.com/r2/default/images/1779649727995-a21f180b-a347-4360-b049-850d8c91dca1.jpg"
                alt="Logistics operations"
              />
            </div>

            <div className="ab-stats">
              <div className="ab-stat">
                <h3>10,000+</h3>
                <p>Shipments moved across 45 countries with real-time tracking.</p>
              </div>
              <div className="ab-stat">
                <h3>24/7 Support</h3>
                <p>Dedicated customer care for every delivery from pickup to final mile.</p>
              </div>
              <div className="ab-stat">
                <h3>99.8% on-time</h3>
                <p>Industry-leading performance for time-sensitive freight and deliveries.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container ab-bento">
            {highlights.map((h, i) => (
              <article className={`card ab-feature ${i === 0 ? "big" : "row"}`} key={h.title}>
                <img src={h.img} alt={h.alt} loading="lazy" />
                <div className="ab-feature-body">
                  <span className="ab-chip">{h.chip}</span>
                  <h3>{h.title}</h3>
                  <p>{h.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section section-alt">
          <div className="container ab-values">
            {values.map((value, i) => (
              <div className="ab-value" key={value.title}>
                <div className="ab-value-num">0{i + 1}</div>
                <h3>{value.title}</h3>
                <p>{value.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
