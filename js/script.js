/* ==========================================================================
   DCS – Digital Commerce Solutions
   Shared JavaScript for all pages (vanilla JS, no frameworks)
   ========================================================================== */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------
     1. Sticky header shadow + mobile hamburger menu
  ------------------------------------------------------------------ */
  const header = $(".site-header");
  const toggle = $(".nav__toggle");
  const menu = $("#nav-menu");

  function closeMenu() {
    document.body.classList.remove("nav-open", "no-scroll");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = !document.body.classList.contains("nav-open");
      document.body.classList.toggle("nav-open", open);
      document.body.classList.toggle("no-scroll", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    $$(".nav__link, .nav__cta a", menu).forEach((link) => link.addEventListener("click", closeMenu));
    window.addEventListener("resize", () => { if (window.innerWidth > 1024) closeMenu(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
  }

  /* ------------------------------------------------------------------
     2. Active navigation highlighting (based on current file name)
  ------------------------------------------------------------------ */
  const current = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  $$(".nav__link").forEach((link) => {
    const target = (link.getAttribute("href") || "").split("#")[0].toLowerCase();
    const isActive = target === current || (current === "" && target === "index.html");
    link.classList.toggle("active", isActive);
    if (isActive) link.setAttribute("aria-current", "page");
  });

  /* ------------------------------------------------------------------
     3. Scroll-dependent UI: header shadow + back-to-top button
  ------------------------------------------------------------------ */
  const backToTop = $(".back-to-top");
  function onScroll() {
    const y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 10);
    if (backToTop) backToTop.classList.toggle("is-visible", y > 500);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ------------------------------------------------------------------
     4. Smooth scrolling for same-page anchor links
  ------------------------------------------------------------------ */
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      history.pushState(null, "", id);
    });
  });

  /* Placeholder social links (no URL yet) should not jump to the top */
  $$("a.is-placeholder").forEach((a) => a.addEventListener("click", (e) => e.preventDefault()));

  /* ------------------------------------------------------------------
     5. Reveal-on-scroll animation
  ------------------------------------------------------------------ */
  const reveals = $$(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* ------------------------------------------------------------------
     6. Animated counters (Results page)
        Edit the numbers in achievements.html: data-target="..."
  ------------------------------------------------------------------ */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target) || 0;
    const numEl = $(".num", el) || el;
    if (reduceMotion) { numEl.textContent = target.toLocaleString("en-IN"); return; }
    const duration = 1800;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      numEl.textContent = Math.round(target * eased).toLocaleString("en-IN");
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  const counters = $$("[data-counter]");
  if (counters.length) {
    if ("IntersectionObserver" in window) {
      const cio = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { animateCounter(entry.target); cio.unobserve(entry.target); }
        });
      }, { threshold: 0.5 });
      counters.forEach((c) => cio.observe(c));
    } else {
      counters.forEach(animateCounter);
    }
  }

  /* ------------------------------------------------------------------
     7. FAQ accordion (expand / collapse)
  ------------------------------------------------------------------ */
  $$(".faq__item").forEach((item) => {
    const btn = $(".faq__q", item);
    const panel = $(".faq__a", item);
    if (!btn || !panel) return;
    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");
      // close others for a tidy accordion
      $$(".faq__item.is-open").forEach((other) => {
        if (other !== item) {
          other.classList.remove("is-open");
          $(".faq__q", other).setAttribute("aria-expanded", "false");
          $(".faq__a", other).style.maxHeight = null;
        }
      });
      item.classList.toggle("is-open", !isOpen);
      btn.setAttribute("aria-expanded", String(!isOpen));
      panel.style.maxHeight = isOpen ? null : panel.scrollHeight + "px";
    });
  });

  /* ------------------------------------------------------------------
     8. Gallery lightbox
  ------------------------------------------------------------------ */
  const galleryItems = $$(".gallery__item");
  const lightbox = $(".lightbox");
  if (galleryItems.length && lightbox) {
    const img = $(".lightbox__img", lightbox);
    const caption = $(".lightbox__caption", lightbox);
    const count = $(".lightbox__count", lightbox);
    let index = 0;
    let lastFocus = null;

    function show(i) {
      index = (i + galleryItems.length) % galleryItems.length;
      const item = galleryItems[index];
      img.src = item.dataset.full || $("img", item).src;
      img.alt = $("img", item).alt;
      caption.innerHTML = "<strong>" + item.dataset.title + "</strong>" + (item.dataset.caption ? " · " + item.dataset.caption : "");
      count.textContent = (index + 1) + " / " + galleryItems.length;
    }
    function open(i) {
      lastFocus = document.activeElement;
      show(i);
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("no-scroll");
      $(".lightbox__close", lightbox).focus();
    }
    function close() {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.classList.remove("no-scroll");
      if (lastFocus) lastFocus.focus();
    }
    galleryItems.forEach((item, i) => item.addEventListener("click", () => open(i)));
    $(".lightbox__close", lightbox).addEventListener("click", close);
    $(".lightbox__prev", lightbox).addEventListener("click", () => show(index - 1));
    $(".lightbox__next", lightbox).addEventListener("click", () => show(index + 1));
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) close(); });
    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(index - 1);
      if (e.key === "ArrowRight") show(index + 1);
    });
  }

  /* ------------------------------------------------------------------
     9. Admission enquiry form – validation + demo submission
        NOTE: no backend is connected. Enquiries are NOT stored or sent.
        To receive enquiries, connect a form service (e.g. Formspree,
        Google Forms, Getform) – see README.md.
  ------------------------------------------------------------------ */
  const form = $("#enquiry-form");
  if (form) {
    const alertOk = $("#form-success");
    const alertErr = $("#form-error");
    const submitBtn = $('button[type="submit"]', form);

    const rules = {
      studentName: (v) => v.trim().length >= 2 || "Please enter the student's full name.",
      parentName: (v) => v.trim().length >= 2 || "Please enter the parent/guardian's name.",
      mobile: (v) => {
        const digits = v.replace(/[\s-]/g, "").replace(/^(\+91|91|0)(?=\d{10}$)/, "");
        if (!digits) return "Please enter a mobile number.";
        return /^[6-9]\d{9}$/.test(digits) || "Enter a valid 10-digit Indian mobile number (starting with 6–9).";
      },
      email: (v) => {
        if (!v.trim()) return "Please enter an email address.";
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || "Please enter a valid email address (e.g. name@example.com).";
      },
      currentClass: (v) => !!v || "Please select the current class.",
      subject: (v) => !!v || "Please select the subject of interest.",
      mode: (v) => !!v || "Please choose a preferred mode of learning.",
      message: (v) => v.length <= 600 || "Please keep your message under 600 characters."
    };

    function getValue(name) {
      const field = form.elements[name];
      if (!field) return "";
      if (field instanceof RadioNodeList) return field.value;
      return field.value;
    }
    function setError(name, msg) {
      const group = $('[data-field="' + name + '"]', form);
      if (!group) return;
      const err = $(".field-error span", group);
      group.classList.toggle("has-error", !!msg);
      if (err) err.textContent = msg || "";
      const inputs = $$("input, select, textarea", group);
      inputs.forEach((i) => i.setAttribute("aria-invalid", msg ? "true" : "false"));
    }
    function validateField(name) {
      const result = rules[name](getValue(name));
      setError(name, result === true ? "" : result);
      return result === true;
    }

    Object.keys(rules).forEach((name) => {
      const field = form.elements[name];
      if (!field) return;
      const list = field instanceof RadioNodeList ? Array.from(field) : [field];
      list.forEach((el) => {
        el.addEventListener("blur", () => { if (el.value) validateField(name); });
        el.addEventListener("change", () => validateField(name));
        el.addEventListener("input", () => {
          const g = $('[data-field="' + name + '"]', form);
          if (g && g.classList.contains("has-error")) validateField(name);
        });
      });
    });

    const msgField = form.elements.message;
    const msgCount = $("#message-count");
    if (msgField && msgCount) {
      msgField.addEventListener("input", () => { msgCount.textContent = msgField.value.length + " / 600"; });
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alertOk.classList.remove("is-visible");
      alertErr.classList.remove("is-visible");

      let firstInvalid = null;
      Object.keys(rules).forEach((name) => {
        if (!validateField(name) && !firstInvalid) firstInvalid = name;
      });

      if (firstInvalid) {
        alertErr.classList.add("is-visible");
        const group = $('[data-field="' + firstInvalid + '"]', form);
        const focusEl = group && $("input, select, textarea", group);
        if (group) group.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
        if (focusEl) setTimeout(() => focusEl.focus({ preventScroll: true }), 350);
        return;
      }

      // Demonstration submission (no data leaves the browser)
      submitBtn.classList.add("is-loading");
      const label = $(".label", submitBtn);
      const original = label.textContent;
      label.textContent = "Submitting…";

      setTimeout(() => {
        submitBtn.classList.remove("is-loading");
        label.textContent = original;
        const name = getValue("studentName").trim().split(" ")[0];
        $("#success-name").textContent = name;
        alertOk.classList.add("is-visible");
        alertOk.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
        form.reset();
        if (msgCount) msgCount.textContent = "0 / 600";
        Object.keys(rules).forEach((n) => setError(n, ""));
      }, 900);
    });
  }

  /* ------------------------------------------------------------------
     10. Footer year
  ------------------------------------------------------------------ */
  $$("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
