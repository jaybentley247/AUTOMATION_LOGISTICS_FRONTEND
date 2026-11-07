import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import NavBar from "./NavBar";
import Testimonials from "./Testimonials";

const styles = `
  /* HERO — full-bleed video, search panel centered */
  .hm-hero {
    position: relative;
    min-height: min(82vh, 760px);
    display: flex;
    align-items: center;
    overflow: hidden;
    isolation: isolate;
    background: #0b0c0e;
  }
  .hm-video {
    position: absolute;
    inset: 0;
    z-index: -2;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 1s ease;
  }
  .hm-video.active { opacity: 1; }
  .hm-hero::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    background: radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.5) 100%);
  }
  .hm-hero .container { display: flex; justify-content: center; padding-block: 64px; }

  .hm-panel {
    width: min(640px, 100%);
    padding: clamp(18px, 3vw, 26px);
    border-radius: var(--radius-lg);
    background: rgba(12, 13, 15, 0.55);
    border: 1px solid rgba(255,255,255,0.16);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    display: grid;
    gap: 14px;
  }
  .hm-track {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px;
    border-radius: 999px;
    background: #fff;
  }
  .hm-track svg { flex-shrink: 0; margin-left: 14px; color: #6c717a; }
  .hm-track input {
    flex: 1;
    min-width: 0;
    padding: 12px 8px;
    border: 0;
    outline: none;
    background: transparent;
    color: #111214;
    font-size: 1.05rem;
  }
  .hm-track input::placeholder { color: #6c717a; }
  .hm-track:focus-within { box-shadow: 0 0 0 3px rgba(220, 38, 38,0.45); }
  .hm-panel .btn-secondary-light {
    justify-self: center;
    background: transparent;
    color: #fff;
    border: 1px solid rgba(255,255,255,0.45);
  }
  .hm-panel .btn-secondary-light:hover { background: rgba(255,255,255,0.12); border-color: #fff; }

  /* SECTION HEADER — title left, intro right */
  .hm-head {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px 64px;
    align-items: end;
    margin-bottom: clamp(32px, 5vw, 56px);
  }

  /* FEATURE CARDS */
  .hm-features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .hm-feature { overflow: hidden; display: flex; flex-direction: column; }
  .hm-feature-img { aspect-ratio: 4 / 3; overflow: hidden; }
  .hm-feature-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
  .hm-feature:hover .hm-feature-img img { transform: scale(1.04); }
  .hm-feature-body { padding: 24px; display: grid; gap: 12px; }
  .hm-tag {
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
  .hm-feature h3 { font-size: 1.35rem; }
  .hm-feature p { color: var(--text-2); }
  .hm-feature .check-list { margin-top: 6px; font-size: 0.93rem; }
  .hm-features-cta { display: flex; justify-content: center; flex-wrap: wrap; gap: 12px; margin-top: clamp(32px, 5vw, 48px); }

  /* WORLDWIDE BAND */
  .hm-global {
    position: relative;
    isolation: isolate;
    color: #fff;
    background: #0b0c0e;
    overflow: hidden;
  }
  .hm-global::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    background: url('https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1600&q=80') center/cover no-repeat;
    opacity: 0.22;
  }
  .hm-global-grid { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: clamp(32px, 6vw, 80px); align-items: center; }
  .hm-global h2 { color: #fff; }
  .hm-global h2 span { color: #f87171; }
  .hm-global p { color: rgba(255,255,255,0.78); margin-top: 18px; font-size: 1.1rem; line-height: 1.75; }
  .hm-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: rgba(255,255,255,0.14); border-radius: var(--radius-lg); overflow: hidden; }
  .hm-stat { background: rgba(10,11,13,0.72); padding: clamp(22px, 3vw, 32px); }
  .hm-stat-num { display: block; font-family: var(--font-display); font-size: clamp(2rem, 4vw, 2.8rem); font-weight: 800; color: #f87171; line-height: 1.1; }
  .hm-stat-label { display: block; margin-top: 6px; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.65); }

  /* WHY TRUST US */
  .hm-about { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(32px, 6vw, 72px); align-items: center; }
  .hm-about-kicker { font-size: 0.95rem; letter-spacing: 0.14em; color: var(--accent-text); margin-bottom: 12px; }
  .hm-about-copy > p { color: var(--text-2); margin: 18px 0 28px; font-size: 1.05rem; line-height: 1.8; }
  .hm-about-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .hm-about-card { padding: 20px; display: grid; gap: 12px; }
  .hm-about-card h3 { font-size: 1.05rem; }
  .hm-about-card p { color: var(--text-2); font-size: 0.93rem; }
  .hm-about-visual { position: relative; border-radius: var(--radius-lg); overflow: hidden; aspect-ratio: 4 / 5; max-height: 560px; width: 100%; }
  .hm-about-visual img { width: 100%; height: 100%; object-fit: cover; }
  .hm-about-badge {
    position: absolute;
    left: 20px;
    bottom: 20px;
    padding: 12px 18px;
    border-radius: 14px;
    background: var(--accent);
    color: #fff;
    font-weight: 700;
    box-shadow: 0 14px 30px rgba(220, 38, 38,0.3);
  }

  /* SERVICES — divided columns */
  .hm-services { display: grid; grid-template-columns: repeat(4, 1fr); border-top: 1px solid var(--border); }
  .hm-service { padding: 28px 24px 8px 0; display: grid; gap: 12px; align-content: start; }
  .hm-service + .hm-service { padding-left: 24px; border-left: 1px solid var(--border); }
  .hm-service-num { font-size: 0.8rem; font-weight: 700; color: var(--text-3); letter-spacing: 0.1em; }
  .hm-service h3 { font-size: 1.1rem; }
  .hm-service p { color: var(--text-2); font-size: 0.95rem; }

  @media (max-width: 1000px) {
    .hm-features { grid-template-columns: 1fr 1fr; }
    .hm-services { grid-template-columns: 1fr 1fr; }
    .hm-service:nth-child(3) { padding-left: 0; border-left: 0; }
    .hm-global-grid, .hm-about { grid-template-columns: 1fr; }
    .hm-about-visual { aspect-ratio: 16 / 10; order: -1; }
  }
  @media (max-width: 700px) {
    .hm-head { grid-template-columns: 1fr; }
    .hm-features, .hm-about-cards { grid-template-columns: 1fr; }
    .hm-services { grid-template-columns: 1fr; }
    .hm-service, .hm-service + .hm-service { padding: 22px 0; border-left: 0; border-bottom: 1px solid var(--border); }
    .hm-track input { font-size: 0.95rem; }
    .hm-track .btn { padding: 11px 16px; }
  }
`;

