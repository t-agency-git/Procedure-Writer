import React, { useState } from "react";
import {
  X,
  Sparkles,
  ShieldAlert,
  FileText,
  ShieldCheck,
  GitFork,
  Cpu,
  Layers,
  ArrowRight,
  HardHat,
  RefreshCw,
} from "lucide-react";
import { ProcedureDocument, ServiceCategory } from "../types";

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentCreated: (doc: ProcedureDocument) => void;
  defaultType?: string;
  defaultTitle?: string;
}

export const CreateModal: React.FC<CreateModalProps> = ({
  isOpen,
  onClose,
  onDocumentCreated,
  defaultType = "sop",
  defaultTitle = "",
}) => {
  const [docType, setDocType] = useState<string>(defaultType);
  const [title, setTitle] = useState<string>(defaultTitle);
  const [department, setDepartment] = useState<string>("Operations & Compliance");
  const [framework, setFramework] = useState<string>("ISO 9001:2015");
  const [riskLevel, setRiskLevel] = useState<string>("Medium");
  const [rawNotes, setRawNotes] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Sync state if defaultType or defaultTitle updates
  React.useEffect(() => {
    if (defaultType) setDocType(defaultType);
    if (defaultTitle) setTitle(defaultTitle);
  }, [defaultType, defaultTitle]);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate-procedure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: docType,
          title: title || "Enterprise Standard Operating Procedure",
          department,
          framework,
          riskLevel,
          rawNotes,
          industry: "Regulated Enterprise Operations",
        }),
      });

      const data = await response.json();
      if (data.success && data.document) {
        onDocumentCreated(data.document);
        onClose();
      }
    } catch (err) {
      console.warn("Generation error, creating local instance:", err);
      // Create instant fallback
      const fallbackDoc: ProcedureDocument = {
        id: `doc-${Date.now()}`,
        code: `${docType.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
        title: title || "Standard Operating Procedure",
        type: docType as any,
        status: "Draft",
        version: "1.0.0",
        effectiveDate: new Date().toISOString().split("T")[0],
        reviewDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split("T")[0],
        department,
        framework,
        riskLevel: riskLevel as any,
        purpose: `Establish formal standard criteria, supervisory gates, and audit traceability for ${department}.`,
        scopeDescription: `Applies to all ${department} personnel and operational environments governed under ${framework}.`,
        responsibilities: [
          { role: "Process Supervisor", responsibility: "Maintains procedure currency and validates team adherence." },
          { role: "Operating Specialist", responsibility: "Executes sequential instructions with zero variance." },
          { role: "Compliance Officer", responsibility: "Performs quarterly verification audits and signs off revisions." },
        ],
        definitions: [
          { term: "Standard Operating Procedure", definition: "Mandatory controlled document governing sequential operational tasks." },
        ],
        clausesReferenced: [
          { framework, clause: "§7.5.3", description: "Control of documented operational information and tamper resistance." },
        ],
        steps: [
          {
            stepNumber: 1,
            title: "Prerequisite Verification & Workspace Isolation",
            actor: "Operating Specialist",
            instruction: "Verify credentials, confirm calibration logs are current, and clear non-essential materials from workstation.",
            systemTool: "Access Control Portal",
            clauseCitation: `[${framework} §8.1]`,
          },
          {
            stepNumber: 2,
            title: "Core Sequential Execution & Parameter Logging",
            actor: "Operating Specialist",
            instruction: "Execute target sequence in strict alignment with tolerances. Record real-time metrics every 30 minutes.",
            systemTool: "Electronic Ledger Console",
            clauseCitation: `[${framework} §8.5.1]`,
          },
          {
            stepNumber: 3,
            title: "Supervisory Review & Verification Countersignature",
            actor: "Process Supervisor",
            instruction: "Inspect completed work artifact, confirm no unapproved deviations occurred, and apply cryptographic sign-off.",
            systemTool: "QMS Vault",
            clauseCitation: `[${framework} §8.6]`,
          },
        ],
        workflowStages: [
          { stage: "Intake & Setup", action: "Verify prerequisites and authorization", owner: "Operating Specialist", handoffTo: "Supervisor" },
          { stage: "Core Execution", action: "Run sequential gates with active telemetry", owner: "Operating Specialist", handoffTo: "QA" },
          { stage: "Audit & Sign-off", action: "Countersign lot dossier and release", owner: "Supervisor", handoffTo: "Completed" },
        ],
        safetyControls: [
          { hazard: "Operational Drift & Human Error", controlLevel: "Engineering", requirement: "Automated input verification guards active." },
          { hazard: "Missing Audit Evidence", controlLevel: "Administrative", requirement: "Dual-person sign-off recorded before shift close." },
        ],
        exceptions: ["Immediate emergency safety conditions override standard procedural sequence."],
        auditChecklist: [
          { requirement: `Procedural steps trace to ${framework} controls`, status: "Compliant", evidenceRequired: "Inline clause annotations" },
        ],
        signOffs: [
          { role: "Author / Lead Engineer", name: "Alex Mercer", status: "Approved", date: new Date().toISOString().split("T")[0] },
          { role: "Department Supervisor", name: "Sarah Lin", status: "Pending" },
        ],
      };

      onDocumentCreated(fallbackDoc);
      onClose();
    } finally {
      setIsGenerating(false);
    }
  };

  const serviceOptions = [
    { id: "sop", label: "SOP Standardization", icon: <FileText className="w-4 h-4 text-[#75b5ef]" /> },
    { id: "safety-plan", label: "Safety Plan / HSE File", icon: <HardHat className="w-4 h-4 text-[#00d8ff]" /> },
    { id: "compliance", label: "Compliance Mapping", icon: <ShieldCheck className="w-4 h-4 text-emerald-500" /> },
    { id: "workflow", label: "Process Workflow Map", icon: <GitFork className="w-4 h-4 text-sky-500" /> },
    { id: "ai-governance", label: "AI Governance Procedure", icon: <Cpu className="w-4 h-4 text-violet-500" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#75b5ef] to-[#5da5e6] p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
              <Sparkles className="w-5 h-5 text-[#00d8ff]" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight">
                AI Procedure & Plan Writer
              </h3>
              <p className="text-xs text-white/80">
                Draft audit-ready SOPs, compliance maps, and safety files in seconds.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleGenerate} className="p-6 space-y-5">
          {/* Service / Document Type Selector */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Select Document Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {serviceOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setDocType(opt.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all text-left cursor-pointer ${
                    docType === opt.id
                      ? "bg-[#75b5ef]/15 border-[#75b5ef] text-[#0284c7] ring-1 ring-[#00d8ff]"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {opt.icon}
                  <span className="truncate">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title Input */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Document Title / Task Name
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Hazardous Chemical Spill & Neutralization Protocol"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#75b5ef] focus:ring-2 focus:ring-[#00d8ff]/20 font-medium"
            />
          </div>

          {/* Grid: Department, Framework, Risk Level */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#75b5ef]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Auditor Framework
              </label>
              <select
                value={framework}
                onChange={(e) => setFramework(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#75b5ef]"
              >
                <option value="ISO 9001:2015">ISO 9001:2015 (Quality)</option>
                <option value="OSHA 1910 & ISO 45001">OSHA 1910 / ISO 45001 (Safety)</option>
                <option value="HIPAA Security Rule">HIPAA (Healthcare)</option>
                <option value="SOC 2 Type II">SOC 2 Type II (Security)</option>
                <option value="FDA 21 CFR Part 11">FDA 21 CFR Part 11 (Life Sciences)</option>
                <option value="EU AI Act & NIST AI RMF">EU AI Act / NIST (AI Governance)</option>
                <option value="NFPA 70E">NFPA 70E (Electrical Arc Flash)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Risk Classification
              </label>
              <select
                value={riskLevel}
                onChange={(e) => setRiskLevel(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#75b5ef]"
              >
                <option value="Low">Low Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="High">High Risk</option>
                <option value="Critical">Critical Risk (Life Safety)</option>
              </select>
            </div>
          </div>

          {/* Raw Notes / Interview Transcripts */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Raw Notes, Interview Transcript, or Bullet Points
            </label>
            <textarea
              rows={3}
              value={rawNotes}
              onChange={(e) => setRawNotes(e.target.value)}
              placeholder="Paste unstructured interview notes, tribal knowledge, or existing steps..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#75b5ef] focus:ring-2 focus:ring-[#00d8ff]/20"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isGenerating}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#75b5ef] hover:bg-[#5da5e6] text-white text-xs font-bold shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 text-[#00d8ff] ${
                  isGenerating ? "animate-spin" : ""
                }`}
              />
              <span>
                {isGenerating
                  ? "Engineering Audit-Ready Draft..."
                  : "Draft with Gemini AI"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
