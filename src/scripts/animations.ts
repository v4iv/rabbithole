import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import type { Artwork } from "@/types/artwork"
import type { FashionWork } from "@/types/fashion"

gsap.registerPlugin(ScrollTrigger)

// Retrieve artworks from the server-rendered script tag (source of truth: src/content/artworks.md)
function getArtworks(): Artwork[] {
  if (typeof document === "undefined") return []
  const el = document.getElementById("artworks-data")
  if (el?.textContent) {
    try {
      return JSON.parse(el.textContent) as Artwork[]
    } catch (e) {
      console.error("Failed to parse artworks-data", e)
    }
  }
  return []
}

// Retrieve fashion works from the server-rendered script tag (source of truth: src/content/fashion.md)
function getFashionWorks(): FashionWork[] {
  if (typeof document === "undefined") return []
  const el = document.getElementById("fashion-data")
  if (el?.textContent) {
    try {
      return JSON.parse(el.textContent) as FashionWork[]
    } catch (e) {
      console.error("Failed to parse fashion-data", e)
    }
  }
  return []
}

// Obfuscated contact credentials (prevents automated bot/crawler scraping)
const ENCODED_CONTACT = {
  email: "YXJ0c3R1ZGlvcmFiYml0aG9sZUBnbWFpbC5jb20=", // artstudiorabbithole@gmail.com
  phone: "OTE3OTg2NTg4ODc1", // 917986588875
  phoneFormatted: "KzkxIDc5ODY1IDg4ODc1", // +91 79865 88875
}

