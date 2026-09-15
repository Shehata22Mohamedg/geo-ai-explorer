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
    how: "Open the poll on screen and read each option aloud before anyone commits. Let the room vote by hand or on their own device, then reveal the spread and talk about why the answers differ rather than which one wins.",
    ask: "Ask two students with opposite answers to defend their choice in one sentence each.",
    watch: "Do not correct votes. The point is to expose the assumptions students walk in with so you can revisit them at the end of the day.",
  },
  quiz: {
    how: "Read the question, give the room twenty seconds of silence, ask for a show of hands per option, then reveal the answer and read out the explanation for the distractors as well as the correct choice.",
    ask: "Ask why the most popular wrong answer felt right — that reasoning is usually the real learning point.",
    watch: "Never move on from a question that more than a third of the room got wrong; re-explain with a different example instead.",
  },
  "ml-vs-rules": {
    how: "Toggle between the rule-based path and the learned path with the same input data, narrating what a geologist wrote by hand versus what the model inferred from examples.",
    ask: "Ask when a hand-written rule is the better professional choice — the answer is whenever the rule is known, stable and auditable.",
    watch: "Emphasise that machine learning is not smarter, only better at finding combinations nobody wrote down.",
  },
  "data-shapes": {
    how: "Click through each of the four data shapes and, for each, name a real dataset from the students' own coursework that has that shape.",
    ask: "Ask the room to place a dataset they have used into one of the four shapes.",
    watch: "Land the rule: the shape of the data, not fashion, decides the family of methods available.",
  },
  "clean-data": {
    how: "Work through the dirty table live, fixing one issue at a time — units, detection limits, duplicate sample IDs, inconsistent lithology codes — and read the running data-quality score aloud.",
    ask: "Ask which single fix changed the score most and why that field mattered.",
    watch: "Make clear that every fix is a geological decision with a defensible reason, not a spreadsheet trick.",
  },
  "feature-builder": {
    how: "Build features one at a time from raw assays and narrate the geology behind each: ratios as vectors, distance-to-structure as a control, alteration index as a proxy for the mineral system.",
    ask: "Ask the room to propose one more feature and to justify it geologically before you add it.",
    watch: "Reject any feature nobody can explain geologically, even if it improves the score — that is exactly the discipline you are teaching.",
  },
  "decision-tree": {
    how: "Grow the tree split by split, reading each split as a sentence a geologist would say out loud, then show what the tree predicts for a new sample.",
    ask: "Ask whether the first split matches what they would have chosen as the strongest discriminator.",
    watch: "Show a deep tree memorising noise so the link to overfitting is already visible before you name it.",
  },
  overfit: {
    how: "Slide model complexity from too simple to too complex, watching the training curve keep improving while the test curve turns around.",
    ask: "Ask them to point at the complexity they would ship, and to say what evidence justifies that point.",
    watch: "The gap between training and test performance is the single most useful honesty check they will use in their careers.",
  },
  kmeans: {
    how: "Run clustering on the sample cloud, change the number of clusters, and show how the story changes with k.",
    ask: "Ask what the clusters mean geologically — lithology, alteration, or an artefact of sampling density?",
    watch: "Clustering has no right answer; it proposes domains that a geologist must accept or reject.",
  },
  "anomaly-scatter": {
    how: "Move the anomaly threshold and watch flagged points appear. Separate genuine geochemical anomalies from contamination and analytical outliers.",
    ask: "Ask which flagged points they would actually spend money following up.",
    watch: "An anomaly is a statistical statement until a geologist gives it a mineral-system meaning.",
  },
  confusion: {
    how: "Fill the confusion matrix cell by cell in exploration language: found deposits, missed deposits, wasted drill holes, correctly ignored ground.",
    ask: "Ask which error is more expensive on their project — the answer changes the model they should choose.",
    watch: "Accuracy is almost useless when mineralisation is rare; force the room to talk in false positives and false negatives.",
  },
  "threshold-map": {
    how: "Sweep the probability threshold across the map and show the footprint of ground you would drill expanding and contracting.",
    ask: "Ask the room to set the threshold for a ten-hole budget, then for a two-hole budget.",
    watch: "The model does not choose the threshold. Budget, risk appetite and the cost of each error do.",
  },
  "feature-importance": {
    how: "Show which inputs drove the prediction and read the ranking as a geological hypothesis about the mineral system.",
    ask: "Ask whether the top drivers make geological sense, and what it would mean if they did not.",
    watch: "Importance is not causation, and a leaked variable often ranks first — that is a red flag, not a triumph.",
  },
  "rank-targets": {
    how: "Rank the candidate targets by prospectivity, then re-rank by confidence and by drill feasibility so the order changes in front of the room.",
    ask: "Ask which target they would drill first, and what single piece of new evidence would change their mind.",
    watch: "Prospectivity, confidence and feasibility are three different axes; collapsing them into one number hides the real decision.",
  },
  "bias-spotter": {
    how: "Work through each scenario and let the room name the failure — sampling bias, spatial leakage, label bias, or false confidence — before you confirm it.",
    ask: "Ask for a real example of the same failure from their own field or lab work.",
    watch: "Name each failure precisely; a named failure is one they can catch again in industry.",
  },
  "workflow-chain": {
    how: "Assemble the end-to-end chain step by step and show what breaks downstream when an early step is skipped.",
    ask: "Ask which step in the chain they expect to consume most of their time — then confirm it is data preparation.",
    watch: "Every chain ends with a human decision and a validation gate, never with a model score.",
  },
  "core-logging-cv": {
    how: "Run the vision demo on core imagery, showing confident predictions, borderline predictions and outright failures side by side.",
    ask: "Ask what the review queue should contain and who signs off on the log.",
    watch: "Computer vision buys consistency and speed, not geological interpretation. The geologist still owns the log.",
  },
  "core-logging": {
    how: "Compare logs from different geologists on the same interval, then bring in the model's log as a third opinion.",
    ask: "Ask how they would agree a label dictionary before any logging starts.",
    watch: "Disagreement between human loggers sets the ceiling on any model trained from those logs.",
  },
  "animated-workflow": {
    how: "Play the animated workflow once end to end without commentary, then step through it gate by gate, reading the human check and the deliverable for each stage.",
    ask: "Ask at each gate: what would make you stop here rather than continue?",
    watch: "The gates are the content. A student who remembers only the stage names has missed the point.",
  },
  "ai-hierarchy": {
    how: "Expand the nesting from artificial intelligence down to deep learning and generative models, dropping an exploration example into each layer.",
    ask: "Ask where a decision-tree prospectivity model sits, and where a chatbot summarising reports sits.",
    watch: "Students routinely use these words interchangeably; fix the vocabulary here and it holds for the rest of the day.",
  },
  glossary: {
    how: "Use the glossary as a lookup rather than a lecture: invite the room to call out any term from the day they are still unsure about and read the entry together.",
    ask: "Ask each student to name one term they could now explain to a supervisor.",
    watch: "Point out that the glossary travels with them in the exported PDF for later revision.",
  },
};

