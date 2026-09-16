import { modules, slides } from "./index";
import type { Slide, WidgetKey } from "./types";

export type SlideTranscript = {
  slideNumber: number;
  slideId: string;
  slideTitle: string;
  moduleCode: string;
  moduleTitle: string;
  act: string;
  timing: string;
  purpose: string;
  opening: string;
  walkthrough: { label: string; text: string }[];
  emphasise: string[];
  example: string;
  interaction: string[];
  transition: string;
};

const widgetGuide: Record<WidgetKey, { how: string; ask: string; watch: string }> = {
  poll: {
    how: "This live poll captures what you already believe before the ideas ahead are introduced formally. Look at the spread of answers across the group, not just the majority — the disagreement is the real starting point.",
    ask: "Which answer would you have given, and what made you believe it before this module?",
    watch: "No answer here is judged right or wrong. The point is to expose the assumptions you are walking in with, so you can revisit them once the material has been covered.",
  },
  quiz: {
    how: "Each quiz question includes an explanation for the correct answer as well as for the tempting wrong ones. Read every explanation, even for options you already got right.",
    ask: "Before checking the answer, ask yourself why the most tempting wrong option seems plausible.",
    watch: "A question you get wrong is more useful than one you get right — treat it as a signal to re-read the surrounding material rather than move on.",
  },
  "ml-vs-rules": {
    how: "This comparison places a hand-written rule and a learned model side by side on the same input data. The rule encodes something already known explicitly; the model instead infers a pattern from examples.",
    ask: "When would a hand-written rule be the better professional choice over a learned model?",
    watch: "Machine learning is not inherently smarter than a rule. It is only better at finding combinations of variables that nobody has written down yet.",
  },
  "data-shapes": {
    how: "Four data shapes are presented in turn — tabular, spatial, time-series and image/text — each constraining which methods are even applicable before any modelling choice is made.",
    ask: "Which shape best matches a dataset you have used in your own coursework or fieldwork?",
    watch: "The shape of a dataset, not fashion or hype, decides which family of methods can be applied to it.",
  },
  "clean-data": {
    how: "This walks through common data-quality problems one at a time — mismatched units, values below detection limit, duplicate sample IDs, inconsistent lithology codes — showing how each fix changes an overall data-quality score.",
    ask: "Which single fix do you expect changed the score the most, and what geological reasoning justifies it?",
    watch: "Every cleaning decision here is a geological judgement, not a spreadsheet trick — each one needs a defensible reason.",
  },
  "feature-builder": {
    how: "Features are built one at a time from raw assay values: ratios expressed as vectors, distance-to-structure as a geological control, an alteration index as a proxy for the mineral system.",
    ask: "What additional feature would you propose here, and what geological reasoning would support it?",
    watch: "A feature that improves a score but that nobody can explain geologically should be treated with suspicion, not celebrated.",
  },
  "decision-tree": {
    how: "The tree grows one split at a time. Each split can be read as a single yes/no question about one measured value, in the same way a dichotomous identification key works.",
    ask: "Does the first split match the variable you would have chosen as the strongest discriminator?",
    watch: "A tree grown too deep starts memorising noise in the training data rather than learning genuine structure — an early, visible sign of overfitting.",
  },
  overfit: {
    how: "Sliding model complexity from simple to complex shows the training score keep improving indefinitely, while the test score improves and then turns worse.",
    ask: "At what level of complexity would you stop, and what evidence justifies stopping there?",
    watch: "The gap between training and test performance is the single most reliable overfitting check available — more useful than either score alone.",
  },
  kmeans: {
    how: "Clustering groups the sample cloud into a chosen number of groups, k. Changing k can change which groupings the algorithm proposes, sometimes substantially.",
    ask: "Do the resulting clusters correspond to a real geological distinction — lithology, alteration — or could they be an artefact of where samples were collected?",
    watch: "Clustering has no single correct answer. It proposes candidate domains; a geologist still has to accept or reject each one.",
  },
  "anomaly-scatter": {
    how: "Moving the anomaly threshold changes which points on the scatter plot are flagged, showing where the boundary between background and anomaly actually sits.",
    ask: "Which flagged points would genuinely be worth following up in the field, and which look like contamination or analytical error?",
    watch: "A statistical anomaly only becomes an exploration target once a geologist gives it a plausible mineral-system explanation.",
  },
  confusion: {
    how: "The confusion matrix is filled in using exploration language: deposits found, deposits missed, holes drilled for nothing, and ground correctly left undrilled.",
    ask: "Which of the two error types — a missed deposit or a wasted hole — is more costly on a project you know, and how would that change the model you would choose?",
    watch: "Accuracy alone is close to meaningless when true deposits are rare in the dataset; false positives and false negatives matter far more.",
  },
  "threshold-map": {
    how: "Sweeping the probability threshold across the map changes the footprint of ground that would be selected for drilling, expanding or shrinking as the threshold moves.",
    ask: "What threshold would you set for a ten-hole budget, and how would that change for a two-hole budget?",
    watch: "The model never chooses the threshold by itself — budget, risk appetite and the cost of each error type decide it.",
  },
  "feature-importance": {
    how: "The ranking shows which input variables drove the model's prediction, which can be read directly as a geological hypothesis about the mineral system.",
    ask: "Do the top-ranked drivers make geological sense, and what would it mean if they did not?",
    watch: "Importance is not the same as causation, and a variable that has leaked information from the answer often ranks highest — a warning sign, not a success.",
  },
  "rank-targets": {
    how: "The same candidate targets are ranked three different ways in turn — by prospectivity, by confidence, and by drill feasibility — and the order changes each time.",
    ask: "Which target would you drill first, and what single piece of new evidence would change your answer?",
    watch: "Prospectivity, confidence and feasibility are three separate axes; collapsing them into a single number hides the real decision that has to be made.",
  },
  "bias-spotter": {
    how: "Each scenario presents a plausible-looking result that contains one specific flaw — sampling bias, spatial leakage, label bias, or false confidence.",
    ask: "Can you name a comparable failure from your own field or laboratory work?",
    watch: "Naming a failure precisely is what makes it possible to catch again later in industry — a vague sense that something is wrong is not enough.",
  },
  "workflow-chain": {
    how: "The end-to-end workflow is assembled step by step, and skipping an early step visibly breaks something further down the chain.",
    ask: "Which step in this chain do you expect will consume the most time in practice?",
    watch: "Every workflow ends with a human decision and a validation gate — never with a model score by itself.",
  },
  "core-logging-cv": {
    how: "The computer-vision demo runs on real core imagery, showing confident correct predictions, borderline cases, and outright failures side by side.",
    ask: "What should go into the human review queue, and who should sign off on the final log?",
    watch: "Computer vision improves consistency and speed, not geological interpretation — the geologist still owns the final log.",
  },
  "animated-workflow": {
    how: "The animated workflow plays through gate by gate, each one paired with a human check and a deliverable that has to exist before the next gate can be passed.",
    ask: "At which gate would you personally choose to stop rather than continue, and what evidence would make you do that?",
    watch: "The gates themselves are the content here — the stage names alone are not the point.",
  },
  "ai-hierarchy": {
    how: "The nested diagram expands outward from artificial intelligence down to deep learning and generative models, with one exploration example placed at each layer.",
    ask: "Where would a decision-tree prospectivity model sit in this hierarchy, and where would a chatbot summarising reports sit?",
    watch: "These terms are often used interchangeably in casual conversation; keeping them distinct is worth the small extra effort.",
  },
  glossary: {
    how: "The glossary works as a lookup rather than a narrative — use it whenever a term earlier in the workshop was left undefined.",
    ask: "Which term from this workshop could you now explain clearly to a supervisor?",
    watch: "This glossary is included in full in the exported guide for later revision, so there is no need to memorise it in one sitting.",
  },
};

