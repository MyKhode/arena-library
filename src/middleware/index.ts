import { defineMiddleware } from "astro:middleware";
import { supabase } from "../lib/supabase";
import micromatch from "micromatch";

// Add "/" to the list of protected routes
const protectedRoutes = ["/", "/dashboard(|/)"];
const redirectRoutes = ["/signin(|/)", "/register(|/)"];
const proptectedAPIRoutes = ["/api/guestbook(|/)"];

export const onRequest = defineMiddleware(
  async ({ locals, url, cookies, redirect }, next) => {
    // Protect routes, including the root "/"
    if (micromatch.isMatch(url.pathname, protectedRoutes)) {
      const accessToken = cookies.get("sb-access-token");
      const refreshToken = cookies.get("sb-refresh-token");

      // Redirect to sign-in if no access or refresh tokens are found
      if (!accessToken || !refreshToken) {
        return redirect("/signin");
      }

      // Verify and refresh tokens
      const { data, error } = await supabase.auth.setSession({
        refresh_token: refreshToken.value,
        access_token: accessToken.value,
      });

      // Handle token validation errors
      if (error) {
        // Delete invalid tokens and redirect to sign-in
        cookies.delete("sb-access-token", { path: "/" });
        cookies.delete("sb-refresh-token", { path: "/" });
        return redirect("/signin");
      }

      // Set local variables and refresh tokens in cookies
      locals.email = data.user?.email!;
      cookies.set("sb-access-token", data?.session?.access_token!, {
        sameSite: "strict",
        path: "/",
        secure: true,
      });
      cookies.set("sb-refresh-token", data?.session?.refresh_token!, {
        sameSite: "strict",
        path: "/",
        secure: true,
      });
    }

    // Redirect to dashboard if already logged in and on sign-in or register pages
    if (micromatch.isMatch(url.pathname, redirectRoutes)) {
      const accessToken = cookies.get("sb-access-token");
      const refreshToken = cookies.get("sb-refresh-token");

      if (accessToken && refreshToken) {
        return redirect("/dashboard");
      }
    }

    // Protect specific API routes
    if (micromatch.isMatch(url.pathname, proptectedAPIRoutes)) {
      const accessToken = cookies.get("sb-access-token");
      const refreshToken = cookies.get("sb-refresh-token");

      // Check if tokens are missing
      if (!accessToken || !refreshToken) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          { status: 401 }
        );
      }

      // Verify the tokens
      const { error } = await supabase.auth.setSession({
        access_token: accessToken.value,
        refresh_token: refreshToken.value,
      });

      // Handle token verification errors
      if (error) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          { status: 401 }
        );
      }
    }

    // Proceed to the next middleware or route handler
    return next();
  },
);