function decodeContact(key: keyof typeof ENCODED_CONTACT): string {
  try {
    return atob(ENCODED_CONTACT[key])
  } catch {
    return ""
  }
}

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
  const heroBottomBar = document.querySelector(".hero-bottom-bar")
  const socialButtons = document.querySelectorAll(".social-link-btn")
  const heroContainer = document.querySelector(
    ".hero-container",
  ) as HTMLElement | null
  const cursorGlow = document.querySelector(
    ".cursor-glow",
  ) as HTMLElement | null
  const signatureLink = document.querySelector(".signature-link")
  const signatureArrow = document.querySelector(".signature-arrow")
  const cueArrow = document.querySelector(".cue-arrow")

  // Fallback for reduced motion
  if (prefersReducedMotion) {
    gsap.set(
      [
        heroRabbithole,
        heroArt,
        heroStudio,
        heroSubtitle,
        heroBottomBar,
        socialButtons,
        cursorGlow,
      ],
      {
        opacity: 1,
        visibility: "visible",
        clearProps: "all",
      },
    )
    initCatalogueInteractions()
    initFashionInteractions()
    initProtectedContactHandlers()
    return
  }

  // Smooth anchor navigation
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href")
      if (!href || href === "#") return
      const targetEl = document.querySelector(href)
      if (targetEl) {
        e.preventDefault()
        targetEl.scrollIntoView({ behavior: "smooth" })
      }
    })
  })

  // Back to cover smooth scroll button
  const scrollToTopBtn = document.getElementById("scroll-to-top-btn")
  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener("click", (e) => {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: "smooth" })
    })
  }

  /* -------------------------------------------------------------
   * 1. HERO INITIAL STATE (Landing Page)
   * ------------------------------------------------------------- */
  if (heroRabbithole) {
    gsap.set(heroRabbithole, { opacity: 0, y: 35, scale: 0.96 })
  }
  if (heroArt) {
    gsap.set(heroArt, { opacity: 0, scale: 0.8, rotation: -7, y: 22 })
  }
  if (heroStudio) {
    gsap.set(heroStudio, { opacity: 0, x: 25, y: 8 })
  }
  if (heroSubtitle) {
    gsap.set(heroSubtitle, { opacity: 0, y: 16 })
  }
  if (heroBottomBar) {
    gsap.set(heroBottomBar, { opacity: 0, y: 20 })
  }
  if (socialButtons.length > 0) {
    gsap.set(socialButtons, { opacity: 0, y: 18, scale: 0.8 })
  }
  if (cursorGlow) {
    gsap.set(cursorGlow, { opacity: 0 })
  }

  /* -------------------------------------------------------------
   * 2. MAIN HERO ENTRANCE TIMELINE
   * ------------------------------------------------------------- */
  if (heroRabbithole) {
    const masterTl = gsap.timeline({
      delay: 0.1,
      onComplete: () => {
        startAmbientAnimations()
      },
    })

    if (cursorGlow) {
      masterTl.to(
        cursorGlow,
        { opacity: 1, duration: 1.6, ease: "power2.out" },
        0,
      )
    }

    masterTl.to(
      heroRabbithole,
      { opacity: 1, y: 0, scale: 1, duration: 1.25, ease: "power3.out" },
      0.1,
    )

    if (heroArt) {
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
    }

    if (heroStudio) {
      masterTl.to(
        heroStudio,
        { opacity: 1, x: 0, y: 0, duration: 1.1, ease: "power3.out" },
        0.55,
      )
    }

    if (heroSubtitle) {
      masterTl.to(
        heroSubtitle,
        { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" },
        0.75,
      )
    }

    if (heroBottomBar) {
      masterTl.to(
        heroBottomBar,
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power2.out",
          clearProps: "y,opacity",
        },
        0.85,
      )
    }

    if (socialButtons.length > 0) {
      masterTl.to(
        socialButtons,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: "back.out(1.8)",
          clearProps: "y,opacity",
        },
        0.95,
      )
    }
  }

  function startAmbientAnimations() {
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
    if (cueArrow) {
      gsap.to(cueArrow, {
        y: 4,
        duration: 1.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      })
    }
  }

  /* -------------------------------------------------------------
   * 3. INTERACTIVE MULTI-PLANE PARALLAX (Desktop)
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

      quickRabbitholeX?.(normX * 12)
      quickRabbitholeY?.(normY * 8)
      quickArtX?.(normX * 24)
      quickArtY?.(normY * 16)
      quickStudioX?.(-normX * 14)
      quickStudioY?.(-normY * 9)

      quickTiltX(-normY * 4.5)
      quickTiltY(normX * 6)

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
   * 4. SOCIAL BUTTON HOVER MICRO-INTERACTIONS
   * ------------------------------------------------------------- */
  socialButtons.forEach((btn) => {
    const el = btn as HTMLElement
    const icon = el.querySelector("svg")
    el.addEventListener("mouseenter", () => {
      gsap.to(el, { scale: 1.15, duration: 0.25, ease: "power2.out" })
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
      gsap.to(el, { scale: 1, duration: 0.3, ease: "power2.out" })
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

  /* -------------------------------------------------------------
   * 5. EDITORIAL PORTFOLIO (/eshale)
   * ------------------------------------------------------------- */
  initEditorialPageAnimations()
  initCatalogueInteractions()
  initFashionInteractions()
  initProtectedContactHandlers()

  // Refresh all ScrollTrigger instances after layout registration
  ScrollTrigger.refresh()
}

/**
 * Editorial Magazine Cover & Settling Bio Animation (/eshale)
 * - Large artist image in background with matching lavender-periwinkle tone (#8e88bc)
 * - "ESHALE" as the magazine cover title in front, blurbs on left and right over the image
 * - On scroll scrub:
 *   - The background image shrinks into the background
 *   - "ESHALE" comes to the front, glides up, and gets stickied below the navbar
 *   - Left and right blurbs move outward to the sides and fade away
 *   - Then "ESHALE" docks and settles as the headline to the dossier section
 */
function initEditorialPageAnimations() {
  const bioSection = document.getElementById("bio")
  if (!bioSection) return

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches

  // 1. Directionally-aware Editorial Navbar (Hidden in Hero, Appears past hero so user knows it exists, then directionally reactive)
  const header = document.getElementById("editorial-header")
  if (header) {
    let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0

    const updateHeader = () => {
      const currentScrollY = window.scrollY
      const coverStage = document.getElementById("bio-cover-stage")
      // Hero stage threshold: pinned coverStage (end is +=1200)
      const heroThreshold = coverStage ? coverStage.offsetTop + 1100 : 800

      if (currentScrollY < heroThreshold) {
        // In Hero Stage: Fully hidden so ESHALE is unobstructed at top
        header.classList.add(
          "-translate-y-full",
          "opacity-0",
          "pointer-events-none",
        )
        header.classList.remove(
          "translate-y-0",
          "opacity-100",
          "pointer-events-auto",
          "shadow-xs",
        )
      } else if (
        currentScrollY >= heroThreshold &&
        currentScrollY < heroThreshold + 350
      ) {
        // Right as you scroll past hero: Always appear so user knows it exists!
        header.classList.remove(
          "-translate-y-full",
          "opacity-0",
          "pointer-events-none",
        )
        header.classList.add(
          "translate-y-0",
          "opacity-100",
          "pointer-events-auto",
          "shadow-xs",
        )
      } else {
        // Past the initial buffer: Directionally aware
        const isScrollingUp = currentScrollY < lastScrollY
        if (isScrollingUp) {
          // Scrolling UP: reveal translucent blurred navbar
          header.classList.remove(
            "-translate-y-full",
            "opacity-0",
            "pointer-events-none",
          )
          header.classList.add(
            "translate-y-0",
            "opacity-100",
            "pointer-events-auto",
            "shadow-xs",
          )
        } else if (currentScrollY > lastScrollY + 6) {
          // Scrolling DOWN: slide navbar up out of view
          header.classList.add(
            "-translate-y-full",
            "opacity-0",
            "pointer-events-none",
          )
          header.classList.remove(
            "translate-y-0",
            "opacity-100",
            "pointer-events-auto",
          )
        }
      }
      lastScrollY = Math.max(0, currentScrollY)
    }

    window.addEventListener("scroll", updateHeader, { passive: true })
    updateHeader()
  }

  if (prefersReducedMotion) return

  const coverStage = document.getElementById("bio-cover-stage")
  const bgImage = bioSection.querySelector(".bio-cover-bg-image")
  const coverTitle = document.getElementById("bio-cover-title")
  const topBar = bioSection.querySelector(".bio-cover-topbar")
  const coverCoords = bioSection.querySelector(".bio-cover-coords")
  const blurbLeft = document.getElementById("bio-blurb-left")
  const blurbRight = document.getElementById("bio-blurb-right")
  const scrollCue = document.getElementById("bio-scroll-cue")
  const settledSection = document.getElementById("bio-settled-section")
  const settledHeadline = bioSection.querySelector(".bio-settled-headline")
  const bioDisciplines = bioSection.querySelector(".bio-disciplines-grid")

  // 1. Initial Hero Entrance Sequence when page first opens (only at top of page)
  if (typeof window !== "undefined" && window.scrollY < 20) {
    const heroEntranceTl = gsap.timeline({ delay: 0.1 })

    if (bgImage) {
      heroEntranceTl.from(bgImage, {
        opacity: 0,
        scale: 1.05,
        duration: 1.3,
        ease: "power2.out",
      })
    }

    if (coverTitle) {
      heroEntranceTl.from(
        coverTitle,
        { opacity: 0, y: 25, duration: 1.1, ease: "power3.out" },
        0.15,
      )
    }

    if (coverCoords) {
      heroEntranceTl.from(
        coverCoords,
        { opacity: 0, y: -8, duration: 0.8, ease: "power2.out" },
        0.35,
      )
    }

    if (topBar) {
      heroEntranceTl.from(
        topBar,
        { opacity: 0, y: 8, duration: 0.8, ease: "power2.out" },
        0.45,
      )
    }

    if (blurbLeft) {
      heroEntranceTl.from(
        blurbLeft,
        { opacity: 0, x: -25, duration: 0.9, ease: "power3.out" },
        0.55,
      )
    }

    if (blurbRight) {
      heroEntranceTl.from(
        blurbRight,
        { opacity: 0, x: 25, duration: 0.9, ease: "power3.out" },
        0.65,
      )
    }

    if (scrollCue) {
      heroEntranceTl.from(
        scrollCue,
        { opacity: 0, y: 10, duration: 0.8, ease: "power2.out" },
        0.8,
      )
    }
  }

  if (coverStage && coverTitle && settledSection) {
    ScrollTrigger.config({ ignoreMobileResize: true })

    const coverTl = gsap.timeline({
      scrollTrigger: {
        trigger: coverStage,
        start: "top top",
        end: "+=1800",
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
      },
    })

    // 1. Blurbs move outward to sides and fade away (fromTo guarantees restoration on scroll up!)
    if (blurbLeft) {
      coverTl.fromTo(
        blurbLeft,
        { x: 0, opacity: 1 },
        { x: -90, opacity: 0, duration: 0.7, ease: "power1.in" },
        0,
      )
    }
    if (blurbRight) {
      coverTl.fromTo(
        blurbRight,
        { x: 0, opacity: 1 },
        { x: 90, opacity: 0, duration: 0.7, ease: "power1.in" },
        0,
      )
    }
    if (topBar) {
      coverTl.fromTo(
        topBar,
        { y: 0, opacity: 1 },
        { opacity: 0, y: -20, duration: 0.45, ease: "power1.in" },
        0,
      )
    }
    if (coverCoords) {
      coverTl.fromTo(
        coverCoords,
        { y: 0, opacity: 1 },
        { opacity: 0, y: -20, duration: 0.45, ease: "power1.in" },
        0,
      )
    }
    if (scrollCue) {
      coverTl.fromTo(
        scrollCue,
        { y: 0, opacity: 1 },
        { opacity: 0, y: -20, duration: 0.4, ease: "power1.in" },
        0,
      )
    }

    // 2. Image shrinks and fades away to nothingness (fromTo guarantees restoration on scroll up!)
    if (bgImage) {
      coverTl.fromTo(
        bgImage,
        { scale: 1, opacity: 1, y: 0 },
        {
          scale: 0.82,
          opacity: 0,
          y: -40,
          duration: 1.1,
          ease: "power2.inOut",
        },
        0.1,
      )
    }

    // 3. ESHALE title scales down and transitions towards dossier section
    coverTl.fromTo(
      coverTitle,
      { scale: 1, y: 0, opacity: 1 },
      {
        scale: 0.65,
        y: -60,
        opacity: 0,
        duration: 1.0,
        ease: "power2.inOut",
      },
      0.15,
    )
  }

  // Settled Dossier Headline entrance animation
  if (settledHeadline) {
    gsap.fromTo(
      settledHeadline,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: settledHeadline,
          start: "top 85%",
          once: true,
        },
      },
    )
  }

  // Stagger reveal on the 3 practice discipline dossiers
  if (bioDisciplines) {
    const disciplineCards = bioDisciplines.querySelectorAll(":scope > div")
    if (disciplineCards.length > 0) {
      gsap.fromTo(
        disciplineCards,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: bioDisciplines,
            start: "top 88%",
            once: true,
          },
        },
      )
    }
  }
}

