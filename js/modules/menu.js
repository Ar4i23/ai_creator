export function initMenu() {
  const burger = document.querySelector(".burger");
  const menu = document.querySelector(".menu");
  if (!burger || !menu) return;

  const isOpen = () => menu.classList.contains("menu--open");
  const setOpen = (open) => {
    menu.classList.toggle("menu--open", open);
    burger.classList.toggle("burger--active", open);
    burger.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("is-menu-open", open);
  };

  burger.addEventListener("click", () => setOpen(!isOpen()));
  menu.addEventListener("click", (e) => {
    if (e.target.closest(".menu__link, .menu__cta")) setOpen(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) setOpen(false);
  });
  document.addEventListener("click", (e) => {
    if (isOpen() && !e.target.closest(".menu, .burger")) setOpen(false);
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 900 && isOpen()) setOpen(false);
  });
}