const layoutPurpose: Record<Slide["layout"], string> = {
  title: "Open the workshop, set expectations and establish the geology-first contract for the day.",
  divider: "Close the previous thread and state plainly what this module will deliver.",
  split: "Carry one main idea supported by a small set of named points, anchored to a figure or numbers.",
  cards: "Present parallel concepts of equal weight so students can compare them side by side.",
  steps: "Show an ordered procedure students can repeat on their own project.",
  table: "Give a reference comparison students will come back to in the exported guide.",
  compare: "Force a contrast so the boundary between two ideas becomes explicit.",
  widget: "Hand the idea to the room as a live demonstration rather than a claim from the front.",
  diagram: "Show a full workflow at a glance before walking its stages.",
  quote: "Slow the pace and let one idea land before moving on.",
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
        text: `Read the number aloud and say what it buys the student: ${sentence(s.label.toLowerCase())} Do not dwell; the numbers set scale, not content.`,
      }),
    );
    slide.objectives?.forEach((o, i) =>
      out.push({
        label: `Objective ${i + 1}`,
        text: `Say: "By the end of this module you should be able to ${o.charAt(0).toLowerCase()}${o.slice(1)}." Come back to this objective when you close the module and ask the room whether you met it.`,
      }),
    );
  }

  slide.bullets?.forEach((b, i) =>
    out.push({
      label: b.title ?? b.label ?? `Point ${i + 1}`,
      text: `${sentence(b.text)} Put it in the students' language first, then in the industry term. If the room looks blank, ask one of them to restate it as something they would write in a field notebook.`,
    }),
  );

  slide.cards?.forEach((c, i) =>
    out.push({
      label: `${c.tag ? `${c.tag} · ` : ""}${c.title}`,
      text: `${sentence(c.text)} Spend roughly ${i === 0 ? "a little longer here, since it frames the rest" : "half a minute"} and give one concrete exploration instance before moving to the next card.`,
    }),
  );

  slide.steps?.forEach((s, i) =>
    out.push({
      label: `Step ${i + 1} — ${s.title}`,
      text: `${sentence(s.text)} Say who does this in a real team, what it produces, and what happens downstream if it is skipped.`,
    }),
  );

  if (slide.compare) {
    out.push({
      label: slide.compare.leftTitle,
      text: `Read the left column as a set: ${slide.compare.left.map((l) => l.replace(/\.$/, "")).join("; ")}. Work down it without commentary, then pause before the other side.`,
    });
    out.push({
      label: slide.compare.rightTitle,
      text: `Now the right column: ${slide.compare.right.map((r) => r.replace(/\.$/, "")).join("; ")}. Ask the room to name the boundary between the two columns in their own words before you state it.`,
    });
  }

  if (slide.table) {
    out.push({
      label: "How to read the table",
      text: `Columns are ${slide.table.head.join(", ")}. Do not read every cell. Read the header row, then walk two or three rows in full so the pattern is clear, and tell the room the rest is reference material in the exported guide.`,
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
      label: "Frame the diagram",
      text: `${sentence(slide.diagram.intro)} Trace the whole path left to right with your hand before saying anything about individual boxes.`,
    });
    slide.diagram.lanes.forEach((lane) =>
      out.push({
        label: `Lane — ${lane.label}`,
        text: lane.nodes.map((n) => `${n.title}: ${n.text.replace(/\.$/, "")}`).join(" · "),
      }),
    );
    out.push({
      label: "The feedback loop",
      text: `${sentence(slide.diagram.feedback)} Stress that this loop is what separates an exploration workflow from a one-off model run.`,
    });
  }

  if (slide.workflow) {
    out.push({
      label: "State the decision",
      text: `The question is: ${sentence(slide.workflow.question)} The decision it feeds is: ${sentence(slide.workflow.decision)} Say both before playing the animation, so students hear the geology before the machinery.`,
    });
    slide.workflow.steps.forEach((s, i) =>
      out.push({
        label: `Gate ${i + 1} — ${s.phase}: ${s.title}`,
        text: `${sentence(s.detail)} Human check: ${sentence(s.check)} Deliverable: ${sentence(s.output)} Ask what would make you stop at this gate.`,
      }),
    );
  }

  if (slide.vocab?.length) {
    out.push({
      label: "Vocabulary to define out loud",
      text: slide.vocab.map((v) => `${v.term} — ${v.meaning.replace(/\.$/, "")}`).join(" · "),
    });
  }

  if (slide.quote) {
    out.push({
      label: "Deliver the quote",
      text: `Read it slowly, then stay silent for three seconds. Say why it matters for their careers rather than paraphrasing it${slide.attribution ? `, and attribute it to ${slide.attribution}` : ""}.`,
    });
  }

  if (slide.figure) {
    out.push({
      label: "Work the figure",
      text: `Caption: ${sentence(slide.figure.caption)} ${slide.figure.scale ? `Note the scale (${slide.figure.scale}) explicitly — students consistently misjudge the footprint. ` : ""}${slide.figure.pins?.length ? `Walk the annotations in order: ${slide.figure.pins.map((p) => `${p.label} (${p.text.replace(/\.$/, "")})`).join("; ")}.` : "Ask the room what they notice before you interpret it for them."}`,
    });
  }

  if (slide.widget) {
    const guide = widgetGuide[slide.widget];
    if (guide) out.push({ label: "Run the demonstration", text: guide.how });
  }

  if (!out.length) {
    out.push({
      label: "Deliver the single idea",
      text: `${sentence(slide.lead ?? slide.title)} This slide carries one idea only — say it, give one exploration example, and move on rather than filling the time.`,
    });
  }

  return out;
}

