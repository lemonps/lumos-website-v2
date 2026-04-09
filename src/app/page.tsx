import type { Metadata } from "next";
import { WebflowPage } from "@/components/webflow-page";
import {
  getDocumentForSegments,
  getMetadataForSegments,
} from "@/lib/webflow-site";

export const metadata: Metadata = getMetadataForSegments([]);

export default function HomePage() {
  const document = getDocumentForSegments([]);

  if (!document) {
    throw new Error("Missing site-export/index.html");
  }

  return <WebflowPage document={document} />;
}
