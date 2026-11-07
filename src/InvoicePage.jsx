import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Rocket, Barcode, PackageCheck, Printer } from "lucide-react";
import { API_BASE } from "./api";
import ThemeSwitch from "./ThemeSwitch";

const styles = `
  .ip-wrap { max-width: 1000px; margin: 40px auto; padding: 0 clamp(16px, 4vw, 20px) 60px; }
  
  .ip-top-actions { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; flex-wrap: wrap; gap: 15px; }
  .ip-top-right { display: flex; align-items: center; gap: 12px; }

  /* The invoice is a printable sheet: it stays white in both themes. */
  .ip-card { background: #fff; color: #111; border-radius: 16px; border: 1px solid var(--border); box-shadow: var(--shadow); overflow: hidden; }

  .ad-invoice-container { padding: clamp(20px, 5vw, 50px); color: #111; position: relative; font-weight: 500; }
  .ad-invoice-header-top { display: flex; justify-content: space-between; font-size: 11px; color: #444; margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom: 8px; font-weight: 700; flex-wrap: wrap; gap: 10px; }
  .ad-invoice-brand-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; flex-wrap: wrap; gap: 20px; }
  .ad-invoice-logo { display: flex; align-items: center; gap: 12px; }
  .ad-invoice-logo-text { font-family: var(--font-display); font-size: clamp(1.5rem, 4vw, 2rem); font-weight: 800; line-height: 1; color: #000; }
  .ad-invoice-logo-text span { display: block; font-size: 14px; font-weight: 500; color: #333; }
  .ad-invoice-date-right { text-align: right; font-size: 13px; font-weight: 700; color: #000; }

  .ad-invoice-info-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 30px; margin-bottom: 40px; line-height: 1.6; }
  .ad-invoice-info-col h3 { font-size: 13px; color: #666; text-transform: uppercase; margin-bottom: 15px; font-weight: 800; }
  .ad-invoice-info-col .name { font-size: 19px; font-weight: 800; margin-bottom: 12px; color: #000; }
  .ad-invoice-info-col div { font-size: 14px; font-weight: 600; color: #333; }
  .ad-invoice-info-col strong { font-weight: 800; color: #000; }

  .ad-invoice-barcode-area { text-align: center; }
  .ad-invoice-barcode { font-size: 40px; line-height: 1; margin-bottom: 8px; color: #000; }
  .ad-invoice-tracking { font-size: 13px; font-weight: 800; letter-spacing: 1px; color: #000; margin-bottom: 20px; }

  .ad-invoice-order-details { font-size: 13px; text-align: left; font-weight: 600; }
  .ad-invoice-order-details div { margin-bottom: 8px; }
  .ad-invoice-pay-mode-mini { display: inline-block; border: 1.5px solid #000; padding: 2px 8px; font-size: 11px; font-weight: 800; border-radius: 4px; color: #000; background: #fdfdfd; }

  .ad-table-scroll { overflow-x: auto; margin-bottom: 50px; }
  .ad-invoice-table { width: 100%; border-collapse: collapse; min-width: 600px; }
  .ad-invoice-table th { background: none; border-bottom: 2px solid #000; color: #000; padding: 15px 5px; font-size: 14px; text-align: left; font-weight: 800; text-transform: uppercase; }
  .ad-invoice-table td { padding: 20px 5px; border-bottom: 1px solid #eee; font-size: 14px; vertical-align: top; font-weight: 600; color: #111; }
  .ad-invoice-status-badge { border: 1.5px solid #000; border-radius: 4px; padding: 4px 10px; font-size: 11px; font-weight: 800; display: inline-block; color: #000; text-transform: uppercase; }

  .ad-invoice-footer-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: clamp(30px, 6vw, 60px); }
  .ad-invoice-payment-methods { border: 1.5px solid #eee; border-radius: 12px; padding: clamp(20px, 4vw, 30px); }
  .ad-invoice-payment-icons { display: flex; flex-wrap: wrap; gap: 25px; align-items: center; margin: 20px 0; }
  .ad-invoice-payment-icons img { height: 28px; object-fit: contain; }
  .ad-invoice-payment-note { background: #fcfcfc; padding: 15px; font-size: 13px; color: #444; border-radius: 8px; border: 1px solid #eee; font-weight: 600; }

  .ad-invoice-totals { line-height: 3; font-weight: 700; }
  .ad-invoice-totals-row { display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding: 8px 0; font-size: 15px; }
  .ad-invoice-totals-row.grand { border-bottom: none; font-weight: 800; font-size: 20px; color: #000; padding-top: 15px; }

  .ip-loading { text-align: center; padding: 100px 20px; font-weight: 700; font-size: 18px; color: var(--text-3); }

  @media (max-width: 768px) {
    .ad-invoice-info-grid { grid-template-columns: 1fr; gap: 20px; }
    .ad-invoice-footer-grid { grid-template-columns: 1fr; }
    .ad-invoice-brand-row { flex-direction: column; align-items: flex-start; }
    .ad-invoice-date-right { text-align: left; }
    .ad-invoice-barcode-area { text-align: left; border-top: 1px solid #eee; padding-top: 20px; }
  }

  @media print {
    body { background: white; }
    .ip-wrap { margin: 0; padding: 0; max-width: 100%; }
    .ip-top-actions { display: none !important; }
    .ip-card { box-shadow: none; border-radius: 0; }
    .ad-invoice-container { padding: 0; width: 100%; }
    .ad-table-scroll { overflow: visible; }
  }
`;

