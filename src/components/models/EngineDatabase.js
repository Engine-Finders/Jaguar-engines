"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import HomeIcon from "@/components/home/homeIcons";
import { sectionDescription, sectionH2, tableHeaderClass } from "@/components/models/sectionTypography";

const HEADER_IMAGE = "/home-image/sec2-bg.webp";

const defaultFilters = {
  query: "",
  fuel: "",
  displacement: "",
  generation: "",
  sort: "enquiries",
};

function cleanText(text = "") {
  return String(text ?? "")
    .replaceAll("ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â£", "\u00a3")
    .replaceAll("Ãƒâ€šÃ‚Â£", "\u00a3")
    .replaceAll("Ã‚Â£", "\u00a3")
    .replaceAll("Â£", "\u00a3")
    .replaceAll("ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ", "\u2013")
    .replaceAll("ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“", "\u2013")
    .replaceAll("Ã¢â‚¬â€œ", "\u2013")
    .replaceAll("â€“", "\u2013")
    .replaceAll("ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â", "\u2014")
    .replaceAll("ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â", "\u2014")
    .replaceAll("Ã¢â‚¬â€", "\u2014")
    .replaceAll("â€”", "\u2014")
    .replaceAll("ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¢", "\u2022")
    .replaceAll("ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢", "\u2022")
    .replaceAll("Ã¢â‚¬Â¢", "\u2022")
    .replaceAll("â€¢", "\u2022")
    .replaceAll("ÃƒÆ’Ã‚Â¢Ãƒâ€¹Ã…â€œÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦", "\u2605")
    .replaceAll("ÃƒÂ¢Ã‹Å“Ã¢â‚¬Â¦", "\u2605")
    .replaceAll("Ã¢Ëœâ€¦", "\u2605")
    .replaceAll("â˜…", "\u2605")
    .replaceAll("ÃƒÆ’Ã‚Â¢Ãƒâ€¹Ã…â€œÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ", "\u2606")
    .replaceAll("ÃƒÂ¢Ã‹Å“Ã¢â‚¬Â ", "\u2606")
    .replaceAll("Ã¢Ëœâ€ ", "\u2606")
    .replaceAll("â˜†", "\u2606")
    .replaceAll("ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½", "\u00bd")
    .replaceAll("Ãƒâ€šÃ‚Â½", "\u00bd")
    .replaceAll("Ã‚Â½", "\u00bd")
    .replaceAll("Â½", "\u00bd")
    .replace(/\s+/g, " ")
    .trim();
}

function splitTitle(title = "") {
  const clean = cleanText(title);
  const marker = "The Complete Database";
  const index = clean.indexOf(marker);

  if (index === -1) {
    const dash = clean.indexOf(" - ");
    if (dash !== -1) {
      return { main: clean.slice(0, dash).trim(), accent: clean.slice(dash + 3).trim() };
    }
    return { main: clean, accent: "" };
  }

  return {
    main: clean.slice(0, index).trim(),
    accent: clean.slice(index).trim(),
  };
}

function StatIcon({ name, isDark, className = "h-5 w-5 object-contain" }) {
  return <HomeIcon name={name} isDark={isDark} className={className} />;
}

function Rating({ value }) {
  const rating = cleanText(value);
  const stars = Array.from({ length: 5 }, (_, index) => {
    const char = rating[index] || "\u2606";
    return char === "\u2605" || char === "\u00bd" ? "filled" : "empty";
  });

  if (rating.includes("\u00bd")) stars[3] = "half";

  return (
    <span className="inline-flex gap-0.5 text-[15px] leading-none">
      {stars.map((state, index) => (
        <span
          key={index}
          className={state === "empty" ? "text-[#cfd5dd]" : "text-[var(--color-chrome-bright)]"}
        >
          {state === "half" ? "\u00bd" : "\u2605"}
        </span>
      ))}
    </span>
  );
}

