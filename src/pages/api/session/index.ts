import type { APIContext, APIRoute } from "astro";
import { XataClient } from "../../../xata";
import { Argon2id } from "oslo/password";
import jwt from 'jsonwebtoken';
import type { IJWTToken } from "../../../interfaces/IJWTToken";

const client = new XataClient({
  apiKey: import.meta.env.XATA_API_KEY,
  branch: import.meta.env.XATA_BRANCH,
});

// Secret key para firmar el token JWT
const JWT_SECRET = import.meta.env.JWT_SECRET;

// Get the token cookie, decode it and return the user data
export const GET: APIRoute = async (
  context: APIContext,
): Promise<Response> => {
    const token = context.cookies.get("token")?.value;
    
    if (!token) {
        return new Response("Not logged in", {
        headers: { "content-type": "application/json" },
        status: 401,
        });
    }
    
    // Decode the token
    let decodedToken: IJWTToken | null = null;
    try {
        decodedToken = jwt.decode(token) as IJWTToken;
    } catch (error) {
        return new Response("Invalid token", {
            headers: { "content-type": "application/json" },
            status: 401,
        });
    }
    
    // Return the user data
    return new Response(JSON.stringify(decodedToken), {
        headers: { "content-type": "application/json" },
        status: 200,
    });
};
