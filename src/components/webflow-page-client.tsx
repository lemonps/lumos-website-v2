"use client";

import dynamic from "next/dynamic";
import type { ParsedHtmlDocument } from "@/lib/webflow-site";

const WebflowPage = dynamic(
  () => import("@/components/webflow-page").then((module) => module.WebflowPage),
  { ssr: false },
);

type WebflowPageClientProps = {
  document: ParsedHtmlDocument;
};

export function WebflowPageClient({ document }: WebflowPageClientProps) {
  return <WebflowPage document={document} />;
}
