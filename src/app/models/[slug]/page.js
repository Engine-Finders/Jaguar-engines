import { notFound } from "next/navigation";
import pages from "@/data/registery/models/pages.json";
import ModelHero from "@/components/models/ModelHero";
import OwnershipVerdict from "@/components/models/OwnershipVerdict";
import AtAGlance from "@/components/models/AtAGlance";
import GenerationsGrid from "@/components/models/GenerationsGrid";
import EngineDatabase from "@/components/models/EngineDatabase";
import CommonProblems from "@/components/models/CommonProblems";
import MarketIntelligence from "@/components/models/MarketIntelligence";
import EditorialPullQuote from "@/components/models/EditorialPullQuote";
import ReplacementCosts from "@/components/models/ReplacementCosts";
import EngineEvolution from "@/components/models/EngineEvolution";
import WhoShouldBuy from "@/components/models/WhoShouldBuy";
import CalculatorCTA from "@/components/models/CalculatorCTA";
import TrustBlock from "@/components/models/TrustBlock";
import FAQAccordion from "@/components/models/FAQAccordion";
import ClosingActionCards from "@/components/models/ClosingActionCards";

async function getPageData(type, dataFile) {
  try {
    const data = await import(`@/data/${type}/${dataFile}.json`);
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
  const data = await getPageData(entry.type, entry.dataFile);
  if (!data?.meta) return {};

  const { meta } = data;
  return {
    title: meta.title,
    description: meta.description,
    openGraph: meta.openGraph
      ? {
          title: meta.openGraph.title,
          description: meta.openGraph.description,
          type: meta.openGraph.type,
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

export default async function ModelPage({ params }) {
  const { slug } = await params;
  const entry = pages.find((page) => page.slug === slug);
  if (!entry) notFound();

  const data = await getPageData(entry.type, entry.dataFile);
  if (!data) notFound();

  return (
    <main style={{ padding: 12, maxWidth: 1408, margin: "0 auto" }}>
      {data.meta?.jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data.meta.jsonLd),
          }}
        />
      )}
      <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
        {JSON.stringify(data.meta, null, 2)}
      </pre>
      <p>slug: {data.slug}</p>
      <ModelHero data={data.hero} />
      <OwnershipVerdict data={data.ownershipVerdict} />
      <AtAGlance data={data.atAGlance} />
      <GenerationsGrid data={data.generations} />
      <EngineDatabase data={data.engineDatabase} />
      <CommonProblems data={data.commonProblems} />
      <MarketIntelligence data={data.marketIntelligence} />
      <EditorialPullQuote data={data.editorialPullQuote} />
      <ReplacementCosts data={data.replacementCosts} />
      <EngineEvolution data={data.engineEvolution} />
      <WhoShouldBuy data={data.whoShouldBuy} />
      <CalculatorCTA data={data.calculatorCta} />
      <TrustBlock data={data.trustBlock} />
      <FAQAccordion data={data.faq} />
      <ClosingActionCards data={data.closingActionCards} />
    </main>
  );
}
