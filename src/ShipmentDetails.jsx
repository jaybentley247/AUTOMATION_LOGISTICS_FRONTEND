import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import { API_BASE } from "./api";
import { buildTimeline, formatDateTime } from "./shipmentStages";
import {
  ArrowLeft,
  Package,
  MapPin,
  Calendar,
  Scale,
  Truck,
  ClipboardCheck,
  Warehouse,
  Navigation,
  House,
  TriangleAlert,
} from "lucide-react";

const STAGE_ICONS = {
  accepted: ClipboardCheck,
  processing: Warehouse,
  transit: Truck,
  delivery: Navigation,
  delivered: House,
};

const STOP_LABELS = { upcoming: "Upcoming", arrived: "Arrived", departed: "Departed" };

// Shown publicly; route edits (stop added/removed/renamed) stay admin-only.
const PUBLIC_EVENT_TYPES = ["status", "stop", "update"];
const HISTORY_PREVIEW = 5;

const styles = `
  .sd-top { padding: clamp(24px, 4vw, 44px) 0 24px; }
  .sd-top .back-link { margin-bottom: 20px; }
  .sd-head {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 20px;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--border);
  }
  .sd-tracking-num { font-size: 0.78rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-3); margin-bottom: 6px; }
  .sd-title { font-size: clamp(1.8rem, 4vw, 2.6rem); }

  .sd-summary { display: flex; flex-wrap: wrap; gap: 12px; }
  .sd-summary-item { padding: 12px 18px; border-radius: var(--radius); background: var(--surface); border: 1px solid var(--border); min-width: 160px; }
  .sd-summary-label { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-3); margin-bottom: 6px; }
  .sd-summary-value { font-weight: 700; color: var(--text); word-break: break-word; }

  .sd-layout { display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr); gap: 24px; align-items: start; padding-bottom: clamp(48px, 7vw, 88px); }
  .sd-main { display: grid; gap: 24px; }
  .sd-side { display: grid; gap: 24px; position: sticky; top: 96px; }

  .sd-tracker, .sd-history { padding: clamp(22px, 4vw, 34px); }
  .sd-section-title { font-size: 1.25rem; margin-bottom: 26px; }

  /* Milestone timeline */
  .sd-stage { display: flex; gap: clamp(12px, 2.5vw, 18px); }
  .sd-stage-rail { display: flex; flex-direction: column; align-items: center; width: 14px; flex-shrink: 0; }
  .sd-stage-dot { width: 14px; height: 14px; border-radius: 50%; background: var(--border-strong); margin-top: 17px; flex-shrink: 0; }
  .sd-stage-line { width: 2px; flex: 1; min-height: 24px; margin-top: 6px; background: var(--border); }
  .sd-stage.done .sd-stage-dot, .sd-stage.done .sd-stage-line { background: var(--accent); }
  .sd-stage.current .sd-stage-dot { background: var(--info); box-shadow: 0 0 0 5px var(--info-soft); animation: sd-pulse 2s ease-in-out infinite; }
  @keyframes sd-pulse { 50% { box-shadow: 0 0 0 9px transparent; } }

  .sd-stage-icon { width: 48px; height: 48px; border-radius: 14px; display: grid; place-items: center; flex-shrink: 0; background: var(--surface-2); color: var(--text-3); }
  .sd-stage.done .sd-stage-icon { background: var(--accent-soft); color: var(--accent-text); }
  .sd-stage.current .sd-stage-icon { background: var(--info-soft); color: var(--info); }

  .sd-stage-body { flex: 1; min-width: 0; padding: 4px 0 30px; }
  .sd-stage-title { font-weight: 700; font-size: 1.02rem; color: var(--text); margin-bottom: 2px; }
  .sd-stage.current .sd-stage-title { color: var(--info); }
  .sd-stage.upcoming .sd-stage-title, .sd-stage.upcoming .sd-stage-desc { color: var(--text-3); }
  .sd-stage-desc { font-size: 0.93rem; color: var(--text-2); line-height: 1.5; }
  .sd-stage-time { font-size: 0.85rem; color: var(--text-3); margin-top: 4px; }
  .sd-stage-note { display: flex; align-items: center; gap: 8px; margin-top: 10px; padding: 10px 12px; border-radius: var(--radius-sm); background: var(--danger-soft); color: var(--danger); font-size: 0.85rem; font-weight: 600; }

  /* Stops nested under In Transit */
  .sd-stops { margin-top: 16px; border-left: 2px dashed var(--border-strong); padding-left: 18px; display: grid; gap: 14px; }
  .sd-stop { position: relative; }
  .sd-stop::before { content: ""; position: absolute; left: -24px; top: 5px; width: 10px; height: 10px; border-radius: 50%; background: var(--border-strong); border: 2px solid var(--surface); }
  .sd-stop.arrived::before { background: var(--info); }
  .sd-stop.departed::before { background: var(--accent); }
  .sd-stop-head { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .sd-stop-location { font-weight: 700; color: var(--text); display: inline-flex; align-items: center; gap: 6px; }
  .sd-stop.upcoming .sd-stop-location { color: var(--text-3); }
  .sd-stop-chip { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 3px 8px; border-radius: 99px; background: var(--surface-2); color: var(--text-3); }
  .sd-stop.arrived .sd-stop-chip { background: var(--info-soft); color: var(--info); }
  .sd-stop.departed .sd-stop-chip { background: var(--accent-soft); color: var(--accent-text); }
  .sd-stop-meta { font-size: 0.85rem; color: var(--text-3); margin-top: 3px; }
  .sd-stop-note { font-size: 0.85rem; color: var(--text-2); margin-top: 3px; }

  /* Details sidebar */
  .sd-details { padding: 8px 24px; }
  .sd-detail { padding: 16px 0; border-bottom: 1px solid var(--border); }
  .sd-detail:last-child { border-bottom: 0; }
  .sd-label { font-size: 0.7rem; font-weight: 700; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; display: flex; align-items: center; gap: 6px; }
  .sd-value { font-weight: 600; color: var(--text); word-break: break-word; }
  .sd-sub { font-size: 0.85rem; color: var(--text-2); margin-top: 3px; }

  .sd-image { padding: 20px; }
  .sd-image img { width: 100%; border-radius: var(--radius); max-height: 420px; object-fit: cover; }

  /* History */
  .sd-event { display: flex; gap: 16px; }
  .sd-event-rail { display: flex; flex-direction: column; align-items: center; width: 12px; flex-shrink: 0; }
  .sd-event-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--border-strong); margin-top: 7px; flex-shrink: 0; }
  .sd-event:first-of-type .sd-event-dot { background: var(--info); }
  .sd-event-line { width: 2px; flex: 1; background: var(--border); margin-top: 6px; }
  .sd-event-body { padding-bottom: 22px; min-width: 0; }
  .sd-event-title { font-weight: 700; color: var(--text); }
  .sd-event-location { font-size: 0.75rem; color: var(--text-2); text-transform: uppercase; letter-spacing: 0.04em; margin-top: 2px; }
  .sd-event-desc { font-size: 0.93rem; color: var(--text-2); margin-top: 2px; line-height: 1.5; }
  .sd-event-time { font-size: 0.85rem; color: var(--text-3); margin-top: 2px; }
  .sd-see-all { background: none; border: 0; padding: 0; color: var(--accent-text); font-weight: 700; }
  .sd-see-all:hover { text-decoration: underline; }

  .sd-state { text-align: center; padding: clamp(64px, 12vw, 120px) 0; }
  .sd-state h2 { font-size: clamp(1.5rem, 4vw, 2rem); margin-bottom: 14px; }
  .sd-state p { color: var(--text-2); margin-bottom: 28px; }

  @media (max-width: 900px) {
    .sd-layout { grid-template-columns: 1fr; }
    .sd-side { position: static; }
  }
  @media (max-width: 560px) {
    .sd-summary-item { flex: 1 1 100%; }
    .sd-stage-icon { width: 40px; height: 40px; }
  }
`;

