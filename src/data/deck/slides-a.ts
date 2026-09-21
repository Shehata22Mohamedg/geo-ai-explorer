import type { Slide } from "./types";

/* Modules 0–3 : Orientation, Why AI, Data Universe, Field to Feature */
export const slidesA: Slide[] = [
  /* ---------------- TITLE ---------------- */
  {
    id: "title",
    module: 0,
    layout: "title",
    kicker: "5-hour workshop · pre-graduate geology & geophysics",
    title: "A Geologist's Guide to AI & Machine Learning in Mineral Exploration",
    lead: "No coding required. No maths derivations. By the end of today you will not be able to build a model — you will be able to interrogate one.",
    stats: [
      { value: "9", label: "timed modules · 4 acts" },
      { value: "25", label: "live demonstrations" },
      { value: "12", label: "reference modules to take home" },
    ],
    note: "Everything today is anchored in geology first. The AI vocabulary arrives only after the geological idea it describes. Ask questions the moment a word goes past undefined.",

  },
  {
    id: "about-shehata",
    module: 0,
    layout: "split",
    kicker: "About me",
    title: "Shehata Mekawy",
    lead: "Hello everyone. I am Shehata Mekawy, a Surface Exploration Data Scientist. I help turn geological complexity into practical decisions through data products, automation, and machine learning.",
    bullets: [
      {
        label: "01",
        title: "My exploration background",
        text: "I connect field data, geological databases and QA/QC operations to support better exploration decisions.",
      },
      {
        label: "02",
        title: "How I work",
        text: "I design complete workflows that join data collection, validation, modelling and decision support.",
      },
      {
        label: "03",
        title: "What I build",
        text: "I build reliable tools that remove repetitive work and help technical teams act with confidence.",
      },
      {
        label: "04",
        title: "My experience",
        text: "I bring six-plus years across exploration operations, database reliability and applied data science.",
      },
    ],
    note: "I am based in Al-Minya, Egypt. You can explore my projects, experience and contact details through the portfolio link above.",
  },
  {
    id: "arc",
    module: 0,
    layout: "table",
    kicker: "Orientation",
    title: "The arc of the day",
    lead: "Four acts. Foundations, then building blocks, then applications, then judgement. Two breaks are placed at natural seams so the geological story stays legible.",
    table: {
      head: ["Act", "Module", "Time", "Main question"],
      rows: [
        ["I", "00 · Orientation", "15 min", "Where do you already think like a model?"],
        ["I", "01 · Why AI, why now", "35 min", "What actually changed in exploration?"],
        ["I", "02 · The exploration data universe", "40 min", "What shape is exploration data?"],
        ["—", "Break 1", "15 min", "Coffee"],
        ["II", "03 · From field to feature", "35 min", "How does rock become a model-ready table?"],
        ["II", "04 · How ML actually works", "50 min", "What is the model really doing?"],
        ["—", "Break 2", "15 min", "Coffee"],
        ["III", "05 · AI across the value chain", "40 min", "Where is AI genuinely useful?"],
        ["III", "06 · Case study: Solstice", "30 min", "Can you out-target the model?"],
        ["IV", "07 · Where AI fails", "15 min", "When should you refuse the answer?"],
        ["IV", "08 · Tools & the future geologist", "10 min", "What do I do on Monday?"],
        ["Ref", "09 + R01–R11 · Reference workflows", "self-study", "How do I run one of these workflows myself?"],
      ],
    },
    note: "The reference workflows are not part of the five-hour live session. They are the practical field manual you open when you are staring at a real dataset and need a defensible next step.",

  },
  {
    id: "poll",
    module: 0,
    layout: "widget",
    kicker: "Room survey · 3 min",
    title: "Calibrating the room",
    lead: "Answer honestly and submit once. Your response will be recorded automatically so we can set the technical level for the next five hours.",
    widget: "poll",
    activityLabel: "Everyone · hands up or tap",
    takeaway:
      "The survey is a starting point, not a verdict. We will revisit these answers as we learn how sampling, bias and evidence shape every model.",
  },
  {
    id: "already-model",
    module: 0,
    layout: "cards",
    kicker: "Orientation",
    title: "You have been running models for years",
    lead: "Every one of these is a prediction from patterned evidence. Machine learning automates the pattern step — never the meaning step.",
    cards: [
      {
        tag: "Classification",
        title: "Naming a rock in hand specimen",
        text: "Colour, grain size, fabric, hardness, reaction to acid — you weigh several attributes and output a discrete label: 'altered andesite'.",
        accent: "oxy",
      },
      {
        tag: "Regression",
        title: "Estimating grade between holes",
        text: "Two holes at 1.2 % and 0.4 % Cu, 80 m apart. You infer a continuous value in between using distance and geological continuity.",
        accent: "ochre",
      },
      {
        tag: "Clustering",
        title: "Splitting a geochem dataset into populations",
        text: "On a log-probability plot you separate background from anomaly without anyone giving you the answer key first.",
        accent: "moss",
      },
      {
        tag: "Anomaly detection",
        title: "The sample that looks wrong",
        text: "One 4 % Cu in a 60-ppm stream survey. You flag it before you believe it — that instinct is an outlier detector.",
        accent: "slate",
      },
    ],
    takeaway:
      "Machine learning is not a foreign way of thinking. It is your inference habits, written down explicitly and run a million times.",
  },

  /* ---------------- MODULE 1 ---------------- */
  {
    id: "m1-divider",
    module: 1,
    layout: "divider",
    kicker: "Act I · 35 minutes",
    title: "Why AI, Why Now",
    lead: "Exploration has a discovery problem and a data problem at the same time. That combination — not hype — is why every major explorer now has a data-science team.",
    objectives: [
      "State three concrete pressures pushing AI into exploration",
      "Explain the difference between traditional programming and machine learning",
      "Describe why geological judgement becomes more valuable, not less",
    ],
  },
  {
    id: "m1-discovery",
    module: 1,
    layout: "split",
    kicker: "01 · The problem",
    title: "Discovery is getting harder and more expensive",
    lead: "The outcropping deposits are found. What remains is under cover — deeper, blinder, and detectable only through indirect, noisy, multi-layered evidence.",
    bullets: [
      {
        label: "01",
        title: "Cover thickness",
        text: "Most new search space lies under tens to hundreds of metres of regolith, basalt or basin sediment. You cannot map what you cannot see.",
      },
      {
        label: "02",
        title: "Cost per discovery",
        text: "Exploration spend per economic discovery has risen for decades while average discovery grade and size have fallen.",
      },
      {
        label: "03",
        title: "Demand curve",
        text: "Cu, Ni, Li, Co, REE demand for electrification means we need more discoveries, faster, from harder ground.",
      },
      {
        label: "04",
        title: "Drilling is the bottleneck",
        text: "A hole is the only true test — and the most expensive one. Anything that improves the ranking of what you drill first pays for itself.",
      },
    ],
    figure: {
      image: "prospectivity",
      caption: "District-scale prospectivity plate — the question AI helps you answer is 'where next?', not 'is there ore?'",
      scale: "1:250,000",
      pins: [
        { x: 34, y: 44, label: "1", accent: "oxy", text: "Known deposit — the model's training example" },
        { x: 66, y: 52, label: "2", accent: "slate", text: "Untested high-score zone under cover" },
        { x: 20, y: 74, label: "3", accent: "moss", text: "Low-score ground — value in what you do NOT drill" },
      ],
    },
    note: "The value of a model is often defensive: it tells you where not to spend a $400,000 hole.",
  },
  {
    id: "m1-data-deluge",
    module: 1,
    layout: "split",
    kicker: "01 · What changed",
    title: "Three things changed at once",
    lead: "AI is not new. The reason it works in exploration now is that data, compute and open software all crossed a threshold in the same decade.",
    bullets: [
      {
        label: "Data",
        title: "Government open data + digitised legacy archives",
        text: "National geological surveys publish nationwide magnetics, radiometrics, gravity, geochemistry and drill databases. Decades of company reports have been scanned and text-mined.",
      },
      {
        label: "Sensors",
        title: "Continuous, high-resolution measurement",
        text: "Hyperspectral core scanners, portable XRF, downhole geophysics and satellite constellations produce more numbers per metre of rock than any team can read.",
      },
      {
        label: "Software",
        title: "Free, mature, documented tools",
        text: "scikit-learn, PyTorch, QGIS and open notebooks turned methods that needed a PhD in 2005 into a well-documented afternoon in 2026.",
      },
    ],
    stats: [
      { value: "10⁶+", label: "drill records in a national database" },
      { value: "~5 m", label: "modern satellite pixel, freely available" },
      { value: "1000s", label: "measurements per core box from a scanner" },
    ],
    note: "The bottleneck moved. It is no longer 'can we measure it?' — it is 'can anyone look at all of it?'",
  },
  {
    id: "m1-rules-vs-ml",
    module: 1,
    layout: "widget",
    kicker: "01 · Live demo",
    title: "Traditional rules vs. machine learning",
    lead: "Same task — decide if a drill interval is prospective. Switch between an explicit rule written by a geologist and a model that learned from labelled intervals. Watch where each one breaks.",
    widget: "ml-vs-rules",
    takeaway:
      "Rules encode what you already know, exactly. Models discover combinations you did not think to write down — and will confidently apply them where they should not.",
  },
  {
    id: "m1-what-ai-is",
    module: 1,
    layout: "widget",
    kicker: "01 · Vocabulary",
    title: "AI, machine learning, deep learning, LLMs — nested, not competing",
    lead: "Three circles, one inside another, with LLMs at the centre. Same hierarchy, read outside in: what drives it, what it eats, where it earns its keep.",
    widget: "ai-hierarchy",
    takeaway:
      "AI does not replace the geologist's pattern recognition. It does pattern recognition at a scale and dimensionality no human eye can match — and then needs you to say what it means.",
  },
  {
    id: "m1-flavours",
    module: 1,
    layout: "split",
    kicker: "01 · The four learning styles",
    title: "The only taxonomy you must remember",
    lead: "Every application you will see today is one of these four. If you can place a claim into the right box, you can immediately ask the right sceptical question.",
    bullets: [
      {
        label: "Supervised",
        title: "Learn from labelled examples",
        text: "Inputs + known answers. Lithology from geochemistry, grade from geophysics, ore/waste from logged core. Ask: who made the labels, and are they right?",
      },
      {
        label: "Unsupervised",
        title: "Find structure with no answer key",
        text: "Clustering multi-element geochemistry into populations; self-organising maps on geophysical layers. Ask: are these clusters geological or just numerical?",
      },
      {
        label: "Semi-supervised",
        title: "A few labels, a lot of unlabelled ground",
        text: "The realistic exploration case: 12 assayed holes, 40,000 unassayed grid cells. Positive-unlabelled learning lives here.",
      },
      {
        label: "Reinforcement",
        title: "Learn by trying and being scored",
        text: "Sequential decision-making — drill-hole placement, rig scheduling, autonomous rigs. Emerging in mining, rare in exploration targeting today.",
      },
    ],
    figure: {
      image: "machine-learning-techniques",
      caption: "The four learning families: choose the learning setup before choosing the algorithm.",
    },
  },
  {
    id: "m1-llm-types",
    module: 1,
    layout: "cards",
    kicker: "01 · Generative AI",
    title: "The four generative tools you will actually meet at work",
    lead: "Generative AI is not one product. These four shapes appear in exploration offices today, and each has a different failure mode.",
    cards: [
      {
        tag: "Text LLMs",
        title: "Text-in, text-out",
        text: "Reasoning, editing, writing code, and converting messy text into tables — turning a scanned 1987 assay letter into a clean spreadsheet row.",
        accent: "oxy",
      },
      {
        tag: "Multimodal models",
        title: "Text, image and audio together",
        text: "Reads a core photo alongside its logging notes, or transcribes a field voice memo and files it against the right hole ID.",
        accent: "moss",
      },
      {
        tag: "Embeddings + retrieval",
        title: "Search by meaning across your archive",
        text: "Every historical report converted to a numeric fingerprint, so 'skarn with retrograde alteration' finds the 1974 memo that never used those words. This — RAG — is where company value actually sits.",
        accent: "ochre",
      },
      {
        tag: "Agents / tool use",
        title: "A model that calls software for you",
        text: "It queries the drill database or runs a QGIS step instead of guessing the answer. Powerful, and the one to supervise most closely: it can act, not just talk.",
        accent: "slate",
      },
    ],
    note: "An LLM predicts text sequences statistically. On its own it does not perform spatial calculations or deterministic database maths — when it appears to, a tool did the work behind it.",

  },
  {
    id: "m1-honest",
    module: 1,
    layout: "table",
    kicker: "01 · Maturity check",
    title: "Honest maturity of AI in exploration",
    lead: "Some of this is everyday practice at a junior explorer. Some of it is a conference slide. Knowing the difference protects your credibility.",
    table: {
      head: ["Application", "Status", "Why"],
      rows: [
        ["Automated core photo / RQD measurement", "Routine", "Well-posed vision task, abundant labels, easy to verify by eye"],
        ["Alteration mapping from multispectral imagery", "Routine", "Physics-based spectral signatures, decades of validation"],
        ["Multi-element geochemical anomaly detection", "Routine", "Mature statistics, geologist-checkable outputs"],
        ["Lithology prediction from downhole geophysics", "Common", "Works well within a deposit; transfers poorly between districts"],
        ["District prospectivity mapping", "Common but contested", "Very few positive examples; validation is genuinely hard"],
        ["Fully automated 3D geological modelling", "Emerging", "Implicit modelling is standard; unsupervised interpretation is not"],
        ["AI 'discovering' a deposit unaided", "Marketing", "No documented case without a geologist framing, filtering and drilling"],
      ],
    },
    note: "When a vendor claims the bottom row, ask for the drill results and the base rate. That is a geologist's question, not a data scientist's.",
  },
  {
    id: "m1-quote",
    module: 1,
    layout: "quote",
    kicker: "01 · Sticky takeaway",
    title: "Module 01 in one line",
    quote:
      "The funnel from 10,000 km² to one drill collar narrows because of decisions. AI can widen the top of that funnel enormously — but every narrowing step still needs a geologist attaching real-world meaning to a pattern.",
    attribution: "Carry this into every module today",
  },

  /* ---------------- MODULE 2 ---------------- */
  {
    id: "m2-divider",
    module: 2,
    layout: "divider",
    kicker: "Act I · 40 minutes",
    title: "The Exploration Data Universe",
    lead: "Before any algorithm can help, you need to know what shape your data is. Exploration data comes in four very different shapes — and the shape decides the tool.",
    objectives: [
      "Classify any exploration dataset as tabular, spatial, image or text",
      "Name the QA/QC checks that decide whether a dataset is model-ready",
      "Explain why one quietly wrong number is worse than a missing one",
    ],
  },
  {
    id: "m2-shapes",
    module: 2,
    layout: "widget",
    kicker: "02 · Interactive",
    title: "Four shapes of exploration data",
    lead: "Click each shape to see real examples, the ML methods that suit it, and the failure mode that comes with it.",
    widget: "data-shapes",
    takeaway:
      "Ask what shape your data is before you ask what AI can do with it. The shape decides the tool, not the other way round.",
  },
  {
    id: "m2-inventory",
    module: 2,
    layout: "table",
    kicker: "02 · Data inventory",
    title: "A real project's data inventory",
    lead: "This is the audit you run before proposing anything. Volume, resolution, coverage, and the honest quality note — the last column is the one that kills projects.",
    table: {
      head: ["Dataset", "Shape", "Typical size", "Quality trap"],
      rows: [
        ["Surface geological map", "Spatial (polygons)", "1:100k – 1:25k", "Interpretation, not measurement — and it has an author"],
        ["Soil / stream geochemistry", "Tabular + spatial", "10³–10⁵ samples × 50 elements", "Multiple labs, changed detection limits, no re-assays"],
        ["Airborne magnetics / radiometrics", "Raster grid", "10⁶–10⁸ cells", "Different survey heights and line spacings stitched together"],
        ["Drill collars + downhole surveys", "Tabular + 3D", "10²–10⁴ holes", "Wrong collar coordinates, missing dip/azimuth, legacy datums"],
        ["Assay intervals", "Tabular", "10⁴–10⁶ intervals", "Below-detection values coded as 0, −1, blank or 'ND'"],
        ["Geological logs", "Text + coded", "10⁴–10⁵ intervals", "Free-text vocabulary that differs per logger and per year"],
        ["Core photography / scans", "Image", "10³–10⁶ images", "Wet vs dry, inconsistent lighting, missing scale card"],
        ["Historical reports", "Text (PDF)", "10²–10⁴ documents", "Scanned images of text; results without methods"],
      ],
    },
    note: "Notice how many traps are not about volume at all. They are about consistency of meaning across time, teams and instruments.",
  },
  {
    id: "m2-qaqc",
    module: 2,
    layout: "cards",
    kicker: "02 · QA/QC",
    title: "QA/QC is not a lecture — it is the whole project, continuously",
    lead: "Everything an AI model concludes is downstream of these four checks. A model trained on unvalidated assays launders bad data into confident maps.",
    cards: [
      {
        tag: "Blanks",
        title: "Is the lab contaminating my samples?",
        text: "Barren material inserted into the sample stream. A blank returning 300 ppm Cu means carry-over — and every neighbouring sample is suspect.",
        accent: "slate",
      },
      {
        tag: "Duplicates",
        title: "How repeatable is a single number?",
        text: "Field, coarse and pulp duplicates separate sampling variance from analytical variance. This is your realistic noise floor — and no model can beat it.",
        accent: "moss",
      },
      {
        tag: "Standards / CRMs",
        title: "Is the lab accurate, not just precise?",
        text: "Certified reference material with a known value. Drift over a batch invalidates a whole assay run — and creates fake spatial trends a model will happily learn.",
        accent: "ochre",
      },
      {
        tag: "Umpire lab",
        title: "Does a second lab agree?",
        text: "A subset re-assayed independently. Systematic bias between labs looks exactly like a real geochemical boundary in map view.",
        accent: "oxy",
      },
    ],
    takeaway:
      "A model cannot distinguish a lab batch boundary from a lithological contact. Only your QA/QC records can.",
  },
  {
    id: "m2-detective",
    module: 2,
    layout: "widget",
    kicker: "02 · Activity · 8 min",
    title: "The Data Detective",
    lead: "Here are twelve rows from a real-looking assay export. Click every cell you would refuse to feed a model, and say why. There are seven problems.",
    widget: "clean-data",
    activityLabel: "Small groups · then report back",
    takeaway:
      "'More data is always better' is false. A wrong number sitting quietly in a table is worse than a missing one — the missing one at least announces itself.",
  },
  {
    id: "m2-censored",
    module: 2,
    layout: "split",
    kicker: "02 · The classic trap",
    title: "Below detection limit is not zero",
    lead: "Roughly half of a regional geochemistry table can sit below detection for pathfinder elements. How you encode that decides your whole anomaly map.",
    bullets: [
      {
        label: "Wrong",
        title: "Replace with 0",
        text: "Creates an impossible population spike at zero, distorts every ratio (division by zero), and invents a boundary where the lab simply stopped resolving.",
      },
      {
        label: "Wrong",
        title: "Delete the row",
        text: "Throws away exactly the low-background samples that define what 'normal' looks like — so everything left looks anomalous.",
      },
      {
        label: "Usable",
        title: "Substitute a fraction of the limit",
        text: "Half the detection limit is a common, defensible convention. Document it, and re-run the model without it to see if conclusions survive.",
      },
      {
        label: "Best",
        title: "Treat it as censored data",
        text: "Statistical methods designed for 'known to be less than X' — plus a flag column so the model knows which values were imputed.",
      },
    ],
    note: "Also watch for elements where detection limit changed mid-project. That change makes a perfect fake time-series trend.",
    takeaway: "Every imputation is a geological assumption in disguise. Make it explicit, and always keep a flag column.",
  },
  {
    id: "m2-spatial",
    module: 2,
    layout: "split",
    kicker: "02 · Why geo-data is special",
    title: "Spatial data breaks the standard assumptions",
    lead: "Most machine-learning theory assumes each sample is independent. Nothing in geology is independent — that is the entire premise of a variogram.",
    bullets: [
      {
        label: "01",
        title: "Spatial autocorrelation",
        text: "Two samples 5 m apart tell you almost the same thing. Treating them as two independent facts inflates your confidence enormously.",
      },
      {
        label: "02",
        title: "Support and scale",
        text: "A 1 kg soil sample, a 2 m core interval and a 200 m magnetic pixel are not the same measurement of the same volume. Mixing supports without thought is a silent error.",
      },
      {
        label: "03",
        title: "Anisotropy",
        text: "Continuity along a shear or a stratigraphic horizon is far greater than across it. Isotropic models smear grade across a contact.",
      },
      {
        label: "04",
        title: "The third dimension and time",
        text: "Depth is not just another column — weathering, oxidation and structural overprints all change with it. So does the survey year.",
      },
    ],
    figure: {
      image: "magnetics",
      caption:
        "Airborne magnetics with interpreted lineaments. The flight-line direction itself becomes a 'feature' a careless model will learn.",
      scale: "1:100,000",
      pins: [
        { x: 30, y: 30, label: "1", accent: "ochre", text: "Survey-boundary artefact — pure acquisition, no geology" },
        { x: 62, y: 48, label: "2", accent: "moss", text: "Interpreted structural corridor — a genuine ore control" },
      ],
    },
    takeaway: "If your model does not respect distance, direction and support, it is doing statistics on coordinates, not geology.",
  },
  {
    id: "m2-quote",
    module: 2,
    layout: "quote",
    kicker: "02 · Sticky takeaway",
    title: "Module 02 in one line",
    quote:
      "Garbage in, confident garbage out. An AI model does not clean your data — it amplifies whatever discipline you brought to it and hands the result back with a colour ramp.",
  },

  /* ---------------- MODULE 3 ---------------- */
  {
    id: "m3-divider",
    module: 3,
    layout: "divider",
    kicker: "Act II · 35 minutes",
    title: "From Field to Feature",
    lead: "The unglamorous 80% of any real AI project in exploration is not the algorithm. It is getting six messy tables into one a model can actually read.",
    objectives: [
      "Frame an AI project as one testable geological decision on a single page",
      "Describe the pipeline from raw field data to a model-ready table",
      "Define a 'feature' and engineer one from geological reasoning",
      "Recognise sampling bias and spatial data leakage in a real dataset",
    ],

  },
  {
    id: "m3-brief",
    module: 3,
    layout: "steps",
    kicker: "03 · Before any data · the page that saves the project",
    title: "The one-page brief: turning an ambition into a testable question",
    lead: "'Can we use AI on this project?' is not a question a model can answer. These six lines are what a geologist writes — and what a data scientist will ask you for on day one.",
    steps: [
      {
        title: "1. The decision",
        text: "Name the decision the result will change: which five targets get drilled first, which 200 core trays get re-logged, which soil grid gets infilled. No decision, no project.",
        accent: "oxy",
      },
      {
        title: "2. The unit of observation",
        text: "One row equals what? A 100 × 100 m grid cell, a 2 m assay interval, a core photo, a whole hole. Every later argument about scale and support starts here.",
        accent: "slate",
      },
      {
        title: "3. The label, defined in geology",
        text: "'Mineralised' means what exactly — > 0.2 % Cu over 10 m? Logged potassic alteration? Who decided, in which year, under which standard?",
        accent: "ochre",
      },
      {
        title: "4. The evidence you will allow",
        text: "List the layers and why each one belongs to your mineral system model. Anything that only records exploration history — roads, tenement edges, survey year — is excluded now, in writing.",
        accent: "moss",
      },
      {
        title: "5. The validation design",
        text: "Which ground is withheld, and why it is geologically independent. Decide this before you fit anything, or you will be tempted to change it once you see the score.",
        accent: "oxy",
      },
      {
        title: "6. The cost of each error",
        text: "What a false positive costs (one hole, $400k) versus a false negative (a missed system). This ratio, not accuracy, sets the threshold — and only the geologist can supply it.",
        accent: "slate",
      },
    ],
    note: "Bring this page to your first meeting with a modeller and you will immediately be the most useful person in it. Most projects fail on lines 1 and 3, never on the algorithm.",
    takeaway:
      "AI projects in exploration are won or lost in the framing. The algorithm is the cheapest, most replaceable part of the whole exercise.",
  },

  {
    id: "m3-pipeline",
    module: 3,
    layout: "steps",
    kicker: "03 · The pipeline",
    title: "Six steps from rock to row",
    lead: "This sequence is the same whether you are predicting lithology in one deposit or prospectivity across a craton. Only the units change.",
    steps: [
      {
        title: "Collect & validate",
        text: "Assays, logs, surveys, grids. Verify collars, datums, units, dates. Reconcile against QA/QC records before anything else.",
        accent: "slate",
      },
      {
        title: "Clean",
        text: "Handle below-detection values, duplicates, impossible values (negative thickness, 130 % total), and standardise vocabulary in logs.",
        accent: "slate",
      },
      {
        title: "Integrate",
        text: "Join tables on hole ID and depth interval; sample rasters at sample points; put everything into one coordinate system and one support.",
        accent: "moss",
      },
      {
        title: "Engineer features",
        text: "Add the quantities geologists actually reason with: ratios, alteration indices, distance-to-structure, gradients, depth-normalised values.",
        accent: "ochre",
      },
      {
        title: "Split — spatially",
        text: "Hold out whole blocks or whole prospects, never random rows. This one decision separates an honest result from a fantasy.",
        accent: "oxy",
      },
      {
        title: "Train, validate, interrogate",
        text: "Fit the model, score it on ground it never saw, then explain it geologically. If you cannot explain it, you cannot defend it.",
        accent: "oxy",
      },
    ],
    note: "In practice steps 1–3 consume 60–80 % of the project timeline. Budget for it, and say so out loud to management.",
  },
  {
    id: "m3-feature",
    module: 3,
    layout: "widget",
    kicker: "03 · Live demo",
    title: "Feature engineering is geology, written as arithmetic",
    lead: "Build features from a raw assay table and watch class separation improve. Every feature here is something a geologist already computes by hand.",
    widget: "feature-builder",
    takeaway:
      "A feature is any number the model is allowed to see. Choosing them is where your geological knowledge enters the model — it is the single highest-value thing you contribute.",
  },
  {
    id: "m3-feature-catalog",
    module: 3,
    layout: "table",
    kicker: "03 · Reference",
    title: "Features geologists engineer, by discipline",
    lead: "Keep this table. When someone asks 'what would you feed the model?', these are defensible, physically meaningful answers.",
    table: {
      head: ["Discipline", "Engineered feature", "Geological reasoning"],
      rows: [
        ["Geochemistry", "Cu/Mo, Zn/Pb, Au·As, Sr/Y", "Pathfinder ratios vector toward a centre and survive dilution better than raw values"],
        ["Geochemistry", "Alteration indices (AI, CCPI), CIA", "Quantify sericite/chlorite/carbonate intensity from major-element chemistry"],
        ["Geochemistry", "Log-ratio (CLR/ILR) transforms", "Assays are compositional — they sum to 100 %; raw percentages break correlation maths"],
        ["Geophysics", "Analytic signal, tilt derivative, 1VD", "Edge-detection on magnetics; localises contacts and structures rather than bulk response"],
        ["Geophysics", "Depth slices from inversion models", "Turns a 3D physical-property model into layer features usable in a 2D map"],
        ["Structure", "Distance to nearest fault / intersection", "Fault intersections are classic fluid-flow conduits — proximity is a real control"],
        ["Structure", "Fault density, orientation deviation", "Damage-zone intensity as a continuous variable rather than a line on a map"],
        ["Remote sensing", "Band ratios, clay/iron oxide indices", "Direct mineralogical proxies from spectral absorption features"],
        ["Drilling", "Depth-normalised grade, downhole gradient", "Separates true tenor from oxidation and supergene enrichment effects"],
        ["Geology", "One-hot lithology, alteration rank", "Turns categorical field observations into numbers without inventing a false order"],
      ],
    },
  },
  {
    id: "m3-bias",
    module: 3,
    layout: "split",
    kicker: "03 · The hardest problem",
    title: "Your training data is where geologists already looked",
    lead: "Drill holes are not a random sample of the crust. They cluster near roads, outcrop, historical workings and last year's good result. A model trained on them learns exploration history as much as geology.",
    bullets: [
      {
        label: "01",
        title: "Sampling bias",
        text: "If every mineralised hole sits near a road, 'distance to road' becomes your strongest predictor — and it is not a metallogenic control.",
      },
      {
        label: "02",
        title: "Absence is not absence",
        text: "Unlabelled ground is mostly unexplored, not barren. Treating it as negative examples teaches the model that unexplored means empty.",
      },
      {
        label: "03",
        title: "Spatial data leakage",
        text: "Random train/test splits put a hole's neighbour 10 m away into the test set. The model memorises location and reports 95 % accuracy.",
      },
      {
        label: "04",
        title: "Label noise",
        text: "Lithology logs from four geologists across fifteen years contain four different vocabularies and three different granodiorites.",
      },
    ],
    note: "Mitigations: spatial cross-validation by block or prospect, presence-only / PU learning methods, dropping proxy features, and always reporting how positives were selected.",
    takeaway:
      "Ask of every model: does this predict geology, or does it predict where we have already drilled? They look identical in map view.",
  },
  {
    id: "m3-leakage-demo",
    module: 3,
    layout: "compare",
    kicker: "03 · The number that lies",
    title: "Random split vs. spatial split — same data, same model",
    lead: "Nothing changed except how the test set was chosen. The first result is the one that gets put in a presentation; the second is the one that survives drilling.",
    compare: {
      leftTitle: "Random 80/20 row split",
      left: [
        "Reported accuracy: 0.96",
        "Test intervals sit centimetres to metres from training intervals in the same holes.",
        "The model can succeed by memorising 'near this coordinate, grade is high'.",
        "Generalises to new ground: unknown, and probably poorly.",
        "Verdict: a measure of interpolation, presented as prediction.",
      ],
      rightTitle: "Leave-one-prospect-out split",
      right: [
        "Reported accuracy: 0.71",
        "Whole prospects withheld — the model must transfer to unseen ground.",
        "Performance now reflects the actual exploration question.",
        "Also reveals which prospects are geologically atypical — useful in itself.",
        "Verdict: lower number, honest number, defensible in a technical review.",
      ],
    },
    takeaway:
      "When you see a suspiciously high accuracy on spatial data, your first question is always: how was the test set separated in space?",
  },
];
