"use client"

import { motion } from "framer-motion"
import { Download, MapPin, Mail, Github, Twitter } from "lucide-react"
import { siteConfig } from "@/config/siteConfig"
import { skills } from "@/config/skills"
import { resumeExperience as experience, education } from "@/config/experience"
import { resumeProjects as projects } from "@/config/projects"

export default function Resume({ compact = false }: { compact?: boolean }) {
  const { personal, social, contact, resumeLink } = siteConfig

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={compact ? "px-5 py-5" : "py-10"}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-[22px] font-semibold text-[var(--text-primary)] leading-tight">{personal.fullName}</h1>
          <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
            {personal.shortRole}
          </p>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
              <MapPin size={10} /> {personal.location}
            </span>
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <Mail size={10} /> {contact.email}
            </a>
            <a
              href={social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <Github size={10} /> {social.githubUsername}
            </a>
            <a
              href={social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <Twitter size={10} /> {social.twitterHandle}
            </a>
          </div>
        </div>
        <a
          href={resumeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg transition-colors flex-none"
          style={{
            background: "var(--widget-border)",
            border: "1px solid var(--widget-border)",
            color: "var(--text-secondary)",
          }}
        >
          <Download size={11} />
          Download 
        </a>
      </div>

      <div className="space-y-5">
        {/* Skills */}
        <section>
          <h2
            className="text-[11px] font-semibold uppercase tracking-widest mb-3 text-[var(--text-secondary)]"
          >
            Skills
          </h2>
          <div className="space-y-2">
            {Object.entries(skills).map(([category, items]) => (
              <div key={category} className="flex gap-3">
                <span
                  className="text-[10px] w-32 flex-none pt-0.5 text-[var(--text-muted)]"
                >
                  {category}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {items.map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{
                        background: "var(--separator)",
                        border: "1px solid var(--widget-border)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div style={{ height: "1px", background: "var(--separator)" }} />

        {/* Experience */}
        <section>
          <h2
            className="text-[11px] font-semibold uppercase tracking-widest mb-4 text-[var(--text-secondary)]"
          >
            Experience
          </h2>
          <div className="space-y-4">
            {experience.map((job, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[13px] font-semibold text-[var(--text-primary)]">{job.company}</span>
                      <span className="text-[11px] text-[var(--text-muted)]">
                        {job.role}
                      </span>
                    </div>
                    {job.subRoles && (
                      <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                        via {job.subRoles.join(" · ")}
                      </p>
                    )}
                  </div>
                  <span
                    className="text-[10px] flex-none mt-0.5 text-[var(--text-muted)]"
                  >
                    {job.period}
                  </span>
                </div>
                <ul className="space-y-1 pl-3">
                  {job.bullets.map((b, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <span
                        className="mt-[6px] w-1 h-1 rounded-full flex-none"
                        style={{ background: "var(--text-faint)" }}
                      />
                      <span
                        className="text-[11px] leading-relaxed"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {b}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        <div style={{ height: "1px", background: "var(--separator)" }} />

        {/* Projects */}
        <section>
          <h2
            className="text-[11px] font-semibold uppercase tracking-widest mb-3 text-[var(--text-secondary)]"
          >
            Selected Projects
          </h2>
          <div className="space-y-2">
            {projects.map((p, i) => (
              <div key={i} className="flex gap-3">
                <span
                  className="text-[11px] font-semibold w-40 flex-none pt-px text-[var(--text-primary)]"
                >
                  {p.name}
                </span>
                <span className="text-[11px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {p.desc}
                </span>
              </div>
            ))}
          </div>
        </section>



        <div style={{ height: "1px", background: "var(--separator)" }} />

        {/* Education */}
        <section>
          <h2
            className="text-[11px] font-semibold uppercase tracking-widest mb-3 text-[var(--text-secondary)]"
          >
            Education
          </h2>
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[13px] font-semibold text-[var(--text-primary)]">
                {education.school}
              </span>
              <p className="text-[11px] mt-0.5 text-[var(--text-muted)]">
                {education.degree}
              </p>
            </div>
            <span className="text-[10px] flex-none text-[var(--text-muted)]">
              {education.period}
            </span>
          </div>
        </section>
      </div>
    </motion.div>
  )
}
