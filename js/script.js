/**
 * Christian Jhune T. Villapaz — Portfolio Script
 * Features: mobile nav, smooth scroll, active link,
 * lightbox, scroll reveal, back-to-top, project preview
 */

(function () {
  "use strict";

  /* ---------- DOM helpers ---------- */
  const qs = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Mobile hamburger navigation ---------- */
  function initMobileNav() {
    const toggle = qs(".nav-toggle");
    const menu = qs(".nav-links");
    if (!toggle || !menu) return;

    const closeMenu = () => {
      toggle.setAttribute("aria-expanded", "false");
      menu.classList.remove("is-open");
      document.body.style.overflow = "";
    };

    const openMenu = () => {
      toggle.setAttribute("aria-expanded", "true");
      menu.classList.add("is-open");
      document.body.style.overflow = "hidden";
    };

    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      if (expanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close when a link is clicked
    qsa("a", menu).forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    // Close if viewport grows past mobile breakpoint
    window.addEventListener("resize", () => {
      if (window.innerWidth > 767) closeMenu();
    });
  }

  /* ---------- Active navigation link ---------- */
  function initActiveNav() {
    const path = window.location.pathname.split("/").pop() || "index.html";
    const current = path === "" ? "index.html" : path;

    qsa(".nav-links a").forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;

      const linkFile = href.split("/").pop().split("#")[0];
      const isHome =
        (current === "index.html" || current === "") &&
        (linkFile === "index.html" || linkFile === "");
      const isMatch = linkFile === current;

      if (isHome || isMatch) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  /* ---------- Smooth scrolling for same-page anchors ---------- */
  function initSmoothScroll() {
    qsa('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        const id = anchor.getAttribute("href");
        if (!id || id === "#") return;
        const target = qs(id);
        if (!target) return;
        e.preventDefault();
        const headerOffset = qs(".site-header")?.offsetHeight || 72;
        const top =
          target.getBoundingClientRect().top + window.scrollY - headerOffset - 8;
        window.scrollTo({ top, behavior: "smooth" });
      });
    });
  }

  /* ---------- Lightbox / modal ---------- */
  function initLightbox() {
    const lightbox = qs("#lightbox");
    if (!lightbox) return;

    const imgEl = qs(".lightbox-image", lightbox);
    const captionEl = qs(".lightbox-caption", lightbox);
    const closeBtn = qs(".lightbox-close", lightbox);
    const triggers = qsa("[data-lightbox]");

    if (!imgEl || triggers.length === 0) return;

    const open = (src, alt, caption) => {
      imgEl.src = src;
      imgEl.alt = alt || caption || "Expanded photo";
      if (captionEl) captionEl.textContent = caption || alt || "";
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      closeBtn?.focus();
    };

    const close = () => {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      imgEl.removeAttribute("src");
    };

    triggers.forEach((el) => {
      el.addEventListener("click", () => {
        const src =
          el.getAttribute("data-full") ||
          el.querySelector("img")?.getAttribute("src");
        const img = el.querySelector("img");
        const alt = img?.alt || "";
        const caption =
          el.getAttribute("data-caption") ||
          el.querySelector("figcaption")?.textContent?.trim() ||
          alt;
        if (src) open(src, alt, caption);
      });

      // Keyboard support for non-button triggers
      if (el.tagName !== "BUTTON" && el.tagName !== "A") {
        el.setAttribute("tabindex", "0");
        el.setAttribute("role", "button");
        el.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            el.click();
          }
        });
      }
    });

    closeBtn?.addEventListener("click", close);

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightbox.classList.contains("is-open")) {
        close();
      }
    });
  }

  /* ---------- Scroll reveal animations ---------- */
  function initScrollReveal() {
    const items = qsa(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach((el) => observer.observe(el));
  }

  /* ---------- Back to top button ---------- */
  function initBackToTop() {
    const btn = qs(".back-to-top");
    if (!btn) return;

    const toggle = () => {
      if (window.scrollY > 400) {
        btn.classList.add("is-visible");
      } else {
        btn.classList.remove("is-visible");
      }
    };

    window.addEventListener("scroll", toggle, { passive: true });
    toggle();

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    initMobileNav();
    initActiveNav();
    initSmoothScroll();
    initLightbox();
    initScrollReveal();
    initBackToTop();
  });
})();
