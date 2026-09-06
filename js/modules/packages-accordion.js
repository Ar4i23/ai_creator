/* =========================================================
   PACKAGES ACCORDION
========================================================= */

export function initPackagesAccordion() {
  const container = document.querySelector("[data-packages-accordion]");

  if (!container) return;

  const cards = [...container.querySelectorAll("[data-package]")];

  if (!cards.length) return;

  const closeCard = (card) => {
    const trigger = card.querySelector(".package-card__trigger");
    const content = card.querySelector(".package-card__content");

    card.classList.remove("is-open");

    if (trigger) {
      trigger.setAttribute("aria-expanded", "false");
    }

    if (content) {
      content.setAttribute("aria-hidden", "true");
    }
  };

  const openCard = (card) => {
    const trigger = card.querySelector(".package-card__trigger");
    const content = card.querySelector(".package-card__content");

    card.classList.add("is-open");

    if (trigger) {
      trigger.setAttribute("aria-expanded", "true");
    }

    if (content) {
      content.setAttribute("aria-hidden", "false");
    }
  };

  cards.forEach((card) => {
    const trigger = card.querySelector(".package-card__trigger");

    if (!trigger) return;

    trigger.addEventListener("click", () => {
      const isOpen = card.classList.contains("is-open");

      cards.forEach(closeCard);

      if (!isOpen) {
        openCard(card);
      }
    });
  });

  // Популярный пакет открыт по умолчанию.
  const featured = container.querySelector(
    ".package-card--featured",
  );

  if (featured) {
    openCard(featured);
  }

  // Escape закрывает открытый пакет.
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    cards.forEach(closeCard);
  });
}
