require("dotenv").config(); // Подключение .env
const fetch = require("node-fetch");

exports.handler = async (event) => {
  const NOTION_API_URL = "https://api.notion.com/v1/pages";
  const NOTION_API_KEY = process.env.NOTION_API_KEY;

  try {
    const body = JSON.parse(event.body);

    // Логируем данные, которые пришли в запросе
    console.log("Полученные данные:", body);

    const response = await fetch(NOTION_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NOTION_API_KEY}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // Логируем ответ от Notion API
    console.log("Ответ от Notion API:", data);

    return {
      statusCode: response.status,
      body: JSON.stringify(data),
    };
  } catch (error) {
    // Логируем ошибку
    console.error("Ошибка при отправке запроса:", error.message);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Ошибка: " + error.message }),
    };
  }
};
