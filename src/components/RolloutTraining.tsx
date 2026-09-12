import React, { useState } from "react";
import {
  UserCheck,
  Share2,
  BookOpen,
  CheckSquare,
  FileCheck,
  Send,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { ProcedureDocument } from "../types";

interface RolloutTrainingProps {
  document: ProcedureDocument;
  onUpdateDocument: (doc: ProcedureDocument) => void;
}

export const RolloutTraining: React.FC<RolloutTrainingProps> = ({
  document,
  onUpdateDocument,
}) => {
  const [acknowledgedMembers, setAcknowledgedMembers] = useState<
    Array<{ name: string; role: string; date: string }>
  >([
    { name: "Gabriel Lam", role: "Production Supervisor", date: "2026-03-14 14:20" },
    { name: "Elena Rostova", role: "QA Analyst", date: "2026-03-14 16:45" },
  ]);

  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("Operating Specialist");
  const [copiedWiki, setCopiedWiki] = useState(false);

  const handleAddAcknowledgment = () => {
    if (!newMemberName.trim()) return;
    setAcknowledgedMembers((prev) => [
      ...prev,
      {
        name: newMemberName,
        role: newMemberRole,
        date: new Date().toLocaleString(),
      },
    ]);
    setNewMemberName("");
  };

  const handleCopyWiki = () => {
    const wikiContent = `# ${document.title} (${document.code})
**Status:** ${document.status} | **Version:** ${document.version} | **Framework:** ${document.framework}

## 1. Purpose
${document.purpose}

## 2. Key Procedural Steps
${document.steps.map((s) => `${s.stepNumber}. **${s.actor}**: ${s.instruction}`).join("\n")}

## 3. Mandatory Safety Requirements
${document.safetyControls.map((sc) => `- **${sc.hazard}**: ${sc.requirement}`).join("\n")}
`;
    navigator.clipboard.writeText(wikiContent);
    setCopiedWiki(true);
    setTimeout(() => setCopiedWiki(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Rollout Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#e2e8f0] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#75b5ef]/15 text-[#0284c7] text-xs font-bold border border-[#75b5ef]/30">
              <UserCheck className="w-4 h-4 text-[#75b5ef]" />
              <span>QMS PUBLISHING & TEAM ROLLOUT</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Rollout & Team Training Studio
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Ensure approved procedures don't just sit in a folder. Instantly publish to your internal QMS or wiki, generate a 3-minute team briefing, and capture employee comprehension sign-offs.
            </p>
          </div>

          <button
            onClick={handleCopyWiki}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#75b5ef] hover:bg-[#5da5e6] text-white font-bold text-xs shadow-md transition-all cursor-pointer hover:scale-[1.02] shrink-0"
          >
            {copiedWiki ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4 text-[#00d8ff]" />}
            <span>{copiedWiki ? "Wiki Markdown Copied!" : "Copy QMS / Wiki Format"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module 1: 3-Minute Supervisor Briefing Cards */}
        <div className="bg-white rounded-3xl p-6 border border-[#e2e8f0] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#75b5ef]" />
              <span>3-Minute Shift Briefing Card</span>
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00d8ff]/20 text-[#0284c7]">
              Ready to Read
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-700">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <strong className="text-slate-900 font-bold block mb-1">
                Core Purpose in 1 Sentence:
              </strong>
              {document.purpose}
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <strong className="text-slate-900 font-bold block mb-1">
                The 3 Things That Cannot Fail:
              </strong>
              {document.steps.slice(0, 3).map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#75b5ef] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>
                    <strong>{s.actor}:</strong> {s.instruction.substring(0, 90)}...
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900">
              <strong className="font-bold block mb-0.5">
                Stop-Work Safety Trigger:
              </strong>
              {document.safetyControls[0]?.requirement || "Report any uncertified deviations to supervisor immediately."}
            </div>
          </div>
        </div>

        {/* Module 2: Team Comprehension Sign-off Ledger */}
        <div className="bg-white rounded-3xl p-6 border border-[#e2e8f0] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-[#75b5ef]" />
              <span>Team Comprehension Sign-off Ledger</span>
            </h3>
            <span className="text-xs font-bold text-emerald-600">
              {acknowledgedMembers.length} Signed
            </span>
          </div>

          {/* Quick Sign-off Input */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Record Employee Training Acknowledgment
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Employee Full Name"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#75b5ef]"
              />
              <input
                type="text"
                placeholder="Job Role"
                value={newMemberRole}
                onChange={(e) => setNewMemberRole(e.target.value)}
                className="w-36 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#75b5ef]"
              />
              <button
                onClick={handleAddAcknowledgment}
                className="px-3 py-1.5 rounded-xl bg-[#75b5ef] text-white text-xs font-bold hover:bg-[#5da5e6] cursor-pointer"
              >
                Sign
              </button>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
            {acknowledgedMembers.map((m, idx) => (
              <div
                key={idx}
                className="p-3 flex items-center justify-between hover:bg-slate-50"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">
                      {m.name}
                    </span>
                    <span className="text-[11px] text-slate-500">{m.role}</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {m.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
