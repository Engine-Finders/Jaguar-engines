import { fetchVehicleDetails, normalizeVehicleDetails } from "@/components/shared/fetchVehicleDetails";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const vrm = searchParams.get("vrm") || "";

  if (!vrm.trim()) {
    return Response.json({ error: "Registration number is required" }, { status: 400 });
  }

  try {
    const result = await fetchVehicleDetails(vrm);
    const vehicle = normalizeVehicleDetails(result, vrm);

    if (!vehicle.brand && !vehicle.year && !vehicle.series) {
      return Response.json({ error: "No vehicle details found for that registration", vehicle, raw: result }, { status: 404 });
    }

    return Response.json({ vehicle, raw: result });
  } catch (error) {
    console.error("vehicle-lookup failed", error);
    return Response.json({ error: error.message || "Failed to fetch vehicle details" }, { status: 502 });
  }
}
