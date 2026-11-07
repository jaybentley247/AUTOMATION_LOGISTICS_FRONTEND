import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ADMIN_AUTH_KEY } from "./adminConfig";
import { adminFetch } from "./api";
import ThemeSwitch from "./ThemeSwitch";
import Logo from "./Logo";
import { STATUS_OPTIONS, formatDateTime } from "./shipmentStages";
import {
  LayoutDashboard,
  Users,
  Settings,
  PackagePlus,
  Mail,
  BarChart3,
  Plane,
  Wallet,
  CreditCard,
  Rocket,
  RefreshCw,
  LogOut,
  Phone,
  Calendar,
  User,
  FileEdit,
  Trash2,
  PackageCheck,
  Printer,
  Barcode,
  ArrowUp,
  ArrowDown,
  MapPin,
  Plus,
} from "lucide-react";

const styles = `
  /* SHELL: sidebar + main */
  .ad-shell { display: grid; grid-template-columns: 260px minmax(0, 1fr); min-height: 100vh; background: var(--bg); }
  .ad-side {
    position: sticky;
    top: 0;
    height: 100vh;
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 20px 14px;
    background: var(--bg-elev);
    border-right: 1px solid var(--border);
    overflow-y: auto;
  }
  .ad-logo-area { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; padding: 0 6px; }
  .ad-logo-img { height: 46px; width: auto; display: block; }
  .ad-logo-tag {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--accent-text);
    background: var(--accent-soft);
    padding: 4px 10px;
    border-radius: 99px;
  }
  .ad-navbar { display: flex; flex-direction: column; gap: 2px; }
  .ad-nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-2);
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease;
    white-space: nowrap;
  }
  .ad-nav-item:hover { background: var(--surface-2); color: var(--text); }
  .ad-nav-item.active { background: var(--accent-soft); color: var(--accent-text); }
  .ad-nav-item .badge {
    margin-left: auto;
    background: var(--accent);
    color: #fff;
    padding: 1px 7px;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 700;
  }
  .ad-side-foot { margin-top: auto; display: grid; gap: 14px; padding: 14px 6px 0; border-top: 1px solid var(--border); }
  .ad-side-foot .theme-switch { justify-self: start; }
  .ad-profile { display: flex; align-items: center; gap: 10px; }
  .ad-profile-img { width: 36px; height: 36px; border-radius: 50%; overflow: hidden; background: var(--surface-2); flex-shrink: 0; }
  .ad-profile-img img { width: 100%; height: 100%; object-fit: cover; }
  .ad-profile-name { font-size: 13px; font-weight: 700; color: var(--text); }
  .ad-logout {
    margin-left: auto;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text-2);
    display: grid;
    place-items: center;
    transition: color 0.2s ease, border-color 0.2s ease;
  }
  .ad-logout:hover { color: var(--danger); border-color: var(--danger); }

  .ad-main { min-width: 0; }
  .ad-subheader {
    position: sticky;
    top: 0;
    z-index: 5;
    padding: 18px clamp(16px, 3vw, 32px);
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: var(--text-2);
    background: var(--nav-bg);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--border);
  }
  .ad-container { padding: 0 clamp(16px, 3vw, 32px) 40px; max-width: 1400px; }

  /* METRICS */
  .ad-metrics { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; margin-bottom: 24px; }
  .ad-metric-card { background: var(--surface); border: 1px solid var(--border); padding: 18px; border-radius: var(--radius); }
  .ad-metric-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; }
  .ad-metric-title { font-size: 11px; font-weight: 700; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.05em; max-width: 80%; }
  .ad-metric-icon { color: var(--text-3); }
  .ad-metric-value { font-family: var(--font-display); font-size: clamp(1.4rem, 2.5vw, 1.8rem); font-weight: 800; margin-bottom: 10px; color: var(--text); }
  .ad-metric-badge { display: inline-flex; align-items: center; padding: 3px 8px; border-radius: 6px; font-size: 10px; font-weight: 700; color: #fff; }
  .ad-metric-note { font-size: 11px; color: var(--text-3); margin-left: 6px; }

  /* PANELS */
  /* Panels stack: the shipments table gets the full width, recent shipments below. */
  .ad-grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 20px; }
  .ad-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
  .ad-card-header { padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; gap: 12px; }
  .ad-card-title { font-size: 14px; font-weight: 700; color: var(--text); text-transform: uppercase; letter-spacing: 0.04em; }

  .ad-card-tabs { display: flex; gap: 4px; padding: 8px 12px 0; background: var(--surface-2); border-bottom: 1px solid var(--border); overflow-x: auto; }
  .ad-card-tab {
    display: flex;
    align-items: center;
    padding: 10px 14px;
    font-size: 12px;
    font-weight: 700;
    color: var(--text-3);
    cursor: pointer;
    border-bottom: 2px solid transparent;
    white-space: nowrap;
  }
  .ad-card-tab.active { color: var(--accent-text); border-bottom-color: var(--accent); }

  /* TABLES */
  .ad-table-wrap { overflow-x: auto; }
  .ad-shell table { width: 100%; border-collapse: collapse; }
  .ad-shell th {
    text-align: left;
    padding: 11px 14px;
    background: var(--surface-2);
    border-bottom: 1px solid var(--border);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.04em;
    color: var(--text-3);
    text-transform: uppercase;
    white-space: nowrap;
  }
  .ad-shell td { padding: 13px 14px; border-bottom: 1px solid var(--border); font-size: 13px; color: var(--text-2); }
  .ad-shell tr:last-child td { border-bottom: none; }
  .ad-shell tbody tr:hover td { background: var(--surface-2); }

  .status-badge { padding: 4px 10px; border-radius: 99px; font-size: 11px; font-weight: 700; text-transform: uppercase; white-space: nowrap; }
  .status-in-transit { background: var(--info-soft); color: var(--info); }
  .status-delivered { background: var(--success-soft); color: var(--success); }
  .status-pending { background: var(--warning-soft); color: var(--warning); }
  .status-accepted, .status-processing { background: var(--surface-2); color: var(--text-2); }
  .status-held-by-customs { background: var(--danger-soft); color: var(--danger); }
  .status-ready-for-delivery, .status-out-for-delivery { background: var(--info-soft); color: var(--info); }

  .pay-badge { background: var(--accent-soft); color: var(--accent-text); padding: 4px 10px; border-radius: 99px; font-size: 11px; font-weight: 700; white-space: nowrap; }

  /* INVOICE DESIGN (printable sheet: stays white in both themes) */
  .ad-invoice-container { padding: 40px; color: #111; position: relative; background: #fff; border-radius: 12px; font-weight: 500; }
  .ad-invoice-header-top { display: flex; justify-content: space-between; font-size: 11px; color: #444; margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 5px; font-weight: 700; }
  .ad-invoice-brand-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
  .ad-invoice-logo { display: flex; align-items: center; gap: 10px; }
  .ad-invoice-logo-text { font-family: var(--font-display); font-size: 30px; font-weight: 800; line-height: 1; color: #000; }
  .ad-invoice-logo-text span { display: block; font-size: 18px; font-weight: 500; color: #333; }
  .ad-invoice-date-right { text-align: right; font-size: 13px; font-weight: 700; color: #000; }
  .ad-invoice-info-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 30px; line-height: 1.6; }
  .ad-invoice-info-col h3 { font-size: 13px; color: #666; text-transform: uppercase; margin-bottom: 12px; font-weight: 800; }
  .ad-invoice-info-col .name { font-size: 18px; font-weight: 800; margin-bottom: 10px; color: #000; }
  .ad-invoice-info-col div { font-size: 13px; font-weight: 600; color: #333; }
  .ad-invoice-info-col strong { font-weight: 800; color: #000; }
  .ad-invoice-barcode-area { text-align: center; }
  .ad-invoice-barcode { font-size: 40px; line-height: 1; margin-bottom: 5px; color: #000; }
  .ad-invoice-tracking { font-size: 12px; font-weight: 800; letter-spacing: 1px; color: #000; }
  .ad-invoice-order-details { font-size: 13px; margin-top: 20px; text-align: left; font-weight: 600; }
  .ad-invoice-order-details div { margin-bottom: 6px; }
  .ad-invoice-pay-mode-mini { display: inline-block; border: 1.5px solid #000; padding: 2px 6px; font-size: 10px; font-weight: 800; border-radius: 3px; color: #000; }
  .ad-invoice-table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
  .ad-shell .ad-invoice-table th { background: none; border-bottom: 2px solid #000; color: #000; padding: 12px 5px; font-size: 13px; text-align: left; font-weight: 800; text-transform: uppercase; }
  .ad-shell .ad-invoice-table td { padding: 18px 5px; border-bottom: 1px solid #eee; font-size: 13px; vertical-align: top; font-weight: 600; color: #111; background: none; }
  .ad-invoice-status-badge { border: 1.5px solid #000; border-radius: 4px; padding: 3px 8px; font-size: 11px; font-weight: 800; display: inline-block; color: #000; text-transform: uppercase; }
  .ad-invoice-footer-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 40px; }
  .ad-invoice-payment-methods { border: 1.5px solid #eee; border-radius: 12px; padding: 24px; }
  .ad-invoice-payment-icons { display: flex; flex-wrap: wrap; gap: 20px; align-items: center; margin: 20px 0; }
  .ad-invoice-payment-icons img { height: 24px; object-fit: contain; }
  .ad-invoice-payment-note { background: #fcfcfc; padding: 12px; font-size: 12px; color: #444; border-radius: 6px; border: 1px solid #eee; font-weight: 600; }
  .ad-invoice-totals { line-height: 2.8; font-weight: 700; }
  .ad-invoice-totals-row { display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding: 6px 0; font-size: 14px; }
  .ad-invoice-totals-row.grand { border-bottom: none; font-weight: 800; font-size: 18px; color: #000; padding-top: 10px; }

  @media print {
    body * { visibility: hidden; }
    .ad-invoice-container, .ad-invoice-container * { visibility: visible; }
    .ad-invoice-container { position: absolute; left: 0; top: 0; width: 100% !important; padding: 0 !important; }
    .ad-modal-overlay { background: white !important; position: static !important; }
    .ad-modal { max-width: 100% !important; box-shadow: none !important; border: none !important; }
    .btn-submit, .btn-cancel { display: none !important; }
  }

  .btn-icon-action {
    background: none;
    border: none;
    color: var(--text-2);
    cursor: pointer;
    padding: 6px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s ease, background-color 0.2s ease;
  }
  .btn-icon-action:hover:not(:disabled) { color: var(--accent-text); background: var(--accent-soft); }
  .btn-icon-action:disabled { opacity: 0.4; cursor: not-allowed; }

  /* FORMS */
  .ad-form-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: clamp(20px, 3vw, 30px); }
  .ad-form-title { font-size: 18px; font-weight: 700; color: var(--text); margin-bottom: 20px; border-bottom: 1px solid var(--border); padding-bottom: 10px; }
  .ad-form-section-title { font-family: var(--font-display); font-size: 18px; font-weight: 700; color: var(--text); margin-bottom: 18px; }
  .ad-form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px; }
  .ad-form-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 20px; }
  .ad-form-field { margin-bottom: 15px; }
  .ad-form-label { font-size: 11px; font-weight: 700; letter-spacing: 0.04em; color: var(--text-2); margin-bottom: 8px; text-transform: uppercase; display: flex; align-items: center; gap: 5px; }
  .ad-form-input, .ad-form-select {
    width: 100%;
    padding: 11px 12px;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-sm);
    font-size: 14px;
    color: var(--text);
    background: var(--input-bg);
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }
  .ad-form-input:focus, .ad-form-select:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }
  .ad-form-input::placeholder { color: var(--text-3); }
  .ad-form-note { font-size: 12px; color: var(--warning); font-weight: 700; margin-bottom: 8px; }
  .ad-tracking-label { font-size: 13px; font-weight: 800; color: var(--success); text-transform: uppercase; margin-bottom: 10px; }
  .ad-tracking-input { color: var(--text-2); font-weight: 600; background: var(--surface-2); }

  /* MODALS */
  .ad-modal-overlay { position: fixed; inset: 0; background: var(--overlay); display: flex; align-items: center; justify-content: center; padding: 20px; z-index: 1000; }
  .ad-modal {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    max-width: 860px;
    width: 100%;
    max-height: calc(100vh - 60px);
    padding: 28px;
    box-shadow: var(--shadow);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .ad-modal-title { margin-bottom: 18px; font-size: 22px; font-weight: 800; color: var(--text); }
  .ad-modal-body { overflow-y: auto; max-height: calc(100vh - 200px); padding-right: 8px; }
  .ad-modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--border); background: var(--surface); }
  .ad-modal-grid { display: grid; gap: 16px; margin-bottom: 20px; }
  .ad-input-group { display: grid; gap: 8px; }
  .ad-label { font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--text-2); }
  .ad-input {
    width: 100%;
    padding: 11px 12px;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-sm);
    background: var(--input-bg);
    color: var(--text);
  }

  /* BUTTONS */
  .btn-submit, .btn-cancel, .btn-action, .btn-refresh {
    border: 1px solid transparent;
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
  }
  .btn-submit { background: var(--accent); color: #fff; padding: 12px 18px; }
  .btn-submit:hover:not(:disabled) { background: var(--accent-hover); }
  .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
  .btn-cancel { background: var(--surface-2); color: var(--text); border-color: var(--border); padding: 12px 18px; }
  .btn-cancel:hover { border-color: var(--border-strong); }
  .btn-action, .btn-refresh { background: var(--surface-2); color: var(--text-2); border-color: var(--border); padding: 8px 14px; }
  .btn-action:hover:not(:disabled), .btn-refresh:hover { color: var(--text); border-color: var(--border-strong); }
  .btn-action:disabled { opacity: 0.5; cursor: not-allowed; }

  @media (max-width: 1280px) { .ad-metrics { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 900px) {
    .ad-form-grid-2, .ad-form-grid-3 { grid-template-columns: 1fr; gap: 20px; }
    .ad-shell { grid-template-columns: 1fr; }
    .ad-side { position: static; height: auto; flex-direction: row; flex-wrap: wrap; align-items: center; gap: 12px; border-right: 0; border-bottom: 1px solid var(--border); }
    .ad-logo-area { flex-direction: row; align-items: center; }
    .ad-logo-img { height: 40px; }
    .ad-navbar { order: 3; flex: 1 1 100%; flex-direction: row; overflow-x: auto; }
    .ad-side-foot { margin: 0 0 0 auto; padding: 0; border: 0; display: flex; align-items: center; }
    .ad-profile-name { display: none; }
    .ad-subheader { position: static; }
  }
  @media (max-width: 640px) { .ad-metrics { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 420px) { .ad-metrics { grid-template-columns: 1fr; } }
`;

