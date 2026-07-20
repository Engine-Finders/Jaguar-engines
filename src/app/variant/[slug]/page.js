import { notFound } from "next/navigation";
import pages from "@/data/registery/variants/pages.json";
import VariantHero from "@/components/variant/VariantHero";
import EraMap from "@/components/variant/EraMap";
import ReplacementCosts from "@/components/variant/ReplacementCosts";
import CommonProblems from "@/components/variant/CommonProblems";
import QuotesCta from "@/components/variant/QuotesCta";
import RepairBuyOrReplace from "@/components/variant/RepairBuyOrReplace";
import BuyingChecklist from "@/components/variant/BuyingChecklist";
import EngineCodes from "@/components/variant/EngineCodes";
import MarketIntelligence from "@/components/variant/MarketIntelligence";
import FAQAccordion from "@/components/variant/FAQAccordion";
import TrustCta from "@/components/variant/TrustCta";

async function getPageData(dataFile) {
  try {
    const data = await import(`@/data/variants/${dataFile}.json`);
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
    alternates: meta.canonical
      ? { canonical: meta.canonical }
      : undefined,
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

export default async function VariantPage({ params }) {
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
      <VariantHero data={data.hero} />
      <EraMap data={data.eraMap} />
      <ReplacementCosts data={data.replacementCosts} />
      <CommonProblems data={data.commonProblems} />
      <QuotesCta data={data.quotesCta} />
      <RepairBuyOrReplace data={data.repairBuyOrReplace} />
      <BuyingChecklist data={data.buyingChecklist} />
      <EngineCodes data={data.engineCodes} />
      <MarketIntelligence data={data.marketIntelligence} />
      <FAQAccordion data={data.faq} />
      <TrustCta data={data.trustCta} />
    </main>
  );
}
