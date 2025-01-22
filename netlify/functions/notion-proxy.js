import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config(); // Loading .env configuration

let redirects = []; // Array to store redirect information

export async function handler(event, context) {
  const NOTION_API_URL = "https://api.notion.com/v1/pages";
  const NOTION_API_KEY = process.env.NOTION_API_KEY;

  // Logging incoming requests
  console.log("Incoming request:", event.body);

  try {
    // Parsing the request body
    const body = JSON.parse(event.body);

    // Logging the redirect information
    const redirectInfo = {
      path: "/api/notion", // Static path for example
      status: "200 OK", // Redirect status
    };
    redirects.push(redirectInfo); // Storing the redirect info in the array

    // Sending a request to the Notion API
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

    // Handling response from the Notion API
    if (!response.ok) {
      console.error("Error from Notion API:", data);
      return {
        statusCode: response.status,
        body: JSON.stringify(data),
      };
    }

    // Logging successful response
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
