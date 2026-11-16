import { sendLeadToCRM, sendLeadToCRM2 } from "@/app/api/crm";
import { sendLeadEmail } from "@/app/api/email";
import { toCrmLeadPayload } from "@/app/api/leadPayload";

export async function POST(request) {
  try {
    const payload = await request.json();

    if (payload?.honeypot) {
      return Response.json({ success: true, skipped: true });
    }

    if (!payload?.name || !payload?.email || !payload?.number) {
      return Response.json(
        { error: "Name, email and phone are required" },
        { status: 400 },
      );
    }

    // CRM: contact + vehicle + source only. Email: full payload including calculator.
    const crmPayload = toCrmLeadPayload(payload);

    // Send to existing DB1 + new DB2 at the same time. DB1 remains the primary success gate.
    const [crmResult, crm2Result, emailResult] = await Promise.allSettled([
      sendLeadToCRM(crmPayload),
      sendLeadToCRM2(crmPayload),
      sendLeadEmail(payload),
    ]);

    if (crmResult.status === "rejected") {
      console.error("lead CRM failed", crmResult.reason);
      return Response.json(
        { error: crmResult.reason?.message || "Failed to send lead to CRM" },
        { status: 502 },
      );
    }

    if (crm2Result.status === "rejected") {
      console.error("lead CRM2 failed", crm2Result.reason);
    }

    if (emailResult.status === "rejected") {
      console.error("lead email failed", emailResult.reason);
      return Response.json({
        success: true,
        result: crmResult.value,
        crm2Sent: crm2Result.status === "fulfilled",
        crm2Error:
          crm2Result.status === "rejected"
            ? crm2Result.reason?.message || "Failed to send lead to CRM2"
            : null,
        emailSent: false,
        emailError: emailResult.reason?.message || "Failed to send email",
      });
    }

    return Response.json({
      success: true,
      result: crmResult.value,
      crm2Sent: crm2Result.status === "fulfilled",
      crm2Result: crm2Result.status === "fulfilled" ? crm2Result.value : null,
      crm2Error:
        crm2Result.status === "rejected"
          ? crm2Result.reason?.message || "Failed to send lead to CRM2"
          : null,
      emailSent: true,
      emailId: emailResult.value?.id || null,
    });
  } catch (error) {
    console.error("lead proxy failed", error);
    return Response.json(
      { error: error.message || "Failed to send lead to CRM" },
      { status: 502 },
    );
  }
}
