import React, { useState } from "react";
import {
  FileText,
  ShieldCheck,
  GitFork,
  Cpu,
  ShieldAlert,
  SearchCheck,
  UserCheck,
  Plus,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Flame,
  HardHat,
  FileCheck2,
  Sparkles,
  Layers,
  Settings,
  HelpCircle,
  FolderGit2,
  Users
} from "lucide-react";
import { ServiceCategory } from "../types";

interface SidebarProps {
  currentCategory: ServiceCategory;
  onSelectCategory: (category: ServiceCategory, subFilter?: string) => void;
  onOpenBuilder: (defaultType?: string) => void;
  onOpenWorkspaceSettings?: () => void;
  documentCountByCategory?: Record<string, number>;
  pendingApprovalsCount?: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentCategory,
  onSelectCategory,
  onOpenBuilder,
  onOpenWorkspaceSettings = () => {},
  documentCountByCategory = {},
  pendingApprovalsCount = 2,
  isCollapsed = false,
  onToggleCollapse = () => {},
}) => {
  // Sub-sections accordion expanded states
  const [expandedSections, setExpandedSections] = useState({
    procedures: true,
    safety: true,
    governance: true,
    rollout: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <aside
      className={`relative flex flex-col h-screen bg-[#75b5ef] text-white transition-all duration-300 ease-in-out select-none shadow-xl z-20 ${
        isCollapsed ? "w-20" : "w-72"
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 h-20 border-b border-white/15">
        {!isCollapsed ? (
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-sm group">
              <Sparkles className="w-5 h-5 text-[#00d8ff] group-hover:rotate-12 transition-transform duration-300" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#00d8ff] ring-2 ring-[#75b5ef] animate-pulse" />
            </div>
            <div>
              <div className="font-bold text-lg tracking-tight flex items-center gap-1.5 leading-none">
                <span>Procedure</span>
                <span className="text-white/90 font-light">Writer</span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-white text-[#75b5ef] tracking-wider ml-1 shadow-xs">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-white/80 font-medium mt-1">
                SOPs, Compliance & Safety
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <div className="relative w-11 h-11 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-sm">
              <Sparkles className="w-6 h-6 text-[#00d8ff]" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#00d8ff] ring-2 ring-[#75b5ef] animate-pulse" />
            </div>
          </div>
        )}

        {/* Collapse toggle button */}
        <button
          onClick={onToggleCollapse}
          className={`p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer ${
            isCollapsed ? "absolute -right-3 top-7 bg-white text-[#75b5ef] shadow-md border border-[#75b5ef]/30 hover:bg-slate-50" : ""
          }`}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-[#75b5ef]" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Action Button: Opens Procedure & Plan Builder Directly */}
      <div className="px-4 pt-5 pb-3">
        <button
          onClick={() => onOpenBuilder()}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white text-[#1e293b] font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer group border border-white/40"
          title="Open Procedure and Plan Builder"
        >
          <div className="w-6 h-6 rounded-full bg-[#75b5ef]/20 flex items-center justify-center text-[#75b5ef] group-hover:bg-[#00d8ff]/30 group-hover:text-[#0284c7] transition-colors">
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </div>
          {!isCollapsed && (
            <span className="tracking-tight text-slate-800 font-bold">
              New Draft / Plan
            </span>
          )}
        </button>
      </div>

      {/* Navigation Menu (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
        {/* Core Sections: Document Library & Team Approvals */}
        <div className="space-y-1">
          {/* Document Library */}
          <button
            onClick={() => onSelectCategory("library")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
              currentCategory === "library"
                ? "bg-[#f9f9f9] text-[#0f172a] shadow-md font-semibold relative"
                : "text-white/90 hover:bg-white/15 hover:text-white"
            }`}
            title="My Procedures & Document Library"
          >
            <div
              className={`p-1.5 rounded-lg ${
                currentCategory === "library"
                  ? "bg-[#75b5ef]/20 text-[#0284c7]"
                  : "bg-white/10 text-white"
              }`}
            >
              <Layers className="w-4 h-4 text-[#00d8ff]" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 flex items-center justify-between text-left">
                <span className="truncate font-bold">My Procedures</span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                    currentCategory === "library"
                      ? "bg-[#75b5ef] text-white"
                      : "bg-white/20 text-white"
                  }`}
                >
                  Library
                </span>
              </div>
            )}
            {currentCategory === "library" && !isCollapsed && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#00d8ff] rounded-l-full shadow-xs" />
            )}
          </button>

          {/* Team & Approvals Central */}
          <button
            onClick={() => onSelectCategory("team-approvals")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
              currentCategory === "team-approvals"
                ? "bg-[#f9f9f9] text-[#0f172a] shadow-md font-semibold relative"
                : "text-white/90 hover:bg-white/15 hover:text-white"
            }`}
            title="Team Database & Multi-Tier Approvals"
          >
            <div
              className={`p-1.5 rounded-lg ${
                currentCategory === "team-approvals"
                  ? "bg-[#75b5ef]/20 text-[#0284c7]"
                  : "bg-white/10 text-white"
              }`}
            >
              <Users className="w-4 h-4" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 flex items-center justify-between text-left">
                <span className="truncate font-bold">Team & Approvals</span>
                {pendingApprovalsCount > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#00d8ff] text-slate-900 shadow-xs">
                    {pendingApprovalsCount} pending
                  </span>
                )}
              </div>
            )}
            {currentCategory === "team-approvals" && !isCollapsed && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#00d8ff] rounded-l-full shadow-xs" />
            )}
          </button>
        </div>
        {/* Section 1: Procedures & SOPs */}
        <div>
          {!isCollapsed ? (
            <div
              onClick={() => toggleSection("procedures")}
              className="flex items-center justify-between px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white/75 cursor-pointer hover:text-white"
            >
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#00d8ff]" />
                Procedures & SOPs
              </span>
              {expandedSections.procedures ? (
                <ChevronDown className="w-3.5 h-3.5 opacity-75" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 opacity-75" />
              )}
            </div>
          ) : (
            <div className="w-full border-t border-white/20 my-2" />
          )}

          {(!isCollapsed ? expandedSections.procedures : true) && (
            <div className="mt-1 space-y-1">
              {/* SOP Creation */}
              <button
                onClick={() => onSelectCategory("sop")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  currentCategory === "sop"
                    ? "bg-[#f9f9f9] text-[#0f172a] shadow-md font-semibold relative"
                    : "text-white/90 hover:bg-white/15 hover:text-white"
                }`}
                title="SOP Creation & Standardization"
              >
                <div
                  className={`p-1.5 rounded-lg ${
                    currentCategory === "sop"
                      ? "bg-[#75b5ef]/20 text-[#0284c7]"
                      : "bg-white/10 text-white"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                </div>
                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between text-left">
                    <span className="truncate">SOP Standardization</span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                        currentCategory === "sop"
                          ? "bg-[#75b5ef] text-white"
                          : "bg-white/20 text-white"
                      }`}
                    >
                      {documentCountByCategory?.["sop"] ?? 0}
                    </span>
                  </div>
                )}
                {currentCategory === "sop" && !isCollapsed && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#00d8ff] rounded-l-full shadow-xs" />
                )}
              </button>

              {/* Compliance Documentation */}
              <button
                onClick={() => onSelectCategory("compliance")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  currentCategory === "compliance"
                    ? "bg-[#f9f9f9] text-[#0f172a] shadow-md font-semibold relative"
                    : "text-white/90 hover:bg-white/15 hover:text-white"
                }`}
                title="Compliance Documentation"
              >
                <div
                  className={`p-1.5 rounded-lg ${
                    currentCategory === "compliance"
                      ? "bg-[#75b5ef]/20 text-[#0284c7]"
                      : "bg-white/10 text-white"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                </div>
                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between text-left">
                    <span className="truncate">Compliance Docs</span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                        currentCategory === "compliance"
                          ? "bg-[#75b5ef] text-white"
                          : "bg-white/20 text-white"
                      }`}
                    >
                      {documentCountByCategory?.["compliance"] ?? 0}
                    </span>
                  </div>
                )}
                {currentCategory === "compliance" && !isCollapsed && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#00d8ff] rounded-l-full shadow-xs" />
                )}
              </button>

              {/* Process Mapping & Workflow */}
              <button
                onClick={() => onSelectCategory("workflow")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  currentCategory === "workflow"
                    ? "bg-[#f9f9f9] text-[#0f172a] shadow-md font-semibold relative"
                    : "text-white/90 hover:bg-white/15 hover:text-white"
                }`}
                title="Process Mapping & Workflow"
              >
                <div
                  className={`p-1.5 rounded-lg ${
                    currentCategory === "workflow"
                      ? "bg-[#75b5ef]/20 text-[#0284c7]"
                      : "bg-white/10 text-white"
                  }`}
                >
                  <GitFork className="w-4 h-4" />
                </div>
                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between text-left">
                    <span className="truncate">Workflow Mapping</span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                        currentCategory === "workflow"
                          ? "bg-[#75b5ef] text-white"
                          : "bg-white/20 text-white"
                      }`}
                    >
                      {documentCountByCategory?.["workflow"] ?? 0}
                    </span>
                  </div>
                )}
                {currentCategory === "workflow" && !isCollapsed && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#00d8ff] rounded-l-full shadow-xs" />
                )}
              </button>

              {/* AI Governance */}
              <button
                onClick={() => onSelectCategory("ai-governance")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  currentCategory === "ai-governance"
                    ? "bg-[#f9f9f9] text-[#0f172a] shadow-md font-semibold relative"
                    : "text-white/90 hover:bg-white/15 hover:text-white"
                }`}
                title="AI Governance & Model-Use"
              >
                <div
                  className={`p-1.5 rounded-lg ${
                    currentCategory === "ai-governance"
                      ? "bg-[#75b5ef]/20 text-[#0284c7]"
                      : "bg-white/10 text-white"
                  }`}
                >
                  <Cpu className="w-4 h-4" />
                </div>
                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between text-left">
                    <span className="truncate">AI Governance</span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                        currentCategory === "ai-governance"
                          ? "bg-[#75b5ef] text-white"
                          : "bg-white/20 text-white"
                      }`}
                    >
                      {documentCountByCategory?.["ai-governance"] ?? 0}
                    </span>
                  </div>
                )}
                {currentCategory === "ai-governance" && !isCollapsed && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#00d8ff] rounded-l-full shadow-xs" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Section 2: STANDALONE SECTION: Safety Files & Plans */}
        <div>
          {!isCollapsed ? (
            <div
              onClick={() => toggleSection("safety")}
              className="flex items-center justify-between px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white/75 cursor-pointer hover:text-white"
            >
              <span className="flex items-center gap-1.5">
                <HardHat className="w-3.5 h-3.5 text-[#00d8ff]" />
                Safety Files & Plans
                <span className="bg-[#00d8ff]/30 text-white text-[9px] px-1.5 py-0.2 rounded-full font-extrabold ml-1">
                  NEW
                </span>
              </span>
              {expandedSections.safety ? (
                <ChevronDown className="w-3.5 h-3.5 opacity-75" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 opacity-75" />
              )}
            </div>
          ) : (
            <div className="w-full border-t border-white/20 my-2" />
          )}

          {(!isCollapsed ? expandedSections.safety : true) && (
            <div className="mt-1 space-y-1">
              <button
                onClick={() => onSelectCategory("safety-files")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  currentCategory === "safety-files"
                    ? "bg-[#f9f9f9] text-[#0f172a] shadow-md font-semibold relative"
                    : "text-white/90 hover:bg-white/15 hover:text-white"
                }`}
                title="Safety Files & Master Plans Studio"
              >
                <div
                  className={`p-1.5 rounded-lg ${
                    currentCategory === "safety-files"
                      ? "bg-[#75b5ef]/20 text-[#0284c7]"
                      : "bg-white/10 text-white"
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-[#00d8ff]" />
                </div>
                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between text-left">
                    <span className="truncate">Safety Files & Plans</span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                        currentCategory === "safety-files"
                          ? "bg-[#75b5ef] text-white"
                          : "bg-white/20 text-white"
                      }`}
                    >
                      {documentCountByCategory?.["safety-files"] ?? 0}
                    </span>
                  </div>
                )}
                {currentCategory === "safety-files" && !isCollapsed && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#00d8ff] rounded-l-full shadow-xs" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Section 3: Audits & Gap Analysis */}
        <div>
          {!isCollapsed ? (
            <div
              onClick={() => toggleSection("governance")}
              className="flex items-center justify-between px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white/75 cursor-pointer hover:text-white"
            >
              <span className="flex items-center gap-1.5">
                <SearchCheck className="w-3.5 h-3.5 text-[#00d8ff]" />
                Audits & Readiness
              </span>
              {expandedSections.governance ? (
                <ChevronDown className="w-3.5 h-3.5 opacity-75" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 opacity-75" />
              )}
            </div>
          ) : (
            <div className="w-full border-t border-white/20 my-2" />
          )}

          {(!isCollapsed ? expandedSections.governance : true) && (
            <div className="mt-1 space-y-1">
              <button
                onClick={() => onSelectCategory("audit")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  currentCategory === "audit"
                    ? "bg-[#f9f9f9] text-[#0f172a] shadow-md font-semibold relative"
                    : "text-white/90 hover:bg-white/15 hover:text-white"
                }`}
                title="Documentation Audits & Gap Analysis"
              >
                <div
                  className={`p-1.5 rounded-lg ${
                    currentCategory === "audit"
                      ? "bg-[#75b5ef]/20 text-[#0284c7]"
                      : "bg-white/10 text-white"
                  }`}
                >
                  <SearchCheck className="w-4 h-4" />
                </div>
                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between text-left">
                    <span className="truncate">Audits & Gap Analysis</span>
                    <span
                      className={`text-[11px] px-1.5 py-0.5 rounded font-bold ${
                        currentCategory === "audit"
                          ? "bg-[#00d8ff] text-slate-900"
                          : "bg-white/20 text-white"
                      }`}
                    >
                      AI Scanner
                    </span>
                  </div>
                )}
                {currentCategory === "audit" && !isCollapsed && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#00d8ff] rounded-l-full shadow-xs" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Section 4: Rollout & Team Training */}
        <div>
          {!isCollapsed ? (
            <div
              onClick={() => toggleSection("rollout")}
              className="flex items-center justify-between px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white/75 cursor-pointer hover:text-white"
            >
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-[#00d8ff]" />
                Rollout & QMS
              </span>
              {expandedSections.rollout ? (
                <ChevronDown className="w-3.5 h-3.5 opacity-75" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 opacity-75" />
              )}
            </div>
          ) : (
            <div className="w-full border-t border-white/20 my-2" />
          )}

          {(!isCollapsed ? expandedSections.rollout : true) && (
            <div className="mt-1 space-y-1">
              <button
                onClick={() => onSelectCategory("rollout")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  currentCategory === "rollout"
                    ? "bg-[#f9f9f9] text-[#0f172a] shadow-md font-semibold relative"
                    : "text-white/90 hover:bg-white/15 hover:text-white"
                }`}
                title="Rollout & Team Training"
              >
                <div
                  className={`p-1.5 rounded-lg ${
                    currentCategory === "rollout"
                      ? "bg-[#75b5ef]/20 text-[#0284c7]"
                      : "bg-white/10 text-white"
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                </div>
                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between text-left">
                    <span className="truncate">Rollout & Training</span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                        currentCategory === "rollout"
                          ? "bg-[#75b5ef] text-white"
                          : "bg-white/20 text-white"
                      }`}
                    >
                      Publish
                    </span>
                  </div>
                )}
                {currentCategory === "rollout" && !isCollapsed && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#00d8ff] rounded-l-full shadow-xs" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* User / Workspace Footer */}
      <div className="p-3 border-t border-white/15 bg-black/10">
        {!isCollapsed ? (
          <div
            onClick={onOpenWorkspaceSettings}
            className="flex items-center justify-between p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all cursor-pointer group"
            title="Open Workspace Settings & MCP/Slack/Odoo Integrations"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="User avatar"
                className="w-8 h-8 rounded-full ring-2 ring-[#00d8ff] object-cover shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate group-hover:text-[#00d8ff] transition-colors">
                  Workspace Settings
                </p>
                <p className="text-[10px] text-white/75 truncate flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00d8ff]" />
                  MCP & Slack Ready
                </p>
              </div>
            </div>
            <Settings className="w-4 h-4 text-white/70 group-hover:text-white group-hover:rotate-45 transition-all shrink-0" />
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={onOpenWorkspaceSettings}
              className="p-1 rounded-full ring-2 ring-[#00d8ff] hover:opacity-80 transition-opacity cursor-pointer"
              title="Open Workspace Settings"
            >
              <Settings className="w-4 h-4 text-white" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
