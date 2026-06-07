import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ykqhskvnruyqrmjgjhqb.supabase.co';
const supabaseAnonKey = 'sb_publishable_rjcvOUZ3GPZlvCMy-bEPwQ_8mnzMvBm';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);