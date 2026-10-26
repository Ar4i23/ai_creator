import { initTheme } from "./modules/theme.js";
import { initMenu } from "./modules/menu.js";
import { initFormValidation } from "./modules/form-validation.js";
import { initReveal } from "./modules/reveal.js";
import { initCarousel } from "./modules/carousel.js";
import { initPackagesAccordion } from "./modules/packages-accordion.js";
import { initWorksGallery } from "./modules/works-gallery.js";
import { initStepsScrollReveal } from "./modules/steps-scroll-reveal.js";
import { initFaq } from "./modules/faq.js";

document.documentElement.classList.add("js"); /* reveal работает только с JS */

initTheme();
initMenu();
initFormValidation();
initReveal();
initCarousel();
initPackagesAccordion();
initWorksGallery();
initStepsScrollReveal();
initFaq();

const year = document.querySelector("[data-year]");
if (year) year.textContent = new Date().getFullYear();
