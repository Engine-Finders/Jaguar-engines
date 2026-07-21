import { notFound } from "next/navigation";
import genPages from "@/data/registery/generations/pages.json";
import varPages from "@/data/registery/variants/pages.json";
import modelPages from "@/data/registery/models/pages.json";

// ---- Model components ----
import ModelHero from "@/components/models/ModelHero";
import OwnershipVerdict from "@/components/models/OwnershipVerdict";
import AtAGlance from "@/components/models/AtAGlance";
import GenerationsGrid from "@/components/models/GenerationsGrid";
import EngineDatabase from "@/components/models/EngineDatabase";
import ModelCommonProblems from "@/components/models/CommonProblems";
import MarketIntelligence from "@/components/models/MarketIntelligence";
import EditorialPullQuote from "@/components/models/EditorialPullQuote";
import ReplacementCosts from "@/components/models/ReplacementCosts";
import EngineEvolution from "@/components/models/EngineEvolution";
import WhoShouldBuy from "@/components/models/WhoShouldBuy";
import CalculatorCTA from "@/components/models/CalculatorCTA";
import TrustBlock from "@/components/models/TrustBlock";
import FAQAccordion from "@/components/models/FAQAccordion";
import ClosingActionCards from "@/components/models/ClosingActionCards";

// ---- Generation components ----
import GenModelHero from "@/components/generation/ModelHero";
import GenEngineDatabase from "@/components/generation/EngineDatabase";
import Overview from "@/components/generation/Overview";
import BestWorstEngines from "@/components/generation/BestWorstEngines";
import OwnershipEconomics from "@/components/generation/OwnershipEconomics";
import GenCommonProblems from "@/components/generation/CommonProblems";
import GenReplacementCosts from "@/components/generation/ReplacementCosts";
import CoreVariants from "@/components/generation/CoreVariants";
import GenMarketIntelligence from "@/components/generation/MarketIntelligence";
import GenFAQAccordion from "@/components/generation/FAQAccordion";
import GenTrustCta from "@/components/generation/TrustCta";

// ---- Variant components ----
import VariantHero from "@/components/variant/VariantHero";
import EraMap from "@/components/variant/EraMap";
import VarReplacementCosts from "@/components/variant/ReplacementCosts";
import VarCommonProblems from "@/components/variant/CommonProblems";
import QuotesCta from "@/components/variant/QuotesCta";
import RepairBuyOrReplace from "@/components/variant/RepairBuyOrReplace";
import BuyingChecklist from "@/components/variant/BuyingChecklist";
import EngineCodes from "@/components/variant/EngineCodes";
import VarMarketIntelligence from "@/components/variant/MarketIntelligence";
import VarFAQAccordion from "@/components/variant/FAQAccordion";
import VarTrustCta from "@/components/variant/TrustCta";

function findEntry(segments, pages) {
  if (segments.length === 2) {
    return pages.find(
      (p) => p.parent === segments[0] && p.slug === segments[1]
    );
  }
  return pages.find(
    (p) => !p.parent && p.slug === segments[0]
  );
}

