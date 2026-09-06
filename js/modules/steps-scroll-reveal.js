/* =========================================================
   STEPS — scroll reveal
   Каждый этап появляется отдельно, когда пользователь
   доходит до него при прокрутке страницы.
========================================================= */

export function initStepsScrollReveal() {
  const steps = document.querySelectorAll(".steps .step");

  if (!steps.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    steps.forEach((step) => step.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.22,
      rootMargin: "-5% 0px -8% 0px",
    },
  );

  steps.forEach((step) => observer.observe(step));
}
