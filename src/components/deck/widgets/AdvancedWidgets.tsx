import { useMemo, useState } from "react";
import { AlertTriangle, Check, ChevronRight, Eye, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Bar, Chip, Kicker, Panel } from "../ui";

const samples = [
  { id: "SOL-11", cu: 0.08, sulphur: 0.5, mag: 0.032, veins: 1 },
  { id: "SOL-14", cu: 0.17, sulphur: 1.8, mag: 0.006, veins: 9 },
  { id: "SOL-18", cu: 0.46, sulphur: 2.3, mag: 0.004, veins: 14 },
];

export function DecisionTreeWidget() {
  const [sample, setSample] = useState(1);
  const s = samples[sample] ?? { id: "SOL-14", cu: 0.17, sulphur: 1.8, mag: 0.006, veins: 9 };
  const path = s.sulphur > 1 ? (s.mag < 0.01 ? (s.veins > 6 ? "Ore" : "Waste") : "Waste") : "Waste";
  const nodes = [
    { label: "Sulphur > 1.0%?", pass: s.sulphur > 1 },
    { label: "Mag SI < 0.010?", pass: s.mag < 0.01 },
    { label: "Veins > 6/m?", pass: s.veins > 6 },
  ];
  return (
    <div className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
      <Panel label="Choose an interval">
        <div className="space-y-3">
          {samples.map((item, index) => (
            <Button key={item.id} variant={sample === index ? "default" : "outline"} className="h-auto w-full justify-between px-4 py-3" onClick={() => setSample(index)}>
              <span>{item.id}</span><span className="font-mono">Cu {item.cu}%</span>
            </Button>
          ))}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 font-mono text-inksoft">
          <span>S {s.sulphur}%</span><span>Mag {s.mag}</span><span>Veins {s.veins}/m</span><span>Cu {s.cu}%</span>
        </div>
      </Panel>
      <Panel label="Trace the learned logging key" right={<Chip accent={path === "Ore" ? "oxy" : "slate"}>{path}</Chip>}>
        <div className="flex items-stretch gap-3">
          {nodes.map((node, index) => (
            <div key={node.label} className="flex min-w-0 flex-1 items-center gap-3">
              <div className={`flex min-h-36 flex-1 flex-col justify-between rounded-lg border p-5 ${node.pass ? "border-moss/50 bg-moss/10" : "border-oxy/40 bg-oxy/10"}`}>
                <span className="font-mono text-inksoft">Split {index + 1}</span>
                <strong className="text-xl text-ink">{node.label}</strong>
                <span className={node.pass ? "text-moss" : "text-oxy"}>{node.pass ? "Yes — follow right" : "No — stop at waste"}</span>
              </div>
              {index < nodes.length - 1 && <ChevronRight className="size-7 shrink-0 text-inksoft" />}
            </div>
          ))}
        </div>
        <p className="mt-5 text-inksoft">The tree never “understands” alteration. It chooses thresholds that best separate labels in the examples it saw.</p>
      </Panel>
    </div>
  );
}

export function OverfitWidget() {
  const [complexity, setComplexity] = useState([4]);
  const c = complexity[0] ?? 4;
  const train = Math.min(99, 64 + c * 4);
  const test = Math.round(64 + c * 7 - Math.max(0, c - 4) * 12);
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      <Panel label="Decision boundary · synthetic alteration samples">
        <div className="relative h-80 overflow-hidden rounded-lg bg-card ring-1 ring-line">
          <div className={`absolute inset-8 rounded-[45%_55%_38%_62%] border-[5px] border-oxy/70 bg-oxy/10 transition-all ${c > 5 ? "rotate-6 skew-x-6" : ""}`} />
          {Array.from({ length: 42 }, (_, i) => {
            const left = 8 + ((i * 37) % 84);
            const top = 9 + ((i * 53) % 78);
            const ore = ((i * 7) % 10) < 4;
            return <span key={i} className={`absolute size-4 rounded-full ${ore ? "bg-oxy" : "bg-slate"}`} style={{ left: `${left}%`, top: `${top}%`, transform: c > 7 && i % 5 === 0 ? "scale(1.8)" : undefined }} />;
          })}
          {c > 6 && <div className="absolute left-[67%] top-[17%] size-16 rounded-full border-4 border-oxy/70" />}
          {c > 8 && <div className="absolute bottom-[12%] left-[14%] size-12 rounded-full border-4 border-oxy/70" />}
        </div>
      </Panel>
      <div className="space-y-4">
        <Panel label={`Complexity · ${c}/10`}><Slider value={complexity} min={1} max={10} step={1} onValueChange={setComplexity} /></Panel>
        <Panel label="Training holes"><Bar value={train} max={100} label="Accuracy" right={`${train}%`} accent="moss" /></Panel>
        <Panel label="Unseen prospect"><Bar value={Math.max(test, 22)} max={100} label="Accuracy" right={`${Math.max(test, 22)}%`} accent={c > 6 ? "oxy" : "ochre"} /></Panel>
        <p className="rounded-lg bg-ink p-4 text-paper">{c < 3 ? "Too simple: misses the real mineralised pattern." : c < 7 ? "Useful middle: captures signal without chasing every sample." : "Overfit: training improves while new-ground performance collapses."}</p>
      </div>
    </div>
  );
}

