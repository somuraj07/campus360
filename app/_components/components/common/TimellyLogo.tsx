type BrandLogoProps = {
  /** true = light wordmark for dark/navy backgrounds (sidebar); false = theme text colour. */
  isbrandLogoWhite?: boolean;
  size?: "navbar" | "auth";
};

/** The RS monogram on its own (gold tile, navy letters). Also used for app icons — see public/rs-logo.svg. */
export function RsMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <rect width="48" height="48" rx="12" fill="#D4AF37" />
      <text
        x="24"
        y="31.5"
        textAnchor="middle"
        fontFamily="var(--font-inter), Inter, 'Helvetica Neue', Arial, sans-serif"
        fontSize="21"
        fontWeight="800"
        letterSpacing="-0.5"
        fill="#1E3A5F"
      >
        RS
      </text>
      <rect x="14" y="36" width="20" height="2.4" rx="1.2" fill="#1E3A5F" opacity="0.55" />
    </svg>
  );
}

/**
 * RS Solutions brand lockup: gold RS monogram + wordmark.
 * Drawn inline so it stays crisp at any size and follows the theme.
 */
export default function BrandLogo({ isbrandLogoWhite = true, size = "navbar" }: BrandLogoProps) {
  const big = size === "auth";
  return (
    <span className="inline-flex select-none items-center gap-2.5" aria-label="RS Solutions">
      <RsMark className={big ? "h-12 w-12" : "h-9 w-9"} />
      <span className="flex items-baseline gap-1.5 leading-none">
        <span
          className={`font-extrabold tracking-tight ${big ? "text-3xl" : "text-xl"} ${
            isbrandLogoWhite ? "text-white" : "text-fg"
          }`}
        >
          RS
        </span>
        <span
          className={`font-medium tracking-tight ${big ? "text-3xl" : "text-xl"} ${
            isbrandLogoWhite ? "text-white/80" : "text-fg-muted"
          }`}
        >
          Solutions
        </span>
      </span>
    </span>
  );
}
