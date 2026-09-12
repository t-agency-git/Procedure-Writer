import React, { useState } from "react";
import {
  FileText,
  ShieldCheck,
  AlertTriangle,
  GitFork,
  HardHat,
  CheckCircle2,
  Clock,
  Download,
  Share2,
  Printer,
  Plus,
  Trash2,
  Edit3,
  Bookmark,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  FileCheck2,
  Check,
} from "lucide-react";
import { ProcedureDocument, ProcedureStep, SignOff } from "../types";
import { WorkflowVisualizer } from "./WorkflowVisualizer";

interface ProcedureEditorProps {
  document: ProcedureDocument;
  onUpdateDocument: (updated: ProcedureDocument) => void;
  onRunAudit: (doc: ProcedureDocument) => void;
  onExportMarkdown: (doc: ProcedureDocument) => void;
}

export const ProcedureEditor: React.FC<ProcedureEditorProps> = ({
  document,
  onUpdateDocument,
  onRunAudit,
  onExportMarkdown,
}) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "steps" | "workflow" | "safety" | "audit" | "signoffs"
  >("steps");

  const [newStepInstruction, setNewStepInstruction] = useState("");
  const [newStepActor, setNewStepActor] = useState("Operating Specialist");
  const [isAddingStep, setIsAddingStep] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Handle adding a new procedural step
  const handleAddStep = () => {
    if (!newStepInstruction.trim()) return;

    const newStep: ProcedureStep = {
      stepNumber: document.steps.length + 1,
      title: `Step ${document.steps.length + 1} - Execution`,
      actor: newStepActor,
      instruction: newStepInstruction,
      safetyWarning: document.code.startsWith("SAF")
        ? "Verify PPE and safety isolation before proceeding."
        : undefined,
      systemTool: "QMS Console",
      clauseCitation: `[${document.framework.split("&")[0].trim()} §8.1]`,
    };

    const updated = {
      ...document,
      steps: [...document.steps, newStep],
    };

    onUpdateDocument(updated);
    setNewStepInstruction("");
    setIsAddingStep(false);
  };

  // Sign document action
  const handleSignOff = (role: string) => {
    const updatedSignOffs = document.signOffs.map((s) => {
      if (s.role === role) {
        return {
          ...s,
          status: "Approved" as const,
          date: new Date().toISOString().split("T")[0],
        };
      }
      return s;
    });

    const allApproved = updatedSignOffs.every((s) => s.status === "Approved");

    onUpdateDocument({
      ...document,
      signOffs: updatedSignOffs,
      status: allApproved ? "Approved" : document.status,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Document Header Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#e2e8f0] shadow-xs relative overflow-hidden">
        {/* Top cyan gradient accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#75b5ef] via-[#00d8ff] to-[#75b5ef]" />

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            {/* Meta Tags Row */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-mono font-bold text-[#0284c7] bg-[#75b5ef]/15 px-2.5 py-1 rounded-lg border border-[#75b5ef]/30">
                {document.code}
              </span>
              <span className="text-slate-500 font-semibold px-2 py-0.5 rounded bg-slate-100">
                Rev. {document.version}
              </span>
              <span
                className={`font-bold px-2.5 py-0.5 rounded-full border ${
                  document.status === "Approved"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : document.status === "In Review"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-sky-50 text-sky-700 border-sky-200"
                }`}
              >
                {document.status}
              </span>
              <span className="text-slate-600 bg-slate-100 font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#75b5ef]" />
                {document.framework}
              </span>
              <span className="text-rose-700 bg-rose-50 border border-rose-200 font-bold px-2 py-0.5 rounded-md">
                {document.riskLevel} Risk
              </span>
            </div>

            {/* Document Title */}
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              {document.title}
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed pt-1">
              {document.purpose}
            </p>
          </div>

          {/* Quick Document Action Controls */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => onRunAudit(document)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#75b5ef] text-[#0284c7] hover:bg-[#75b5ef]/10 text-xs font-bold transition-all cursor-pointer shadow-xs"
              title="Run AI Gap & Compliance Scan"
            >
              <Sparkles className="w-4 h-4 text-[#00d8ff]" />
              <span>Gap Audit</span>
            </button>

            <button
              onClick={() => onExportMarkdown(document)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#75b5ef] hover:bg-[#5da5e6] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              title="Download clean Markdown"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-[#75b5ef] transition-colors cursor-pointer shadow-xs"
              title="Print / Save as PDF"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={handleCopyLink}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-[#75b5ef] transition-colors cursor-pointer relative shadow-xs"
              title="Share procedure link"
            >
              <Share2 className="w-4 h-4" />
              {copiedNotification && (
                <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap z-30">
                  Link Copied!
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu (Directly inspired by UI Design 2.png / UI Design.png) */}
        <div className="flex items-center gap-2 overflow-x-auto border-t border-slate-100 pt-4 mt-6">
          <button
            onClick={() => setActiveTab("steps")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "steps"
                ? "bg-[#75b5ef] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Procedural Steps ({document.steps.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("workflow")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "workflow"
                ? "bg-[#75b5ef] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>Visual Process Map</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00d8ff]" />
          </button>

          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "overview"
                ? "bg-[#75b5ef] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <span>Scope & Roles</span>
          </button>

          <button
            onClick={() => setActiveTab("safety")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "safety"
                ? "bg-[#75b5ef] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <HardHat className="w-3.5 h-3.5" />
            <span>Safety Controls ({document.safetyControls.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("audit")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "audit"
                ? "bg-[#75b5ef] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Clauses & Audit ({document.clausesReferenced.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("signoffs")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "signoffs"
                ? "bg-[#75b5ef] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Sign-offs ({document.signOffs.filter((s) => s.status === "Approved").length}/{document.signOffs.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Procedural Steps Content */}
      {activeTab === "steps" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Standard Execution Steps</span>
              <span className="text-xs font-medium text-slate-500">
                Sequential mandatory actions
              </span>
            </h3>

            <button
              onClick={() => setIsAddingStep(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#75b5ef] text-[#0284c7] hover:bg-[#75b5ef]/10 text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Step</span>
            </button>
          </div>

          {/* Add Step Inline Form */}
          {isAddingStep && (
            <div className="bg-white rounded-2xl p-5 border-2 border-dashed border-[#75b5ef] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  New Procedural Step {document.steps.length + 1}
                </span>
                <button
                  onClick={() => setIsAddingStep(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-1">
                  <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">
                    Responsible Actor
                  </label>
                  <input
                    type="text"
                    value={newStepActor}
                    onChange={(e) => setNewStepActor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#75b5ef]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">
                    Procedural Instruction & Sequence
                  </label>
                  <input
                    type="text"
                    value={newStepInstruction}
                    onChange={(e) => setNewStepInstruction(e.target.value)}
                    placeholder="Provide explicit, unambiguous instruction..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#75b5ef]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsAddingStep(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddStep}
                  className="px-4 py-1.5 bg-[#75b5ef] text-white text-xs font-bold rounded-lg hover:bg-[#5da5e6] cursor-pointer"
                >
                  Append Step
                </button>
              </div>
            </div>
          )}

          {/* List of Steps */}
          <div className="space-y-3">
            {document.steps.map((step, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-[#e2e8f0] hover:border-[#75b5ef]/70 transition-all shadow-xs space-y-3 relative group"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-[#75b5ef] text-white font-black text-xs flex items-center justify-center shadow-xs">
                      {step.stepNumber}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm md:text-base">
                      {step.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                      Actor: {step.actor}
                    </span>
                    {step.clauseCitation && (
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-[#00d8ff]/15 text-[#0284c7] border border-[#00d8ff]/30">
                        {step.clauseCitation}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed pl-10">
                  {step.instruction}
                </p>

                {/* Safety Warning Highlight with electric cyan accent */}
                {step.safetyWarning && (
                  <div className="ml-10 p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900 relative">
                    <div className="w-1 absolute left-0 top-0 bottom-0 bg-[#00d8ff] rounded-l-xl" />
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold">Safety Directive: </strong>
                      <span>{step.safetyWarning}</span>
                    </div>
                  </div>
                )}

                {step.systemTool && (
                  <div className="ml-10 flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                    <span className="font-semibold text-slate-400 uppercase">System / Tool:</span>
                    <span className="font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {step.systemTool}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Visual Workflow Map */}
      {activeTab === "workflow" && (
        <WorkflowVisualizer document={document} />
      )}

      {/* Tab 3: Overview & Scope */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Scope Description */}
          <div className="bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#75b5ef]" />
              Operational Scope
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {document.scopeDescription}
            </p>
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Department
              </span>
              <p className="text-sm font-bold text-slate-800">
                {document.department}
              </p>
            </div>
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Effective & Review Dates
              </span>
              <p className="text-xs text-slate-600">
                Effective: <strong>{document.effectiveDate}</strong> • Review Due: <strong>{document.reviewDate}</strong>
              </p>
            </div>
          </div>

          {/* Key Definitions */}
          <div className="bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-[#75b5ef]" />
              Controlled Definitions
            </h3>
            <div className="divide-y divide-slate-100 text-xs">
              {document.definitions.map((def, i) => (
                <div key={i} className="py-2.5 first:pt-0 last:pb-0">
                  <span className="font-bold text-slate-800">{def.term}: </span>
                  <span className="text-slate-600">{def.definition}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Roles & Responsibilities Table */}
          <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base">
              Roles & Delegated Responsibilities
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 border-b border-slate-200 font-bold text-slate-700">
                  <tr>
                    <th className="p-3">Organizational Role</th>
                    <th className="p-3">Mandatory Operational Obligation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {document.responsibilities.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50/70">
                      <td className="p-3 font-bold text-slate-900 whitespace-nowrap">
                        {r.role}
                      </td>
                      <td className="p-3 text-slate-600 leading-relaxed">
                        {r.responsibility}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Safety Controls */}
      {activeTab === "safety" && (
        <div className="bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <HardHat className="w-5 h-5 text-[#75b5ef]" />
                Hazard Identification & Safety Safeguards
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Mandatory engineering, administrative, and PPE controls required during execution.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {document.safetyControls.map((sc, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-[#75b5ef] transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900 text-sm">
                    {sc.hazard}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#75b5ef]/15 text-[#0284c7] border border-[#75b5ef]/30">
                    {sc.controlLevel}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {sc.requirement}
                </p>
              </div>
            ))}
          </div>

          {/* Exceptions Clause */}
          {document.exceptions && document.exceptions.length > 0 && (
            <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 text-xs text-rose-900 space-y-1">
              <span className="font-bold uppercase tracking-wider block text-rose-800 text-[10px]">
                Authorized Exceptions & Deviation Thresholds
              </span>
              {document.exceptions.map((ex, i) => (
                <p key={i}>• {ex}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Clauses & Audit Checklist */}
      {activeTab === "audit" && (
        <div className="bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-xs space-y-6">
          {/* Framework Clause Mappings */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#75b5ef]" />
              Regulatory Framework Clause Citations
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200 text-xs">
              {document.clausesReferenced.map((cl, i) => (
                <div key={i} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">
                      {cl.framework} — Clause {cl.clause}
                    </span>
                    <p className="text-slate-500 text-xs mt-0.5">
                      {cl.description}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 shrink-0">
                    Verified Compliant
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Verification Checklist */}
          <div className="space-y-3 pt-2">
            <h3 className="font-bold text-slate-900 text-base">
              Auditor Verification & Evidence Checklist
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200 text-xs">
              {document.auditChecklist.map((item, i) => (
                <div key={i} className="p-3.5 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-800">
                      {item.requirement}
                    </span>
                    <p className="text-slate-500 text-[11px]">
                      Required Evidence: <span className="font-medium text-slate-700">{item.evidenceRequired}</span>
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Formal Sign-offs */}
      {activeTab === "signoffs" && (
        <div className="bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-xs space-y-5">
          <div>
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Cryptographic Sign-off Ledger & Authorizations
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Document cannot transition to Approved status without all authorized stakeholder sign-offs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {document.signOffs.map((so, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {so.role}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        so.status === "Approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {so.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">
                    {so.name}
                  </h4>
                  {so.date && (
                    <p className="text-[11px] text-slate-500 mt-1">
                      Signed on {so.date}
                    </p>
                  )}
                </div>

                {so.status === "Pending" ? (
                  <button
                    onClick={() => handleSignOff(so.role)}
                    className="w-full py-2 rounded-xl bg-[#75b5ef] hover:bg-[#5da5e6] text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                  >
                    Sign & Approve
                  </button>
                ) : (
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>Signature Recorded</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
