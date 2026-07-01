/*
  Handoo Studio · Content Loader
  Campos editables + imágenes locales.
  Demo: guarda/lee desde localStorage.
  Siguiente fase real: Supabase + Supabase Storage.
*/

(function () {
  const STORAGE_KEY = "handooStudioContent";

  const DEFAULT_CONTENT = {
    "home.hero.badge": "Webs rápidas, modernas y pensadas para vender",
    "home.hero.title": "Creamos webs que se ven bien, cargan rápido y venden mejor.",
    "home.hero.text": "Landing pages, webs corporativas, tiendas online, paneles autoeditables y automatizaciones IA para negocios que quieren captar más clientes sin complicarse.",
    "home.hero.subline": "Sin cuotas obligatorias. Con opción de panel editable para cambiar lo importante del día a día.",
    "home.hero.primary": "Solicitar presupuesto",
    "home.hero.secondary": "Ver ejemplos",

    "price.landing": "250€",
    "price.corporate": "690€",
    "price.shop": "1.290€",
    "price.restyling": "350€",
    "price.panel": "+99€",
    "price.panel.usual": "+190€",
    "price.catalog": "Desde +490€",
    "price.aiBasic": "Desde 190€",
    "price.aiAdvanced": "Desde 390€",
    "price.maintenance": "Desde 29€/mes",

    "promo.panel.active": true,
    "promo.panel.text": "el panel básico autoeditable está disponible por +99€ para las primeras webs contratadas.",

    "contact.email": "contacto@handoo.me",
    "contact.cta": "Cuéntanos qué necesitas y te orientamos con el formato más adecuado para tu negocio.",

    "image.home.hero": "",
    "image.services.main": "",
    "image.pricing.cover": "",
    "image.portfolio.cover": "",
    "image.contact.cover": ""
  };

  function readSavedContent() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.warn("No se pudo leer el contenido editable:", error);
      return {};
    }
  }

  function getContent() {
    return {
      ...DEFAULT_CONTENT,
      ...readSavedContent()
    };
  }

  function saveContent(nextContent) {
    const merged = {
      ...getContent(),
      ...nextContent
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    applyContent();
    return merged;
  }

  function resetContent() {
    localStorage.removeItem(STORAGE_KEY);
    applyContent();
  }

  function applyText(content) {
    document.querySelectorAll("[data-edit]").forEach((element) => {
      const key = element.getAttribute("data-edit");
      if (!key || content[key] === undefined) return;
      element.textContent = content[key];
    });
  }

  function applyVisibility(content) {
    document.querySelectorAll("[data-edit-visible]").forEach((element) => {
      const key = element.getAttribute("data-edit-visible");
      const isVisible = content[key] === true || content[key] === "true";
      element.hidden = !isVisible;
      element.style.display = isVisible ? "" : "none";
    });
  }

  function applyMailto(content) {
    document.querySelectorAll("[data-edit-mailto]").forEach((element) => {
      const key = element.getAttribute("data-edit-mailto");
      if (!key || content[key] === undefined) return;

      const subject = element.getAttribute("data-mail-subject");
      const href = subject
        ? "mailto:" + content[key] + "?subject=" + encodeURIComponent(subject)
        : "mailto:" + content[key];

      element.setAttribute("href", href);

      if (element.hasAttribute("data-mail-text-only")) {
        element.textContent = content[key];
      } else {
        element.textContent = "📧 " + content[key];
      }
    });
  }

  function applyImageSources(content) {
    document.querySelectorAll("[data-edit-src]").forEach((element) => {
      const key = element.getAttribute("data-edit-src");
      const value = content[key];

      if (!key || !value) return;

      element.setAttribute("src", value);
      element.setAttribute("data-edit-image-loaded", "true");
    });
  }

  function applyBackgroundImages(content) {
    document.querySelectorAll("[data-edit-bg]").forEach((element) => {
      const key = element.getAttribute("data-edit-bg");
      const value = content[key];

      if (!key || !value) return;

      element.style.backgroundImage =
        "linear-gradient(135deg, rgba(7,17,31,.72), rgba(15,23,42,.64)), url('" + value + "')";
      element.style.backgroundSize = "cover";
      element.style.backgroundPosition = "center";
      element.style.backgroundRepeat = "no-repeat";
      element.setAttribute("data-edit-image-loaded", "true");
    });
  }

  function applyContent() {
    const content = getContent();

    applyText(content);
    applyVisibility(content);
    applyMailto(content);
    applyImageSources(content);
    applyBackgroundImages(content);
  }

  window.HANDOO_DEFAULT_CONTENT = DEFAULT_CONTENT;

  window.HandooContent = {
    STORAGE_KEY,
    get: getContent,
    save: saveContent,
    reset: resetContent,
    apply: applyContent
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyContent);
  } else {
    applyContent();
  }
})();