function AnimatedCounter({ end, duration = 2000, suffix = "" }) {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (nodeRef.current) observer.observe(nodeRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [isVisible, end, duration]);

  return <span ref={nodeRef}>{count.toLocaleString()}{suffix}</span>;
}

// Background clips (Pexels, free to use), self-hosted in public/videos.
// Each clip is on screen for CLIP_SECONDS, then fades into the next; the last
// fades back into the first. Clips resume where they left off, so each visit
// shows a new part of the video. With a single clip it simply loops.
const HERO_CLIPS = [
  { src: "/videos/hero-delivery.mp4", poster: "/videos/hero-delivery-poster.jpg" },
  { src: "/videos/hero-runway.mp4", poster: "/videos/hero-runway-poster.jpg" },
  { src: "/videos/hero-jetstar.mp4", poster: "/videos/hero-jetstar-poster.jpg" },
];
const CLIP_SECONDS = 2.5; // time each clip holds before the next fade starts
const FADE_SECONDS = 1; // keep in sync with the .hm-video transition

function HeroVideo() {
  const refs = useRef([]);
  const [active, setActive] = useState(0);
  const single = HERO_CLIPS.length < 2;

  useEffect(() => {
    // Visitors who ask for less motion get the still poster of the first clip.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      refs.current.forEach((v) => v?.pause());
      return undefined;
    }
    refs.current[active]?.play().catch(() => {});

    // Once the fade has finished, pause the clip that faded out.
    const pauseOthers = setTimeout(() => {
      refs.current.forEach((v, i) => {
        if (v && i !== active) v.pause();
      });
    }, FADE_SECONDS * 1000);

    // Hold, then move on to the next clip (the fade itself is CSS).
    const next = single
      ? null
      : setTimeout(
          () => setActive((active + 1) % HERO_CLIPS.length),
          (CLIP_SECONDS + FADE_SECONDS) * 1000,
        );

    return () => {
      clearTimeout(pauseOthers);
      clearTimeout(next);
    };
  }, [active, single]);

  // If a clip fails to load, move on rather than leaving a blank hero.
  const handleError = (i) => () => {
    if (!single && i === active) setActive((i + 1) % HERO_CLIPS.length);
  };

  return HERO_CLIPS.map((clip, i) => (
    <video
      key={clip.src}
      ref={(el) => (refs.current[i] = el)}
      className={`hm-video ${i === active ? "active" : ""}`}
      src={clip.src}
      poster={clip.poster}
      autoPlay={i === 0}
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      onError={handleError(i)}
    />
  ));
}

