/**
 * Theme colours for inline `style` props and charts.
 *
 * These are CSS variable references (defined in app/globals.css) so they follow the
 * light/dark theme automatically. Prefer the semantic Tailwind utilities
 * (`text-primary`, `bg-elev-1`, `text-fg-muted`, …) in className; use these only where a
 * style prop or a chart library needs a colour value.
 *
 * Note: a `var(...)` cannot be suffixed with hex alpha (`${PRIMARY_COLOR}44`); use
 * `color-mix(in oklab, ${PRIMARY_COLOR} 25%, transparent)` instead.
 */

// Brand
export const PRIMARY_COLOR = "var(--primary)";
export const HOVER_COLOR = "var(--primary-hover)";
export const SECONDARY_COLOR = "var(--secondary)";
export const ACCENT_COLOR = "var(--accent)";
export const OVERLAY_COLOR = "var(--surface)";
export const APP_BG = "var(--canvas)";

/** Fixed hex values for places that can't read CSS variables (canvas export, PDFs, emails). */
export const BRAND_HEX = {
  navy: "#1E3A5F",
  sky: "#38BDF8",
  gold: "#D4AF37",
  softWhite: "#F8FAFC",
  slate: "#172B45",
} as const;

/** Categorical chart palette that reads well in both themes. */
export const CHART_COLORS = ["#2563EB", "#D4AF37", "#0EA5E9", "#16A34A", "#DC2626", "#7C3AED", "#EA580C", "#0D9488"];

// Exams & Syllabus
export const EXAM_ACCENT = "var(--primary)";
export const EXAM_ACCENT_GLOW = "transparent";
export const EXAM_UPCOMING_LABEL_BG = "color-mix(in oklab, var(--success) 14%, transparent)";
export const EXAM_COMPLETED_LABEL_BG = "var(--elev-2)";
export const EXAM_TEXT_MAIN = "var(--fg)";
export const EXAM_TEXT_SECONDARY = "var(--fg-muted)";
export const EXAM_CARD_BG_ALT = "var(--elev-2)";
export const EXAM_INPUT_BG = "var(--surface)";
export const EXAM_GRADIENT_FULL = "var(--elev-1)";
export const EXAM_PROGRESS_GREEN = "#16a34a";
export const EXAM_PROGRESS_YELLOW = "#d4af37";
export const EXAM_PROGRESS_EMPTY = "var(--elev-3)";
export const EXAM_CARD_TRANSPARENT = "var(--elev-1)";

// Circulars & Notices
export const CIRCULAR_PRIMARY = "var(--primary)";
export const CIRCULAR_SELECTED_RECIPIENT = "color-mix(in oklab, var(--primary) 14%, transparent)";
export const CIRCULAR_IMPORTANCE_HIGH = "#dc2626";
export const CIRCULAR_IMPORTANCE_MEDIUM = "#d4af37";
export const CIRCULAR_IMPORTANCE_LOW = "#0ea5e9";
export const CIRCULAR_DRAFT_YELLOW = "#d4af37";
export const CIRCULAR_PUBLISHED_GREEN = "#16a34a";

// Settings page
export const SETTINGS_BG_GRADIENT = "var(--canvas)";
export const SETTINGS_CARD_BG = "var(--elev-1)";
export const SETTINGS_INPUT_BG = "var(--surface)";
export const SETTINGS_TEXT_MAIN = "var(--fg)";
export const SETTINGS_TEXT_MUTED = "var(--fg-muted)";

// Parent dashboard background (legacy names; the blobs are gone)
export const PARENT_DASHBOARD_BG_BASE = "var(--canvas)";
export const PARENT_DASHBOARD_BG_PURPLE_BLOB = "transparent";
export const PARENT_DASHBOARD_BG_CORAL_BLOB = "transparent";
