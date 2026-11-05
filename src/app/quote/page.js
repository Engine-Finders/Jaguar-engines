import { Suspense } from "react";
import QuoteForm from "@/components/shared/QuoteForm";

export const metadata = {
  title: "Get a Quote | Jaguar Engines UK",
  description: "Request a free Jaguar replacement engine quote.",
};

export default function QuotePage() {
  return (
    <main className="mx-auto w-full max-w-[560px] px-3 py-5 sm:px-4 sm:py-8">
      <Suspense fallback={<p className="text-sm text-[var(--color-text-soft)]">Loading quote form…</p>}>
        <QuoteForm />
      </Suspense>
    </main>
  );
}
