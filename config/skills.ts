/**
 * skills.ts
 * ─────────────────────────────────────────────────────────────
 * Skills grouped by category. Keys become category labels on the
 * left; values become the chip list on the right.
 *
 * Add, remove, or rename categories freely — the Résumé section
 * iterates over Object.entries(skills), so the UI adapts.
 * ─────────────────────────────────────────────────────────────
 */

export type Skills = Record<string, string[]>

export const skills: Skills = {
  "Languages":   ["C++", "C", "Python", "JavaScript"],
  "Development": ["HTML", "CSS", "NodeJS", "ExpressJS", "ReactJS","Git"],
  "Databases":   ["PostgreSQL", "MySQL", "MongoDB", "Firebase (Firestore)", "SQL"],
  "AI/ML":       ["PyTorch", "Pandas", "NumPy", "Machine Learning"],
  "Others":      ["DSA", "Computer Networks", "DBMS", "Cybersecurity", "Computer Architecture"],
}
