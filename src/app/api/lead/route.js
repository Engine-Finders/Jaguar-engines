import { sendLeadToCRM, toCrmLeadPayload } from "@/components/shared/sendLeadToCRM";
import { sendLeadEmail } from "@/components/shared/sendLeadEmail";

export async function POST(request) {
  try {
    const payload = await request.json();

    if (payload?.honeypot) {
      return Response.json({ success: true, skipped: true });
    }

    if (!payload?.name || !payload?.email || !payload?.number) {
      return Response.json({ error: "Name, email and phone are required" }, { status: 400 });
    }

    // CRM: contact + vehicle only. Email: full payload including calculator.
    const crmPayload = toCrmLeadPayload(payload);

    const [crmResult, emailResult] = await Promise.allSettled([
      sendLeadToCRM(crmPayload),
      sendLeadEmail(payload),
    ]);

    if (crmResult.status === "rejected") {
      console.error("lead CRM failed", crmResult.reason);
      return Response.json(
        { error: crmResult.reason?.message || "Failed to send lead to CRM" },
        { status: 502 },
      );
    }

    if (emailResult.status === "rejected") {
      console.error("lead email failed", emailResult.reason);
      return Response.json({
        success: true,
        result: crmResult.value,
        emailSent: false,
        emailError: emailResult.reason?.message || "Failed to send email",
      });
    }

    return Response.json({
      success: true,
      result: crmResult.value,
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
