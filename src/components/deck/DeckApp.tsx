import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Grid2X2, List, Menu, Minimize, Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { firstSlideOfModule, modules, moduleOf, slides } from "@/data/deck";
import { SlideRenderer } from "./SlideRenderer";

const WIDTH = 1920;
const HEIGHT = 1080;

export function DeckApp({ initialSlide = 0, print = false }: { initialSlide?: number; print?: boolean }) {
  const [index, setIndex] = useState(Math.max(0, Math.min(slides.length - 1, initialSlide)));
  const [agendaOpen, setAgendaOpen] = useState(false);
  const [overview, setOverview] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [scale, setScale] = useState(1);
  const stageRef = useRef<HTMLDivElement>(null);
  const current = slides[index];
  const module = moduleOf(index);

  const go = useCallback((next: number, push = true) => {
    const safe = Math.max(0, Math.min(slides.length - 1, next));
    setIndex(safe);
    setOverview(false);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("slide", String(safe + 1));
      if (push) window.history.pushState({ slide: safe }, "", url);
      else window.history.replaceState({ slide: safe }, "", url);
    }
  }, []);

  useEffect(() => {
    if (print) return;
    const updateScale = () => {
      const box = stageRef.current?.getBoundingClientRect();
      if (box) setScale(Math.min(box.width / WIDTH, box.height / HEIGHT));
    };
    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (stageRef.current) observer.observe(stageRef.current);
    return () => observer.disconnect();
  }, [print]);

  useEffect(() => {
    if (print) return;
    document.title = `${index + 1}/${slides.length} — ${current?.title ?? "Workshop"}`;
    const onPop = () => {
      const value = Number(new URL(window.location.href).searchParams.get("slide") ?? 1);
      setIndex(Math.max(0, Math.min(slides.length - 1, value - 1)));
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [current?.title, index, print]);

  useEffect(() => {
    if (print) return;
    const onKey = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (["ArrowRight", "PageDown", " "].includes(event.key)) { event.preventDefault(); go(index + 1); }
      if (["ArrowLeft", "PageUp"].includes(event.key)) { event.preventDefault(); go(index - 1); }
      if (event.key === "Home") go(0);
      if (event.key === "End") go(slides.length - 1);
      if (event.key.toLowerCase() === "g") setOverview((v) => !v);
      if (event.key === "F5") { event.preventDefault(); void toggleFullscreen(); }
      if (event.key === "Escape") { setOverview(false); setAgendaOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index, print]);

  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  };

  if (print) return <div className="print-deck">{slides.map((slide, i) => <div key={slide.id} className="print-slide"><SlideRenderer slide={slide} number={i + 1} total={slides.length} /></div>)}</div>;
  if (!current || !module) return null;

  return (
    <TooltipProvider delayDuration={250}>
      <div className={`deck-app ${fullscreen ? "is-presenting" : ""}`}>
        <header className="deck-topbar">
          <div className="flex min-w-0 items-center gap-3">
            <Sheet open={agendaOpen} onOpenChange={setAgendaOpen}>
              <Tooltip><TooltipTrigger asChild><SheetTrigger asChild><Button variant="ghost" size="icon" aria-label="Open workshop agenda"><Menu /></Button></SheetTrigger></TooltipTrigger><TooltipContent>Workshop agenda</TooltipContent></Tooltip>
              <SheetContent side="top" className="max-h-[86vh] overflow-y-auto border-line bg-card px-6 pb-8 pt-6">
                <SheetHeader className="mx-auto max-w-6xl"><SheetTitle className="font-slab text-3xl text-ink">Workshop agenda</SheetTitle><SheetDescription>Jump to a module or any slide.</SheetDescription></SheetHeader>
                <div className="mx-auto mt-6 grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">{modules.map((item) => <section key={item.index}><button type="button" onClick={() => { go(firstSlideOfModule(item.index)); setAgendaOpen(false); }} className={`w-full rounded-md border p-4 text-left ${item.index === module.index ? "border-oxy bg-oxy/10" : "border-line bg-paper"}`}><span className="font-mono text-xs text-oxy">MODULE {item.code} · {item.time}</span><strong className="mt-1 block text-lg text-ink">{item.title}</strong></button><ol className="mt-2 space-y-1">{slides.map((slide, i) => ({slide,i})).filter(({slide}) => slide.module === item.index).map(({slide,i}) => <li key={slide.id}><button type="button" onClick={() => { go(i); setAgendaOpen(false); }} className={`w-full truncate rounded px-3 py-2 text-left text-sm ${i === index ? "bg-ink text-paper" : "text-inksoft hover:bg-paper"}`}>{String(i + 1).padStart(2,"0")} · {slide.title}</button></li>)}</ol></section>)}</div>
              </SheetContent>
            </Sheet>
            <button type="button" onClick={() => setAgendaOpen(true)} className="min-w-0 text-left"><span className="block font-mono text-[10px] uppercase text-inksoft">Module {module.code} · {module.act}</span><strong className="block truncate text-sm text-ink">{module.title}</strong></button>
          </div>
          <div className="hidden min-w-0 flex-1 items-center gap-3 px-8 md:flex"><span className="truncate text-xs text-inksoft">{current.title}</span><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line"><div className="h-full bg-oxy transition-[width]" style={{ width: `${((index + 1) / slides.length) * 100}%` }} /></div><span className="font-mono text-xs text-inksoft">{index + 1}/{slides.length}</span></div>
          <div className="flex items-center gap-1">
            <a href="https://shehata-mekawy-portfolio.vercel.app/" target="_blank" rel="noreferrer" aria-label="Open Shehata Mekawy portfolio" className="flex items-center gap-2 rounded-md px-2 py-2 text-xs text-inksoft transition-colors hover:bg-paper hover:text-ink">
              <ExternalLink className="size-4" />
              <span className="hidden sm:inline">Shehata Mekawy</span>
            </a>
            <TopButton label="Overview (G)" onClick={() => setOverview(true)} icon={<Grid2X2 />} />
            <TopButton label={fullscreen ? "Exit fullscreen" : "Present (F5)"} onClick={() => void toggleFullscreen()} icon={fullscreen ? <Minimize /> : <Presentation />} />
            <span className="mx-2 h-6 w-px bg-line" />
            <TopButton label="Previous slide" disabled={index === 0} onClick={() => go(index - 1)} icon={<ChevronLeft />} />
            <TopButton label="Next slide" disabled={index === slides.length - 1} onClick={() => go(index + 1)} icon={<ChevronRight />} />
          </div>
        </header>
        <div ref={stageRef} className="deck-stage"><div className="slide-wrapper" style={{ "--scale": scale } as CSSProperties}><SlideRenderer key={current.id} slide={current} number={index + 1} total={slides.length} /></div></div>
        {overview && <div className="fixed inset-0 z-40 overflow-y-auto bg-ink/95 p-6 pt-24"><div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{slides.map((slide,i) => <button key={slide.id} type="button" onClick={() => go(i)} className={`group text-left ${i === index ? "ring-4 ring-ochre" : ""}`}><div className="aspect-video overflow-hidden bg-paper p-4 text-ink"><span className="font-mono text-xs text-oxy">{String(i+1).padStart(2,"0")} · M{slide.module}</span><strong className="mt-3 block font-slab text-xl leading-tight">{slide.title}</strong></div></button>)}</div><Button size="icon" variant="secondary" aria-label="Close overview" className="fixed right-6 top-20" onClick={() => setOverview(false)}><List /></Button></div>}
      </div>
    </TooltipProvider>
  );
}

function TopButton({ label, onClick, icon, disabled }: { label: string; onClick: () => void; icon: ReactNode; disabled?: boolean }) { return <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" aria-label={label} onClick={onClick} disabled={disabled}>{icon}</Button></TooltipTrigger><TooltipContent>{label}</TooltipContent></Tooltip>; }