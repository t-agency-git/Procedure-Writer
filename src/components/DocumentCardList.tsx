import React from "react";
import {
  FileText,
  ShieldAlert,
  GitFork,
  Cpu,
  ArrowUpRight,
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  HardHat,
  Search,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Bookmark,
} from "lucide-react";
import { ProcedureDocument, ServiceCategory } from "../types";

interface DocumentCardListProps {
  documents: ProcedureDocument[];
  selectedDocId: string;
  onSelectDoc: (doc: ProcedureDocument) => void;
  onOpenCreateModal: (defaultType?: string) => void;
  category: ServiceCategory;
}

export const DocumentCardList: React.FC<DocumentCardListProps> = ({
  documents,
  selectedDocId,
  onSelectDoc,
  onOpenCreateModal,
  category,
}) => {
  if (documents.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-10 border border-[#e2e8f0] text-center max-w-lg mx-auto mt-8 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-[#75b5ef]/15 text-[#75b5ef] flex items-center justify-center mx-auto mb-4 border border-[#75b5ef]/30">
          <Sparkles className="w-8 h-8 text-[#00d8ff]" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">
          No procedures found
        </h3>
        <p className="text-sm text-slate-500 mb-6">
          No documents match your current filter or search query. You can generate a new audit-ready document in seconds.
        </p>
        <button
          onClick={() => onOpenCreateModal(category)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#75b5ef] hover:bg-[#5da5e6] text-white font-bold text-sm shadow-md transition-all cursor-pointer hover:scale-[1.02]"
        >
          <Sparkles className="w-4 h-4 text-[#00d8ff]" />
          <span>Generate New Draft</span>
        </button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "In Review":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Audited":
        return "bg-sky-50 text-sky-700 border-sky-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "Critical":
        return "text-rose-600 bg-rose-50 border-rose-200";
      case "High":
        return "text-amber-600 bg-amber-50 border-amber-200";
      default:
        return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((doc) => {
        const isSelected = doc.id === selectedDocId;
        const isSafety =
          doc.type === "safety-file" ||
          doc.type === "safety-plan" ||
          doc.code.startsWith("SAF");

        return (
          <div
            key={doc.id}
            onClick={() => onSelectDoc(doc)}
            className={`group relative bg-white rounded-2xl p-5 border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
              isSelected
                ? "border-[#75b5ef] shadow-md ring-2 ring-[#00d8ff]/30 -translate-y-0.5"
                : "border-[#e2e8f0] hover:border-[#75b5ef]/60 hover:shadow-md hover:-translate-y-0.5"
            }`}
          >
            {/* Top row: Code, Type Icon, Status */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#75b5ef] bg-[#75b5ef]/10 px-2 py-0.5 rounded-md border border-[#75b5ef]/20">
                    {doc.code}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase">
                    v{doc.version}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                      doc.status
                    )}`}
                  >
                    {doc.status}
                  </span>
                </div>
              </div>

              {/* Title & Department */}
              <h3 className="font-bold text-slate-900 text-base mb-1.5 line-clamp-2 group-hover:text-[#0284c7] transition-colors leading-snug">
                {doc.title}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                {doc.purpose}
              </p>
            </div>

            {/* Middle: Framework tags & steps count */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#75b5ef]" />
                  {doc.framework.split("&")[0].trim()}
                </span>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${getRiskBadge(
                    doc.riskLevel
                  )}`}
                >
                  {doc.riskLevel} Risk
                </span>
              </div>

              {/* Bottom footer: Steps, Date, and Arrow CTA */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-slate-700">
                    {doc.steps.length} Steps
                  </span>
                  <span>•</span>
                  <span className="truncate">{doc.department.split("&")[0]}</span>
                </div>
                <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-[#75b5ef] group-hover:text-white flex items-center justify-center transition-colors">
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" />
                </div>
              </div>
            </div>

            {/* Glowing cyan bottom highlight bar for active card */}
            {isSelected && (
              <div className="absolute -bottom-px left-6 right-6 h-0.5 bg-gradient-to-r from-[#75b5ef] via-[#00d8ff] to-[#75b5ef] rounded-full" />
            )}
          </div>
        );
      })}
    </div>
  );
};
