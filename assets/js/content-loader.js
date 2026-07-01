/*
  Handoo Studio · Content Loader
  Catálogo comercial único + imágenes centralizadas.
  Demo: localStorage. Producción futura: Supabase + Storage.
*/
(function(){
  const STORAGE_KEY = "handooStudioContent";
  const DEFAULT_CONTENT = {
    "home.hero.badge":"Webs rápidas, modernas y pensadas para vender",
    "home.hero.title":"Creamos webs que se ven bien, cargan rápido y venden mejor.",
    "home.hero.text":"Landing pages, webs corporativas, tiendas online, paneles autoeditables y automatizaciones IA para negocios que quieren captar más clientes sin complicarse.",
    "home.hero.subline":"Sin cuotas obligatorias. Con opción de panel editable para cambiar lo importante del día a día.",
    "home.hero.primary":"Solicitar presupuesto",
    "home.hero.secondary":"Ver ejemplos",

    "service.landing.name":"Landing Page Express",
    "service.landing.short":"Una página profesional para captar clientes, lanzar una campaña o presentar un servicio concreto.",
    "service.landing.price":"250€",
    "service.landing.image":"",

    "service.corporate.name":"Web Corporativa",
    "service.corporate.short":"Web completa para presentar tu empresa, servicios, equipo, ubicación, contacto y propuesta de valor.",
    "service.corporate.price":"690€",
    "service.corporate.image":"",

    "service.shop.name":"Tienda Online / Catálogo",
    "service.shop.short":"Catálogo, productos, carrito, ofertas y estructura preparada para vender o recibir pedidos.",
    "service.shop.price":"1.290€",
    "service.shop.image":"",

    "service.restyling.name":"Restyling Web",
    "service.restyling.short":"Modernizamos webs antiguas para mejorar imagen, móvil, confianza y llamadas a la acción.",
    "service.restyling.price":"350€",
    "service.restyling.image":"",

    "service.panel.name":"Panel Autoeditable",
    "service.panel.short":"Panel seguro para cambiar textos, fotos, horarios, ofertas o datos básicos sin romper la web.",
    "service.panel.price":"+99€",
    "service.panel.usualPrice":"+190€",
    "service.panel.image":"",

    "service.catalog.name":"Catálogo editable",
    "service.catalog.short":"Para añadir productos o servicios, cambiar precios, subir fotos y activar promociones de forma segura.",
    "service.catalog.price":"Desde +490€",
    "service.catalog.image":"",

    "service.ai.name":"Automatización IA",
    "service.ai.short":"Respuestas automáticas, clasificación de leads, avisos y flujos para ahorrar tiempo.",
    "service.ai.price":"Desde 190€",
    "service.ai.advancedPrice":"Desde 390€",
    "service.ai.image":"",

    "service.maintenance.name":"Mantenimiento Web",
    "service.maintenance.short":"Soporte mensual, pequeños cambios, mejoras, actualización de contenido y revisión general.",
    "service.maintenance.price":"Desde 29€/mes",
    "service.maintenance.image":"",

    "promo.panel.active":true,
    "promo.panel.text":"el panel básico autoeditable está disponible por +99€ para las primeras webs contratadas.",

    "contact.email":"contacto@handoo.me",
    "contact.cta":"Cuéntanos qué necesitas y te orientamos con el formato más adecuado para tu negocio.",

    "page.home.cover":"",
    "page.services.cover":"",
    "page.pricing.cover":"",
    "page.portfolio.cover":"",
    "page.contact.cover":"",

    "portfolio.demo.restaurant.image":"",
    "portfolio.demo.clinic.image":"",
    "portfolio.demo.realestate.image":"",
    "portfolio.demo.shop.image":"",
    "portfolio.demo.legal.image":"",
    "portfolio.demo.editor.image":"",
    "portfolio.demo.ai.image":"",
    "portfolio.demo.restyling.image":""
  };

  const ALIASES = {
    "price.landing":"service.landing.price",
    "price.corporate":"service.corporate.price",
    "price.shop":"service.shop.price",
    "price.restyling":"service.restyling.price",
    "price.panel":"service.panel.price",
    "price.panel.usual":"service.panel.usualPrice",
    "price.catalog":"service.catalog.price",
    "price.aiBasic":"service.ai.price",
    "price.aiAdvanced":"service.ai.advancedPrice",
    "price.maintenance":"service.maintenance.price",
    "image.home.hero":"page.home.cover",
    "image.services.main":"page.services.cover",
    "image.pricing.cover":"page.pricing.cover",
    "image.portfolio.cover":"page.portfolio.cover",
    "image.contact.cover":"page.contact.cover"
  };

  function normalise(content){
    const next = {...content};
    Object.entries(ALIASES).forEach(([oldKey,newKey])=>{
      if ((next[newKey] === undefined || next[newKey] === "") && next[oldKey] !== undefined && next[oldKey] !== "") next[newKey]=next[oldKey];
      if (next[newKey] !== undefined) next[oldKey]=next[newKey];
    });
    return next;
  }

  function readSavedContent(){
    try{ const saved=localStorage.getItem(STORAGE_KEY); return saved?JSON.parse(saved):{}; }
    catch(e){ console.warn("No se pudo leer el contenido editable:", e); return {}; }
  }
  function getContent(){ return normalise({...DEFAULT_CONTENT, ...readSavedContent()}); }
  function saveContent(nextContent){ const merged=normalise({...getContent(),...nextContent}); localStorage.setItem(STORAGE_KEY, JSON.stringify(merged)); applyContent(); return merged; }
  function resetContent(){ localStorage.removeItem(STORAGE_KEY); applyContent(); }

  function applyText(content){
    document.querySelectorAll("[data-edit]").forEach(el=>{
      const key=el.getAttribute("data-edit"); if(!key || content[key]===undefined) return; el.textContent=content[key];
    });
  }
  function applyVisibility(content){
    document.querySelectorAll("[data-edit-visible]").forEach(el=>{
      const key=el.getAttribute("data-edit-visible"); const isVisible=content[key]===true || content[key]==="true"; el.hidden=!isVisible; el.style.display=isVisible?"":"none";
    });
  }
  function applyMailto(content){
    document.querySelectorAll("[data-edit-mailto]").forEach(el=>{
      const key=el.getAttribute("data-edit-mailto"); if(!key || content[key]===undefined) return;
      const subject=el.getAttribute("data-mail-subject"); const href=subject?"mailto:"+content[key]+"?subject="+encodeURIComponent(subject):"mailto:"+content[key];
      el.setAttribute("href", href); el.textContent=el.hasAttribute("data-mail-text-only")?content[key]:"📧 "+content[key];
    });
  }
  function remember(el, attr, value){ if(!el.hasAttribute(attr)) el.setAttribute(attr, value || ""); }
  function applyImageSources(content){
    document.querySelectorAll("[data-edit-src]").forEach(el=>{
      const key=el.getAttribute("data-edit-src"); if(!key) return; remember(el,"data-original-src",el.getAttribute("src")||""); const value=content[key];
      if(value){ el.setAttribute("src",value); el.setAttribute("data-edit-image-loaded","true"); }
      else{ const original=el.getAttribute("data-original-src")||""; if(original) el.setAttribute("src",original); else el.removeAttribute("src"); el.removeAttribute("data-edit-image-loaded"); }
    });
  }
  function applyBackgroundImages(content){
    document.querySelectorAll("[data-edit-bg]").forEach(el=>{
      const key=el.getAttribute("data-edit-bg"); if(!key) return; remember(el,"data-original-bg",el.style.backgroundImage||""); const value=content[key];
      if(value){ el.style.backgroundImage="linear-gradient(135deg, rgba(7,17,31,.72), rgba(15,23,42,.64)), url('"+value+"')"; el.style.backgroundSize="cover"; el.style.backgroundPosition="center"; el.style.backgroundRepeat="no-repeat"; el.setAttribute("data-edit-image-loaded","true"); }
      else{ el.style.backgroundImage=el.getAttribute("data-original-bg")||""; el.removeAttribute("data-edit-image-loaded"); }
    });
  }
  function applyCardImages(content){
    document.querySelectorAll("[data-edit-card-bg]").forEach(el=>{
      const key=el.getAttribute("data-edit-card-bg"); if(!key) return; remember(el,"data-original-card-bg",el.style.backgroundImage||""); const value=content[key];
      if(value){ el.style.backgroundImage="linear-gradient(135deg, rgba(255,255,255,.93), rgba(255,255,255,.86)), url('"+value+"')"; el.style.backgroundSize="cover"; el.style.backgroundPosition="center"; el.classList.add("has-edit-card-image"); }
      else{ el.style.backgroundImage=el.getAttribute("data-original-card-bg")||""; el.classList.remove("has-edit-card-image"); }
    });
  }
  function applyPreviewImages(content){
    document.querySelectorAll("[data-edit-preview]").forEach(el=>{
      const key=el.getAttribute("data-edit-preview"); if(!key) return; remember(el,"data-original-preview-bg",el.style.backgroundImage||""); const value=content[key]; const iframe=el.querySelector("iframe");
      if(value){ el.style.backgroundImage="url('"+value+"')"; el.style.backgroundSize="cover"; el.style.backgroundPosition="center"; el.classList.add("has-custom-preview"); if(iframe) iframe.style.opacity="0"; }
      else{ el.style.backgroundImage=el.getAttribute("data-original-preview-bg")||""; el.classList.remove("has-custom-preview"); if(iframe) iframe.style.opacity=""; }
    });
  }
  function applyContent(){ const c=getContent(); applyText(c); applyVisibility(c); applyMailto(c); applyImageSources(c); applyBackgroundImages(c); applyCardImages(c); applyPreviewImages(c); }
  window.HANDOO_DEFAULT_CONTENT=DEFAULT_CONTENT;
  window.HANDOO_CONTENT_ALIASES=ALIASES;
  window.HandooContent={STORAGE_KEY,get:getContent,save:saveContent,reset:resetContent,apply:applyContent};
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", applyContent); else applyContent();
})();
