import { notFound } from "next/navigation";
import pages from "@/data/registery/engines/pages.json";
import EngineHero from "@/components/engine/EngineHero";
import AtAGlance from "@/components/engine/AtAGlance";
import VerdictRating from "@/components/engine/VerdictRating";
import Compatibility from "@/components/engine/Compatibility";
import CostGuide from "@/components/engine/CostGuide";
import FAQAccordion from "@/components/engine/FAQAccordion";
import TrustCta from "@/components/engine/TrustCta";

async function getPageData(dataFile) {
  try {
    const data = await import(`@/data/engines/${dataFile}.json`);
    return data.default;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  return pages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const entry = pages.find((page) => page.slug === slug);
  if (!entry) return {};
  const data = await getPageData(entry.dataFile);
  if (!data?.meta) return {};

  const { meta } = data;
  const canonical = meta.canonical || `https://bmwengines.uk/engine/${slug}`;
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical },
    openGraph: meta.openGraph
      ? {
          title: meta.openGraph.title,
          description: meta.openGraph.description,
          type: meta.openGraph.type || "website",
          url: meta.openGraph.url,
          images: meta.openGraph.image ? [meta.openGraph.image] : undefined,
          siteName: meta.openGraph.siteName,
        }
      : undefined,
    twitter: meta.twitter
      ? {
          card: meta.twitter.card,
          title: meta.twitter.title,
          description: meta.twitter.description,
          images: meta.twitter.image ? [meta.twitter.image] : undefined,
        }
      : undefined,
  };
}

export default async function EnginePage({ params }) {
  const { slug } = await params;
  const entry = pages.find((page) => page.slug === slug);
  if (!entry) notFound();

  const data = await getPageData(entry.dataFile);
  if (!data) notFound();

  const glanceRows = data.atAGlance?.rows || [];
  const engineLabel =
    glanceRows.find((row) => row.metric === "Engine Family")?.value || "BMW Engine";
  const yearsProduced =
    glanceRows.find((row) => row.metric === "Years Produced")?.value || "";
  const modelsFitted =
    glanceRows.find((row) => row.metric === "Models Fitted (BMW only)")?.value || "";
  const crossBrandFitment =
    glanceRows.find((row) => row.metric === "Cross-Brand Fitment")?.value || "";

  return (
    <main className="flex flex-col">
      {data.meta?.jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data.meta.jsonLd),
          }}
        />
      )}
      <EngineHero data={data.hero} />
      <AtAGlance data={data.atAGlance} />
      <VerdictRating data={data.verdictRating} />
      <Compatibility
        data={data.compatibility}
        engineLabel={engineLabel}
        yearsProduced={yearsProduced}
        modelsFitted={modelsFitted}
        crossBrandFitment={crossBrandFitment}
      />
      <CostGuide data={data.costGuide} engineLabel={engineLabel} />
      <FAQAccordion data={data.faq} engineLabel={engineLabel} />
      <TrustCta data={data.trustCta} engineLabel={engineLabel} />
    </main>
  );
}
