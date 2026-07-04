
export interface ExperienceItem {
  company: string
  role: string
  period: string
  description: string
  tech: string[]
  achievements: string[]
  links?: { type: string; url: string; label: string }[]
}

export const experience: ExperienceItem[] = [
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
