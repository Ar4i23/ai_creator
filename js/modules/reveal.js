export function initReveal() {
  const groups = document.querySelectorAll("[data-reveal-group]");
  if (!groups.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  groups.forEach((group) => io.observe(group));
}
