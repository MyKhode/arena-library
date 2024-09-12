import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ cookies }) => {
  const accessToken = cookies.get("sb-access-token");
  const refreshToken = cookies.get("sb-refresh-token");

  console.log(`Access Token: ${accessToken}`);
  console.log(`Refresh Token: ${refreshToken}`);

  if (!accessToken || !refreshToken) {
    return new Response("No session available", { status: 401 });
  }

  return new Response(
    JSON.stringify({
      access_token: accessToken,
      refresh_token: refreshToken,
    }),
    { status: 200 }
  );
};
