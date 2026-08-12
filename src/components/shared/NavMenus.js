"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { navMenus } from "@/components/shared/navData";

export { navMenus };

const linkClass =
  "block text-sm font-semibold text-[var(--color-text)] no-underline hover:text-[var(--color-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]";
const mutedLinkClass =
  "block text-sm font-bold text-[var(--color-primary)] no-underline hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]";
const topLinkClass =
  "inline-flex items-center text-sm font-semibold text-[var(--color-text)] no-underline hover:text-[var(--color-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]";

function Chevron({ open }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={`h-3.5 w-3.5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M5 7l5 5 5-5" />
    </svg>
  );
}

function CaretRight() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-3.5 w-3.5 shrink-0 opacity-60" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 5l5 5-5 5" />
    </svg>
  );
}

function flatModels(menu) {
  return menu.groups.flatMap((group) => group.items.map((item) => ({ ...item, group: group.title })));
}

function ModelFlyout({ item, openLeft, onNavigate }) {
  const variants = item.variants || [];
  const generations = item.generations || [];
  const hasChildren = variants.length > 0 || generations.length > 0;

  return (
    <div
      className={`absolute top-0 z-[70] max-h-[min(70vh,32rem)] w-[min(92vw,28rem)] overflow-y-auto rounded border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-[0_12px_28px_var(--color-shadow)] ${
        openLeft ? "right-full mr-1" : "left-full ml-1"
      }`}
    >
      <Link href={item.href} className={`${mutedLinkClass} mb-2`} onClick={onNavigate}>
        {item.label} Overview
      </Link>

      {!hasChildren ? (
        <p className="text-xs text-[var(--color-text-soft)]">No variant or generation pages listed yet.</p>
      ) : (
        <div className={`grid gap-3 ${variants.length && generations.length ? "grid-cols-2" : "grid-cols-1"}`}>
          {variants.length ? (
            <div>
              <p className="mb-1.5 text-[0.68rem] font-bold uppercase tracking-wide text-[var(--color-text-soft)]">
                Variants ({variants.length})
              </p>
              <ul className="grid gap-0.5">
                {variants.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={`${linkClass} py-1 text-[0.82rem]`} onClick={onNavigate}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {generations.length ? (
            <div>
              <p className="mb-1.5 text-[0.68rem] font-bold uppercase tracking-wide text-[var(--color-text-soft)]">
                Generations ({generations.length})
              </p>
              <ul className="grid gap-0.5">
                {generations.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={`${linkClass} py-1 text-[0.82rem]`} onClick={onNavigate}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

function ModelsPanel({ menu, activeModelHref, setActiveModelHref, onNavigate }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {menu.groups.map((group, groupIndex) => {
        const openLeft = groupIndex >= 2;
        return (
          <div key={group.title}>
            <p className="mb-2 text-[0.7rem] font-bold uppercase tracking-wide text-[var(--color-text-soft)]">{group.title}</p>
            <ul className="grid gap-1">
              {group.items.map((item) => {
                const isActive = activeModelHref === item.href;
                return (
                  <li
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => setActiveModelHref(item.href)}
                    onFocusCapture={() => setActiveModelHref(item.href)}
                  >
                    <div
                      className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm font-semibold ${
                        isActive ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]" : "text-[var(--color-text)] hover:bg-[var(--color-page-soft)]"
                      }`}
                    >
                      <Link
                        href={item.href}
                        className="min-w-0 flex-1 no-underline hover:text-[var(--color-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
                        onClick={onNavigate}
                      >
                        {item.label}
                      </Link>
                      <span className="shrink-0" aria-hidden="true">
                        <CaretRight />
                      </span>
                    </div>

                    {isActive ? <ModelFlyout item={item} openLeft={openLeft} onNavigate={onNavigate} /> : null}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

const COLUMN_PREVIEW_COUNT = 10;

function ColumnsPanel({ menu, onNavigate }) {
  const [expandedTitles, setExpandedTitles] = useState(() => new Set());

  function toggleColumn(title) {
    setExpandedTitles((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  }

  return (
    <>
      <div className={`grid gap-4 ${menu.groups.length >= 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
        {menu.groups.map((group) => {
          const links = group.links || [];
          const isExpanded = expandedTitles.has(group.title);
          const visibleLinks = isExpanded || links.length <= COLUMN_PREVIEW_COUNT ? links : links.slice(0, COLUMN_PREVIEW_COUNT);
          const canExpand = links.length > COLUMN_PREVIEW_COUNT;

          return (
            <div key={group.title}>
              <p className="mb-2 text-[0.7rem] font-bold uppercase tracking-wide text-[var(--color-text-soft)]">{group.title}</p>
              <ul className="grid gap-1.5">
                {visibleLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={linkClass} onClick={onNavigate}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              {canExpand ? (
                <button
                  type="button"
                  className={`mt-3 ${mutedLinkClass} text-left`}
                  onClick={() => toggleColumn(group.title)}
                >
                  {isExpanded ? "Show less" : `View all (${links.length})`}
                </button>
              ) : group.viewAll ? (
                <Link href={group.viewAll.href} className={`mt-3 ${mutedLinkClass}`} onClick={onNavigate}>
                  {group.viewAll.label}
                </Link>
              ) : null}
            </div>
          );
        })}
      </div>
      {menu.footerLink ? (
        <div className="mt-4 border-t border-[var(--color-border)] pt-3">
          <Link href={menu.footerLink.href} className={mutedLinkClass} onClick={onNavigate}>
            {menu.footerLink.label}
          </Link>
        </div>
      ) : null}
    </>
  );
}

export function DesktopNavMenus() {
  const [openId, setOpenId] = useState(null);
  const firstModelHref = navMenus.find((menu) => menu.kind === "models")?.groups?.[0]?.items?.[0]?.href || "/1-series";
  const [activeModelHref, setActiveModelHref] = useState(firstModelHref);
  const rootRef = useRef(null);
  const baseId = useId();
  const openMenu = navMenus.find((menu) => menu.id === openId && menu.kind !== "link") || null;
  const panelId = openMenu ? `${baseId}-${openMenu.id}-panel` : undefined;

  useEffect(() => {
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpenId(null);
    }
    function onKeyDown(event) {
      if (event.key === "Escape") setOpenId(null);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative hidden flex-1 lg:block">
      <ul className="flex items-center justify-center gap-4 xl:gap-6">
        {navMenus.map((menu) => {
          if (menu.kind === "link") {
            return (
              <li key={menu.id}>
                <Link href={menu.href} className={topLinkClass}>
                  {menu.label}
                </Link>
              </li>
            );
          }

          const isOpen = openId === menu.id;
          return (
            <li key={menu.id}>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-text)] no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
                aria-expanded={isOpen}
                aria-controls={isOpen ? panelId : undefined}
                onClick={() => setOpenId(isOpen ? null : menu.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setOpenId(isOpen ? null : menu.id);
                  }
                }}
              >
                <span>{menu.label}</span>
                <Chevron open={isOpen} />
              </button>
            </li>
          );
        })}
      </ul>

      {openMenu ? (
        <div
          id={panelId}
          role="region"
          aria-label={openMenu.label}
          className={`absolute left-1/2 top-full z-50 mt-3 w-[min(96vw,72rem)] -translate-x-1/2 border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[0_16px_40px_var(--color-shadow)] ${
            openMenu.kind === "models" ? "overflow-visible" : "max-h-[70vh] overflow-y-auto"
          }`}
        >
          {openMenu.kind === "models" ? (
            <ModelsPanel
              menu={openMenu}
              activeModelHref={activeModelHref}
              setActiveModelHref={setActiveModelHref}
              onNavigate={() => setOpenId(null)}
            />
          ) : (
            <ColumnsPanel key={openMenu.id} menu={openMenu} onNavigate={() => setOpenId(null)} />
          )}
        </div>
      ) : null}
    </div>
  );
}

function MobileRowButton({ label, onClick, expanded }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={expanded}
      className="flex w-full items-center justify-between gap-3 py-2.5 text-left text-sm font-semibold text-[var(--color-text)]"
    >
      <span>{label}</span>
      <Chevron open={false} />
    </button>
  );
}

/** Model label links to the model page; right-side hit area opens the submenu. */
function MobileModelRow({ model, onOpenSubmenu, onNavigate }) {
  return (
    <div className="flex items-stretch border-b border-[var(--color-border)]">
      <Link
        href={model.href}
        className={`${linkClass} min-w-0 flex-1 py-2.5 pr-2`}
        onClick={onNavigate}
      >
        {model.label}
      </Link>
      <button
        type="button"
        onClick={onOpenSubmenu}
        aria-label={`Open ${model.label} variants and generations`}
        className="flex shrink-0 items-center justify-center px-3 py-2.5 text-[var(--color-text)]"
      >
        <Chevron open={false} />
      </button>
    </div>
  );
}

export function MobileNavMenus({ onNavigate }) {
  const [stack, setStack] = useState([{ type: "root" }]);
  const current = stack[stack.length - 1];

  function push(frame) {
    setStack((prev) => [...prev, frame]);
  }

  function pop() {
    setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }

  function goLink(href) {
    onNavigate?.();
    setStack([{ type: "root" }]);
  }

  if (current.type === "root") {
    return (
      <ul className="grid gap-1">
        {navMenus.map((menu) => (
          <li key={menu.id} className="border-b border-[var(--color-border)]">
            {menu.kind === "link" ? (
              <Link href={menu.href} className={`${linkClass} py-2.5`} onClick={() => goLink(menu.href)}>
                {menu.label}
              </Link>
            ) : (
              <MobileRowButton label={menu.label} onClick={() => push({ type: "menu", menuId: menu.id })} />
            )}
          </li>
        ))}
      </ul>
    );
  }

  const menu = navMenus.find((item) => item.id === current.menuId);
  if (!menu) return null;

  if (current.type === "menu" && menu.kind === "models") {
    const models = flatModels(menu);
    return (
      <div>
        <button type="button" onClick={pop} className="mb-2 text-sm font-bold text-[var(--color-primary)]">
          ← {menu.label}
        </button>
        <div className="grid gap-0">
          {models.map((model) => (
            <MobileModelRow
              key={model.href}
              model={model}
              onOpenSubmenu={() => push({ type: "model", menuId: menu.id, modelHref: model.href })}
              onNavigate={() => goLink(model.href)}
            />
          ))}
        </div>
      </div>
    );
  }

  if (current.type === "model") {
    const model = flatModels(menu).find((item) => item.href === current.modelHref);
    if (!model) return null;
    const variants = model.variants || [];
    const generations = model.generations || [];
    return (
      <div>
        <button type="button" onClick={pop} className="mb-2 text-sm font-bold text-[var(--color-primary)]">
          ← {model.label}
        </button>
        <ul className="grid gap-1">
          <li className="border-b border-[var(--color-border)]">
            <Link href={model.href} className={`${linkClass} py-2.5`} onClick={() => goLink(model.href)}>
              {model.label} Overview
            </Link>
          </li>
        </ul>
        {variants.length ? (
          <div className="mt-3">
            <p className="mb-1 text-[0.7rem] font-bold uppercase tracking-wide text-[var(--color-text-soft)]">
              Variants ({variants.length})
            </p>
            <ul className="grid gap-1">
              {variants.map((link) => (
                <li key={link.href} className="border-b border-[var(--color-border)]">
                  <Link href={link.href} className={`${linkClass} py-2`} onClick={() => goLink(link.href)}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {generations.length ? (
          <div className="mt-3">
            <p className="mb-1 text-[0.7rem] font-bold uppercase tracking-wide text-[var(--color-text-soft)]">
              Generations ({generations.length})
            </p>
            <ul className="grid gap-1">
              {generations.map((link) => (
                <li key={link.href} className="border-b border-[var(--color-border)]">
                  <Link href={link.href} className={`${linkClass} py-2`} onClick={() => goLink(link.href)}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    );
  }

  if (current.type === "menu") {
    return <MobileColumnsMenu menu={menu} onPop={pop} onGoLink={goLink} />;
  }

  return null;
}

function MobileColumnsMenu({ menu, onPop, onGoLink }) {
  const [expandedTitles, setExpandedTitles] = useState(() => new Set());

  function toggleColumn(title) {
    setExpandedTitles((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  }

  return (
    <div>
      <button type="button" onClick={onPop} className="mb-2 text-sm font-bold text-[var(--color-primary)]">
        ← {menu.label}
      </button>
      <div className="grid gap-4">
        {menu.groups.map((group) => {
          const links = group.links || [];
          const isExpanded = expandedTitles.has(group.title);
          const visibleLinks = isExpanded || links.length <= COLUMN_PREVIEW_COUNT ? links : links.slice(0, COLUMN_PREVIEW_COUNT);
          const canExpand = links.length > COLUMN_PREVIEW_COUNT;

          return (
            <div key={group.title}>
              <p className="mb-1 text-[0.7rem] font-bold uppercase tracking-wide text-[var(--color-text-soft)]">{group.title}</p>
              <ul className="grid gap-1">
                {visibleLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={`${linkClass} py-1.5`} onClick={() => onGoLink(link.href)}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              {canExpand ? (
                <button
                  type="button"
                  className={`mt-2 ${mutedLinkClass} text-left`}
                  onClick={() => toggleColumn(group.title)}
                >
                  {isExpanded ? "Show less" : `View all (${links.length})`}
                </button>
              ) : group.viewAll ? (
                <Link href={group.viewAll.href} className={`mt-2 ${mutedLinkClass}`} onClick={() => onGoLink(group.viewAll.href)}>
                  {group.viewAll.label}
                </Link>
              ) : null}
            </div>
          );
        })}
        {menu.footerLink ? (
          <Link href={menu.footerLink.href} className={mutedLinkClass} onClick={() => onGoLink(menu.footerLink.href)}>
            {menu.footerLink.label}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
