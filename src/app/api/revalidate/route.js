import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { createHmac, timingSafeEqual } from "node:crypto";

function verifySignature(payload, signature, secret) {
  try {
    const expected = createHmac("sha256", secret).update(payload).digest("hex");
    const signatureBuffer = Buffer.from(signature, "hex");
    const expectedBuffer = Buffer.from(expected, "hex");
    if (signatureBuffer.length !== expectedBuffer.length) return false;
    return timingSafeEqual(signatureBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

export async function POST(req) {
  try {
    const signature = req.headers.get("x-cms-signature-256");
    const secret = process.env.CMS_REVALIDATION_SECRET || "be_sec_8m4w2p9k7x";

    const bodyText = await req.text();

    if (!signature || !verifySignature(bodyText, signature, secret)) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
    }

    const payload = JSON.parse(bodyText);
    const affectedRoutes = payload.affectedRoutes || [];
    const revalidatedRoutes = [];

    // Revalidate affected URL paths
    for (const route of affectedRoutes) {
      try {
        revalidatePath(route);
        revalidatePath(route, "page");
        revalidatedRoutes.push(route);
      } catch (err) {
        console.warn(`Failed to revalidate path: ${route}`, err);
      }
    }

    // Always revalidate /blog archive
    try {
      revalidatePath("/blog");
      revalidatePath("/blog", "page");
    } catch {}

    // Also revalidate cache tags
    try {
      revalidateTag("cms-posts");
      if (payload.slug) revalidateTag(`post-${payload.slug}`);
    } catch {}

    return NextResponse.json({
      success: true,
      revalidated: revalidatedRoutes,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
