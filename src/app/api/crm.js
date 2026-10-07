import { SITE_SOURCE } from "./site";

export { SITE_SOURCE };

const DEFAULT_SUPABASE_URL = "https://gfrnxvolaqbfalerfhsr.supabase.co";
const DEFAULT_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdmcm54dm9sYXFiZmFsZXJmaHNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNjEwNTQsImV4cCI6MjA5MzczNzA1NH0.s9mXoWlIAykCuGlbu9NDZGDRYadRXgpRc0U9PUVCth8";

function getCrmConfig() {
  const supabaseUrl = (process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL).trim();
  const webhookUrl = (
    process.env.SUPABASE_WEBHOOK_URL ||
    process.env.LEAD_API_URL ||
    `${supabaseUrl}/functions/v1/receive-lead`
  ).trim();
  const anonKey = (process.env.SUPABASE_ANON_KEY || DEFAULT_ANON_KEY).trim();

  return { supabaseUrl, webhookUrl, anonKey };
}

/**
 * POST a lead to the central Supabase receive-lead Edge Function.
 */
export async function sendLeadToCRM(payload) {
  const { webhookUrl, anonKey } = getCrmConfig();
  console.log("[crm] Sending lead to Supabase...", webhookUrl);

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${anonKey}`,
      apikey: anonKey,
    },
    body: JSON.stringify(payload),
  });

  let data = null;
  const text = await response.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    const message =
      data?.error?.message ||
      data?.error ||
      data?.message ||
      data?.raw ||
      `Lead send failed (${response.status})`;
    console.error("[crm] lead send failed", message);
    throw new Error(typeof message === "string" ? message : "Lead send failed");
  }

  if (data?.error) {
    console.error("[crm] lead send failed", data.error.message || data.error);
    throw new Error(data.error.message || "Lead send failed");
  }

  console.log("[crm] lead sent.");
  return data?.success ?? data;
}

/**
 * Fetch leads for this site only (source = jaguarengines.uk).
 */
export async function fetchSiteLeads({ limit = 100 } = {}) {
  const { supabaseUrl, anonKey } = getCrmConfig();
  const params = new URLSearchParams({
    source: `eq.${SITE_SOURCE}`,
    order: "createdAt.desc",
    limit: String(limit),
  });

  const url = `${supabaseUrl}/rest/v1/leads?${params.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${anonKey}`,
      apikey: anonKey,
    },
    cache: "no-store",
  });

  let data = null;
  const text = await response.text();
  try {
    data = text ? JSON.parse(text) : [];
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      data?.raw ||
      `Failed to fetch leads (${response.status})`;
    console.error("[crm] fetch leads failed", message);
    throw new Error(typeof message === "string" ? message : "Failed to fetch leads");
  }

  return Array.isArray(data) ? data : [];
}
