const LEAD_ENDPOINT =
  process.env.LEAD_API_URL ||
  "https://mvsvwdnnegfybfoihruc.supabase.co/functions/v1/receive-lead";

const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12c3Z3ZG5uZWdmeWJmb2locnVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MTQ5MjEsImV4cCI6MjEwMDQ5MDkyMX0.Hb0FBjFiuXl9tfVcIPfSyyzMy5_Rx9Gy9sOpQ4n4wpk";

/**
 * Send a lead to the Supabase receive-lead function.
 * Prefer calling this only from /api/lead (server) so the key is not hit from the browser.
 */
export async function sendLeadToCRM(payload) {
  console.log("Sending lead to Supabase...");

  const response = await fetch(LEAD_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      apikey: SUPABASE_ANON_KEY,
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
    console.error("lead sent failed", message);
    throw new Error(typeof message === "string" ? message : "Lead send failed");
  }

  if (data?.error) {
    console.error("lead sent failed", data.error.message || data.error);
    throw new Error(data.error.message || "Lead send failed");
  }

  console.log("lead sent to Supabase.");
  return data?.success ?? data;
}

/** Build lead payload from quote form state (keeps legacy field names incl. engin_capacity typo). */
export function buildQuoteLeadPayload({ contact, vehicle, calculator = null }) {
  const capacityRaw = vehicle?.engineCapacity ? String(vehicle.engineCapacity).replace(/[^\d.]/g, "") : "";
  const capacityNum = capacityRaw ? Number(capacityRaw) : NaN;
  const enginCapacity = Number.isFinite(capacityNum)
    ? String(Math.round(capacityNum >= 100 ? capacityNum / 1000 : capacityNum))
    : "";

  const payload = {
    name: contact.name || "",
    number: contact.phone || "",
    email: contact.email || "",
    postcode: contact.postcode || "",
    description: contact.remarks || "",
    vehicle_vrm: vehicle?.vrm || "",
    vehicle_brand: vehicle?.brand || "",
    vehicle_series: vehicle?.series || "",
    vehicle_year: vehicle?.year || "",
    fuelType: vehicle?.fuelType || "",
    engin_capacity: enginCapacity,
    honeypot: contact.honeypot || "",
  };

  // Attached for email only — stripped before CRM send.
  if (calculator && typeof calculator === "object") {
    payload.calculator = calculator;
  }

  return payload;
}

/** CRM-safe fields only (no calculator extras). */
export function toCrmLeadPayload(payload = {}) {
  return {
    name: payload.name || "",
    number: payload.number || "",
    email: payload.email || "",
    postcode: payload.postcode || "",
    description: payload.description || "",
    vehicle_vrm: payload.vehicle_vrm || "",
    vehicle_brand: payload.vehicle_brand || "",
    vehicle_series: payload.vehicle_series || "",
    vehicle_year: payload.vehicle_year || "",
    fuelType: payload.fuelType || "",
    engin_capacity: payload.engin_capacity || "",
    honeypot: payload.honeypot || "",
  };
}
