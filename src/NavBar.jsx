import React, { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Mail, MapPin, Menu, Phone, X } from "lucide-react";
import ThemeSwitch from "./ThemeSwitch";
import Logo from "./Logo";

const navStyles = `
  .nv-top {
    background: var(--topbar-bg);
    color: var(--topbar-text);
    font-size: 0.78rem;
    font-weight: 500;
  }
  .nv-top .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    min-height: 36px;
  }
  .nv-top-group { display: inline-flex; align-items: center; flex-wrap: wrap; gap: 4px 20px; }
  .nv-top-item { display: inline-flex; align-items: center; gap: 7px; color: inherit; text-decoration: none; }
  a.nv-top-item:hover { color: #fff; }

  .nv {
    position: sticky;
    top: 0;
    z-index: 900;
    background: var(--nav-bg);
    backdrop-filter: saturate(160%) blur(12px);
    -webkit-backdrop-filter: saturate(160%) blur(12px);
    border-bottom: 1px solid var(--border);
  }
  .nv .container {
    display: flex;
    align-items: center;
    gap: 24px;
    min-height: 72px;
  }
  .nv-logo img { height: 50px; width: auto; }

  .nv-links {
    display: flex;
    align-items: center;
    gap: 4px;
    margin: 0 auto;
    list-style: none;
  }
  .nv-links a {
    display: block;
    padding: 8px 14px;
    border-radius: 999px;
    font-size: 0.93rem;
    font-weight: 600;
    color: var(--text-2);
    text-decoration: none;
    transition: color 0.2s ease, background-color 0.2s ease;
  }
  .nv-links a:hover { color: var(--text); background: var(--surface-2); }
  .nv-links a.active { color: var(--accent-text); background: var(--accent-soft); }

  .nv-actions { display: flex; align-items: center; gap: 12px; }

  .nv-toggle {
    display: none;
    width: 42px;
    height: 42px;
    border-radius: 12px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text);
    place-items: center;
  }

  .nv-drawer, .nv-overlay { display: none; }

  @media (max-width: 900px) {
    .nv-top .nv-address { display: none; }
    .nv-links, .nv-actions .nv-cta { display: none; }
    .nv-actions { margin-left: auto; }
    .nv-toggle { display: grid; }
    .nv .container { min-height: 64px; }
    .nv-logo img { height: 40px; }

    .nv-overlay {
      display: block;
      position: fixed;
      inset: 0;
      z-index: 950;
      background: var(--overlay);
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.25s ease, visibility 0.25s ease;
    }
    .nv-overlay.open { opacity: 1; visibility: visible; }

    .nv-drawer {
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 960;
      width: min(340px, 86vw);
      padding: 20px;
      background: var(--bg-elev);
      border-left: 1px solid var(--border);
      box-shadow: var(--shadow);
      transform: translateX(100%);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .nv-drawer.open { transform: translateX(0); }
    .nv-drawer-head { display: flex; justify-content: flex-end; margin-bottom: 16px; }
    .nv-drawer ul { list-style: none; display: grid; gap: 4px; }
    .nv-drawer ul a {
      display: block;
      padding: 14px 16px;
      border-radius: 12px;
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--text);
      text-decoration: none;
    }
    .nv-drawer ul a.active { background: var(--accent-soft); color: var(--accent-text); }
    .nv-drawer .btn { margin-top: 20px; }
  }
`;

const LINKS = [
  { to: "/services", label: "Services" },
  { to: "/about", label: "About Us" },
  { to: "/tracking", label: "Tracking" },
  { to: "/contact", label: "Contact" },
];

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    if (!isOpen) return undefined;
    const onKey = (e) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <style>{navStyles}</style>
      <div className="nv-top">
        <div className="container">
          <span className="nv-top-group">
            <span className="nv-top-item">
              <Mail size={13} /> info@automationlogisticsint.com
            </span>
            <a className="nv-top-item" href="tel:+18622920271">
              <Phone size={13} /> +1 (862) 292-0271
            </a>
          </span>
          <span className="nv-top-item nv-address">
            <MapPin size={13} /> 56039 Nehalem Hwy S, Vernonia, OR 97064
          </span>
        </div>
      </div>

      <nav className="nv" aria-label="Main">
        <div className="container">
          <Link className="nv-logo logo-plate" to="/" onClick={close}>
            <Logo />
          </Link>

          <ul className="nv-links">
            {LINKS.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to}>{l.label}</NavLink>
              </li>
            ))}
          </ul>

          <div className="nv-actions">
            <ThemeSwitch />
            <Link className="btn btn-primary nv-cta" to="/quote">
              Get a Quote
            </Link>
            <button
              type="button"
              className="nv-toggle"
              onClick={() => setIsOpen(true)}
              aria-label="Open menu"
              aria-expanded={isOpen}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      <div className={`nv-overlay ${isOpen ? "open" : ""}`} onClick={close} />
      <aside className={`nv-drawer ${isOpen ? "open" : ""}`} aria-hidden={!isOpen}>
        <div className="nv-drawer-head">
          <button type="button" className="nv-toggle" onClick={close} aria-label="Close menu" tabIndex={isOpen ? 0 : -1}>
            <X size={22} />
          </button>
        </div>
        <ul>
          {LINKS.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} onClick={close} tabIndex={isOpen ? 0 : -1}>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <Link className="btn btn-primary btn-lg" to="/quote" onClick={close} tabIndex={isOpen ? 0 : -1}>
          Get a Quote
        </Link>
      </aside>
    </>
  );
}
