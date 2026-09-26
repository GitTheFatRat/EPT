import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://kigoxvdlcyjxfpetuxiu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpZ294dmRsY3lqeGZwZXR1eGl1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDA2MDY3NiwiZXhwIjoyMTA1NjM2Njc2fQ.VsCOaz8blgEp7EjdKRxRkHSgZW4BNwZNhB5JrNRH4T4'
);

async function run() {
  const { data, error } = await supabase
    .from('questions')
    .select('id, type, content')
    .eq('id', '281d0bc9-a40d-4e4c-a926-abe582ffe8a9');
  
  if (error) console.error(error);
  else console.log(JSON.stringify(data, null, 2));
}

run();
