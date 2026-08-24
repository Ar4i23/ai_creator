// Отправка заявок в Telegram
const TG_BOT_TOKEN = "8922428042:AAHjryr0Iz-ekk8OP5kXf2cDi8miEpKNO-0"; // токен от @BotFather
const TG_CHAT_ID = "736373419"; // твой id, узнай у @userinfobot

// Перевод значений формы на русский
const PRODUCT_LABELS = {
  product: "Продукт или товар",
  service: "Услуга",
  personal: "Личный бренд",
  course: "Курс или обучение",
  other: "Другое",
};

const FORMAT_LABELS = {
  unknown: "Пока не знаю — подскажите",
  single: "Один ролик",
  serial: "Мини-сериал",
};

export async function sendLead(data) {
  if (!TG_BOT_TOKEN || !TG_CHAT_ID) return false; // демо-режим

  const text = [
    "🔥 Новая заявка с сайта your.story",
    `👤 Имя: ${data.name || "—"}`,
    `✈️ Telegram: ${data.contact || "—"}`,
    `📦 Продвигаем: ${PRODUCT_LABELS[data.product] || data.product || "—"}`,
    `🎬 Формат: ${FORMAT_LABELS[data.format] || "Пока не знаю — подскажите"}`,
    `💬 Комментарий: ${data.comment && data.comment.trim() ? data.comment.trim() : "Без комментария"}`,
  ].join("\n");

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: TG_CHAT_ID, text }),
      },
    );
    return res.ok;
  } catch (e) {
    return false;
  }
}
