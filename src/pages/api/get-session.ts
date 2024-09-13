import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ cookies }) => {
  const accessToken = cookies.get("sb-access-token");
  const refreshToken = cookies.get("sb-refresh-token");

  if (!accessToken || !refreshToken) {
    return new Response("No session available", { status: 401 });
  }

  const deepLinkURL = `unitydl://login?access_token=${accessToken}&refresh_token=${refreshToken}`;

  return new Response(JSON.stringify({ deepLinkURL }), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
};
