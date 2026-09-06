/* =========================================================
   FAQ — SEARCH + ACCORDION CONTROLS
   ========================================================= */

export function initFaq() {
  const root = document.querySelector(".faq");
  if (!root || root.dataset.faqReady === "true") return;

  root.dataset.faqReady = "true";

  const items = [...root.querySelectorAll("[data-faq-item]")];
  const search = root.querySelector("[data-faq-search]");
  const resultCount = root.querySelector("[data-faq-results]");
  const counter = root.querySelector("[data-faq-counter]");
  const progress = root.querySelector("[data-faq-progress]");
  const empty = root.querySelector("[data-faq-empty]");
  const openAll = root.querySelector("[data-faq-open]");
  const closeAll = root.querySelector("[data-faq-close]");

  if (!items.length) return;

  const updateStatus = () => {
    const visibleItems = items.filter((item) => !item.hidden);
    const openItems = visibleItems.filter((item) => item.open);

    if (resultCount) resultCount.textContent = String(visibleItems.length);

    if (counter) {
      const active = openItems.length ? openItems.length : 1;
      counter.textContent = String(active).padStart(2, "0");
    }

    if (progress) {
      const ratio = visibleItems.length
        ? Math.max(1, openItems.length) / visibleItems.length
        : 0;
      progress.style.width = `${ratio * 100}%`;
    }

    if (empty) empty.hidden = visibleItems.length !== 0;
  };

  const setItem = (item, open) => {
    item.open = open;
    item.setAttribute("aria-expanded", String(open));
  };

  items.forEach((item) => {
    const summary = item.querySelector("summary");
    if (!summary) return;

    summary.addEventListener("click", (event) => {
      // Keep native details behavior, but make the FAQ single-open.
      if (!item.open) {
        requestAnimationFrame(() => {
          items.forEach((other) => {
            if (other !== item) setItem(other, false);
          });
          updateStatus();
        });
      } else {
        requestAnimationFrame(updateStatus);
      }
    });

    item.addEventListener("toggle", updateStatus);
  });

  if (openAll) {
    openAll.addEventListener("click", () => {
      items.forEach((item) => {
        if (!item.hidden) setItem(item, true);
      });
      updateStatus();
    });
  }

  if (closeAll) {
    closeAll.addEventListener("click", () => {
      items.forEach((item) => setItem(item, false));
      updateStatus();
    });
  }

  if (search) {
    search.addEventListener("input", () => {
      const query = search.value.trim().toLowerCase();

      items.forEach((item) => {
        const text = item.textContent.toLowerCase();
        item.hidden = Boolean(query) && !text.includes(query);
        if (item.hidden) setItem(item, false);
      });

      updateStatus();
    });
  }

  // Start with the first question open so the section feels alive.
  setItem(items[0], true);
  updateStatus();
}
