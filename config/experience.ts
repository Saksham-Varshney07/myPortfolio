
export interface RedactedOfferMeta {
  id: string
  codename: string
  maskedCompany: string
  location: string
  duration: string
  offerType: string
  revealDate: string
  cycleStartDate: string
  statusNote: string
}

export interface ExperienceItem {
  company: string
  role: string
  period: string
  description: string
  tech: string[]
  achievements: string[]
  links?: { type: string; url: string; label: string }[]
  redacted?: RedactedOfferMeta
}

export const experience: ExperienceItem[] = [
  {
    company: "[REDACTED]",
    role: "SDE Intern",
    period: "Jan 2027 – Jun 2027",
    description:
      "Incoming 6-month Software Development Engineer Intern (Remote) — company identity encrypted until joining.",
    tech: ["6 Months", "Remote", "NDA Active"],
    achievements: [
      "Accepted a 6-month remote Software Development Engineer internship offer starting January 1, 2027.",
      "Organization details, team allocation, and technical stack remain sealed until the countdown completes.",
    ],
    redacted: {
      id: "NODE_01",
      codename: "sde_intern_6m.enc",
      maskedCompany: "██████████",
      location: "Remote",
      duration: "6 Months",
      offerType: "Internship Offer",
      revealDate: "2027-01-01",
      cycleStartDate: "2026-10-01",
      statusNote: "OFFER ACCEPTED · STARTS JAN 2027",
    },
  },
  {
    company: "[REDACTED]",
    role: "AI Analyst",
    period: "Starting Jul 2027",
    description:
      "Incoming Full-Time AI Analyst @ Bangalore — beginning upon completion of the 6-month internship.",
    tech: ["Full-Time", "Bangalore", "NDA Active"],
    achievements: [
      "Accepted a full-time AI Analyst offer in Bangalore, starting immediately after the 6-month SDE internship concludes.",
      "Organization details remain encrypted under NDA until the reveal countdown finishes.",
    ],
    redacted: {
      id: "NODE_02",
      codename: "ai_analyst_blr.enc",
      maskedCompany: "████████████",
      location: "Bangalore, IN",
      duration: "Full-Time",
      offerType: "Full-Time Offer",
      revealDate: "2027-07-01",
      cycleStartDate: "2026-10-01",
      statusNote: "OFFER ACCEPTED · POST-INTERNSHIP",
    },
  },
  {
    company: "SkipQ",
    role: "AI/ML Intern",
    period: "Feb 2026 – April 2026",
    description: "Fine-tuned YOLOv8 for retail environments and engineered a real-time inference backend.",
    tech: ["YOLOv8", "Open Food Facts API", "JSON"],
    achievements: [
      "Resolved severe occlusion and lighting failures in retail environments by fine-tuning YOLOv8 on a 5,000+ image dataset, achieving a highly robust 89.4% mAP50 accuracy.",
      "Engineered a real-time inference backend operating at 15 FPS, seamlessly fusing AI object detection with hardware-accelerated EAN-13/QR scanning via the Open Food Facts API.",
      "Developed an interactive dashboard featuring live bounding-box overlays and manual region of interest cropping, automating checkout flows by generating structured JSON payloads for payment gateways."
    ],
    links: [
      { type: "github", label: "Source Code", url: "https://github.com/Saksham-Varshney07/VisionForge" }
    ]
  },
  {
    company: "Outlier.ai",
    role: "Contractor",
    period: "May 2025 – Dec 2025",
    description: "Executed RLHF pipelines on LLMs to align AI behavior with safety guidelines.",
    tech: ["RLHF", "Large Language Models"],
    achievements: [
      "Executed rigorous RLHF pipelines on Large Language Models, systematically ranking outputs to align AI behavior with safety guidelines.",
      "Streamlined AI output quality by performing detailed factual accuracy checks and providing structured qualitative feedback, achieving a 30% improvement in model coherence.",
      "Prepared multi-step research prompts to stress-test AI reasoning, utilizing deep failure analysis to heavily optimize information retrieval accuracy."
    ],
  },
  {
    company: "Fiverr",
    role: "Freelance Video Editor",
    period: "Jul 2021 – Apr 2025",
    description: "Level 2 Seller offering comprehensive video production and editing services with a global clientele.",
    tech: ["Video Production", "Video Editing", "After Effects", "Visual Effects"],
    achievements: [
      "Achieved Level 2 Seller status on the platform.",
      "Maintained a 5 ⭐ rating across over 90+ reviews, successfully completing a total of 140+ orders.",
      "Worked with a diverse global clientele spanning the US, Canada, France, UK, Denmark, Germany, Turkey, Saudi Arabia, India, Thailand, Pakistan, Malaysia, Australia, New Zealand, and Poland."
    ],
  },
]


export interface ResumeExperienceItem {
  company: string
  role: string
  period: string
  subRoles?: string[]
  bullets: string[]
}

export const resumeExperience: ResumeExperienceItem[] = [
  {
    company: "SkipQ",
    role: "AI/ML Intern",
    period: "Feb 2026 – April 2026",
    bullets: [
      "Resolved severe occlusion and lighting failures in retail environments by fine-tuning YOLOv8 on a 5,000+ image dataset, achieving a highly robust 89.4% mAP50 accuracy.",
      "Engineered a real-time inference backend operating at 15 FPS, seamlessly fusing AI object detection with hardware-accelerated EAN-13/QR scanning via the Open Food Facts API.",
      "Developed an interactive dashboard featuring live bounding-box overlays and manual region of interest cropping, automating checkout flows by generating structured JSON payloads for payment gateways."
    ],
  },
  {
    company: "Outlier.ai",
    role: "Contractor",
    period: "May 2025 – Dec 2025",
    bullets: [
      "Executed rigorous RLHF pipelines on Large Language Models, systematically ranking outputs to align AI behavior with safety guidelines.",
      "Streamlined AI output quality by performing detailed factual accuracy checks and providing structured qualitative feedback, achieving a 30% improvement in model coherence.",
      "Prepared multi-step research prompts to stress-test AI reasoning, utilizing deep failure analysis to heavily optimize information retrieval accuracy."
    ],
  },
  {
    company: "Fiverr ",
    role: "Freelance Video Editor",
    period: "Jul 2021 – Apr 2025",
    bullets: [
      "Achieved Level 2 Seller status on the platform.",
      "Maintained a 5 ⭐ rating across over 90+ reviews, successfully completing a total of 140+ orders.",
      "Worked with a diverse global clientele spanning the US, Canada, France, UK, Denmark, Germany, Turkey, Saudi Arabia, India, Thailand, Pakistan, Malaysia, Australia, New Zealand, and Poland."
    ],
  },
]


export interface EducationItem {
  school: string
  degree: string
  period: string
}

export const education: EducationItem = {
  school: "KJ Somaiya School of Engineering",
  degree: "Bachelors of Technology in Information Technology - CGPA - 9.06",
  period: "2023 – 2027",
}

export const teaching: string[] = []
