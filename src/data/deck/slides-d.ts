import type { Slide, Workflow } from "./types";

const makeWorkflow = (
  question: string,
  decision: string,
  rows: Array<[string, string, string, string, string]>,
): Workflow => ({
  question,
  decision,
  steps: rows.map(([phase, title, detail, check, output], index) => ({
    phase,
    title,
    detail,
    check,
    output,
    accent: (["slate", "moss", "ochre", "oxy"] as const)[index % 4] ?? "slate",
  })),
});

const projectSetup = makeWorkflow(
  "What decision must this work improve, and what evidence would change that decision?",
  "A one-page project charter: question, target, area, decision, owner, deadline and success measure.",
  [
    ["Question", "Write one geological decision", "Replace 'use AI on our data' with a decision such as: rank 20 target areas for field follow-up.", "Can the exploration manager act differently when the answer arrives?", "A precise decision statement"],
    ["Hypothesis", "State the mineral-system logic", "Write the expected source, pathway, trap, deposition and preservation evidence before opening software.", "Would another geologist recognise the deposit model and disagree constructively?", "A testable geological hypothesis"],
    ["Inventory", "List available evidence", "Record owner, date, extent, scale, units, format, coordinate system and known limitations for every layer.", "Does coverage match the area and scale of the question?", "A data inventory and gap map"],
    ["Target", "Define the prediction unit", "Choose the thing being scored: sample, interval, pixel, voxel, prospect or drill target.", "Are all inputs measured at a compatible support?", "A modelling unit and study grid"],
    ["Measure", "Choose success before modelling", "Use an operational measure: deposits captured in top 10% area, productive holes, metres saved, or logging time reduced.", "Does the metric reflect project cost and missed-opportunity risk?", "A decision-linked scorecard"],
    ["Baseline", "Build the simplest comparator", "Compare against geological ranking, a threshold rule or random targeting before trying a complex model.", "Does the new method beat a credible current practice?", "A baseline result"],
    ["Gate", "Set a stop/go review", "Agree what quality, validation and explainability evidence is required before the output can affect field spend.", "Who is accountable for approving the next step?", "A governed project plan"],
  ],
);

const dataAudit = makeWorkflow(
  "Can these datasets be combined without inventing false geological patterns?",
  "Approve, repair, quarantine or reject each layer before modelling begins.",
  [
    ["Register", "Create a data catalogue", "List files, tables, rasters, reports and images with an owner and immutable source copy.", "Can every result be traced back to the original source?", "Versioned source register"],
    ["Locate", "Verify coordinates and datums", "Plot collars, samples and grids against trusted control points; check hemisphere, datum and axis order.", "Do points fall on the correct licence, geology and topography?", "Spatial integrity report"],
    ["Standardise", "Reconcile units and vocabularies", "Convert ppm/% and metres/feet; map legacy lithology codes without deleting the original terms.", "Can a geologist audit every conversion and code mapping?", "Data dictionary and conversion log"],
    ["Validate", "Run geological and numeric rules", "Flag overlaps, gaps, impossible intervals, duplicate IDs, negative grades and improbable totals.", "Is a flagged value impossible, unusual, or genuinely interesting?", "Exception table"],
    ["QA/QC", "Join standards, blanks and duplicates", "Attach batch-level laboratory evidence before using assays as predictors or labels.", "Were failed batches re-assayed and excluded until resolved?", "Assay fitness status"],
    ["Coverage", "Map density and missingness", "Show where each dataset exists, its resolution and where values were interpolated or absent.", "Will missing data be mistaken for low prospectivity?", "Coverage and confidence layers"],
    ["Release", "Freeze a model-ready version", "Record transformations, exclusions, checksums and date; preserve raw and cleaned data separately.", "Could another analyst reproduce exactly this release?", "Auditable model-ready dataset"],
  ],
);

