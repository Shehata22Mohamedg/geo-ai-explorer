import { useState } from "react";
import { X } from "lucide-react";
import alteration from "@/assets/alteration-remote-sensing.jpg";
import core from "@/assets/core-trays.jpg";
import magnetics from "@/assets/magnetics-map.jpg";
import machineLearningTechniques from "@/assets/Machine-Learning-Techniques.webp";
import prospectivity from "@/assets/prospectivity-map.jpg";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Figure as FigureData } from "@/data/deck/types";
import { accentBg } from "./ui";

const images = { alteration, core, magnetics, prospectivity, "machine-learning-techniques": machineLearningTechniques };

export function GeologicalFigure({ figure }: { figure: FigureData }) {
  const [active, setActive] = useState<number | null>(null);
  const pin = active === null ? undefined : figure.pins?.[active];
  return (
    <figure className="relative overflow-hidden rounded-lg bg-ink">
      <Dialog>
        <DialogTrigger asChild>
          <button type="button" className="block w-full cursor-zoom-in text-left" aria-label={`Open full-screen image: ${figure.caption}`}>
            <img src={images[figure.image]} alt={figure.caption} className="h-[490px] w-full object-cover" />
          </button>
        </DialogTrigger>
        <DialogContent className="h-[96vh] w-[96vw] max-w-none border-0 bg-ink/95 p-5 sm:rounded-lg">
          <DialogTitle className="sr-only">Full-screen image: {figure.caption}</DialogTitle>
          <img src={images[figure.image]} alt={figure.caption} className="h-full w-full object-contain" />
        </DialogContent>
      </Dialog>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
      {figure.pins?.map((item, index) => (
        <Button key={`${item.label}-${index}`} size="icon" aria-label={`Open annotation ${item.label}`} onClick={() => setActive(index)} className={`pin-pulse absolute size-12 rounded-full border-4 border-card font-mono text-lg ${accentBg[item.accent]}`} style={{ left: `${item.x}%`, top: `${item.y}%` }}>{item.label}</Button>
      ))}
      {pin && <div className="absolute right-6 top-6 max-w-md rounded-lg bg-card p-5 text-ink shadow-xl"><Button variant="ghost" size="icon" aria-label="Close annotation" className="absolute right-2 top-2" onClick={() => setActive(null)}><X /></Button><strong className="font-mono text-oxy">Point {pin.label}</strong><p className="mt-2 pr-8 text-lg leading-snug">{pin.text}</p></div>}
      <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 text-card"><span className="slide-caption max-w-3xl">{figure.caption}</span>{figure.scale && <span className="slide-chrome shrink-0 rounded bg-ink/80 px-4 py-2 font-mono">{figure.scale}</span>}</figcaption>
    </figure>
  );
}