/**
 * Initializes Catalogue Section:
 * - Left side: Artwork images have the "cards in a deck" animation
 * - Right side: Typography and details animate directly on the background (NO CARD BOX)
 * - Pinned ScrollTrigger scrubbing synchronizes image cards leafing with text details
 */
function initCatalogueInteractions() {
  const catalogueSection = document.getElementById("catalogue")
  const introCenter = document.getElementById("catalogue-intro-center")
  const catalogueHud = document.getElementById("catalogue-hud")
  const splitStage = document.getElementById("catalogue-split-stage")
  const imageDeck = document.getElementById("catalogue-image-deck")
  const imageCards = Array.from(
    document.querySelectorAll<HTMLElement>(".catalogue-image-card"),
  )
  const detailPanels = Array.from(
    document.querySelectorAll<HTMLElement>(".catalogue-detail-panel"),
  )
  const indexEl = document.getElementById("active-plate-index")
  const progressEl = document.getElementById("catalogue-progress-bar")
  const dots = document.querySelectorAll<HTMLElement>(".deck-dot")

  if (!catalogueSection || imageCards.length === 0) return

  const totalPlates = imageCards.length
  let currentPlateIndex = 0

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches

  if (prefersReducedMotion) {
    if (introCenter) introCenter.style.display = "none"
    if (splitStage) gsap.set(splitStage, { opacity: 1, pointerEvents: "auto" })
    if (catalogueHud) gsap.set(catalogueHud, { opacity: 1, y: 0 })
    imageCards.forEach((card, idx) => {
      gsap.set(card, { opacity: idx <= 3 ? 1 : 0.6 })
    })
    detailPanels.forEach((panel, idx) => {
      gsap.set(panel, {
        opacity: idx === 0 ? 1 : 0,
        x: 0,
        pointerEvents: idx === 0 ? "auto" : "none",
      })
    })
    return
  }

  // 1. Initial State: Intro is prominent with solid backdrop; Stage and Cards are completely hidden
  if (introCenter) {
    gsap.set(introCenter, { opacity: 1, scale: 1, y: 0, visibility: "visible" })
  }
  if (catalogueHud) {
    gsap.set(catalogueHud, { opacity: 0, y: -10 })
  }
  if (splitStage) {
    gsap.set(splitStage, { opacity: 0, pointerEvents: "none" })
  }

  imageCards.forEach((card, idx) => {
    gsap.set(card, {
      zIndex: totalPlates - idx,
      scale: Math.max(0.88, 1 - idx * 0.03),
      y: idx * 8,
      rotation: idx === 0 ? 0 : idx % 2 === 1 ? idx * 0.8 : -idx * 0.8,
      opacity: 0, // Cards start hidden behind intro
      transformOrigin: "center bottom",
    })
  })

  // Prepare detail panels: stacked in grid, hidden and primed to slide in from right
  detailPanels.forEach((panel) => {
    gsap.set(panel, { opacity: 0, x: 50, pointerEvents: "none" })
  })

  function updateCatalogueHUD(progress: number) {
    if (progress < 0.08) {
      if (indexEl) indexEl.textContent = "01"
      if (progressEl) progressEl.style.width = "16%"
      return
    }

    // When progress >= 0.08, plates cycle
    const plateProgress = Math.max(0, Math.min(1, (progress - 0.08) / 0.92))
    const activeIdx = Math.min(
      totalPlates - 1,
      Math.floor(plateProgress * totalPlates),
    )

    currentPlateIndex = activeIdx

    if (indexEl) {
      indexEl.textContent = String(activeIdx + 1).padStart(2, "0")
    }

    if (progressEl) {
      progressEl.style.width = `${Math.max(16, progress * 100)}%`
    }

    dots.forEach((dot, idx) => {
      if (idx === activeIdx) {
        dot.classList.remove("bg-neutral-300", "w-2")
        dot.classList.add("bg-neutral-950", "w-4")
      } else {
        dot.classList.remove("bg-neutral-950", "w-4")
        dot.classList.add("bg-neutral-300", "w-2")
      }
    })
  }

  // 2. Master Scrub Timeline: Intro Fades -> Cards & HUD Reveal -> Cards Leaf Off Stack & Text Slides In Synchronously
  const deckTl = gsap.timeline({
    scrollTrigger: {
      trigger: catalogueSection,
      pin: true,
      start: "top top",
      end: () => `+=${(totalPlates + 1) * 2000}`,
      scrub: 1.0,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        updateCatalogueHUD(self.progress)
      },
    },
  })

  // Phase 1: Centered title & introduction fades away as user scrolls
  if (introCenter) {
    deckTl.to(
      introCenter,
      {
        opacity: 0,
        scale: 0.9,
        y: -40,
        duration: 0.7,
        ease: "power2.inOut",
      },
      0,
    )
    deckTl.set(introCenter, { visibility: "hidden" }, 0.7)
  }

  // Phase 1b: Catalogue HUD and Split Stage fade in simultaneously
  if (catalogueHud) {
    deckTl.to(
      catalogueHud,
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: "power2.out",
      },
      0.35,
    )
  }

  if (splitStage) {
    deckTl.to(
      splitStage,
      {
        opacity: 1,
        duration: 0.45,
        ease: "power2.out",
      },
      0.35,
    )
    deckTl.set(splitStage, { pointerEvents: "auto" }, 0.35)
  }

  // Detail Panel 0 fades in together with stage
  if (detailPanels[0]) {
    deckTl.fromTo(
      detailPanels[0],
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 0.45, ease: "power2.out" },
      0.35,
    )
    deckTl.set(detailPanels[0], { pointerEvents: "auto" }, 0.35)
  }

  // Fade cards in to physical stack opacities
  imageCards.forEach((card, idx) => {
    deckTl.to(
      card,
      {
        opacity: idx <= 3 ? 1 : 0.6,
        duration: 0.45,
        ease: "power2.out",
      },
      0.35,
    )
  })

  // Phase 2: Animate each image card lifting off the deck and detail panels sliding synchronously
  for (let i = 0; i < totalPlates - 1; i++) {
    const currentCard = imageCards[i]
    const nextCard = imageCards[i + 1]
    const currentPanel = detailPanels[i]
    const nextPanel = detailPanels[i + 1]
    const startTime = 0.8 + i * 1.2

    // Card i leaves deck
    deckTl.to(
      currentCard,
      {
        y: -80,
        scale: 0.92,
        rotation: i % 2 === 0 ? -6 : 6,
        opacity: 0,
        duration: 0.9,
        ease: "power2.inOut",
      },
      startTime,
    )

    // Panel i slides out to left
    if (currentPanel) {
      deckTl.to(
        currentPanel,
        {
          opacity: 0,
          x: -40,
          duration: 0.45,
          ease: "power2.in",
        },
        startTime,
      )
      deckTl.set(currentPanel, { pointerEvents: "none" }, startTime + 0.45)
    }

    // Card i + 1 settles to top of deck
    deckTl.to(
      nextCard,
      {
        scale: 1,
        y: 0,
        rotation: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
      },
      startTime + 0.15,
    )

    // Panel i + 1 slides in from right
    if (nextPanel) {
      deckTl.fromTo(
        nextPanel,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.55,
          ease: "power2.out",
        },
        startTime + 0.3,
      )
      deckTl.set(nextPanel, { pointerEvents: "auto" }, startTime + 0.3)
    }
  }

  const st = deckTl.scrollTrigger

  function goToPlate(targetIndex: number) {
    if (!st) return
    const clamped = Math.max(0, Math.min(totalPlates - 1, targetIndex))
    const progressRatio = 0.08 + (clamped / (totalPlates - 1)) * 0.92
    const targetScrollY = st.start + progressRatio * (st.end - st.start)
    window.scrollTo({ top: targetScrollY + 2, behavior: "smooth" })
  }

  // Allow clicking on indicator dots to navigate directly to that plate (if present)
  dots.forEach((dot, idx) => {
    dot.addEventListener("click", () => goToPlate(idx))
  })

  // Touch swipe support
  if (imageDeck) {
    let touchStartX = 0
    let touchStartY = 0
    imageDeck.addEventListener(
      "touchstart",
      (e: TouchEvent) => {
        if (e.touches.length === 1) {
          touchStartX = e.touches[0].clientX
          touchStartY = e.touches[0].clientY
        }
      },
      { passive: true },
    )

    imageDeck.addEventListener(
      "touchend",
      (e: TouchEvent) => {
        if (e.changedTouches.length === 0) return
        const deltaY = e.changedTouches[0].clientY - touchStartY
        const deltaX = e.changedTouches[0].clientX - touchStartX
        if (Math.abs(deltaY) > 40 || Math.abs(deltaX) > 40) {
          if (deltaY < -40 || deltaX < -40) {
            goToPlate(currentPlateIndex + 1)
          } else if (deltaY > 40 || deltaX > 40) {
            goToPlate(currentPlateIndex - 1)
          }
        }
      },
      { passive: true },
    )
  }

  /* -------------------------------------------------------------
   * LIGHTBOX MODAL
   * ------------------------------------------------------------- */
  const modal = document.getElementById("artwork-modal")
  const modalCard = document.getElementById("modal-card")
  const modalCloseBtn = document.getElementById("modal-close-btn")
  const modalBackdrop = document.getElementById("modal-backdrop")

  const modalImg = document.getElementById(
    "modal-img",
  ) as HTMLImageElement | null
  const modalNumber = document.getElementById("modal-number")
  const modalSubtitle = document.getElementById("modal-subtitle")
  const modalYear = document.getElementById("modal-year")
  const modalTitle = document.getElementById("modal-title")
  const modalMedium = document.getElementById("modal-medium")
  const modalDimensions = document.getElementById("modal-dimensions")
  const modalQuote = document.getElementById("modal-quote")
  const modalDesc = document.getElementById("modal-desc")
  const modalWhatsAppBtn = document.getElementById("modal-inquire-whatsapp")
  const modalEmailBtn = document.getElementById("modal-inquire-email")

  function openArtworkModal(artworkId: string) {
    const list = getArtworks()
    const item = list.find((a) => a.id === artworkId)
    if (!item || !modal || !modalCard) return

    if (modalImg) {
      const card = document.querySelector(`[data-artwork-id="${artworkId}"]`)
      const cardImg = card?.querySelector("img")
      modalImg.src = cardImg?.currentSrc || cardImg?.src || item.image
      modalImg.alt = item.alt
    }
    if (modalNumber) modalNumber.textContent = `Nº ${item.number}`
    if (modalSubtitle) modalSubtitle.textContent = item.subtitle
    if (modalYear) modalYear.textContent = item.year
    if (modalTitle) modalTitle.textContent = item.title
    if (modalMedium) modalMedium.textContent = item.medium
    if (modalDimensions) modalDimensions.textContent = item.dimensions
    if (modalQuote) modalQuote.textContent = `"${item.quote}"`
    if (modalDesc) modalDesc.textContent = item.description

    if (modalWhatsAppBtn) {
      modalWhatsAppBtn.setAttribute(
        "data-message",
        `Hello, I would like to inquire about "${item.title}" (Plate Nº ${item.number}) from the RabbitHole catalogue.`,
      )
    }

    if (modalEmailBtn) {
      modalEmailBtn.setAttribute(
        "data-subject",
        `Inquiry: "${item.title}" (Plate Nº ${item.number})`,
      )
    }

    modal.classList.add("is-open")
    modal.setAttribute("aria-hidden", "false")
    document.body.style.overflow = "hidden"

    gsap.fromTo(
      modalCard,
      { scale: 0.94, opacity: 0, y: 15 },
      { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: "power3.out" },
    )
  }

  function closeArtworkModal() {
    if (!modal || !modalCard) return
    gsap.to(modalCard, {
      scale: 0.96,
      opacity: 0,
      y: 10,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => {
        modal.classList.remove("is-open")
        modal.setAttribute("aria-hidden", "true")
        document.body.style.overflow = ""
      },
    })
  }

  document.querySelectorAll("[data-artwork-id]").forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.stopPropagation()
      const id = trigger.getAttribute("data-artwork-id")
      if (id) openArtworkModal(id)
    })
  })

  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeArtworkModal)
  if (modalBackdrop) modalBackdrop.addEventListener("click", closeArtworkModal)

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal?.classList.contains("is-open")) {
      closeArtworkModal()
    }
  })
}

