"use client"

import React, { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Loader2, Terminal } from "lucide-react"
import * as THREE from "three"

interface Step {
  id: string
  label: string
  detail: string
  triggerTime: number
  completeTime: number
}

const STEPS: Step[] = [
  { id: "sys", label: "Starting system", detail: "Kernel initialization & core services", triggerTime: 0.2, completeTime: 1.3 },
  { id: "exp", label: "Gathering experience", detail: "Software development & AI/ML modules", triggerTime: 1.3, completeTime: 2.4 },
  { id: "prj", label: "Building projects", detail: "Compiling interactive showcases", triggerTime: 2.4, completeTime: 3.6 },
  { id: "stk", label: "Indexing skills & stack", detail: "Next.js, TypeScript, React & Three.js", triggerTime: 3.6, completeTime: 4.8 },
  { id: "cal", label: "Calibrating desktop", detail: "Mounting widgets, dock & window manager", triggerTime: 4.8, completeTime: 5.9 },
  { id: "rdy", label: "Launching workspace", detail: "Opening portfolio interface", triggerTime: 5.9, completeTime: 7.2 },
]

interface BootLoadingScreenProps {
  onComplete: () => void
}

function smoothstep(min: number, max: number, value: number) {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)))
  return x * x * (3 - 2 * x)
}

// Create a smooth radial gradient shadow texture for the chair base
function createFloorShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas")
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext("2d")!
  const gradient = ctx.createRadialGradient(64, 64, 10, 64, 64, 60)
  gradient.addColorStop(0, "rgba(0, 0, 0, 0.75)")
  gradient.addColorStop(0.5, "rgba(0, 0, 0, 0.35)")
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)")
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 128, 128)
  const texture = new THREE.CanvasTexture(canvas)
  return texture
}

// Create an ergonomic contoured backrest with smooth rounded corners - zero boxy edges!
function createErgonomicBackrestGeo(): THREE.BufferGeometry {
  const shape = new THREE.Shape()
  const w = 0.28 // half-width
  const h = 0.36 // half-height
  const r = 0.08 // corner radius

  // Smooth contoured shape with rounded corners
  shape.moveTo(-w + r, -h)
  shape.lineTo(w - r, -h)
  shape.quadraticCurveTo(w, -h, w, -h + r)
  shape.lineTo(w * 0.88, h - r)
  shape.quadraticCurveTo(w * 0.88, h, w * 0.88 - r, h)
  shape.lineTo(-w * 0.88 + r, h)
  shape.quadraticCurveTo(-w * 0.88, h, -w * 0.88, h - r)
  shape.lineTo(-w, -h + r)
  shape.quadraticCurveTo(-w, -h, -w + r, -h)

  return new THREE.ExtrudeGeometry(shape, {
    depth: 0.035,
    bevelEnabled: true,
    bevelSegments: 5,
    steps: 1,
    bevelSize: 0.02,
    bevelThickness: 0.02,
  })
}

