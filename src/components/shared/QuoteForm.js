"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { buildQuoteLeadPayload } from "@/components/shared/sendLeadToCRM";

const emptyVehicle = {
  vrm: "",
  brand: "",
  series: "",
  year: "",
  fuelType: "",
  engineCapacity: "",
  colour: "",
  wheelplan: "",
};

const inputClass =
  "w-full rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm font-normal text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-soft)] focus:border-[var(--color-primary)] disabled:cursor-not-allowed disabled:bg-[var(--color-page-soft)] disabled:text-[var(--color-text-muted)]";

const labelClass = "mb-1 block text-xs font-bold uppercase tracking-wide text-[var(--color-text-muted)]";

function Alert({ type, children }) {
  if (!children) return null;
  const styles =
    type === "error"
      ? "border-[var(--color-accent-red)]/40 bg-[var(--color-accent-red-soft)] text-[var(--color-accent-red)]"
      : type === "success"
        ? "border-[var(--color-accent-green)]/40 bg-[var(--color-accent-green-soft)] text-[var(--color-accent-green)]"
        : "border-[var(--color-border)] bg-[var(--color-page-soft)] text-[var(--color-text-muted)]";

  return <div className={`rounded border px-3 py-2 text-sm ${styles}`}>{children}</div>;
}