/**
 * Initializes Couture "Runway / Ramp" Motion:
 * - Pinned runway stage with 6 looks + Bespoke Finale
 * - Models enter from alternating bottom corners:
 *   - Look 01 (Odd): Center at start, poses, exits to top-left
 *   - Look 02 (Even): Enters from bottom-right, poses center, exits to top-right
 *   - Alternates through all looks!
 * - Finale card takes the spotlight for bespoke commissions
 */
function initFashionInteractions() {
  const fashionSection = document.getElementById("fashion")
  const introCenter = document.getElementById("fashion-intro-center")
  const fashionHud = document.getElementById("fashion-hud")
  const runwayCards = Array.from(
    document.querySelectorAll<HTMLElement>(".fashion-runway-card"),
  )
  const indexEl = document.getElementById("active-runway-index")
  const progressEl = document.getElementById("runway-progress-bar")
  const dots = document.querySelectorAll<HTMLElement>(".runway-dot")

  const modal = document.getElementById("fashion-modal")
  const modalCard = document.getElementById("fashion-modal-card")
  const modalCloseBtn = document.getElementById("fashion-modal-close-btn")
  const modalBackdrop = document.getElementById("fashion-modal-backdrop")

  if (!fashionSection || runwayCards.length === 0) return

  const totalRunwayCards = runwayCards.length
  const totalLooks = totalRunwayCards - 1 // 6 looks + 1 finale

  const isMobile = window.innerWidth < 640
  const wingX = isMobile
    ? Math.min(140, Math.floor(window.innerWidth * 0.32))
    : 280
  const wingY = isMobile ? 260 : 350
  const exitY = isMobile ? -260 : -340

  // 1. Initial State: Centered Intro is prominent, cards wait in alternating wings, HUD is hidden
  if (introCenter) {
    gsap.set(introCenter, { opacity: 1, scale: 1, y: 0 })
  }
  if (fashionHud) {
    gsap.set(fashionHud, { opacity: 0, y: -10 })
  }

  runwayCards.forEach((card, idx) => {
    if (idx === 0) {
      // Look 01 staged to enter center spotlight
      gsap.set(card, {
        x: 0,
        y: 30,
        rotation: 0,
        rotateY: 0,
        scale: 0.9,
        opacity: 0,
        zIndex: 20,
      })
    } else if (idx < totalLooks) {
      // Looks 02..06 waiting in alternating entrance wings
      const isLeft = idx % 2 === 0
      gsap.set(card, {
        x: isLeft ? -wingX : wingX,
        y: wingY,
        rotation: isLeft ? -6 : 6,
        rotateY: isLeft ? 30 : -30,
        scale: 0.85,
        opacity: 0,
        zIndex: 10 + idx,
      })
    } else {
      // Finale card waiting below
      gsap.set(card, {
        x: 0,
        y: wingY,
        rotation: 0,
        rotateY: 0,
        scale: 0.85,
        opacity: 0,
        zIndex: 30,
      })
    }
  })

  let currentLookIndex = 0

  function updateRunwayHUD(progress: number) {
    if (progress < 0.06) {
      if (indexEl) indexEl.textContent = "01"
      if (progressEl) progressEl.style.width = "14%"
      return
    }

    const lookProgress = Math.max(0, Math.min(1, (progress - 0.06) / 0.94))
    const cardProgress = Math.min(
      totalRunwayCards - 1,
      Math.floor(lookProgress * totalRunwayCards),
    )
    currentLookIndex = cardProgress

    if (indexEl) {
      const lookNum = Math.min(totalLooks, cardProgress + 1)
      indexEl.textContent = String(lookNum).padStart(2, "0")
    }

    if (progressEl) {
      progressEl.style.width = `${Math.max(14, progress * 100)}%`
    }

    dots.forEach((dot, idx) => {
      if (idx === cardProgress) {
        dot.classList.remove("bg-neutral-300", "w-2")
        dot.classList.add("bg-teal-900", "w-4")
      } else {
        dot.classList.remove("bg-teal-900", "w-4")
        dot.classList.add("bg-neutral-300", "w-2")
      }
    })
  }

  // 2. Master Runway Scrub Timeline: Intro Fades -> Models Enter Center -> Pause in Spotlight -> 3D Flip & Exit
  const runwayTl = gsap.timeline({
    scrollTrigger: {
      trigger: fashionSection,
      pin: true,
      start: "top top",
      end: () => `+=${(totalRunwayCards + 1) * 2800}`,
      scrub: 1.0,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        updateRunwayHUD(self.progress)
      },
    },
  })

  // Phase 1: Centered title & introduction fades away as user scrolls
  if (introCenter) {
    runwayTl.to(
      introCenter,
      {
        opacity: 0,
        scale: 0.9,
        y: -40,
        duration: 0.8,
        ease: "power2.inOut",
      },
      0,
    )
  }

  if (fashionHud) {
    runwayTl.to(
      fashionHud,
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: "power2.out",
      },
      0.4,
    )
  }

  // Phase 2: Look 01 comes in to center stage spotlight with generous pause
  const firstCard = runwayCards[0]
  if (firstCard) {
    runwayTl.to(
      firstCard,
      {
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
        rotation: 0,
        rotateY: 0,
        duration: 0.95,
        ease: "power2.out",
      },
      0.4,
    )

    // Look 01 pauses in center spotlight, then turns around (flips rotateY -180) and exits to top-left corner
    // Scroll required for exit animation is substantially increased
    runwayTl.to(
      firstCard,
      {
        rotateY: -180,
        x: -wingX * 0.4,
        duration: 1.4,
        ease: "power2.inOut",
      },
      2.2,
    )
    runwayTl.to(
      firstCard,
      {
        x: -wingX,
        y: exitY,
        rotation: -7,
        scale: 0.82,
        opacity: 0,
        duration: 1.6,
        ease: "power2.in",
      },
      3.0,
    )
  }

  // Phase 3: Looks 02 to 06 enter from bottom corners -> pose center -> turn (flip) & exit to top corners
  // Each exit animation receives generous scroll runway (1.4s 3D turn + 1.6s glide to backstage exit)
  for (let i = 1; i < totalLooks; i++) {
    const card = runwayCards[i]
    const isLeft = i % 2 === 0
    const enterTime = 0.4 + i * 3.6

    // Enter from alternating bottom corner into center ramp spotlight
    runwayTl.fromTo(
      card,
      {
        x: isLeft ? -wingX : wingX,
        y: wingY,
        rotation: isLeft ? -6 : 6,
        rotateY: isLeft ? 30 : -30,
        scale: 0.85,
        opacity: 0,
      },
      {
        x: 0,
        y: 0,
        rotation: 0,
        rotateY: 0,
        scale: 1,
        opacity: 1,
        duration: 0.95,
        ease: "power2.out",
      },
      enterTime,
    )

    // Pose in spotlight, then turn (flip 3D) and exit to top corner wing with increased scroll requirement
    runwayTl.to(
      card,
      {
        rotateY: isLeft ? -180 : 180,
        x: isLeft ? -wingX * 0.4 : wingX * 0.4,
        duration: 1.4,
        ease: "power2.inOut",
      },
      enterTime + 1.8,
    )
    runwayTl.to(
      card,
      {
        x: isLeft ? -wingX : wingX,
        y: exitY,
        rotation: isLeft ? -7 : 7,
        scale: 0.82,
        opacity: 0,
        duration: 1.6,
        ease: "power2.in",
      },
      enterTime + 2.6,
    )
  }

  // Phase 4: Finale card enters center stage and remains
  const finaleCard = runwayCards[totalLooks]
  if (finaleCard) {
    runwayTl.fromTo(
      finaleCard,
      {
        x: 0,
        y: wingY,
        rotation: 0,
        rotateY: 0,
        scale: 0.85,
        opacity: 0,
      },
      {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 1.1,
        ease: "power3.out",
      },
      0.4 + totalLooks * 3.6,
    )
  }

  const runwaySt = runwayTl.scrollTrigger

  function goToRunwayLook(targetIndex: number) {
    if (!runwaySt) return
    const clamped = Math.max(0, Math.min(totalRunwayCards - 1, targetIndex))
    const progressRatio = 0.06 + (clamped / (totalRunwayCards - 1)) * 0.94
    const targetScrollY =
      runwaySt.start + progressRatio * (runwaySt.end - runwaySt.start)
    window.scrollTo({ top: targetScrollY + 2, behavior: "smooth" })
  }

  // Allow clicking on runway indicator dots to navigate directly (if present)
  dots.forEach((dot, idx) => {
    dot.addEventListener("click", () => goToRunwayLook(idx))
  })

  // Fashion Detail Modal
  function openFashionModal(workId: string) {
    const works = getFashionWorks()
    const item = works.find((w) => w.id === workId)
    if (!item || !modal || !modalCard) return

    const modalImg = document.getElementById(
      "fashion-modal-img",
    ) as HTMLImageElement | null
    const modalNumber = document.getElementById("fashion-modal-number")
    const modalCollection = document.getElementById("fashion-modal-collection")
    const modalYear = document.getElementById("fashion-modal-year")
    const modalTitle = document.getElementById("fashion-modal-title")
    const modalMaterials = document.getElementById("fashion-modal-materials")
    const modalSeason = document.getElementById("fashion-modal-season")
    const modalQuote = document.getElementById("fashion-modal-quote")
    const modalDesc = document.getElementById("fashion-modal-desc")
    const modalWhatsAppBtn = document.getElementById(
      "fashion-modal-inquire-whatsapp",
    )
    const modalEmailBtn = document.getElementById("fashion-modal-inquire-email")

    if (modalImg) {
      const card = document.querySelector(`[data-fashion-id="${workId}"]`)
      const cardImg = card?.querySelector("img")
      modalImg.src = cardImg?.currentSrc || cardImg?.src || item.image
      modalImg.alt = item.alt
    }
    if (modalNumber) modalNumber.textContent = `LOOK Nº ${item.number}`
    if (modalCollection) modalCollection.textContent = item.collection
    if (modalYear) modalYear.textContent = item.year
    if (modalTitle) modalTitle.textContent = item.title
    if (modalMaterials) modalMaterials.textContent = item.materials
    if (modalSeason) modalSeason.textContent = item.season
    if (modalQuote) modalQuote.textContent = `"${item.quote}"`
    if (modalDesc) modalDesc.textContent = item.description

    if (modalWhatsAppBtn) {
      modalWhatsAppBtn.setAttribute(
        "data-message",
        `Hello, I would like to inquire about the custom couture look "${item.title}" (Look Nº ${item.number}) by Eshale.`,
      )
    }
    if (modalEmailBtn) {
      modalEmailBtn.setAttribute(
        "data-subject",
        `Couture Inquiry: "${item.title}" (Look Nº ${item.number}) by Eshale`,
      )
    }

    modal.classList.add("is-open")
    modal.setAttribute("aria-hidden", "false")
    document.body.style.overflow = "hidden"

    gsap.fromTo(
      modalCard,
      { scale: 0.94, opacity: 0, y: 15 },
      { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: "power3.out" },
    )
  }

  function closeFashionModal() {
    if (!modal || !modalCard) return
    gsap.to(modalCard, {
      scale: 0.96,
      opacity: 0,
      y: 10,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => {
        modal.classList.remove("is-open")
        modal.setAttribute("aria-hidden", "true")
        document.body.style.overflow = ""
      },
    })
  }

  document.querySelectorAll("[data-fashion-id]").forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.stopPropagation()
      const id = trigger.getAttribute("data-fashion-id")
      if (id) openFashionModal(id)
    })
  })

  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeFashionModal)
  if (modalBackdrop) modalBackdrop.addEventListener("click", closeFashionModal)

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal?.classList.contains("is-open")) {
      closeFashionModal()
    }
  })
}