export function ConfusionWidget() {
  const [threshold, setThreshold] = useState([55]);
  const t = threshold[0] ?? 55;
  const tp = Math.max(8, Math.round(46 - t * 0.32));
  const fn = 30 - tp;
  const fp = Math.max(3, Math.round(54 - t * 0.55));
  const tn = 70 - fp;
  const precision = tp / (tp + fp);
  const recall = tp / 30;
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      <Panel label="100 candidate targets · 30 truly mineralised">
        <div className="grid grid-cols-[140px_1fr_1fr] gap-3 text-center">
          <span /><Kicker>Actually mineralised</Kicker><Kicker>Actually barren</Kicker>
          <Kicker>Drill</Kicker><MetricBox value={tp} label="True hits" tone="moss" /><MetricBox value={fp} label="Wasted holes" tone="oxy" />
          <Kicker>Pass</Kicker><MetricBox value={fn} label="Missed deposits" tone="ochre" /><MetricBox value={tn} label="Correctly passed" tone="slate" />
        </div>
      </Panel>
      <div className="space-y-4">
        <Panel label={`Decision threshold · ${t}%`}><Slider value={threshold} min={10} max={90} step={5} onValueChange={setThreshold} /></Panel>
        <Panel label="Result"><Bar value={precision} label="Precision · productive holes" right={`${Math.round(precision * 100)}%`} accent="moss" /><div className="mt-4"><Bar value={recall} label="Recall · deposits retained" right={`${Math.round(recall * 100)}%`} accent="ochre" /></div></Panel>
        <p className="text-inksoft">Raise the threshold for an expensive deep hole. Lower it when cheap reconnaissance drilling makes missing a discovery the larger risk.</p>
      </div>
    </div>
  );
}

function MetricBox({ value, label, tone }: { value: number; label: string; tone: "moss" | "oxy" | "ochre" | "slate" }) {
  const styles = { moss: "bg-moss/10 text-moss", oxy: "bg-oxy/10 text-oxy", ochre: "bg-ochre/10 text-ochre", slate: "bg-slate/10 text-slate" };
  return <div className={`rounded-lg p-5 ${styles[tone]}`}><strong className="block font-disp text-4xl">{value}</strong><span>{label}</span></div>;
}

const points = Array.from({ length: 34 }, (_, i) => ({ x: 10 + ((i * 23) % 78), y: 12 + ((i * 41) % 75), cluster: i % 3 }));

export function KMeansWidget() {
  const [step, setStep] = useState(0);
  const labels = ["Raw Cu–Mo–As space", "Place three trial centres", "Assign nearest samples", "Move centres and repeat"];
  const label = labels[step] ?? "Raw Cu–Mo–As space";
  return <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
    <Panel label={label}><Scatter showClusters={step >= 2} showCentres={step >= 1} /></Panel>
    <div className="space-y-3"><Panel label="k-means · four steps"><p className="font-disp text-5xl text-ink">{step + 1}/4</p><p className="mt-2 text-inksoft">{label}</p><Button className="mt-5 w-full" onClick={() => setStep((step + 1) % 4)}>{step === 3 ? "Start again" : "Next step"}</Button></Panel><Panel label="Geologist's interpretation"><p className="text-inksoft">Clusters may represent host lithology, regolith domains, alteration—or merely lab batches. Map them before naming them.</p></Panel></div>
  </div>;
}

