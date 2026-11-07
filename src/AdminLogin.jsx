import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { ADMIN_AUTH_KEY } from "./adminConfig";
import { API_BASE } from "./api";
import ThemeSwitch from "./ThemeSwitch";
import Logo from "./Logo";

const styles = `
  .al-wrap { min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; }
  .al-brand {
    position: relative;
    isolation: isolate;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 32px;
    padding: clamp(28px, 5vw, 56px);
    background: linear-gradient(140deg, #111214 0%, #1b1d21 60%, #2a1012 100%);
    color: #fff;
    overflow: hidden;
  }
  .al-brand::after {
    content: "";
    position: absolute;
    right: -120px;
    bottom: -120px;
    z-index: -1;
    width: 420px;
    height: 420px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(220, 38, 38,0.45), transparent 70%);
  }
  .al-brand .logo-plate { align-self: flex-start; }
  .al-brand .logo-plate img { height: 54px; width: auto; }
  .al-brand-tag { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #f87171; margin-bottom: 12px; }
  .al-brand p { font-size: clamp(1.2rem, 2.2vw, 1.6rem); font-family: var(--font-display); font-weight: 700; line-height: 1.35; max-width: 420px; }

  .al-panel { position: relative; display: flex; align-items: center; justify-content: center; padding: clamp(24px, 5vw, 56px); background: var(--bg); }
  .al-panel .theme-switch { position: absolute; top: 20px; right: 20px; }
  .al-card { width: 100%; max-width: 400px; }
  .al-card h1 { font-size: 2rem; margin-bottom: 26px; }
  .al-error { background: var(--danger-soft); color: var(--danger); border-radius: var(--radius-sm); padding: 10px 14px; font-size: 0.88rem; font-weight: 600; margin-bottom: 16px; }
  .al-form { display: grid; gap: 16px; }
  .al-password { position: relative; }
  .al-password .input { padding-right: 46px; }
  .al-eye {
    position: absolute; right: 6px; top: 50%; transform: translateY(-50%);
    width: 34px; height: 34px; border-radius: 8px; border: 0;
    display: grid; place-items: center;
    background: none; color: var(--text-3);
  }
  .al-eye:hover { color: var(--text); }

  @media (max-width: 820px) {
    .al-wrap { grid-template-columns: 1fr; }
    .al-brand { min-height: 0; }
    .al-panel { align-items: flex-start; padding-top: 72px; }
  }
`;

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem(ADMIN_AUTH_KEY)) {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result = await res.json().catch(() => null);
      if (!res.ok || !result?.token) {
        setError(true);
        setPassword("");
        setLoading(false);
        return;
      }
      localStorage.setItem(ADMIN_AUTH_KEY, result.token);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(true);
      setPassword("");
    }
    setLoading(false);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="al-wrap">
        <div className="al-brand">
          <div className="logo-plate">
            <Logo variant="onDark" />
          </div>
          <div>
            <div className="al-brand-tag">Admin Panel</div>
            <p>Enter the admin credentials to manage shipments and invoices.</p>
          </div>
        </div>

        <div className="al-panel">
          <ThemeSwitch />
          <div className="al-card">
            <h1>Admin Login</h1>
            {error && <div className="al-error" role="alert">Incorrect username or password.</div>}
            <form className="al-form" onSubmit={handleSubmit}>
              <label className="field">
                <span className="label">Username</span>
                <input
                  className="input"
                  type="text"
                  placeholder="Enter admin username"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(false); }}
                  autoComplete="username"
                  autoFocus
                />
              </label>
              <label className="field">
                <span className="label">Password</span>
                <span className="al-password">
                  <input
                    className="input"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(false); }}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="al-eye"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </span>
              </label>
              <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
