import { fetchVehicleDetails, normalizeVehicleDetails } from "@/components/shared/fetchVehicleDetails";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const vrm = searchParams.get("vrm") || searchParams.get("reg") || "";

  if (!vrm.trim()) {
    return Response.json({ error: "Registration number is required" }, { status: 400 });
  }

  try {
    const result = await fetchVehicleDetails(vrm);
    const vehicle = normalizeVehicleDetails(result, vrm);

    if (!vehicle.brand && !vehicle.year && !vehicle.series) {
      return Response.json(
        { error: "No vehicle details found for that registration", vehicle, raw: result },
        { status: 404 },
      );
    }

    return Response.json({ vehicle, raw: result });
  } catch (error) {
    console.error("GET vehicle-lookup failed", error);
    return Response.json({ error: error.message || "Failed to fetch vehicle details" }, { status: 502 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const reg = body?.reg || body?.vrm || "";

    if (!reg || typeof reg !== "string" || !reg.trim()) {
      return Response.json(
        { success: false, message: "Please provide a vehicle registration number." },
        { status: 400 },
      );
    }

    const result = await fetchVehicleDetails(reg);
    const vehicle = normalizeVehicleDetails(result, reg);

    if (!vehicle.brand && !vehicle.year && !vehicle.series) {
      return Response.json(
        { success: false, message: "Vehicle details not found for this registration." },
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      vehicle,
      data: {
        VRM: vehicle.vrm,
        Make: vehicle.brand,
        Model: vehicle.series,
        YearOfManufacture: vehicle.year,
        FuelType: vehicle.fuelType,
        EngineCapacity: vehicle.engineCapacity,
      },
      raw: result,
    });
  } catch (error) {
    console.error("POST vehicle-lookup error:", error);
    return Response.json(
      { success: false, message: error.message || "Error during vehicle lookup." },
      { status: 500 },
    );
  }
}
