import { Resend } from "resend";

/** Ops inbox - notification only (never emailed to the customer). */
const TO_EMAIL = "ef2crm@gmail.com";
const FROM_EMAIL = process.env.RESEND_FROM || "BMW Engines <leads@bmwengines.uk>";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label, value) {
  const display = value === undefined || value === null || String(value).trim() === "" ? "-" : String(value);
  return `<tr>
    <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#64748b;font-size:13px;width:38%;">${escapeHtml(label)}</td>
    <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#0f172a;font-size:14px;font-weight:600;">${escapeHtml(display)}</td>
  </tr>`;
}

function buildCalculatorSection(calculator) {
  if (!calculator || typeof calculator !== "object") return "";

  return `
          <h2 style="margin:20px 0 10px;font-size:15px;color:#075fd8;text-transform:uppercase;letter-spacing:0.04em;">Diagnostic Calculator</h2>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:6px;">
            ${row("Category", calculator.category)}
            ${row("Diagnosis", calculator.diagnosis)}
            ${row("Severity", calculator.severity)}
            ${row("Evidence", calculator.evidence)}
            ${row("Engine codes", calculator.engineCodes)}
            ${row("Vehicle age", calculator.vehicleAge)}
            ${row("Car value", calculator.carValue)}
            ${row("Engine route", calculator.engineRoute)}
            ${row("Repair cost", calculator.repairCost)}
            ${row("Replacement cost", calculator.replacementCost)}
            ${row("Dealer estimate", calculator.dealerEstimate)}
            ${row("Replacement vs value", calculator.replacementVsValue)}
            ${row("Repair vs value", calculator.repairVsValue)}
            ${row("Verdict", calculator.verdict)}
          </table>`;
}

function buildLeadEmailHtml(payload = {}) {
  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:24px;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
      <tr>
        <td style="padding:20px 24px;background:#075fd8;color:#ffffff;">
          <h1 style="margin:0;font-size:20px;">New quote request</h1>
          <p style="margin:6px 0 0;font-size:13px;opacity:0.9;">Someone requested a quote on the BMW Engines site</p>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 24px;">
          <h2 style="margin:0 0 10px;font-size:15px;color:#075fd8;text-transform:uppercase;letter-spacing:0.04em;">Contact</h2>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:6px;margin-bottom:20px;">
            ${row("Name", payload.name)}
            ${row("Phone", payload.number)}
            ${row("Email", payload.email)}
            ${row("Postcode", payload.postcode)}
            ${row("Remarks", payload.description)}
          </table>

          <h2 style="margin:0 0 10px;font-size:15px;color:#075fd8;text-transform:uppercase;letter-spacing:0.04em;">Vehicle</h2>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:6px;">
            ${row("Registration (VRM)", payload.vehicle_vrm)}
            ${row("Brand", payload.vehicle_brand)}
            ${row("Series / Model", payload.vehicle_series)}
            ${row("Year", payload.vehicle_year)}
            ${row("Fuel type", payload.fuelType)}
            ${row("Engine capacity", payload.engin_capacity)}
          </table>
          ${buildCalculatorSection(payload.calculator)}
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/**
 * Notify ops that a customer requested a quote.
 * Always sends to the ops inbox (email on the form is optional).
 * Does NOT send any email to the customer - on-page success message covers that.
 */
export async function sendLeadEmail(payload) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const customerEmail = String(payload?.email || "").trim();
  const resend = new Resend(apiKey);
  const vrm = payload?.vehicle_vrm ? String(payload.vehicle_vrm).toUpperCase() : "unknown";
  const fromCalc = payload?.calculator ? " · calculator" : "";
  const subject = `New quote request: ${payload?.name || "Lead"} · ${vrm}${fromCalc}`;

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: [TO_EMAIL],
    ...(customerEmail ? { replyTo: customerEmail } : {}),
    subject,
    html: buildLeadEmailHtml(payload),
  });

  if (error) {
    console.error("lead email failed", error);
    throw new Error(error.message || "Failed to send lead email");
  }

  console.log("lead email sent to", TO_EMAIL, data?.id || "");
  return data;
}
