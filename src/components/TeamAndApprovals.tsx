import React, { useState } from "react";
import {
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  MessageSquare,
  Search,
  Filter,
  Plus,
  ShieldCheck,
  Award,
  ChevronRight,
  ExternalLink,
  Bot,
  Zap,
  CheckSquare,
  FileText,
  KeyRound,
  Sparkles,
  Building,
  Mail,
  UserCheck
} from "lucide-react";
import { TeamMember, ApprovalRequest, RiskLevel } from "../types";

interface TeamAndApprovalsProps {
  teamMembers: TeamMember[];
  approvalRequests: ApprovalRequest[];
  onApproveRequest: (requestId: string, reviewerId: string, comment?: string) => void;
  onRequestRevision: (requestId: string, reviewerId: string, comment: string) => void;
  onAddTeamMember: (member: TeamMember) => void;
  onToggleMilestone: (requestId: string, milestoneId: string) => void;
  onTriggerAgenticSync: (requestId: string, type: "slack" | "odoo" | "mcp") => void;
}

export const TeamAndApprovals: React.FC<TeamAndApprovalsProps> = ({
  teamMembers,
  approvalRequests,
  onApproveRequest,
  onRequestRevision,
  onAddTeamMember,
  onToggleMilestone,
  onTriggerAgenticSync,
}) => {
  const [activeTab, setActiveTab] = useState<"approvals" | "team">("approvals");
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [selectedTier, setSelectedTier] = useState<string>("All");
  const [teamSearch, setTeamSearch] = useState<string>("");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false);

  // New team member state
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("");
  const [newMemberDept, setNewMemberDept] = useState("Quality Assurance");
  const [newMemberTier, setNewMemberTier] = useState<"Tier 1 - Peer" | "Tier 2 - Lead" | "Tier 3 - Executive / QMS Director">("Tier 2 - Lead");
  const [newMemberCert, setNewMemberCert] = useState("");

  // Filtered team members
  const filteredTeam = teamMembers.filter((m) => {
    if (selectedDept !== "All" && m.department !== selectedDept) return false;
    if (selectedTier !== "All" && !m.approvalAuthorityLevel.includes(selectedTier)) return false;
    if (teamSearch.trim()) {
      const q = teamSearch.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.department.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberEmail.trim()) return;

    const newMember: TeamMember = {
      id: `tm-${Date.now()}`,
      name: newMemberName,
      email: newMemberEmail,
      role: newMemberRole || "Compliance Specialist",
      department: newMemberDept,
      avatar: `https://images.unsplash.com/photo-${1530000000000 + Math.floor(Math.random() * 9999999)}?w=150&auto=format&fit=crop&q=80`,
      certifications: newMemberCert
        ? newMemberCert.split(",").map((c) => c.trim())
        : ["ISO 9001 Internal Auditor"],
      status: "Active",
      approvalAuthorityLevel: newMemberTier,
      activeProceduresCount: 0,
      pendingApprovalsCount: 0,
    };

    onAddTeamMember(newMember);
    setIsInviteModalOpen(false);
    setNewMemberName("");
    setNewMemberEmail("");
    setNewMemberRole("");
    setNewMemberCert("");
  };

  const pendingApprovalsCount = approvalRequests.filter((r) => r.status === "Pending").length;

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#75b5ef]/15 text-[#0284c7] text-xs font-bold border border-[#75b5ef]/30">
              <UserCheck className="w-3.5 h-3.5 text-[#75b5ef]" />
              <span>ENTERPRISE GOVERNANCE & MULTI-TIER SIGN-OFFS</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              Team & Approvals Central
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Manage qualified procedural signatories, oversee multi-tier approval gates, track verification milestones, and dispatch agentic integrations across Slack, Odoo ERP, and MCP context tools.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#75b5ef] hover:bg-[#5da5e6] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#00d8ff]" />
              <span>Add / Invite Signatory</span>
            </button>
          </div>
        </div>

        {/* Studio Sub-Tabs */}
        <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100">
          <button
            onClick={() => setActiveTab("approvals")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "approvals"
                ? "bg-[#75b5ef] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Approvals Queue & Agentic Triggers</span>
            {pendingApprovalsCount > 0 && (
              <span className="ml-1 px-2 py-0.5 rounded-full bg-white text-[#0284c7] text-[10px] font-black">
                {pendingApprovalsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("team")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "team"
                ? "bg-[#75b5ef] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Company Team & Signatories Database</span>
            <span className="ml-1 px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-black">
              {teamMembers.length}
            </span>
          </button>
        </div>
      </div>

      {/* 1. APPROVALS QUEUE & VERIFICATION MILESTONES */}
      {activeTab === "approvals" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {approvalRequests.map((req) => {
              const completedMilestones = req.verificationMilestones.filter((m) => m.completed).length;
              const totalMilestones = req.verificationMilestones.length;
              const milestonePercent = Math.round((completedMilestones / totalMilestones) * 100);

              return (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5 hover:border-[#75b5ef]/50 transition-all"
                >
                  {/* Card Top Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-md bg-[#75b5ef]/15 text-[#0284c7] font-mono font-bold text-xs">
                          {req.procedureCode}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          {req.department}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs font-mono text-slate-500">
                          {req.framework}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            req.riskLevel === "Critical"
                              ? "bg-red-100 text-red-800"
                              : req.riskLevel === "High"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {req.riskLevel} Risk
                        </span>
                      </div>
                      <h3 className="text-base font-black text-slate-900 tracking-tight mt-1.5">
                        {req.procedureTitle}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Submitted by <strong className="text-slate-700">{req.submittedBy}</strong> on {req.submittedDate} • Current Stage: <strong className="text-[#0284c7]">{req.currentTier}</strong>
                      </p>
                    </div>

                    {/* Agentic Integrations Trigger Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => onTriggerAgenticSync(req.id, "slack")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          req.agenticTriggers.slackNotified
                            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                        title="Slack Bot approval notification webhook"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#4A154B]" />
                        <span>Slack #{req.agenticTriggers.slackNotified ? "Notified" : "Notify"}</span>
                      </button>

                      <button
                        onClick={() => onTriggerAgenticSync(req.id, "odoo")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          req.agenticTriggers.odooSynced
                            ? "bg-purple-50 border-purple-200 text-purple-800"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-purple-50 hover:text-purple-900"
                        }`}
                        title="Sync with Odoo Quality & Documents Management Systems"
                      >
                        <Zap className="w-3.5 h-3.5 text-[#714B67]" />
                        <span>Odoo QMS {req.agenticTriggers.odooSynced ? "Synced" : "Sync"}</span>
                      </button>

                      <button
                        onClick={() => onTriggerAgenticSync(req.id, "mcp")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          req.agenticTriggers.mcpBroadcast
                            ? "bg-sky-50 border-sky-200 text-sky-800"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-sky-50"
                        }`}
                        title="Model Context Protocol (MCP) tool exposure for AI agents"
                      >
                        <Bot className="w-3.5 h-3.5 text-[#00d8ff]" />
                        <span>MCP {req.agenticTriggers.mcpBroadcast ? "Active" : "Expose"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Verification Milestones Checklist (User's explicitly liked feature!) */}
                  <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckSquare className="w-4 h-4 text-[#75b5ef]" />
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          Mandatory Verification Milestones ({completedMilestones}/{totalMilestones} Completed)
                        </h4>
                      </div>
                      <span className="text-xs font-bold text-[#0284c7]">
                        {milestonePercent}% Ready for Sign-Off
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#75b5ef] to-[#00d8ff] transition-all duration-300"
                        style={{ width: `${milestonePercent}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                      {req.verificationMilestones.map((m) => (
                        <div
                          key={m.id}
                          onClick={() => onToggleMilestone(req.id, m.id)}
                          className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs transition-all cursor-pointer ${
                            m.completed
                              ? "bg-white border-emerald-200 text-slate-800 shadow-2xs"
                              : "bg-white/60 border-slate-200 text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={m.completed}
                            onChange={() => {}} // Handled by div click
                            className="mt-0.5 rounded text-[#75b5ef] focus:ring-[#75b5ef] cursor-pointer"
                          />
                          <div className="flex-1">
                            <span className={m.completed ? "font-semibold text-slate-900" : ""}>
                              {m.title}
                            </span>
                            {m.verifiedBy && (
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                Verified by {m.verifiedBy} ({m.timestamp})
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Multi-Tier Reviewers List & Sign-Off Actions */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Assigned Signatories & Approval Hierarchy
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {req.reviewers.map((rev, idx) => (
                        <div
                          key={idx}
                          className={`p-3.5 rounded-xl border text-xs flex flex-col justify-between ${
                            rev.status === "Approved"
                              ? "bg-emerald-50/40 border-emerald-200"
                              : "bg-white border-slate-200"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-bold uppercase text-slate-500">
                                Tier {idx + 1}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  rev.status === "Approved"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-amber-100 text-amber-800"
                                }`}
                              >
                                {rev.status}
                              </span>
                            </div>
                            <div className="font-bold text-slate-900">{rev.name}</div>
                            <div className="text-[11px] text-slate-500">{rev.role}</div>
                            {rev.digitalSignature && (
                              <div className="mt-2 text-[10px] font-mono text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                                Signed: {rev.digitalSignature}
                              </div>
                            )}
                          </div>

                          {rev.status === "Pending" && (
                            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-1.5">
                              <button
                                onClick={() => onApproveRequest(req.id, rev.memberId)}
                                className="flex-1 py-1.5 px-2 rounded-lg bg-[#75b5ef] hover:bg-[#5da5e6] text-white text-[11px] font-bold transition-all shadow-xs cursor-pointer text-center"
                              >
                                Approve & Sign
                              </button>
                              <button
                                onClick={() =>
                                  onRequestRevision(
                                    req.id,
                                    rev.memberId,
                                    "Minor calibration tolerance update requested."
                                  )
                                }
                                className="py-1.5 px-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold transition-all cursor-pointer"
                              >
                                Request Changes
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. COMPANY TEAM & SIGNATORIES DATABASE */}
      {activeTab === "team" && (
        <div className="space-y-6">
          {/* Search & Department Filters */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={teamSearch}
                onChange={(e) => setTeamSearch(e.target.value)}
                placeholder="Search signatories by name, email, credentials, or department..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#75b5ef] focus:ring-2 focus:ring-[#75b5ef]/20 outline-hidden bg-slate-50/50"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-bold text-[11px]">Department:</span>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold focus:border-[#75b5ef] outline-hidden"
              >
                <option value="All">All Departments</option>
                <option value="Quality Assurance">Quality Assurance</option>
                <option value="HSE & Operations">HSE & Operations</option>
                <option value="Engineering & Data">Engineering & Data</option>
                <option value="Legal & Compliance">Legal & Compliance</option>
                <option value="Manufacturing & Production">Manufacturing & Production</option>
              </select>
            </div>
          </div>

          {/* Team Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTeam.map((member) => (
              <div
                key={member.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-[#75b5ef] shadow-xs hover:shadow-md transition-all space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-2xs"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">
                        {member.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {member.role}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        {member.department}
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    {member.status}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Approval Authority:
                  </span>
                  <span className="font-bold text-[#0284c7]">
                    {member.approvalAuthorityLevel}
                  </span>
                </div>

                {/* Certifications badges */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Credentials & Licenses:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {member.certifications.map((cert, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-[#75b5ef]/15 text-[#0284c7] font-semibold text-[10px] border border-[#75b5ef]/20"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Procedures & Contact stats */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>
                    Authored: <strong className="text-slate-800">{member.activeProceduresCount}</strong>
                  </span>
                  <span>
                    Pending: <strong className="text-amber-600">{member.pendingApprovalsCount}</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-base">
                Add Team Member / Signatory
              </h3>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="e.g. Dr. Maya Patel"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#75b5ef] outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Corporate Email *
                </label>
                <input
                  type="email"
                  required
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="e.g. maya.patel@acme-corp.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#75b5ef] outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Role Title
                </label>
                <input
                  type="text"
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  placeholder="e.g. Senior Safety & Operations Engineer"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#75b5ef] outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Department
                  </label>
                  <select
                    value={newMemberDept}
                    onChange={(e) => setNewMemberDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#75b5ef] outline-hidden bg-white"
                  >
                    <option value="Quality Assurance">Quality Assurance</option>
                    <option value="HSE & Operations">HSE & Operations</option>
                    <option value="Engineering & Data">Engineering & Data</option>
                    <option value="Legal & Compliance">Legal & Compliance</option>
                    <option value="Manufacturing & Production">Manufacturing & Production</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Signatory Tier
                  </label>
                  <select
                    value={newMemberTier}
                    onChange={(e) => setNewMemberTier(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#75b5ef] outline-hidden bg-white"
                  >
                    <option value="Tier 1 - Peer">Tier 1 - Peer</option>
                    <option value="Tier 2 - Lead">Tier 2 - Lead</option>
                    <option value="Tier 3 - Executive / QMS Director">Tier 3 - Exec/Director</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Certifications (comma-separated)
                </label>
                <input
                  type="text"
                  value={newMemberCert}
                  onChange={(e) => setNewMemberCert(e.target.value)}
                  placeholder="e.g. ISO 9001 Auditor, OSHA 30, Six Sigma Green Belt"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#75b5ef] outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#75b5ef] hover:bg-[#5da5e6] text-white font-bold shadow-sm"
                >
                  Add Signatory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
