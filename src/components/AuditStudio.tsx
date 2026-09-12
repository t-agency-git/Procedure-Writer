import React, { useState } from "react";
import {
  SearchCheck,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Sliders,
  ShieldCheck,
} from "lucide-react";
import { AuditResult, ProcedureDocument } from "../types";

interface AuditStudioProps {
  documents: ProcedureDocument[];
  selectedDoc: ProcedureDocument;
  onSelectDoc: (doc: ProcedureDocument) => void;
  onApplyFix: (doc: ProcedureDocument, remediation: string) => void;
}

export const AuditStudio: React.FC<AuditStudioProps> = ({
  documents,
  selectedDoc,
  onSelectDoc,
  onApplyFix,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>({
    readinessScore: 94,
    summary: `Audit scan completed against ${selectedDoc.framework}. Structural adherence is high with 2 minor inline clause trace suggestions.`,
    findings: [
      {
        category: "Inline Traceability",
        severity: "Low",
        issue: "Step 2 lacks explicit section subsection tag for retention lifecycle.",
        remediation: `Add [${selectedDoc.framework} §7.5.3] cross-reference to step verification.`,
      },
      {
        category: "Secondary Reviewer",
        severity: "Medium",
        issue: "Emergency escalation path does not specify an alternate designee.",
        remediation: "Add an alternate designated role in section 2 Responsibilities.",
      },
    ],
    strengths: [
      "All major procedural steps have assigned organizational roles",
      "Explicit version control and annual review dates documented",
      "Hazard controls cataloged with specific engineering safeguards",
    ],
    auditFramework: selectedDoc.framework,
  });

  const handleRunScan = async () => {
    setIsScanning(true);
    try {
      const response = await fetch("/api/audit-procedure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentText: `${selectedDoc.title}\n${selectedDoc.purpose}\n${JSON.stringify(
            selectedDoc.steps
          )}`,
          framework: selectedDoc.framework,
        }),
      });

      const data = await response.json();
      if (data.audit) {
        setAuditResult(data.audit);
      }
    } catch (err) {
      console.warn("Audit scan error:", err);
    } finally {
      setIsScanning(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (score >= 75) return "text-sky-600 bg-sky-50 border-sky-200";
    if (score >= 60) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-rose-600 bg-rose-50 border-rose-200";
  };

  return (
    <div className="space-y-6">
      {/* Audit Studio Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#e2e8f0] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#75b5ef]/15 text-[#0284c7] text-xs font-bold border border-[#75b5ef]/30">
              <SearchCheck className="w-4 h-4 text-[#75b5ef]" />
              <span>AI COMPLIANCE AUDITOR</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Documentation Audits & Gap Analysis
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Scan active standard procedures and safety plans against auditor frameworks (ISO 9001, OSHA, HIPAA, FDA, SOC 2). Instantly flag unwritten assumptions, missing sign-offs, and compliance blind spots.
            </p>
          </div>

          {/* Document Selector & Trigger */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <select
              value={selectedDoc.id}
              onChange={(e) => {
                const found = documents.find((d) => d.id === e.target.value);
                if (found) onSelectDoc(found);
              }}
              className="bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#75b5ef]"
            >
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.code} - {d.title.substring(0, 32)}...
                </option>
              ))}
            </select>

            <button
              onClick={handleRunScan}
              disabled={isScanning}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#75b5ef] hover:bg-[#5da5e6] text-white font-bold text-xs shadow-md transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 text-[#00d8ff] ${
                  isScanning ? "animate-spin" : ""
                }`}
              />
              <span>{isScanning ? "Analyzing Gaps..." : "Run AI Gap Scan"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Audit Readiness Scorecard & Findings */}
      {auditResult && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Score Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#e2e8f0] shadow-xs flex flex-col justify-between space-y-6">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Auditor Readiness Score
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-black text-slate-900 tracking-tight">
                  {auditResult.readinessScore}%
                </span>
                <span
                  className={`text-xs font-extrabold px-2.5 py-1 rounded-lg border ${getScoreColor(
                    auditResult.readinessScore
                  )}`}
                >
                  {auditResult.readinessScore >= 90 ? "AUDIT READY" : "GAPS DETECTED"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Evaluated against: <strong>{auditResult.auditFramework}</strong>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
              <strong className="font-bold text-slate-900 block mb-1">
                Executive Audit Summary:
              </strong>
              {auditResult.summary}
            </div>

            {/* Strengths Verified */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Auditor-Verified Strengths:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {auditResult.strengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 2 & 3: Detailed Gap Analysis & Remediation */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-[#e2e8f0] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Flagged Gaps & Remediation Actions ({auditResult.findings.length})</span>
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                Click action to auto-remediate
              </span>
            </div>

            <div className="space-y-3">
              {auditResult.findings.map((f, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-[#75b5ef] transition-all space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        {f.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          f.severity === "High"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : f.severity === "Medium"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-sky-50 text-sky-700 border-sky-200"
                        }`}
                      >
                        {f.severity} Severity
                      </span>
                    </div>

                    <button
                      onClick={() => onApplyFix(selectedDoc, f.remediation)}
                      className="text-xs font-bold text-[#0284c7] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-[#00d8ff]" />
                      <span>Auto-apply fix</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-700 font-medium">
                    {f.issue}
                  </p>

                  <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 text-[11px] text-slate-600 flex items-start gap-2">
                    <strong className="text-slate-900 shrink-0">Recommended Fix:</strong>
                    <span>{f.remediation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
