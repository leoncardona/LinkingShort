import type { APIContext, APIRoute } from "astro";
import crypto from "crypto-js";
import { XataClient } from "../../../../xata";

const client = new XataClient({
  apiKey: import.meta.env.XATA_API_KEY,
  branch: import.meta.env.XATA_BRANCH,
});

export const POST: APIRoute = async (context: APIContext) => {
  const url = await context.request.text();
  console.log("URL: ", url);
  let shorten;
  let existingUrl;

  // Shorten the URL
  do {
    shorten = crypto
      .SHA256(url + Date.now().toString())
      .toString()
      .slice(0, 6);
    existingUrl = await client.db.url.getFirst({ filter: { shorten } });
  } while (existingUrl);

  try {

    // Create the cookie for guest if it doesn't exist and the user is not logged in
    if (!context.cookies.get("guestLinks") && !context.cookies.get("token")) {
      console.log("Creating cookie for guest");
      context.cookies.set("guestLinks", "", { path: "/" });
    }

    // Create the URL
    const newUrl = await client.db.url.create({ full: url, shorten });
    return new Response(JSON.stringify(newUrl), {
      headers: { "content-type": "application/json" },
      status: 201,
    });
  } catch (error: any) {
    console.error("Error creating URL: ", error);
    return new Response(error, {
      status: 500,
    });
  }
};
