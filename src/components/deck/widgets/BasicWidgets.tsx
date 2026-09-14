import { useState } from "react";
import type { QuizQuestion } from "@/data/deck/types";
import { Bar, Btn, Chip, Kicker, Panel, Reveal } from "../ui";

/* ------------------------------------------------ POLL */
const pollQuestions = [
  {
    q: "Have you written any code — any language, any amount?",
    options: ["Never", "A little (a class or a tutorial)", "Yes, regularly"],
  },
  {
    q: "Have you used GIS software (QGIS / ArcGIS) on your own project?",
    options: ["No", "Once or twice", "Comfortably"],
  },
  {
    q: "Have you ever trained a machine-learning model?",
    options: ["No", "Watched someone do it", "Yes"],
  },
  {
    q: "How do you feel about AI entering exploration geology?",
    options: ["Worried it replaces me", "Curious, unconvinced", "Keen to use it"],
  },
];

export function PollWidget() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const done = Object.keys(answers).length === pollQuestions.length;
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {pollQuestions.map((p, qi) => (
        <Panel key={qi} label={`Question ${qi + 1}`}>
          <p className="mb-3 text-[15px] font-semibold text-ink">{p.q}</p>
          <div className="flex flex-wrap gap-2">
            {p.options.map((o, oi) => (
              <Btn
                key={oi}
                active={answers[qi] === oi}
                onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
              >
                {o}
              </Btn>
            ))}
          </div>
        </Panel>
      ))}
      <Reveal show={done}>
        <div className="rounded-xl bg-ink p-4 text-paper md:col-span-2">
          <Kicker>
            <span className="text-ochre">Instructor note</span>
          </Kicker>
          <p className="mt-2 text-sm text-paper/85">
            Whatever the room answered, the technical bar for today is unchanged: read and interpret,
            never write. And remember who we surveyed — a room of geologists. We will come back to
            that in Module 07.
          </p>
        </div>
      </Reveal>
    </div>
  );
}

