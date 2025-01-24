import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config(); // Loading .env configuration

let redirects = []; // Array to store redirect information

export async function handler(event, context) {
  const NOTION_API_URL = "https://api.notion.com/v1/pages";

  const notionApiKey = event.headers["Authorization"]?.replace("Bearer ", "");

  if (!notionApiKey) {
    console.error("Notion API Key is missing in request headers.");
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Notion API Key is missing in request headers",
      }),
    };
  }

  console.log("Incoming request:", event.body);

  try {
    const body = JSON.parse(event.body);

    const redirectInfo = {
      path: event.path, // Dynamic path from the event
      status: "302 Found", // Changed to 302 for redirection
    };
    redirects.push(redirectInfo); // Storing the redirect info in the array

    const response = await fetch(NOTION_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${notionApiKey}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error from Notion API:", data);
      return {
        statusCode: response.status,
        body: JSON.stringify(data),
      };
    }

    console.log("Response from Notion API:", data);

    return {
      statusCode: response.status,
      body: JSON.stringify(data),
    };
  } catch (error) {
    // Logging error
    console.error("Error sending request:", error.message);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error: " + error.message }),
    };
  }
}

// Function to get the list of redirects
export function getRedirects() {
  return redirects;
}
