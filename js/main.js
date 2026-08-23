import { initTheme } from "./modules/theme.js";
import { initMenu } from "./modules/menu.js";
import { initFormValidation } from "./modules/form-validation.js";

initTheme();
initMenu();
initFormValidation();

const year = document.querySelector("[data-year]");
if (year) year.textContent = new Date().getFullYear();
