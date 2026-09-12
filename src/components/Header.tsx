import React from "react";
import {
  Search,
  Bell,
  Sparkles,
  Download,
  Share2,
  Printer,
  SlidersHorizontal,
  ChevronRight,
  PanelRightClose,
  PanelRightOpen,
  CheckCircle2,
  Clock,
  FileEdit,
  ShieldCheck,
} from "lucide-react";
import { DocumentStatus, ServiceCategory } from "../types";

interface HeaderProps {
  currentCategory: ServiceCategory;
  categoryTitle: string;
  categorySubtitle: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  statusCounts: Record<string, number>;
  isInspectorOpen: boolean;
  onToggleInspector: () => void;
  onOpenCreateModal: () => void;
  hasAiKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentCategory,
  categoryTitle,
  categorySubtitle,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  statusCounts,
  isInspectorOpen,
  onToggleInspector,
  onOpenCreateModal,
  hasAiKey,
}) => {
  const statuses: Array<{ key: string; label: string; icon: React.ReactNode }> = [
    { key: "All", label: "All Items", icon: null },
    { key: "Approved", label: "Approved", icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> },
    { key: "In Review", label: "In Review", icon: <Clock className="w-3.5 h-3.5 text-amber-500" /> },
    { key: "Audited", label: "Audited", icon: <ShieldCheck className="w-3.5 h-3.5 text-[#0284c7]" /> },
    { key: "Draft", label: "Drafts", icon: <FileEdit className="w-3.5 h-3.5 text-slate-400" /> },
  ];

  return (
    <header className="bg-[#f9f9f9] border-b border-[#e2e8f0] px-6 py-4 flex flex-col gap-4">
      {/* Top Row: Title, Global Search, AI Badge, Actions, Avatar */}
      <div className="flex items-center justify-between gap-4">
        {/* Title & Context */}
        <div className="flex items-center gap-3 min-w-0">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#75b5ef]">
              <span className="uppercase tracking-wider">Workspace</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="text-slate-600 font-bold">{categoryTitle}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>{categoryTitle}</span>
              {currentCategory === "safety-files" && (
                <span className="bg-[#00d8ff]/20 text-[#0284c7] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#00d8ff]/50">
                  Site Safety & HSE
                </span>
              )}
            </h1>
          </div>
        </div>

        {/* Search Bar (Inspired by UI Design.png & UI Design 2.png) */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search procedures, safety plans, clauses (ISO, OSHA, HIPAA)..."
              className="w-full bg-white border border-[#e2e8f0] rounded-xl pl-10 pr-4 py-2 text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#75b5ef] focus:ring-2 focus:ring-[#00d8ff]/25 shadow-xs transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right Tools: AI Model status, Bell, Inspector toggle */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* AI Status Pill with #00d8ff glow */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#75b5ef]/30 shadow-xs"
            title={hasAiKey ? "Connected to Gemini 3.8 Flash" : "AI compliance generator active"}
          >
            <div className="relative">
              <Sparkles className="w-3.5 h-3.5 text-[#00d8ff]" />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#00d8ff] animate-ping" />
            </div>
            <span className="text-[11px] font-bold text-slate-700">
              Gemini AI
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>

          {/* Quick Draft Button */}
          <button
            onClick={onOpenCreateModal}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#75b5ef] hover:bg-[#5da5e6] text-white text-xs font-bold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>+ Draft</span>
          </button>

          {/* Notification Bell */}
          <button
            className="p-2 rounded-xl bg-white border border-[#e2e8f0] text-slate-600 hover:text-slate-900 hover:border-[#75b5ef] transition-colors relative cursor-pointer shadow-xs"
            title="Notifications & Audit alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00d8ff] ring-2 ring-white" />
          </button>

          {/* Inspector Panel Toggle (Inspired by Glendale right drawer in UI Design.png) */}
          <button
            onClick={onToggleInspector}
            className={`p-2 rounded-xl border transition-colors cursor-pointer shadow-xs ${
              isInspectorOpen
                ? "bg-[#75b5ef]/15 border-[#75b5ef] text-[#0284c7]"
                : "bg-white border-[#e2e8f0] text-slate-600 hover:text-slate-900"
            }`}
            title={isInspectorOpen ? "Close details inspector" : "Open details inspector"}
          >
            {isInspectorOpen ? (
              <PanelRightClose className="w-4 h-4" />
            ) : (
              <PanelRightOpen className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Bottom Row: Status Filter Tabs (Directly inspired by UI Design 2.png status pills) */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-0.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1 hidden sm:inline">
            Status:
          </span>
          <div className="flex items-center gap-1.5 bg-slate-200/60 p-1 rounded-xl">
            {statuses.map((item) => {
              const count = statusCounts[item.key] ?? 0;
              const isActive = statusFilter === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => onStatusFilterChange(item.key)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-white text-slate-900 shadow-sm border border-slate-200/80 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? "bg-[#75b5ef] text-white"
                        : "bg-slate-300 text-slate-700"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <p className="text-xs text-slate-500 hidden lg:block italic">
          {categorySubtitle}
        </p>
      </div>
    </header>
  );
};
