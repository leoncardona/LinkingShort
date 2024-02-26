import type { APIRoute } from "astro";
import { XataClient } from "../../../xata";

const client = new XataClient({
  apiKey: import.meta.env.XATA_API_KEY,
  branch: import.meta.env.XATA_BRANCH,
});

export const POST: APIRoute = async ({ request }) => {
  const ids = await request.json();
  const urls = (await client.db.url.getAll()).filter((url) => ids.includes(url.id));
  return new Response(JSON.stringify(urls), {
    headers: { "content-type": "application/json" },
    status: 200,
  });
};
