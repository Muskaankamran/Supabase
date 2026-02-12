import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
let SUPABASE_URL = "https://xzwwaqbuyodnxkvewprv.supabase.co";
let SUPABASE_ANON_KEY = "sb_publishable_p2iGkUXSOQWUuNt5_J1-mw_SOYtmGFa";
var supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
