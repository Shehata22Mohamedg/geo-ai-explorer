import { slidesA } from "./slides-a";
import { slidesB } from "./slides-b";
import { slidesC } from "./slides-c";
import { slidesD } from "./slides-d";
import { modules, breaks } from "./modules";
import type { Slide, Module } from "./types";

export const slides: Slide[] = [...slidesA, ...slidesB, ...slidesC, ...slidesD];

export { modules, breaks };
export type { Slide, Module };

export function firstSlideOfModule(moduleIndex: number) {
  const i = slides.findIndex((s) => s.module === moduleIndex);
  return i < 0 ? 0 : i;
}

export function moduleOf(index: number) {
  const m = slides[index]?.module ?? 0;
  return modules.find((mod) => mod.index === m) ?? modules[0];
}

export function slideCountOfModule(moduleIndex: number) {
  return slides.filter((s) => s.module === moduleIndex).length;
}
