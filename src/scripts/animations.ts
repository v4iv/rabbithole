import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import type { Artwork } from "@/types/artwork"

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
    initProtectedContactHandlers()
    return
  }

  /* -------------------------------------------------------------
   * 1. HERO INITIAL STATE
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

  gsap.set(heroBottomBar, {
    opacity: 0,
    y: 20,
  })

  gsap.set(socialButtons, {
    opacity: 0,
    y: 18,
    scale: 0.8,
  })

  if (cursorGlow) {
    gsap.set(cursorGlow, { opacity: 0 })
  }

  /* -------------------------------------------------------------
   * 2. MAIN HERO ENTRANCE TIMELINE
   * ------------------------------------------------------------- */
  const masterTl = gsap.timeline({
    delay: 0.1,
    onComplete: () => {
      startAmbientAnimations()
    },
  })

  // Ambient glow
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

  // 1. "rabbithole" - foundational anchor
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

  // 2. "art" - handwritten flourish blossoms
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

  // 3. "STUDIO" - refined serif type settles
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

  // 5. Hero Bottom Bar (Scroll Cue & Social dock)
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

  /* -------------------------------------------------------------
   * 3. AMBIENT HERO ANIMATIONS
   * ------------------------------------------------------------- */
  function startAmbientAnimations() {
    // Gentle floating on "art" flourish
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

    // Subtle bobbing on scroll cue arrow
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
   * 4. INTERACTIVE MULTI-PLANE PARALLAX (Desktop)
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
   * 5. SOCIAL BUTTON HOVER MICRO-INTERACTIONS
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
   * 6. SIGNATURE LINK HOVER
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

  /* -------------------------------------------------------------
   * 7. CATALOGUE & GALLERY SETUP (Mobile & Desktop)
   * ------------------------------------------------------------- */
  initCatalogueInteractions()

  /* -------------------------------------------------------------
   * 8. PROTECTED CONTACT & CLICK-TO-VIEW HANDLERS
   * ------------------------------------------------------------- */
  initProtectedContactHandlers()
}

/**
 * Initializes Catalogue Lookbook interactions:
 * - Desktop & Mobile: GSAP Pinned horizontal scrolljack with ScrollTrigger
 * - Begins when the artwork cards are vertically centered in the viewport
 * - Horizontal touch swipe support on touch screens
 * - Live plate counter (PLATE 01 / 06) and progress bar synchronization
 * - Quick-view lightbox modal
 */
