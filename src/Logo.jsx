// The logo has a transparent background. Its lettering is dark gray, so on
// dark backgrounds we show logo-dark.png (same logo, white lettering).
//   variant="auto"   follows the active theme (light page -> dark lettering)
//   variant="onDark" always uses the white-lettering version (dark panels)
export default function Logo({ variant = "auto", className = "" }) {
  const alt = "AUTOMATION LOGISTICS";

  if (variant === "onDark") {
    return <img className={className} src="/logo-dark.png" alt={alt} />;
  }

  return (
    <>
      <img className={`${className} logo-for-light`} src="/logo.png" alt={alt} />
      <img className={`${className} logo-for-dark`} src="/logo-dark.png" alt="" aria-hidden="true" />
    </>
  );
}