const geochem = makeWorkflow(
  "Which geochemical patterns are anomalous within their geological and regolith context?",
  "Select anomalies for mapping, infill sampling or follow-up—not drill collars yet.",
  [
    ["Design", "Match media and spacing to the target", "Choose soil, stream sediment, rock chip or lag; set orientation and density from expected footprint and transport.", "Can the survey resolve the target at its expected size?", "Sampling plan"],
    ["Assay", "Capture analytical context", "Preserve method, digestion, detection limits, standards, blanks, duplicates, batch and laboratory.", "Are values comparable across batches and years?", "Validated multi-element table"],
    ["Domain", "Separate geological populations", "Stratify by lithology, regolith, drainage catchment and sample medium before defining background.", "Are high values caused by a different host or transport regime?", "Domain-coded samples"],
    ["Transform", "Treat skew and composition", "Use detection-limit flags and log-ratio transforms; never silently replace non-detects with zero.", "Do conclusions survive reasonable handling choices?", "Analysis-ready features"],
    ["Detect", "Find univariate and multivariate anomalies", "Combine robust thresholds, PCA, clustering or anomaly scores; keep raw values visible.", "Is the pattern coherent across related pathfinders?", "Anomaly and association maps"],
    ["Vector", "Interpret direction, not only intensity", "Use element ratios, zoning and gradients to distinguish centre, halo and transported dispersion.", "Does the vector agree with structure, alteration and regolith?", "Ranked geochemical corridors"],
    ["Verify", "Return to the ground", "Check contamination, resample key sites and collect geological observations before escalation.", "Can the anomaly be reproduced independently?", "Field-verified anomaly list"],
  ],
);

const remoteSensing = makeWorkflow(
  "Where do surface minerals and structures support the exploration model?",
  "Prioritise traverses and field spectroscopy across mapped alteration and structural corridors.",
  [
    ["Question", "Choose the detectable mineral system clue", "Target iron oxide, Al-OH clay, Mg-OH minerals, silica, carbonate, structure or disturbance—not 'ore'.", "Is the clue exposed at surface and detectable by the chosen sensor?", "Spectral target definition"],
    ["Acquire", "Select sensor and season", "Match spectral bands and pixel size to the mineral and footprint; minimise cloud, snow and vegetation.", "Is resolution sufficient, and are scenes from comparable conditions?", "Scene collection"],
    ["Correct", "Prepare physically comparable imagery", "Apply atmospheric, topographic and illumination corrections; mask cloud, water, shadow and vegetation.", "Do known invariant surfaces have consistent spectra?", "Analysis-ready reflectance"],
    ["Extract", "Generate mineral and structure features", "Calculate ratios, spectral similarity, unmixing outputs, texture and lineament candidates.", "Are features tied to absorption physics rather than colour alone?", "Evidence layers"],
    ["Classify", "Map candidate domains", "Use thresholds, clustering or labelled classifiers and retain probabilities rather than hard classes only.", "How sensitive is the map to training polygons and thresholds?", "Alteration probability map"],
    ["Screen", "Remove plausible false positives", "Compare with lithology, playa deposits, roads, burn scars, agriculture and terrain shadows.", "What non-geological surface can produce the same signature?", "Screened targets"],
    ["Ground truth", "Verify with rocks and spectra", "Visit high, medium and low predictions; record field spectra, mineralogy and photographs.", "Did validation sample the full prediction range?", "Validated alteration map"],
  ],
);

