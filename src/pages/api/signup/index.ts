import type { APIContext, APIRoute } from "astro";
import { XataClient } from "../../../xata";
import { Argon2id } from "oslo/password";

const client = new XataClient({
  apiKey: import.meta.env.XATA_API_KEY,
  branch: import.meta.env.XATA_BRANCH,
});

// Register a new user
export const POST: APIRoute = async (
  context: APIContext,
): Promise<Response> => {
  const { username, email, password } = await context.request.json();

  // Check if the user already exists
  const user = await client.db.user.getFirst({ filter: { email } });
  if (user) {
    return new Response("User already exists", {
      headers: { "content-type": "application/json" },
      status: 400,
    });
  }

  // Hash the password
  const hashedPassword = await new Argon2id().hash(password);

  // Create the user
  await client.db.user.create({
    username: username,
    email: email,
    password: hashedPassword,
  });

  // Return the response
  return new Response("Response", {
    headers: { "content-type": "application/json" },
    status: 200,
  });
};
