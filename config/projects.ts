
export interface ProjectItem {
  title: string
  description: string
  tech: string[]
  status?: string
  stars?: number
  link: string
  videoUrl?: string
}

export interface ProjectsConfig {
  personal: ProjectItem[]
}

export const projects: ProjectsConfig = {
  personal: [
    {
      title: "TubeTrail",
      description: "A Chrome extension that transforms YouTube playlists into structured learning courses, complete with progress tracking, study streaks, and cross-device sync. ",
      tech: ["JavaScript", "Firebase", "Chrome Extension API"],
      link: "https://github.com/Saksham-Varshney07/TubeTrail-YoutubePlaylistTracker",
    },
    {
      title: "ClaimMax",
      description: "An automated verification pipeline using OpenCV and ML to detect fraudulent ration cards.",
      tech: ["Python", "Machine Learning", "OpenCV"],
      link: "https://github.com/Saksham-Varshney07/ClaimMax-Insurance-Eligibility-Checker",
      videoUrl: "/demovids/ClaimMax_Workflow_Demo.mp4",
    }
  ],
}

export interface ResumeProjectItem {
  name: string
  desc: string
}

export const resumeProjects: ResumeProjectItem[] = [
  {
    name: "TubeTrail",
    desc: "Developed a MutationObserver-based DOM engine for 60 FPS UI sync on YouTube. Implemented Firebase two-way cloud sync and an anti-cheat tracking system.",
  },
  {
    name: "ClaimMax",
    desc: "Built an OpenCV/ML verification pipeline to detect fraudulent ration cards, accelerating screening by 80% and deploying a secure eligibility gatekeeper.",
  },
]
