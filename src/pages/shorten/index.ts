import type { APIRoute } from "astro";
import { XataClient, type Url } from "../../xata";
import crypto from 'crypto-js';

const client = new XataClient({ apiKey: import.meta.env.XATA_API_KEY, branch: import.meta.env.XATA_BRANCH })

export const POST: APIRoute = async ({ request }) => {
    const url = await request.text();
    const newUrl = {
        full: url,
        shorten: crypto.SHA256(url).toString().slice(0, 6)
    }
    try {
        await client.db.url.create(newUrl);
        return new Response(JSON.stringify(newUrl), {
            headers: { 'content-type': 'application/json' },
            status: 201
        })
    } catch (error: any) {
        return new Response(error, {
            status: 500
        })
    }
}