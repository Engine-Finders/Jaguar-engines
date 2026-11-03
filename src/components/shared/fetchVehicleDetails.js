/**
 * UK vehicle lookup via checkcardetails.
 * Prefer calling through /api/vehicle-lookup from the browser so the key stays server-side.
 */
export async function fetchVehicleDetails(regNumber, options = {}) {
  const cleaned = String(regNumber || "")
    .replace(/\s+/g, "")
    .toUpperCase();

  if (!cleaned) {
    throw new Error("Registration number is required");
  }

  const apiKey =
    options.apiKey ||
    process.env.VEHICLE_API_KEY ||
    process.env.NEXT_PUBLIC_VEHICLE_API_KEY ||
    "157be19933d191db7628a7a7afa10bc9";

  const apiUrl = `https://api.checkcardetails.co.uk/vehicledata/ukvehicledata?apikey=${apiKey}&vrm=${encodeURIComponent(cleaned)}`;

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const result = await response.json();
  return result;
}

function pick(...values) {
  for (const value of values) {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return value;
    }
  }
  return "";
}

/** Map vendor payload into the fields our quote form / CRM use. */
export function normalizeVehicleDetails(result, fallbackVrm = "") {
  const root = result?.VehicleRegistration || result?.vehicle || result?.data || result || {};
  const technical = result?.TechnicalDetails || result?.technicalDetails || {};
  const engine = technical?.Engine || technical?.engine || root?.Engine || result?.Engine || {};
  const smmt = result?.SmmtDetails || result?.smmtDetails || {};

  const engineCapacity = pick(
    root.EngineCapacity,
    root.engineCapacity,
    engine.CapacityCc,
    engine.Capacity,
    engine.capacity,
    smmt.EngineCapacity,
  );

  // Prefer Model; fall back to SMMT Range / MakeModel so image matching still has a model string.
  const series = pick(
    root.Model,
    root.model,
    smmt.Range,
    smmt.ModelVariant,
    root.Series,
    root.series,
    root.Range,
    root.range,
    root.MakeModel,
    root.makeModel,
  );

  return {
    vrm: pick(root.RegistrationNumber, root.Vrm, root.vrm, root.VRM, fallbackVrm)
      .toString()
      .replace(/\s+/g, "")
      .toUpperCase(),
    brand: pick(root.Make, root.make, smmt.Marque, root.Manufacturer, root.manufacturer),
    series,
    year: pick(root.YearOfManufacture, root.yearOfManufacture, root.Year, root.year),
    fuelType: pick(root.FuelType, root.fuelType, smmt.FuelType, root.Fuel, root.fuel),
    engineCapacity: engineCapacity === "" ? "" : String(engineCapacity),
    colour: pick(root.Colour, root.Color, root.colour, root.color),
    wheelplan: pick(root.WheelPlan, root.Wheelplan, root.wheelPlan, root.wheelplan),
  };
}