const iconProps = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const servicesList = [
  {
    title: "Road Freight Logistics",
    desc: "National and cross-border trucking with flexible delivery options.",
    icon: (
      <svg {...iconProps}>
        <path d="M2 16h16v2a1 1 0 001 1h1a1 1 0 001-1v-2" />
        <path d="M18 12h-3V8H2v8h3" />
        <circle cx="7" cy="19" r="2" />
        <circle cx="17" cy="19" r="2" />
      </svg>
    ),
  },
  {
    title: "Ocean Freight Logistics",
    desc: "Container shipping for imports and exports with FCL/LCL support.",
    icon: (
      <svg {...iconProps}>
        <path d="M3 18h18" />
        <path d="M3 18l2-7h14l2 7" />
        <path d="M7 11V7" />
        <path d="M12 11V6" />
        <path d="M17 11V8" />
      </svg>
    ),
  },
  {
    title: "Air Freight Logistics",
    desc: "Fast air cargo solutions for urgent and time-sensitive deliveries.",
    icon: (
      <svg {...iconProps}>
        <path d="M2 12h20" />
        <path d="M6 12l4-4 4 4" />
        <path d="M10 12v8" />
        <path d="M8 4l-2 2" />
        <path d="M16 4l2 2" />
      </svg>
    ),
  },
  {
    title: "Rail Freight Logistics",
    desc: "Cost-efficient rail transport for inland and intermodal routes.",
    icon: (
      <svg {...iconProps}>
        <path d="M3 18h18" />
        <path d="M6 18V9h12v9" />
        <path d="M6 9l3-3h6l3 3" />
        <circle cx="8" cy="21" r="2" />
        <circle cx="16" cy="21" r="2" />
      </svg>
    ),
  },
];

const features = [
  {
    img: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=1000&q=80",
    alt: "Air",
    tag: "Priority Service",
    title: "Global Air Cargo Solutions",
    desc: "When time is of the essence, our air freight services offer the speed and reliability your business demands.",
    points: [
      "Next-flight-out emergency services",
      "Door-to-door international delivery",
      "Full and part charter options",
      "Real-time temperature monitoring",
    ],
  },
  {
    img: "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&w=1000&q=80",
    alt: "Ocean",
    tag: "Bulk & Container",
    title: "Strategic Ocean Freight",
    desc: "For cost-effective transport of large volumes, our sea freight solutions are unparalleled.",
    points: [
      "Full Container Load (FCL) management",
      "Less than Container Load (LCL) consolidation",
      "Specialized breakbulk cargo handling",
      "Port-to-port and door-to-door coverage",
    ],
  },
  {
    img: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1000&q=80",
    alt: "Road",
    tag: "Ground Network",
    title: "Reliable Road Transport",
    desc: "Our extensive ground network ensures seamless last-mile delivery and cross-border trucking.",
    points: [
      "Dedicated regional delivery fleets",
      "GPS-tracked secure transportation",
      "Hazardous materials handling",
      "Consolidated LTL ground services",
    ],
  },
  {
    img: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1000&q=80",
    alt: "Freight train",
    tag: "Intermodal",
    title: "Efficient Rail Freight",
    desc: "Move heavy and high-volume cargo over long distances at a lower cost per mile with our rail network.",
    points: [
      "Intermodal container transport",
      "Bulk and heavy cargo handling",
      "Door-to-door rail connections",
      "Lower-emission long-haul shipping",
    ],
  },
  {
    img: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1000&q=80",
    alt: "Warehouse",
    tag: "Storage & Fulfillment",
    title: "Warehousing & Distribution",
    desc: "Secure, well-located storage that keeps your inventory organized and ready to ship when you need it.",
    points: [
      "Short-term and long-term storage",
      "Inventory management & reporting",
      "Pick, pack and order fulfillment",
      "Cross-docking for faster turnaround",
    ],
  },
  {
    img: "https://images.unsplash.com/photo-1494961104209-3c223057bd26?auto=format&fit=crop&w=1000&q=80",
    alt: "Shipping containers",
    tag: "Compliance",
    title: "Customs Clearance & Brokerage",
    desc: "We handle the paperwork and regulations so your shipments cross borders smoothly and on schedule.",
    points: [
      "Import/export documentation",
      "Duty and tax calculation",
      "Regulatory compliance support",
      "Faster border clearance",
    ],
  },
];