const geophysics = makeWorkflow(
  "Which subsurface physical-property patterns could represent source, pathway or target?",
  "Design focused follow-up geophysics or drilling against a physically and geologically constrained target.",
  [
    ["Objective", "Name the physical contrast", "State whether the target should differ in susceptibility, density, conductivity, chargeability or velocity.", "Is there measured petrophysical evidence for the expected contrast?", "Physical-property hypothesis"],
    ["Audit", "Check acquisition and processing", "Review line spacing, height, noise, levelling, coordinate system, filters and survey boundaries.", "Could the anomaly be an acquisition artefact?", "Trusted observation grid"],
    ["Enhance", "Derive interpretable attributes", "Use derivatives, analytic signal, continuation, decay constants or spectral attributes appropriate to the physics.", "Does each transform answer a defined geological question?", "Attribute suite"],
    ["Invert", "Estimate a property model", "Build constrained 2D/3D models and preserve alternative solutions; ML may accelerate but not remove non-uniqueness.", "Which bounds, reference models and regularisation shaped the result?", "Property volume plus alternatives"],
    ["Integrate", "Tie properties to rocks", "Compare with petrophysics, mapped contacts, downhole logs, structure and known mineralisation.", "Can the property body be explained by a non-target rock?", "Geological interpretation"],
    ["Uncertainty", "Map what is resolved", "Show depth of investigation, sensitivity, data coverage and model spread—not only the preferred section.", "Where is the feature required by data versus imposed by constraints?", "Resolution and uncertainty map"],
    ["Test", "Design the next discriminating observation", "Choose infill lines, petrophysics, mapping or a hole that separates competing interpretations.", "Will the test falsify at least one geological explanation?", "Follow-up programme"],
  ],
);

const coreVision = makeWorkflow(
  "Can image and sensor data make core logging faster and more consistent without erasing geological judgement?",
  "Deploy an assisted-logging workflow with review queues, confidence thresholds and continuous quality monitoring.",
  [
    ["Standardise", "Control image capture", "Fix lighting, camera distance, wet/dry state, scale, depth blocks, tray orientation and colour reference.", "Could the model identify the site or shift from photography alone?", "Consistent core imagery"],
    ["Label", "Build an agreed logging standard", "Senior geologists define classes, boundaries and ambiguous cases; double-label a representative subset.", "Do experts agree enough for the requested task to be learnable?", "Audited training labels"],
    ["Split", "Hold out entire holes", "Separate by hole, campaign and geology—not random image patches from the same tray.", "Does the test set represent future deployment conditions?", "Honest train/validation/test sets"],
    ["Train", "Predict pixels, intervals or measurements", "Use classification for lithology, segmentation for boundaries and detection for fractures or trays.", "Is the task narrow enough to verify visually?", "Model plus confidence scores"],
    ["Review", "Route uncertainty to a geologist", "Auto-accept only high-confidence routine cases; show uncertain intervals and disagreements in a queue.", "Can the reviewer see the original image and model evidence together?", "Human-reviewed log"],
    ["Integrate", "Write results into the geological database", "Preserve model version, confidence, reviewer, edits and original human log.", "Is automated output clearly distinguishable and reversible?", "Traceable assisted log"],
    ["Monitor", "Watch for drift", "Track performance by rig, camera, lithology, depth and month; retrain after standards or acquisition change.", "Are errors increasing in a specific domain?", "Operational quality dashboard"],
  ],
);

const modelling3d = makeWorkflow(
  "What 3D geological configurations remain consistent with the observations?",
  "Use multiple plausible models to plan drilling and communicate geological uncertainty.",
  [
    ["Frame", "Define purpose and scale", "A district architecture model, deposit domain model and resource model need different inputs and tolerances.", "What decision will the model support?", "Model scope and resolution"],
    ["Compile", "Bring evidence into one 3D frame", "Validate collars, surveys, contacts, assays, structures, topography, geophysics and chronology.", "Do sections reconcile with plans and downhole traces?", "Trusted 3D observations"],
    ["Interpret", "Build geological constraints", "Define stratigraphy, cross-cutting relationships, orientations, faults and domain rules before interpolation.", "Does the topology honour geological history?", "Interpretive framework"],
    ["Interpolate", "Construct surfaces and volumes", "Use implicit surfaces, structural fields or constrained classification; keep parameters documented.", "Where is geometry data-driven and where is it extrapolated?", "Candidate 3D model"],
    ["Estimate", "Model grade or properties inside domains", "Composite appropriately, model continuity, compare kriging and ML, and avoid crossing hard boundaries.", "Is error below sampling and geological uncertainty?", "Estimated block or voxel model"],
    ["Simulate", "Generate plausible alternatives", "Vary contacts, faults, grades and continuity to reveal where the preferred model is fragile.", "Do decisions survive across realisations?", "Uncertainty ensemble"],
    ["Update", "Treat every hole as a test", "Compare predicted and observed contacts, properties and grades; revise the geological concept, not only the surface.", "What did the new hole falsify?", "Versioned learning model"],
  ],
);