function Scatter({ showClusters, showCentres = false, anomalies = false }: { showClusters: boolean; showCentres?: boolean; anomalies?: boolean }) {
  const tones = ["bg-oxy", "bg-moss", "bg-slate"];
  return <div className="relative h-80 rounded-lg bg-card ring-1 ring-line"><span className="absolute bottom-3 left-1/2 font-mono text-inksoft">Cu/Mo →</span><span className="absolute left-3 top-1/2 -rotate-90 font-mono text-inksoft">As/Sb →</span>{points.map((p, i) => <span key={i} className={`absolute size-4 rounded-full ${anomalies && i % 11 === 0 ? "bg-ochre ring-4 ring-ochre/30" : showClusters ? tones[p.cluster] : "bg-inksoft"}`} style={{ left: `${p.x}%`, top: `${p.y}%` }} />)}{showCentres && [0, 1, 2].map((i) => <span key={i} className={`absolute grid size-10 place-items-center rounded-full font-bold text-paper ${tones[i]}`} style={{ left: `${24 + i * 24}%`, top: `${28 + (i % 2) * 24}%` }}>×</span>)}</div>;
}

export function AnomalyScatterWidget() {
  const [multi, setMulti] = useState(false);
  return <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]"><Panel label={multi ? "Multivariate distance" : "Single-element threshold"}><Scatter showClusters={false} anomalies={multi} /></Panel><div className="space-y-4"><Panel label="Detection method"><Button variant={multi ? "outline" : "default"} className="mr-2" onClick={() => setMulti(false)}>Cu only</Button><Button variant={multi ? "default" : "outline"} onClick={() => setMulti(true)}>Cu + Mo + As</Button></Panel><Panel label="Reading"><p className="text-inksoft">{multi ? "Highlighted samples are ordinary in any one element, but unusual as a combined geochemical signature." : "A Cu cut finds only the far-right tail and misses subtle pathfinder combinations."}</p></Panel></div></div>;
}

const importance = [
  ["Cu/Mo ratio", 92, "moss"], ["Magnetic destruction", 81, "slate"], ["Fault intersection", 68, "ochre"], ["Distance to road", 54, "oxy"], ["Cover thickness", 39, "slate"],
] as const;

export function FeatureImportanceWidget() {
  const [inspected, setInspected] = useState(false);
  return <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px]"><Panel label="What drove the target score?">{importance.map(([label, value, tone]) => <div className="mb-5" key={label}><Bar value={value} max={100} label={label} right={`${value}`} accent={tone} /></div>)}</Panel><Panel label="The testimony"><Button variant={inspected ? "outline" : "default"} className="w-full" onClick={() => setInspected(true)}><Eye />Interrogate the ranking</Button><div className="mt-5 space-y-3 text-inksoft"><p>Cu/Mo and magnetic destruction fit the porphyry model.</p>{inspected && <p className="rounded-lg bg-oxy/10 p-4 text-oxy"><AlertTriangle className="mr-2 inline size-5" />Distance to road is predictive but not geological. Remove it and retrain.</p>}</div></Panel></div>;
}

const chain = [
  { name: "Remote sensing", data: "Satellite spectra + DEM", method: "Classification", output: "Alteration map", check: "Walk and spectrally verify" },
  { name: "Geochemistry", data: "50-element assays", method: "Clustering + anomaly", output: "Vectors and domains", check: "Regolith + QA/QC" },
  { name: "Geophysics", data: "Mag, gravity, EM, IP", method: "Inversion + segmentation", output: "3D property volumes", check: "Petrophysics + non-uniqueness" },
  { name: "Core & drilling", data: "Photos, scans, logs", method: "Computer vision", output: "Consistent logged intervals", check: "Logger review" },
  { name: "3D modelling", data: "Contacts + assays", method: "Implicit surfaces", output: "Domains + uncertainty", check: "Cross-sections + geology" },
  { name: "Targeting", data: "All evidence layers", method: "Ranking", output: "Prioritised collars", check: "System model + drillability" },
];

export function WorkflowChainWidget() {
  const [active, setActive] = useState(0);
  const item = chain[active] ?? { name: "Remote sensing", data: "Satellite spectra + DEM", method: "Classification", output: "Alteration map", check: "Walk and spectrally verify" };
  const details = [{ label: "Data in", text: item.data }, { label: "Method", text: item.method }, { label: "Output", text: item.output }, { label: "Human check", text: item.check }];
  return <div><div className="grid grid-cols-6 gap-2">{chain.map((stage, i) => <Button key={stage.name} variant={active === i ? "default" : "outline"} className="h-20 whitespace-normal px-2" onClick={() => setActive(i)}>{i + 1}. {stage.name}</Button>)}</div><div className="mt-6 grid grid-cols-4 gap-4">{details.map(({ label: detailLabel, text }, i) => <Panel key={detailLabel} label={detailLabel}><strong className={i === 3 ? "text-oxy" : "text-ink"}>{text}</strong></Panel>)}</div></div>;
}

