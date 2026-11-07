// The milestone stages a shipment moves through, in order, and the
// admin statuses that place a shipment in each stage.
export const STAGES = [
  {
    key: "accepted",
    title: "Shipment Accepted",
    desc: "We have received your shipment.",
    statuses: ["ACCEPTED", "PENDING"],
  },
  {
    key: "processing",
    title: "Processed at Origin",
    desc: "Your shipment is being checked and prepared for dispatch.",
    statuses: ["PROCESSING"],
  },
  {
    key: "transit",
    title: "In Transit",
    desc: "Your shipment is on its way.",
    statuses: ["IN TRANSIT", "HELD BY CUSTOMS"],
  },
  {
    key: "delivery",
    title: "Out for Delivery",
    desc: "Your shipment has embarked for final delivery.",
    statuses: ["READY FOR DELIVERY", "OUT FOR DELIVERY"],
  },
  {
    key: "delivered",
    title: "Delivered",
    desc: "Your shipment has been delivered.",
    statuses: ["DELIVERED"],
  },
];

// Options offered in the admin status dropdowns, in journey order.
export const STATUS_OPTIONS = [
  "ACCEPTED",
  "PROCESSING",
  "IN TRANSIT",
  "HELD BY CUSTOMS",
  "READY FOR DELIVERY",
  "OUT FOR DELIVERY",
  "DELIVERED",
];

export const STATUS_NOTES = {
  "HELD BY CUSTOMS": "Held by customs — we'll update you as soon as it clears.",
  "READY FOR DELIVERY": "Arrived at the destination facility and ready for delivery.",
};

export function getStageIndex(status) {
  const s = (status || "").toUpperCase();
  const i = STAGES.findIndex((stage) => stage.statuses.includes(s));
  return i === -1 ? 0 : i;
}

// When each stage was first reached, read from the shipment's
// append-only history of status changes.
function stageTimes(events) {
  const times = {};
  for (const e of events) {
    if (e.type !== "status" || !e.status) continue;
    const i = getStageIndex(e.status);
    if (!times[i]) times[i] = e.time;
  }
  return times;
}

export function buildTimeline(shipment) {
  const events = [...(shipment.trackingEvents || [])].sort(
    (a, b) => new Date(a.time) - new Date(b.time),
  );
  const current = getStageIndex(shipment.status);
  const times = stageTimes(events);

  return STAGES.map((stage, i) => ({
    ...stage,
    state: i < current ? "done" : i === current ? "current" : "upcoming",
    time: i <= current ? times[i] || null : null,
    note: i === current ? STATUS_NOTES[(shipment.status || "").toUpperCase()] : null,
  }));
}

export function formatDateTime(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
