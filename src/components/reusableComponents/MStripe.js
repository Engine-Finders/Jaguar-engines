export default function MStripe() {
  return (
    <div className="flex items-center gap-1" aria-hidden="true">
      <span className="h-2.5 w-6 -skew-x-[25deg] bg-[var(--color-accent)] md:h-3 md:w-7" />
      <span className="h-2.5 w-6 -skew-x-[25deg] bg-[var(--color-primary)] md:h-3 md:w-7" />
      <span className="h-2.5 w-6 -skew-x-[25deg] bg-[var(--color-accent-red)] md:h-3 md:w-7" />
      <span className="h-2.5 w-6 -skew-x-[25deg] bg-[var(--color-border-strong)] md:h-3 md:w-7" />
      <span className="h-px w-20 bg-[var(--color-border-strong)] md:w-24" />
    </div>
  );
}
