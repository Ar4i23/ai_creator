export function initWorksGallery() {
  const gallery = document.querySelector("[data-works-gallery]");
  const modal = document.querySelector("[data-works-modal]");

  if (!gallery || !modal) return;

  const modalImage = modal.querySelector("[data-works-modal-image]");
  const modalTitle = modal.querySelector("[data-works-modal-title]");
  const modalTag = modal.querySelector("[data-works-modal-tag]");
  const closeButtons = modal.querySelectorAll("[data-works-close]");

  let lastFocused = null;

  const openModal = (card) => {
    const src = card.dataset.work;
    if (!src) return;

    lastFocused = document.activeElement;

    modalImage.src = src;
    modalImage.alt = card.querySelector(".work-card__image")?.alt || "";
    modalTitle.textContent = card.dataset.title || "";
    modalTag.textContent = card.dataset.tag || "";

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("works-modal-open");

    requestAnimationFrame(() => closeButtons[1]?.focus());
  };

  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("works-modal-open");
    modalImage.src = "";

    if (lastFocused instanceof HTMLElement) {
      lastFocused.focus();
    }
  };

  gallery.querySelectorAll("[data-work]").forEach((card) => {
    card.addEventListener("click", () => openModal(card));
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
}
