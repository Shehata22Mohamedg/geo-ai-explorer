import type { Slide } from "./types";

/* Modules 4–6 : How ML works, Value chain, Case study */
export const slidesB: Slide[] = [
  /* ---------------- MODULE 4 ---------------- */
  {
    id: "m4-divider",
    module: 4,
    layout: "divider",
    kicker: "Act II · 50 minutes",
    title: "How Machine Learning Actually Works",
    lead: "One algorithm taught deeply — the decision tree, because it is an automated logging key. Then the others get one honest sentence each so the words are not alien later.",
    objectives: [
      "Trace a single prediction through a decision tree by hand",
      "Explain overfitting, and why training accuracy can never reveal it",
      "Read a confusion matrix, precision and recall in exploration terms",
      "Say what a neural network adds — and what it costs you",
    ],
  },
  {
    id: "m4-tree",
    module: 4,
    layout: "widget",
    kicker: "04 · Live demo",
    title: "A decision tree is an automated logging key",
    lead: "You already use dichotomous keys to identify rocks and minerals. A decision tree is exactly that — except the thresholds were learned from labelled examples instead of written by a professor.",
    widget: "decision-tree",
    takeaway:
      "Every split asks one yes/no question about one number. The learning is only in choosing which question, and where to cut.",
  },
  {
    id: "m4-how-splits",
    module: 4,
    layout: "split",
    kicker: "04 · Under the hood",
    title: "How the machine chooses a threshold",
    lead: "No magic and no calculus needed. It tries every candidate cut on every feature and keeps the one that most reduces mixing.",
    bullets: [
      {
        label: "01",
        title: "Start with a mixed bag",
        text: "1,000 logged intervals: 400 ore, 600 waste. Maximum confusion — you cannot call it either way.",
      },
      {
        label: "02",
        title: "Try every cut",
        text: "Cu > 0.15 %? S > 1.2 %? Magnetic susceptibility > 0.02 SI? Each candidate splits the bag into two smaller bags.",
      },
      {
        label: "03",
        title: "Score the purity",
        text: "Gini impurity or entropy measures how mixed each resulting bag is. The winning cut is the one whose children are purest.",
      },
      {
        label: "04",
        title: "Repeat, then stop",
        text: "Recurse on each branch until bags are pure, too small, or a depth limit is hit. That stopping rule is what controls overfitting.",
      },
    ],
    note: "A random forest grows hundreds of such trees, each on a random subset of rows and features, then votes. Gradient boosting instead grows trees sequentially, each fixing the last one's errors — it is the workhorse of tabular geoscience today.",
    takeaway:
      "Trees are popular in exploration for one non-technical reason: you can print one and argue with it in a technical review.",
  },
  {
    id: "m4-overfit",
    module: 4,
    layout: "widget",
    kicker: "04 · Live demo · the most important slide today",
    title: "Overfitting, happening live",
    lead: "Drag the complexity slider. Watch the boundary and both accuracies. Somewhere in the middle is the model you want — and the training score will never tell you where.",
    widget: "overfit",
    takeaway:
      "Overfitting is memorising the noise in your training holes. It always looks like success until you drill.",
  },
  {
    id: "m4-splitting",
    module: 4,
    layout: "cards",
    kicker: "04 · The honesty machinery",
    title: "Train, validate, test — and why geology needs a fourth rule",
    lead: "The three-way split is standard practice everywhere. The fourth rule is the one that exploration adds and outsiders forget.",
    cards: [
      {
        tag: "Train",
        title: "~60 % of the data",
        text: "The examples the model fits. It is allowed to see labels here, and it will fit them well.",
        accent: "moss",
      },
      {
        tag: "Validate",
        title: "~20 %",
        text: "Used to choose settings — tree depth, number of features, thresholds. Touched many times, so it is no longer a clean scoreboard.",
        accent: "ochre",
      },
      {
        tag: "Test",
        title: "~20 %, opened once",
        text: "The final honest number. Look at it once, at the end. Every extra peek turns it into another validation set.",
        accent: "slate",
      },
      {
        tag: "Geology's rule",
        title: "Split in space, not at random",
        text: "Withhold whole blocks, prospects or drill fences. Otherwise a neighbouring sample leaks the answer and every number above is meaningless.",
        accent: "oxy",
      },
    ],
  },
  {
    id: "m4-confusion",
    module: 4,
    layout: "widget",
    kicker: "04 · Interactive",
    title: "Precision, recall, and the cost of being wrong",
    lead: "Move the decision threshold and watch the four boxes trade off. In exploration the two errors have wildly different price tags — and only a geologist can set that price.",
    widget: "confusion",
    takeaway:
      "There is no 'best' threshold. A cheap RC programme wants recall; a $2M deep diamond hole wants precision. Accuracy alone hides both.",
  },
  {
    id: "m4-metrics",
    module: 4,
    layout: "table",
    kicker: "04 · Reference",
    title: "Metrics, translated into exploration language",
    lead: "When a report quotes one of these, this is the question it is actually answering.",
    table: {
      head: ["Metric", "Plain meaning", "The exploration question"],
      rows: [
        ["Accuracy", "Fraction of all predictions correct", "Nearly useless when 0.1 % of ground is mineralised — predicting 'barren' everywhere scores 99.9 %"],
        ["Precision", "Of the targets I flagged, how many were real?", "How many of my drill holes will hit? Controls wasted metres"],
        ["Recall / sensitivity", "Of the real deposits, how many did I flag?", "How many discoveries am I walking past? Controls missed opportunity"],
        ["F1 score", "Harmonic balance of precision and recall", "A single number when both errors matter roughly equally"],
        ["ROC-AUC", "Ranking quality across all thresholds", "If I drill in model order, how much better than random am I?"],
        ["R² / RMSE", "Variance explained / typical error size", "For grade prediction: is my error smaller than my sampling error?"],
        ["Success-rate curve", "Cumulative hits vs. area drilled", "The honest exploration metric: hits per km² of ground committed"],
      ],
    },
    note: "Always ask for the base rate. A 90 %-accurate model on a 5 %-prevalence target may be worse than useless.",
  },
  {
    id: "m4-kmeans",
    module: 4,
    layout: "widget",
    kicker: "04 · Live demo",
    title: "Unsupervised learning — letting the geochemistry speak",
    lead: "No labels at all. Step through k-means on a multi-element soil dataset and watch populations emerge. Then ask the geologist's question: are these domains, or artefacts?",
    widget: "kmeans",
    takeaway:
      "Clustering never tells you what a cluster means. It hands you a map of similarity and waits for you to name the units.",
  },
  {
    id: "m4-anomaly",
    module: 4,
    layout: "widget",
    kicker: "04 · Interactive",
    title: "Anomaly detection beyond the single-element threshold",
    lead: "Classical practice thresholds one element at a time. Multivariate methods find samples that are unusual in combination — the vectoring signal a single histogram hides.",
    widget: "anomaly-scatter",
    takeaway:
      "A sample can be unremarkable in every element individually and profoundly anomalous in combination. That is where multivariate methods earn their place.",
  },
  {
    id: "m4-nn",
    module: 4,
    layout: "split",
    kicker: "04 · Named, not derived",
    title: "Neural networks and deep learning, in one honest page",
    lead: "A neural network is a stack of very simple weighted sums with a bend in them. Depth lets it build its own features — that is the whole superpower, and the whole cost.",
    bullets: [
      {
        label: "01",
        title: "What it adds",
        text: "It learns the features itself. For images and spectra, hand-crafted features cannot compete — a CNN discovers texture and shape descriptors you would never write down.",
      },
      {
        label: "02",
        title: "Convolutional networks (CNNs)",
        text: "Small learned filters slid across an image. In exploration: core photo lithology, RQD and fracture picking, alteration segmentation, satellite mapping.",
      },
      {
        label: "03",
        title: "What it costs",
        text: "Thousands to millions of labelled examples, real compute, and a serious loss of interpretability. On a 900-row assay table it will lose to gradient boosting.",
      },
      {
        label: "04",
        title: "The professional rule",
        text: "Tabular geoscience data → trees and boosting. Images, spectra, waveforms and text → deep learning. Choosing the wrong family is a common beginner's error.",
      },
    ],
    note: "Large language models are deep learning too — trained on text. Their exploration use is reading, summarising and coding, not predicting mineralisation.",
    takeaway:
      "Deep learning is not 'better AI'. It is the right tool when your data is unstructured and your labels are plentiful.",
  },
  {
    id: "m4-explain",
    module: 4,
    layout: "widget",
    kicker: "04 · Interactive",
    title: "Explainability — making a model testify",
    lead: "A model that cannot be explained cannot be defended to a board, a regulator or a competent person. These are the standard tools, and their geological reading.",
    widget: "feature-importance",
    takeaway:
      "Feature importance is a hypothesis generator, not a metallogenic model. If the top feature is 'distance to road', you have found a bias, not a control.",
  },
  {
    id: "m4-quote",
    module: 4,
    layout: "quote",
    kicker: "04 · Sticky takeaway",
    title: "Module 04 in one line",
    quote:
      "A model is a compression of your training data. It can only ever tell you what pattern was in the rock you already looked at — and it will state that pattern with equal confidence in ground it has never seen.",
  },

  /* ---------------- MODULE 5 ---------------- */
  {
    id: "m5-divider",
    module: 5,
    layout: "divider",
    kicker: "Act III · 40 minutes",
    title: "AI Across the Exploration Value Chain",
    lead: "Six stops, from satellite to resource model. For each: what goes in, what comes out, and what a geologist must still check by hand.",
    objectives: [
      "Name a credible ML application at every exploration stage",
      "State the input, the output and the required human check for each",
      "Distinguish mature everyday practice from contested research",
    ],
  },
  {
    id: "m5-chain",
    module: 5,
    layout: "widget",
    kicker: "05 · Interactive map of the whole discipline",
    title: "The exploration value chain, stage by stage",
    lead: "Click any stage to see the data, the method, the output and the geologist's check. This is the reference diagram for the rest of the day.",
    widget: "workflow-chain",
  },
  {
    id: "m5-rs",
    module: 5,
    layout: "split",
    kicker: "05 · Stop 1 · Remote sensing",
    title: "Mapping alteration from orbit",
    lead: "Minerals absorb light at diagnostic wavelengths. Multispectral and hyperspectral sensors turn that physics into map-scale mineralogy over ground you have never walked.",
    bullets: [
      {
        label: "In",
        title: "ASTER, Sentinel-2, Landsat, WorldView-3, airborne hyperspectral",
        text: "Plus a DEM for topographic correction and shadow masking.",
      },
      {
        label: "Method",
        title: "Band ratios → supervised classification → spectral unmixing",
        text: "Random forest or CNN classification of alteration classes; unsupervised clustering to find spectral domains nobody defined.",
      },
      {
        label: "Out",
        title: "Clay, iron-oxide, silica and carbonate alteration maps",
        text: "Zoned argillic–phyllic–propylitic patterns, gossans, structural lineaments and vegetation-stress proxies.",
      },
      {
        label: "Check",
        title: "Field and spectral validation",
        text: "Vegetation, salt crusts, dust and shade all mimic alteration. Ground-truth with a portable spectrometer or you will chase salt lakes.",
      },
    ],
    figure: {
      image: "alteration",
      caption:
        "Band-ratio composite over an arid range: argillic (red) and propylitic (green) zoning around a mineralised centre.",
      scale: "1:50,000",
      pins: [
        { x: 50, y: 46, label: "1", accent: "oxy", text: "Argillic core — clay-rich, model's strongest class" },
        { x: 68, y: 62, label: "2", accent: "moss", text: "Propylitic halo — chlorite/epidote outer shell" },
        { x: 22, y: 30, label: "3", accent: "ochre", text: "False positive: playa evaporite spectrally similar to clay" },
      ],
    },
    takeaway: "Remote sensing is the cheapest square-kilometre in exploration — and the easiest to over-interpret.",
  },
  {
    id: "m5-geochem",
    module: 5,
    layout: "split",
    kicker: "05 · Stop 2 · Geochemistry",
    title: "Multivariate anomaly detection and vectoring",
    lead: "Modern assays give 50+ elements per sample. Reading them one histogram at a time throws away nearly all the information.",
    bullets: [
      {
        label: "In",
        title: "Soil, stream sediment, rock chip, biogeochemical and lag surveys",
        text: "With QA/QC records, detection limits and log-ratio transforms applied first — assays are compositional data.",
      },
      {
        label: "Method",
        title: "PCA, clustering, isolation forest, autoencoders, RF regression",
        text: "Plus classic geostatistics for continuity, and compositional data analysis to avoid closure artefacts.",
      },
      {
        label: "Out",
        title: "Anomaly scores, element associations, vectors toward a centre",
        text: "Separated background populations per regolith domain, and residual maps after removing lithological background.",
      },
      {
        label: "Check",
        title: "Regolith, contamination and support",
        text: "Is the anomaly a deposit, a transported horizon, a fence line, or a lab batch? Walk it, and check the duplicates.",
      },
    ],
    note: "Best-practice sequence: regolith domain first, background per domain second, anomaly third. Skipping step one produces a beautiful map of the regolith.",
  },
  {
    id: "m5-geophys",
    module: 5,
    layout: "split",
    kicker: "05 · Stop 3 · Geophysics",
    title: "From inversion to interpretation",
    lead: "Geophysics gives you physical properties at depth — density, susceptibility, conductivity. AI helps with the two hard parts: speeding up inversion and interpreting the result.",
    bullets: [
      {
        label: "In",
        title: "Magnetics, gravity, EM/AEM, IP, seismic, MT, downhole logs",
        text: "Plus petrophysical measurements on core to tie physical property to rock type.",
      },
      {
        label: "Method",
        title: "ML-accelerated inversion, learned regularisation, classification of property models",
        text: "Neural surrogates that approximate a forward model in milliseconds; clustering of multi-property voxels into lithological domains.",
      },
      {
        label: "Out",
        title: "3D property volumes, automated lineament picks, litho-predicted blocks",
        text: "Depth-to-basement surfaces, conductor picks, and probability volumes for a target physical signature.",
      },
      {
        label: "Check",
        title: "Non-uniqueness never goes away",
        text: "Many earth models fit the same data. AI makes inversion faster and smoother — it does not make the answer unique. Always ask what physics constrained it.",
      },
    ],
    figure: {
      image: "magnetics",
      caption:
        "TMI grid with automated lineament extraction. The machine finds edges; the geologist decides which edges are faults.",
      scale: "1:100,000",
      pins: [
        { x: 44, y: 42, label: "1", accent: "slate", text: "Auto-extracted lineament coincident with mapped shear" },
        { x: 72, y: 26, label: "2", accent: "ochre", text: "Edge caused by survey merge — rejected on inspection" },
      ],
    },
    takeaway: "Geophysical inversion is non-unique by nature. A machine-learned prior is still a prior — state it.",
  },
  {
    id: "m5-core",
    module: 5,
    layout: "widget",
    kicker: "05 · Stop 4 · Drilling & core",
    title: "Computer vision on core — the most mature application in the industry",
    lead: "Core photography, hyperspectral scanning and downhole logs make drilling the richest data stream in exploration. Step through what a vision pipeline extracts, and where it goes wrong.",
    widget: "core-logging-cv",
    takeaway:
      "Automated logging is not about replacing the logger. It is about making the logger's data consistent across four geologists and fifteen years.",
  },
  {
    id: "m5-modelling",
    module: 5,
    layout: "cards",
    kicker: "05 · Stop 5 · Geological modelling",
    title: "3D modelling, domaining and resource estimation",
    lead: "Implicit modelling already replaced hand-drawn sections. Machine learning is now pushing into the interpretation and estimation steps beyond it.",
    cards: [
      {
        tag: "Implicit modelling",
        title: "Surfaces from data, not from sections",
        text: "Radial basis functions fit a continuous field to logged contacts. Standard practice — fast, repeatable, and easy to update when a new hole lands.",
        accent: "moss",
      },
      {
        tag: "Auto-domaining",
        title: "Clustering into estimation domains",
        text: "Grouping composites by geochemistry, alteration and structure to define stationary domains. Must be checked against genetic logic, not just statistics.",
        accent: "ochre",
      },
      {
        tag: "Grade estimation",
        title: "ML alongside kriging",
        text: "Gradient boosting can beat kriging where relationships are non-linear and multivariate — but loses the explicit variogram and unbiasedness guarantees.",
        accent: "slate",
      },
      {
        tag: "Uncertainty",
        title: "Simulation, not a single answer",
        text: "Multiple equally-plausible realisations give a probability distribution per block. Essential for classification and for honest risk statements.",
        accent: "oxy",
      },
    ],
    note: "Reporting codes (JORC, NI 43-101, PERC) require a Competent Person to take responsibility. No model signs a technical report — a named human does.",
  },
  {
    id: "m5-governance",
    module: 5,
    layout: "cards",
    kicker: "05 · How modern exploration teams actually work",
    title: "The plumbing behind every AI result: data governance",
    lead: "The companies getting value from AI are not the ones with the cleverest algorithms. They are the ones whose data can be found, trusted, reproduced and legally used.",
    cards: [
      {
        tag: "Single source of truth",
        title: "One database, not forty spreadsheets",
        text: "A validated drill and sample database with enforced codes and units. Every model, plot and report reads from it. Exports are disposable; the database is the asset.",
        accent: "moss",
      },
      {
        tag: "Lineage",
        title: "Every number traceable back to a sample",
        text: "Lab batch, method, detection limit, date, who touched it, which transform was applied. Without lineage you cannot defend a result or repeat it in two years.",
        accent: "slate",
      },
      {
        tag: "Reproducibility",
        title: "Scripts and version control, not manual clicks",
        text: "A notebook plus a recorded data version reproduces the map exactly. 'I re-did the steps in Excel and got a slightly different answer' is not a professional position.",
        accent: "ochre",
      },
      {
        tag: "Permission & confidentiality",
        title: "What you are allowed to use, and where",
        text: "Unpublished assays, tenure and heritage information carry disclosure, licensing and Indigenous data obligations. Pasting them into a public AI tool is a disclosure event, not a shortcut.",
        accent: "oxy",
      },
    ],
    takeaway:
      "A graduate who can build and document a trustworthy project database is more employable than one who can name ten algorithms. This is the least glamorous, most bankable skill in the room.",
  },

  {
    id: "m5-target",
    module: 5,
    layout: "steps",
    kicker: "05 · Stop 6 · Prospectivity & targeting",
    title: "Prospectivity mapping, done defensibly",
    lead: "This is the flagship application and the most abused one. Done properly it is a hypothesis-testing framework, not a treasure map.",
    steps: [
      {
        title: "Write the mineral system model first",
        text: "Source, transport, trap, deposition, preservation. If you cannot name the ore-forming process you are targeting, no algorithm will rescue you.",
        accent: "oxy",
      },
      {
        title: "Translate each ingredient into a mappable proxy",
        text: "Fertile intrusion → geochemical index. Crustal-scale plumbing → gravity gradient. Trap → fault intersection density. This step is pure geology.",
        accent: "ochre",
      },
      {
        title: "Choose knowledge-driven or data-driven",
        text: "Few or no known deposits → weights of a geologist (fuzzy logic, WofE). Enough training points → random forest, boosting, or PU learning.",
        accent: "moss",
      },
      {
        title: "Validate spatially and honestly",
        text: "Leave-one-deposit-out, success-rate curves, and a stated base rate. Report area committed per hit, not just AUC.",
        accent: "slate",
      },
      {
        title: "Rank targets with a geologist in the loop",
        text: "Score, plus depth, plus access, plus tenure, plus drillability. The model orders candidates; the team commits the metres.",
        accent: "oxy",
      },
    ],
    takeaway:
      "A prospectivity map is a statement of a hypothesis about a mineral system. Judge it the way you judge any hypothesis: by what it predicted before you drilled.",
  },
  {
    id: "m5-quiz",
    module: 5,
    layout: "widget",
    kicker: "05 · Activity · 6 min",
    title: "Match the application to the stage",
    lead: "Fast round. Pick the answer you would defend in a technical meeting.",
    widget: "quiz",
    activityLabel: "Pairs · then discuss",
    quiz: [
      {
        prompt:
          "A junior explorer has 400 km² of greenfields ground, no drill holes, and regional magnetics and geochemistry. Which approach is appropriate?",
        options: [
          { text: "Supervised random forest trained on deposits from another continent", why: "Transferring a model across metallogenic provinces without recalibration is the classic failure — different controls, different scales." },
          { text: "Knowledge-driven prospectivity (fuzzy logic / weights of evidence) from a mineral system model", correct: true, why: "With no local positives, expert-weighted evidence layers are the defensible choice." },
          { text: "A deep neural network on raw grids", why: "No labels and no volume — deep learning has nothing to learn from here." },
          { text: "k-means on the magnetics alone", why: "Useful for domaining, but it answers 'what is similar?', not 'where is prospective ground?'" },
        ],
      },
      {
        prompt:
          "Your lithology model reports 97 % accuracy. Test intervals were selected randomly from all logged intervals. What is your first question?",
        options: [
          { text: "Which loss function was used?", why: "A detail. The structural problem is upstream of it." },
          { text: "Were test intervals spatially separated from training intervals?", correct: true, why: "Random row splits on downhole data leak neighbouring intervals — this is the number-one cause of fantasy accuracy." },
          { text: "How many trees were in the forest?", why: "A tuning parameter, not the source of the inflated score." },
          { text: "Can we deploy it to the next project?", why: "Not until the validation design is fixed." },
        ],
      },
      {
        prompt: "Which of these is a genuinely mature, everyday AI application in exploration today?",
        options: [
          { text: "Automated RQD and fracture counting from core imagery", correct: true, why: "Well-posed vision task, abundant labels, and instantly verifiable by eye." },
          { text: "Autonomous selection of drill targets without geologist review", why: "No documented practice — and no regulator would accept it." },
          { text: "Predicting a deposit's existence from satellite imagery alone", why: "Alteration mapping is real; predicting ore from orbit alone is not." },
          { text: "Replacing QA/QC with anomaly detection", why: "Anomaly detection helps flag suspect batches, but it cannot replace blanks, standards and duplicates." },
        ],
      },
      {
        prompt: "Multi-element soil assays are compositional data. Why does that matter before modelling?",
        options: [
          { text: "It does not — percentages are just numbers", why: "Closure creates spurious negative correlations; ignoring it produces artefacts." },
          { text: "Because values sum to a constant, correlations are distorted and need log-ratio transforms", correct: true, why: "Exactly — CLR/ILR transforms restore meaningful correlation structure." },
          { text: "Because assays are always normally distributed", why: "They are typically strongly skewed, which is a separate issue." },
          { text: "Because detection limits are always zero", why: "Detection limits are non-zero and must be handled as censored data." },
        ],
      },
    ],
  },

  /* ---------------- MODULE 6 ---------------- */
  {
    id: "m6-divider",
    module: 6,
    layout: "divider",
    kicker: "Act III · 30 minutes · the centrepiece",
    title: "Case Study — Project Solstice",
    lead: "A synthetic porphyry Cu–Au district, 480 km², covered by 40 m of post-mineral gravel. You are the graduate geologist on the targeting team. Twenty of these thirty minutes are yours.",
    objectives: [
      "Follow one exploration problem from data compilation to a drill decision",
      "Produce and defend your own target ranking before seeing the model's",
      "Identify which model output you would refuse to act on, and why",
    ],
  },
  {
    id: "m6-setting",
    module: 6,
    layout: "split",
    kicker: "06 · The ground",
    title: "The setting and the mineral system model",
    lead: "Before any data: what are we hunting, and what would it leave behind? Everything downstream is a search for these fingerprints.",
    bullets: [
      {
        label: "Target",
        title: "Calc-alkaline porphyry Cu–Au, 300–600 m depth",
        text: "Late Cretaceous arc setting, dioritic to granodioritic stocks along a crustal-scale structure.",
      },
      {
        label: "Fingerprints",
        title: "Zoned alteration, magnetite destruction, sulphide halo",
        text: "Potassic core → phyllic → propylitic; a magnetic low within a magnetic high; disseminated pyrite giving a chargeability anomaly.",
      },
      {
        label: "Pathfinders",
        title: "Cu–Mo–Au, plus As–Sb–Zn distal signature",
        text: "Cu/Mo ratio vectors toward the centre; Zn/Cu increases outward — a usable direction, not just an intensity.",
      },
      {
        label: "Problem",
        title: "40 m of transported cover",
        text: "Surface geochemistry is diluted and displaced. Nothing outcrops. Everything must be inferred from indirect evidence.",
      },
    ],
    figure: {
      image: "prospectivity",
      caption: "Project Solstice — compiled evidence layers over the licence, prior to modelling.",
      scale: "1:75,000",
      pins: [
        { x: 38, y: 42, label: "A", accent: "oxy", text: "Historic prospect — three shallow holes, best 0.31 % Cu" },
        { x: 62, y: 52, label: "B", accent: "slate", text: "Untested magnetic low on the main structure" },
        { x: 26, y: 70, label: "C", accent: "moss", text: "Coincident IP chargeability and Cu-in-soil anomaly" },
      ],
    },
  },
  {
    id: "m6-data",
    module: 6,
    layout: "table",
    kicker: "06 · The compilation",
    title: "What we actually have — and its honest state",
    lead: "This is the inventory that would go to a technical committee. Note the last column: it decides what the model is even allowed to attempt.",
    table: {
      head: ["Layer", "Coverage", "Vintage", "Fitness for modelling"],
      rows: [
        ["Airborne magnetics", "100 %, 200 m lines", "2019", "Good — single survey, consistent height"],
        ["Gravity", "1 km stations, 60 % of area", "1994 + 2021", "Two datums, needs levelling; gap in the north-east"],
        ["IP / resistivity", "6 lines, 4 % of area", "2022", "Excellent quality, tiny coverage — cannot be a model input everywhere"],
        ["Soil geochemistry", "400 × 100 m grid, 70 %", "2008–2021", "Three labs, two detection limits, no umpire re-assays"],
        ["ASTER alteration", "100 %", "2004", "Compromised by cover; useful only on the ranges"],
        ["Drill holes", "17 holes, all near prospect A", "1996–2014", "Severe sampling bias — this is our only training data"],
        ["Structural interpretation", "100 %", "2023", "Interpretation, not measurement; one author, one model"],
      ],
    },
    note: "Seventeen holes, sixteen of them within 900 m of each other. Hold that thought — Module 07 is going to reopen it.",
  },
  {
    id: "m6-features",
    module: 6,
    layout: "steps",
    kicker: "06 · The build",
    title: "How Solstice's evidence layers became features",
    lead: "Twelve features on a 100 × 100 m grid. Every one traceable to a mineral-system ingredient — this is the table that makes the model defensible.",
    steps: [
      {
        title: "Fertility & source",
        text: "Gravity residual (buried intrusion proxy), magnetic susceptibility contrast, ASTER K-alteration index where cover permits.",
        accent: "ochre",
      },
      {
        title: "Plumbing & trap",
        text: "Distance to interpreted crustal structure, fault intersection density, curvature of the interpreted basement surface.",
        accent: "slate",
      },
      {
        title: "Alteration & sulphide",
        text: "Magnetic low within regional high (magnetite destruction), IP chargeability where surveyed, soil Cu/Mo ratio, Zn/Cu vector.",
        accent: "oxy",
      },
      {
        title: "Cover correction",
        text: "Modelled cover thickness from AEM used to normalise soil geochemistry — without it the model learns cover thickness, not mineralisation.",
        accent: "moss",
      },
      {
        title: "Label construction",
        text: "Positives: intervals > 0.2 % Cu from the 17 holes. Negatives: only holes that tested a target and failed — not unexplored ground.",
        accent: "oxy",
      },
      {
        title: "Validation design",
        text: "Leave-one-prospect-out. With one prospect cluster, we accept the model is a hypothesis ranker, not a validated predictor. Stated up front.",
        accent: "slate",
      },
    ],
  },
  {
    id: "m6-activity",
    module: 6,
    layout: "widget",
    kicker: "06 · The activity · 20 min",
    title: "You rank the targets — then the model does",
    lead: "Five candidate targets, with the evidence for each. Order them for the next drill programme, commit to your ranking, then reveal the model's ranking and the drilling outcome.",
    widget: "rank-targets",
    activityLabel: "Small groups · commit before revealing",
    takeaway:
      "Where you and the model agree, you gain confidence cheaply. Where you disagree is the only interesting part of the exercise — that disagreement is the real deliverable.",
  },
  {
    id: "m6-decision",
    module: 6,
    layout: "compare",
    kicker: "06 · The decision",
    title: "What the targeting committee actually decided",
    lead: "The model's ranking was one input among six. Here is the reasoning, in the form it appeared in the programme memo.",
    compare: {
      leftTitle: "Accepted from the model",
      left: [
        "Target B promoted from 4th to 1st: the magnetic-low-within-high plus structural intersection combination was ranked highly, and no human had connected those two layers.",
        "Nine hundred hectares of the licence's north-west deprioritised, saving an entire soil programme.",
        "Cu/Mo ratio confirmed as the strongest geochemical feature — consistent with the porphyry model, so we trust the mechanism, not just the score.",
      ],
      rightTitle: "Overruled by geologists",
      right: [
        "Target 2 rejected despite the second-highest score: its high score came almost entirely from soil samples later traced to a single 2008 lab batch with a drifting standard.",
        "Model's low score for Target E ignored: it sits under thick cover where every input layer is weak, so a low score means 'no information', not 'no deposit'.",
        "Ranking not used to set hole depth or orientation — the model has no concept of drill geometry or ore-body plunge.",
      ],
    },
    takeaway:
      "'The model said so' is never a reason. 'The model ranked it highly, the mechanism is consistent with our system model, and the inputs are trustworthy there' is a reason.",
  },
  {
    id: "m6-outcome",
    module: 6,
    layout: "cards",
    kicker: "06 · The outcome",
    title: "Four holes later",
    lead: "The honest scorecard. Note that the model's most valuable contribution was not its top pick.",
    cards: [
      {
        tag: "Hole 1 — Target B",
        title: "0.48 % Cu, 0.3 g/t Au over 180 m from 410 m",
        text: "Potassic alteration with a phyllic overprint. The layer combination the model surfaced was real, and no team member had prioritised it.",
        accent: "oxy",
      },
      {
        tag: "Hole 2 — Target C",
        title: "Barren propylitic alteration, weak pyrite",
        text: "Distal halo, wrong side of the system. Not a failure — it constrained the zoning and re-vectored the next hole.",
        accent: "moss",
      },
      {
        tag: "Hole 3 — Target A",
        title: "Confirmed known low-grade shell only",
        text: "The historic prospect was the model's second pick, purely because it contained all the training data. A predictable artefact of sampling bias.",
        accent: "ochre",
      },
      {
        tag: "The real win",
        title: "Ground eliminated with defensible reasoning",
        text: "Half the licence deprioritised on documented, reproducible criteria. That decision is auditable next year when a new geologist inherits the project.",
        accent: "slate",
      },
    ],
  },
  {
    id: "m6-quote",
    module: 6,
    layout: "quote",
    kicker: "06 · Sticky takeaway",
    title: "Module 06 in one line",
    quote:
      "The model did not find the deposit. It read forty thousand grid cells across twelve layers without getting tired, and told a geologist which three deserved a hard look. The geologist did the rest.",
  },
];
