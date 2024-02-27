import type { APIContext, APIRoute } from "astro";
import { XataClient } from "../../../xata";
import { Argon2id } from "oslo/password";
import jwt from 'jsonwebtoken';

const client = new XataClient({
  apiKey: import.meta.env.XATA_API_KEY,
  branch: import.meta.env.XATA_BRANCH,
});

// Secret key para firmar el token JWT
const JWT_SECRET = import.meta.env.JWT_SECRET;

// Login a user
export const POST: APIRoute = async (
  context: APIContext,
): Promise<Response> => {
  const { email, password } = await context.request.json();

  // Get the user
  const user = await client.db.user.getFirst({ filter: { email } });
  if (!user) {
    return new Response("User not found", {
      headers: { "content-type": "application/json" },
      status: 404,
    });
  }

  // Verify the password
  const valid = await new Argon2id().verify(user.password ?? "", password);
  if (!valid) {
    return new Response("Invalid password", {
      headers: { "content-type": "application/json" },
      status: 400,
    });
  }

  // Create a JWT token
  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '12h' });

  // Return OK response
  return new Response(JSON.stringify({ token }), {
    headers: { "content-type": "application/json" },
    status: 200,
  });
};