const stats = [
  { end: 165, suffix: "+", label: "Countries Covered" },
  { end: 1240, suffix: "+", label: "Global Logistics Hubs" },
  { end: 65000, suffix: "+", label: "Daily Shipments" },
  { end: 99, suffix: "%", label: "Success Rate" },
];

function HeroTrack() {
  const [trackingId, setTrackingId] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const key = trackingId.trim().toUpperCase();
    if (key) navigate(`/shipment/${encodeURIComponent(key)}`);
  };

  return (
    <form className="hm-track" onSubmit={handleSubmit}>
      <Search size={20} />
      <input
        type="text"
        placeholder="Enter tracking number"
        aria-label="Tracking number"
        value={trackingId}
        onChange={(e) => setTrackingId(e.target.value)}
      />
      <button type="submit" className="btn btn-primary">Track</button>
    </form>
  );
}

export default function AutomationLogistics() {
  return (
    <>
      <NavBar />
      <style>{styles}</style>
      <main>
        <section className="hm-hero">
          <HeroVideo />
          <div className="container">
            <div className="hm-panel">
              <HeroTrack />
              <Link to="/quote" className="btn btn-secondary-light">
                Request a Quote
              </Link>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="hm-head">
              <h2 className="h2">
                Comprehensive <span>Logistics</span> Solutions
              </h2>
              <p className="lead">
                We provide a wide range of specialized services designed to streamline your supply chain and ensure your cargo reaches its destination safely and efficiently.
              </p>
            </div>
            <div className="hm-features">
              {features.map((f) => (
                <article className="card hm-feature" key={f.title}>
                  <div className="hm-feature-img">
                    <img src={f.img} alt={f.alt} loading="lazy" />
                  </div>
                  <div className="hm-feature-body">
                    <span className="hm-tag">{f.tag}</span>
                    <h3>{f.title}</h3>
                    <p>{f.desc}</p>
                    <ul className="check-list">
                      {f.points.map((p) => <li key={p}>{p}</li>)}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
            <div className="hm-features-cta">
              <Link to="/services" className="btn btn-secondary btn-lg">View all services</Link>
              <Link to="/quote" className="btn btn-primary btn-lg">Get a quote</Link>
            </div>
          </div>
        </section>

        <section className="section hm-global">
          <div className="container hm-global-grid">
            <div>
              <h2 className="h2">
                Worldwide <span>Presence</span>
              </h2>
              <p>Strategic hubs in over 120 countries, connecting your business with markets around the world.</p>
            </div>
            <div className="hm-stats">
              {stats.map((s) => (
                <div className="hm-stat" key={s.label}>
                  <strong className="hm-stat-num"><AnimatedCounter end={s.end} suffix={s.suffix} /></strong>
                  <span className="hm-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="about">
          <div className="container hm-about">
            <div className="hm-about-copy">
              <div className="eyebrow">Logistic Expertise</div>
              <h2 className="hm-about-kicker">WHY TRUST US ?</h2>
              <h2 className="h2">Unparalleled freight services that move your business forward.</h2>
              <p>
                AUTOMATION LOGISTICS delivers dependable transport across road, sea, air, and rail. With transparent tracking and tailored shipping plans.
              </p>
              <div className="hm-about-cards">
                <div className="card hm-about-card">
                  <div className="icon-tile">🚚</div>
                  <h3>Reliable Transport</h3>
                  <p>Dedicated domestic and regional solutions.</p>
                </div>
                <div className="card hm-about-card">
                  <div className="icon-tile">🌍</div>
                  <h3>Global Reach</h3>
                  <p>End-to-end international logistics.</p>
                </div>
              </div>
            </div>
            <div className="hm-about-visual">
              <img src="https://optimalexpresscargo.delivery/images/resource/about1-1.jpg" alt="About" loading="lazy" />
              <div className="hm-about-badge">24/7 Delivery Service</div>
            </div>
          </div>
        </section>

        <section className="section section-alt" id="services">
          <div className="container">
            <div className="hm-head">
              <h2 className="h2">Our Services</h2>
              <p className="lead">Professional shipping options for road, ocean, air, and rail freight.</p>
            </div>
            <div className="hm-services">
              {servicesList.map((s, i) => (
                <div className="hm-service" key={s.title}>
                  <div className="hm-service-num">0{i + 1}</div>
                  <div className="icon-tile">{s.icon}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="hm-head">
              <h2 className="h2">
                Trusted by <span>Industry Leaders</span>
              </h2>
              <p className="lead">Our commitment to excellence has earned us the trust of businesses worldwide.</p>
            </div>
            <Testimonials />
          </div>
        </section>
      </main>
    </>
  );
}
