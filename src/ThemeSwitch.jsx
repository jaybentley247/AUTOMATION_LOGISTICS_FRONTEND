import { Monitor, Sun, Moon } from "lucide-react";
import { useTheme } from "./theme";

const OPTIONS = [
  { value: "system", label: "System theme", Icon: Monitor },
  { value: "light", label: "Light theme", Icon: Sun },
  { value: "dark", label: "Dark theme", Icon: Moon },
];

export default function ThemeSwitch({ className = "" }) {
  const [theme, setTheme] = useTheme();

  return (
    <div className={`theme-switch ${className}`} role="group" aria-label="Color theme">
      {OPTIONS.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          aria-label={label}
          title={label}
          aria-pressed={theme === value}
          onClick={() => setTheme(value)}
        >
          <Icon size={15} strokeWidth={2.2} />
        </button>
      ))}
    </div>
  );
}
