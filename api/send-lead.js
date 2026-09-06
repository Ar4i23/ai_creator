// Vercel Serverless Function.
// Принимает данные формы с сайта и пересылает их в Telegram,
// используя токен бота, который хранится ТОЛЬКО на сервере
// (переменные окружения), а не в коде, доступном браузеру.
//
// Настройка на Vercel:
// 1. Project Settings → Environment Variables → добавить:
//      TG_BOT_TOKEN = токен от @BotFather
//      TG_CHAT_ID   = id чата/канала, куда слать заявки
// 2. Задеплоить проект — Vercel сам подхватит файл из папки /api
//    как serverless-функцию на пути /api/send-lead

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

// Простая защита от накрутки/спама с одного IP: не более 5 заявок в минуту
const rateLimitMap = new Map();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, start: now };
  if (now - entry.start > RATE_WINDOW_MS) {
    entry.count = 0;
    entry.start = now;
  }
  entry.count += 1;
  rateLimitMap.set(ip, entry);
  return entry.count > RATE_LIMIT;
}

function sanitize(value, maxLen) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // при желании замените на ваш домен
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "unknown";

  if (isRateLimited(ip)) {
    res.status(429).json({ ok: false, error: "Too many requests" });
    return;
  }

  const token = process.env.TG_BOT_TOKEN;
  const chatId = process.env.TG_CHAT_ID;

  if (!token || !chatId) {
    console.error("TG_BOT_TOKEN / TG_CHAT_ID не заданы в переменных окружения");
    res.status(500).json({ ok: false, error: "Server not configured" });
    return;
  }

  const data = req.body || {};
  const name = sanitize(data.name, 60);
  const contact = sanitize(data.contact, 60);
  const product = sanitize(data.product, 30);
  const format = sanitize(data.format, 30);
  const comment = sanitize(data.comment, 500);

  if (!name || !contact || !product) {
    res.status(400).json({ ok: false, error: "Missing required fields" });
    return;
  }

  const text = [
    "🔥 Новая заявка с сайта your.story",
    `👤 Имя: ${name}`,
    `✈️ Telegram: ${contact}`,
    `📦 Продвигаем: ${PRODUCT_LABELS[product] || product}`,
    `🎬 Формат: ${FORMAT_LABELS[format] || "Пока не знаю — подскажите"}`,
    `💬 Комментарий: ${comment || "Без комментария"}`,
  ].join("\n");

  try {
    const tgRes = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text }),
      },
    );
    const tgData = await tgRes.json();
    if (!tgRes.ok || !tgData.ok) {
      console.error("Telegram API error:", tgData);
      res.status(502).json({ ok: false, error: "Telegram delivery failed" });
      return;
    }
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("sendLead error:", err);
    res.status(500).json({ ok: false, error: "Internal error" });
  }
}
