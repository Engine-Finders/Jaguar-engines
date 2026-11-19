import { SITE_SOURCE } from "./site";

export { SITE_SOURCE };

const DEFAULT_SUPABASE_URL = "https://invfhqaqjyvcttppnygs.supabase.co";
const DEFAULT_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImludmZocWFxanl2Y3R0cHBueWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4NTQ1NzAsImV4cCI6MjEwODQzMDU3MH0.GhZh0SG555phXYSdaP7bXPoxWN_QBhMusNJyQyDA-Rs";

const DEFAULT_SUPABASE_URL_2 = "https://ommfysqqlewadjqtbigk.supabase.co";
const DEFAULT_ANON_KEY_2 = "sb_publishable_iSReiPMDrICyL2GXD_sQ3g_ITSi3hLF";

/** Existing (DB1) CRM config — unchanged behaviour. */
function getCrmConfig() {
  const supabaseUrl = (process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL).trim();
  const webhookUrl = (
    process.env.SUPABASE_WEBHOOK_URL ||
    process.env.LEAD_API_URL ||
    `${supabaseUrl}/functions/v1/receive-lead`
  ).trim();
  const anonKey = (process.env.SUPABASE_ANON_KEY || DEFAULT_ANON_KEY).trim();

  return { supabaseUrl, webhookUrl, anonKey, label: "db1" };
}

/** New secondary (DB2) CRM config — duplicate of DB1 pattern. */
function getCrmConfig2() {
  const supabaseUrl = (process.env.SUPABASE_URL_2 || DEFAULT_SUPABASE_URL_2).trim();
  const webhookUrl = (
    process.env.SUPABASE_WEBHOOK_URL_2 ||
    process.env.LEAD_API_URL_2 ||
    `${supabaseUrl}/functions/v1/receive-lead`
  ).trim();
  const anonKey = (process.env.SUPABASE_ANON_KEY_2 || DEFAULT_ANON_KEY_2).trim();

  return { supabaseUrl, webhookUrl, anonKey, label: "db2" };
}

export function getCrmConfigByDb(db = "1") {
  return String(db) === "2" ? getCrmConfig2() : getCrmConfig();
}

async function postLeadToWebhook(payload, { webhookUrl, anonKey, label }) {
  console.log(`[crm:${label}] Sending lead to Supabase...`, webhookUrl);

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
    console.error(`[crm:${label}] lead send failed`, message);
    throw new Error(typeof message === "string" ? message : "Lead send failed");
  }

  if (data?.error) {
    console.error(`[crm:${label}] lead send failed`, data.error.message || data.error);
    throw new Error(data.error.message || "Lead send failed");
  }

  console.log(`[crm:${label}] lead sent.`);
  return data?.success ?? data;
}

/**
 * POST a lead to the existing (DB1) Supabase receive-lead Edge Function.
 */
export async function sendLeadToCRM(payload) {
  return postLeadToWebhook(payload, getCrmConfig());
}

/**
 * POST a lead to the secondary (DB2) Supabase receive-lead Edge Function.
 */
export async function sendLeadToCRM2(payload) {
  return postLeadToWebhook(payload, getCrmConfig2());
}

async function fetchLeadsFromConfig({ limit = 100 } = {}, config) {
  const { supabaseUrl, anonKey, label } = config;
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
    console.error(`[crm:${label}] fetch leads failed`, message);
    throw new Error(typeof message === "string" ? message : "Failed to fetch leads");
  }

  return Array.isArray(data) ? data : [];
}

/**
 * Fetch leads for this site only from DB1 (source = jaguarengines.uk).
 */
export async function fetchSiteLeads({ limit = 100 } = {}) {
  return fetchLeadsFromConfig({ limit }, getCrmConfig());
}

/**
 * Fetch leads for this site only from DB2.
 */
export async function fetchSiteLeads2({ limit = 100 } = {}) {
  return fetchLeadsFromConfig({ limit }, getCrmConfig2());
}

/**
 * Fetch leads from db "1" or "2".
 */
export async function fetchSiteLeadsByDb({ limit = 100, db = "1" } = {}) {
  return String(db) === "2"
    ? fetchSiteLeads2({ limit })
    : fetchSiteLeads({ limit });
}
