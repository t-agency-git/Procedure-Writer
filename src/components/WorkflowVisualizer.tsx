import React, { useState } from "react";
import {
  GitFork,
  ArrowRight,
  ArrowDown,
  User,
  Shield,
  Layers,
  Cpu,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Maximize2,
  Minimize2,
  Play,
  RotateCcw,
} from "lucide-react";
import { ProcedureDocument, WorkflowStage } from "../types";

interface WorkflowVisualizerProps {
  document: ProcedureDocument;
}

export const WorkflowVisualizer: React.FC<WorkflowVisualizerProps> = ({
  document,
}) => {
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"flow" | "swimlane">("flow");

  const stages = document.workflowStages || [];
  const steps = document.steps || [];

  return (
    <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-xs space-y-6">
      {/* Visualizer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#75b5ef]/15 text-[#0284c7]">
              <GitFork className="w-4 h-4 text-[#75b5ef]" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">
              Visual Process Map & Cross-Team Handoffs
            </h3>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#00d8ff]/20 text-[#0284c7] border border-[#00d8ff]/40">
              Interactive
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            End-to-end visualization of system inputs, actor handoffs, and verification checkpoints across teams.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode("flow")}
              className={`px-3 py-1 rounded-lg font-semibold cursor-pointer transition-all ${
                viewMode === "flow"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Sequence Flow
            </button>
            <button
              onClick={() => setViewMode("swimlane")}
              className={`px-3 py-1 rounded-lg font-semibold cursor-pointer transition-all ${
                viewMode === "swimlane"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Team Swimlanes
            </button>
          </div>
        </div>
      </div>

      {/* Mode 1: Sequence Flow Nodes */}
      {viewMode === "flow" && (
        <div className="space-y-6">
          {/* Horizontal / Wrapped Stages Stepper */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            {stages.map((stage, idx) => {
              const isSelected = activeStageIndex === idx;
              const isPast = idx < activeStageIndex;

              return (
                <div
                  key={idx}
                  onClick={() => setActiveStageIndex(idx)}
                  className={`relative p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#75b5ef]/10 border-[#75b5ef] shadow-md ring-2 ring-[#00d8ff]/40"
                      : "bg-[#f9f9f9] border-slate-200 hover:border-[#75b5ef]/50 hover:bg-white"
                  }`}
                >
                  {/* Stage number tag */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                      Phase 0{idx + 1}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      Step {idx + 1} of {stages.length}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm mb-1">
                    {stage.stage}
                  </h4>
                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                    {stage.action}
                  </p>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                    <span className="font-medium text-[#0284c7] flex items-center gap-1">
                      <User className="w-3 h-3 text-[#75b5ef]" />
                      {stage.owner}
                    </span>
                    {stage.handoffTo && stage.handoffTo !== "Completed" && (
                      <span className="text-slate-500 flex items-center gap-0.5 text-[10px]">
                        → {stage.handoffTo}
                      </span>
                    )}
                  </div>

                  {/* Active Indicator Glow */}
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#00d8ff] ring-2 ring-white animate-pulse" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Detailed Selected Stage Inspection Card */}
          {stages[activeStageIndex] && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-50 to-white border border-[#75b5ef]/40 shadow-sm">
              <div className="flex items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-[#75b5ef] text-white text-xs font-bold">
                    Phase 0{activeStageIndex + 1} Focus
                  </span>
                  <h4 className="font-bold text-slate-900 text-base">
                    {stages[activeStageIndex].stage}
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={activeStageIndex === 0}
                    onClick={() => setActiveStageIndex((i) => Math.max(0, i - 1))}
                    className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs text-slate-600 hover:bg-white disabled:opacity-40 cursor-pointer"
                  >
                    Previous Phase
                  </button>
                  <button
                    disabled={activeStageIndex === stages.length - 1}
                    onClick={() =>
                      setActiveStageIndex((i) =>
                        Math.min(stages.length - 1, i + 1)
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-[#75b5ef] text-white text-xs font-bold hover:bg-[#5da5e6] disabled:opacity-40 cursor-pointer"
                  >
                    Next Phase →
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Phase Owner & Role
                  </span>
                  <p className="font-bold text-slate-800 text-sm">
                    {stages[activeStageIndex].owner}
                  </p>
                  <p className="text-slate-500 mt-1">
                    Responsible for executing verification and handoff criteria.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Handoff Target
                  </span>
                  <p className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    <span>{stages[activeStageIndex].handoffTo || "Finalized"}</span>
                    <span className="w-2 h-2 rounded-full bg-[#00d8ff]" />
                  </p>
                  <p className="text-slate-500 mt-1">
                    Downstream recipient must countersign execution ledger.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Compliance Verification
                  </span>
                  <p className="font-bold text-slate-800 text-sm">
                    {document.framework.split("&")[0]}
                  </p>
                  <p className="text-slate-500 mt-1">
                    Inline audit checks enforced before transition.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Swimlane View */}
      {viewMode === "swimlane" && (
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
          <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Team / Role Swimlane</span>
            <span>Procedural Responsibilities & Milestones</span>
          </div>

          <div className="divide-y divide-slate-200">
            {document.responsibilities.map((resp, idx) => {
              // Find matching stages/steps for this role
              const roleStages = stages.filter(
                (s) =>
                  s.owner.toLowerCase().includes(resp.role.toLowerCase()) ||
                  resp.role.toLowerCase().includes(s.owner.toLowerCase())
              );

              return (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-4 p-4 gap-4 items-center hover:bg-slate-50/70 transition-colors"
                >
                  <div className="md:col-span-1 border-r-0 md:border-r border-slate-200 pr-3">
                    <span className="text-xs font-bold text-slate-900 block">
                      {resp.role}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {resp.responsibility}
                    </span>
                  </div>

                  <div className="md:col-span-3 flex flex-wrap gap-2 items-center">
                    {roleStages.length > 0 ? (
                      roleStages.map((stg, sIdx) => (
                        <div
                          key={sIdx}
                          className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#75b5ef]/50 shadow-xs"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#00d8ff]" />
                          <div className="text-xs">
                            <span className="font-bold text-slate-800 block">
                              {stg.stage}
                            </span>
                            <span className="text-slate-500 text-[11px]">
                              {stg.action}
                            </span>
                          </div>
                          {stg.handoffTo && (
                            <span className="text-[10px] font-semibold text-[#0284c7] bg-[#75b5ef]/15 px-1.5 py-0.5 rounded">
                              → {stg.handoffTo}
                            </span>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-slate-400 italic">
                        Provides advisory sign-off and continuous compliance monitoring.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
