import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://trywdfggzrzbwndwrerg.supabase.co";
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyeXdkZmdnenJ6YnduZHdyZXJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTc3Njc3NCwiZXhwIjoyMDk1MzUyNzc0fQ.cYTf_WS8LRh1zMaPl7XWJ_g20qCgXh77nCq1g0gJTiE";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function main() {
  console.log("=== Fetching latest AI Job ===");
  const { data: jobs, error: jobErr } = await supabase
    .from("ai_jobs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1);

  if (jobErr) {
    console.error("Error fetching jobs:", jobErr.message);
    return;
  }

  console.log(JSON.stringify(jobs[0], null, 2));
}

main().catch(console.error);