/**
 * Handles protected contact interactions:
 * - Direct action triggers decode dynamically and launch WhatsApp/Email on demand
 * - Colophon "Click to View" reveal interactions with animated state change and clipboard copy
 */
function initProtectedContactHandlers() {
  document.querySelectorAll("[data-contact-action]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()
      const action = btn.getAttribute("data-contact-action")

      if (action === "whatsapp") {
        const phone = decodeContact("phone")
        const message = btn.getAttribute("data-message") || ""
        const url = `https://wa.me/${phone}${
          message ? `?text=${encodeURIComponent(message)}` : ""
        }`
        window.open(url, "_blank", "noopener,noreferrer")
      } else if (action === "email") {
        const email = decodeContact("email")
        const subject = btn.getAttribute("data-subject") || ""
        const url = `mailto:${email}${
          subject ? `?subject=${encodeURIComponent(subject)}` : ""
        }`
        window.location.href = url
      }
    })
  })

  document.querySelectorAll(".protected-contact-group").forEach((group) => {
    const type = group.getAttribute("data-protected-type") as
      "phone" | "email" | null
    if (!type) return

    const revealBtn = group.querySelector(".reveal-contact-btn")
    const placeholder = group.querySelector(".reveal-placeholder")
    const revealedContent = group.querySelector(".revealed-content")
    const valDisplay = group.querySelector(".contact-full-val")
    const directBtn = group.querySelector(".action-direct-btn")
    const copyBtn = group.querySelector(".action-copy-btn")
    const copiedBadge = group.querySelector(".copied-badge")

    const fullValue =
      type === "phone"
        ? decodeContact("phoneFormatted")
        : decodeContact("email")
    const rawValue =
      type === "phone" ? decodeContact("phone") : decodeContact("email")

    if (revealBtn && placeholder && revealedContent && valDisplay) {
      revealBtn.addEventListener("click", () => {
        valDisplay.textContent = fullValue

        gsap.to(placeholder, {
          opacity: 0,
          duration: 0.2,
          onComplete: () => {
            placeholder.classList.add("hidden")
            revealedContent.classList.remove("hidden")
            gsap.fromTo(
              revealedContent,
              { opacity: 0, y: 4 },
              { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
            )
          },
        })
      })
    }

    if (directBtn) {
      directBtn.addEventListener("click", () => {
        if (type === "phone") {
          window.open(
            `https://wa.me/${rawValue}`,
            "_blank",
            "noopener,noreferrer",
          )
        } else {
          window.location.href = `mailto:${fullValue}`
        }
      })
    }

    if (copyBtn) {
      copyBtn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(fullValue)
          if (copiedBadge) {
            gsap.killTweensOf(copiedBadge)
            gsap.fromTo(
              copiedBadge,
              { opacity: 0, y: 2 },
              { opacity: 1, y: 0, duration: 0.25 },
            )
            gsap.to(copiedBadge, {
              opacity: 0,
              y: -2,
              duration: 0.3,
              delay: 1.8,
            })
          }
        } catch {
          const tempInput = document.createElement("input")
          tempInput.value = fullValue
          document.body.appendChild(tempInput)
          tempInput.select()
          document.execCommand("copy")
          document.body.removeChild(tempInput)
        }
      })
    }
  })
}

// Auto-run when DOM is ready
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupAnimations)
  } else {
    setupAnimations()
  }
}
