import { SITE_SOURCE } from "./site";

/**
 * Build lead payload from quote form state.
 * Reusable for other forms later  keep this shape stable.
 */
export function buildQuoteLeadPayload({ contact, vehicle, calculator = null }) {
  const capacityRaw = vehicle?.engineCapacity
    ? String(vehicle.engineCapacity).replace(/[^\d.]/g, "")
    : "";
  const capacityNum = capacityRaw ? Number(capacityRaw) : NaN;
  const engineCapacity = Number.isFinite(capacityNum)
    ? String(Math.round(capacityNum >= 100 ? capacityNum / 1000 : capacityNum))
    : "";

  const payload = {
    name: contact.name || "",
    number: contact.phone || "",
    email: contact.email || "",
    postcode: contact.postcode || "",
    description: contact.remarks || "",
    vehicle_vrm: vehicle?.vrm || "",
    vehicle_reg: vehicle?.vrm || "",
    vehicle_brand: vehicle?.brand || "Jaguar",
    vehicle_model: vehicle?.series || vehicle?.model || "",
    vehicle_series: vehicle?.series || "",
    vehicle_year: vehicle?.year || "",
    fuel_type: vehicle?.fuelType || "",
    engine_capacity: engineCapacity,
    vehicle_part: "Engine",
    source: SITE_SOURCE,
    honeypot: contact.honeypot || "",
  };

  // Attached for email only  stripped before CRM send.
  if (calculator && typeof calculator === "object") {
    payload.calculator = calculator;
  }

  return payload;
}

/** CRM-safe fields only (no calculator extras). Matches Edge Function / leads table. */
export function toCrmLeadPayload(payload = {}) {
  const fuel = payload.fuel_type || payload.fuelType || "";
  const capacity = payload.engine_capacity || payload.engin_capacity || "";
  const vrm = payload.vehicle_vrm || payload.vehicle_reg || "";
  const series = payload.vehicle_series || "";
  const model = payload.vehicle_model || series || "";

  return {
    name: payload.name || "",
    number: payload.number || "",
    email: payload.email || "",
    postcode: payload.postcode || "",
    description: payload.description || "",
    vehicle_vrm: vrm,
    vehicle_reg: payload.vehicle_reg || vrm,
    vehicle_brand: payload.vehicle_brand || "Jaguar",
    vehicle_model: model,
    vehicle_series: series,
    vehicle_year: payload.vehicle_year || "",
    fuel_type: fuel,
    fuelType: fuel,
    engine_capacity: capacity,
    engin_capacity: capacity,
    vehicle_part: payload.vehicle_part || "Engine",
    source: payload.source || SITE_SOURCE,
  };
}
