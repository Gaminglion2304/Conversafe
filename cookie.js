/**
 * ConverSafe Cookie Consent
 * UK GDPR + PECR compliant — explicit opt-in, granular categories, reject-all
 * Trilingual: EN / DE / ES (follows the site's setLang() system)
 * Drop this file alongside index.html and add: <script src="cookie-consent.js"></script>
 * just before the closing </body> tag (after the existing <script> block).
 */

(function () {
  "use strict";

  /* ─── COPY ─── */
  const COPY = {
    en: {
      title: "We use cookies",
      intro:
        "We use cookies to make our website work and, with your consent, to understand how it's used. You can accept all, reject all, or choose by category. You can change your preference at any time via the cookie icon at the bottom of the page.",
      necessary: "Strictly necessary",
      necessaryDesc:
        "Required for the site to function — session management and language preference. Cannot be turned off.",
      analytics: "Analytics",
      analyticsDesc:
        "Helps us understand how visitors use the site (e.g. Google Analytics). Data is anonymised.",
      marketing: "Marketing",
      marketingDesc:
        "Used to show relevant ads or track campaign performance across other websites.",
      acceptAll: "Accept all",
      rejectAll: "Reject all",
      savePrefs: "Save preferences",
      managePrefs: "Manage preferences",
      privacyLink: "Privacy policy",
      toastChanged: "Cookie preferences saved.",
    },
    de: {
      title: "Wir verwenden Cookies",
      intro:
        "Wir verwenden Cookies, damit unsere Website funktioniert und – mit Ihrer Zustimmung – um zu verstehen, wie sie genutzt wird. Sie können alle akzeptieren, alle ablehnen oder nach Kategorie wählen. Sie können Ihre Einstellungen jederzeit über das Cookie-Symbol am unteren Seitenrand ändern.",
      necessary: "Unbedingt notwendig",
      necessaryDesc:
        "Für den Betrieb der Website erforderlich – Sitzungsverwaltung und Spracheinstellung. Kann nicht deaktiviert werden.",
      analytics: "Analyse",
      analyticsDesc:
        "Hilft uns zu verstehen, wie Besucher die Website nutzen (z. B. Google Analytics). Daten werden anonymisiert.",
      marketing: "Marketing",
      marketingDesc:
        "Wird verwendet, um relevante Anzeigen zu schalten oder die Kampagnenleistung auf anderen Websites zu verfolgen.",
      acceptAll: "Alle akzeptieren",
      rejectAll: "Alle ablehnen",
      savePrefs: "Einstellungen speichern",
      managePrefs: "Einstellungen verwalten",
      privacyLink: "Datenschutzerklärung",
      toastChanged: "Cookie-Einstellungen gespeichert.",
    },
    es: {
      title: "Usamos cookies",
      intro:
        "Usamos cookies para que nuestro sitio funcione y, con su consentimiento, para entender cómo se utiliza. Puede aceptar todas, rechazar todas o elegir por categoría. Puede cambiar su preferencia en cualquier momento mediante el icono de cookie en la parte inferior de la página.",
      necessary: "Estrictamente necesarias",
      necessaryDesc:
        "Necesarias para el funcionamiento del sitio: gestión de sesiones y preferencia de idioma. No se pueden desactivar.",
      analytics: "Analítica",
      analyticsDesc:
        "Nos ayuda a entender cómo los visitantes usan el sitio (p. ej. Google Analytics). Los datos son anonimizados.",
      marketing: "Marketing",
      marketingDesc:
        "Se utiliza para mostrar anuncios relevantes o rastrear el rendimiento de campañas en otros sitios web.",
      acceptAll: "Aceptar todas",
      rejectAll: "Rechazar todas",
      savePrefs: "Guardar preferencias",
      managePrefs: "Gestionar preferencias",
      privacyLink: "Política de privacidad",
      toastChanged: "Preferencias de cookies guardadas.",
    },
  };

  /* ─── STORAGE HELPERS ─── */
  const STORE_KEY = "conversafe-cookie-consent";

  function saveConsent(prefs) {
    try {
      localStorage.setItem(
        STORE_KEY,
        JSON.stringify({ ts: Date.now(), prefs })
      );
    } catch (_) {}
  }

  function loadConsent() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      // Re-ask after 12 months
      if (Date.now() - data.ts > 365 * 24 * 3600 * 1000) return null;
      return data.prefs;
    } catch (_) {
      return null;
    }
  }

  /* ─── LANG HELPER ─── */
  function getLang() {
    const saved = (function () {
      try {
        return localStorage.getItem("selfty-lang");
      } catch (_) {
        return null;
      }
    })();
    return saved === "de" ? "de" : saved === "es" ? "es" : "en";
  }

  /* ─── INJECT STYLES ─── */
  function injectStyles() {
    const style = document.createElement("style");
    style.id = "cc-styles";
    style.textContent = `
      /* ── Cookie Banner ── */
      #cc-banner {
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%);
        width: min(680px, calc(100vw - 32px));
        background: #ffffff;
        border: 1px solid rgba(100,120,150,0.18);
        border-radius: 14px;
        box-shadow: 0 8px 40px rgba(15,25,45,0.14), 0 2px 8px rgba(15,25,45,0.06);
        padding: 26px 28px 22px;
        z-index: 9999;
        font-family: 'DM Sans', sans-serif;
        color: #1a2535;
        animation: cc-slideUp 0.42s cubic-bezier(0.22,1,0.36,1) both;
      }
      @keyframes cc-slideUp {
        from { opacity: 0; transform: translateX(-50%) translateY(28px); }
        to   { opacity: 1; transform: translateX(-50%) translateY(0); }
      }

      #cc-banner h3 {
        font-family: 'DM Serif Display', serif;
        font-size: 1.15rem;
        font-weight: 400;
        margin: 0 0 10px;
        color: #1a2535;
      }
      #cc-banner p.cc-intro {
        font-size: 0.84rem;
        color: #5a6a7e;
        line-height: 1.6;
        margin: 0 0 18px;
      }

      /* Categories (hidden until expanded) */
      #cc-categories {
        display: none;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 18px;
      }
      #cc-categories.cc-show { display: flex; }

      .cc-cat {
        background: #eef1f5;
        border: 1px solid rgba(100,120,150,0.15);
        border-radius: 10px;
        padding: 12px 14px;
        display: flex;
        align-items: flex-start;
        gap: 14px;
      }
      .cc-cat-text { flex: 1; }
      .cc-cat-text strong {
        display: block;
        font-size: 0.84rem;
        font-weight: 600;
        margin-bottom: 2px;
        color: #1a2535;
      }
      .cc-cat-text span {
        font-size: 0.78rem;
        color: #5a6a7e;
        line-height: 1.5;
      }

      /* Toggle switch */
      .cc-toggle {
        flex-shrink: 0;
        width: 38px;
        height: 22px;
        position: relative;
        margin-top: 1px;
      }
      .cc-toggle input { opacity: 0; width: 0; height: 0; position: absolute; }
      .cc-toggle .cc-slider {
        position: absolute;
        inset: 0;
        background: #c8d2de;
        border-radius: 22px;
        cursor: pointer;
        transition: background 0.2s;
      }
      .cc-toggle .cc-slider::after {
        content: '';
        position: absolute;
        top: 3px; left: 3px;
        width: 16px; height: 16px;
        background: #fff;
        border-radius: 50%;
        transition: transform 0.2s;
        box-shadow: 0 1px 3px rgba(0,0,0,0.15);
      }
      .cc-toggle input:checked + .cc-slider { background: #2f6fa8; }
      .cc-toggle input:checked + .cc-slider::after { transform: translateX(16px); }
      .cc-toggle input:disabled + .cc-slider { cursor: not-allowed; opacity: 0.6; }
      .cc-toggle input:focus-visible + .cc-slider {
        outline: 2px solid #5b9bd5;
        outline-offset: 2px;
      }

      /* Buttons row */
      .cc-btns {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
        justify-content: flex-end;
      }
      .cc-btns a.cc-privacy {
        font-size: 0.78rem;
        color: #5a6a7e;
        text-decoration: underline;
        text-underline-offset: 2px;
        margin-right: auto;
        font-weight: 400;
        cursor: pointer;
      }
      .cc-btns a.cc-privacy:hover { color: #2f6fa8; }

      .cc-btn {
        border: none;
        border-radius: 8px;
        padding: 9px 18px;
        font-size: 0.82rem;
        font-weight: 600;
        font-family: 'DM Sans', sans-serif;
        cursor: pointer;
        transition: background 0.18s, transform 0.12s;
        white-space: nowrap;
      }
      .cc-btn:hover { transform: translateY(-1px); }
      .cc-btn--manage {
        background: #eef1f5;
        color: #1a2535;
        border: 1px solid rgba(100,120,150,0.2);
      }
      .cc-btn--manage:hover { background: #dde3ec; }
      .cc-btn--reject {
        background: #eef1f5;
        color: #1a2535;
        border: 1px solid rgba(100,120,150,0.2);
      }
      .cc-btn--reject:hover { background: #dde3ec; }
      .cc-btn--accept {
        background: #2f6fa8;
        color: #fff;
      }
      .cc-btn--accept:hover { background: #5b9bd5; }

      /* ── Floating re-open icon ── */
      #cc-fab {
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 42px;
        height: 42px;
        background: #2f6fa8;
        color: #fff;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        z-index: 9998;
        display: none;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 16px rgba(47,111,168,0.35);
        transition: background 0.2s, transform 0.15s;
        font-size: 1.1rem;
        line-height: 1;
      }
      #cc-fab:hover { background: #5b9bd5; transform: scale(1.08); }
      #cc-fab.cc-fab-show { display: flex; }
      #cc-fab[title] { /* tooltip */ }

      /* ── Toast ── */
      #cc-toast {
        position: fixed;
        bottom: 72px;
        left: 20px;
        background: #1a2535;
        color: #fff;
        font-family: 'DM Sans', sans-serif;
        font-size: 0.82rem;
        font-weight: 500;
        padding: 10px 18px;
        border-radius: 8px;
        z-index: 9999;
        opacity: 0;
        transform: translateY(8px);
        transition: opacity 0.28s, transform 0.28s;
        pointer-events: none;
        white-space: nowrap;
      }
      #cc-toast.cc-toast-show {
        opacity: 1;
        transform: translateY(0);
      }

      @media (max-width: 480px) {
        #cc-banner { padding: 20px 16px 18px; }
        .cc-btns { justify-content: stretch; }
        .cc-btn { flex: 1; text-align: center; }
        .cc-btns a.cc-privacy { width: 100%; margin-bottom: 4px; }
      }
    `;
    document.head.appendChild(style);
  }

  /* ─── BUILD BANNER HTML ─── */
  function buildBanner(lang, prefs) {
    const c = COPY[lang];
    const analyticsChecked = prefs ? prefs.analytics : false;
    const marketingChecked = prefs ? prefs.marketing : false;
    const isManaging = !!prefs; // show categories open if re-managing

    const banner = document.createElement("div");
    banner.id = "cc-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-modal", "true");
    banner.setAttribute("aria-label", c.title);
    banner.innerHTML = `
      <h3>${c.title}</h3>
      <p class="cc-intro">${c.intro}</p>

      <div id="cc-categories" class="${isManaging ? "cc-show" : ""}">
        <!-- Strictly necessary (always on) -->
        <div class="cc-cat">
          <div class="cc-cat-text">
            <strong>${c.necessary}</strong>
            <span>${c.necessaryDesc}</span>
          </div>
          <label class="cc-toggle" aria-label="${c.necessary}">
            <input type="checkbox" id="cc-chk-necessary" checked disabled>
            <span class="cc-slider"></span>
          </label>
        </div>
        <!-- Analytics -->
        <div class="cc-cat">
          <div class="cc-cat-text">
            <strong>${c.analytics}</strong>
            <span>${c.analyticsDesc}</span>
          </div>
          <label class="cc-toggle" aria-label="${c.analytics}">
            <input type="checkbox" id="cc-chk-analytics" ${analyticsChecked ? "checked" : ""}>
            <span class="cc-slider"></span>
          </label>
        </div>
        <!-- Marketing -->
        <div class="cc-cat">
          <div class="cc-cat-text">
            <strong>${c.marketing}</strong>
            <span>${c.marketingDesc}</span>
          </div>
          <label class="cc-toggle" aria-label="${c.marketing}">
            <input type="checkbox" id="cc-chk-marketing" ${marketingChecked ? "checked" : ""}>
            <span class="cc-slider"></span>
          </label>
        </div>
      </div>

      <div class="cc-btns">
        <a class="cc-privacy" href="Docs/ConverSafe-Website-policy-November-2024.pdf" target="_blank" rel="noopener">${c.privacyLink}</a>
        <button class="cc-btn cc-btn--manage" id="cc-btn-manage">${isManaging ? c.savePrefs : c.managePrefs}</button>
        <button class="cc-btn cc-btn--reject" id="cc-btn-reject">${c.rejectAll}</button>
        <button class="cc-btn cc-btn--accept" id="cc-btn-accept">${c.acceptAll}</button>
      </div>
    `;
    return banner;
  }

  /* ─── TOAST ─── */
  function showToast(msg) {
    let toast = document.getElementById("cc-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "cc-toast";
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add("cc-toast-show");
    setTimeout(() => toast.classList.remove("cc-toast-show"), 2800);
  }

  /* ─── FAB (floating cookie icon) ─── */
  function buildFab(lang) {
    let fab = document.getElementById("cc-fab");
    if (!fab) {
      fab = document.createElement("button");
      fab.id = "cc-fab";
      fab.innerHTML = "🍪";
      fab.setAttribute("aria-label", COPY[lang].managePrefs);
      fab.title = COPY[lang].managePrefs;
      document.body.appendChild(fab);
    }
    fab.onclick = function () {
      fab.classList.remove("cc-fab-show");
      openBanner(true);
    };
  }

  function showFab() {
    const fab = document.getElementById("cc-fab");
    if (fab) fab.classList.add("cc-fab-show");
  }

  function hideFab() {
    const fab = document.getElementById("cc-fab");
    if (fab) fab.classList.remove("cc-fab-show");
  }

  /* ─── OPEN / CLOSE BANNER ─── */
  function openBanner(isReopen) {
    const existing = document.getElementById("cc-banner");
    if (existing) existing.remove();

    const lang = getLang();
    const prefs = isReopen ? loadConsent() : null;
    const banner = buildBanner(lang, prefs);
    document.body.appendChild(banner);

    const categoriesEl = document.getElementById("cc-categories");
    const manageBtn = document.getElementById("cc-btn-manage");
    let managingOpen = isReopen;

    manageBtn.addEventListener("click", function () {
      if (!managingOpen) {
        // First click: expand categories
        managingOpen = true;
        categoriesEl.classList.add("cc-show");
        manageBtn.textContent = COPY[lang].savePrefs;
      } else {
        // Second click: save custom prefs
        dismiss({
          necessary: true,
          analytics: document.getElementById("cc-chk-analytics").checked,
          marketing: document.getElementById("cc-chk-marketing").checked,
        }, lang);
      }
    });

    document.getElementById("cc-btn-reject").addEventListener("click", function () {
      dismiss({ necessary: true, analytics: false, marketing: false }, lang);
    });

    document.getElementById("cc-btn-accept").addEventListener("click", function () {
      dismiss({ necessary: true, analytics: true, marketing: true }, lang);
    });
  }

  function dismiss(prefs, lang) {
    saveConsent(prefs);
    const banner = document.getElementById("cc-banner");
    if (banner) banner.remove();
    showFab();
    if (loadConsent()) showToast(COPY[lang].toastChanged);
    applyConsent(prefs);
  }

  /* ─── APPLY CONSENT (fire events / enable scripts) ─── */
  function applyConsent(prefs) {
    // Dispatch a custom event so analytics scripts can listen
    window.dispatchEvent(
      new CustomEvent("cookieConsentUpdate", { detail: prefs })
    );
    // Example: enable GA only if analytics accepted
    // if (prefs.analytics && typeof gtag === 'function') { ... }
  }

  /* ─── HOOK INTO SITE'S setLang() SO BANNER UPDATES TOO ─── */
  function patchSetLang() {
    const orig = window.setLang;
    if (typeof orig === "function") {
      window.setLang = function (lang) {
        orig(lang);
        // If banner is currently open, rebuild it in the new language
        const banner = document.getElementById("cc-banner");
        if (banner) {
          banner.remove();
          openBanner(!!loadConsent());
        }
        // Update FAB title
        const fab = document.getElementById("cc-fab");
        if (fab) {
          fab.setAttribute("aria-label", COPY[lang]?.managePrefs || COPY.en.managePrefs);
          fab.title = COPY[lang]?.managePrefs || COPY.en.managePrefs;
        }
      };
    }
  }

  /* ─── INIT ─── */
  function init() {
    injectStyles();
    buildFab(getLang());
    patchSetLang();

    const existing = loadConsent();
    if (existing) {
      // Already consented — show FAB only, apply saved prefs silently
      showFab();
      applyConsent(existing);
    } else {
      // First visit — show banner
      openBanner(false);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();