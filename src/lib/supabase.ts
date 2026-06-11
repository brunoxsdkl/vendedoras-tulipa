import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://aozaqobhfzbiewogtptm.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvemFxb2JoZnpiaWV3b2d0cHRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMTUxNTIsImV4cCI6MjA5NjU5MTE1Mn0.ZkEfBQOr3U_qD8Abj4lgqayIb7uDWQOB_cZGR4HEW-Q";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
