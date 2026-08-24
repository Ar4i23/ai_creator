import { initTheme } from "./modules/theme.js";
import { initMenu } from "./modules/menu.js";
import { initFormValidation } from "./modules/form-validation.js";
import { initReveal } from "./modules/reveal.js";
import { initCarousel } from "./modules/carousel.js";

document.documentElement.classList.add("js"); /* reveal работает только с JS */

initTheme();
initMenu();
initFormValidation();
initReveal();
initCarousel();

const year = document.querySelector("[data-year]");
if (year) year.textContent = new Date().getFullYear();
