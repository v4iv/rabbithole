import { gsap } from "gsap"

export function setupAnimations() {
  if (typeof window === "undefined") return

  document.documentElement.classList.add("gsap-animated")

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches

  const isFinePointer = window.matchMedia("(pointer: fine)").matches

  const heroRabbithole = document.querySelector(".hero-group-rabbithole")
  const heroArt = document.querySelector(".hero-group-art")
  const heroStudio = document.querySelector(".hero-group-studio")
  const heroSubtitle = document.querySelector(".hero-subtitle")
  const socialButtons = document.querySelectorAll(".social-link-btn")
  const pageFooter = document.querySelector(".page-footer")
  const heroContainer = document.querySelector(
    ".hero-container",
  ) as HTMLElement | null
  const cursorGlow = document.querySelector(
    ".cursor-glow",
  ) as HTMLElement | null
  const signatureLink = document.querySelector(".signature-link")
  const signatureArrow = document.querySelector(".signature-arrow")

  // Fallback for reduced motion
  if (prefersReducedMotion) {
    gsap.set(
      [
        heroRabbithole,
        heroArt,
        heroStudio,
        heroSubtitle,
        socialButtons,
        pageFooter,
        cursorGlow,
      ],
      {
        opacity: 1,
        visibility: "visible",
        clearProps: "all",
      },
    )
    return
  }

  /* -------------------------------------------------------------
   * 1. INITIAL STATE SETUP
   * ------------------------------------------------------------- */
  gsap.set(heroRabbithole, {
    opacity: 0,
    y: 35,
    scale: 0.96,
  })

  gsap.set(heroArt, {
    opacity: 0,
    scale: 0.8,
    rotation: -7,
    y: 22,
  })

  gsap.set(heroStudio, {
    opacity: 0,
    x: 25,
    y: 8,
  })

  gsap.set(heroSubtitle, {
    opacity: 0,
    y: 16,
  })

  gsap.set(socialButtons, {
    opacity: 0,
    y: 28,
    scale: 0.75,
  })

  gsap.set(pageFooter, {
    opacity: 0,
    y: 6,
  })

  if (cursorGlow) {
    gsap.set(cursorGlow, { opacity: 0 })
  }

  /* -------------------------------------------------------------
   * 2. MAIN ENTRANCE TIMELINE
   * ------------------------------------------------------------- */
  const masterTl = gsap.timeline({
    delay: 0.1,
    onComplete: () => {
      startAmbientAnimations()
    },
  })

  // Ambient glow fade in
  if (cursorGlow) {
    masterTl.to(
      cursorGlow,
      {
        opacity: 1,
        duration: 1.6,
        ease: "power2.out",
      },
      0,
    )
  }

  // 1. "rabbithole" - foundational bold anchor
  masterTl.to(
    heroRabbithole,
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.25,
      ease: "power3.out",
    },
    0.1,
  )

  // 2. "art" - playful handwritten flourish blossoms in
  masterTl.to(
    heroArt,
    {
      opacity: 1,
      scale: 1,
      rotation: 0,
      y: 0,
      duration: 1.35,
      ease: "back.out(1.6)",
    },
    0.35,
  )

  // 3. "STUDIO" - refined serif type settles into place
  masterTl.to(
    heroStudio,
    {
      opacity: 1,
      x: 0,
      y: 0,
      duration: 1.1,
      ease: "power3.out",
    },
    0.55,
  )

  // 4. Subtitle ("by eshale")
  masterTl.to(
    heroSubtitle,
    {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power2.out",
    },
    0.75,
  )

  // 5. Social buttons stagger in with a pop
  masterTl.to(
    socialButtons,
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.85,
      stagger: 0.09,
      ease: "back.out(1.8)",
      clearProps: "y,opacity",
    },
    0.85,
  )

  // 6. Page footer softly arrives
  masterTl.to(
    pageFooter,
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
      clearProps: "y,opacity",
    },
    1.15,
  )

  /* -------------------------------------------------------------
   * 3. AMBIENT IDLE FLOATING (The Living Canvas)
   * ------------------------------------------------------------- */
  function startAmbientAnimations() {
    // Gentle floating on the path inside "art" flourish
    // Animate inner path so outer <g> is preserved for cursor parallax
    const artPath = document.querySelector(".hero-group-art path")
    if (artPath) {
      gsap.to(artPath, {
        y: -4,
        rotation: 1,
        duration: 3.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      })
    }

    // Subtle breathing on "rabbithole"
    const rabbitholePath = document.querySelector(".hero-group-rabbithole path")
    if (rabbitholePath) {
      gsap.to(rabbitholePath, {
        y: 1.5,
        duration: 4.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      })
    }
  }

  /* -------------------------------------------------------------
   * 4. INTERACTIVE MULTI-PLANE PARALLAX & TILT (Desktop)
   * ------------------------------------------------------------- */
  if (isFinePointer && heroContainer) {
    const quickRabbitholeX = heroRabbithole
      ? gsap.quickTo(heroRabbithole, "x", { duration: 0.8, ease: "power2.out" })
      : null
    const quickRabbitholeY = heroRabbithole
      ? gsap.quickTo(heroRabbithole, "y", { duration: 0.8, ease: "power2.out" })
      : null

    const quickArtX = heroArt
      ? gsap.quickTo(heroArt, "x", { duration: 0.9, ease: "power2.out" })
      : null
    const quickArtY = heroArt
      ? gsap.quickTo(heroArt, "y", { duration: 0.9, ease: "power2.out" })
      : null

    const quickStudioX = heroStudio
      ? gsap.quickTo(heroStudio, "x", { duration: 0.75, ease: "power2.out" })
      : null
    const quickStudioY = heroStudio
      ? gsap.quickTo(heroStudio, "y", { duration: 0.75, ease: "power2.out" })
      : null

    const quickTiltX = gsap.quickTo(heroContainer, "rotationX", {
      duration: 0.8,
      ease: "power2.out",
    })
    const quickTiltY = gsap.quickTo(heroContainer, "rotationY", {
      duration: 0.8,
      ease: "power2.out",
    })

    const onPointerMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window
      const normX = e.clientX / innerWidth - 0.5
      const normY = e.clientY / innerHeight - 0.5

      // Layer 1: rabbithole (medium depth)
      quickRabbitholeX?.(normX * 12)
      quickRabbitholeY?.(normY * 8)

      // Layer 2: art (foreground depth - moves more)
      quickArtX?.(normX * 24)
      quickArtY?.(normY * 16)

      // Layer 3: studio (subtle counter parallax)
      quickStudioX?.(-normX * 14)
      quickStudioY?.(-normY * 9)

      // 3D stage tilt
      quickTiltX(-normY * 4.5)
      quickTiltY(normX * 6)

      // Ambient cursor glow position
      if (cursorGlow) {
        cursorGlow.style.setProperty("--glow-x", `${e.clientX}px`)
        cursorGlow.style.setProperty("--glow-y", `${e.clientY}px`)
      }
    }

    const onMouseLeave = () => {
      quickRabbitholeX?.(0)
      quickRabbitholeY?.(0)
      quickArtX?.(0)
      quickArtY?.(0)
      quickStudioX?.(0)
      quickStudioY?.(0)
      quickTiltX(0)
      quickTiltY(0)
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true })
    document.addEventListener("mouseleave", onMouseLeave)
  }

  /* -------------------------------------------------------------
   * 5. SOCIAL BUTTON HOVER MICRO-INTERACTIONS (100% Reliable Clicks)
   * ------------------------------------------------------------- */
  socialButtons.forEach((btn) => {
    const el = btn as HTMLElement
    const icon = el.querySelector("svg")

    el.addEventListener("mouseenter", () => {
      gsap.to(el, {
        scale: 1.15,
        duration: 0.25,
        ease: "power2.out",
      })
      if (icon) {
        gsap.to(icon, {
          rotate: 6,
          scale: 1.08,
          duration: 0.25,
          ease: "power2.out",
        })
      }
    })

    el.addEventListener("mouseleave", () => {
      gsap.to(el, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      })
      if (icon) {
        gsap.to(icon, {
          rotate: 0,
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        })
      }
    })
  })

  /* -------------------------------------------------------------
   * 6. SIGNATURE LINK MICRO-INTERACTION
   * ------------------------------------------------------------- */
  if (signatureLink && signatureArrow) {
    signatureLink.addEventListener("mouseenter", () => {
      gsap.to(signatureArrow, {
        x: 3,
        y: -3,
        duration: 0.3,
        ease: "back.out(2)",
      })
    })

    signatureLink.addEventListener("mouseleave", () => {
      gsap.to(signatureArrow, {
        x: 0,
        y: 0,
        duration: 0.25,
        ease: "power2.out",
      })
    })
  }
}

// Auto-run when DOM is ready
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupAnimations)
  } else {
    setupAnimations()
  }
}
