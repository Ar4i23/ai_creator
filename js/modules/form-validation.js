import { sendLead } from "./telegram.js";

const validators = {
  name: (v) => {
    const t = v.trim();
    if (!t) return "Укажите имя";
    if (t.length < 2) return "Имя слишком короткое";
    if (!/^[a-zа-яё][a-zа-яё\s'-]+$/i.test(t))
      return "Имя может содержать только буквы";
    return "";
  },
  contact: (v) => {
    const t = v.trim();
    if (!t) return "Укажите телефон или @ник в Telegram";
    const digits = t.replace(/\D/g, "");
    if (digits.length > 0) {
      if (digits.length < 10)
        return "Введите номер полностью, например +7 (999) 123-45-67";
      return "";
    }
    if (!/^@?[a-z0-9_.]{3,32}$/i.test(t))
      return "Телефон или @ник в Telegram, например @username";
    return "";
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
    ["input", "blur", "change"].forEach((evt) =>
      el.addEventListener(evt, () => {
        paint(el, true);
        refreshSubmit();
      }),
    );
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
    await sendLead(Object.fromEntries(new FormData(form).entries()));

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
