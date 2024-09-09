import { supabase } from '../../lib/supabase';

export async function get() {
  try {
    const { data, error } = await supabase
      .from('items.message')  // Specify the correct table in the schema
      .select('msg');  // Specify the column you want to retrieve

    if (error) {
      console.error('Error fetching data:', error.message);
      return { body: { error: error.message } };
    }

    return { body: { data } };
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return { body: { error: 'An unexpected error occurred' } };
  }
}
