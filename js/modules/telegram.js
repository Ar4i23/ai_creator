// Отправка заявок в Telegram.
// Токен бота и chat_id теперь хранятся ТОЛЬКО на сервере (см. api/send-lead.js
// и переменные окружения на Vercel), браузер их не видит — важно для безопасности.

const ENDPOINT = "/api/send-lead";

export async function sendLead(data) {
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) return false;
    const json = await res.json().catch(() => null);
    return Boolean(json && json.ok);
  } catch (e) {
    return false;
  }
}
