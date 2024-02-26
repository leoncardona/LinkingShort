import type { APIRoute } from "astro";
import { XataClient } from "../../../../../xata";

const client = new XataClient({ apiKey: import.meta.env.XATA_API_KEY, branch: import.meta.env.XATA_BRANCH })

export const DELETE: APIRoute = async ({ params }) => {
    const { id } = params;
    const deletedUrl = await client.db.url.delete(id as string);
    return new Response(JSON.stringify(deletedUrl), {
        headers: { 'content-type': 'application/json' },
        status: 200
    })
}