const layoutPurpose: Record<Slide["layout"], string> = {
  title: "Opens the workshop, sets expectations, and establishes the geology-first approach for the day.",
  divider: "Closes the previous topic and states plainly what this module will cover.",
  split: "Develops one main idea, supported by a small set of named points, anchored to a figure or numbers.",
  cards: "Presents parallel concepts of equal weight so they can be compared side by side.",
  steps: "Shows an ordered procedure that can be repeated on a real project.",
  table: "Gives a reference comparison to return to later.",
  compare: "Draws an explicit contrast so the boundary between two ideas is clear.",
  widget: "Turns the idea into a live, interactive demonstration rather than a static claim.",
  diagram: "Shows a full workflow at a glance before its stages are examined individually.",
  quote: "Slows the pace and lets one idea land before moving on.",
};

function sentence(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return "";
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function timingFor(slide: Slide, index: number) {
  const mod = modules.find((m) => m.index === slide.module);
  if (!mod) return "—";
  const count = slides.filter((s) => s.module === slide.module).length;
  if (!mod.minutes) return "Self-study · allow 4–6 minutes if delivered live";
  const per = mod.minutes / Math.max(1, count);
  const position = slides.slice(0, index).filter((s) => s.module === slide.module).length;
  const minutes = Math.max(1, Math.round(per));
  return `≈ ${minutes} min (slide ${position + 1} of ${count} in module ${mod.code}, ${mod.time})`;
}

function walkthroughFor(slide: Slide): { label: string; text: string }[] {
  const out: { label: string; text: string }[] = [];

  if (slide.layout === "title" || slide.layout === "divider") {
    slide.stats?.forEach((s) =>
      out.push({
        label: `${s.value} — ${s.label}`,
        text: `This figure — ${s.value} — represents ${s.label.toLowerCase()}.`,
      }),
    );
    slide.objectives?.forEach((o, i) =>
      out.push({
        label: `Objective ${i + 1}`,
        text: `By the end of this module, you should be able to ${o.charAt(0).toLowerCase()}${o.slice(1)}.`,
      }),
    );
  }

  slide.bullets?.forEach((b, i) =>
    out.push({
      label: b.title ?? b.label ?? `Point ${i + 1}`,
      text: sentence(b.text),
    }),
  );

  slide.cards?.forEach((c) =>
    out.push({
      label: `${c.tag ? `${c.tag} · ` : ""}${c.title}`,
      text: sentence(c.text),
    }),
  );

  slide.steps?.forEach((s, i) =>
    out.push({
      label: `Step ${i + 1} — ${s.title}`,
      text: sentence(s.text),
    }),
  );

  if (slide.compare) {
    out.push({
      label: slide.compare.leftTitle,
      text: `${slide.compare.left.map((l) => l.replace(/\.$/, "")).join("; ")}.`,
    });
    out.push({
      label: slide.compare.rightTitle,
      text: `${slide.compare.right.map((r) => r.replace(/\.$/, "")).join("; ")}. The boundary between the two columns is the concept to hold onto here.`,
    });
  }

  if (slide.table) {
    out.push({
      label: "How to read this table",
      text: `Columns are ${slide.table.head.join(", ")}. Treat it as reference material to return to rather than something to memorise in one pass.`,
    });
    slide.table.rows.slice(0, 3).forEach((row) =>
      out.push({
        label: row[0] ?? "Row",
        text: row
          .slice(1)
          .map((cell, ci) => `${slide.table?.head[ci + 1] ?? ""}: ${cell}`)
          .join(" · "),
      }),
    );
  }

  if (slide.diagram) {
    out.push({
      label: "How to read this diagram",
      text: `${sentence(slide.diagram.intro)} Trace the whole path left to right before focusing on any individual box.`,
    });
    slide.diagram.lanes.forEach((lane) =>
      out.push({
        label: `Lane — ${lane.label}`,
        text: lane.nodes.map((n) => `${n.title}: ${n.text.replace(/\.$/, "")}`).join(" · "),
      }),
    );
    out.push({
      label: "The feedback loop",
      text: `${sentence(slide.diagram.feedback)} This feedback loop is what separates a genuine exploration workflow from a one-off model run.`,
    });
  }

  if (slide.workflow) {
    out.push({
      label: "The central question",
      text: `${sentence(slide.workflow.question)} The decision it feeds is: ${sentence(slide.workflow.decision)}`,
    });
    slide.workflow.steps.forEach((s, i) =>
      out.push({
        label: `Gate ${i + 1} — ${s.phase}: ${s.title}`,
        text: `${sentence(s.detail)} Human check: ${sentence(s.check)} Deliverable: ${sentence(s.output)}`,
      }),
    );
  }

  if (slide.vocab?.length) {
    out.push({
      label: "Key vocabulary",
      text: slide.vocab.map((v) => `${v.term} — ${v.meaning.replace(/\.$/, "")}`).join(" · "),
    });
  }

  if (slide.quote) {
    out.push({
      label: "Why this quote matters",
      text: `Consider why this idea matters for your career rather than only for an exam${slide.attribution ? ` — it comes from ${slide.attribution}` : ""}.`,
    });
  }

  if (slide.figure) {
    out.push({
      label: "Reading the figure",
      text: `Caption: ${sentence(slide.figure.caption)} ${slide.figure.scale ? `Note the scale (${slide.figure.scale}) explicitly — it is easy to misjudge the footprint. ` : ""}${slide.figure.pins?.length ? `Annotations, in order: ${slide.figure.pins.map((p) => `${p.label} (${p.text.replace(/\.$/, "")})`).join("; ")}.` : "Look for what stands out before reading any interpretation into it."}`,
    });
  }

  if (slide.widget) {
    const guide = widgetGuide[slide.widget];
    if (guide) out.push({ label: "Using this interactive demonstration", text: guide.how });
  }

  if (!out.length) {
    out.push({
      label: "The core idea",
      text: sentence(slide.lead ?? slide.title),
    });
  }

  return out;
}

function emphasiseFor(slide: Slide): string[] {
  const points: string[] = [];
  if (slide.takeaway) points.push(sentence(slide.takeaway));
  if (slide.note) points.push(`Field note: ${sentence(slide.note)}`);
  if (slide.widget && widgetGuide[slide.widget]) points.push(widgetGuide[slide.widget]!.watch);
  if (slide.layout === "table") points.push("Treat this table as reference material to return to later rather than something to memorise in one pass.");
  if (slide.figure) points.push("Describe what you see using geological vocabulary — alteration, structure, grade — before reaching for model vocabulary such as features or scores.");
  points.push("Whatever a model produces, a geologist still has to defend it with evidence that would satisfy a Competent Person.");
  return points;
}

function exampleFor(slide: Slide, index: number): string {
  const mod = modules.find((m) => m.index === slide.module);
  const pool = [
    "a porphyry Cu–Au district where soil geochemistry, magnetics and mapped alteration all point at slightly different centres",
    "an orogenic gold camp where the best predictor turned out to be distance to a second-order structure, not any single assay",
    "a nickel sulphide project where an EM conductor was chased for two seasons before it was shown to be graphitic",
    "a laterite terrain where spectral alteration maps flagged hundreds of false positives until ground-truthing filtered them",
    "a brownfields project where a legacy database mixed three different assay labs and two lithology dictionaries",
    "a district where a prospectivity model scored ground highest exactly where historical drilling was densest",
  ];
  const pick = pool[index % pool.length];
  return `Consider ${pick}. Think through what was drilled, what was found, and what the team would do differently with hindsight — the geological reasoning behind that decision matters more than any algorithm involved. This example connects directly to "${mod?.title ?? "this module"}".`;
}

function interactionFor(slide: Slide): string[] {
  const items: string[] = [];
  if (slide.activityLabel) items.push(`This section is marked "${slide.activityLabel}" — treat it as a hands-on exercise rather than passive reading.`);
  if (slide.widget && widgetGuide[slide.widget]) items.push(widgetGuide[slide.widget]!.ask);
  if (slide.quiz?.length) {
    slide.quiz.forEach((q, i) => {
      const correct = q.options.find((o) => o.correct);
      items.push(
        `Question ${i + 1}: "${q.prompt}" Correct answer: ${correct?.text ?? "see slide"}.${correct?.why ? ` ${sentence(correct.why)}` : ""} It is worth understanding why the other options are wrong: ${q.options.filter((o) => !o.correct).map((o) => `${o.text}${o.why ? ` (${o.why.replace(/\.$/, "")})` : ""}`).join("; ")}.`,
      );
    });
  }
  if (slide.objectives?.length) items.push("Before moving on, check that you could explain each objective above in your own words.");
  if (!items.length) {
    items.push(
      `Ask yourself: how would you explain "${slide.title}" to a field assistant with no AI background? If you cannot do it in one sentence, re-read the section above.`,
    );
  }
  return items;
}

function transitionFor(slide: Slide, index: number): string {
  const next = slides[index + 1];
  if (!next) return "This is the final slide of the workshop. Decide on one thing from today to try within the next two weeks, and use the reference library modules in this guide for further self-study.";
  const sameModule = next.module === slide.module;
  const nextModule = modules.find((m) => m.index === next.module);
  if (!sameModule) {
    return `This closes ${modules.find((m) => m.index === slide.module)?.code ?? ""} and moves into ${nextModule?.code ?? ""} — ${nextModule?.title ?? ""}. ${nextModule?.subtitle ?? next.title} is the question that follows naturally from what has just been covered.`;
  }
  const settled = (slide.takeaway ?? slide.title).split(/(?<=[.!?])\s/)[0]!.replace(/[.!?]$/, "");
  const settledPhrase = `${settled.charAt(0).toLowerCase()}${settled.slice(1)}`;
  return `With ${settledPhrase} established, the next question is ${next.title.toLowerCase()}.`;
}

export function buildTranscript(): SlideTranscript[] {
  return slides.map((slide, index) => {
    const mod = modules.find((m) => m.index === slide.module);
    return {
      slideNumber: index + 1,
      slideId: slide.id,
      slideTitle: slide.title,
      moduleCode: mod?.code ?? "—",
      moduleTitle: mod?.title ?? "—",
      act: mod?.act ?? "—",
      timing: timingFor(slide, index),
      purpose: layoutPurpose[slide.layout],
      opening: `${slide.kicker ? `${slide.kicker}. ` : ""}${sentence(slide.lead ?? slide.title)}${slide.layout === "divider" ? " The objectives below define exactly what this module expects you to be able to do by its end." : ""}`,
      walkthrough: walkthroughFor(slide),
      emphasise: emphasiseFor(slide),
      example: exampleFor(slide, index),
      interaction: interactionFor(slide),
      transition: transitionFor(slide, index),
    };
  });
}

