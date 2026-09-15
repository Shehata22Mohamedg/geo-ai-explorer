import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { DeckApp } from "@/components/deck/DeckApp";

export const Route = createFileRoute("/")({
  validateSearch: z.object({
    slide: z.coerce.number().int().positive().optional().catch(undefined),
    print: z.string().optional().catch(undefined),
  }),
  head: () => ({
    meta: [
      { title: "AI in Mineral Exploration Workshop & Guide" },
      { name: "description", content: "A five-hour interactive AI and machine learning workshop with practical animated workflows for geology and geophysics beginners." },
      { property: "og:title", content: "A Geologist's Guide to AI & Machine Learning" },
      { property: "og:description", content: "Interactive mineral exploration workshop and beginner reference covering data, modelling, targeting, validation, and practical AI workflows." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const search = Route.useSearch();
  return <DeckApp initialSlide={(search.slide ?? 1) - 1} print={search.print !== undefined} />;
}
