

import {
  CircleUserRound, Compass, Blocks, Send, FileBadge
} from "lucide-react"


import Hero       from "@/app/components/Hero"
import Experience from "@/app/components/sections/Experience"
import Projects   from "@/app/components/sections/Projects"
import Contact    from "@/app/components/sections/Contact"
import Resume     from "@/app/components/sections/Resume"

export interface WindowContext {

  onOpen: (id: WindowId) => void
  onClose: (id: WindowId) => void
}

export type WindowId =
  | "about" | "experience" | "projects" | "contact"
  | "resume"

export interface WindowDef {
  id: WindowId
  title: string
  icon: React.ElementType
  width: number
  height: number
  offsetX: number
  offsetY: number
  component: React.ComponentType<any>
}

export const windows: WindowDef[] = [
  { id: "about",      title: "About",      icon: CircleUserRound, width: 560, height: 480, offsetX: 0, offsetY: 30, component: Hero },
  { id: "experience", title: "Experience", icon: Compass,        width: 680, height: 570, offsetX: 0, offsetY: 40, component: Experience },
  { id: "projects",   title: "Projects",   icon: Blocks,         width: 720, height: 570, offsetX: 0, offsetY: 40, component: Projects },
  { id: "contact",    title: "Contact",    icon: Send,           width: 460, height: 420, offsetX: 0, offsetY: 40, component: Contact },
  { id: "resume",     title: "Resume",     icon: FileBadge,      width: 660, height: 580, offsetX: 0, offsetY: 40, component: Resume },
]

export function getWindow(id: WindowId): WindowDef | undefined {
  return windows.find((w) => w.id === id)
}
