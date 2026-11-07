import type { Metadata } from "next";
import ToolPage from "@/components/tools/ToolPage";
import Tool from "@/components/tools/SubnetTool";
import { toolBySlug } from "@/lib/tools";

const meta = toolBySlug("subnet");

export const metadata: Metadata = {
  title: `${meta.title} | DIOBO.IT`,
  description: meta.description,
  keywords: meta.keywords,
  alternates: { canonical: `https://www.diobo.it/strumenti/${meta.slug}` },
  openGraph: { title: meta.title, description: meta.description, url: `https://www.diobo.it/strumenti/${meta.slug}`, type: "website", locale: "it_IT" },
};

export default function Page() {
  return <ToolPage meta={meta}><Tool /></ToolPage>;
}
