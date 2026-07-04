

export interface Personal {
  firstName: string
  lastName: string
  fullName: string
  initials: string
  role: string
  shortRole: string
  tagline: string
  hobbies?: string
  location: string
  age: number | string
  avatar: string
  username: string
}

export interface Social {
  github: string
  twitter: string
  githubUsername: string
  twitterHandle: string
  leetcode: string
  linkedin: string
}

export interface ContactRow {
  icon: "mail" | "calendar" | "twitter" | "github" | "linkedin"
  href: string
  label: string
  mono: string
}

export interface Contact {
  email: string
  heading: string
  subheading: string
  rows: ContactRow[]
}

export interface Seo {
  title: string
  description: string
}

export interface Features {
  konami: boolean
}

export interface SiteConfig {
  personal: Personal
  social: Social
  contact: Contact
  seo: Seo
  resumeLink: string
  features: Features
}


export const siteConfig: SiteConfig = {
  personal: {
    firstName: "Saksham",
    lastName: "Varshney",
    fullName: "Saksham Varshney",
    initials: "SV",
    role: "AI · Machine Learning · Deep Learning ·  RLHF",
    shortRole: "Full-Stack Software Engineer",
    tagline:
      "Bridging the gap between cutting-edge AI and seamless web experiences. Specializing in Machine Learning, LLM alignment, and highly scalable full-stack architectures.",
    hobbies:
      "Beyond the screen, I'm deeply passionate about playing football, reading books, solving complex puzzles, and exploring the world of VFX.",
    location: "Mumbai",
    age: 21,
    avatar: "/pixeldpmain.png",
    username: "sakshamv_007",
  },

  social: {
    github: "https://github.com/Saksham-Varshney07",
    twitter: "https://x.com/SakshamV007",
    githubUsername: "Saksham-Varshney07",
    twitterHandle: "SakshamV007",
    leetcode: "https://leetcode.com/u/Saksham__Varshney",
    linkedin: "https://www.linkedin.com/in/sakshamvarshney07/",
  },

  contact: {
    email: "sakshamvarshney0701@gmail.com",
    heading: "Let's Connect",
    subheading: "Actively exploring new opportunities. If you're building something exciting, let's talk.",
    rows: [
      { icon: "mail",     href: "mailto:sakshamvarshney0701@gmail.com",             label: "Email",           mono: "sakshamvarshney0701@gmail.com" },
      { icon: "twitter",  href: "https://x.com/SakshamV007",           label: "X",     mono: "SakshamV007" },
      { icon: "github",   href: "https://github.com/Saksham-Varshney07",      label: "GitHub",          mono: "Saksham-Varshney07" },
      { icon: "linkedin", href: "https://www.linkedin.com/in/sakshamvarshney07/", label: "LinkedIn", mono: "sakshamvarshney0701" },
    ],
  },

  seo: {
    title: "Saksham Varshney",
    description: "Personal portfolio of Saksham Varshney",
  },

  resumeLink: "/SakshamVarshney.pdf",

  features: {
    konami: false,
  },
}