const prospectivity = makeWorkflow(
  "Where does the evidence support a complete mineral system strongly enough to justify follow-up?",
  "Produce ranked, explainable target areas accompanied by coverage and uncertainty—not a treasure map.",
  [
    ["System", "Write source–pathway–trap–preservation", "Describe the ore-forming process and expected evidence at the scale of the study.", "Are ingredients causal, or merely associated with known deposits?", "Mineral-system model"],
    ["Proxy", "Translate ingredients into mappable evidence", "Choose geochemical, geological, structural, geophysical and spectral proxies with direction and scale.", "Can every layer be defended by a geological sentence?", "Evidence-layer register"],
    ["Prepare", "Align support, extent and missingness", "Transform layers onto a justified grid while preserving coverage, resolution and confidence masks.", "Did interpolation create information where none exists?", "Comparable evidence stack"],
    ["Model", "Combine evidence transparently", "Use expert weights when labels are scarce; use supervised learning only with defensible positives and negatives.", "Is model complexity justified by label quantity and quality?", "Prospectivity scores"],
    ["Validate", "Withhold space and deposits", "Use leave-one-deposit/prospect-out tests, success-rate curves and geological plausibility checks.", "Does the model find unseen systems, not neighbouring pixels?", "Spatial validation report"],
    ["Explain", "Interrogate every high score", "Show contributing layers, analogues, data density, extrapolation and alternative explanations.", "Would a high score survive removal of one suspect layer?", "Target evidence cards"],
    ["Rank", "Add operational reality", "Combine geological score with depth, tenure, access, environment, cost and a clear next test.", "Is the next action proportionate to evidence and uncertainty?", "Approved target portfolio"],
  ],
);

const targetRanking = makeWorkflow(
  "Given limited budget, which target receives the next dollar and why?",
  "Commit a staged programme with explicit kill, hold and advance criteria for every target.",
  [
    ["Assemble", "Create one target card per candidate", "Summarise system ingredients, observations, contradictions, coverage, uncertainty and previous tests.", "Can reviewers compare targets without opening ten separate maps?", "Comparable target cards"],
    ["Separate", "Keep evidence and confidence distinct", "Score prospectivity, data confidence and operational feasibility separately before combining them.", "Is a low geological score actually weak evidence coverage?", "Three-axis target profile"],
    ["Challenge", "Write the strongest alternative explanation", "For each target, explain how the anomaly could arise without mineralisation.", "What observation would distinguish the alternatives?", "Falsification test"],
    ["Rank", "Use explicit criteria and weights", "Apply agreed weights, then run sensitivity tests so one arbitrary weight cannot hide a fragile order.", "Which targets change rank under reasonable weights?", "Robust ranking bands"],
    ["Design", "Choose the cheapest decisive test", "Map, sample, run geophysics, trench or drill according to uncertainty—not prestige.", "Does the test reduce the uncertainty that controls the decision?", "Staged work programme"],
    ["Gate", "Set advance and kill criteria", "Define results that promote, redesign, hold or terminate a target before seeing the outcome.", "Would the team really stop after a failed criterion?", "Pre-committed decision gates"],
    ["Learn", "Update the portfolio after every result", "Record prediction versus observation and propagate new knowledge to sibling targets and the system model.", "What changed in our geological beliefs?", "Living target portfolio"],
  ],
);

