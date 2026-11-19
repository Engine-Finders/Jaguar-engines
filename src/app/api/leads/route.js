import { fetchSiteLeadsByDb, SITE_SOURCE } from "@/app/api/crm";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const db = searchParams.get("db") === "2" ? "2" : "1";
    const leads = await fetchSiteLeadsByDb({ limit: 200, db });
    return Response.json({
      success: true,
      db,
      source: SITE_SOURCE,
      count: leads.length,
      leads,
    });
  } catch (error) {
    console.error("leads fetch failed", error);
    return Response.json(
      { success: false, error: error.message || "Failed to fetch leads" },
      { status: 502 },
    );
  }
}
