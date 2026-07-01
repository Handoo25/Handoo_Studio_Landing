/*
  Handoo Studio · Panel Admin
  Catálogo comercial único + imágenes centralizadas.
*/
document.addEventListener("DOMContentLoaded",()=>{
  const form=document.querySelector("[data-panel-form]");
  const previewFrame=document.querySelector("[data-panel-preview]");
  const toast=document.querySelector("[data-panel-toast]");
  if(!form || !window.HandooContent) return;
  const fields=Array.from(form.querySelectorAll("[data-field]"));
  const imageInputs=Array.from(form.querySelectorAll("[data-image-field]"));
  const maxImageSize=2*1024*1024;
  const previewPages={inicio:"../index.html", catalogo:"../servicios.html", portfolio:"../portfolio.html", promos:"../precios.html", contacto:"../contacto.html"};
  let applyTimer;
  function showToast(msg){ if(!toast) return; toast.textContent=msg; toast.classList.add("is-visible"); clearTimeout(showToast.timer); showToast.timer=setTimeout(()=>toast.classList.remove("is-visible"),2800); }
  function win(){ try{return previewFrame?previewFrame.contentWindow:null;}catch(e){return null;} }
  function getScroll(){ const w=win(); return w?{x:w.scrollX||0,y:w.scrollY||0}:{x:0,y:0}; }
  function restoreScroll(pos){ const w=win(); if(!w||!pos) return; try{ w.scrollTo(pos.x,pos.y); w.requestAnimationFrame(()=>w.scrollTo(pos.x,pos.y)); setTimeout(()=>w.scrollTo(pos.x,pos.y),80); }catch(e){} }
  function applyPreviewWithoutReload(){ const w=win(); if(!w) return; const pos=getScroll(); try{ if(w.HandooContent && typeof w.HandooContent.apply==="function") w.HandooContent.apply(); }catch(e){} restoreScroll(pos); }
  function scheduleApply(){ clearTimeout(applyTimer); applyTimer=setTimeout(applyPreviewWithoutReload,120); }
  function setPreviewPage(tab){ if(!previewFrame) return; const next=previewPages[tab]||"../index.html"; const current=previewFrame.getAttribute("src")||""; const currentUrl=new URL(current,location.href).href; const nextUrl=new URL(next,location.href).href; if(currentUrl===nextUrl){ applyPreviewWithoutReload(); return; } previewFrame.setAttribute("src",next); }
  if(previewFrame) previewFrame.addEventListener("load",()=>setTimeout(applyPreviewWithoutReload,80));
  function loadFields(){ const c=window.HandooContent.get(); fields.forEach(f=>{ const k=f.getAttribute("data-field"); const v=c[k]; if(f.type==="checkbox") f.checked=(v===true || v==="true"); else f.value=v??""; }); updateImagePreviews(c); }
  function collectFields(){ const c={...window.HandooContent.get()}; fields.forEach(f=>{ const k=f.getAttribute("data-field"); c[k]=(f.type==="checkbox")?f.checked:f.value.trim(); }); return c; }
  function updateImagePreviews(c=window.HandooContent.get()){ document.querySelectorAll("[data-image-preview]").forEach(p=>{ const k=p.getAttribute("data-image-preview"); const v=c[k]; if(v){p.style.backgroundImage="url('"+v+"')"; p.classList.add("has-image");} else {p.style.backgroundImage=""; p.classList.remove("has-image");} }); }
  function saveAndApply(msg){ window.HandooContent.save(collectFields()); updateImagePreviews(); scheduleApply(); showToast(msg); }
  fields.forEach(f=>{ f.addEventListener("input",()=>{window.HandooContent.save(collectFields()); scheduleApply();}); f.addEventListener("change",()=>{window.HandooContent.save(collectFields()); scheduleApply();}); });
  imageInputs.forEach(input=>input.addEventListener("change",()=>{ const file=input.files&&input.files[0]; const key=input.getAttribute("data-image-field"); if(!file||!key) return; const valid=["image/jpeg","image/jpg","image/png","image/webp"]; if(!valid.includes(file.type)){input.value=""; showToast("Formato no permitido. Usa JPG, PNG o WebP."); return;} if(file.size>maxImageSize){input.value=""; showToast("Imagen demasiado grande. Máximo recomendado: 2 MB."); return;} const reader=new FileReader(); reader.onload=()=>{ const c=window.HandooContent.get(); c[key]=reader.result; window.HandooContent.save(c); updateImagePreviews(c); scheduleApply(); showToast("Imagen cargada en la vista previa."); }; reader.onerror=()=>showToast("No se pudo leer la imagen."); reader.readAsDataURL(file); }));
  document.querySelectorAll("[data-image-remove]").forEach(btn=>btn.addEventListener("click",()=>{ const key=btn.getAttribute("data-image-remove"); const c=window.HandooContent.get(); c[key]=""; window.HandooContent.save(c); updateImagePreviews(c); scheduleApply(); showToast("Imagen eliminada de la vista previa."); }));
  document.querySelectorAll("[data-panel-save]").forEach(btn=>btn.addEventListener("click",()=>saveAndApply("Borrador guardado correctamente.")));
  document.querySelectorAll("[data-panel-publish]").forEach(btn=>btn.addEventListener("click",()=>saveAndApply("Cambios publicados en esta vista. Siguiente fase: Supabase.")));
  document.querySelectorAll("[data-panel-reset]").forEach(btn=>btn.addEventListener("click",()=>{window.HandooContent.reset(); loadFields(); scheduleApply(); showToast("Contenido restaurado a los valores iniciales.");}));
  document.querySelectorAll("[data-panel-tab]").forEach(btn=>btn.addEventListener("click",()=>{ const tab=btn.getAttribute("data-panel-tab"); document.querySelectorAll("[data-panel-tab]").forEach(i=>i.classList.toggle("is-active",i===btn)); document.querySelectorAll("[data-panel-section]").forEach(s=>s.classList.toggle("is-active",s.getAttribute("data-panel-section")===tab)); setPreviewPage(tab); }));
  loadFields(); const active=document.querySelector("[data-panel-tab].is-active"); setPreviewPage(active?active.getAttribute("data-panel-tab"):"inicio");
});
