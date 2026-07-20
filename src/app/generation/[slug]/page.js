import { notFound } from "next/navigation";
import pages from "@/data/registery/generations/pages.json";
import ModelHero from "@/components/generation/ModelHero";
import EngineDatabase from "@/components/generation/EngineDatabase";
import Overview from "@/components/generation/Overview";
import BestWorstEngines from "@/components/generation/BestWorstEngines";
import OwnershipEconomics from "@/components/generation/OwnershipEconomics";
import CommonProblems from "@/components/generation/CommonProblems";
import ReplacementCosts from "@/components/generation/ReplacementCosts";
import CoreVariants from "@/components/generation/CoreVariants";
import MarketIntelligence from "@/components/generation/MarketIntelligence";
import FAQAccordion from "@/components/generation/FAQAccordion";
import TrustCta from "@/components/generation/TrustCta";

async function getPageData(dataFile) {
  try {
    const data = await import(`@/data/generations/${dataFile}.json`);
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
  return {
    title: meta.title,
    description: meta.description,
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
        }
      : undefined,
  };
}

export default async function GenerationPage({ params }) {
  const { slug } = await params;
  const entry = pages.find((page) => page.slug === slug);
  if (!entry) notFound();

  const data = await getPageData(entry.dataFile);
  if (!data) notFound();

  return (
    <main
      style={{
        padding: "24px 16px 64px",
        maxWidth: 1100,
        margin: "0 auto",
        lineHeight: 1.5,
        display: "flex",
        flexDirection: "column",
        gap: 40,
      }}
    >
      {data.meta?.jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data.meta.jsonLd),
          }}
        />
      )}
      <ModelHero data={data.hero} />
      <EngineDatabase data={data.engineDatabase} />
      <Overview data={data.overview} />
      <BestWorstEngines data={data.bestWorstEngines} />
      <OwnershipEconomics data={data.ownershipEconomics} />
      <CommonProblems data={data.commonProblems} />
      <ReplacementCosts data={data.replacementCosts} />
      <CoreVariants data={data.coreVariants} />
      <MarketIntelligence data={data.marketIntelligence} />
      <FAQAccordion data={data.faq} />
      <TrustCta data={data.trustCta} />
    </main>
  );
}