function emphasiseFor(slide: Slide): string[] {
  const points: string[] = [];
  if (slide.takeaway) points.push(`Say the takeaway in your own words and then read it verbatim: "${slide.takeaway}"`);
  if (slide.note) points.push(`Field note worth stopping on: ${sentence(slide.note)}`);
  if (slide.widget && widgetGuide[slide.widget]) points.push(widgetGuide[slide.widget]!.watch);
  if (slide.layout === "table") points.push("Resist reading the whole table aloud — it exists as reference, and reading it kills the pace of the module.");
  if (slide.figure) points.push("Interpret the figure with geological vocabulary, not model vocabulary. Students should hear alteration, structure and grade before they hear features and scores.");
  points.push("Close the loop back to geology: whatever the model produced, a geologist has to defend it with evidence a Competent Person would accept.");
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
  return `Bring in ${pick}. Tell it as a short story with a decision at the end — what was drilled, what was found, and what the team would do differently. Keep it under ninety seconds, and name the geological reasoning that made the difference rather than the algorithm. Tie it explicitly to "${mod?.title ?? "this module"}" so students see the concept in a real project rather than in the abstract.`;
}

function interactionFor(slide: Slide): string[] {
  const items: string[] = [];
  if (slide.activityLabel) items.push(`This slide is flagged "${slide.activityLabel}" — run it as an activity, not a lecture. Give the instruction, give a time limit, and hold the room to it.`);
  if (slide.widget && widgetGuide[slide.widget]) items.push(widgetGuide[slide.widget]!.ask);
  if (slide.quiz?.length) {
    slide.quiz.forEach((q, i) => {
      const correct = q.options.find((o) => o.correct);
      items.push(
        `Question ${i + 1}: "${q.prompt}" Correct answer: ${correct?.text ?? "see slide"}.${correct?.why ? ` Explain why: ${sentence(correct.why)}` : ""} Also address the tempting wrong answers: ${q.options.filter((o) => !o.correct).map((o) => `${o.text}${o.why ? ` (${o.why.replace(/\.$/, "")})` : ""}`).join("; ")}.`,
      );
    });
  }
  if (slide.objectives?.length) items.push("Ask the room to write the module objectives in their notebook; you will return to them at the module close.");
  if (!items.length) {
    items.push(
      `Cold-call one question: "If you had to explain '${slide.title}' to a field assistant with no AI background, what would you say?" Take one answer, improve it in a sentence, and move on. Keep it under sixty seconds so the module stays on time.`,
    );
  }
  return items;
}

