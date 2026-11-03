export default function LegalPage({ title, children }) {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 text-[var(--color-text)] md:px-8 md:py-12">
      <h1 className="text-[28px] font-bold leading-tight md:text-[36px]">{title}</h1>
      <p className="mt-2 text-sm text-[var(--color-text-muted)]">Last updated: October 2026</p>
      <div className="mt-6 space-y-5 text-[15px] leading-[1.6] text-[var(--color-text-muted)] [&_h2]:mt-6 [&_h2]:text-[18px] [&_h2]:font-bold [&_h2]:text-[var(--color-text)] [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
        {children}
      </div>
    </main>
  );
}