const statusLabel = (status) =>
  (status || "Status Unknown").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

const statusClass = (status) => {
  const s = (status || "").toUpperCase();
  if (s === "DELIVERED") return "pill-success";
  if (s === "HELD BY CUSTOMS") return "pill-danger";
  return "pill-info";
};

function StopList({ stops }) {
  return (
    <div className="sd-stops">
      {stops.map((stop) => (
        <div className={`sd-stop ${stop.status}`} key={stop.id}>
          <div className="sd-stop-head">
            <span className="sd-stop-location">
              <MapPin size={14} /> {stop.location}
            </span>
            <span className="sd-stop-chip">{STOP_LABELS[stop.status]}</span>
          </div>
          <div className="sd-stop-meta">
            {stop.status === "departed" &&
              `Arrived ${formatDateTime(stop.arrivedAt)} · Departed ${formatDateTime(stop.departedAt)}`}
            {stop.status === "arrived" && `Arrived ${formatDateTime(stop.arrivedAt)}`}
            {stop.status === "upcoming" && stop.eta && `Expected ${formatDateTime(stop.eta)}`}
          </div>
          {stop.note && <div className="sd-stop-note">{stop.note}</div>}
        </div>
      ))}
    </div>
  );
}

function ShipmentTracker({ shipment }) {
  const timeline = buildTimeline(shipment);
  const stops = shipment.stops || [];

  return (
    <div className="sd-tracker">
      <h2 className="sd-section-title">Track Shipment</h2>
      {timeline.map((stage, i) => {
        const Icon = STAGE_ICONS[stage.key];
        const isLast = i === timeline.length - 1;
        return (
          <div className={`sd-stage ${stage.state}`} key={stage.key}>
            <div className="sd-stage-rail">
              <div className="sd-stage-dot" />
              {!isLast && <div className="sd-stage-line" />}
            </div>
            <div className="sd-stage-icon">
              <Icon size={24} />
            </div>
            <div className="sd-stage-body">
              <div className="sd-stage-title">{stage.title}</div>
              <div className="sd-stage-desc">{stage.desc}</div>
              {stage.time && (
                <div className="sd-stage-time">{formatDateTime(stage.time)}</div>
              )}
              {stage.note && (
                <div className="sd-stage-note">
                  <TriangleAlert size={15} /> {stage.note}
                </div>
              )}
              {stage.key === "transit" && stops.length > 0 && <StopList stops={stops} />}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TrackingHistory({ events }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? events : events.slice(0, HISTORY_PREVIEW);

  return (
    <div className="sd-history">
      <h2 className="sd-section-title">Tracking History</h2>
      {visible.map((event, i) => (
        <div className="sd-event" key={event.id || i}>
          <div className="sd-event-rail">
            <div className="sd-event-dot" />
            {i < visible.length - 1 && <div className="sd-event-line" />}
          </div>
          <div className="sd-event-body">
            <div className="sd-event-title">{event.title}</div>
            {event.location && <div className="sd-event-location">{event.location}</div>}
            {event.description && <div className="sd-event-desc">{event.description}</div>}
            <div className="sd-event-time">{formatDateTime(event.time)}</div>
          </div>
        </div>
      ))}
      {events.length > HISTORY_PREVIEW && (
        <button className="sd-see-all" onClick={() => setShowAll((v) => !v)}>
          {showAll ? "Show Less" : `See Full Tracking History (${events.length})`}
        </button>
      )}
    </div>
  );
}

export default function ShipmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchShipment = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(`${API_BASE}/api/tracking/${encodeURIComponent(id)}`);
        if (res.ok) {
          setShipment(await res.json());
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      }
      setLoading(false);
    };
    fetchShipment();
  }, [id]);

  if (loading || error) {
    return (
      <>
        <style>{styles}</style>
        <NavBar />
        <main className="container sd-state">
          {loading ? (
            <p className="subtle">Finding your shipment...</p>
          ) : (
            <>
              <h2>Tracking Number Not Found</h2>
              <p>
                We couldn't find any details for <strong>{id}</strong>.
              </p>
              <button className="btn btn-primary" onClick={() => navigate("/tracking")}>
                Try Another Number
              </button>
            </>
          )}
        </main>
      </>
    );
  }

  const history = (shipment.trackingEvents || [])
    .filter((e) => PUBLIC_EVENT_TYPES.includes(e.type || "update"))
    .sort((a, b) => new Date(b.time) - new Date(a.time));

  return (
    <>
      <style>{styles}</style>
      <NavBar />
      <main className="container">
        <div className="sd-top">
          <button className="back-link" onClick={() => navigate("/tracking")}>
            <ArrowLeft size={16} /> Back to Search
          </button>
          <div className="sd-head">
            <div>
              <div className="sd-tracking-num">Tracking ID: {shipment.trackingNumber || id}</div>
              <h1 className="sd-title">Shipment Details</h1>
            </div>
            <div className="sd-summary">
              <div className="sd-summary-item">
                <div className="sd-summary-label">Estimated Delivery</div>
                <div className="sd-summary-value">{shipment.eta || "TBD"}</div>
              </div>
              <div className="sd-summary-item">
                <div className="sd-summary-label">Current Status</div>
                <span className={`pill ${statusClass(shipment.status)}`}>
                  {statusLabel(shipment.status)}
                </span>
              </div>
              <div className="sd-summary-item">
                <div className="sd-summary-label">Tracking Number</div>
                <div className="sd-summary-value">#{shipment.trackingNumber || id}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="sd-layout">
          <div className="sd-main">
            <div className="card">
              <ShipmentTracker shipment={shipment} />
            </div>
            {history.length > 0 && (
              <div className="card">
                <TrackingHistory events={history} />
              </div>
            )}
          </div>

          <aside className="sd-side">
            <div className="card sd-details">
              <div className="sd-detail">
                <div className="sd-label"><MapPin size={12} /> From</div>
                <div className="sd-value">{shipment.from || "Not specified"}</div>
                {shipment.details?.senderAddress && <div className="sd-sub">{shipment.details.senderAddress}</div>}
              </div>
              <div className="sd-detail">
                <div className="sd-label"><MapPin size={12} /> To</div>
                <div className="sd-value">{shipment.to || "Not specified"}</div>
                {shipment.details?.recipientAddress && <div className="sd-sub">{shipment.details.recipientAddress}</div>}
              </div>
              <div className="sd-detail">
                <div className="sd-label"><Calendar size={12} /> Est. Delivery</div>
                <div className="sd-value">{shipment.eta || "TBD"}</div>
              </div>
              <div className="sd-detail">
                <div className="sd-label"><Package size={12} /> Service</div>
                <div className="sd-value">{shipment.service || "Standard Shipping"}</div>
              </div>
              <div className="sd-detail">
                <div className="sd-label"><Scale size={12} /> Weight</div>
                <div className="sd-value">{shipment.weight || "0 kg"}</div>
              </div>
              <div className="sd-detail">
                <div className="sd-label">Receiver Info</div>
                <div className="sd-value">{shipment.customer?.toName || "N/A"}</div>
                {shipment.customer?.email && <div className="sd-sub">{shipment.customer.email}</div>}
                {shipment.customer?.toPhone && <div className="sd-sub">{shipment.customer.toPhone}</div>}
              </div>
            </div>

            {shipment.imageData ? (
              <div className="card sd-image">
                <div className="sd-label">Shipment Image</div>
                <img src={shipment.imageData} alt="Shipment upload" />
              </div>
            ) : null}
          </aside>
        </div>
      </main>
    </>
  );
}
