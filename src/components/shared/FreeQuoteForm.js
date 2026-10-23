"use client";

import Image from "next/image";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import HomeIcon from "@/components/home/homeIcons";
import { useTheme } from "@/components/shared/themeProvider";
import { buildQuoteLeadPayload } from "@/app/api/leadPayload";

const CAR_IMAGE =
  "/cars/jaguar-xj-x351-xj-premium-luxury-saloon-2010-2015-new-polaris-white-x351-premium-45.webp";
const HEADER_BG = "/home-image/sec2-bg.webp";

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

function formatVrm(value = "") {
  const clean = String(value).replace(/\s+/g, "").toUpperCase();
  if (clean.length <= 4) return clean;
  return `${clean.slice(0, 4)} ${clean.slice(4)}`;
}

function formatEngine(value = "") {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (/[lL]/.test(raw) && !/cc/i.test(raw)) return raw.toUpperCase().includes("L") ? raw : `${raw}L`;
  const num = Number(raw.replace(/[^\d.]/g, ""));
  if (!Number.isFinite(num) || num <= 0) return raw;
  if (num >= 100) return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}L`;
  return `${num}L`;
}

function FieldIcon({ children }) {
  return (
    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-primary)] opacity-70">
      {children}
    </span>
  );
}

function UserSvg() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4.5 20.2a7.5 7.5 0 0 1 15 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function MailSvg() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="m4.5 7.5 7.5 6 7.5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneSvg() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8.2 4.8c.4-.4 1-.5 1.5-.3l2 1c.5.2.8.7.8 1.2v2.1c0 .4-.2.8-.6 1-.7.4-1.4 1-1.4 1.8 0 2.8 3.6 6.4 6.4 6.4.8 0 1.4-.7 1.8-1.4.2-.4.6-.6 1-.6h2.1c.5 0 1 .3 1.2.8l1 2c.2.5.1 1.1-.3 1.5-1.4 1.4-3.6 2.1-5.8 2.1C11.4 22 4 14.6 4 8.6c0-2.2.7-4.4 2.1-5.8Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function PinSvg() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function ChatSvg() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 17.5 3.8 20.8 7.4 19A8.5 8.5 0 1 0 5 17.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockSvg() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function ArrowSvg() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RegPlate({ value, onChange, readOnly = false }) {
  return (
    <div
      className={`flex min-h-[48px] flex-1 overflow-hidden rounded-md border-2 border-black bg-[#f5c518] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] ${
        readOnly ? "" : ""
      }`}
    >
      <span className="flex w-9 shrink-0 flex-col items-center justify-center bg-[#1d4ed8] text-[10px] font-bold leading-none text-white">
        <span className="mb-0.5 text-[11px]">🇬🇧</span>
        GB
      </span>
      {readOnly ? (
        <span className="flex flex-1 items-center justify-center px-3 text-[1.15rem] font-black tracking-[0.08em] text-black">
          {formatVrm(value) || "REG HERE"}
        </span>
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value.toUpperCase())}
          placeholder="REG HERE"
          className="w-full bg-transparent px-3 text-center text-[1.05rem] font-black tracking-[0.08em] text-black outline-none placeholder:text-black/45"
          aria-label="Vehicle registration"
          autoComplete="off"
        />
      )}
    </div>
  );
}

function QuoteModal({ open, onClose }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const titleId = useId();
  const closeRef = useRef(null);

  const [regInput, setRegInput] = useState("");
  const [vehicle, setVehicle] = useState(emptyVehicle);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [postcode, setPostcode] = useState("");
  const [remarks, setRemarks] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const vehicleReady = Boolean(vehicle.vrm && (vehicle.brand || vehicle.series || vehicle.year));

  const engineDisplay = useMemo(() => formatEngine(vehicle.engineCapacity), [vehicle.engineCapacity]);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) return;
    setRegInput("");
    setVehicle(emptyVehicle);
    setLookupError("");
    setName("");
    setPhone("");
    setEmail("");
    setPostcode("");
    setRemarks("");
    setHoneypot("");
    setSubmitError("");
    setSubmitted(false);
    setLookupLoading(false);
    setSubmitLoading(false);
  }, [open]);

  async function lookupVehicle(event) {
    event?.preventDefault?.();
    const reg = regInput.replace(/\s+/g, "").toUpperCase();
    if (!reg) {
      setLookupError("Enter a registration number first.");
      return;
    }

    setLookupLoading(true);
    setLookupError("");
    setSubmitted(false);

    try {
      const response = await fetch(`/api/vehicle-lookup?vrm=${encodeURIComponent(reg)}`);
      const data = await response.json();
      if (!response.ok) {
        setVehicle(emptyVehicle);
        setLookupError(data.error || "Could not find that vehicle.");
        return;
      }
      setVehicle(data.vehicle || emptyVehicle);
    } catch (error) {
      setVehicle(emptyVehicle);
      setLookupError(error.message || "Lookup failed. Please try again.");
    } finally {
      setLookupLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError("");

    if (!vehicleReady) {
      setSubmitError("Search a registration before submitting.");
      return;
    }
    if (!name.trim() || !phone.trim() || !email.trim() || !postcode.trim()) {
      setSubmitError("Full name, phone, email and postcode are required.");
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
      });

      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to send quote request");

      setSubmitted(true);
    } catch (error) {
      setSubmitError(error.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  }

  if (!open) return null;

  const inputClass =
    "w-full rounded-md border border-[var(--color-border)] bg-[var(--color-page-soft)] py-2.5 pl-10 pr-3 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-soft)] focus:border-[var(--color-primary)]";

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-3 sm:items-center sm:p-4" role="presentation">
      <button type="button" aria-label="Close quote form" className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-[61] max-h-[92vh] w-full max-w-[560px] overflow-y-auto overflow-x-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
      >
        {/* Header */}
        <div className="relative min-h-[148px] overflow-hidden">
          <Image src={HEADER_BG} alt="" fill className="object-cover object-center" sizes="560px" priority />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,12,12,0.88)_0%,rgba(11,12,12,0.72)_55%,rgba(11,12,12,0.45)_100%)]" />

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white"
            aria-label="Close"
          >
            ✕
          </button>

          <div className="relative z-[1] px-5 pb-5 pt-6 md:px-6">
            <h2 id={titleId} className="max-w-[90%] text-[1.55rem] font-bold leading-[1.15] text-white md:text-[1.85rem]">
              Get My Vehicle <span className="text-[var(--color-chrome-bright)]">Information</span>
            </h2>
            <p className="mt-2 max-w-[92%] text-[0.9rem] leading-[1.4] text-white/85">
              Enter your vehicle registration to find best replacement engine quote.
            </p>
          </div>
        </div>

        <div className="px-4 py-4 md:px-5 md:py-5">
          {submitted ? (
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-page-soft)] px-4 py-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent-green)] text-white">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                  <path d="M6 14l6 6 10-10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="mt-3 text-lg font-bold text-[var(--color-text)]">Quote request sent</p>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                A specialist will be in touch shortly.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="btn-cta mt-5 inline-flex min-h-11 items-center justify-center rounded-md px-5 text-sm font-bold"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {/* State 1: reg lookup */}
              {!vehicleReady ? (
                <form onSubmit={lookupVehicle} className="flex flex-col gap-2.5 sm:flex-row sm:items-stretch">
                  <RegPlate value={regInput} onChange={setRegInput} />
                  <button
                    type="submit"
                    disabled={lookupLoading}
                    className="btn-cta inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-md px-4 text-sm font-bold disabled:opacity-60"
                  >
                    {lookupLoading ? "Searching…" : "Get Instant Quote"}
                    {!lookupLoading ? <ArrowSvg /> : null}
                  </button>
                </form>
              ) : (
                /* State 2: vehicle summary */
                <div className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-page-soft)]">
                  <div className="grid gap-3 p-3 sm:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] sm:items-center sm:gap-4 sm:p-4">
                    <div className="relative mx-auto h-[120px] w-full max-w-[220px] sm:mx-0 sm:h-[140px]">
                      <Image src={CAR_IMAGE} alt="" fill className="object-contain object-center" sizes="220px" />
                    </div>

                    <div className="min-w-0">
                      <div className="mb-2 max-w-[180px]">
                        <RegPlate value={vehicle.vrm} readOnly />
                      </div>
                      <p className="text-[1.05rem] font-bold leading-tight text-[var(--color-text)]">
                        {vehicle.brand || "Jaguar"} {vehicle.series || ""}
                      </p>
                      {vehicle.series ? (
                        <p className="mt-0.5 text-sm text-[var(--color-text-muted)]">{vehicle.series}</p>
                      ) : null}

                      <ul className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[0.82rem] text-[var(--color-text)]">
                        <li className="flex items-center gap-1.5">
                          <HomeIcon name="calendar" isDark={isDark} className="h-4 w-4 object-contain" />
                          <span>
                            <span className="font-semibold">Year:</span> {vehicle.year || "-"}
                          </span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <HomeIcon name="fuel" isDark={isDark} className="h-4 w-4 object-contain" />
                          <span>
                            <span className="font-semibold">Fuel Type:</span> {vehicle.fuelType || "-"}
                          </span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <HomeIcon name="engine" isDark={isDark} className="h-4 w-4 object-contain" />
                          <span>
                            <span className="font-semibold">Engine:</span> {engineDisplay || "-"}
                          </span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span
                            className="inline-block h-3.5 w-3.5 rounded-full border border-[var(--color-border-strong)]"
                            style={{ background: /white|polaris/i.test(vehicle.colour || "") ? "#f5f5f5" : vehicle.colour || "#d1d5db" }}
                            aria-hidden="true"
                          />
                          <span>
                            <span className="font-semibold">Colour:</span> {vehicle.colour || "-"}
                          </span>
                        </li>
                      </ul>

                      <button
                        type="button"
                        onClick={() => {
                          setVehicle(emptyVehicle);
                          setLookupError("");
                        }}
                        className="mt-2 text-xs font-semibold text-[var(--color-text-muted)] underline underline-offset-2"
                      >
                        Change registration
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {lookupError ? (
                <p className="mt-2 rounded-md border border-[var(--color-accent-red)]/40 bg-[var(--color-accent-red-soft)] px-3 py-2 text-sm text-[var(--color-accent-red)]">
                  {lookupError}
                </p>
              ) : null}

              {/* Contact form */}
              <form onSubmit={handleSubmit} className="mt-5">
                <h3 className="text-[1.15rem] font-bold text-[var(--color-text)]">
                  Enter Your <span className="text-[var(--color-chrome-bright)]">Details</span>
                </h3>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="block text-xs font-semibold text-[var(--color-text-muted)]">
                    Name
                    <span className="relative mt-1 block">
                      <FieldIcon>
                        <UserSvg />
                      </FieldIcon>
                      <input
                        className={inputClass}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Smith"
                        autoComplete="name"
                        required
                      />
                    </span>
                  </label>

                  <label className="block text-xs font-semibold text-[var(--color-text-muted)]">
                    Email
                    <span className="relative mt-1 block">
                      <FieldIcon>
                        <MailSvg />
                      </FieldIcon>
                      <input
                        type="email"
                        className={inputClass}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        autoComplete="email"
                        required
                      />
                    </span>
                  </label>

                  <label className="block text-xs font-semibold text-[var(--color-text-muted)]">
                    Phone Number
                    <span className="relative mt-1 block">
                      <FieldIcon>
                        <PhoneSvg />
                      </FieldIcon>
                      <input
                        type="tel"
                        className={inputClass}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="07XXXXXXXXX"
                        autoComplete="tel"
                        required
                      />
                    </span>
                  </label>

                  <label className="block text-xs font-semibold text-[var(--color-text-muted)]">
                    Post Code
                    <span className="relative mt-1 block">
                      <FieldIcon>
                        <PinSvg />
                      </FieldIcon>
                      <input
                        className={inputClass}
                        value={postcode}
                        onChange={(e) => setPostcode(e.target.value)}
                        placeholder="W12 9AB"
                        autoComplete="postal-code"
                        required
                      />
                    </span>
                  </label>
                </div>

                <label className="mt-3 block text-xs font-semibold text-[var(--color-text-muted)]">
                  Any Remarks{" "}
                  <span className="font-normal">(Additional Information – Optional)</span>
                  <span className="relative mt-1 block">
                    <span className="pointer-events-none absolute left-3 top-3 text-[var(--color-primary)] opacity-70">
                      <ChatSvg />
                    </span>
                    <textarea
                      className={`${inputClass} min-h-[84px] resize-y pt-2.5`}
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Please enter any info you would like us to know."
                      rows={3}
                    />
                  </span>
                </label>

                {/* honeypot */}
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  className="absolute left-[-9999px] h-0 w-0 opacity-0"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  aria-hidden="true"
                />

                {submitError ? (
                  <p className="mt-3 rounded-md border border-[var(--color-accent-red)]/40 bg-[var(--color-accent-red-soft)] px-3 py-2 text-sm text-[var(--color-accent-red)]">
                    {submitError}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={submitLoading || !vehicleReady}
                  className="btn-cta mt-4 flex min-h-12 w-full items-center justify-center gap-2.5 rounded-md px-4 text-sm font-bold disabled:opacity-60"
                >
                  <HomeIcon name="engine" isDark className="h-5 w-5 object-contain" />
                  <span>{submitLoading ? "Sending…" : "Get Your Free Replacement Engine Quote"}</span>
                  {!submitLoading ? <ArrowSvg /> : null}
                </button>

                <p className="mt-3 flex items-start justify-center gap-1.5 text-center text-[11px] leading-[1.35] text-[var(--color-text-soft)]">
                  <span className="mt-0.5 shrink-0">
                    <LockSvg />
                  </span>
                  <span>
                    Your details are secure, no spam – genuine quote from UK vetted engine specialists only.
                  </span>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FreeQuoteSticky() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-cta fixed bottom-5 right-5 z-50 rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_28px_var(--color-shadow)] hover:bg-[var(--color-primary-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        Get a Free Quote
      </button>

      <QuoteModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
