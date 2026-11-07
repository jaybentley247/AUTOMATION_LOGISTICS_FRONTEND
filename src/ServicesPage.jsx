import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import NavBar from "./NavBar";
import Testimonials from "./Testimonials";

const styles = `
  .sv-head { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 24px 64px; align-items: end; }
  .sv-head .back-link { margin-bottom: 24px; }
  .sv-banner { margin-top: clamp(28px, 4vw, 44px); border-radius: var(--radius-lg); overflow: hidden; aspect-ratio: 21 / 8; }
  .sv-banner img { width: 100%; height: 100%; object-fit: cover; }

  .sv-modes { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
  .sv-mode { padding: 24px; display: flex; flex-direction: column; gap: 14px; transition: border-color 0.2s ease, transform 0.2s ease; }
  .sv-mode:hover { border-color: var(--accent); transform: translateY(-3px); }
  .sv-mode h3 { font-size: 1.2rem; }
  .sv-mode p { color: var(--text-2); font-size: 0.95rem; line-height: 1.7; }
  .sv-mode h4 { font-size: 0.75rem; font-family: var(--font-body); font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-3); margin-top: 4px; }
  .sv-types { list-style: none; display: grid; gap: 8px; }
  .sv-types li { display: flex; align-items: center; gap: 10px; font-size: 0.93rem; color: var(--text); }
  .sv-types li::before { content: ""; width: 7px; height: 7px; border-radius: 50%; background: var(--accent); flex-shrink: 0; }
  .sv-tag {
    margin-top: auto;
    align-self: flex-start;
    padding: 7px 14px;
    border-radius: 999px;
    background: var(--accent-soft);
    color: var(--accent-text);
    font-size: 0.8rem;
    font-weight: 700;
  }

  .sv-details { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .sv-detail { overflow: hidden; display: flex; flex-direction: column; }
  .sv-detail-img { aspect-ratio: 16 / 9; overflow: hidden; }
  .sv-detail-img img { width: 100%; height: 100%; object-fit: cover; }
  .sv-detail-body { padding: clamp(22px, 3vw, 32px); display: grid; gap: 14px; }
  .sv-detail-body h3 { font-size: clamp(1.3rem, 2.4vw, 1.6rem); }
  .sv-detail-body p { color: var(--text-2); line-height: 1.75; }

  .sv-tm-head { text-align: center; margin-bottom: clamp(28px, 4vw, 44px); }

  @media (max-width: 1000px) {
    .sv-modes { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 760px) {
    .sv-head, .sv-details, .sv-modes { grid-template-columns: 1fr; }
    .sv-banner { aspect-ratio: 16 / 10; }
  }
`;

const serviceItems = [
  {
    title: "Road Freight",
    desc: "Reliable overland trucking with flexible delivery and terminal handling.",
    tag: "Domestic & Cross-Border",
    types: ["Less-than-truckload", "Full truckload", "Expedited road transport"],
  },
  {
    title: "Ocean Freight",
    desc: "Full container and less-than-container shipping for global imports and exports.",
    tag: "FCL / LCL",
    types: ["Full container load", "Less-than-container load", "Customs consolidation"],
  },
  {
    title: "Air Freight",
    desc: "Fast air cargo solutions for urgent shipments and time-sensitive deliveries.",
    tag: "Priority Handling",
    types: ["Express cargo", "Standard air freight", "Temperature-controlled shipments"],
  },
  {
    title: "Rail Freight",
    desc: "Cost-efficient rail logistics for inland and intermodal transportation.",
    tag: "Bulk & Heavy Cargo",
    types: ["Intermodal rail", "Door-to-door rail", "Heavy equipment transport"],
  },
];

const details = [
  {
    img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80",
    alt: "Warehousing",
    title: "Warehousing & Distribution",
    desc: "Strategically located warehouses equipped with state-of-the-art inventory management systems to ensure your products are stored safely and distributed efficiently.",
    points: [
      "Inventory management & reporting",
      "Pick and pack services",
      "Order fulfillment & last-mile delivery",
      "Short-term and long-term storage",
    ],
  },
  {
    img: "https://www.image2url.com/r2/default/images/1779535125115-1ca56596-7792-416a-9f00-594bd7924c17.jpg",
    alt: "Supply Chain Flow",
    title: "Supply Chain Optimization",
    desc: "We analyze your logistics data to identify bottlenecks and implement solutions that reduce costs and improve delivery times across your entire network.",
    points: [
      "Route optimization and planning",
      "Cost reduction strategies",
      "Vendor management solutions",
      "End-to-end visibility and tracking",
    ],
  },
  {
    img: "https://www.image2url.com/r2/default/images/1779536015142-2e72713e-f278-4c60-a141-963059e1c9a9.jpg",
    alt: "Customs Brokerage",
    title: "Customs Brokerage & Compliance",
    desc: "Navigating complex international regulations to ensure your cargo moves across borders smoothly. We handle all documentation to minimize delays and avoid penalties.",
    points: [
      "Import/Export documentation management",
      "Duty and tax calculation & optimization",
      "Regulatory compliance consulting",
      "Electronic data interchange (EDI) filing",
    ],
  },
  {
    img: "https://www.image2url.com/r2/default/images/1779536238012-2494002c-a47d-413a-9dd2-3df1d1594a8d.png",
    alt: "E-commerce Fulfillment",
    title: "E-commerce Fulfillment",
    desc: "Scalable solutions for growing online businesses. From storage to shipping, we manage your entire backend so you can focus on scaling your brand.",
    points: [
      "Multi-channel inventory synchronization",
      "Branded packaging and kitting",
      "Reverse logistics (Returns management)",
      "Same-day order processing",
    ],
  },
];

export default function ServicesPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <React.Fragment>
      <NavBar />
      <style>{styles}</style>
      <main>
        <section className="page-head">
          <div className="container">
            <div className="sv-head">
              <div>
                <Link className="back-link" to="/">
                  <ArrowLeft size={16} /> Back to Home
                </Link>
                <div>
                  <div className="eyebrow">Our Services</div>
                </div>
                <h1 className="display">Freight logistics built for speed and scale.</h1>
              </div>
              <p className="lead">
                AUTOMATION LOGISTICS provides tailored shipping services for road, ocean,
                air, and rail freight. Each service is designed to meet the needs
                of businesses moving goods locally, regionally, or around the
                world.
              </p>
            </div>
            <div className="sv-banner">
              <img
                src="https://www.image2url.com/r2/default/images/1779535664219-78a03537-549c-402c-bef3-ff33721f8668.png"
                alt="Logistics and transportation services"
              />
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container sv-modes">
            {serviceItems.map((service) => (
              <article className="card sv-mode" key={service.title}>
                <div className="icon-tile">🚚</div>
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
                <h4>Shipping types we handle</h4>
                <ul className="sv-types">
                  {service.types.map((type) => <li key={type}>{type}</li>)}
                </ul>
                <span className="sv-tag">{service.tag}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="section section-alt">
          <div className="container sv-details">
            {details.map((d) => (
              <article className="card sv-detail" key={d.title}>
                <div className="sv-detail-img">
                  <img src={d.img} alt={d.alt} loading="lazy" />
                </div>
                <div className="sv-detail-body">
                  <h3>{d.title}</h3>
                  <p>{d.desc}</p>
                  <ul className="check-list">
                    {d.points.map((p) => <li key={p}>{p}</li>)}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="container">
            <h2 className="h2 sv-tm-head">Trusted Globally</h2>
            <Testimonials />
          </div>
        </section>
      </main>
    </React.Fragment>
  );
}