export function CoreLoggingWidget() {
  const [layer, setLayer] = useState<"photo" | "lith" | "fracture" | "alteration">("photo");
  return <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_370px]"><Panel label="Core tray · SOL-018 · 408–414 m"><div className="relative h-80 overflow-hidden rounded-lg bg-ink/10"><div className="absolute inset-5 grid grid-cols-6 gap-3">{Array.from({ length: 12 }, (_, i) => <div key={i} className={`rounded-full border-4 border-card ${layer === "lith" ? (i < 5 ? "bg-slate" : "bg-ochre") : layer === "alteration" ? (i % 3 ? "bg-moss" : "bg-oxy") : "bg-inksoft"}`} />)}</div>{layer === "fracture" && Array.from({ length: 14 }, (_, i) => <span key={i} className="absolute h-1 w-20 rotate-45 bg-oxy" style={{ left: `${8 + (i * 17) % 82}%`, top: `${12 + (i * 29) % 72}%` }} />)}</div></Panel><div className="space-y-3"><Panel label="Vision layer">{(["photo", "lith", "fracture", "alteration"] as const).map((name) => <Button key={name} variant={layer === name ? "default" : "outline"} className="mb-2 mr-2 capitalize" onClick={() => setLayer(name)}>{name}</Button>)}</Panel><Panel label="Machine output"><p className="text-inksoft">{layer === "photo" ? "Standardised image: colour-balanced, depth marks aligned." : layer === "lith" ? "Diorite → altered intrusive contact at 410.5 m." : layer === "fracture" ? "RQD 71%; 9.4 fractures/m; two dominant orientations." : "Potassic core with patchy phyllic overprint."}</p></Panel></div></div>;
}

const targets = [
  { id: "A", clue: "Known low-grade shell; dense historic drilling", model: 2, outcome: "Known shell only" },
  { id: "B", clue: "Magnetic low-in-high + fault intersection; untested", model: 1, outcome: "Discovery: 180 m at 0.48% Cu" },
  { id: "C", clue: "IP chargeability + Cu anomaly; moderate cover", model: 3, outcome: "Distal pyritic halo" },
  { id: "D", clue: "Strong soil anomaly from one suspect lab batch", model: 4, outcome: "Rejected after QA/QC" },
  { id: "E", clue: "Thick cover; weak inputs; favourable structure", model: 5, outcome: "Deferred—not enough information" },
];

export function RankTargetsWidget() {
  const [ranking, setRanking] = useState<string[]>([]); const [revealed, setRevealed] = useState(false);
  const choose = (id: string) => setRanking((r) => r.includes(id) ? r.filter((x) => x !== id) : [...r, id]);
  return <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]"><Panel label="Click in the order you would drill">{targets.map((t) => <Button key={t.id} variant={ranking.includes(t.id) ? "default" : "outline"} className="mb-3 h-auto w-full justify-start whitespace-normal p-4 text-left" onClick={() => choose(t.id)}><span className="grid size-9 shrink-0 place-items-center rounded bg-card text-ink">{ranking.indexOf(t.id) + 1 || "–"}</span><span><strong>Target {t.id}</strong><span className="block font-normal text-current/70">{t.clue}</span></span></Button>)}</Panel><div className="space-y-3"><Panel label="Your programme"><p className="font-disp text-3xl text-ink">{ranking.length ? ranking.join(" → ") : "No ranking yet"}</p><Button disabled={ranking.length !== targets.length} className="mt-5 w-full" onClick={() => setRevealed(true)}>Commit and reveal</Button></Panel>{revealed && <Panel label="Model + drilling outcome"><ol className="space-y-2">{targets.slice().sort((a,b) => a.model-b.model).map((t) => <li key={t.id}><strong className="text-oxy">#{t.model} · {t.id}</strong> <span className="text-inksoft">— {t.outcome}</span></li>)}</ol></Panel>}</div></div>;
}

