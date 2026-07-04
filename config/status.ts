/**
 * status.ts
 * ─────────────────────────────────────────────────────────────
 * Data for the StatusWidget shown in the desktop's top-right
 * corner. Flip `available` to false to render a muted indicator.
 *
 * The `currently` rows are free-form "label + value" pairs — add
 * or remove as many as you want.
 * ─────────────────────────────────────────────────────────────
 */

export interface StatusRow {
  /** Short label (5-10 chars reads best). */
  label: string
  value: string
}

export interface StatusConfig {
  available: boolean
  label: string
  currently: StatusRow[]
}

export const status: StatusConfig = {
  available: true,
  label: "npm hire saksham",
  currently: [
    { label: "Building", value: "Studease.in : a one stop education solution for students" },
    { label: "Reading",  value: "...." },
    { label: "Learning", value: "Algebra" },
  ],
}