function transitionFor(slide: Slide, index: number): string {
  const next = slides[index + 1];
  if (!next) return "This is the last slide. Close by asking every student to name one thing they will try in the next two weeks, then point them at the reference library modules in this guide for self-study.";
  const sameModule = next.module === slide.module;
  const nextModule = modules.find((m) => m.index === next.module);
  if (!sameModule) {
    return `You are leaving module ${modules.find((m) => m.index === slide.module)?.code ?? ""} and entering ${nextModule?.code ?? ""} — ${nextModule?.title ?? ""}. Say what has been settled so far in one sentence, then set up the next module as the question that follows from it: "${nextModule?.subtitle ?? next.title}". If you are behind time, this is a safe place to shorten.`;
  }
  return `Bridge to "${next.title}": name the gap this slide leaves open, then say the next slide answers it. A usable line is: "So we know ${slide.takeaway ? slide.takeaway.replace(/\.$/, "").toLowerCase() : slide.title.toLowerCase()} — the next question is ${next.title.toLowerCase()}."`;
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
      opening: `${slide.kicker ? `Context on screen: ${slide.kicker}. ` : ""}Open with the idea, not the label. A workable opening line: "${sentence(slide.lead ?? slide.title)}" Then say the slide title so students can find it later in the handout. ${slide.layout === "divider" ? "Read the objectives aloud; they are the contract for the next block." : "Keep your first sentence shorter than the slide title — students read faster than you speak."}`,
      walkthrough: walkthroughFor(slide),
      emphasise: emphasiseFor(slide),
      example: exampleFor(slide, index),
      interaction: interactionFor(slide),
      transition: transitionFor(slide, index),
    };
  });
}
