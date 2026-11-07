import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { applyTheme, getStoredTheme } from "./theme";
import AutomationLogistics from "./AutomationLogistics";
import QuotePage from "./QuotePage";
import TrackerPage from "./TrackerPage";
import ContactPage from "./ContactPage";
import AboutPage from "./AboutPage";
import ServicesPage from "./ServicesPage";
import ChatWidget from "./ChatWidget";
import Footer from "./Footer";
import AdminDashboard from "./AdminDashboard";
import AdminLogin from "./AdminLogin";
import ShipmentDetails from "./ShipmentDetails";
import InvoicePage from "./InvoicePage";

applyTheme(getStoredTheme());

// Keep the startup loader (in public/index.html) up for at least 2 seconds
// from the start of the page load, then fade it out and remove it.
const LOADER_MIN_MS = 2000;
function hideLoader() {
  const loader = document.getElementById("app-loader");
  if (!loader) return;
  const wait = Math.max(0, LOADER_MIN_MS - performance.now());
  setTimeout(() => {
    loader.classList.add("is-done");
    loader.addEventListener("transitionend", () => loader.remove(), { once: true });
    setTimeout(() => loader.remove(), 1000); // fallback if transitions are off
  }, wait);
}
hideLoader();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ChatWidget />
    <Routes>
      <Route path="/" element={<AutomationLogistics />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/quote" element={<QuotePage />} />
      <Route path="/tracking" element={<TrackerPage />} />
      <Route path="/shipment/:id" element={<ShipmentDetails />} />
      <Route path="/invoice/:id" element={<InvoicePage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/login" element={<AdminLogin />} />
    </Routes>
    <Footer />
  </BrowserRouter>,
);
