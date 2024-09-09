// src/pages/api/update-cash.ts
import type { APIRoute } from "astro";
import { supabase } from "../../lib/supabase";

export const POST: APIRoute = async ({ request }) => {
  const { amount } = await request.json();

  if (amount === undefined) {
    return new Response(
      JSON.stringify({
        error: 'Amount is required.',
      }),
      { status: 400 },
    );
  }

  const { data: session, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) {
    return new Response(
      JSON.stringify({
        error: sessionError.message,
      }),
      { status: 500 },
    );
  }

  if (!session?.session?.user) {
    return new Response(
      JSON.stringify({
        error: 'No user is logged in.',
      }),
      { status: 401 },
    );
  }

  const userId = session.session.user.id;

  const { data, error } = await supabase
    .from("cash")
    .upsert({ id: userId, money: amount });

  if (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      { status: 500 },
    );
  }

  return new Response(JSON.stringify(data));
};
