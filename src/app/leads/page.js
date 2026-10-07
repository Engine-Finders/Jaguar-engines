"use client";

import { useEffect, useState } from "react";

function formatDate(value) {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(value);
  }
}

function cell(value) {
  if (value === undefined || value === null || String(value).trim() === "") return "-";
  return String(value);
}

function pick(lead, ...keys) {
  for (const key of keys) {
    if (lead?.[key] !== undefined && lead?.[key] !== null && String(lead[key]).trim() !== "") {
      return lead[key];
    }
  }
  return "";
}

const COLUMNS = [
  { key: "created", label: "Created", render: (lead) => formatDate(pick(lead, "createdAt", "created_at")) },
  { key: "name", label: "Name", render: (lead) => cell(pick(lead, "name")) },
  { key: "phone", label: "Phone", render: (lead) => cell(pick(lead, "number", "phone")) },
  { key: "email", label: "Email", render: (lead) => cell(pick(lead, "email")) },
  { key: "postcode", label: "Postcode", render: (lead) => cell(pick(lead, "postcode")) },
  { key: "remarks", label: "Remarks", render: (lead) => cell(pick(lead, "description", "notes")) },
  { key: "vrm", label: "VRM", render: (lead) => cell(pick(lead, "vehicle_vrm", "vehicleVrm", "vehicle_reg")).toUpperCase() },
  { key: "brand", label: "Brand", render: (lead) => cell(pick(lead, "vehicle_brand", "vehicleBrand")) },
  { key: "model", label: "Model", render: (lead) => cell(pick(lead, "vehicle_model", "vehicleModel")) },
  { key: "series", label: "Series", render: (lead) => cell(pick(lead, "vehicle_series", "vehicleSeries")) },
  { key: "year", label: "Year", render: (lead) => cell(pick(lead, "vehicle_year", "vehicleYear")) },
  { key: "fuel", label: "Fuel", render: (lead) => cell(pick(lead, "fuelType", "fuel_type")) },
  {
    key: "capacity",
    label: "Engine capacity",
    render: (lead) => cell(pick(lead, "engin_capacity", "engine_capacity", "engineCapacity")),
  },
  { key: "part", label: "Part", render: (lead) => cell(pick(lead, "vehicle_part", "vehiclePart") || "Engine") },
  { key: "source", label: "Source", render: (lead) => cell(pick(lead, "source")) },
  { key: "status", label: "Status", render: (lead) => cell(pick(lead, "status")) },
];

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [source, setSource] = useState("jaguarengines.uk");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadLeads() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/leads", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to load leads");
      }
      setLeads(data.leads || []);
      setSource(data.source || "jaguarengines.uk");
    } catch (err) {
      setError(err.message || "Failed to load leads");
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLeads();
  }, []);

  return (
    <main className="mx-auto w-full max-w-8xl px-4 py-8 text-[var(--color-text)] md:px-8 md:py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[28px] font-bold leading-tight md:text-[36px]">Leads</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Source filter: <span className="font-semibold text-[var(--color-text)]">{source}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={loadLeads}
          disabled={loading}
          className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-semibold disabled:opacity-60"
        >
          {loading ? "Loading…" : "Refresh"}
        </button>
      </div>

      {error ? (
        <p className="mt-4 rounded-md border border-[var(--color-accent-red)]/40 bg-[var(--color-accent-red-soft)] px-3 py-2 text-sm text-[var(--color-accent-red)]">
          {error}
        </p>
      ) : null}

      <p className="mt-4 text-sm text-[var(--color-text-muted)]">
        {loading ? "Fetching…" : `${leads.length} lead${leads.length === 1 ? "" : "s"}`}
      </p>

      <div className="mt-4 overflow-x-auto rounded-md border border-[var(--color-border)] bg-[var(--color-surface)]">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-page-soft)]">
              {COLUMNS.map((col) => (
                <th key={col.key} className="whitespace-nowrap px-3 py-2.5 font-semibold">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!loading && leads.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="px-3 py-6 text-center text-[var(--color-text-muted)]">
                  No leads found for this source.
                </td>
              </tr>
            ) : null}
            {leads.map((lead) => (
              <tr
                key={lead.id || `${lead.email}-${lead.createdAt || lead.created_at}`}
                className="border-b border-[var(--color-border)] align-top"
              >
                {COLUMNS.map((col) => (
                  <td
                    key={col.key}
                    className={`px-3 py-2.5 ${col.key === "remarks" ? "max-w-[220px] text-[var(--color-text-muted)]" : ""} ${
                      col.key === "vrm" ? "font-semibold uppercase" : ""
                    } ${col.key === "name" ? "font-medium" : ""} ${col.key === "created" ? "whitespace-nowrap" : ""}`}
                  >
                    {col.render(lead)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