const flaws = [
  { claim: "97% lithology accuracy from a random interval split", answer: "Leakage: neighbouring intervals from the same holes appear in train and test." },
  { claim: "Top prospectivity driver: distance to the nearest road", answer: "Proxy feature: it predicts where exploration happened, not mineralisation." },
  { claim: "Low score beneath 150 m of cover", answer: "Missing evidence: low confidence is being misread as barren ground." },
  { claim: "Leave-one-prospect-out score of 0.71, with uncertainty map", answer: "Defensible: spatial test, modest claim, and uncertainty shown." },
];

export function BiasSpotterWidget() {
  const [open, setOpen] = useState<Set<number>>(new Set());
  return <div className="grid grid-cols-2 gap-4">{flaws.map((item, i) => <Panel key={item.claim} label={`Result ${i + 1}`}><p className="text-lg font-semibold text-ink">{item.claim}</p><Button variant="outline" className="mt-4" onClick={() => setOpen((s) => new Set(s).add(i))}>Reveal assessment</Button>{open.has(i) && <p className={`mt-4 rounded-lg p-3 ${i === 3 ? "bg-moss/10 text-moss" : "bg-oxy/10 text-oxy"}`}>{i === 3 && <Check className="mr-2 inline size-5" />}{item.answer}</p>}</Panel>)}</div>;
}

const terms = [
  ["Algorithm", "A repeatable procedure for turning inputs into outputs."],
  ["Artificial intelligence", "The broad family of computer systems performing tasks associated with human intelligence."],
  ["Machine learning", "Methods that learn patterns from examples instead of receiving every rule explicitly."],
  ["Deep learning", "Machine learning using layered neural networks, especially effective for images, spectra, signals and text."],
  ["Feature", "A number the model is allowed to see."],
  ["Label", "The known answer used to train or test a supervised model."],
  ["Training set", "Examples used to fit the model."],
  ["Validation set", "Examples used to choose model settings before the final test."],
  ["Test set", "Untouched examples used once to measure performance."],
  ["Baseline", "The simplest credible method that a new approach must beat."],
  ["Classification", "Predicting a category such as lithology, alteration class or ore/waste."],
  ["Regression", "Predicting a continuous number such as grade, depth or density."],
  ["Clustering", "Grouping similar samples without an answer key."],
  ["Anomaly detection", "Finding observations unusual relative to a defined background or context."],
  ["Overfitting", "Learning noise in known data instead of a transferable pattern."],
  ["Precision", "Of the targets flagged, the fraction that were real."],
  ["Recall", "Of the real targets, the fraction the model found."],
  ["Base rate", "The real prevalence of the target class before a model makes any prediction."],
  ["Confusion matrix", "A count of true hits, false alarms, missed targets and correct rejections."],
  ["Data leakage", "Information from the answer or test ground entering training."],
  ["Feature importance", "A measure of how strongly an input influenced predictions."],
  ["Inference", "Using a trained model to make a new prediction."],
  ["Uncertainty", "A quantified statement of what the model does not know."],
  ["Spatial cross-validation", "Testing on entire held-out areas rather than nearby random rows."],
  ["Support", "The physical volume or area represented by one measurement."],
  ["Spatial autocorrelation", "The tendency of nearby geological observations to resemble one another."],
  ["Censored data", "A value known only to lie above or below a measurement limit."],
  ["Compositional data", "Measurements constrained to a constant total, requiring ratio-aware analysis."],
  ["Inversion", "Estimating a subsurface property model from measured geophysical responses."],
  ["Non-uniqueness", "The fact that multiple earth models can explain the same geophysical observations."],
  ["Prospectivity", "The degree to which mapped evidence supports a defined mineral-system hypothesis."],
  ["Proxy feature", "An input that predicts history, access or acquisition rather than the geological process of interest."],
  ["Concept drift", "A change in geology, instruments, laboratories or practice that makes an old model less reliable."],
  ["Ground truth", "Independent field, laboratory or drilling evidence used to check a mapped or predicted result."],
];

