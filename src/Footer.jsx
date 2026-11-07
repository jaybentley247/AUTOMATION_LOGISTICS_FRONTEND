import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { Mail, MapPin, Phone } from "lucide-react";

const footerStyles = `
  .ft {
    background: var(--footer-bg);
    color: var(--footer-text);
    border-top: 1px solid var(--footer-border);
    padding: clamp(48px, 7vw, 80px) 0 32px;
  }
  .ft-top {
    display: grid;
    grid-template-columns: 1.3fr 1fr;
    gap: clamp(32px, 6vw, 80px);
    padding-bottom: 40px;
    border-bottom: 1px solid var(--footer-border);
  }
  .ft-brand p { color: var(--footer-muted); max-width: 380px; margin: 20px 0 24px; line-height: 1.75; }
  .ft-brand .logo-plate img { height: 54px; width: auto; }

  .ft-social { display: flex; gap: 10px; }
  .ft-social button {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: 1px solid var(--footer-border);
    background: transparent;
    color: var(--footer-text);
    font-size: 0.85rem;
    font-weight: 700;
    transition: background-color 0.2s ease, border-color 0.2s ease;
  }
  .ft-social button:hover { background: var(--accent); border-color: var(--accent); }

  .ft-contact { display: grid; gap: 18px; align-content: start; }
  .ft-contact-item { display: flex; gap: 14px; align-items: flex-start; }
  .ft-contact-icon {
    width: 40px; height: 40px; flex-shrink: 0;
    border-radius: 12px;
    display: grid; place-items: center;
    background: rgba(220, 38, 38, 0.16);
    color: #f87171;
  }
  .ft-contact-text { font-size: 1.05rem; font-weight: 600; line-height: 1.5; }
  .ft-contact-link { color: inherit; text-decoration: none; }
  .ft-contact-link:hover { color: #f87171; }

  .ft-title {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--footer-muted);
    margin-bottom: 14px;
    font-family: var(--font-body);
  }

  .ft-links {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
    padding: 36px 0;
    border-bottom: 1px solid var(--footer-border);
  }
  .ft-links ul { list-style: none; display: flex; flex-wrap: wrap; gap: 8px 22px; }
  .ft-links a { color: var(--footer-text); text-decoration: none; font-weight: 500; opacity: 0.85; transition: opacity 0.2s ease, color 0.2s ease; }
  .ft-links a:hover { opacity: 1; color: #f87171; }

  .ft-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
    padding-top: 28px;
    color: var(--footer-muted);
    font-size: 0.85rem;
  }
  .ft-legal { display: flex; flex-wrap: wrap; gap: 22px; }
  .ft-legal button { background: none; border: 0; padding: 0; color: inherit; transition: color 0.2s ease; }
  .ft-legal button:hover { color: var(--footer-text); }

  @media (max-width: 800px) {
    .ft-top, .ft-links { grid-template-columns: 1fr; }
  }
`;

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <style>{footerStyles}</style>
      <footer className="ft">
        <div className="container">
          <div className="ft-top">
            <div className="ft-brand">
              <Link to="/" className="logo-plate">
                <Logo variant="onDark" />
              </Link>
              <p>
                Providing reliable, fast, and transparent logistics solutions for
                businesses worldwide since 2010. Your success is our mission.
              </p>
              <div className="ft-social">
                <button type="button">f</button>
                <button type="button">t</button>
                <button type="button">in</button>
                <button type="button">ig</button>
              </div>
            </div>

            <div className="ft-contact">
              <h4 className="ft-title">Contact Us</h4>
              <div className="ft-contact-item">
                <span className="ft-contact-icon"><MapPin size={18} /></span>
                <span className="ft-contact-text">
                  56039 Nehalem Hwy S
                  <br />
                  Vernonia, OR 97064
                </span>
              </div>
              <div className="ft-contact-item">
                <span className="ft-contact-icon"><Mail size={18} /></span>
                <span className="ft-contact-text">info@automationlogisticsint.com</span>
              </div>
              <div className="ft-contact-item">
                <span className="ft-contact-icon"><Phone size={18} /></span>
                <a className="ft-contact-text ft-contact-link" href="tel:+18622920271">+1 (862) 292-0271</a>
              </div>
            </div>
          </div>

          <div className="ft-links">
            <div>
              <h4 className="ft-title">Quick Links</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/services">Services</Link></li>
                <li><Link to="/tracking">Track Shipment</Link></li>
                <li><Link to="/quote">Get a Quote</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="ft-title">Our Services</h4>
              <ul>
                <li><Link to="/services">Road Freight</Link></li>
                <li><Link to="/services">Ocean Freight</Link></li>
                <li><Link to="/services">Air Freight</Link></li>
                <li><Link to="/services">Rail Freight</Link></li>
                <li><Link to="/services">Warehousing</Link></li>
              </ul>
            </div>
          </div>

          <div className="ft-bottom">
            <div>© {currentYear} AUTOMATION LOGISTICS. All rights reserved.</div>
            <div className="ft-legal">
              <button type="button">Privacy Policy</button>
              <button type="button">Terms of Service</button>
              <button type="button">Cookie Policy</button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