const genAi = makeWorkflow(
  "How can a generative-AI assistant accelerate technical work without becoming an unverified source?",
  "Release a human-approved output with traceable evidence, protected data and clearly stated AI involvement.",
  [
    ["Classify", "Assess sensitivity and consequence", "Identify confidential data, personal information, unpublished coordinates and decisions with safety or reporting impact.", "Is this information permitted in the chosen tool?", "Use/no-use boundary"],
    ["Bound", "Write a precise, limited request", "Provide role, audience, task, allowed evidence, units and required structure; ask it to mark uncertainty.", "Could a reviewer tell what the assistant was and was not asked to do?", "Auditable prompt"],
    ["Draft", "Generate a first pass", "Use it for structure, code explanation, extraction or summarisation—not as the geological authority.", "Are facts separated from suggestions and interpretations?", "Machine draft"],
    ["Verify", "Check every consequential claim", "Open primary sources; validate numbers, coordinates, units, equations, references and code on a test copy.", "Can each claim be traced to evidence you personally inspected?", "Verification record"],
    ["Test", "Stress the output", "Ask what is missing, seek contradictory evidence, run code, compare totals and test edge cases.", "What plausible failure would remain fluent and invisible?", "Corrected working output"],
    ["Review", "Apply accountable expertise", "A qualified person reviews geological interpretations, external communication and decisions affecting spend or safety.", "Who owns the final judgement?", "Human-approved deliverable"],
    ["Record", "Preserve provenance", "Store sources, prompt purpose, tool/date, edits, reviewer and limitations without exposing private conversations.", "Could another professional reproduce the evidence chain?", "Traceable final record"],
  ],
);

const starterProject = makeWorkflow(
  "How can a beginner complete one credible portfolio project from public exploration data?",
  "Publish a reproducible map and short technical note that demonstrates geological reasoning, not algorithm complexity.",
  [
    ["Choose", "Pick one small geological question", "Example: identify multi-element geochemical domains related to mapped lithology in one public survey.", "Can it be completed in two weekends with available data?", "One-sentence project brief"],
    ["Acquire", "Download data and metadata", "Keep original files, licences, coordinate systems, methods, units and detection limits together.", "Can another person locate the same source?", "Organised raw-data folder"],
    ["Inspect", "Map before modelling", "Plot locations, distributions, missingness, lithology and obvious survey boundaries in QGIS or a notebook.", "What geological pattern is visible without ML?", "Exploratory figures"],
    ["Prepare", "Clean transparently", "Document non-detect handling, duplicates, exclusions, transforms and domain choices in a short data dictionary.", "Can every changed value be explained?", "Clean table and data dictionary"],
    ["Analyse", "Use one simple method", "Try PCA, k-means or a decision tree; keep a geological baseline and avoid tuning for a prettier map.", "What does the method add beyond the baseline?", "Reproducible analysis"],
    ["Validate", "Test the geological meaning", "Map outputs against lithology, structure and known occurrences; inspect failures and alternative explanations.", "Are patterns geological, acquisition-related or accidental?", "Interpretation with limitations"],
    ["Communicate", "Publish evidence and reflection", "Share one map, method, result, limitations and next field test; include code or exact steps.", "Could an employer understand your judgement in five minutes?", "Portfolio-ready case study"],
  ],
);

type Entry = { id: string; code: string; title: string; lead: string; workflow: Workflow };

