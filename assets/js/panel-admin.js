/*
  Handoo Studio · Panel Admin
  Fase base: editor local de campos seguros.
*/

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-panel-form]");
  const previewFrame = document.querySelector("[data-panel-preview]");
  const toast = document.querySelector("[data-panel-toast]");

  if (!form || !window.HandooContent) return;

  const fields = Array.from(form.querySelectorAll("[data-field]"));

  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("is-visible");

    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 2600);
  }

  function loadFields() {
    const content = window.HandooContent.get();

    fields.forEach((field) => {
      const key = field.getAttribute("data-field");
      const value = content[key];

      if (field.type === "checkbox") {
        field.checked = value === true || value === "true";
      } else {
        field.value = value ?? "";
      }
    });
  }

  function collectFields() {
    const nextContent = {};

    fields.forEach((field) => {
      const key = field.getAttribute("data-field");

      if (field.type === "checkbox") {
        nextContent[key] = field.checked;
      } else {
        nextContent[key] = field.value.trim();
      }
    });

    return nextContent;
  }

  function refreshPreview() {
    if (!previewFrame) return;

    try {
      previewFrame.contentWindow.location.reload();
    } catch (error) {
      previewFrame.setAttribute("src", previewFrame.getAttribute("src"));
    }
  }

  function saveAndRefresh(message) {
    window.HandooContent.save(collectFields());
    refreshPreview();
    showToast(message);
  }

  fields.forEach((field) => {
    field.addEventListener("input", () => {
      window.HandooContent.save(collectFields());
      refreshPreview();
    });

    field.addEventListener("change", () => {
      window.HandooContent.save(collectFields());
      refreshPreview();
    });
  });

  document.querySelectorAll("[data-panel-save]").forEach((button) => {
    button.addEventListener("click", () => {
      saveAndRefresh("Borrador guardado correctamente.");
    });
  });

  document.querySelectorAll("[data-panel-publish]").forEach((button) => {
    button.addEventListener("click", () => {
      saveAndRefresh("Cambios publicados en esta vista. Siguiente fase: guardado real en Supabase.");
    });
  });

  document.querySelectorAll("[data-panel-reset]").forEach((button) => {
    button.addEventListener("click", () => {
      window.HandooContent.reset();
      loadFields();
      refreshPreview();
      showToast("Contenido restaurado a los valores iniciales.");
    });
  });

  loadFields();
  refreshPreview();
});
