import { fetchSiteLeads, SITE_SOURCE } from "@/app/api/crm";

export async function GET() {
  try {
    const leads = await fetchSiteLeads({ limit: 200 });
    return Response.json({
      success: true,
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
