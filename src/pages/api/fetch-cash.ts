import type { APIRoute } from "astro";
import { supabase } from "../../lib/supabase";

export const GET: APIRoute = async () => {
  const { data: session, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) {
    return new Response(
      JSON.stringify({ error: sessionError.message }),
      { status: 500 },
    );
  }

  if (!session?.session?.user) {
    return new Response(
      JSON.stringify({ error: 'No user is logged in.' }),
      { status: 401 },
    );
  }

  const userId = session.session.user.id;
  console.log(userId);
  const { data, error } = await supabase
    .from("cash")
    .select("money")
    .eq("id", userId)
    .single();

  if (error && error.code === 'PGRST116') { // Error code for no data found
    // Initialize cash to 0 if no data found
    await supabase
      .from("cash")
      .insert({ id: userId, money: 0 });
    return new Response(JSON.stringify({ money: 0 }));
  }

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 },
    );
  }

  return new Response(JSON.stringify(data));
};
