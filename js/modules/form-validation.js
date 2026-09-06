import { sendLead } from "./telegram.js";

/* Только русские буквы и пробелы; первая буква каждого слова — заглавная */
const sanitizeName = (value) =>
  value
    .replace(/[^а-яёА-ЯЁ\s]/g, "") // латиница, цифры, _, - стираются на лету
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const validators = {
  name: (v) => {
    const t = v.trim();
    if (!t) return "Укажите имя";
    if (t.length < 2) return "Имя слишком короткое";
    if (t.length > 12) return "Слишком длинное имя";
    if (!/^[а-яё]+(?: [а-яё]+)*$/i.test(t))
      return "Имя — только русскими буквами";
    return "";
  },
  contact: (v) => {
    const t = v.trim();
    if (!t) return "Укажите @ник или номер телефона от Telegram";

    /* Похоже на телефон: только цифры, пробелы, + ( ) - */
    if (/^[\d\s()+-]+$/.test(t)) {
      const digits = t.replace(/\D/g, "");
      if (digits.length < 10 || digits.length > 15)
        return "Номер должен содержать 10–15 цифр, например +7 (999) 123-45-67";
      return "";
    }

    /* Похоже на ник: начинается с буквы, 5–32 символа (a-z, 0-9, _) */
    if (/^@?[a-z][a-z0-9_]{4,31}$/i.test(t)) return "";

    return "Это не похоже на Telegram: введите @ник (от 5 символов) или номер телефона";
  },
  product: (v) => (v ? "" : "Выберите, что продвигаем"),
  comment: (v) => (v.length > 500 ? "Не более 500 символов" : ""),
  consent: (v, el) => (el.checked ? "" : "Нужно согласие на обработку данных"),
};

export function initFormValidation() {
  const form = document.querySelector("[data-form]");
  if (!form) return;

  const submit = form.querySelector("[data-form-submit]");
  const success = form.querySelector("[data-form-success]");
  const errorBox = form.querySelector("[data-form-error]");
  const fields = [...form.querySelectorAll("[data-validate]")];

  const getMessage = (el) =>
    (validators[el.dataset.validate] || (() => ""))(el.value, el);

  const paint = (el, show) => {
    const message = getMessage(el);
    const invalid = Boolean(message);
    const group = el.closest(".form__group");
    const error = group ? group.querySelector(".form__error") : null;
    if (group) group.classList.toggle("form__group--invalid", invalid && show);
    if (error) {
      error.textContent = invalid && show ? message : "";
      error.hidden = !(invalid && show);
    }
    el.setAttribute("aria-invalid", String(invalid && show));
    return !invalid;
  };

  const refreshSubmit = () => {
    submit.disabled = fields.some((el) => getMessage(el) !== "");
  };

  fields.forEach((el) => {
    el.addEventListener("input", () => {
      if (el.dataset.validate === "name") {
        el.value = sanitizeName(el.value);
      }
      /* Если поле пустое — скрываем ошибку; если что-то введено — показываем */
      paint(el, el.value.trim() !== "");
      refreshSubmit();
    });

    el.addEventListener("blur", () => {
      /* На уходе с поля: ошибка только если что-то введено, но невалидно */
      paint(el, el.value.trim() !== "");
      refreshSubmit();
    });

    el.addEventListener("change", () => {
      paint(el, true);
      refreshSubmit();
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!fields.map((el) => paint(el, true)).every(Boolean)) {
      form
        .querySelector(
          ".form__group--invalid input, .form__group--invalid select, .form__group--invalid textarea",
        )
        ?.focus();
      return;
    }

    submit.disabled = true;
    if (errorBox) errorBox.hidden = true;

    const ok = await sendLead(Object.fromEntries(new FormData(form).entries()));

    if (!ok) {
      if (errorBox) {
        errorBox.hidden = false;
        errorBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
      submit.disabled = false;
      return;
    }

    success.hidden = false;
    form.reset();
    fields.forEach((el) => {
      const group = el.closest(".form__group");
      if (group) {
        group.classList.remove("form__group--invalid");
        const err = group.querySelector(".form__error");
        if (err) {
          err.hidden = true;
          err.textContent = "";
        }
      }
      el.setAttribute("aria-invalid", "false");
    });
    refreshSubmit();
    success.scrollIntoView({ behavior: "smooth", block: "nearest" });
    setTimeout(() => {
      success.hidden = true;
    }, 8000);
  });

  refreshSubmit();
}