export default function InvoicePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/tracking/${id}`)
      .then(res => res.json())
      .then(data => {
        setShipment(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="ip-loading"><style>{styles}</style>Generating Invoice...</div>;
  if (!shipment) return <div className="ip-loading"><style>{styles}</style>Invoice not found.</div>;

  const subtotal = parseFloat(shipment.metrics?.subtotal) || 0;
  const freightPrice = parseFloat(shipment.metrics?.freightPrice) || 0;
  const total = subtotal + freightPrice;
  const now = new Date();
  const fullDateLong = now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) + " " + now.toLocaleTimeString();

  return (
    <div className="ip-wrap">
      <style>{styles}</style>
      <div className="ip-top-actions">
        <button className="back-link" onClick={() => navigate("/admin")}>
          <ArrowLeft size={18} /> Back to Dashboard
        </button>
        <div className="ip-top-right">
          <ThemeSwitch />
          <button className="btn btn-primary" onClick={() => window.print()}>
            <Printer size={18} /> Print Invoice
          </button>
        </div>
      </div>

      <div className="ip-card">
        <div className="ad-invoice-container">
          <div className="ad-invoice-header-top">
            <div>
              {now.toLocaleDateString()},{" "}
              {now.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div>Across Country Courier | Invoice</div>
            <div>{fullDateLong}</div>
          </div>

          <div className="ad-invoice-brand-row">
            <div className="ad-invoice-logo">
              <div
                style={{
                  background: "#dc2626",
                  padding: 10,
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Rocket size={32} color="white" />
              </div>
              <div className="ad-invoice-logo-text">
                AUTOMATION <span>Logistics</span>
              </div>
            </div>
            <div className="ad-invoice-date-right">
              {now.toLocaleDateString("en-US", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              <br />
              {now.toLocaleTimeString()}
            </div>
          </div>

          <div className="ad-invoice-info-grid">
            <div className="ad-invoice-info-col">
              <h3>From</h3>
              <div className="name">{shipment.customer?.name}</div>
              <div>
                <strong>Phone:</strong> {shipment.customer?.phone}
              </div>
              <div>
                <strong>Address:</strong> {shipment.details?.senderAddress}
              </div>
              <div>
                <strong>Origin Office:</strong> {shipment.from}
              </div>
            </div>

            <div className="ad-invoice-info-col">
              <h3>To</h3>
              <div className="name">{shipment.customer?.toName}</div>
              <div>
                <strong>Phone:</strong> {shipment.customer?.toPhone}
              </div>
              <div>
                <strong>Address:</strong> {shipment.details?.recipientAddress}
              </div>
              <div>
                <strong>Destination Office:</strong> {shipment.to}
              </div>
            </div>

            <div className="ad-invoice-info-col ad-invoice-barcode-area">
              <div className="ad-invoice-barcode">
                <Barcode size={64} strokeWidth={1} />
              </div>
              <div className="ad-invoice-tracking">
                {shipment.trackingNumber}
              </div>

              <div className="ad-invoice-order-details">
                <div>
                  <strong>Order ID:</strong> {shipment.trackingNumber.slice(-4)}
                </div>
                <div>
                  <strong>Payment Due:</strong>{" "}
                  {new Date(shipment.createdAt).toLocaleDateString()}
                </div>
                <div>
                  <strong>Booking Mode:</strong>{" "}
                  <span className="ad-invoice-pay-mode-mini">ToPay</span>
                </div>
                <div>
                  <strong>Insurance of the Shipment:</strong> $
                </div>
              </div>
            </div>
          </div>

          <div className="ad-table-scroll">
            <table className="ad-invoice-table">
              <thead>
                <tr>
                  <th style={{ width: "60px" }}>Qty</th>
                  <th style={{ width: "150px" }}>Product</th>
                  <th style={{ width: "120px" }}>Status</th>
                  <th>Description</th>
                  <th style={{ width: "100px", textAlign: "right" }}>Price</th>
                  <th style={{ width: "100px", textAlign: "right" }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{shipment.metrics?.quantity || 1}</td>
                  <td style={{ fontWeight: 800 }}>
                    {shipment.details?.productType || "Package"}
                  </td>
                  <td>
                    <span className="ad-invoice-status-badge">
                      {shipment.status}
                    </span>
                  </td>
                  <td style={{ color: "#444", fontSize: "13px" }}>
                    {shipment.description || "No description provided."}
                  </td>
                  <td style={{ textAlign: "right" }}>${subtotal.toFixed(0)}</td>
                  <td style={{ textAlign: "right" }}>${subtotal.toFixed(0)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="ad-invoice-footer-grid">
            <div className="ad-invoice-payment-methods">
              <div
                style={{ fontSize: "14px", color: "#888", fontWeight: "800" }}
              >
                Payment Methods:
              </div>
              <div className="ad-invoice-payment-icons">
                <img
                  src="https://www.image2url.com/r2/default/images/1778874608177-8095f195-449f-43e9-a91e-ef1b1e101d22.png"
                  alt="GeoTrust"
                  style={{ height: "18px" }}
                />
                <img
                  src="https://www.image2url.com/r2/default/images/1778874522178-7bbac970-7043-4a6c-a316-30b06b2fa828.png"
                  alt="Visa"
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png"
                  alt="Mastercard"
                />
                <img
                  src="https://www.image2url.com/r2/default/images/1778874416232-4b2fb404-cbfc-4244-ae60-d0e12d961886.png"
                  alt="PayPal"
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    color: "#27ae60",
                    fontWeight: "900",
                    fontSize: "12px",
                  }}
                >
                  <PackageCheck size={20} /> SAFE SHOPPING
                </div>
              </div>
              <div className="ad-invoice-payment-note">
                For your convenience we have several payment reliable, fast,
                secure.
              </div>
            </div>

            <div className="ad-invoice-totals">
              <div
                style={{
                  fontSize: "15px",
                  color: "#888",
                  marginBottom: "15px",
                  textTransform: "uppercase",
                  fontWeight: "800",
                }}
              >
                Amount Due
              </div>
              <div className="ad-invoice-totals-row">
                <strong>Subtotal:</strong>
                <span>${subtotal.toFixed(0)}</span>
              </div>
              <div className="ad-invoice-totals-row">
                <strong>Shipping:</strong>
                <span>${freightPrice.toFixed(0)}</span>
              </div>
              <div className="ad-invoice-totals-row grand">
                <strong>Total:</strong>
                <span>${total.toFixed(0)}</span>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: "80px",
              fontSize: "11px",
              color: "#aaa",
              display: "flex",
              borderTop: "1px solid #eee",
              paddingTop: "10px",
            }}
          >
            <div>
              https://automationlogistics.com/print-invoice?id=
              {shipment.trackingNumber}
            </div>
            <div style={{ marginLeft: "auto" }}>1/1</div>
          </div>
        </div>
      </div>
    </div>
  );
}