const entries: Entry[] = [
  { id: "project-setup", code: "R01", title: "Start with the decision, not the algorithm", lead: "A reusable opening workflow for any exploration data project.", workflow: projectSetup },
  { id: "data-audit", code: "R02", title: "From inherited files to trusted evidence", lead: "The full GIS, database and QA/QC readiness workflow.", workflow: dataAudit },
  { id: "geochem", code: "R03", title: "Geochemistry: sample to verified anomaly", lead: "A defensible path from field design through multi-element vectoring.", workflow: geochem },
  { id: "remote-sensing", code: "R04", title: "Remote sensing: pixels to field traverse", lead: "Turn spectral evidence into a ground-checked alteration map.", workflow: remoteSensing },
  { id: "geophysics", code: "R05", title: "Geophysics: signal to testable target", lead: "Preserve physics, alternatives and uncertainty from survey to decision.", workflow: geophysics },
  { id: "core-vision", code: "R06", title: "Core vision: image to reviewed geological log", lead: "Design automation around controlled capture and a geologist review queue.", workflow: coreVision },
  { id: "3d-model", code: "R07", title: "3D modelling: observations to plausible worlds", lead: "Build, challenge and update models instead of presenting one certain surface.", workflow: modelling3d },
  { id: "prospectivity", code: "R08", title: "Prospectivity: mineral system to ranked ground", lead: "The complete evidence-integration workflow, with spatial validation.", workflow: prospectivity },
  { id: "target-ranking", code: "R09", title: "Target ranking: evidence to funded programme", lead: "Separate prospectivity, confidence and feasibility before committing spend.", workflow: targetRanking },
  { id: "genai", code: "R10", title: "Generative AI: request to verified deliverable", lead: "A safe professional workflow for reports, data work and code assistance.", workflow: genAi },
  { id: "starter-project", code: "R11", title: "Your first portfolio project, start to finish", lead: "A realistic two-weekend route from public data to a defensible case study.", workflow: starterProject },
];

const laneGroups: Array<[string, number[]]> = [
  ["Question & evidence", [0, 1]],
  ["Preparation", [2, 3]],
  ["Method & output", [4, 5]],
  ["Validation & decision", [6]],
];

const diagramOf = (workflow: Workflow) => ({
  intro: workflow.question,
  feedback: workflow.decision,
  lanes: laneGroups.map(([label, indexes]) => ({
    label,
    nodes: indexes.flatMap((i) => {
      const step = workflow.steps[i];
      return step ? [{ title: `${step.phase} — ${step.title}`, text: step.output, accent: step.accent }] : [];
    }),
  })),
});

const moduleSlides = entries.flatMap((entry, i): Slide[] => {
  const module = 10 + i;
  const steps = entry.workflow.steps;
  return [
    {
      id: `m${module}-divider`,
      module,
      layout: "divider",
      kicker: `${entry.code} · reference module`,
      title: entry.title,
      lead: entry.lead,
      objectives: [
        `Answer: ${entry.workflow.question}`,
        `Work through ${steps.length} gates: ${steps.map((step) => step.phase).join(" → ")}`,
        `Deliver: ${entry.workflow.decision}`,
      ],
    },
    {
      id: `m${module}-diagram`,
      module,
      layout: "diagram",
      kicker: `${entry.code} · workflow diagram`,
      title: "The workflow at a glance",
      diagram: diagramOf(entry.workflow),
      takeaway: "Read left to right; every stage produces a deliverable a geologist can check.",
    },
    {
      id: `m${module}-animated`,
      module,
      layout: "widget",
      kicker: `${entry.code} · animated workflow`,
      title: entry.title,
      lead: entry.lead,
      widget: "animated-workflow",
      workflow: entry.workflow,
      activityLabel: "Play · pause · inspect every gate",
    },
    {
      id: `m${module}-gates`,
      module,
      layout: "table",
      kicker: `${entry.code} · checklist`,
      title: "Gate-by-gate checklist you can reuse",
      lead: "Print this table and tick each row before letting the result influence field spend.",
      table: {
        head: ["Gate", "Do this", "Human check", "Deliverable"],
        rows: steps.map((step) => [`${step.phase}`, step.title, step.check, step.output]),
      },
    },
  ];
});


