// Vector logo (SVG) with a transparent background, sharp at any size. Its
// lettering is dark gray, so on dark backgrounds we show logo-dark.svg.
//   variant="auto"   follows the active theme (light page -> dark lettering)
//   variant="onDark" always uses the white-lettering version (dark panels)
export default function Logo({ variant = "auto", className = "" }) {
  const alt = "AUTOMATION LOGISTICS";

  if (variant === "onDark") {
    return <img className={className} src="/logo-dark.svg" alt={alt} />;
  }

  return (
    <>
      <img className={`${className} logo-for-light`} src="/logo.svg" alt={alt} />
      <img className={`${className} logo-for-dark`} src="/logo-dark.svg" alt="" aria-hidden="true" />
    </>
  );
}
