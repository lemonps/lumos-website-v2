import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WebflowPage } from "@/components/webflow-page";
import {
  getDocumentForSegments,
  getMetadataForSegments,
  getStaticSlugParams,
} from "@/lib/webflow-site";

type CatchAllPageProps = {
  params: Promise<{ slug: string[] }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getStaticSlugParams();
}

export async function generateMetadata({
  params,
}: CatchAllPageProps): Promise<Metadata> {
  const { slug } = await params;
  return getMetadataForSegments(slug);
}

export default async function CatchAllPage({ params }: CatchAllPageProps) {
  const { slug } = await params;
  const document = getDocumentForSegments(slug);

  if (!document) {
    notFound();
  }

  return <WebflowPage document={document} />;
}