const statusOptions = STATUS_OPTIONS;
const serviceOptions = [
  "Economy Shipping",
  "Standard Shipping",
  "Express Delivery",
  "Freight Forwarding",
  "Customs Clearance",
];
const paymentModes = ["Paid", "To Pay", "Cash"];
const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo (Congo-Brazzaville)",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czechia (Czech Republic)",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Holy See",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Ivory Coast",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar (formerly Burma)",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine State",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States of America",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

function AddShippingForm({ onCreated, onCancel }) {
  const [form, setForm] = useState({
    senderName: "",
    senderAddress: "",
    senderPhone: "",
    recipientName: "",
    recipientAddress: "",
    recipientPhone: "",
    recipientEmail: "",
    paymentMode: "Paid",
    productType: "",
    serviceMode: "Standard Shipping",
    officeOfOrigin: "Afghanistan",
    destinationOffice: "Select Country",
    trackingNumber: "AWB" + Math.floor(Math.random() * 1000000000000),
    quantity: 0,
    weight: 0,
    variablePrice: 2.2,
    freightPrice: 0,
    subtotal: 0,
    shippingDetail: "",
    collectionDate: "",
    status: "ACCEPTED",
    scheduleDelivery: "",
    imageData: "",
  });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => {
    const val = e.target.value;
    setForm((f) => {
      const next = { ...f, [k]: val };
      if (k === "weight" || k === "variablePrice") {
        next.subtotal = (
          parseFloat(next.weight || 0) * parseFloat(next.variablePrice || 0)
        ).toFixed(2);
      }
      return next;
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setForm((f) => ({ ...f, imageData: "" }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((f) => ({ ...f, imageData: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (
      !form.senderName ||
      !form.recipientName ||
      !form.senderAddress ||
      !form.recipientAddress
    ) {
      alert("Please fill in all required fields (Names and Addresses).");
      return;
    }
    if (form.destinationOffice === "Select Country") {
      alert("Please select a Destination Office.");
      return;
    }

    setLoading(true);
    const now = new Date().toISOString();
    const newShipment = {
      trackingNumber: form.trackingNumber,
      createdAt: now,
      status: form.status,
      service: form.serviceMode || "Standard Shipping",
      from: form.officeOfOrigin,
      to: form.destinationOffice,
      eta: form.scheduleDelivery || "TBD",
      weight: `${form.weight} kg`,
      description: form.shippingDetail,
      metrics: {
        quantity: form.quantity,
        variablePrice: form.variablePrice,
        freightPrice: form.freightPrice,
        subtotal: form.subtotal,
        collectionDate: form.collectionDate,
      },
      customer: {
        name: form.senderName,
        toName: form.recipientName,
        phone: form.senderPhone,
        toPhone: form.recipientPhone,
        email: form.recipientEmail,
      },
      details: {
        paymentMode: form.paymentMode,
        productType: form.productType,
        senderAddress: form.senderAddress,
        recipientAddress: form.recipientAddress,
      },
      imageData: form.imageData,
    };

    try {
      const res = await adminFetch("/api/shipments/direct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newShipment),
      });
      const data = await res.json();
      if (data.success) {
        onCreated();
      } else {
        alert("Error saving shipment: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert(
        "Could not connect to the server. Please ensure the backend is running on port 5000.",
      );
    }
    setLoading(false);
  };

  return (
    <div className="ad-form-card">
      <div className="ad-form-grid-2">
        <div>
          <div className="ad-form-section-title">Sender Details:</div>
          <div className="ad-form-field">
            <label className="ad-form-label">SENDER NAME*</label>
            <input
              className="ad-form-input"
              placeholder="Enter your name"
              value={form.senderName}
              onChange={set("senderName")}
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 150px",
              gap: 15,
            }}
          >
            <div className="ad-form-field">
              <label className="ad-form-label">ADDRESS*</label>
              <input
                className="ad-form-input"
                placeholder="Sender address"
                value={form.senderAddress}
                onChange={set("senderAddress")}
              />
            </div>
            <div className="ad-form-field">
              <label className="ad-form-label">
                <Phone size={12} /> PHONE
              </label>
              <input
                className="ad-form-input"
                placeholder="Sender phone"
                value={form.senderPhone}
                onChange={set("senderPhone")}
              />
            </div>
          </div>
        </div>

        <div>
          <div className="ad-form-section-title">Receiver Data :</div>
          <div className="ad-form-field">
            <label className="ad-form-label">RECIPIENT NAME*</label>
            <input
              className="ad-form-input"
              placeholder="Enter name recipient"
              value={form.recipientName}
              onChange={set("recipientName")}
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 150px",
              gap: 15,
            }}
          >
            <div className="ad-form-field">
              <label className="ad-form-label">ADDRESS *</label>
              <input
                className="ad-form-input"
                placeholder="Recipient address"
                value={form.recipientAddress}
                onChange={set("recipientAddress")}
              />
            </div>
            <div className="ad-form-field">
              <label className="ad-form-label">
                <Phone size={12} /> PHONE
              </label>
              <input
                className="ad-form-input"
                placeholder="Recipient phone"
                value={form.recipientPhone}
                onChange={set("recipientPhone")}
              />
            </div>
          </div>
          <div className="ad-form-field">
            <div className="ad-form-note">
              EMAIL Note: (The email must be real to be notified shipping)
            </div>
            <input
              className="ad-form-input"
              placeholder="demo@emo.com"
              value={form.recipientEmail}
              onChange={set("recipientEmail")}
            />
          </div>
        </div>
      </div>

      <div className="ad-form-grid-2">
        <div>
          <div className="ad-form-section-title">Shipping information :</div>
          <div className="ad-form-grid-3">
            <div className="ad-form-field">
              <label className="ad-form-label">
                <Wallet size={12} /> Payment Mode
              </label>
              <select
                className="ad-form-select"
                value={form.paymentMode}
                onChange={set("paymentMode")}
              >
                {paymentModes.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div className="ad-form-field">
              <label className="ad-form-label">Product/Type</label>
              <input
                className="ad-form-input"
                placeholder="Enter the type of product"
                value={form.productType}
                onChange={set("productType")}
              />
            </div>
            <div className="ad-form-field">
              <label className="ad-form-label">
                <Rocket size={12} /> Service(Mode)
              </label>
              <select
                className="ad-form-select"
                value={form.serviceMode}
                onChange={set("serviceMode")}
              >
                <option value="">Select</option>
                {serviceOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="ad-form-grid-2" style={{ gap: 20 }}>
            <div className="ad-form-field">
              <label className="ad-form-label">
                <RefreshCw size={12} /> OFFICE OF ORIGIN
              </label>
              <select
                className="ad-form-select"
                value={form.officeOfOrigin}
                onChange={set("officeOfOrigin")}
              >
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="ad-form-field">
              <label className="ad-form-label">
                <RefreshCw size={12} /> DESTINATION OFFICE
              </label>
              <select
                className="ad-form-select"
                value={form.destinationOffice}
                onChange={set("destinationOffice")}
              >
                <option value="Select Country">Select Country</option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
          <div
            className="ad-form-grid-3"
            style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}
          >
            <div className="ad-form-field">
              <label className="ad-form-label">QUANTITY</label>
              <input
                className="ad-form-input"
                type="number"
                value={form.quantity}
                onChange={set("quantity")}
              />
            </div>
            <div className="ad-form-field">
              <label className="ad-form-label">Weight (Kg)</label>
              <input
                className="ad-form-input"
                type="number"
                value={form.weight}
                onChange={set("weight")}
              />
            </div>
            <div className="ad-form-field">
              <label className="ad-form-label">$ Variable (Kg)</label>
              <input
                className="ad-form-input"
                type="number"
                value={form.variablePrice}
                onChange={set("variablePrice")}
              />
            </div>
            <div className="ad-form-field">
              <label className="ad-form-label">FREIGHT PRICE</label>
              <input
                className="ad-form-input"
                type="number"
                value={form.freightPrice}
                onChange={set("freightPrice")}
              />
            </div>
          </div>
          <div className="ad-form-field" style={{ maxWidth: "200px" }}>
            <label className="ad-form-label">Subtotal shipping</label>
            <input className="ad-form-input" value={form.subtotal} readOnly />
          </div>
        </div>
      </div>

      <div className="ad-form-grid-2">
        <div>
          <div className="ad-form-field">
            <label className="ad-form-label">
              <Mail size={12} /> Shipping Detail
            </label>
            <textarea
              className="ad-form-input"
              style={{ height: "100px", resize: "none" }}
              placeholder="Write the details of the shipment"
              value={form.shippingDetail}
              onChange={set("shippingDetail")}
            />
          </div>
        </div>

        <div className="ad-form-grid-2" style={{ gap: 20 }}>
          <div>
            <div className="ad-form-field">
              <label className="ad-form-label">
                <Calendar size={12} /> COLLECTION DATE AND TIME
              </label>
              <input
                className="ad-form-input"
                type="datetime-local"
                value={form.collectionDate}
                onChange={set("collectionDate")}
              />
            </div>
            <div className="ad-form-field">
              <label className="ad-form-label">
                <User size={12} /> IMAGE
              </label>
              <input
                className="ad-form-input"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {form.imageData && (
                <div style={{ marginTop: 16 }}>
                  <img
                    src={form.imageData}
                    alt="Uploaded shipment"
                    style={{
                      width: "100%",
                      maxHeight: 260,
                      objectFit: "cover",
                      borderRadius: 14,
                      border: "1px solid var(--border)",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          <div>
            <div className="ad-form-field">
              <label className="ad-form-label">
                <BarChart3 size={12} /> STATUS
              </label>
              <select
                className="ad-form-select"
                value={form.status}
                onChange={set("status")}
              >
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div className="ad-form-field">
              <label className="ad-form-label">
                <Calendar size={12} /> Schedule Delivery
              </label>
              <input
                className="ad-form-input"
                type="date"
                value={form.scheduleDelivery}
                onChange={set("scheduleDelivery")}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="ad-form-grid-2">
        <div className="ad-form-field">
          <div className="ad-tracking-label">TRACKING NUMBER</div>
          <input
            className="ad-form-input ad-tracking-input"
            value={form.trackingNumber}
            readOnly
          />
        </div>
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "flex-end",
            marginBottom: 15,
          }}
        >
          <button
            className="btn-submit"
            style={{ flex: 1, padding: 15 }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Shipment"}
          </button>
          <button
            className="btn-cancel"
            style={{ padding: 15 }}
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function QuoteShipmentModal({ quote, onClose, onCreated }) {
  const [eta, setEta] = useState("");
  const [loading, setLoading] = useState(false);
  const handleCreate = async () => {
    setLoading(true);
    try {
      const res = await adminFetch("/api/shipments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId: quote.id, eta }),
      });
      const data = await res.json();
      if (data.success) onCreated(data.trackingNumber);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };
  return (
    <div className="ad-modal-overlay" onClick={onClose}>
      <div className="ad-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="ad-modal-title">Create Shipment</h2>
        <p style={{ marginBottom: 20 }}>
          Creating shipment for {quote.from?.name} tracking {quote.id}.
        </p>
        <div className="ad-input-group">
          <label className="ad-label">Estimated Delivery Date</label>
          <input
            className="ad-input"
            type="date"
            value={eta}
            onChange={(e) => setEta(e.target.value)}
          />
        </div>
        <div className="ad-modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-submit"
            onClick={handleCreate}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Shipment"}
          </button>
        </div>
      </div>
    </div>
  );
}

const EVENT_PRESETS = [
  "Order Processed",
  "Departed Facility",
  "Arrived at Facility",
  "In Transit to Next Facility",
  "Arrived at Regional Hub",
  "Cleared Customs",
  "Preparing for Delivery",
  "Delivery Attempted",
];

const STOP_STATUS_OPTIONS = [
  { value: "upcoming", label: "Upcoming" },
  { value: "arrived", label: "Arrived" },
  { value: "departed", label: "Departed" },
];

const EVENT_TYPE_LABELS = {
  status: "Status",
  stop: "Stop",
  route: "Route edit",
  update: "Update",
};

const trackerStyles = {
  stopRow: {
    border: "1px solid var(--border)",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    background: "var(--surface-2)",
  },
  stopActions: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 },
  historyItem: { padding: "10px 0", borderTop: "1px solid var(--border)", fontSize: 13 },
  typeTag: {
    display: "inline-block",
    fontSize: 10,
    fontWeight: 800,
    textTransform: "uppercase",
    padding: "2px 6px",
    borderRadius: 4,
    background: "var(--surface-2)",
    color: "var(--text-2)",
    marginRight: 8,
  },
  hint: { fontSize: 12, color: "var(--text-3)", marginBottom: 14 },
};

// One editable stop. Edits are kept locally until "Save Stop".
function StopEditor({ stop, index, total, onUpdate, onRemove, onMove, busy }) {
  const [draft, setDraft] = useState({
    location: stop.location,
    eta: stop.eta || "",
    note: stop.note || "",
  });
  const dirty =
    draft.location !== stop.location ||
    draft.eta !== (stop.eta || "") ||
    draft.note !== (stop.note || "");
  const setDraftField = (key) => (e) =>
    setDraft((d) => ({ ...d, [key]: e.target.value }));

  return (
    <div style={trackerStyles.stopRow}>
      <div className="ad-form-grid-3" style={{ gap: 10, marginBottom: 0 }}>
        <div className="ad-form-field">
          <label className="ad-form-label">
            <MapPin size={12} /> Stop {index + 1}
          </label>
          <input
            className="ad-form-input"
            value={draft.location}
            onChange={setDraftField("location")}
          />
        </div>
        <div className="ad-form-field">
          <label className="ad-form-label">Expected Arrival</label>
          <input
            className="ad-form-input"
            type="datetime-local"
            value={draft.eta}
            onChange={setDraftField("eta")}
          />
        </div>
        <div className="ad-form-field">
          <label className="ad-form-label">Stop Status</label>
          <select
            className="ad-form-select"
            value={stop.status}
            disabled={busy}
            onChange={(e) => onUpdate({ status: e.target.value })}
          >
            {STOP_STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="ad-form-field" style={{ marginBottom: 0 }}>
        <label className="ad-form-label">Note (shown to customer)</label>
        <input
          className="ad-form-input"
          placeholder="e.g. Transferred to connecting flight"
          value={draft.note}
          onChange={setDraftField("note")}
        />
      </div>
      {(stop.arrivedAt || stop.departedAt) && (
        <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 8 }}>
          {stop.arrivedAt && `Arrived ${formatDateTime(stop.arrivedAt)}`}
          {stop.departedAt && ` · Departed ${formatDateTime(stop.departedAt)}`}
        </div>
      )}
      <div style={trackerStyles.stopActions}>
        <button
          type="button"
          className="btn-submit"
          style={{ padding: "8px 14px" }}
          disabled={!dirty || busy || !draft.location.trim()}
          onClick={() => onUpdate(draft)}
        >
          Save Stop
        </button>
        <button
          type="button"
          className="btn-action"
          title="Move up"
          disabled={index === 0 || busy}
          onClick={() => onMove(-1)}
        >
          <ArrowUp size={14} />
        </button>
        <button
          type="button"
          className="btn-action"
          title="Move down"
          disabled={index === total - 1 || busy}
          onClick={() => onMove(1)}
        >
          <ArrowDown size={14} />
        </button>
        <button
          type="button"
          className="btn-action"
          style={{ color: "var(--danger)" }}
          disabled={busy}
          onClick={() => {
            if (window.confirm(`Remove the stop "${stop.location}" from the route?`)) {
              onRemove();
            }
          }}
        >
          <Trash2 size={14} /> Remove
        </button>
      </div>
    </div>
  );
}

function StopsSection({ shipment, onShipmentAction }) {
  const stops = shipment.stops || [];
  const [newStop, setNewStop] = useState({ location: "", eta: "", note: "" });
  const [busy, setBusy] = useState(false);
  const base = `/api/shipments/${encodeURIComponent(shipment.trackingNumber)}/stops`;

  const run = async (path, method, body) => {
    setBusy(true);
    const ok = await onShipmentAction(path, method, body);
    setBusy(false);
    return ok;
  };

  const handleAdd = async () => {
    if (!newStop.location.trim()) {
      alert("Please enter the stop location.");
      return;
    }
    if (await run(base, "POST", newStop)) {
      setNewStop({ location: "", eta: "", note: "" });
    }
  };

  const handleMove = (index, direction) => {
    const order = stops.map((s) => s.id);
    const target = index + direction;
    [order[index], order[target]] = [order[target], order[index]];
    run(`${base}/order`, "PUT", { order });
  };

  return (
    <div className="ad-form-field">
      <div className="ad-form-section-title">Stops Along the Route</div>
      <div style={trackerStyles.hint}>
        Shown to customers under "In Transit". Marking a stop Arrived or
        Departed adds a timestamped entry to the tracking history.
      </div>

      {stops.map((stop, i) => (
        <StopEditor
          // Re-mount when the saved stop changes so the draft resets.
          key={`${stop.id}-${stop.location}-${stop.eta}-${stop.note}`}
          stop={stop}
          index={i}
          total={stops.length}
          busy={busy}
          onUpdate={(changes) => run(`${base}/${stop.id}`, "PATCH", changes)}
          onRemove={() => run(`${base}/${stop.id}`, "DELETE")}
          onMove={(direction) => handleMove(i, direction)}
        />
      ))}

      <div className="ad-form-grid-3" style={{ gap: 10, alignItems: "end", marginBottom: 0 }}>
        <div className="ad-form-field">
          <label className="ad-form-label">New Stop Location</label>
          <input
            className="ad-form-input"
            placeholder="e.g. Dubai Cargo Hub, UAE"
            value={newStop.location}
            onChange={(e) => setNewStop((s) => ({ ...s, location: e.target.value }))}
          />
        </div>
        <div className="ad-form-field">
          <label className="ad-form-label">Expected Arrival</label>
          <input
            className="ad-form-input"
            type="datetime-local"
            value={newStop.eta}
            onChange={(e) => setNewStop((s) => ({ ...s, eta: e.target.value }))}
          />
        </div>
        <div className="ad-form-field">
          <button
            type="button"
            className="btn-submit"
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
            onClick={handleAdd}
            disabled={busy}
          >
            <Plus size={14} /> {busy ? "Saving..." : "Add Stop"}
          </button>
        </div>
      </div>
    </div>
  );
}

function TrackingEventsSection({ shipment, onShipmentAction }) {
  const [eventForm, setEventForm] = useState({ title: "", location: "", description: "" });
  const [adding, setAdding] = useState(false);
  const events = [...(shipment.trackingEvents || [])].sort(
    (a, b) => new Date(b.time) - new Date(a.time),
  );

  const handleAdd = async () => {
    if (!eventForm.title.trim()) {
      alert("Please enter an update title.");
      return;
    }
    setAdding(true);
    const ok = await onShipmentAction(
      `/api/shipments/${encodeURIComponent(shipment.trackingNumber)}/events`,
      "POST",
      eventForm,
    );
    if (ok) setEventForm({ title: "", location: "", description: "" });
    setAdding(false);
  };

  const setEventField = (key) => (e) =>
    setEventForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="ad-form-field">
      <div className="ad-form-section-title">Tracking History</div>
      <div style={trackerStyles.hint}>
        Every status change, stop update and manual update is kept here
        permanently. Saving the shipment never removes earlier entries.
      </div>
      <div className="ad-form-grid-2" style={{ gap: 10, alignItems: "end", marginBottom: 0 }}>
        <div className="ad-form-field">
          <label className="ad-form-label">Update Title</label>
          <input
            className="ad-form-input"
            list="event-title-presets"
            placeholder="e.g. Arrived at Regional Hub"
            value={eventForm.title}
            onChange={setEventField("title")}
          />
          <datalist id="event-title-presets">
            {EVENT_PRESETS.map((preset) => (
              <option key={preset} value={preset} />
            ))}
          </datalist>
        </div>
        <div className="ad-form-field">
          <label className="ad-form-label">Location (optional)</label>
          <input
            className="ad-form-input"
            placeholder="e.g. Albany NY Distribution Center"
            value={eventForm.location}
            onChange={setEventField("location")}
          />
        </div>
      </div>
      <div className="ad-form-field">
        <label className="ad-form-label">Details (optional)</label>
        <input
          className="ad-form-input"
          placeholder="Extra information for the customer"
          value={eventForm.description}
          onChange={setEventField("description")}
        />
      </div>
      <button
        type="button"
        className="btn-submit"
        onClick={handleAdd}
        disabled={adding}
      >
        {adding ? "Adding..." : "Add Tracking Update"}
      </button>

      {events.length > 0 && (
        <div style={{ marginTop: 18 }}>
          {events.map((event) => (
            <div key={event.id} style={trackerStyles.historyItem}>
              <div style={{ fontWeight: 700 }}>
                <span style={trackerStyles.typeTag}>
                  {EVENT_TYPE_LABELS[event.type] || "Update"}
                </span>
                {event.title}
              </div>
              {event.location && (
                <div style={{ color: "var(--text-2)" }}>{event.location}</div>
              )}
              {event.description && (
                <div style={{ color: "var(--text-2)" }}>{event.description}</div>
              )}
              <div style={{ color: "var(--text-3)" }}>{formatDateTime(event.time)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EditShipmentModal({ shipment, onClose, onSave, onShipmentAction }) {
  const initialWeight =
    parseFloat((shipment.weight || "").toString().replace(/[^0-9.]/g, "")) || 0;
  const initialVariablePrice =
    parseFloat(shipment.metrics?.variablePrice || 0) || 0;
  const [form, setForm] = useState({
    senderName: shipment.customer?.name || "",
    senderAddress: shipment.details?.senderAddress || shipment.from || "",
    senderPhone: shipment.customer?.phone || "",
    recipientName: shipment.customer?.toName || "",
    recipientAddress: shipment.details?.recipientAddress || shipment.to || "",
    recipientPhone: shipment.customer?.toPhone || "",
    recipientEmail: shipment.customer?.email || "",
    paymentMode: shipment.details?.paymentMode || "Paid",
    productType: shipment.details?.productType || "",
    serviceMode: shipment.service || "Standard Shipping",
    officeOfOrigin: shipment.from || "",
    destinationOffice: shipment.to || "",
    weight: initialWeight,
    quantity: shipment.metrics?.quantity || 0,
    variablePrice: initialVariablePrice,
    freightPrice: shipment.metrics?.freightPrice || 0,
    subtotal:
      shipment.metrics?.subtotal ||
      (initialWeight * initialVariablePrice).toFixed(2),
    shippingDetail: shipment.description || shipment.shippingDetail || "",
    collectionDate: shipment.metrics?.collectionDate || "",
    status: shipment.status?.toUpperCase() || "ACCEPTED",
    scheduleDelivery: shipment.eta || "",
    imageData: shipment.imageData || "",
  });
  const [loading, setLoading] = useState(false);

  const setField = (key) => (e) => {
    const value = e.target.value;
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === "weight" || key === "variablePrice") {
        const weight = parseFloat(next.weight || 0) || 0;
        const variablePrice = parseFloat(next.variablePrice || 0) || 0;
        next.subtotal = (weight * variablePrice).toFixed(2);
      }
      return next;
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setForm((f) => ({ ...f, imageData: "" }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((f) => ({ ...f, imageData: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setLoading(true);
    const updatePayload = {
      status: form.status,
      service: form.serviceMode,
      from: form.officeOfOrigin,
      to: form.destinationOffice,
      eta: form.scheduleDelivery,
      weight: `${form.weight} kg`,
      customer: {
        name: form.senderName,
        phone: form.senderPhone,
        toName: form.recipientName,
        toPhone: form.recipientPhone,
        email: form.recipientEmail,
      },
      details: {
        paymentMode: form.paymentMode,
        productType: form.productType,
        senderAddress: form.senderAddress,
        recipientAddress: form.recipientAddress,
      },
      metrics: {
        quantity: Number(form.quantity) || 0,
        variablePrice: Number(form.variablePrice) || 0,
        freightPrice: Number(form.freightPrice) || 0,
        subtotal: Number(form.subtotal) || 0,
        collectionDate: form.collectionDate,
      },
      description: form.shippingDetail,
      imageData: form.imageData,
    };
    await onSave(updatePayload);
    setLoading(false);
  };

  return (
    <div className="ad-modal-overlay" onClick={onClose}>
      <div className="ad-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="ad-modal-title">Edit Shipment</h2>
        <div className="ad-modal-body">
          <div className="ad-form-card">
            <div className="ad-form-grid-2">
              <div>
                <div className="ad-form-section-title">Sender</div>
                <div className="ad-form-field">
                  <label className="ad-form-label">Sender Name</label>
                  <input
                    className="ad-form-input"
                    value={form.senderName}
                    onChange={setField("senderName")}
                  />
                </div>
                <div className="ad-form-field">
                  <label className="ad-form-label">Sender Address</label>
                  <input
                    className="ad-form-input"
                    value={form.senderAddress}
                    onChange={setField("senderAddress")}
                  />
                </div>
                <div className="ad-form-field">
                  <label className="ad-form-label">Sender Phone</label>
                  <input
                    className="ad-form-input"
                    value={form.senderPhone}
                    onChange={setField("senderPhone")}
                  />
                </div>
              </div>
              <div>
                <div className="ad-form-section-title">Recipient</div>
                <div className="ad-form-field">
                  <label className="ad-form-label">Recipient Name</label>
                  <input
                    className="ad-form-input"
                    value={form.recipientName}
                    onChange={setField("recipientName")}
                  />
                </div>
                <div className="ad-form-field">
                  <label className="ad-form-label">Recipient Address</label>
                  <input
                    className="ad-form-input"
                    value={form.recipientAddress}
                    onChange={setField("recipientAddress")}
                  />
                </div>
                <div className="ad-form-field">
                  <label className="ad-form-label">Recipient Phone</label>
                  <input
                    className="ad-form-input"
                    value={form.recipientPhone}
                    onChange={setField("recipientPhone")}
                  />
                </div>
                <div className="ad-form-field">
                  <label className="ad-form-label">Recipient Email</label>
                  <input
                    className="ad-form-input"
                    value={form.recipientEmail}
                    onChange={setField("recipientEmail")}
                  />
                </div>
              </div>
            </div>

            <div className="ad-form-grid-2">
              <div>
                <div className="ad-form-section-title">Shipment Details</div>
                <div className="ad-form-field">
                  <label className="ad-form-label">Service Mode</label>
                  <select
                    className="ad-form-select"
                    value={form.serviceMode}
                    onChange={setField("serviceMode")}
                  >
                    {serviceOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="ad-form-field">
                  <label className="ad-form-label">Payment Mode</label>
                  <select
                    className="ad-form-select"
                    value={form.paymentMode}
                    onChange={setField("paymentMode")}
                  >
                    {paymentModes.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="ad-form-field">
                  <label className="ad-form-label">Product Type</label>
                  <input
                    className="ad-form-input"
                    value={form.productType}
                    onChange={setField("productType")}
                  />
                </div>
                <div className="ad-form-field">
                  <label className="ad-form-label">Status</label>
                  <select
                    className="ad-form-select"
                    value={form.status}
                    onChange={setField("status")}
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="ad-form-field">
                  <label className="ad-form-label">Collection Date</label>
                  <input
                    className="ad-form-input"
                    type="datetime-local"
                    value={form.collectionDate}
                    onChange={setField("collectionDate")}
                  />
                </div>
              </div>
              <div>
                <div className="ad-form-section-title">Route / Pricing</div>
                <div className="ad-form-field">
                  <label className="ad-form-label">Origin Office</label>
                  <input
                    className="ad-form-input"
                    value={form.officeOfOrigin}
                    onChange={setField("officeOfOrigin")}
                  />
                </div>
                <div className="ad-form-field">
                  <label className="ad-form-label">Destination Office</label>
                  <input
                    className="ad-form-input"
                    value={form.destinationOffice}
                    onChange={setField("destinationOffice")}
                  />
                </div>
                <div className="ad-form-grid-3" style={{ gap: 10 }}>
                  <div className="ad-form-field">
                    <label className="ad-form-label">Quantity</label>
                    <input
                      className="ad-form-input"
                      type="number"
                      value={form.quantity}
                      onChange={setField("quantity")}
                    />
                  </div>
                  <div className="ad-form-field">
                    <label className="ad-form-label">Weight (kg)</label>
                    <input
                      className="ad-form-input"
                      type="number"
                      value={form.weight}
                      onChange={setField("weight")}
                    />
                  </div>
                  <div className="ad-form-field">
                    <label className="ad-form-label">$ Variable</label>
                    <input
                      className="ad-form-input"
                      type="number"
                      value={form.variablePrice}
                      onChange={setField("variablePrice")}
                    />
                  </div>
                </div>
                <div className="ad-form-grid-2" style={{ gap: 20 }}>
                  <div className="ad-form-field">
                    <label className="ad-form-label">Freight Price</label>
                    <input
                      className="ad-form-input"
                      type="number"
                      value={form.freightPrice}
                      onChange={setField("freightPrice")}
                    />
                  </div>
                  <div className="ad-form-field">
                    <label className="ad-form-label">Subtotal</label>
                    <input
                      className="ad-form-input"
                      value={form.subtotal}
                      readOnly
                    />
                  </div>
                </div>
                <div className="ad-form-field">
                  <label className="ad-form-label">Schedule Delivery</label>
                  <input
                    className="ad-form-input"
                    type="date"
                    value={form.scheduleDelivery}
                    onChange={setField("scheduleDelivery")}
                  />
                </div>
              </div>
            </div>

            <StopsSection shipment={shipment} onShipmentAction={onShipmentAction} />

            <TrackingEventsSection shipment={shipment} onShipmentAction={onShipmentAction} />

            <div className="ad-form-field">
              <label className="ad-form-label">Shipping Image</label>
              <input
                className="ad-form-input"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {form.imageData && (
                <div style={{ marginTop: 16 }}>
                  <img
                    src={form.imageData}
                    alt="Shipment upload"
                    style={{
                      width: "100%",
                      maxHeight: 260,
                      objectFit: "cover",
                      borderRadius: 14,
                      border: "1px solid var(--border)",
                    }}
                  />
                </div>
              )}
            </div>
            <div className="ad-form-field">
              <label className="ad-form-label">Shipping Details</label>
              <textarea
                className="ad-form-input"
                value={form.shippingDetail}
                onChange={setField("shippingDetail")}
                style={{ height: 120, resize: "none" }}
              />
            </div>
          </div>
        </div>
        <div className="ad-modal-footer">
          <button className="btn-cancel" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            className="btn-submit"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Shipment"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("dashboard");
  const [activeTab, setActiveTab] = useState("main");
  const [quotes, setQuotes] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(null);
  const [showEditModal, setShowEditModal] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem(ADMIN_AUTH_KEY)) {
      navigate("/admin/login");
      return;
    }
    fetchAll();
  }, [navigate]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [q, s, m] = await Promise.all([
        adminFetch("/api/quotes").then((r) => r.json()),
        adminFetch("/api/shipments").then((r) => r.json()),
        adminFetch("/api/contact").then((r) => r.json()),
      ]);
      setQuotes(Array.isArray(q) ? q.reverse() : []);
      setShipments(Array.isArray(s) ? s.reverse() : []);
      setMessages(Array.isArray(m) ? m.reverse() : []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (trackingNumber, status) => {
    if (!status) return;
    try {
      const res = await adminFetch(
        `/api/shipments/${encodeURIComponent(trackingNumber)}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        },
      );
      const result = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(
          result?.error || res.statusText || "Failed to update status",
        );
      }
      fetchAll();
    } catch (err) {
      console.error(err);
      alert("Failed to update status: " + (err.message || "Unknown error"));
    }
  };

  const handleUpdateShipment = async (trackingNumber, updates) => {
    try {
      const res = await adminFetch(
        `/api/shipments/${encodeURIComponent(trackingNumber)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        },
      );
      const result = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(
          result?.error || res.statusText || "Failed to update shipment",
        );
      }
      fetchAll();
    } catch (err) {
      console.error(err);
      alert("Failed to update shipment: " + (err.message || "Unknown error"));
    }
  };

  // Runs a tracking-history or stop request for the shipment open in the
  // edit modal, then shows the updated shipment. Returns true on success.
  const handleShipmentAction = async (path, method, body) => {
    try {
      const res = await adminFetch(path, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      const result = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(result?.error || res.statusText || "Request failed");
      }
      fetchAll();
      setShowEditModal(result.shipment);
      return true;
    } catch (err) {
      console.error(err);
      alert("Failed to update tracking: " + (err.message || "Unknown error"));
      return false;
    }
  };

  const handleOpenEditShipment = (shipment) => {
    setShowEditModal(shipment);
  };

  const handleDeliverShipment = async (trackingNumber) => {
    await handleUpdateStatus(trackingNumber, "DELIVERED");
  };

  const handleDeleteShipment = async (trackingNumber) => {
    if (
      !window.confirm(
        `Are you sure you want to delete shipment ${trackingNumber}?`,
      )
    )
      return;
    try {
      const res = await adminFetch(
        `/api/shipments/${encodeURIComponent(trackingNumber)}`,
        {
          method: "DELETE",
        },
      );
      const result = await res.json().catch(() => null);
      if (res.ok) {
        fetchAll();
      } else {
        alert(
          "Failed to delete shipment: " +
            (result?.error || res.statusText || "Unknown error"),
        );
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

  const logout = () => {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    navigate("/admin/login");
  };

  const inTransitCount = shipments.filter(
    (s) => s.status?.toUpperCase() === "IN TRANSIT",
  ).length;
  const pendingBookings = quotes.filter((q) => q.status === "pending").length;
  const deliveredRevenue = shipments
    .filter((s) => s.status?.toUpperCase() === "DELIVERED")
    .reduce((a, b) => a + (parseFloat(b.weight) || 0) * 10, 0);
  const outstandingRevenue = shipments
    .filter((s) => s.status?.toUpperCase() !== "DELIVERED")
    .reduce((a, b) => a + (parseFloat(b.weight) || 0) * 12, 0);

  return (
    <>
      <style>{styles}</style>

      {showQuoteModal && (
        <QuoteShipmentModal
          quote={showQuoteModal}
          onClose={() => setShowQuoteModal(null)}
          onCreated={() => {
            fetchAll();
            setShowQuoteModal(null);
          }}
        />
      )}
      {showEditModal && (
        <EditShipmentModal
          shipment={showEditModal}
          onClose={() => setShowEditModal(null)}
          onSave={async (updates) => {
            await handleUpdateShipment(showEditModal.trackingNumber, updates);
            setShowEditModal(null);
          }}
          onShipmentAction={handleShipmentAction}
        />
      )}

      <div className="ad-shell">
        <aside className="ad-side">
          <div className="ad-logo-area">
            <span className="logo-plate">
              <Logo className="ad-logo-img" />
            </span>
            <span className="ad-logo-tag">Admin Panel</span>
          </div>
          <div className="ad-navbar">
            <div
              className={`ad-nav-item ${activeNav === "dashboard" ? "active" : ""}`}
              onClick={() => setActiveNav("dashboard")}
            >
              <LayoutDashboard size={18} /> Dashboard
            </div>
            <div
              className={`ad-nav-item ${activeNav === "accounts" ? "active" : ""}`}
              onClick={() => setActiveNav("accounts")}
            >
              <Users size={18} /> Management of Accounts
            </div>
            <div
              className={`ad-nav-item ${activeNav === "settings" ? "active" : ""}`}
              onClick={() => setActiveNav("settings")}
            >
              <Settings size={18} /> Settings
            </div>
            <div
              className={`ad-nav-item ${activeNav === "add" ? "active" : ""}`}
              onClick={() => setActiveNav("add")}
            >
              <PackagePlus size={18} /> Add Shipping
            </div>
            <div
              className={`ad-nav-item ${activeNav === "bookings" ? "active" : ""}`}
              onClick={() => setActiveNav("bookings")}
            >
              <Mail size={18} /> Online Bookings{" "}
              <span className="badge">{pendingBookings}</span>
            </div>
            <div
              className={`ad-nav-item ${activeNav === "reports" ? "active" : ""}`}
              onClick={() => setActiveNav("reports")}
            >
              <BarChart3 size={18} /> Reports
            </div>
            <div
              className={`ad-nav-item ${activeNav === "messages" ? "active" : ""}`}
              onClick={() => setActiveNav("messages")}
            >
              <Mail size={18} /> Messages
            </div>
          </div>
          <div className="ad-side-foot">
            <ThemeSwitch />
            <div className="ad-profile">
              <div className="ad-profile-img">
                <img src="https://i.pravatar.cc/150?u=admin" alt="Admin" />
              </div>
              <span className="ad-profile-name">Admin</span>
              <button className="ad-logout" onClick={logout} title="Log out" aria-label="Log out">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </aside>

        <main className="ad-main">
        <div className="ad-subheader">
          <PackagePlus size={16} /> COMPANY
        </div>
      <div className="ad-container">
        {activeNav === "add" ? (
          <AddShippingForm
            onCreated={() => {
              fetchAll();
              setActiveNav("dashboard");
            }}
            onCancel={() => setActiveNav("dashboard")}
          />
        ) : (
          <>
            <div className="ad-metrics">
              <div className="ad-metric-card">
                <div className="ad-metric-top">
                  <div className="ad-metric-title">Shipping In Transit</div>
                  <Plane className="ad-metric-icon" size={24} />
                </div>
                <div className="ad-metric-value">{inTransitCount}</div>
                <div>
                  <span
                    className="ad-metric-badge"
                    style={{ background: "#16a34a" }}
                  >
                    100%
                  </span>
                  <span className="ad-metric-note">Shipments In Transit</span>
                </div>
              </div>

              <div className="ad-metric-card">
                <div className="ad-metric-top">
                  <div className="ad-metric-title">Online Bookings</div>
                  <Mail className="ad-metric-icon" size={24} />
                </div>
                <div className="ad-metric-value" style={{ color: "var(--danger)" }}>
                  {pendingBookings}
                </div>
                <div>
                  <span className="ad-metric-note">
                    Online Bookings In Transit
                  </span>
                </div>
              </div>

              <div className="ad-metric-card">
                <div className="ad-metric-top">
                  <div className="ad-metric-title">Shipping Paid</div>
                  <Wallet className="ad-metric-icon" size={24} />
                </div>
                <div className="ad-metric-value">
                  ${deliveredRevenue.toLocaleString()}
                </div>
                <div>
                  <span
                    className="ad-metric-badge"
                    style={{ background: "#dc2626" }}
                  >
                    Percentage
                  </span>
                  <span className="ad-metric-note">shipping paid</span>
                </div>
              </div>

              <div className="ad-metric-card">
                <div className="ad-metric-top">
                  <div className="ad-metric-title">Shipping To Pay</div>
                  <CreditCard className="ad-metric-icon" size={24} />
                </div>
                <div className="ad-metric-value">
                  ${outstandingRevenue.toLocaleString()}
                </div>
                <div>
                  <span
                    className="ad-metric-badge"
                    style={{ background: "#7c3aed" }}
                  >
                    100%
                  </span>
                  <span className="ad-metric-note">
                    Percentage shipments by Cash
                  </span>
                </div>
              </div>

              <div className="ad-metric-card">
                <div className="ad-metric-top">
                  <div className="ad-metric-title">Shipments On Delivery</div>
                  <Rocket className="ad-metric-icon" size={24} />
                </div>
                <div className="ad-metric-value">$0.00</div>
                <div>
                  <span
                    className="ad-metric-badge"
                    style={{ background: "#b45309" }}
                  >
                    Percentage
                  </span>
                  <span className="ad-metric-note">
                    Shipments Against Delivery
                  </span>
                </div>
              </div>
            </div>

            <div className="ad-grid">
              <div className="ad-card">
                <div className="ad-card-header">
                  <div className="ad-card-title">List of Shipments</div>
                  <button className="btn-refresh" onClick={fetchAll}>
                    <RefreshCw size={14} /> Refresh
                  </button>
                </div>
                <div className="ad-card-tabs">
                  <div
                    className={`ad-card-tab ${activeTab === "main" ? "active" : ""}`}
                    onClick={() => setActiveTab("main")}
                  >
                    <Plane size={14} style={{ marginRight: 5 }} /> LIST OF MAIN
                    SHIPPING
                  </div>
                  <div
                    className={`ad-card-tab ${activeTab === "online" ? "active" : ""}`}
                    onClick={() => setActiveTab("online")}
                  >
                    <Mail size={14} style={{ marginRight: 5 }} />{" "}
                    {pendingBookings} LIST OF SHIPMENTS ONLINE BOOKING
                  </div>
                </div>
                <div className="ad-table-wrap">
                  {loading ? (
                    <div style={{ padding: 40, textAlign: "center" }}>
                      Loading...
                    </div>
                  ) : activeTab === "main" ? (
                    <table>
                      <thead>
                        <tr>
                          <th>Edit</th>
                          <th>Delete</th>
                          <th>Deliver</th>
                          <th>Receipt</th>
                          <th>Scan</th>
                          <th>Tracking</th>
                          <th>Pay Mode</th>
                          <th>Status</th>
                          <th>Sender</th>
                          <th>Recipient</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shipments.map((s) => (
                          <tr key={s.trackingNumber}>
                            <td>
                              <button
                                className="btn-icon-action"
                                onClick={() => handleOpenEditShipment(s)}
                              >
                                <FileEdit size={16} />
                              </button>
                            </td>
                            <td>
                              <button
                                className="btn-icon-action"
                                onClick={() =>
                                  handleDeleteShipment(s.trackingNumber)
                                }
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                            <td>
                              <button
                                className="btn-icon-action"
                                onClick={() =>
                                  handleDeliverShipment(s.trackingNumber)
                                }
                                disabled={
                                  s.status?.toUpperCase() === "DELIVERED"
                                }
                                title={
                                  s.status?.toUpperCase() === "DELIVERED"
                                    ? "Already delivered"
                                    : "Mark as delivered"
                                }
                              >
                                <PackageCheck size={16} />
                              </button>
                            </td>
                            <td>
                              <button
                                className="btn-icon-action"
                                onClick={() =>
                                  navigate(`/invoice/${s.trackingNumber}`)
                                }
                              >
                                <Printer size={16} />
                              </button>
                            </td>
                            <td>
                              <button className="btn-icon-action">
                                <Barcode size={16} />
                              </button>
                            </td>
                            <td style={{ fontWeight: 700, color: "var(--text)" }}>
                              {s.trackingNumber}
                            </td>
                            <td>
                              <span className="pay-badge">
                                {s.details?.paymentMode || "ToPay"}
                              </span>
                            </td>
                            <td>{s.status || "PENDING"}</td>
                            <td>{s.customer?.name}</td>
                            <td>{s.customer?.toName}</td>
                          </tr>
                        ))}
                        {shipments.length === 0 && (
                          <tr>
                            <td
                              colSpan="10"
                              style={{ textAlign: "center", padding: 30 }}
                            >
                              No shipments found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th>Quote ID</th>
                          <th>Sender</th>
                          <th>Recipient</th>
                          <th>Service</th>
                          <th>Weight</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quotes.map((q) => (
                          <tr key={q.id}>
                            <td style={{ fontWeight: 700, color: "var(--info)" }}>
                              {q.id}
                            </td>
                            <td>{q.from?.name}</td>
                            <td>{q.to?.name}</td>
                            <td>{q.service}</td>
                            <td>{q.package?.weight} kg</td>
                            <td>
                              {q.status === "pending" ? (
                                <button
                                  className="btn-action"
                                  onClick={() => setShowQuoteModal(q)}
                                >
                                  Create
                                </button>
                              ) : (
                                <span
                                  style={{ color: "var(--success)", fontWeight: 700 }}
                                >
                                  ✓
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              <div className="ad-card">
                <div className="ad-card-header">
                  <div className="ad-card-title">Shipments Recent</div>
                </div>
                <div className="ad-table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Tracking</th>
                        <th>Start Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shipments.slice(0, 8).map((s) => (
                        <tr key={s.trackingNumber}>
                          <td style={{ fontWeight: 700 }}>
                            {s.trackingNumber}
                          </td>
                          <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                          <td>
                            <span
                              className={`status-badge status-${s.status?.toLowerCase().replace(/\s+/g, "-")}`}
                            >
                              {s.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
        </main>
      </div>
    </>
  );
}
