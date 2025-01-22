import { getRedirects } from "./notion-proxy.js";

export async function handler(event, context) {
  try {
    const redirects = getRedirects();
    return {
      statusCode: 200,
      body: JSON.stringify({ redirects }),
    };
  } catch (error) {
    console.error("Error retrieving redirects:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error: " + error.message }),
    };
  }
}