export function GlossaryWidget() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => terms.filter(([a,b]) => `${a} ${b}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return <div><label className="flex items-center gap-3 rounded-lg border border-line bg-card px-4 py-3"><Search className="size-5 text-inksoft" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search a term…" className="w-full bg-transparent text-lg text-ink outline-none" /></label><div className="mt-5 grid max-h-[430px] grid-cols-2 gap-3 overflow-y-auto pr-2">{filtered.map(([term, meaning]) => <div key={term} className="rounded-lg bg-paper/70 p-4 ring-1 ring-line"><strong className="text-oxy">{term}</strong><p className="mt-1 text-inksoft">{meaning}</p></div>)}</div></div>;
}

/* ------------------------------------------------ AI / ML / DL / LLM NESTED CIRCLES */
const rings = [
  {
    key: "AI",
    r: 190,
    label: "Artificial Intelligence",
    def: "The umbrella term for any software that mimics human decision-making — from hardcoded IF/THEN rules to autonomous systems.",
    engine: "Hardcoded logic",
    input: "Structured tables, standard rules",
    use: "Tax software, basic database filtering",
    color: "#e8dcc8",
  },
  {
    key: "ML",
    r: 135,
    label: "Machine Learning",
    def: "A subset of AI where algorithms learn statistical patterns directly from data, instead of following explicit hardcoded rules.",
    engine: "Statistical pattern matching",
    input: "Structured numerical datasets",
    use: "Prospective mineral zones, credit risk scoring",
    types: ["Supervised — labelled outcomes (ore grade from assays)", "Unsupervised — clusters with no answer key", "Reinforcement — trial-and-error rewards"],
    color: "#c9a24b",
  },
  {
    key: "DL",
    r: 80,
    label: "Deep Learning",
    def: "A specialised subset of ML using multi-layered neural networks built for unstructured, highly complex inputs.",
    engine: "Multi-layer neural networks",
    input: "Images, video, audio, spectral data",
    use: "Core photo logging, face recognition, satellite imagery",
    color: "#8fae6f",
  },
];
const llm = {
  key: "LLM",
  label: "Large Language Models",
  def: "A specific application of Deep Learning trained on vast text archives (e.g. ChatGPT) to process, summarise and generate human language.",
  engine: "Transformer neural networks",
  input: "Unstructured text documents",
  use: "Extracting data from historical PDF archives, drafting reports",
  types: ["Text LLMs — text-in, text-out reasoning and editing", "Multimodal models — text, image and audio together"],
  color: "#e0651c",
};
const misconceptions = [
  { title: "Not a truth machine", text: "A model outputs the most consistent pattern in its training data — which may be a sampling artefact." },
  { title: "Not a database query tool", text: "LLMs predict text sequences statistically; they do not perform precise spatial calculations or deterministic database math." },
  { title: "Not a replacement for domain validation", text: "Models are mathematical pattern matchers — without geological expertise, bad inputs give confident false outputs." },
  { title: "Not a replacement for drilling", text: "Nothing is real until a hole says so." },
];

export function AiHierarchyWidget() {
  const size = 400;
  const cx = size / 2;
  const cy = size / 2;
  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto rounded-xl bg-ink p-6">
      <div className="grid grid-cols-[360px_minmax(0,1fr)] items-start gap-8">
        <svg viewBox={`0 0 ${size} ${size}`} className="sticky top-0 h-auto w-full">
          {rings.map((ring) => (
            <circle key={ring.key} cx={cx} cy={cy} r={ring.r} fill="none" stroke={ring.color} strokeWidth={2} strokeOpacity={0.75} />
          ))}
          {rings.map((ring, i) => (
            <text key={ring.key} x={cx} y={cy - ring.r + (i === 0 ? 28 : 22)} textAnchor="middle" className="font-mono font-bold" fill={ring.color} fontSize={i === 0 ? 22 : 17}>
              {ring.key}
            </text>
          ))}
          <circle cx={cx} cy={cy} r={4} fill={llm.color} />
          <text x={cx} y={cy + 20} textAnchor="middle" className="font-mono" fill={llm.color} fontSize={12}>
            LLMs
          </text>
        </svg>
        <div className="space-y-4">
          {[...rings, llm].map((row) => (
            <div key={row.key} className="border-l-4 pl-4" style={{ borderColor: row.color }}>
              <p className="font-mono text-sm font-bold" style={{ color: row.color }}>{row.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-card/85">{row.def}</p>
              <p className="mt-1 text-xs text-card/60">
                <strong className="text-card/80">Engine</strong> {row.engine} · <strong className="text-card/80">Input</strong> {row.input} · <strong className="text-card/80">Use case</strong> {row.use}
              </p>
              {row.types && (
                <ul className="mt-1 space-y-0.5 text-xs text-card/60">
                  {row.types.map((t) => <li key={t}>· {t}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 border-t border-card/15 pt-4">
        {misconceptions.map((m) => (
          <p key={m.title} className="text-xs text-card/70">
            <strong className="text-card">{m.title}:</strong> {m.text}
          </p>
        ))}
      </div>
    </div>
  );
}