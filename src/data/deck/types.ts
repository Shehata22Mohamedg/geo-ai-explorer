export type WidgetKey =
  | "poll"
  | "quiz"
  | "ml-vs-rules"
  | "data-shapes"
  | "clean-data"
  | "feature-builder"
  | "decision-tree"
  | "overfit"
  | "kmeans"
  | "anomaly-scatter"
  | "confusion"
  | "threshold-map"
  | "feature-importance"
  | "rank-targets"
  | "bias-spotter"
  | "workflow-chain"
  | "core-logging-cv"
  | "animated-workflow"
  | "glossary";

export type AccentKey = "oxy" | "ochre" | "moss" | "slate";

export type Pin = {
  x: number;
  y: number;
  label: string;
  text: string;
  accent: AccentKey;
};

export type Figure = {
  image: "prospectivity" | "core" | "alteration" | "magnetics";
  caption: string;
  scale?: string;
  pins?: Pin[];
};

export type QuizOption = { text: string; correct?: boolean; why?: string };
export type QuizQuestion = { prompt: string; options: QuizOption[] };

export type WorkflowStep = {
  phase: string;
  title: string;
  detail: string;
  check: string;
  output: string;
  accent: AccentKey;
};

export type Workflow = {
  question: string;
  decision: string;
  steps: WorkflowStep[];
};

export type Slide = {
  id: string;
  module: number;
  layout:
    | "title"
    | "divider"
    | "split"
    | "cards"
    | "steps"
    | "table"
    | "compare"
    | "widget"
    | "quote";
  title: string;
  kicker?: string;
  lead?: string;
  bullets?: { label?: string; title?: string; text: string }[];
  stats?: { value: string; label: string }[];
  note?: string;
  figure?: Figure;
  cards?: { tag?: string; title: string; text: string; accent?: AccentKey }[];
  steps?: { title: string; text: string; accent?: AccentKey }[];
  table?: { head: string[]; rows: string[][] };
  compare?: {
    leftTitle: string;
    left: string[];
    rightTitle: string;
    right: string[];
  };
  widget?: WidgetKey;
  quiz?: QuizQuestion[];
  quote?: string;
  attribution?: string;
  takeaway?: string;
  objectives?: string[];
  vocab?: { term: string; meaning: string }[];
  activityLabel?: string;
  workflow?: Workflow;
};

export type Module = {
  index: number;
  code: string;
  title: string;
  subtitle: string;
  time: string;
  minutes: number;
  accent: AccentKey;
  act: string;
};