export default function QuoteForm({ onSuccess, compact = false }) {
  const searchParams = useSearchParams();
  const [regInput, setRegInput] = useState("");
  const [vehicle, setVehicle] = useState(emptyVehicle);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupAlert, setLookupAlert] = useState({ type: "", message: "" });
  const [notice, setNotice] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [postcode, setPostcode] = useState("");
  const [remarks, setRemarks] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitAlert, setSubmitAlert] = useState({ type: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [calculator, setCalculator] = useState(null);

  // Prefill from /quote?reg=… (e.g. variant hero). Lookup still runs on Search.
  useEffect(() => {
    const fromUrl = searchParams?.get("reg") || searchParams?.get("vrm") || "";
    const cleaned = fromUrl.replace(/\s+/g, "").toUpperCase();
    if (cleaned) setRegInput(cleaned);
  }, [searchParams]);

  // Calculator results from HomeSec3 (only when arriving via /quote?from=calculator).
  useEffect(() => {
    if (searchParams?.get("from") !== "calculator") return;
    try {
      const raw = sessionStorage.getItem("bmw_quote_calculator");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") setCalculator(parsed);
    } catch {
      setCalculator(null);
    }
  }, [searchParams]);

  const vehicleReady = Boolean(vehicle.vrm && (vehicle.brand || vehicle.series || vehicle.year));
  const canSubmit = vehicleReady && !submitLoading;

  const engineDisplay = useMemo(() => {
    if (!vehicle.engineCapacity) return "";
    const raw = String(vehicle.engineCapacity);
    return /cc/i.test(raw) ? raw : `${raw} cc`;
  }, [vehicle.engineCapacity]);

  async function lookupVehicle(event) {
    event?.preventDefault?.();
    const reg = regInput.replace(/\s+/g, "").toUpperCase();
    if (!reg) {
      setLookupAlert({ type: "error", message: "Enter a registration number first." });
      return;
    }

    setLookupLoading(true);
    setLookupAlert({ type: "", message: "" });
    setNotice("");
    setSubmitted(false);

    try {
      const response = await fetch(`/api/vehicle-lookup?vrm=${encodeURIComponent(reg)}`);
      const data = await response.json();

      if (!response.ok) {
        setVehicle(emptyVehicle);
        setLookupAlert({ type: "error", message: data.error || "Could not find that vehicle." });
        return;
      }

      setVehicle(data.vehicle || emptyVehicle);
      setNotice("Vehicle details loaded from DVLA / vehicle data.");
      setLookupAlert({ type: "success", message: "Vehicle found. Confirm details and complete your contact info." });
    } catch (error) {
      setVehicle(emptyVehicle);
      setLookupAlert({ type: "error", message: error.message || "Lookup failed. Please try again." });
    } finally {
      setLookupLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitAlert({ type: "", message: "" });

    if (!vehicleReady) {
      setSubmitAlert({ type: "error", message: "Search a registration before submitting." });
      return;
    }

    if (!name.trim() || !phone.trim() || !email.trim() || !postcode.trim()) {
      setSubmitAlert({ type: "error", message: "Full name, phone, email and postcode are required." });
      return;
    }

    if (honeypot) {
      setSubmitted(true);
      return;
    }

    setSubmitLoading(true);

    try {
      const payload = buildQuoteLeadPayload({
        contact: { name, phone, email, postcode, remarks, honeypot },
        vehicle,
        calculator,
      });

      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send quote request");
      }

      try {
        sessionStorage.removeItem("bmw_quote_calculator");
      } catch {
        // ignore
      }

      setSubmitted(true);
      setSubmitAlert({ type: "success", message: "Quote request sent." });
      onSuccess?.(payload);
    } catch (error) {
      setSubmitAlert({ type: "error", message: error.message || "Something went wrong. Please try again." });
    } finally {
      setSubmitLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center shadow-[0_14px_40px_var(--color-shadow)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent-green)] text-white">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <path d="M6 14l6 6 10-10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="mt-4 text-xl font-bold text-[var(--color-text)]">Quote Request Sent!</h3>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          We&apos;ve received your details and will be contacting you soon.
        </p>
      </div>
    );
  }

  return (
    <form
      name="engine_quote_form"
      id="engine_quote_form"
      onSubmit={handleSubmit}
      className={`rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_14px_40px_var(--color-shadow)] ${compact ? "p-4" : "p-5 md:p-7"}`}
    >
      <div className="text-lg font-extrabold text-[var(--color-text)] md:text-xl">Confirm Details To Show Price</div>

      {calculator ? (
        <p className="mt-2 rounded border border-[var(--color-primary)]/25 bg-[var(--color-primary-soft)] px-3 py-2 text-xs text-[var(--color-text-muted)]">
          Diagnostic calculator results will be included with your quote request.
        </p>
      ) : null}

      <div className="mt-5 text-xs font-extrabold uppercase tracking-wide text-[var(--color-primary)]">Car Details</div>
      {notice ? <p className="mt-1 text-xs text-[var(--color-text-soft)]">{notice}</p> : null}

      <div className="mt-3 grid gap-3">
        <Alert type={lookupAlert.type}>{lookupAlert.message}</Alert>

        <div>
          <label className={labelClass} htmlFor="regInput">
            Registration Number <span className="text-[var(--color-accent-red)]">*</span>
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="regInput"
              type="text"
              value={regInput}
              maxLength={8}
              autoComplete="off"
              placeholder="E.g., AB12CDE"
              onChange={(event) => setRegInput(event.target.value.toUpperCase())}
              className={`${inputClass} font-semibold tracking-wide sm:flex-1`}
            />
            <button
              type="button"
              onClick={lookupVehicle}
              disabled={lookupLoading}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded bg-[var(--color-primary)] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
            >
              {lookupLoading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : null}
              <span>{lookupLoading ? "Searching…" : "Search Vehicle"}</span>
            </button>
          </div>
        </div>

        <div className={`grid gap-3 ${compact ? "grid-cols-2" : "sm:grid-cols-2"}`}>
          <div className="col-span-2">
            <label className={labelClass} htmlFor="fMake">
              Make <span className="text-[var(--color-accent-red)]">*</span>
            </label>
            <input id="fMake" value={vehicle.brand} disabled placeholder="e.g., BMW" className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="fYear">
              Year <span className="text-[var(--color-accent-red)]">*</span>
            </label>
            <input id="fYear" value={vehicle.year} disabled placeholder="e.g., 2016" className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="fSeries">
              Series / Model
            </label>
            <input id="fSeries" value={vehicle.series} disabled placeholder="e.g., 3 SERIES" className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="fFuel">
              Fuel Type
            </label>
            <input id="fFuel" value={vehicle.fuelType} disabled placeholder="e.g., DIESEL" className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="fEngine">
              Engine Capacity
            </label>
            <input id="fEngine" value={engineDisplay} disabled placeholder="e.g., 1995 cc" className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="fColour">
              Color
            </label>
            <input id="fColour" value={vehicle.colour} disabled placeholder="e.g., BLACK" className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="fWheel">
              Wheelplan
            </label>
            <input id="fWheel" value={vehicle.wheelplan} disabled placeholder="e.g., 2 AXLE RIGID BODY" className={inputClass} />
          </div>
        </div>
      </div>

      <div className="my-5 border-t border-[var(--color-border)]" />

      <div className="text-xs font-extrabold uppercase tracking-wide text-[var(--color-primary)]">Customer Details</div>

      <div className={`mt-3 grid gap-3 ${compact ? "grid-cols-2" : ""}`}>
        <div className={compact ? "" : undefined}>
          <label className={labelClass} htmlFor="name">
            Full Name <span className="text-[var(--color-accent-red)]">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="John Smith"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="email">
            Email Address <span className="text-[var(--color-accent-red)]">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="john@example.com"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="phone">
            Phone Number <span className="text-[var(--color-accent-red)]">*</span>
          </label>
          <input
            id="phone"
            name="number"
            type="tel"
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="07xxx xxx xxx"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="postcode">
            Postcode <span className="text-[var(--color-accent-red)]">*</span>
          </label>
          <input
            id="postcode"
            name="postcode"
            type="text"
            required
            value={postcode}
            onChange={(event) => setPostcode(event.target.value)}
            placeholder="Enter Postcode"
            className={inputClass}
          />
        </div>
        <div className={compact ? "col-span-2" : undefined}>
          <label className={labelClass} htmlFor="description">
            Any remarks
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={remarks}
            onChange={(event) => setRemarks(event.target.value)}
            placeholder="Enter any additional information..."
            className={`${inputClass} resize-y`}
          />
        </div>

        <div className="hidden" aria-hidden="true">
          <label htmlFor="honeypot">Keep this field blank</label>
          <input id="honeypot" name="honeypot" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} />
        </div>

        {/* Hidden vehicle fields — same names as the reference form / CRM API */}
        <input type="hidden" name="vehicle_vrm" value={vehicle.vrm} />
        <input type="hidden" name="vehicle_brand" value={vehicle.brand} />
        <input type="hidden" name="vehicle_series" value={vehicle.series} />
        <input type="hidden" name="vehicle_year" value={vehicle.year} />
        <input type="hidden" name="fuelType" value={vehicle.fuelType} />
        <input type="hidden" name="engin_capacity" value={vehicle.engineCapacity} />
      </div>

      <div className="mt-5 grid gap-3">
        <Alert type={submitAlert.type}>{submitAlert.message}</Alert>
        <button
          type="submit"
          id="btnSubmit"
          disabled={!canSubmit}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded bg-[var(--color-primary)] px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-45"
        >
          {submitLoading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : null}
          <span>{submitLoading ? "Sending…" : "Send Me Price Quote"}</span>
        </button>
        {!vehicleReady ? (
          <p className="text-center text-xs text-[var(--color-text-soft)]">Search a vehicle registration to enable submit.</p>
        ) : null}
      </div>
    </form>
  );
}
