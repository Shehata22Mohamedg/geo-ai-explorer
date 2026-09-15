import { useEffect, useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Workflow } from "@/data/deck/types";
import { accentBg, accentBorder, accentSoft, accentText, Chip, Kicker, Panel } from "../ui";

export function AnimatedWorkflowWidget({ workflow }: { workflow: Workflow | undefined }) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const steps = workflow?.steps ?? [];
  const step = steps[active];

  useEffect(() => {
    if (!playing || steps.length < 2) return;
    const timer = window.setInterval(() => {
      setActive((current) => {
        if (current >= steps.length - 1) {
          setPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, 1800);
    return () => window.clearInterval(timer);
  }, [playing, steps.length]);

  if (!workflow || !step) return <p className="text-inksoft">Workflow details are unavailable.</p>;

  const restart = () => {
    setActive(0);
    setPlaying(true);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_430px]">
      <Panel label="Animated field-to-decision chain" right={<Chip accent={step.accent}>{active + 1} / {steps.length}</Chip>}>
        <div className="relative pt-3">
          <div className="absolute left-8 right-8 top-[42px] h-1 bg-line" />
          <div
            className="workflow-progress absolute left-8 top-[42px] h-1 bg-oxy"
            style={{ width: `${steps.length <= 1 ? 0 : (active / (steps.length - 1)) * 88}%` }}
          />
          <div className="relative grid grid-cols-7 gap-2">
            {steps.map((item, index) => {
              const reached = index <= active;
              const current = index === active;
              return (
                <button
                  type="button"
                  key={`${item.phase}-${item.title}`}
                  onClick={() => { setActive(index); setPlaying(false); }}
                  className="group min-w-0 text-center"
                  aria-label={`Open workflow step ${index + 1}: ${item.title}`}
                >
                  <span className={`mx-auto grid size-16 place-items-center rounded-full border-4 font-mono text-lg font-bold transition-[transform,background-color,color] ${reached ? `${accentBg[item.accent]} border-card text-card` : "border-line bg-card text-inksoft"} ${current ? "workflow-current scale-110" : ""}`}>
                    {reached && index < active ? <CheckCircle2 className="size-7" /> : index + 1}
                  </span>
                  <span className={`mt-3 block text-[13px] font-semibold leading-tight ${current ? accentText[item.accent] : "text-inksoft"}`}>{item.phase}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div key={active} className={`stratum-in mt-7 rounded-lg border-l-8 p-6 ${accentBorder[step.accent]} ${accentSoft[step.accent]}`}>
          <Kicker>{step.phase} · step {active + 1}</Kicker>
          <h2 className="mt-2 font-slab text-3xl font-semibold text-ink">{step.title}</h2>
          <p className="mt-3 text-lg leading-relaxed text-inksoft">{step.detail}</p>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="flex gap-2">
            <Button size="icon" variant="outline" aria-label="Restart workflow" onClick={restart}><RotateCcw /></Button>
            <Button size="icon" variant="outline" aria-label="Previous workflow step" disabled={active === 0} onClick={() => { setPlaying(false); setActive((value) => Math.max(0, value - 1)); }}><ChevronLeft /></Button>
            <Button size="icon" variant="outline" aria-label="Next workflow step" disabled={active === steps.length - 1} onClick={() => { setPlaying(false); setActive((value) => Math.min(steps.length - 1, value + 1)); }}><ChevronRight /></Button>
          </div>
          <Button className="min-w-36" onClick={() => setPlaying((value) => !value)}>{playing ? <Pause /> : <Play />}{playing ? "Pause" : active === steps.length - 1 ? "Replay" : "Play workflow"}</Button>
        </div>
      </Panel>

      <div className="space-y-4">
        <Panel label="Geological question"><p className="text-xl font-semibold leading-snug text-ink">{workflow.question}</p></Panel>
        <Panel label="Human validation" className="border-l-4 border-ochre"><p className="text-inksoft">{step.check}</p></Panel>
        <Panel label="Deliverable now produced"><p className={`font-semibold ${accentText[step.accent]}`}>{step.output}</p></Panel>
        <Panel label="Decision enabled" className="border-l-4 border-moss"><p className="text-ink">{workflow.decision}</p></Panel>
      </div>
    </div>
  );
}