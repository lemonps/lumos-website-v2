import type { Metadata } from "next";
import {
  getDocumentForSegments,
  getMetadataForSegments,
} from "@/lib/webflow-site";
import { WebflowPageClient } from "@/components/webflow-page-client";

export const metadata: Metadata = getMetadataForSegments([]);

export default function HomePage() {
  const document = getDocumentForSegments([]);

  if (!document) {
    throw new Error("Missing site-export/index.html");
  }

  return <WebflowPageClient document={document} />;
}