function cleanCost(value = "") {
  return cleanText(value)
    .replace(/\s*\[PLACEHOLDER.*?\]/, "")
    .replace(/\s*\[BMW-QUOTE\]/, "")
    .replace(/\s*\[JAG-QUOTE\]/, "");
}

function enquiryNumber(value = "") {
  const clean = cleanText(value);
  if (!/^\d/.test(clean)) return 0;
  const match = clean.match(/^\d[\d,]*/);
  return match ? Number(match[0].replaceAll(",", "")) : 0;
}

function fuelColor(fuel = "") {
  return cleanText(fuel).toLowerCase().includes("diesel") ? "text-[var(--color-text)]" : "text-green-700";
}

function uniqueOptions(values) {
  return [...new Set(values.map(cleanText).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function engineMatchesQuery(engine, query) {
  if (!query.trim()) return true;
  const haystack = [
    engine.engineCode,
    engine.family,
    engine.fuel,
    engine.displacement,
    engine.power,
    engine.years,
    engine.model,
    engine.enquiries,
    engine.avgRebuildCost,
  ]
    .map(cleanText)
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.trim().toLowerCase());
}

function filterAndSortEngines(engines, filters) {
  const filtered = engines.filter((engine) => {
    const generation = cleanText(engine.model);

    return (
      engineMatchesQuery(engine, filters.query) &&
      (!filters.fuel || cleanText(engine.fuel) === filters.fuel) &&
      (!filters.displacement || cleanText(engine.displacement) === filters.displacement) &&
      (!filters.generation || generation.split(",").map((item) => item.trim()).includes(filters.generation))
    );
  });

  return filtered.sort((a, b) => {
    if (filters.sort === "code") return cleanText(a.engineCode).localeCompare(cleanText(b.engineCode));
    if (filters.sort === "family") return cleanText(a.family).localeCompare(cleanText(b.family));

    const enquiryDelta = enquiryNumber(b.enquiries) - enquiryNumber(a.enquiries);
    return enquiryDelta || cleanText(a.engineCode).localeCompare(cleanText(b.engineCode));
  });
}

function filterOptions(engines) {
  const generations = engines.flatMap((engine) =>
    cleanText(engine.model)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  );

  return {
    fuels: uniqueOptions(engines.map((engine) => engine.fuel)),
    displacements: uniqueOptions(engines.map((engine) => engine.displacement)),
    generations: uniqueOptions(generations),
  };
}

function applyNativeMobileFilters(section) {
  const query = section.querySelector('[data-filter="query"]')?.value.trim().toLowerCase() || "";
  const fuel = section.querySelector('[data-filter="fuel"]')?.value || "";
  const displacement = section.querySelector('[data-filter="displacement"]')?.value || "";
  const generation = section.querySelector('[data-filter="generation"]')?.value || "";
  const sort = section.querySelector('[data-filter="sort"]')?.value || "enquiries";
  const rows = [...section.querySelectorAll("[data-engine-row]")];
  let visibleCount = 0;

  rows
    .sort((a, b) => {
      if (sort === "code") return a.dataset.code.localeCompare(b.dataset.code);
      if (sort === "family") return a.dataset.family.localeCompare(b.dataset.family);
      return Number(b.dataset.enquiries) - Number(a.dataset.enquiries) || a.dataset.code.localeCompare(b.dataset.code);
    })
    .forEach((row, index) => {
      row.style.order = String(index);
      const matches =
        (!query || row.dataset.search.includes(query)) &&
        (!fuel || row.dataset.fuel === fuel) &&
        (!displacement || row.dataset.displacement === displacement) &&
        (!generation || row.dataset.generations.split("|").includes(generation));

      row.hidden = !matches || visibleCount >= 9;
      if (matches) visibleCount += 1;
    });

  const empty = section.querySelector("[data-engine-empty]");
  if (empty) empty.hidden = visibleCount > 0;
}

function DesktopTable({ engines, isDark }) {
  return (
    <div className="overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface)]">
      <table className="w-full border-collapse text-left text-[13px] text-[var(--color-text)]">
        <thead>
          <tr className={tableHeaderClass(isDark)}>
            {[
              "Engine Code",
              "Family",
              "Fuel",
              "Disp.",
              "Power",
              "Years",
              "Gen.",
              "Reliability",
              "2025 Enquiries",
              "Avg. Recon Cost",
            ].map((column) => (
              <th
                key={column}
                className="border-b border-r border-white/20 px-3 py-3 text-center text-[13px] font-bold last:border-r-0"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {engines.slice(0, 10).map((row) => (
            <tr key={row.engineCode}>
              <td
                className="border-r border-t border-[var(--color-border)] px-3 py-2.5 font-bold"
                dangerouslySetInnerHTML={{ __html: cleanText(row.engineCode) }}
              />
              <td
                className="border-r border-t border-[var(--color-border)] px-3 py-2.5 text-center"
                dangerouslySetInnerHTML={{ __html: cleanText(row.family) }}
              />
              <td
                className="border-r border-t border-[var(--color-border)] px-3 py-2.5 text-center"
                dangerouslySetInnerHTML={{ __html: cleanText(row.fuel) }}
              />
              <td
                className="border-r border-t border-[var(--color-border)] px-3 py-2.5 text-center"
                dangerouslySetInnerHTML={{ __html: cleanText(row.displacement) }}
              />
              <td
                className="border-r border-t border-[var(--color-border)] px-3 py-2.5 text-center"
                dangerouslySetInnerHTML={{ __html: cleanText(row.power) }}
              />
              <td
                className="border-r border-t border-[var(--color-border)] px-3 py-2.5 text-center"
                dangerouslySetInnerHTML={{ __html: cleanText(row.years) }}
              />
              <td
                className="border-r border-t border-[var(--color-border)] px-3 py-2.5 text-center"
                dangerouslySetInnerHTML={{ __html: cleanText(row.model) }}
              />
              <td className="border-r border-t border-[var(--color-border)] px-3 py-2.5 text-center">
                <Rating value={row.reliability} />
              </td>
              <td
                className="border-r border-t border-[var(--color-border)] px-3 py-2.5 text-center font-heading text-[1.05rem] font-semibold"
                dangerouslySetInnerHTML={{ __html: cleanText(row.enquiries) }}
              />
              <td
                className="border-t border-[var(--color-border)] px-3 py-2.5 text-center"
                dangerouslySetInnerHTML={{ __html: cleanCost(row.avgRebuildCost) }}
              />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MobileControls({ filters, options, onChange, onReset, isDark }) {
  const selectClass =
    "min-h-12 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-[15px] text-[var(--color-text)]";
  const updateQuery = (event) => onChange({ query: event.currentTarget.value });

  return (
    <div className="space-y-3">
      <label className="flex min-h-14 items-center gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-[15px] text-[var(--color-text-soft)]">
        <StatIcon name="diagnosis" isDark={isDark} className="h-6 w-6 object-contain" />
        <input
          type="search"
          data-filter="query"
          value={filters.query}
          onInput={updateQuery}
          onChange={updateQuery}
          placeholder="Search engine code, family or notes..."
          className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[var(--color-text-soft)]"
        />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <select
          data-filter="fuel"
          className={selectClass}
          value={filters.fuel}
          onChange={(event) => onChange({ fuel: event.target.value })}
        >
          <option value="">Fuel Type</option>
          {options.fuels.map((fuel) => (
            <option key={fuel} value={fuel}>
              {fuel}
            </option>
          ))}
        </select>
        <select
          data-filter="displacement"
          className={selectClass}
          value={filters.displacement}
          onChange={(event) => onChange({ displacement: event.target.value })}
        >
          <option value="">Displacement</option>
          {options.displacements.map((displacement) => (
            <option key={displacement} value={displacement}>
              {displacement}
            </option>
          ))}
        </select>
        <select
          data-filter="generation"
          className={selectClass}
          value={filters.generation}
          onChange={(event) => onChange({ generation: event.target.value })}
        >
          <option value="">Generations</option>
          {options.generations.map((generation) => (
            <option key={generation} value={generation}>
              {generation}
            </option>
          ))}
        </select>
        <select
          data-filter="sort"
          className={selectClass}
          value={filters.sort}
          onChange={(event) => onChange({ sort: event.target.value })}
        >
          <option value="enquiries">Sort by Enquiries</option>
          <option value="code">Sort by Engine Code</option>
          <option value="family">Sort by Family</option>
        </select>
      </div>
      <button
        type="button"
        data-filter-reset
        onClick={onReset}
        className="flex min-h-12 w-full items-center justify-center gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[15px] text-[var(--color-text)]"
      >
        <StatIcon name="refresh" isDark={isDark} className="h-5 w-5 object-contain" />
        Reset filters
      </button>
    </div>
  );
}

function MobileTable({ engines, isDark }) {
  return (
    <div className="overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[15px]">
      <div className={`grid grid-cols-[1.2fr_0.9fr_1fr_44px] px-3 py-3 text-[15px] font-bold uppercase ${tableHeaderClass(isDark)}`}>
        <span>Engine Code</span>
        <span>Fuel</span>
        <span>2025 Enquiries</span>
        <span>View</span>
      </div>
      <div className="flex flex-col">
        {engines.map((row, index) => {
          const enquiries = enquiryNumber(row.enquiries);
          const generations = cleanText(row.model)
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
          const search = [
            row.engineCode,
            row.family,
            row.fuel,
            row.displacement,
            row.power,
            row.years,
            row.model,
            row.enquiries,
            row.avgRebuildCost,
          ]
            .map(cleanText)
            .join(" ")
            .toLowerCase();

          return (
            <div
              key={row.engineCode}
              data-engine-row
              data-search={search}
              data-fuel={cleanText(row.fuel)}
              data-displacement={cleanText(row.displacement)}
              data-generations={generations.join("|")}
              data-enquiries={enquiries}
              data-code={cleanText(row.engineCode)}
              data-family={cleanText(row.family)}
              hidden={index >= 9}
              className="grid grid-cols-[1.2fr_0.9fr_1fr_44px] items-center border-t border-[var(--color-border)] px-3 py-3"
            >
              <span
                className="font-bold text-[var(--color-text)]"
                dangerouslySetInnerHTML={{ __html: cleanText(row.engineCode) }}
              />
              <span className="flex items-center gap-2">
                <span className={fuelColor(row.fuel)}>
                  <StatIcon name="fuel" isDark={isDark} className="h-5 w-5 object-contain" />
                </span>
                <span dangerouslySetInnerHTML={{ __html: cleanText(row.fuel) }} />
              </span>
              <span className="font-heading text-[1.15rem] font-semibold text-[var(--color-text)]">
                {enquiries ? enquiries.toLocaleString("en-GB") : "-"}
              </span>
              <Link href="#" className="text-[var(--color-text)]">
                <StatIcon name="insight" isDark={isDark} className="h-5 w-5 object-contain" />
              </Link>
            </div>
          );
        })}
      </div>
      <div
        data-engine-empty
        hidden
        className="border-t border-[var(--color-border)] px-3 py-5 text-center text-[15px] text-[var(--color-text-muted)]"
      >
        No engine codes match these filters.
      </div>
      {engines.length === 0 ? (
        <div className="border-t border-[var(--color-border)] px-3 py-5 text-center text-[15px] text-[var(--color-text-muted)]">
          No engine codes match these filters.
        </div>
      ) : null}
    </div>
  );
}

function SectionHeader({ title, subHeadline, isDark, sectionBg }) {
  return (
    <div className={`relative overflow-hidden ${sectionBg}`}>
      <div className="absolute inset-y-0 right-0 w-[62%] md:w-[48%]">
        <Image
          src={HEADER_IMAGE}
          alt=""
          fill
          className="object-cover object-right"
          sizes="(max-width: 768px) 62vw, 48vw"
        />
        <div
          className={
            isDark
              ? "absolute inset-0 bg-[linear-gradient(90deg,var(--color-page)_0%,rgba(11,12,12,0.82)_34%,rgba(11,12,12,0.18)_100%)]"
              : "absolute inset-0 bg-[linear-gradient(90deg,var(--color-page)_0%,rgba(243,243,241,0.88)_34%,rgba(243,243,241,0.18)_100%)]"
          }
        />
      </div>
      <div className="relative mx-auto w-full max-w-8xl px-4 pb-3 pt-7 md:px-8 md:pb-4 md:pt-10">
        <div className="max-w-[650px]">
          <h2 className={`font-bold tracking-normal text-[var(--color-text)] ${sectionH2}`}>
            <span dangerouslySetInnerHTML={{ __html: title.main }} />
            {title.accent ? (
              <>
                <br />
                <span
                  className="text-[var(--color-chrome-bright)]"
                  dangerouslySetInnerHTML={{ __html: title.accent }}
                />
              </>
            ) : null}
          </h2>
          <div className="mt-3">
            <MStripe />
          </div>
          {subHeadline ? (
            <p
              className={`mt-3 max-w-[610px] text-[var(--color-text-muted)] ${sectionDescription}`}
              dangerouslySetInnerHTML={{ __html: cleanText(subHeadline) }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function EngineDatabase({ data }) {
  const { theme } = useTheme();
  const [filters, setFilters] = useState(defaultFilters);
  const engines = useMemo(() => data?.engines || [], [data]);
  const mobileOptions = useMemo(() => filterOptions(engines), [engines]);
  const mobileEngines = useMemo(() => filterAndSortEngines(engines, filters), [engines, filters]);

  useEffect(() => {
    const section = document.querySelector("[data-engine-database]");
    if (!section) return undefined;

    const apply = () => applyNativeMobileFilters(section);
    const controls = [...section.querySelectorAll("[data-filter]")];
    const reset = section.querySelector("[data-filter-reset]");

    controls.forEach((control) => {
      control.addEventListener("input", apply);
      control.addEventListener("change", apply);
    });

    reset?.addEventListener("click", () => {
      controls.forEach((control) => {
        control.value = control.dataset.filter === "sort" ? "enquiries" : "";
      });
      apply();
    });

    section.dataset.filtersReady = "true";
    apply();

    return () => {
      controls.forEach((control) => {
        control.removeEventListener("input", apply);
        control.removeEventListener("change", apply);
      });
    };
  }, [engines]);

  if (!data) return null;

  const isDark = theme === "dark";
  const title = splitTitle(data.h2);
  const shownDesktopCount = Math.min(10, engines.length);
  const totalEngineCount = engines.length;
  const sectionBg = isDark ? "bg-[var(--color-page)]" : "bg-[var(--color-page)]";

  function updateFilters(next) {
    setFilters((current) => ({ ...current, ...next }));
  }

  return (
    <section
      id="engine-database"
      data-engine-database
      data-theme-mode={theme}
      className={`overflow-hidden ${sectionBg} text-[var(--color-text)]`}
    >
      <SectionHeader title={title} subHeadline={data.subHeadline} isDark={isDark} sectionBg={sectionBg} />

      <div className="relative mx-auto w-full max-w-8xl px-4 pb-7 pt-4 md:px-8 md:pb-8 md:pt-5">
        <div className="hidden md:block">
          <DesktopTable engines={engines} isDark={isDark} />

          <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              className="flex min-h-11 min-w-[280px] items-center justify-between rounded-md border border-[var(--color-border)] px-5 text-[14px] font-medium text-[var(--color-text)] transition-all duration-200 hover:shadow-[0_12px_24px_rgba(0,0,0,0.14)]"
            >
              <span className="flex items-center gap-3">
                <StatIcon name="database" isDark={isDark} className="h-5 w-5 object-contain" />
                View all {totalEngineCount} engine codes
              </span>
              <span>v</span>
            </button>
            <p className="mr-auto border-l border-[var(--color-border)] pl-7 text-[12px] text-[var(--color-text-muted)]">
              Showing {shownDesktopCount} of {totalEngineCount} engine codes
            </p>
            <div className="flex items-center gap-5 rounded-md border border-[var(--color-border)] px-5 py-3 text-[13px]">
              <span>
                <Rating value="★☆☆☆☆" /> Poor
              </span>
              <span>
                <Rating value="★★★☆☆" /> Average
              </span>
              <span>
                <Rating value="★★★★☆" /> Good
              </span>
              <span>
                <Rating value="★★★★★" /> Excellent
              </span>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[12px] text-[var(--color-text-muted)]">
            <p className="flex items-center gap-3">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  isDark ? "bg-white/10" : "bg-[#ececeb]"
                }`}
              >
                <StatIcon name="note" isDark={isDark} className="h-5 w-5 object-contain" />
              </span>
              All enquiries are from 2025 (to date) and verified via our internal system. Recon costs are supply only and
              exclude fitting.
            </p>
            <Link
              href="#"
              className="flex items-center gap-2 font-bold text-[var(--color-text)] transition-all duration-200 hover:shadow-[0_12px_24px_rgba(0,0,0,0.14)]"
            >
              How we collect engine data{" "}
              <StatIcon name="insight" isDark={isDark} className="h-4 w-4 object-contain" />
            </Link>
          </div>
        </div>

        <div className="md:hidden">
          <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <div className="flex items-center gap-2.5">
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                  isDark ? "bg-white/10" : "bg-[#ececeb]"
                }`}
              >
                <StatIcon name="database" isDark={isDark} className="h-10 w-10 object-contain" />
              </span>
              <h3 className="flex-1 text-left font-heading text-[1.55rem] font-semibold leading-[1.1]">
                Proprietary UK Data
              </h3>
            </div>
            <p className="mt-3 text-center text-[14px] leading-[1.5]">
              Every figure below is powered by real UK owner enquiries in 2025. This is data you won&apos;t find anywhere
              else.
            </p>
          </div>

          <div className="mt-5">
            <MobileControls
              filters={filters}
              options={mobileOptions}
              onChange={updateFilters}
              onReset={() => setFilters(defaultFilters)}
              isDark={isDark}
            />
          </div>

          <div className="mt-5">
            <MobileTable engines={mobileEngines} isDark={isDark} />
          </div>

          <div className="mt-6 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-[15px] leading-[1.55]">
            <h3 className="font-bold uppercase text-[var(--color-chrome-bright)]">Data sources:</h3>
            <div className="mt-4 space-y-4">
              <p className="flex gap-4">
                <StatIcon name="chart" isDark={isDark} className="h-5 w-5 object-contain" />
                <span>
                  <strong>Enquiry volumes:</strong>
                  <br />
                  Proprietary UK enquiry data 2025 [JAG-VERIFIED]
                </span>
              </p>
              <p className="flex gap-4">
                <StatIcon name="pound" isDark={isDark} className="h-5 w-5 object-contain" />
                <span>
                  <strong>Costs:</strong>
                  <br />
                  Engine Replacement Economics [JAG-QUOTE]
                </span>
              </p>
              <p className="flex gap-4">
                <StatIcon name="database" isDark={isDark} className="h-5 w-5 object-contain" />
                <span>
                  <strong>Engine codes:</strong>
                  <br />
                  Cross-referenced from verified factory data
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
