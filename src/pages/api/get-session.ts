import type { APIRoute } from "astro";
import { supabase } from "../../lib/supabase";

export const GET: APIRoute = async ({ cookies }) => {
  const accessToken = cookies.get("sb-access-token");
  const refreshToken = cookies.get("sb-refresh-token");

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
