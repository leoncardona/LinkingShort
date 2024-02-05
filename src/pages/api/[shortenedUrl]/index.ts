import type { APIRoute } from "astro";
import { XataClient } from "../../../xata";

const client = new XataClient({ apiKey: import.meta.env.XATA_API_KEY, branch: import.meta.env.XATA_BRANCH })

export const GET: APIRoute = async ({ params }) => {
    const { shortenedUrl } = params;
    const url = await client.db.url.getFirst({ filter: { shorten: shortenedUrl ?? "" } });

    if (!url) {
        return new Response("Not found", { status: 404 });
    }
    
    return  Response.redirect(url?.full ?? "", 302);
}