export default function BootLoadingScreen({ onComplete }: BootLoadingScreenProps) {
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const blackoutRef = useRef<HTMLDivElement>(null)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const hasCompletedRef = useRef(false)

  // -------------------------------------------------------------
  // 3D Scene: Roll-In -> Desk Work -> Roll-Out to Black & Complete
  // -------------------------------------------------------------
  useEffect(() => {
    const container = canvasContainerRef.current
    if (!container) return

    let animationFrameId: number

    // Scene & Camera (Stable centered POV shot looking straight down the room center)
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    )
    camera.position.set(0, 1.38, 4.2)
    camera.lookAt(0, 1.05, 0)

    // WebGL Renderer with transparency so the centered room backdrop shines through
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    container.appendChild(renderer.domElement)

    // ---------------- LIGHTING ----------------
    // Ambient warmth from the room
    const ambientLight = new THREE.AmbientLight(0xffdfc4, 0.85)
    scene.add(ambientLight)

    // Warm desk lamp on left
    const lampSpot = new THREE.SpotLight(0xffae58, 4.0, 10, Math.PI / 3.5, 0.7, 1.2)
    lampSpot.position.set(-2.0, 2.5, 0.2)
    lampSpot.target.position.set(0, 0.9, 0)
    scene.add(lampSpot)
    scene.add(lampSpot.target)

    // Cool cyan/blue screen point light in front
    const screenLight = new THREE.PointLight(0x60a5fa, 2.2, 6)
    screenLight.position.set(0, 1.35, -0.6)
    scene.add(screenLight)

    // Subtle warm rim light on right
    const pcRimLight = new THREE.PointLight(0xf59e0b, 1.6, 6)
    pcRimLight.position.set(2.2, 1.2, 0.1)
    scene.add(pcRimLight)

    // ---------------- RIG: CHAIR + BOY ----------------
    const rig = new THREE.Group()
    scene.add(rig)

    // Soft floor shadow attached to the rig
    const shadowTexture = createFloorShadowTexture()
    const shadowGeo = new THREE.PlaneGeometry(2.4, 2.4)
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
    })
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat)
    shadowMesh.rotation.x = -Math.PI / 2
    shadowMesh.position.y = 0.01
    rig.add(shadowMesh)

    // ---------------- CHAIR GEOMETRY (ERGONOMIC ROUNDED) ----------------
    const chairGroup = new THREE.Group()
    rig.add(chairGroup)

    const darkMetalMat = new THREE.MeshStandardMaterial({
      color: 0x181a20,
      metalness: 0.8,
      roughness: 0.35,
    })
    const chairMeshMat = new THREE.MeshStandardMaterial({
      color: 0x222630,
      roughness: 0.85,
      metalness: 0.15,
    })
    const chairCushionMat = new THREE.MeshStandardMaterial({
      color: 0x1b1e26,
      roughness: 0.9,
    })

    // 5-Spoke Star Base
    const baseGroup = new THREE.Group()
    baseGroup.position.y = 0.1
    chairGroup.add(baseGroup)

    const casterWheels: THREE.Mesh[] = []
    const wheelGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.04, 16)
    const spokeGeo = new THREE.BoxGeometry(0.05, 0.035, 0.46)

    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5
      const spoke = new THREE.Mesh(spokeGeo, darkMetalMat)
      spoke.position.set(Math.sin(angle) * 0.23, 0.02, Math.cos(angle) * 0.23)
      spoke.rotation.y = angle
      baseGroup.add(spoke)

      const wheel = new THREE.Mesh(wheelGeo, darkMetalMat)
      wheel.rotation.z = Math.PI / 2
      wheel.position.set(Math.sin(angle) * 0.44, -0.04, Math.cos(angle) * 0.44)
      baseGroup.add(wheel)
      casterWheels.push(wheel)
    }

    // Hydraulic stem
    const stemGeo = new THREE.CylinderGeometry(0.045, 0.05, 0.42, 20)
    const stem = new THREE.Mesh(stemGeo, darkMetalMat)
    stem.position.y = 0.31
    chairGroup.add(stem)

    // Seat cushion - rounded contoured cylinder
    const seatGeo = new THREE.CylinderGeometry(0.44, 0.42, 0.1, 32)
    const seat = new THREE.Mesh(seatGeo, chairCushionMat)
    seat.position.y = 0.54
    seat.scale.set(1.0, 1.0, 1.05)
    chairGroup.add(seat)

    // Curved spine support
    const spineGeo = new THREE.CylinderGeometry(0.024, 0.028, 0.72, 16)
    const spine = new THREE.Mesh(spineGeo, darkMetalMat)
    spine.position.set(0, 0.94, 0.33)
    spine.rotation.x = -0.12
    chairGroup.add(spine)

    // Contoured mesh backrest (Ergonomic rounded shape - NO sharp boxy edges!)
    const backrestGeo = createErgonomicBackrestGeo()
    const backrest = new THREE.Mesh(backrestGeo, chairMeshMat)
    backrest.position.set(0, 0.98, 0.31)
    backrest.rotation.x = -0.12
    chairGroup.add(backrest)

    // Rounded lumbar support cushion
    const lumbarGeo = new THREE.CapsuleGeometry(0.04, 0.28, 12, 16)
    const lumbar = new THREE.Mesh(lumbarGeo, chairCushionMat)
    lumbar.rotation.z = Math.PI / 2
    lumbar.position.set(0, 0.82, 0.32)
    chairGroup.add(lumbar)

    // Armrests with smooth rounded capsule pads - NO sharp corners!
    const armSupportGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.26, 12)
    const armPadGeo = new THREE.CapsuleGeometry(0.032, 0.22, 12, 16)

    // Left armrest
    const leftArmSupport = new THREE.Mesh(armSupportGeo, darkMetalMat)
    leftArmSupport.position.set(-0.44, 0.67, 0.05)
    chairGroup.add(leftArmSupport)
    const leftArmPad = new THREE.Mesh(armPadGeo, chairCushionMat)
    leftArmPad.rotation.x = Math.PI / 2
    leftArmPad.position.set(-0.44, 0.8, 0.05)
    chairGroup.add(leftArmPad)

    // Right armrest
    const rightArmSupport = new THREE.Mesh(armSupportGeo, darkMetalMat)
    rightArmSupport.position.set(0.44, 0.67, 0.05)
    chairGroup.add(rightArmSupport)
    const rightArmPad = new THREE.Mesh(armPadGeo, chairCushionMat)
    rightArmPad.rotation.x = Math.PI / 2
    rightArmPad.position.set(0.44, 0.8, 0.05)
    chairGroup.add(rightArmPad)

    // ---------------- BOY GEOMETRY (PIXAR STYLE) ----------------
    const boyGroup = new THREE.Group()
    rig.add(boyGroup)

    const hoodieMat = new THREE.MeshStandardMaterial({
      color: 0x1f2738, // Cozy dark navy hoodie
      roughness: 0.92,
      metalness: 0.05,
    })
    const pantsMat = new THREE.MeshStandardMaterial({
      color: 0x161922, // Dark jogger pants
      roughness: 0.88,
    })
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xdeb091, // Warm stylized skin
      roughness: 0.65,
    })
    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x18110b, // Dark brown fluffy Pixar hair
      roughness: 0.85,
    })
    const sneakerMat = new THREE.MeshStandardMaterial({
      color: 0xedf1f7, // Clean white sneakers
      roughness: 0.45,
    })

    // Legs / Pants
    const legGeo = new THREE.CylinderGeometry(0.12, 0.09, 0.52, 16)
    const leftLeg = new THREE.Mesh(legGeo, pantsMat)
    leftLeg.position.set(-0.2, 0.32, -0.06)
    leftLeg.rotation.x = 0.25
    boyGroup.add(leftLeg)

    const rightLeg = new THREE.Mesh(legGeo, pantsMat)
    rightLeg.position.set(0.2, 0.32, -0.06)
    rightLeg.rotation.x = 0.25
    boyGroup.add(rightLeg)

    // White sneakers
    const shoeGeo = new THREE.BoxGeometry(0.14, 0.11, 0.26)
    const leftShoe = new THREE.Mesh(shoeGeo, sneakerMat)
    leftShoe.position.set(-0.2, 0.07, 0.06)
    boyGroup.add(leftShoe)

    const rightShoe = new THREE.Mesh(shoeGeo, sneakerMat)
    rightShoe.position.set(0.2, 0.07, 0.06)
    boyGroup.add(rightShoe)

    // Torso / Oversized Hoodie
    const torsoGroup = new THREE.Group()
    torsoGroup.position.set(0, 0.62, 0.08)
    boyGroup.add(torsoGroup)

    const hoodieBodyGeo = new THREE.CylinderGeometry(0.34, 0.38, 0.62, 24)
    const hoodieBody = new THREE.Mesh(hoodieBodyGeo, hoodieMat)
    hoodieBody.position.y = 0.31
    hoodieBody.scale.set(1.0, 1.0, 0.85)
    torsoGroup.add(hoodieBody)

    // Bunched hood around neck/shoulders
    const hoodRollGeo = new THREE.TorusGeometry(0.22, 0.09, 16, 28)
    const hoodRoll = new THREE.Mesh(hoodRollGeo, hoodieMat)
    hoodRoll.position.set(0, 0.62, 0.12)
    hoodRoll.rotation.x = Math.PI / 2.3
    torsoGroup.add(hoodRoll)

    // Head & Neck
    const headGroup = new THREE.Group()
    headGroup.position.set(0, 0.72, 0.02)
    torsoGroup.add(headGroup)

    const neckGeo = new THREE.CylinderGeometry(0.1, 0.11, 0.14, 16)
    const neck = new THREE.Mesh(neckGeo, skinMat)
    neck.position.y = 0.07
    headGroup.add(neck)

    // Head sphere
    const headGeo = new THREE.SphereGeometry(0.26, 24, 24)
    const head = new THREE.Mesh(headGeo, skinMat)
    head.position.set(0, 0.26, 0)
    headGroup.add(head)

    // Pixar messy fluffy hair (composed of clustered rounded tufts)
    const hairGroup = new THREE.Group()
    headGroup.add(hairGroup)

    const mainHairGeo = new THREE.SphereGeometry(0.29, 20, 20)
    const mainHair = new THREE.Mesh(mainHairGeo, hairMat)
    mainHair.position.set(0, 0.32, 0.02)
    mainHair.scale.set(1.02, 1.05, 1.02)
    hairGroup.add(mainHair)

    // Fluffy tufts on crown and sides
    const tuftGeo = new THREE.DodecahedronGeometry(0.12, 1)
    const tuftPositions = [
      [0, 0.52, 0.05],
      [-0.14, 0.48, 0.08],
      [0.14, 0.49, 0.06],
      [-0.2, 0.38, 0.05],
      [0.2, 0.39, 0.04],
      [0, 0.44, 0.22],
      [-0.12, 0.34, 0.2],
      [0.12, 0.35, 0.19],
      [-0.08, 0.53, -0.06],
      [0.08, 0.54, -0.05],
    ]
    tuftPositions.forEach(([x, y, z]) => {
      const tuft = new THREE.Mesh(tuftGeo, hairMat)
      tuft.position.set(x, y, z)
      tuft.rotation.set(Math.random(), Math.random(), Math.random())
      hairGroup.add(tuft)
    })

    // Stylized ears
    const earGeo = new THREE.SphereGeometry(0.06, 12, 12)
    const leftEar = new THREE.Mesh(earGeo, skinMat)
    leftEar.position.set(-0.25, 0.25, 0.01)
    headGroup.add(leftEar)
    const rightEar = new THREE.Mesh(earGeo, skinMat)
    rightEar.position.set(0.25, 0.25, 0.01)
    headGroup.add(rightEar)

    // ---------------- ARMS & SLEEVES (SMOOTH ROUNDED SHOULDERS) ----------------
    // Upper shoulder slope/yoke on the hoodie for natural rounded shoulders
    const shoulderYokeGeo = new THREE.SphereGeometry(0.36, 24, 16)
    const shoulderYoke = new THREE.Mesh(shoulderYokeGeo, hoodieMat)
    shoulderYoke.position.set(0, 0.54, -0.01)
    shoulderYoke.scale.set(1.12, 0.42, 0.88)
    torsoGroup.add(shoulderYoke)

    // Smooth rounded capsule sleeves and shoulder spheres - ZERO chopped-off flat edges!
    const armGeo = new THREE.CapsuleGeometry(0.082, 0.32, 16, 16)
    const shoulderGeo = new THREE.SphereGeometry(0.092, 20, 20)
    const cuffGeo = new THREE.CylinderGeometry(0.082, 0.08, 0.06, 16)
    const handGeo = new THREE.SphereGeometry(0.06, 12, 12)

    // Left Arm
    const leftArmGroup = new THREE.Group()
    leftArmGroup.position.set(-0.35, 0.54, 0.05)
    torsoGroup.add(leftArmGroup)

    const leftShoulder = new THREE.Mesh(shoulderGeo, hoodieMat)
    leftArmGroup.add(leftShoulder)

    const leftArm = new THREE.Mesh(armGeo, hoodieMat)
    leftArmGroup.add(leftArm)

    // Matching dark hoodie cuff
    const leftCuff = new THREE.Mesh(cuffGeo, hoodieMat)
    leftCuff.position.set(0, -0.2, 0)
    leftArm.add(leftCuff)

    // Hand sphere (Only visible in front of cuff when typing at the keyboard - ZERO skin patches visible from behind!)
    const leftHand = new THREE.Mesh(handGeo, skinMat)
    leftHand.visible = false
    leftArmGroup.add(leftHand)

    // Right Arm
    const rightArmGroup = new THREE.Group()
    rightArmGroup.position.set(0.35, 0.54, 0.05)
    torsoGroup.add(rightArmGroup)

    const rightShoulder = new THREE.Mesh(shoulderGeo, hoodieMat)
    rightArmGroup.add(rightShoulder)

    const rightArm = new THREE.Mesh(armGeo, hoodieMat)
    rightArmGroup.add(rightArm)

    // Matching dark hoodie cuff
    const rightCuff = new THREE.Mesh(cuffGeo, hoodieMat)
    rightCuff.position.set(0, -0.2, 0)
    rightArm.add(rightCuff)

    // Hand sphere (Only visible in front of cuff when typing at the keyboard)
    const rightHand = new THREE.Mesh(handGeo, skinMat)
    rightHand.visible = false
    rightArmGroup.add(rightHand)

    // ---------------- FLOATING DUST PARTICLES ----------------
    const particleCount = 45
    const particlePositions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 5
      particlePositions[i + 1] = 0.5 + Math.random() * 2.5
      particlePositions[i + 2] = (Math.random() - 0.5) * 4
    }
    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3))
    const particleMat = new THREE.PointsMaterial({
      size: 0.025,
      color: 0xffd8a8,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    })
    const dustParticles = new THREE.Points(particleGeo, particleMat)
    scene.add(dustParticles)

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }
    window.addEventListener("resize", handleResize)

    // -----------------------------------------------------------
    // CINEMATIC SINGLE-PASS FLOW:
    // Roll-In -> Typing & Loading -> Roll-Out to Black -> 100% -> Open About Card
    // -----------------------------------------------------------
    const clock = new THREE.Clock()
    let prevRigZ = 3.6

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      let chairZ = 0
      let forwardLean = 0
      let handsBlend = 0 // 0 = resting clean on armrests, 1 = typing at desk
      let isTyping = false
      let jiggleZ = 0
      let jigglePitch = 0
      let blackoutAlpha = 0

      // PHASE 1: Coming straight in from the center (0.0s to 1.8s)
      if (t < 1.8) {
        const p = smoothstep(0, 1.8, t)
        // Rolls from camera plane (z = 3.5) straight forward to desk (z = 0.0)
        chairZ = 3.5 * (1 - p)
        forwardLean = p * 0.09

        // Screen unveils from pitch black as chair rolls into the room
        blackoutAlpha = 1.0 - smoothstep(0.0, 0.7, t)
        handsBlend = 0.0
      }
      // PHASE 1.5: Braking & Jiggle Physics on arrival at desk (1.8s to 2.4s)
      else if (t < 2.4) {
        chairZ = 0.0
        forwardLean = 0.09
        blackoutAlpha = 0.0

        // Hands smoothly lift from armrests and place onto keyboard
        handsBlend = smoothstep(1.8, 2.3, t)
        isTyping = false

        // Smooth, soft cushion settle on stopping - minimal bump
        const elapsedSinceBrake = t - 1.8
        const decay = Math.exp(-elapsedSinceBrake * 8.0)
        const osc = Math.sin(elapsedSinceBrake * 12.0)
        jiggleZ = osc * decay * 0.012
        jigglePitch = osc * decay * 0.025
      }
      // PHASE 2: Working actively at the PC while system steps load (2.4s to 5.6s)
      else if (t < 5.6) {
        chairZ = 0.0
        forwardLean = 0.09
        handsBlend = 1.0
        isTyping = true
        blackoutAlpha = 0.0

        const workTime = t - 2.4
        jigglePitch = Math.sin(workTime * 20) * 0.002
        jiggleZ = Math.sin(workTime * 24) * 0.001
      }
      // PHASE 3: Roll out backward towards camera (5.6s to 7.3s)
      else if (t < 7.3) {
        const p = smoothstep(5.6, 7.3, t)
        // Rolls straight backward from desk (z = 0.0) to camera lens (z = 3.6)
        chairZ = 3.6 * p
        forwardLean = 0.09 * (1 - p) - p * 0.06 // leans back comfortably

        // Hands lift off keyboard and rest back on armrests
        if (t < 6.0) {
          handsBlend = 1.0 - smoothstep(5.6, 6.0, t)
        } else {
          handsBlend = 0.0
        }

        // Chair backrest approaches camera and makes screen fade to pitch black!
        blackoutAlpha = smoothstep(6.2, 7.3, t)

        // Gentle push-off
        if (t - 5.6 < 0.35) {
          const pushP = (t - 5.6) / 0.35
          jigglePitch = -Math.sin(pushP * Math.PI) * 0.025
        }
      }
      // PHASE 4: Full Blackout & Completion (t >= 7.3s)
      else {
        chairZ = 3.6
        forwardLean = -0.06
        handsBlend = 0.0
        blackoutAlpha = 1.0

        // Synchronized handoff: As screen goes pure black, loading completes!
        if (!hasCompletedRef.current) {
          hasCompletedRef.current = true
          setTimeout(() => {
            onComplete()
          }, 150)
        }
      }

      // ---------------- SYNCHRONIZED PROGRESS & STEPS ----------------
      // Progress fills smoothly to 100% right as the chair hits camera (at t = 7.3s)
      const currentPct = Math.min(100, Math.round((Math.min(t, 7.3) / 7.3) * 100))
      setProgress(currentPct)

      // Update completed steps dynamically based on timeline
      const activeIdx = STEPS.findIndex((s) => t >= s.triggerTime && t < s.completeTime)
      if (activeIdx !== -1) {
        setCurrentStepIndex(activeIdx)
      } else if (t >= 7.2) {
        setCurrentStepIndex(STEPS.length - 1)
      }

      const newlyDone = STEPS.filter((s) => t >= s.completeTime).map((s) => s.id)
      setCompletedSteps(newlyDone)

      // Update Blackout Overlay in real time at 60fps
      if (blackoutRef.current) {
        blackoutRef.current.style.opacity = blackoutAlpha.toFixed(3)
      }

      // Roll caster wheels with displacement
      const deltaZ = chairZ - prevRigZ
      casterWheels.forEach((wheel) => {
        wheel.rotation.x += deltaZ * 14
      })
      prevRigZ = chairZ

      // Apply centered position lowered to perfectly match the wooden table height
      rig.position.x = 0
      rig.position.y = -0.36
      rig.position.z = chairZ + jiggleZ
      rig.rotation.y = 0
      torsoGroup.rotation.x = forwardLean + jigglePitch

      // ---------------- DYNAMIC ARMS & HANDS ----------------
      // When hands are on armrests (handsBlend === 0), they rest naturally with NO visible skin patches!
      // When hands reach onto keyboard (handsBlend > 0.4), the skin hand spheres appear at the keyboard in front of the sleeves!
      const showHandsAtKeyboard = handsBlend > 0.35
      leftHand.visible = showHandsAtKeyboard
      rightHand.visible = showHandsAtKeyboard

      // Left Arm rotation & position
      const leftRotX = THREE.MathUtils.lerp(-0.18, -0.85, handsBlend)
      const leftRotY = THREE.MathUtils.lerp(0.08, 0.2, handsBlend)
      const leftRotZ = THREE.MathUtils.lerp(-0.18, -0.25, handsBlend)
      leftArm.rotation.set(leftRotX, leftRotY, leftRotZ)
      leftArm.position.set(-0.06, -0.16, THREE.MathUtils.lerp(0.0, -0.18, handsBlend))

      // Right Arm rotation & position
      const rightRotX = THREE.MathUtils.lerp(-0.18, -0.85, handsBlend)
      const rightRotY = THREE.MathUtils.lerp(-0.08, -0.2, handsBlend)
      const rightRotZ = THREE.MathUtils.lerp(0.18, 0.25, handsBlend)
      rightArm.rotation.set(rightRotX, rightRotY, rightRotZ)
      rightArm.position.set(0.06, -0.16, THREE.MathUtils.lerp(0.0, -0.18, handsBlend))

      // Hand positions (positioned strictly in front of the cuffs when typing at keyboard)
      leftHand.position.set(-0.02, -0.32, -0.34)
      rightHand.position.set(0.02, -0.32, -0.34)

      // When actively typing at the desk
      if (isTyping) {
        const workTime = t - 2.4
        // Typing micro-motion for hands
        leftArmGroup.position.y = 0.54 + Math.sin(workTime * 18) * 0.012
        rightArmGroup.position.y = 0.54 + Math.sin(workTime * 14 + 1.2) * 0.01
        rightHand.position.x = 0.04 + Math.sin(workTime * 6) * 0.02 // moving mouse

        // Head scanning dual code screens
        headGroup.rotation.y = Math.sin(workTime * 2.5) * 0.08
        headGroup.rotation.x = Math.sin(workTime * 3.8) * 0.02 - 0.04 + jigglePitch * 0.4

        // Screen light pulsing subtly
        screenLight.intensity = 2.0 + Math.sin(workTime * 10) * 0.35
      } else {
        // Natural posture while rolling with hands cleanly on chair armrests
        leftArmGroup.position.y = 0.54
        rightArmGroup.position.y = 0.54
        headGroup.rotation.y *= 0.92
        headGroup.rotation.x = forwardLean * 0.5 + jigglePitch * 0.4
        screenLight.intensity = 1.8
      }

      // Breathing motion
      const breath = Math.sin(t * 2.4) * 0.012
      hoodieBody.scale.y = 1.0 + breath

      // Subtle dust motes float through the lamp beam
      const positions = dustParticles.geometry.attributes.position.array as Float32Array
      for (let i = 1; i < particleCount * 3; i += 3) {
        positions[i] += 0.0016
        if (positions[i] > 3.0) positions[i] = 0.5
      }
      dustParticles.geometry.attributes.position.needsUpdate = true

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", handleResize)

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }

      renderer.dispose()
    }
  }, [onComplete])

  // Allow ESC to skip immediately
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !hasCompletedRef.current) {
        hasCompletedRef.current = true
        onComplete()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-between select-none overflow-hidden"
    >
      {/* Pixar-Style Centered Room Background */}
      <div
        className="absolute inset-0 z-0 bg-cover transition-transform duration-700 ease-out"
        style={{
          backgroundImage: "url('/boot-room-centered-empty.jpg')",
          backgroundPosition: "center top",
          filter: "brightness(0.96)",
        }}
      />

      {/* Atmospheric Vignette & Soft Gradient Overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 50% 45%, transparent 40%, rgba(5, 7, 15, 0.4) 80%, rgba(2, 3, 8, 0.88) 100%),
            linear-gradient(to top, rgba(2, 3, 8, 0.95) 0%, transparent 40%)
          `,
        }}
      />

      {/* 3D WebGL Canvas Layer (Boy & Sliding Chair) */}
      <div
        ref={canvasContainerRef}
        className="absolute inset-0 z-10 pointer-events-none"
      />

      {/* Cinematic Match-Cut Blackout Overlay (Triggered when chair reaches camera) */}
      <div
        ref={blackoutRef}
        className="absolute inset-0 z-15 bg-black pointer-events-none transition-none"
        style={{ opacity: 1 }}
      />

      {/* Top Subtle OS Badge */}
      <motion.div
        initial={{ y: -15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="relative z-20 mt-4 flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md bg-black/40 text-[10px] font-mono text-white/70"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="tracking-widest uppercase">Saksham OS // Boot Sequence</span>
      </motion.div>

      {/* Bottom HUD: System Loading Progress & Checkpoints */}
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative z-20 w-[94%] max-w-[640px] mb-5 rounded-2xl p-4 overflow-hidden"
        style={{
          background: "rgba(10, 14, 26, 0.38)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          border: "1px solid rgba(255, 255, 255, 0.14)",
          borderTop: "1px solid rgba(255, 255, 255, 0.28)",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.12), 0 0 25px rgba(56, 189, 248, 0.08)",
        }}
      >
        {/* Terminal Header Row */}
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/[0.08]">
          <div className="flex items-center gap-2 font-mono text-[10px] text-white/60 tracking-widest">
            <Terminal size={12} className="text-cyan-400" />
            <span className="font-semibold text-white/80">SYSTEM_BOOT.sh</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-cyan-400">
              {progress}%
            </span>
            <button
              type="button"
              onClick={() => {
                if (!hasCompletedRef.current) {
                  hasCompletedRef.current = true
                  onComplete()
                }
              }}
              className="text-white/40 hover:text-white/80 transition-colors uppercase font-mono text-[9px] tracking-widest px-2 py-0.5 rounded border border-white/[0.08] hover:border-white/20 cursor-pointer"
            >
              Skip [ESC]
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden mb-3.5 relative">
          <motion.div
            className="h-full rounded-full relative"
            style={{
              background: "linear-gradient(90deg, #f59e0b 0%, #38bdf8 50%, #4ade80 100%)",
              boxShadow: "0 0 12px rgba(56, 189, 248, 0.6)",
            }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut", duration: 0.15 }}
          />
        </div>

        {/* Grid of Steps (2 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-mono">
          {STEPS.map((step, idx) => {
            const isDone = completedSteps.includes(step.id)
            const isCurrent = currentStepIndex === idx && !isDone

            return (
              <div
                key={step.id}
                className={`flex items-center justify-between text-[11px] px-2.5 py-1.5 rounded transition-all duration-200 ${
                  isCurrent
                    ? "bg-cyan-500/10 border border-cyan-500/30 text-white"
                    : isDone
                    ? "bg-white/[0.02] text-white/85"
                    : "text-white/30"
                }`}
              >
                <div className="flex items-center gap-2 truncate pr-1">
                  <div className="w-4 h-4 flex-none flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      {isDone ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 450, damping: 25 }}
                          className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 border border-emerald-400/60 flex items-center justify-center text-emerald-400 shadow-[0_0_8px_rgba(74,222,128,0.4)]"
                        >
                          <Check size={9} strokeWidth={3} />
                        </motion.div>
                      ) : isCurrent ? (
                        <motion.div
                          key="loader"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-cyan-400"
                        >
                          <Loader2 size={12} className="animate-spin" />
                        </motion.div>
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                      )}
                    </AnimatePresence>
                  </div>

                  <span className="tracking-wide capitalize truncate">
                    {step.label}
                  </span>
                </div>

                <span
                  className={`text-[8.5px] uppercase font-mono tracking-wider flex-none ${
                    isDone
                      ? "text-emerald-400 font-semibold"
                      : isCurrent
                      ? "text-cyan-400 animate-pulse"
                      : "text-white/20"
                  }`}
                >
                  {isDone ? "[ OK ]" : isCurrent ? "[ RUN ]" : "[ WAIT ]"}
                </span>
              </div>
            )
          })}
        </div>
      </motion.div>
    </motion.div>
  )
}
