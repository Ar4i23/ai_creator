// Отправка заявок в Telegram. Вставь токен и chat_id — и форма начнёт присылать лиды.
const TG_BOT_TOKEN = ""; // токен от @BotFather
const TG_CHAT_ID = ""; // твой id, узнай у @userinfobot

export async function sendLead(data) {
  if (!TG_BOT_TOKEN || !TG_CHAT_ID) return false; // демо-режим

  const text = [
    "🔥 Новая заявка с сайта your.story",
    `👤 Имя: ${data.name || "—"}`,
    `📞 Контакт: ${data.contact || "—"}`,
    `📦 Продвигаем: ${data.product || "—"}`,
    `🎬 Формат: ${data.format || "подскажите"}`,
    `💬 Комментарий: ${data.comment || "—"}`,
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