/* ------------------------------------------------ QUIZ */
export function QuizWidget({ questions }: { questions?: QuizQuestion[] }) {
  const qs = questions ?? [];
  const [picked, setPicked] = useState<Record<number, number>>({});
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {qs.map((q, qi) => {
        const choice = picked[qi];
        return (
          <Panel key={qi} label={`Q${qi + 1}`}>
            <p className="mb-3 text-[15px] font-semibold leading-snug text-ink">{q.prompt}</p>
            <div className="space-y-2">
              {q.options.map((o, oi) => {
                const chosen = choice === oi;
                const state =
                  choice === undefined
                    ? "border-line bg-card hover:bg-paper"
                    : o.correct
                      ? "border-moss/50 bg-moss/10"
                      : chosen
                        ? "border-oxy/50 bg-oxy/10"
                        : "border-line bg-card opacity-60";
                return (
                  <button
                    key={oi}
                    type="button"
                    onClick={() => setPicked((p) => ({ ...p, [qi]: oi }))}
                    className={`w-full rounded-lg border px-3 py-2 text-left text-[13px] leading-snug transition-colors ${state}`}
                  >
                    <span className="font-semibold text-ink">{o.text}</span>
                    {choice !== undefined && o.why && (
                      <span className="mt-1 block text-inksoft">{o.why}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </Panel>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------ RULES vs ML */
const intervals = [
  { id: "A", cu: 0.42, s: 2.1, mag: 0.004, veins: 12, truth: "Ore" },
  { id: "B", cu: 0.11, s: 0.4, mag: 0.031, veins: 2, truth: "Waste" },
  { id: "C", cu: 0.18, s: 1.9, mag: 0.002, veins: 9, truth: "Ore" },
  { id: "D", cu: 0.55, s: 0.2, mag: 0.028, veins: 1, truth: "Waste" },
  { id: "E", cu: 0.09, s: 1.4, mag: 0.003, veins: 14, truth: "Ore" },
];

export function MlVsRulesWidget() {
  const [mode, setMode] = useState<"rule" | "ml">("rule");
  const predict = (i: (typeof intervals)[number]) =>
    mode === "rule"
      ? i.cu > 0.2
        ? "Ore"
        : "Waste"
      : i.s > 1.0 && i.mag < 0.01 && i.veins > 5
        ? "Ore"
        : "Waste";
  const correct = intervals.filter((i) => predict(i) === i.truth).length;
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <Panel
        label="Five drill intervals · predicted vs logged"
        right={
          <div className="flex gap-2">
            <Btn tone="oxy" active={mode === "rule"} onClick={() => setMode("rule")}>
              Hand-written rule
            </Btn>
            <Btn tone="oxy" active={mode === "ml"} onClick={() => setMode("ml")}>
              Learned model
            </Btn>
          </div>
        }
      >
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-line text-left font-mono text-[10px] uppercase tracking-wider text-inksoft">
              <th className="py-2">Int.</th>
              <th className="py-2">Cu %</th>
              <th className="py-2">S %</th>
              <th className="py-2">Mag SI</th>
              <th className="py-2">Veins/m</th>
              <th className="py-2">Predicted</th>
              <th className="py-2">Logged</th>
            </tr>
          </thead>
          <tbody>
            {intervals.map((i) => {
              const p = predict(i);
              const ok = p === i.truth;
              return (
                <tr key={i.id} className="border-b border-line/60">
                  <td className="py-2 font-mono font-bold">{i.id}</td>
                  <td className="py-2 font-mono">{i.cu.toFixed(2)}</td>
                  <td className="py-2 font-mono">{i.s.toFixed(1)}</td>
                  <td className="py-2 font-mono">{i.mag.toFixed(3)}</td>
                  <td className="py-2 font-mono">{i.veins}</td>
                  <td className={`py-2 font-semibold ${ok ? "text-moss" : "text-oxy"}`}>
                    {p} {ok ? "✓" : "✗"}
                  </td>
                  <td className="py-2 text-inksoft">{i.truth}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Panel>
      <div className="space-y-3">
        <Panel label="Score">
          <p className="font-disp text-4xl font-semibold text-ink">{correct}/5</p>
          <p className="mt-1 text-[13px] text-inksoft">intervals classified correctly</p>
        </Panel>
        <Panel label={mode === "rule" ? "The rule a geologist wrote" : "What the model learned"}>
          {mode === "rule" ? (
            <>
              <code className="block rounded bg-ink/5 p-2 font-mono text-[12px] text-ink">
                if Cu &gt; 0.20 % → Ore
              </code>
              <p className="mt-2 text-[13px] leading-snug text-inksoft">
                Transparent, instantly auditable — and blind to the low-grade sulphide-rich intervals
                and to the barren high-Cu malachite staining in D.
              </p>
            </>
          ) : (
            <>
              <code className="block rounded bg-ink/5 p-2 font-mono text-[12px] text-ink">
                if S &gt; 1.0 % and mag &lt; 0.010 SI and veins &gt; 5 → Ore
              </code>
              <p className="mt-2 text-[13px] leading-snug text-inksoft">
                Nobody wrote this. It emerged from labelled examples and encodes real porphyry
                physics: sulphidation plus magnetite destruction plus vein density.
              </p>
            </>
          )}
        </Panel>
        <Panel label="The catch">
          <p className="text-[13px] leading-snug text-inksoft">
            The learned rule works here because these five intervals resemble its training data. In a
            magnetite-rich skarn it would fail silently — and still report a confident answer.
          </p>
        </Panel>
      </div>
    </div>
  );
}

/* ------------------------------------------------ DATA SHAPES */
const shapes = [
  {
    key: "Tabular",
    accent: "oxy" as const,
    examples: "Assay tables, collar surveys, geochemistry, petrophysics, QA/QC records",
    methods: "Decision trees, random forest, gradient boosting, logistic regression, PCA",
    trap: "Rows are not independent — samples metres apart leak into one another",
    note: "The most common shape in exploration, and the one where boosted trees still beat deep learning.",
  },
  {
    key: "Spatial",
    accent: "moss" as const,
    examples: "Geological polygons, magnetic and gravity grids, DEMs, structural lines, 3D block models",
    methods: "Convolutional nets on grids, kriging and geostatistics, spatial random forests",
    trap: "Coordinates as features let a model memorise location instead of learning geology",
    note: "Everything here has autocorrelation, anisotropy and a support. None of those are optional.",
  },
  {
    key: "Image",
    accent: "ochre" as const,
    examples: "Core photos, thin sections, satellite scenes, hyperspectral scans, SEM maps",
    methods: "CNNs, segmentation networks (U-Net), vision transformers, spectral unmixing",
    trap: "Lighting, wet vs dry core and missing scale cards become features the model learns",
    note: "Where deep learning genuinely dominates — and where labels are expensive to make.",
  },
  {
    key: "Text",
    accent: "slate" as const,
    examples: "Geological logs, historical reports, drilling notes, company announcements",
    methods: "Named-entity extraction, text classification, embeddings, large language models",
    trap: "Vocabulary drifts between loggers, companies and decades — 'sericite' vs 'phyllic'",
    note: "The largest untapped archive in exploration: decades of scanned reports nobody has read.",
  },
];

export function DataShapesWidget() {
  const [active, setActive] = useState(0);
  const s = shapes[active] ?? shapes[0];
  if (!s) return null;
  return (
    <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
      <div className="space-y-2">
        {shapes.map((sh, i) => (
          <button
            key={sh.key}
            type="button"
            onClick={() => setActive(i)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors ${
              i === active ? "bg-ink text-paper" : "bg-paper/70 text-ink ring-1 ring-black/5"
            }`}
          >
            <span className="font-mono text-[11px] font-bold">{String(i + 1).padStart(2, "0")}</span>
            <span className="text-sm font-semibold">{sh.key}</span>
          </button>
        ))}
      </div>
      <Panel label={`${s.key} data`} right={<Chip accent={s.accent}>{s.key}</Chip>}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Kicker>Examples in exploration</Kicker>
            <p className="mt-1 text-[14px] leading-snug text-ink">{s.examples}</p>
          </div>
          <div>
            <Kicker>Methods that suit it</Kicker>
            <p className="mt-1 text-[14px] leading-snug text-ink">{s.methods}</p>
          </div>
          <div>
            <Kicker>The failure mode it brings</Kicker>
            <p className="mt-1 text-[14px] leading-snug text-oxy">{s.trap}</p>
          </div>
          <div>
            <Kicker>Why it matters</Kicker>
            <p className="mt-1 text-[14px] leading-snug text-inksoft">{s.note}</p>
          </div>
        </div>
      </Panel>
    </div>
  );
}

/* ------------------------------------------------ CLEAN DATA */
type Cell = { v: string; bad?: string };
const header = ["Hole", "From", "To", "Cu %", "Au g/t", "Lith", "Lab"];
const rows: Cell[][] = [
  [{ v: "SOL001" }, { v: "112.0" }, { v: "114.0" }, { v: "0.31" }, { v: "0.12" }, { v: "DIOR" }, { v: "LabA" }],
  [
    { v: "SOL001" },
    { v: "114.0" },
    { v: "116.0" },
    { v: "0.00", bad: "Below detection coded as 0 — destroys every ratio and invents a hard boundary" },
    { v: "0.09" },
    { v: "DIOR" },
    { v: "LabA" },
  ],
  [
    { v: "SOL001" },
    { v: "116.0" },
    { v: "115.0", bad: "'To' is shallower than 'From' — an impossible interval, almost certainly a typo" },
    { v: "0.44" },
    { v: "0.15" },
    { v: "diorite", bad: "Same lithology, different vocabulary — the model will treat DIOR and 'diorite' as two rock types" },
    { v: "LabA" },
  ],
  [
    { v: "SOL002" },
    { v: "88.0" },
    { v: "90.0" },
    { v: "-9", bad: "Negative grade — a legacy 'no data' sentinel that will be modelled as a real value" },
    { v: "0.02" },
    { v: "GDIO" },
    { v: "LabB" },
  ],
  [
    { v: "SOL002" },
    { v: "90.0" },
    { v: "92.0" },
    { v: "31.5", bad: "31.5 % Cu in a porphyry — a decimal-place or unit error (ppm vs %), not a discovery" },
    { v: "0.03" },
    { v: "GDIO" },
    { v: "LabB" },
  ],
  [
    { v: "SOL002" },
    { v: "92.0" },
    { v: "94.0" },
    { v: "0.28" },
    { v: "", bad: "Missing value with no flag — is it unassayed, lost, or below detection? Nobody can tell" },
    { v: "GDIO" },
    { v: "LabB" },
  ],
  [
    { v: "SOL003" },
    { v: "40.0" },
    { v: "42.0" },
    { v: "0.19" },
    { v: "0.08" },
    { v: "GDIO" },
    { v: "LabC", bad: "Third lab, no umpire re-assays — inter-lab bias will look exactly like a geochemical boundary" },
  ],
];

export function CleanDataWidget() {
  const [found, setFound] = useState<Set<string>>(new Set());
  const total = rows.flat().filter((c) => c.bad).length;
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
      <Panel label="assay_export_2024.csv — click any cell you would refuse">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-line text-left font-mono text-[10px] uppercase tracking-wider text-inksoft">
                {header.map((h) => (
                  <th key={h} className="py-2 pr-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr key={ri} className="border-b border-line/60">
                  {r.map((c, ci) => {
                    const key = `${ri}-${ci}`;
                    const hit = found.has(key);
                    return (
                      <td key={ci} className="py-1 pr-3">
                        <button
                          type="button"
                          onClick={() =>
                            setFound((f) => {
                              const n = new Set(f);
                              n.has(key) ? n.delete(key) : n.add(key);
                              return n;
                            })
                          }
                          className={`w-full rounded px-2 py-1 text-left font-mono transition-colors ${
                            hit
                              ? c.bad
                                ? "bg-oxy/15 font-bold text-oxy"
                                : "bg-line text-inksoft line-through"
                              : "hover:bg-line/60"
                          }`}
                        >
                          {c.v === "" ? "—" : c.v}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
      <div className="space-y-3">
        <Panel label="Problems found">
          <p className="font-disp text-4xl font-semibold text-ink">
            {[...found].filter((k) => {
              const [r, c] = k.split("-").map(Number);
              return r === undefined || c === undefined ? false : Boolean(rows[r]?.[c]?.bad);
            }).length}
            <span className="text-inksoft">/{total}</span>
          </p>
          <p className="mt-1 text-[13px] text-inksoft">
            False positives cost nothing here — but in a real project, deleting good data quietly
            biases everything downstream.
          </p>
        </Panel>
        <div className="space-y-2">
          {[...found]
            .map((k) => {
              const [r, c] = k.split("-").map(Number);
              return r === undefined || c === undefined ? undefined : rows[r]?.[c];
            })
            .filter((c): c is Cell => Boolean(c?.bad))
            .map((c, i) => (
              <div key={i} className="stratum-in rounded-lg bg-oxy/10 p-3 text-[13px] leading-snug">
                <span className="font-mono font-bold text-oxy">{c.v || "—"}</span>{" "}
                <span className="text-inksoft">{c.bad}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------ FEATURE BUILDER */
const featureSet = [
  { key: "cu", label: "Cu (raw ppm)", gain: 0.22, why: "Raw intensity — diluted by cover and regolith" },
  { key: "cumo", label: "Cu/Mo ratio", gain: 0.19, why: "Vectors toward the porphyry centre; survives dilution" },
  { key: "zncu", label: "Zn/Cu ratio", gain: 0.12, why: "Increases outward — gives direction, not just intensity" },
  { key: "ai", label: "Alteration index (K/Al)", gain: 0.14, why: "Quantifies potassic alteration from major elements" },
  { key: "dist", label: "Distance to structure", gain: 0.11, why: "Fluid pathway proxy from the structural interpretation" },
  { key: "clr", label: "CLR log-ratio transform", gain: 0.09, why: "Removes closure artefacts in compositional assay data" },
  { key: "cover", label: "Cover thickness correction", gain: 0.08, why: "Without it the model learns cover, not mineralisation" },
];

export function FeatureBuilderWidget() {
  const [on, setOn] = useState<Set<string>>(new Set(["cu"]));
  const score = 0.5 + [...on].reduce((s, k) => s + (featureSet.find((f) => f.key === k)?.gain ?? 0), 0);
  const capped = Math.min(0.97, score);
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <Panel label="Add features — each one is geological reasoning, written as arithmetic">
        <div className="space-y-2">
          {featureSet.map((f) => {
            const active = on.has(f.key);
            return (
              <button
                key={f.key}
                type="button"
                onClick={() =>
                  setOn((s) => {
                    const n = new Set(s);
                    n.has(f.key) ? n.delete(f.key) : n.add(f.key);
                    return n;
                  })
                }
                className={`flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                  active ? "border-moss/50 bg-moss/10" : "border-line bg-card hover:bg-paper"
                }`}
              >
                <span
                  className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded font-mono text-[11px] font-bold ${
                    active ? "bg-moss text-paper" : "bg-line text-inksoft"
                  }`}
                >
                  {active ? "✓" : "+"}
                </span>
                <span>
                  <span className="block text-[14px] font-semibold text-ink">{f.label}</span>
                  <span className="block text-[12px] leading-snug text-inksoft">{f.why}</span>
                </span>
                <span className="ml-auto font-mono text-[11px] text-inksoft">+{f.gain.toFixed(2)}</span>
              </button>
            );
          })}
        </div>
      </Panel>
      <div className="space-y-3">
        <Panel label="Model separation (AUC, spatially validated)">
          <p className="font-disp text-5xl font-semibold text-ink">{capped.toFixed(2)}</p>
          <div className="mt-3">
            <Bar value={capped} label="Ore vs waste separation" right={`${on.size} features`} />
          </div>
        </Panel>
        <Panel label="What just happened">
          <p className="text-[13px] leading-snug text-inksoft">
            Nothing was added to the ground. The same assays, re-expressed as the quantities a
            geologist reasons with, carry far more signal than raw values alone. This is where your
            expertise enters a model.
          </p>
        </Panel>
        <Panel label="Diminishing returns">
          <p className="text-[13px] leading-snug text-inksoft">
            Notice the gains shrink as features overlap. Twenty correlated features are not better
            than six well-chosen ones — they just make the model harder to explain.
          </p>
        </Panel>
      </div>
    </div>
  );
}
