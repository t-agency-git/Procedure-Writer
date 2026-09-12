import React, { useState } from "react";
import {
  ShieldAlert,
  HardHat,
  Flame,
  Zap,
  AlertTriangle,
  FileSpreadsheet,
  FileCheck,
  Plus,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Sliders,
  LifeBuoy,
  FileText,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { ProcedureDocument } from "../types";

interface SafetyFilesHubProps {
  safetyDocuments: ProcedureDocument[];
  onSelectDoc: (doc: ProcedureDocument) => void;
  onOpenCreateModal: (defaultType?: string, defaultTitle?: string) => void;
}

export const SafetyFilesHub: React.FC<SafetyFilesHubProps> = ({
  safetyDocuments,
  onSelectDoc,
  onOpenCreateModal,
}) => {
  // Interactive Risk Assessment Matrix state
  const [severity, setSeverity] = useState<number>(3); // 1 to 5
  const [likelihood, setLikelihood] = useState<number>(3); // 1 to 5
  const riskScore = severity * likelihood; // 1 to 25

  const getRiskCategory = (score: number) => {
    if (score >= 15) return { label: "CRITICAL RISK", color: "bg-rose-500 text-white", border: "border-rose-300" };
    if (score >= 10) return { label: "HIGH RISK", color: "bg-amber-500 text-white", border: "border-amber-300" };
    if (score >= 5) return { label: "MEDIUM RISK", color: "bg-sky-500 text-white", border: "border-sky-300" };
    return { label: "LOW RISK", color: "bg-emerald-500 text-white", border: "border-emerald-300" };
  };

  const riskInfo = getRiskCategory(riskScore);

  const safetyFileTemplates = [
    {
      title: "HSE Site Master Safety Plan",
      standard: "OSHA 1910 & ISO 45001",
      desc: "Comprehensive site-wide occupational health, life safety, contractor induction, and emergency response master plan.",
      icon: <HardHat className="w-5 h-5 text-[#00d8ff]" />,
      riskLevel: "Critical",
      defaultTitle: "Facility Health, Safety & Environmental (HSE) Master Plan",
      framework: "OSHA 1910 / ISO 45001",
    },
    {
      title: "Job Hazard Analysis (JHA / JSA)",
      standard: "OSHA 1910.132 & NIOSH",
      desc: "Step-by-step task breakdown analyzing specific physical, kinetic, chemical, and ergonomic hazards with control mitigations.",
      icon: <FileSpreadsheet className="w-5 h-5 text-[#75b5ef]" />,
      riskLevel: "High",
      defaultTitle: "Job Hazard Analysis (JHA) - High-Hazard Operations",
      framework: "OSHA 1910.132",
    },
    {
      title: "Emergency Action & Evacuation Plan",
      standard: "OSHA 29 CFR 1910.38",
      desc: "Evacuation route mapping, floor warden assignments, muster points, head-counts, and direct first responder coordination.",
      icon: <LifeBuoy className="w-5 h-5 text-rose-500" />,
      riskLevel: "Critical",
      defaultTitle: "Site Emergency Action & Rapid Evacuation Plan (EAP)",
      framework: "OSHA 1910.38",
    },
    {
      title: "Chemical Spill & Hazardous Waste Playbook",
      standard: "OSHA 1910.120 (HAZWOPER)",
      desc: "Secondary containment inspection, chemical compatibility matrices, eyewash travel distances, and spill response SLAs.",
      icon: <Flame className="w-5 h-5 text-amber-500" />,
      riskLevel: "High",
      defaultTitle: "Chemical Handling, Storage & Hazardous Spill Response Playbook",
      framework: "OSHA 1910.120 HAZWOPER",
    },
    {
      title: "Lockout / Tagout (LOTO) Energy Isolation",
      standard: "OSHA 29 CFR 1910.147",
      desc: "Specific procedures for zero-energy state verification across electrical, hydraulic, pneumatic, and thermal systems.",
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      riskLevel: "Critical",
      defaultTitle: "Hazardous Energy Isolation & Lockout / Tagout (LOTO) Program",
      framework: "OSHA 1910.147",
    },
    {
      title: "Contractor Safety & Hot Work Permit File",
      standard: "NFPA 51B & ISO 45001",
      desc: "Permit-to-Work (PTW) protocols, gas monitoring thresholds, fire watch duties, and third-party contractor pre-qualification.",
      icon: <FileCheck className="w-5 h-5 text-emerald-500" />,
      riskLevel: "Medium",
      defaultTitle: "Contractor Safety Prequalification & Hot Work Permit File",
      framework: "NFPA 51B / ISO 45001",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Banner for Standalone Safety Files Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#75b5ef] to-[#5a9ee0] p-8 text-white shadow-lg border border-white/20">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-extrabold border border-white/30">
            <ShieldAlert className="w-3.5 h-3.5 text-[#00d8ff]" />
            <span>STANDALONE SAFETY STUDIO</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white leading-tight">
            Safety Files & Operational Plans Writer
          </h2>
          <p className="text-sm text-white/90 leading-relaxed">
            Generate legally enforceable, OSHA & ISO 45001-aligned safety files, site health plans, Job Hazard Analyses (JHA), and emergency response playbooks with zero compliance loopholes.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onOpenCreateModal("safety-plan", "Facility Health & Safety Master Plan")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-sm shadow-md hover:bg-slate-50 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#00d8ff]" />
              <span>Draft New Safety Plan</span>
            </button>
            <button
              onClick={() => onOpenCreateModal("safety-file", "Job Hazard Analysis (JHA) File")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm border border-white/30 transition-all cursor-pointer"
            >
              <span>+ Create JHA / JSA File</span>
            </button>
          </div>
        </div>

        {/* Decorative background accents */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-15 pointer-events-none flex items-center justify-center">
          <HardHat className="w-72 h-72 text-white transform rotate-12 translate-x-12 translate-y-6" />
        </div>
      </div>

      {/* Grid of Safety File & Plan Templates */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Pre-Engineered Safety File & Plan Blueprints
            </h3>
            <p className="text-xs text-slate-500">
              Click any blueprint to launch an AI-generated draft customized to your facility.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {safetyFileTemplates.map((template, idx) => (
            <div
              key={idx}
              onClick={() => onOpenCreateModal("safety-plan", template.defaultTitle)}
              className="group bg-white rounded-2xl p-5 border border-[#e2e8f0] hover:border-[#75b5ef] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#75b5ef]/10 border border-[#75b5ef]/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {template.icon}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    {template.standard}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-base mb-1.5 group-hover:text-[#0284c7] transition-colors">
                  {template.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {template.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#75b5ef]" />
                  Audit Ready
                </span>
                <span className="font-bold text-[#0284c7] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Draft File →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Risk Assessment Matrix Calculator */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#75b5ef]/15 text-[#0284c7]">
                <AlertTriangle className="w-4 h-4 text-[#75b5ef]" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">
                Interactive Risk Matrix & Control Hierarchy Calculator
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Adjust hazard likelihood and severity to dynamically determine required safety controls for your procedure.
            </p>
          </div>

          {/* Dynamic Calculated Score */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Calculated Risk
              </span>
              <span className="text-xl font-black text-slate-900">
                Score: {riskScore} / 25
              </span>
            </div>
            <div className={`px-3 py-1.5 rounded-xl font-extrabold text-xs shadow-xs ${riskInfo.color}`}>
              {riskInfo.label}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
          {/* Likelihood & Severity Sliders */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span>Likelihood of Occurrence</span>
                <span className="text-[#0284c7]">Level {likelihood} of 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={likelihood}
                onChange={(e) => setLikelihood(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#75b5ef]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Rare (1)</span>
                <span>Unlikely (2)</span>
                <span>Possible (3)</span>
                <span>Likely (4)</span>
                <span>Almost Certain (5)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span>Consequence Severity</span>
                <span className="text-[#0284c7]">Level {severity} of 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={severity}
                onChange={(e) => setSeverity(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#75b5ef]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>First Aid (1)</span>
                <span>Medical Treatment (2)</span>
                <span>Lost Time (3)</span>
                <span>Permanent Disability (4)</span>
                <span>Fatality (5)</span>
              </div>
            </div>
          </div>

          {/* Mandatory Hierarchy of Controls Output */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Required Hierarchy of Controls for Level {riskScore}
            </span>
            <ul className="space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <span className="text-slate-700 font-medium">
                  <strong>Engineering Isolation:</strong> Physical interlocks, machine guards, or automatic tripwires.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <span className="text-slate-700 font-medium">
                  <strong>Administrative Controls:</strong> Dual-operator countersignatures, 4-gas atmosphere testing.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-[#00d8ff]/30 text-slate-900 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <span className="text-slate-700 font-medium">
                  <strong>Mandatory PPE:</strong> ANSI Z87.1 eye protection, ASTM steel-toe, arc/chemical rating.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Existing Safety Documents in Workspace */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900">
            Active Safety Files & Master Plans in Repository ({safetyDocuments.length})
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {safetyDocuments.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onSelectDoc(doc)}
              className="bg-white rounded-2xl p-5 border border-[#e2e8f0] hover:border-[#75b5ef] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-bold text-[#75b5ef] bg-[#75b5ef]/10 px-2 py-0.5 rounded border border-[#75b5ef]/20">
                    {doc.code}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {doc.status}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-base mb-1">
                  {doc.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                  {doc.purpose}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-700">
                  {doc.framework}
                </span>
                <span className="font-bold text-[#0284c7] flex items-center gap-1">
                  Open File →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
