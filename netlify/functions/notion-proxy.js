import fetch from "node-fetch";

let redirects = []; // Array for storing logs

export async function handler(event, context) {
  const NOTION_API_URL = "https://api.notion.com/v1/pages";
  const notionApiKey = event.headers["authorization"]?.replace("Bearer ", "");

  // Logging incoming request and headers
  console.log("Request received:");
  console.log("Path:", event.path);
  console.log("Method:", event.httpMethod);
  console.log("Headers:", event.headers);

  // Check for API key
  if (!notionApiKey) {
    console.log("API key is missing");
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Notion API Key is missing in request headers",
      }),
    };
  }

  // Log request information
  const logEntry = {
    path: event.path,
    method: event.httpMethod,
    timestamp: new Date().toISOString(),
    status: "Request received",
  };
  redirects.push(logEntry); // Add log entry
  console.log("Request log:", logEntry);

  try {
    const body = JSON.parse(event.body); // Parse request body
    console.log("Request body:", body);

    // Send request to Notion API
    console.log("Sending request to Notion API...");
    const response = await fetch(NOTION_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${notionApiKey}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify(body),
    });

    console.log("Response from Notion API received:", response.status);

    const data = await response.json();
    console.log("Response from Notion API:", data);

    if (!response.ok) {
      logEntry.status = `Error: ${response.status}`;
      console.log("Error in request:", data);
      return {
        statusCode: response.status,
        body: JSON.stringify(data),
      };
    }

    logEntry.status = `Success: ${response.status}`;
    console.log("Request successful:", data);
    return {
      statusCode: response.status,
      body: JSON.stringify(data),
    };
  } catch (error) {
    logEntry.status = `Error: ${error.message}`;
    console.log("Error during request execution:", error.message);
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