function initCatalogueInteractions() {
  const catalogueSection = document.getElementById("catalogue")
  const track = document.getElementById("catalogue-track")
  const indexEl = document.getElementById("active-plate-index")
  const progressEl = document.getElementById("catalogue-progress-bar")

  if (!catalogueSection || !track) return

  // Prevent mobile Safari/Chrome address bar resize jumps
  ScrollTrigger.config({ ignoreMobileResize: true })

  const getCards = (): HTMLElement[] =>
    Array.from(track.querySelectorAll<HTMLElement>(".catalogue-card"))

  const artworks = getArtworks()
  const totalArtworks = artworks.length || 6

  const getScrollDistance = () => {
    return Math.max(
      0,
      track.scrollWidth -
        track.clientWidth +
        (window.innerWidth < 640 ? 32 : 80),
    )
  }

  let currentCardIndex = 0

  function updateActiveCard(progress: number) {
    const cards = getCards()
    if (cards.length === 0) return

    const totalDist = getScrollDistance()
    const currentTranslateX = progress * totalDist
    const viewportCenter = window.innerWidth / 2

    let activeIdx = 0
    let minDiff = Infinity

    cards.forEach((card, idx) => {
      const cardRect = card.getBoundingClientRect()
      const cardCenter = cardRect.left + cardRect.width / 2
      const diff = Math.abs(cardCenter - viewportCenter)
      if (diff < minDiff) {
        minDiff = diff
        activeIdx = idx
      }
    })

    currentCardIndex = activeIdx

    // Update plate indicator: Card 0 is foreword (shows 01), Cards 1..6 are artworks, Card 7 is acquisitions
    if (indexEl) {
      let plateNum = activeIdx
      if (activeIdx === 0) plateNum = 1
      else if (activeIdx > totalArtworks) plateNum = totalArtworks
      indexEl.textContent = String(plateNum).padStart(2, "0")
    }

    // Update progress bar
    if (progressEl) {
      progressEl.style.width = `${Math.max(12, progress * 100)}%`
    }
  }

  // Master ScrollTrigger for Horizontal Lookbook Pinning
  const scrollTween = gsap.to(track, {
    x: () => -getScrollDistance(),
    ease: "none",
    scrollTrigger: {
      trigger: catalogueSection,
      pin: true,
      anticipatePin: 1,
      scrub: 0.8,
      // Begins when the artwork cards are vertically centered in the viewport
      start: () => {
        const card = track.querySelector(
          ".catalogue-card",
        ) as HTMLElement | null
        const wrapper = document.querySelector(
          ".catalogue-carousel-wrapper",
        ) as HTMLElement | null
        if (card && wrapper) {
          const cardCenterFromSectionTop =
            wrapper.offsetTop + card.offsetHeight / 2
          return `top+=${cardCenterFromSectionTop} center`
        }
        return "top top"
      },
      end: () => `+=${getScrollDistance()}`,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        updateActiveCard(self.progress)
      },
    },
  })

  const st = scrollTween.scrollTrigger

  // Navigate to a specific card smoothly
  function goToCard(targetIndex: number) {
    const cards = getCards()
    const clampedIndex = Math.max(0, Math.min(cards.length - 1, targetIndex))
    const targetCard = cards[clampedIndex]
    if (!targetCard || !st) return

    const totalDist = getScrollDistance()
    if (totalDist <= 0) return

    const cardOffset =
      targetCard.offsetLeft - (window.innerWidth < 640 ? 24 : 64)
    const progressRatio = Math.max(0, Math.min(1, cardOffset / totalDist))
    const targetScrollY = st.start + progressRatio * (st.end - st.start)

    window.scrollTo({
      top: targetScrollY,
      behavior: "smooth",
    })
  }

  // Smooth scroll to catalogue when Hero cue is clicked
  const cueLink = document.querySelector(".catalogue-scroll-cue")
  if (cueLink && st) {
    cueLink.addEventListener("click", (e) => {
      e.preventDefault()
      window.scrollTo({
        top: st.start + 1,
        behavior: "smooth",
      })
    })
  }

  // Horizontal touch swipe handling on mobile devices
  let touchStartX = 0
  let touchStartY = 0
  let isTouching = false

  track.addEventListener(
    "touchstart",
    (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX
        touchStartY = e.touches[0].clientY
        isTouching = true
      }
    },
    { passive: true },
  )

  track.addEventListener(
    "touchend",
    (e: TouchEvent) => {
      if (!isTouching || e.changedTouches.length === 0) return
      isTouching = false
      const deltaX = e.changedTouches[0].clientX - touchStartX
      const deltaY = e.changedTouches[0].clientY - touchStartY

      // Swipe detected if horizontal motion is significant and greater than vertical
      if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.1) {
        if (deltaX < 0) {
          goToCard(currentCardIndex + 1)
        } else {
          goToCard(currentCardIndex - 1)
        }
      }
    },
    { passive: true },
  )

  // Card image subtle scale animation on scroll
  const cards = getCards()
  cards.forEach((card) => {
    const img = card.querySelector(".artwork-img")
    if (img) {
      gsap.fromTo(
        img,
        { scale: 1.08 },
        {
          scale: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            containerAnimation: scrollTween,
            start: "left right",
            end: "center center",
            scrub: true,
          },
        },
      )
    }
  })

  // Initial call to set active states
  if (st) {
    updateActiveCard(st.progress || 0)
  }

  // Back to Top button in Colophon
  const scrollToTopBtn = document.getElementById("scroll-to-top-btn")
  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" })
    })
  }

  /* -------------------------------------------------------------
   * EDITORIAL DETAIL LIGHTBOX MODAL
   * ------------------------------------------------------------- */
  const modal = document.getElementById("artwork-modal")
  const modalCard = document.getElementById("modal-card")
  const modalBackdrop = document.getElementById("modal-backdrop")
  const modalCloseBtn = document.getElementById("modal-close-btn")

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
    const artworks = getArtworks()
    const item = artworks.find((a) => a.id === artworkId)
    if (!item || !modal || !modalCard) return

    if (modalImg) {
      modalImg.src = item.image
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

    // Set dynamic protected inquiry parameters (no raw plaintext in static markup)
    if (modalWhatsAppBtn) {
      modalWhatsAppBtn.setAttribute(
        "data-message",
        `Hello, I would like to inquire about "${item.title}" (Nº ${item.number}) from the RabbitHole catalogue.`,
      )
    }

    if (modalEmailBtn) {
      modalEmailBtn.setAttribute(
        "data-subject",
        `Inquiry: "${item.title}" (Nº ${item.number})`,
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

  // Open modal triggers
  document.querySelectorAll("[data-artwork-id]").forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.stopPropagation()
      const id = trigger.getAttribute("data-artwork-id")
      if (id) openArtworkModal(id)
    })
  })

  document.querySelectorAll(".artwork-frame").forEach((frame) => {
    frame.addEventListener("click", () => {
      const article = frame.closest("article")
      const id = article?.getAttribute("data-id")
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
 * Handles protected contact interactions:
 * - Direct action triggers decode dynamically and launch WhatsApp/Email on demand
 * - Colophon "Click to View" reveal interactions with animated state change and clipboard copy
 */
function initProtectedContactHandlers() {
  // 1. Direct contact action buttons (Dock, Modal, Catalogue Closing Card)
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

  // 2. Colophon Click-to-View reveal groups
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

    // Direct action button (Chat / Send Email)
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

    // Copy to clipboard with GSAP animation feedback
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
          // Fallback if clipboard API restricted
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