async function getData(type, dataFile) {
  try {
    const data = await import(`@/data/${type}/${dataFile}.json`);
    return data.default;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  const gen = genPages.map((p) => ({
    slug: p.parent ? [p.parent, p.slug] : [p.slug],
  }));
  const vr = varPages.map((p) => ({
    slug: p.parent ? [p.parent, p.slug] : [p.slug],
  }));
  const md = modelPages.map((p) => ({ slug: [p.slug] }));
  return [...gen, ...vr, ...md];
}

async function resolvePage(slug) {
  const segments = slug;

  // Models — single segment
  if (segments.length === 1) {
    const entry = modelPages.find((p) => p.slug === segments[0]);
    if (entry) {
      const data = await getData(entry.type, entry.dataFile);
      return data ? { type: "model", data } : null;
    }
  }

  // Generations
  const genEntry = findEntry(segments, genPages);
  if (genEntry) {
    const data = await getData("generations", genEntry.dataFile);
    return data ? { type: "generation", data } : null;
  }

  // Variants
  const varEntry = findEntry(segments, varPages);
  if (varEntry) {
    const data = await getData("variants", varEntry.dataFile);
    return data ? { type: "variant", data } : null;
  }

  return null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const result = await resolvePage(slug);
  if (!result?.data?.meta) return {};

  const { meta } = result.data;
  return {
    title: meta.title || undefined,
    description: meta.description || undefined,
    alternates: meta.canonical ? { canonical: meta.canonical } : undefined,
    openGraph: meta.openGraph
      ? {
          title: meta.openGraph.title || undefined,
          description: meta.openGraph.description || undefined,
          type: meta.openGraph.type || "website",
          url: meta.openGraph.url || undefined,
          images: meta.openGraph.image ? [meta.openGraph.image] : undefined,
          siteName: meta.openGraph.siteName || undefined,
        }
      : undefined,
    twitter: meta.twitter?.title || meta.twitter?.description
      ? {
          card: meta.twitter.card || undefined,
          title: meta.twitter.title || undefined,
          description: meta.twitter.description || undefined,
          images: meta.twitter.image ? [meta.twitter.image] : undefined,
        }
      : undefined,
  };
}

export default async function CatchAllPage({ params }) {
  const { slug } = await params;
  const result = await resolvePage(slug);
  if (!result) notFound();

  const { type, data } = result;

  if (type === "model") {
    return (
      <main style={{ padding: "24px 16px 64px", maxWidth: 900, margin: "0 auto", lineHeight: 1.5, display: "flex", flexDirection: "column", gap: 40 }}>
        {data.meta?.jsonLd && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data.meta.jsonLd) }} />
        )}
        <ModelHero data={data.hero} />
        <OwnershipVerdict data={data.ownershipVerdict} />
        <AtAGlance data={data.atAGlance} />
        <GenerationsGrid data={data.generations} />
        <EngineDatabase data={data.engineDatabase} />
        <ModelCommonProblems data={data.commonProblems} />
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

  if (type === "generation") {
    return (
      <main style={{ padding: "24px 16px 64px", maxWidth: 1100, margin: "0 auto", lineHeight: 1.5, display: "flex", flexDirection: "column", gap: 40 }}>
        {data.meta?.jsonLd && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data.meta.jsonLd) }} />
        )}
        <GenModelHero data={data.hero} />
        <GenEngineDatabase data={data.engineDatabase} />
        <Overview data={data.overview} />
        <BestWorstEngines data={data.bestWorstEngines} />
        <OwnershipEconomics data={data.ownershipEconomics} />
        <GenCommonProblems data={data.commonProblems} />
        <GenReplacementCosts data={data.replacementCosts} />
        <CoreVariants data={data.coreVariants} />
        <GenMarketIntelligence data={data.marketIntelligence} />
        <GenFAQAccordion data={data.faq} />
        <GenTrustCta data={data.trustCta} />
      </main>
    );
  }

  if (type === "variant") {
    return (
      <main style={{ padding: "24px 16px 64px", maxWidth: 1100, margin: "0 auto", lineHeight: 1.5, display: "flex", flexDirection: "column", gap: 40 }}>
        {data.meta?.jsonLd && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data.meta.jsonLd) }} />
        )}
        <VariantHero data={data.hero} />
        <EraMap data={data.eraMap} />
        <VarReplacementCosts data={data.replacementCosts} />
        <VarCommonProblems data={data.commonProblems} />
        <QuotesCta data={data.quotesCta} />
        <RepairBuyOrReplace data={data.repairBuyOrReplace} />
        <BuyingChecklist data={data.buyingChecklist} />
        <EngineCodes data={data.engineCodes} />
        <VarMarketIntelligence data={data.marketIntelligence} />
        <VarFAQAccordion data={data.faq} />
        <VarTrustCta data={data.trustCta} />
      </main>
    );
  }

  notFound();
}
