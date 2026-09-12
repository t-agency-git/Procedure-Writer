import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  FileText,
  ShieldCheck,
  GitFork,
  Cpu,
  HardHat,
  ChevronRight,
  Download,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ExternalLink,
  Layers,
  LayoutGrid,
  List,
  Sparkles,
  ArrowUpDown,
  FileCheck2,
  Building,
  Plus
} from "lucide-react";
import { ProcedureDocument, ServiceCategory, RiskLevel } from "../types";

interface DocumentLibraryProps {
  documents: ProcedureDocument[];
  onSelectDoc: (doc: ProcedureDocument) => void;
  onOpenBuilder: (defaultType?: string) => void;
}

export const DocumentLibrary: React.FC<DocumentLibraryProps> = ({
  documents,
  onSelectDoc,
  onOpenBuilder,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedRisk, setSelectedRisk] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [sortField, setSortField] = useState<"code" | "title" | "department" | "risk">("code");
  const [sortAsc, setSortAsc] = useState(true);

  // Filtered documents
  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      // Category filter
      if (selectedCategory !== "All") {
        if (selectedCategory === "sop" && doc.type !== "sop") return false;
        if (
          selectedCategory === "safety" &&
          !(doc.type === "safety-file" || doc.type === "safety-plan" || doc.code.startsWith("SAF"))
        )
          return false;
        if (selectedCategory === "compliance" && doc.type !== "compliance") return false;
        if (selectedCategory === "workflow" && doc.type !== "workflow") return false;
        if (selectedCategory === "ai-governance" && doc.type !== "ai-governance") return false;
      }

      // Status filter
      if (selectedStatus !== "All" && doc.status !== selectedStatus) return false;

      // Risk filter
      if (selectedRisk !== "All" && doc.riskLevel !== selectedRisk) return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          doc.title.toLowerCase().includes(q) ||
          doc.code.toLowerCase().includes(q) ||
          doc.department.toLowerCase().includes(q) ||
          doc.framework.toLowerCase().includes(q) ||
          doc.purpose.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [documents, selectedCategory, selectedStatus, selectedRisk, searchQuery]);

  // Sorted documents
  const sortedDocs = useMemo(() => {
    return [...filteredDocs].sort((a, b) => {
      let valA = a[sortField] || "";
      let valB = b[sortField] || "";
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filteredDocs, sortField, sortAsc]);

  // Statistics
  const stats = useMemo(() => {
    const total = documents.length;
    const approved = documents.filter((d) => d.status === "Approved").length;
    const inReview = documents.filter((d) => d.status === "In Review").length;
    const critical = documents.filter((d) => d.riskLevel === "Critical" || d.riskLevel === "High").length;
    return { total, approved, inReview, critical };
  }, [documents]);

  const toggleSort = (field: "code" | "title" | "department" | "risk") => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const getDocTypeIcon = (type: string, code: string) => {
    if (type === "safety-file" || type === "safety-plan" || code.startsWith("SAF")) {
      return <HardHat className="w-4 h-4 text-[#00d8ff]" />;
    }
    if (type === "compliance") return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
    if (type === "workflow") return <GitFork className="w-4 h-4 text-sky-500" />;
    if (type === "ai-governance") return <Cpu className="w-4 h-4 text-purple-500" />;
    return <FileText className="w-4 h-4 text-[#75b5ef]" />;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats Overview */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#75b5ef]/15 text-[#0284c7] text-xs font-bold border border-[#75b5ef]/30">
              <Layers className="w-3.5 h-3.5 text-[#75b5ef]" />
              <span>CENTRAL REPOSITORY & MASTER QMS DOSSIER</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              My Procedures & Document Library
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              Unified enterprise registry containing all approved Standard Operating Procedures, Safety Files, Compliance Cross-Walks, Agentic Workflows, and AI Governance Protocols.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenBuilder("sop")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#75b5ef] hover:bg-[#5da5e6] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#00d8ff]" />
              <span>Create New Procedure</span>
            </button>
          </div>
        </div>

        {/* 4 Stat Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-100">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Procedures
            </span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              {stats.total}
            </div>
            <span className="text-[10px] text-slate-400 font-medium">
              Registered in QMS
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              Approved & Active
            </span>
            <div className="text-2xl font-black text-emerald-800 mt-0.5">
              {stats.approved}
            </div>
            <span className="text-[10px] text-emerald-600 font-medium">
              Signed by QMS Lead
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-100">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
              Under Review
            </span>
            <div className="text-2xl font-black text-amber-800 mt-0.5">
              {stats.inReview}
            </div>
            <span className="text-[10px] text-amber-600 font-medium">
              Awaiting verification
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-red-50/60 border border-red-100">
            <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider">
              High / Critical Hazards
            </span>
            <div className="text-2xl font-black text-red-800 mt-0.5">
              {stats.critical}
            </div>
            <span className="text-[10px] text-red-600 font-medium">
              Requires dual-sign-off
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across title, code, purpose, department, or framework citations..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#75b5ef] focus:ring-2 focus:ring-[#75b5ef]/20 outline-hidden bg-slate-50/50"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "table"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                title="Spreadsheet Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                title="Card Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-bold text-[11px] flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" />
            Category:
          </span>
          {["All", "sop", "safety", "compliance", "workflow", "ai-governance"].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer capitalize text-[11px] ${
                  selectedCategory === cat
                    ? "bg-[#75b5ef] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat === "all" ? "All" : cat === "safety" ? "Safety Files" : cat}
              </button>
            )
          )}

          <div className="h-4 w-px bg-slate-200 mx-1" />

          <span className="text-slate-400 font-bold text-[11px]">Status:</span>
          {["All", "Approved", "In Review", "Draft"].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-2.5 py-0.5 rounded-lg font-bold transition-all cursor-pointer text-[11px] ${
                selectedStatus === st
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st}
            </button>
          ))}

          <div className="h-4 w-px bg-slate-200 mx-1" />

          <span className="text-slate-400 font-bold text-[11px]">Risk:</span>
          {["All", "Critical", "High", "Medium", "Low"].map((rk) => (
            <button
              key={rk}
              onClick={() => setSelectedRisk(rk)}
              className={`px-2.5 py-0.5 rounded-lg font-bold transition-all cursor-pointer text-[11px] ${
                selectedRisk === rk
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {rk}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE VIEW */}
      {viewMode === "table" ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-900"
                    onClick={() => toggleSort("code")}
                  >
                    <div className="flex items-center gap-1">
                      <span>Code</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-900"
                    onClick={() => toggleSort("title")}
                  >
                    <div className="flex items-center gap-1">
                      <span>Title & Scope</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-900"
                    onClick={() => toggleSort("department")}
                  >
                    <div className="flex items-center gap-1">
                      <span>Department</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4">Framework</th>
                  <th className="py-3.5 px-4">Hazard Risk</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Signatories</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {sortedDocs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-slate-400">
                      No procedures found matching the selected filters.
                    </td>
                  </tr>
                ) : (
                  sortedDocs.map((doc) => {
                    const approvedCount = doc.signOffs.filter((s) => s.status === "Approved").length;
                    return (
                      <tr
                        key={doc.id}
                        onClick={() => onSelectDoc(doc)}
                        className="hover:bg-[#75b5ef]/5 transition-colors cursor-pointer group"
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          <div className="flex items-center gap-2">
                            {getDocTypeIcon(doc.type, doc.code)}
                            <span>{doc.code}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="font-bold text-slate-900 group-hover:text-[#0284c7] transition-colors">
                            {doc.title}
                          </div>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {doc.purpose}
                          </p>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium">
                          {doc.department}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2 py-0.5 rounded bg-slate-100 font-mono text-[10px] text-slate-700">
                            {doc.framework}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              doc.riskLevel === "Critical"
                                ? "bg-red-100 text-red-800"
                                : doc.riskLevel === "High"
                                ? "bg-amber-100 text-amber-800"
                                : doc.riskLevel === "Medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-slate-100 text-slate-800"
                            }`}
                          >
                            {doc.riskLevel}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              doc.status === "Approved"
                                ? "bg-emerald-100 text-emerald-800"
                                : doc.status === "In Review"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                doc.status === "Approved"
                                  ? "bg-emerald-500"
                                  : doc.status === "In Review"
                                  ? "bg-amber-500"
                                  : "bg-slate-400"
                              }`}
                            />
                            {doc.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-[11px] font-semibold text-slate-600">
                            {approvedCount} / {doc.signOffs.length} Signed
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectDoc(doc);
                            }}
                            className="px-3 py-1 rounded-lg bg-slate-100 group-hover:bg-[#75b5ef] group-hover:text-white text-slate-700 font-bold text-[11px] transition-all"
                          >
                            Open
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onSelectDoc(doc)}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-[#75b5ef] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-mono text-xs font-bold flex items-center gap-1.5">
                    {getDocTypeIcon(doc.type, doc.code)}
                    {doc.code}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      doc.riskLevel === "Critical"
                        ? "bg-red-100 text-red-800"
                        : doc.riskLevel === "High"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {doc.riskLevel} Risk
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm mt-3 line-clamp-2">
                  {doc.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                  {doc.purpose}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-slate-500">
                    <span>Department:</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[160px]">
                      {doc.department}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Framework:</span>
                    <span className="font-mono text-slate-800 font-medium">
                      {doc.framework}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    doc.status === "Approved"
                      ? "bg-emerald-100 text-emerald-800"
                      : doc.status === "In Review"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {doc.status}
                </span>

                <span className="text-xs font-bold text-[#0284c7] flex items-center gap-1">
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
