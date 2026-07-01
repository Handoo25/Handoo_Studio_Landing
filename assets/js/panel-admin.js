/*
  Handoo Studio · Panel Admin
  Pestañas por página + subida local de imágenes JPG/PNG/WebP.
*/

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-panel-form]");
  const previewFrame = document.querySelector("[data-panel-preview]");
  const toast = document.querySelector("[data-panel-toast]");

  if (!form || !window.HandooContent) return;

  const fields = Array.from(form.querySelectorAll("[data-field]"));
  const imageInputs = Array.from(form.querySelectorAll("[data-image-field]"));
  const maxImageSize = 2 * 1024 * 1024;

  let refreshTimer;

  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("is-visible");

    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 2800);
  }

  function schedulePreviewRefresh() {
    window.clearTimeout(refreshTimer);
    refreshTimer = window.setTimeout(refreshPreview, 220);
  }

  function refreshPreview() {
    if (!previewFrame) return;

    try {
      previewFrame.contentWindow.location.reload();
    } catch (error) {
      previewFrame.setAttribute("src", previewFrame.getAttribute("src"));
    }
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

    updateImagePreviews(content);
  }

  function collectFields() {
    const current = window.HandooContent.get();
    const nextContent = {...current};

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

  function updateImagePreviews(content = window.HandooContent.get()) {
    document.querySelectorAll("[data-image-preview]").forEach((preview) => {
      const key = preview.getAttribute("data-image-preview");
      const value = content[key];

      if (value) {
        preview.style.backgroundImage = "url('" + value + "')";
        preview.classList.add("has-image");
      } else {
        preview.style.backgroundImage = "";
        preview.classList.remove("has-image");
      }
    });
  }

  function saveAndRefresh(message) {
    window.HandooContent.save(collectFields());
    updateImagePreviews();
    schedulePreviewRefresh();
    showToast(message);
  }

  fields.forEach((field) => {
    field.addEventListener("input", () => {
      window.HandooContent.save(collectFields());
      schedulePreviewRefresh();
    });

    field.addEventListener("change", () => {
      window.HandooContent.save(collectFields());
      schedulePreviewRefresh();
    });
  });

  imageInputs.forEach((input) => {
    input.addEventListener("change", () => {
      const file = input.files && input.files[0];
      const key = input.getAttribute("data-image-field");

      if (!file || !key) return;

      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

      if (!validTypes.includes(file.type)) {
        input.value = "";
        showToast("Formato no permitido. Usa JPG, PNG o WebP.");
        return;
      }

      if (file.size > maxImageSize) {
        input.value = "";
        showToast("Imagen demasiado grande. Máximo recomendado: 2 MB.");
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        const content = window.HandooContent.get();
        content[key] = reader.result;

        window.HandooContent.save(content);
        updateImagePreviews(content);
        schedulePreviewRefresh();
        showToast("Imagen cargada en la vista previa.");
      };

      reader.onerror = () => {
        showToast("No se pudo leer la imagen.");
      };

      reader.readAsDataURL(file);
    });
  });

  document.querySelectorAll("[data-image-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.getAttribute("data-image-remove");
      const content = window.HandooContent.get();

      content[key] = "";
      window.HandooContent.save(content);
      updateImagePreviews(content);
      schedulePreviewRefresh();
      showToast("Imagen eliminada de la vista previa.");
    });
  });

  document.querySelectorAll("[data-panel-save]").forEach((button) => {
    button.addEventListener("click", () => {
      saveAndRefresh("Borrador guardado correctamente.");
    });
  });

  document.querySelectorAll("[data-panel-publish]").forEach((button) => {
    button.addEventListener("click", () => {
      saveAndRefresh("Cambios publicados en esta vista. Siguiente fase: Supabase.");
    });
  });

  document.querySelectorAll("[data-panel-reset]").forEach((button) => {
    button.addEventListener("click", () => {
      window.HandooContent.reset();
      loadFields();
      schedulePreviewRefresh();
      showToast("Contenido restaurado a los valores iniciales.");
    });
  });

  document.querySelectorAll("[data-panel-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      const tab = button.getAttribute("data-panel-tab");

      document.querySelectorAll("[data-panel-tab]").forEach((item) => {
        item.classList.toggle("is-active", item === button);
      });

      document.querySelectorAll("[data-panel-section]").forEach((section) => {
        section.classList.toggle("is-active", section.getAttribute("data-panel-section") === tab);
      });
    });
  });

  loadFields();
  schedulePreviewRefresh();
});