export const slidesD: Slide[] = [
  {
    id: "m9-divider",
    module: 9,
    layout: "divider",
    kicker: "Optional reference · self-study",
    title: "Reference Workflows",
    lead: "The live workshop remains five hours. This additional field manual turns the day's ideas into repeatable processes you can use on a project, in an interview, or while building your first portfolio.",
    objectives: [
      "Follow a geological question from raw evidence to a documented decision",
      "Know exactly where human validation belongs in every AI-assisted workflow",
      "Work through eleven reference modules, each with a diagram, animation and checklist",
    ],
  },
  {
    id: "m9-how-to-use",
    module: 9,
    layout: "cards",
    kicker: "09 · How to use this field manual",
    title: "Every workflow has the same seven gates",
    lead: "Play a workflow from left to right, pause at any gate, and ask whether the evidence is strong enough to continue.",
    cards: [
      { tag: "Question", title: "Begin with geology", text: "Name the decision, target concept and scale before choosing data or software.", accent: "oxy" },
      { tag: "Evidence", title: "Make inputs auditable", text: "Record provenance, coverage, support, units, QA/QC and what is missing.", accent: "slate" },
      { tag: "Method", title: "Use the simplest adequate tool", text: "A threshold or map overlay is the baseline every more complex method must beat.", accent: "ochre" },
      { tag: "Decision", title: "Validate, act, learn", text: "Test in space and on the ground, state uncertainty, then update the model after the result.", accent: "moss" },
    ],
    takeaway: "The reusable pattern is: question → evidence → preparation → method → output → validation → decision.",
  },
  {
    id: "m9-method-guide",
    module: 9,
    layout: "table",
    kicker: "09 · Beginner method chooser",
    title: "Choose the method from the question and data—not fashion",
    lead: "Start in the first column. If a simpler method answers the decision, stop there.",
    table: {
      head: ["Your question", "Start with", "Escalate when", "Never forget"],
      rows: [
        ["Which known class is this?", "Rules, logistic regression, decision tree", "Boundaries are complex and labels are plentiful", "Classification quality cannot exceed label quality"],
        ["What continuous value is expected?", "Baseline mean, linear model, kriging", "Relationships are non-linear and multivariate", "Compare error with sampling and analytical uncertainty"],
        ["What natural groups exist?", "Plots, PCA, hierarchical clustering", "Volume or dimensionality hides structure", "A cluster has no geological name until you map and inspect it"],
        ["Which observations are unusual?", "Domain-specific thresholds", "The signature is multivariate or contextual", "Unusual can mean ore, error, contamination or new geology"],
        ["Where is favourable ground?", "Mineral-system overlays", "Enough defensible local labels exist", "Validate on whole unseen areas and show uncertainty"],
        ["What is in this image or spectrum?", "Standardised capture + expert labels", "Manual interpretation is consistent but too slow", "Test across cameras, sites, seasons and operators"],
        ["Can AI help write or code this?", "Bounded draft + primary sources", "The task is repetitive and independently verifiable", "Never delegate accountability or confidential data"],
      ],
    },
  },
  {
    id: "m9-map",
    module: 9,
    layout: "table",
    kicker: "09 · Reference map",
    title: "Eleven reference modules, each with its own diagram",
    lead: "Every module opens with objectives, then a workflow diagram, an animated walkthrough and a reusable checklist.",
    table: {
      head: ["Module", "Workflow", "First gate"],
      rows: entries.map((entry) => [entry.code, entry.title, entry.workflow.steps[0]?.phase ?? ""]),
    },
  },
  ...moduleSlides,
  {
    id: "m20-close",
    module: 20,
    layout: "quote",
    kicker: "R11 · Reference close",
    title: "The habit that makes a beginner useful",
    quote: "Do not ask which algorithm looks advanced. Ask what geological decision is being made, what evidence supports it, how the result was tested on unseen ground, and what observation could prove it wrong.",
    attribution: "Use that sequence until it becomes automatic",
  },
];