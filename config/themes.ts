/**
 * themes.ts
 * ─────────────────────────────────────────────────────────────
 * Themes shown in the ThemeWidget swatch picker on the desktop.
 * Each theme is a pure CSS palette — no external image files. The
 * accent colour ringing the active swatch, the tiny preview
 * gradient, and the matching wallpaper are all driven from here.
 *
 * To add a theme:
 *   1. Append an entry below with a unique `key`.
 *   2. Add a `[data-theme="<key>"]` block to app/globals.css with
 *      the full set of --bg / --accent / --text tokens.
 *   3. Add a `[data-theme="<key>"] .album-wallpaper { ... }` block
 *      to globals.css for the blurred wallpaper layer.
 *
 * The "default" theme (`midnight`) has `gradient: null` — it's the
 * bare dark palette defined on `:root`.
 * ─────────────────────────────────────────────────────────────
 */

export type ThemeKey = "midnight" | "amber" | "crimson" | "rust"

export interface ThemeItem {
  key: ThemeKey
  /** Short display label under the swatch. */
  label: string
  /** Longer description shown in the header when a theme is active. */
  description: string
  /** Ring colour around the active swatch. */
  accentColor: string
  /** CSS background for the tiny preview swatch. `null` renders the default midnight sleeve. */
  gradient: string | null
}

export const themes: ThemeItem[] = [
  {
    key: "midnight",
    label: "Default",
    description: "Midnight",
    accentColor: "rgba(255,255,255,0.6)",
    gradient: null,
  },
  {
    key: "amber",
    label: "Amber",
    description: "Amber · violet night",
    accentColor: "rgba(255,175,65,0.9)",
    gradient: "linear-gradient(150deg, #0a0418 0%, #2a1550 45%, #c8741c 100%)",
  },
  {
    key: "crimson",
    label: "Crimson",
    description: "Crimson · near-black",
    accentColor: "rgba(210,30,55,0.9)",
    gradient: "linear-gradient(150deg, #0a0103 0%, #3a0712 55%, #c21934 100%)",
  },
  {
    key: "rust",
    label: "Rust",
    description: "Rust · burnt orange",
    accentColor: "rgba(255,120,35,0.9)",
    gradient: "linear-gradient(150deg, #120600 0%, #3d1800 50%, #e66b1f 100%)",
  },
]
