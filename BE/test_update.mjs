import { updateMe } from './BE/src/services/user.service.js';
import { supabase } from './BE/src/db/supabaseClient.js';
async function run() {
  try {
    const {data} = await supabase.from('users').select('id').eq('email', 'test2@example.com').single();
    await updateMe(data.id, { targetBand: 7.5 });
    console.log('updated');
  } catch (err) {
    console.error(err);
  }
}
run();
