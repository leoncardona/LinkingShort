import type { APIContext, APIRoute } from "astro";
import { XataClient } from "../../../xata";

const client = new XataClient({
  apiKey: import.meta.env.XATA_API_KEY,
  branch: import.meta.env.XATA_BRANCH,
});

// Get the user's list of URLs
export const POST: APIRoute = async (context: APIContext) => {
  const { userId } = await context.request.json();

  if (!userId) {
    return new Response("User ID is required", {
      headers: { "content-type": "application/json" },
      status: 400,
    });
  }

  // Get current urls list of the user
  const user = await client.db.user.read(userId);
  const urls = user?.urls;

  if (!user) {
    return new Response("User not found", {
      headers: { "content-type": "application/json" },
      status: 404,
    });
  }

  return new Response(JSON.stringify(urls), {
    headers: { "content-type": "application/json" },
    status: 200,
  });
};

// Updates the user's list of URLs
export const PUT: APIRoute = async (context: APIContext) => {
  const { userId, urlId } = await context.request.json();

  if (!userId) {
    return new Response("User ID is required", {
      headers: { "content-type": "application/json" },
      status: 400,
    });
  }

  if (!urlId) {
    return new Response("URL ID is required", {
      headers: { "content-type": "application/json" },
      status: 400,
    });
  }

  // Get current urls list of the user
  const user = await client.db.user.read(userId);
  const urls = user?.urls;

  // Add the new url to the list
  const userToUpdate = await client.db.user.update(userId, {
    urls: urls ? [...urls, urlId] : [urlId],
  });

  if (!userToUpdate) {
    return new Response("User not found", {
      headers: { "content-type": "application/json" },
      status: 404,
    });
  }

  return new Response(JSON.stringify(userToUpdate), {
    headers: { "content-type": "application/json" },
    status: 200,
  });
};

// Deletes a URL from the user's list
export const DELETE: APIRoute = async (context: APIContext) => {
  const { userId, urlId } = await context.request.json();

  if (!userId) {
    return new Response("User ID is required", {
      headers: { "content-type": "application/json" },
      status: 400,
    });
  }

  if (!urlId) {
    return new Response("URL ID is required", {
      headers: { "content-type": "application/json" },
      status: 400,
    });
  }

  // Get current urls list of the user
  const user = await client.db.user.read(userId);
  const urls = user?.urls;

  // Remove the url from the list
  const userToUpdate = await client.db.user.update(userId, {
    urls: urls?.filter((id) => id !== urlId),
  });

  if (!userToUpdate) {
    return new Response("User not found", {
      headers: { "content-type": "application/json" },
      status: 404,
    });
  }

  return new Response(JSON.stringify(userToUpdate), {
    headers: { "content-type": "application/json" },
    status: 200,
  });
};
