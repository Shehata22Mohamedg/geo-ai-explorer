import type { Slide } from "@/data/deck/types";
import { PollWidget, QuizWidget, MlVsRulesWidget, DataShapesWidget, CleanDataWidget, FeatureBuilderWidget } from "./BasicWidgets";
import { AnomalyScatterWidget, BiasSpotterWidget, ConfusionWidget, CoreLoggingWidget, DecisionTreeWidget, FeatureImportanceWidget, GlossaryWidget, KMeansWidget, OverfitWidget, RankTargetsWidget, WorkflowChainWidget } from "./AdvancedWidgets";

export function WidgetRegistry({ slide }: { slide: Slide }) {
  switch (slide.widget) {
    case "poll": return <PollWidget />;
    case "quiz": return <QuizWidget questions={slide.quiz} />;
    case "ml-vs-rules": return <MlVsRulesWidget />;
    case "data-shapes": return <DataShapesWidget />;
    case "clean-data": return <CleanDataWidget />;
    case "feature-builder": return <FeatureBuilderWidget />;
    case "decision-tree": return <DecisionTreeWidget />;
    case "overfit": return <OverfitWidget />;
    case "confusion": return <ConfusionWidget />;
    case "kmeans": return <KMeansWidget />;
    case "anomaly-scatter": return <AnomalyScatterWidget />;
    case "feature-importance": return <FeatureImportanceWidget />;
    case "workflow-chain": return <WorkflowChainWidget />;
    case "core-logging-cv": return <CoreLoggingWidget />;
    case "rank-targets": return <RankTargetsWidget />;
    case "bias-spotter": return <BiasSpotterWidget />;
    case "glossary": return <GlossaryWidget />;
    default: return <p className="text-inksoft">This demonstration is not available.</p>;
  }
}