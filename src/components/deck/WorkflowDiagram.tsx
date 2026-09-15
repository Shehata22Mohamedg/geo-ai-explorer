import { ChevronRight, RotateCcw } from "lucide-react";
import type { Diagram } from "@/data/deck/types";
import { accentBorder, accentSoft, accentText } from "./ui";

export function WorkflowDiagram({ diagram }: { diagram: Diagram | undefined }) {
  if (!diagram) return <p className="text-inksoft">Diagram unavailable.</p>;
  return (
    <div className="flex h-full flex-col">
      <p className="slide-caption max-w-[1500px] text-inksoft">{diagram.intro}</p>
      <div className="mt-5 flex min-h-0 flex-1 items-stretch gap-3">
        {diagram.lanes.map((lane, laneIndex) => (
          <div key={lane.label} className="flex min-w-0 flex-1 items-stretch gap-3">
            <section className="flex min-w-0 flex-1 flex-col rounded-lg bg-card p-4 ring-1 ring-line">
              <span className="slide-chrome block border-b border-line pb-2 font-mono uppercase text-oxy">{lane.label}</span>
              <div className="mt-3 flex min-h-0 flex-1 flex-col justify-center gap-4">
                {lane.nodes.map((node) => (
                  <article key={node.title} className={`stratum-in rounded-md border-l-8 p-4 ${accentBorder[node.accent]} ${accentSoft[node.accent]}`}>
                    <h3 className={`slide-caption font-slab font-semibold ${accentText[node.accent]}`}>{node.title}</h3>
                    <p className="slide-chrome mt-1 leading-snug text-inksoft">{node.text}</p>
                  </article>
                ))}
              </div>
            </section>
            {laneIndex < diagram.lanes.length - 1 && (
              <div className="grid shrink-0 place-items-center text-oxy" aria-hidden="true">
                <ChevronRight className="size-10" />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 flex shrink-0 items-center gap-4 rounded-lg border-l-8 border-moss bg-moss/10 px-5 py-3">
        <RotateCcw className="size-7 shrink-0 text-moss" aria-hidden="true" />
        <p className="slide-chrome text-inksoft"><strong className="mr-2 font-mono uppercase text-moss">Feedback loop</strong>{diagram.feedback}</p>
      </div>
    </div>
  );
}
