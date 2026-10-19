(function () {
  "use strict";

  var nav = document.getElementById("nav");
  var toggle = nav && nav.querySelector(".nav__toggle");
  var menu = document.getElementById("nav-menu");

  // Shadow the nav once the page is scrolled.
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("nav--stuck", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Mobile menu.
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("nav--open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("nav--open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Highlight the nav link for the section currently in view.
  var links = menu ? Array.prototype.slice.call(menu.querySelectorAll('a[href^="#"]')) : [];
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  // --- Contact form ---------------------------------------------------------

  var form = document.querySelector(".form");
  var note = document.getElementById("form-note");
  var interest = document.getElementById("f-interest");

  // Stamp load time so the handler can reject instant submissions.
  var tsField = document.getElementById("form-ts");
  if (tsField) {
    tsField.value = String(Math.floor(Date.now() / 1000));
  }

  // CTAs link to "#kontakt" with a data-interest attribute — preselect that option.
  var selectInterest = function (value) {
    if (!interest || !value) return;
    var match = Array.prototype.some.call(interest.options, function (o) { return o.value === value; });
    if (match) interest.value = value;
  };

  document.addEventListener("click", function (e) {
    var link = e.target.closest && e.target.closest('a[href="#kontakt"][data-interest]');
    if (!link) return;
    e.preventDefault();
    selectInterest(link.getAttribute("data-interest"));
    var target = document.getElementById("kontakt");
    if (target) target.scrollIntoView({ block: "start" });
  });

  // Surface the outcome of contact.php's redirect.
  var MESSAGES = {
    cs: {
      ok: "Děkujeme, zprávu jsme přijali. Ozveme se vám co nejdříve.",
      name: "vyplňte jméno",
      contact: "uveďte e-mail nebo telefon",
      email: "zkontrolujte tvar e-mailu",
      message: "napište prosím zprávu",
      interest: "vyberte platnou možnost",
      send: "Zprávu se nepodařilo odeslat. Zavolejte nám prosím na +420 732 916 190.",
      lead: "Zkontrolujte prosím formulář — "
    },
    en: {
      ok: "Thank you, we have received your message and will be in touch shortly.",
      name: "enter your name",
      contact: "provide an email or phone number",
      email: "check the email format",
      message: "please write a message",
      interest: "choose a valid option",
      send: "The message could not be sent. Please call us on +420 732 916 190.",
      lead: "Please check the form — "
    }
  };

  if (note) {
    var params = new URLSearchParams(window.location.search);
    var t = MESSAGES[document.documentElement.lang === "en" ? "en" : "cs"];

    if (params.get("sent") === "1") {
      note.textContent = t.ok;
      note.className = "formnote formnote--ok";
      note.hidden = false;
    } else if (params.get("error")) {
      var keys = params.get("error").split(",");
      if (keys.length === 1 && keys[0] === "send") {
        note.textContent = t.send;
      } else {
        note.textContent = t.lead + keys.map(function (k) { return t[k] || k; }).join(", ") + ".";
        keys.forEach(function (k) {
          var input = form && form.querySelector('[name="' + (k === "contact" ? "email" : k) + '"]');
          if (input && input.closest(".field")) input.closest(".field").classList.add("is-bad");
        });
      }
      note.className = "formnote formnote--bad";
      note.hidden = false;
    }

    if (!note.hidden) {
      note.setAttribute("role", "status");
    }
  }

  // --- Scroll reveal --------------------------------------------------------

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduced && "IntersectionObserver" in window) {
    var targets = document.querySelectorAll(".section > .wrap, .hero__body");
    Array.prototype.forEach.call(targets, function (el) { el.classList.add("reveal"); });

    var revealer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("reveal--in");
        obs.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.05 });

    Array.prototype.forEach.call(targets, function (el) { revealer.observe(el); });
  }
})();
