import React, { useState, useMemo } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { DocumentCardList } from "./components/DocumentCardList";
import { ProcedureEditor } from "./components/ProcedureEditor";
import { SafetyFilesHub } from "./components/SafetyFilesHub";
import { AuditStudio } from "./components/AuditStudio";
import { RolloutTraining } from "./components/RolloutTraining";
import { InspectorPanel } from "./components/InspectorPanel";
import { CreateModal } from "./components/CreateModal";
import { ProcedureBuilderStudio } from "./components/ProcedureBuilderStudio";
import { DocumentLibrary } from "./components/DocumentLibrary";
import { TeamAndApprovals } from "./components/TeamAndApprovals";
import { WorkspaceSettingsDrawer } from "./components/WorkspaceSettingsDrawer";
import { mockProcedures } from "./data/mockTemplates";
import {
  mockTeamMembers,
  mockApprovalRequests,
  mockWorkspaceSettings,
} from "./data/mockTeamAndSettings";
import {
  ProcedureDocument,
  ServiceCategory,
  AttachmentFile,
  TeamMember,
  ApprovalRequest,
  WorkspaceSettingsData,
} from "./types";
import {
  FileText,
  ShieldCheck,
  GitFork,
  Cpu,
  HardHat,
  SearchCheck,
  UserCheck,
  ArrowLeft,
  Sparkles,
  Plus,
  LayoutGrid,
  Users,
  Layers,
  Settings,
} from "lucide-react";

export default function App() {
  const [currentCategory, setCurrentCategory] = useState<ServiceCategory>("library");
  const [documents, setDocuments] = useState<ProcedureDocument[]>(mockProcedures);
  const [selectedDocId, setSelectedDocId] = useState<string>(mockProcedures[0].id);
  const [viewMode, setViewMode] = useState<"list" | "detail">("list");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isSettingsDrawerOpen, setIsSettingsDrawerOpen] = useState<boolean>(false);

  // Builder initial states
  const [builderInitialType, setBuilderInitialType] = useState<string>("sop");
  const [builderInitialTitle, setBuilderInitialTitle] = useState<string>("");

  // Team & Approvals data state
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>(mockApprovalRequests);
  const [workspaceSettings, setWorkspaceSettings] = useState<WorkspaceSettingsData>(mockWorkspaceSettings);

  // Find currently active document
  const selectedDoc = useMemo(() => {
    return (
      documents.find((d) => d.id === selectedDocId) ||
      documents[0] ||
      mockProcedures[0]
    );
  }, [documents, selectedDocId]);

  // Map category to documents
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // Category match
      let matchesCategory = false;
      if (currentCategory === "sop") matchesCategory = doc.type === "sop";
      else if (currentCategory === "safety-files")
        matchesCategory =
          doc.type === "safety-file" ||
          doc.type === "safety-plan" ||
          doc.code.startsWith("SAF");
      else if (currentCategory === "compliance")
        matchesCategory = doc.type === "compliance";
      else if (currentCategory === "workflow")
        matchesCategory = doc.type === "workflow";
      else if (currentCategory === "ai-governance")
        matchesCategory = doc.type === "ai-governance";
      else matchesCategory = true; // for audit/rollout/library

      // Status filter
      const matchesStatus =
        statusFilter === "All" || doc.status === statusFilter;

      // Search query
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        doc.title.toLowerCase().includes(q) ||
        doc.code.toLowerCase().includes(q) ||
        doc.framework.toLowerCase().includes(q) ||
        doc.department.toLowerCase().includes(q) ||
        doc.purpose.toLowerCase().includes(q);

      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [documents, currentCategory, statusFilter, searchQuery]);

  // Safety documents specifically
  const safetyDocs = useMemo(() => {
    return documents.filter(
      (d) =>
        d.type === "safety-file" ||
        d.type === "safety-plan" ||
        d.code.startsWith("SAF")
    );
  }, [documents]);

  // Status counts for current category
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: 0,
      Approved: 0,
      "In Review": 0,
      Audited: 0,
      Draft: 0,
    };

    documents
      .filter((doc) => {
        if (currentCategory === "sop") return doc.type === "sop";
        if (currentCategory === "safety-files")
          return (
            doc.type === "safety-file" ||
            doc.type === "safety-plan" ||
            doc.code.startsWith("SAF")
          );
        if (currentCategory === "compliance") return doc.type === "compliance";
        if (currentCategory === "workflow") return doc.type === "workflow";
        if (currentCategory === "ai-governance") return doc.type === "ai-governance";
        return true;
      })
      .forEach((doc) => {
        counts["All"] = (counts["All"] || 0) + 1;
        if (counts[doc.status] !== undefined) {
          counts[doc.status] += 1;
        }
      });

    return counts;
  }, [documents, currentCategory]);

  // Document counts per category for the Sidebar badges
  const documentCountByCategory = useMemo(() => {
    const counts: Record<string, number> = {
      sop: 0,
      compliance: 0,
      workflow: 0,
      "ai-governance": 0,
      "safety-files": 0,
      audit: 0,
      rollout: 0,
      library: documents.length,
    };
    documents.forEach((doc) => {
      if (doc.type === "sop") {
        counts.sop = (counts.sop || 0) + 1;
      } else if (doc.type === "compliance") {
        counts.compliance = (counts.compliance || 0) + 1;
      } else if (doc.type === "workflow") {
        counts.workflow = (counts.workflow || 0) + 1;
      } else if (doc.type === "ai-governance") {
        counts["ai-governance"] = (counts["ai-governance"] || 0) + 1;
      } else if (
        doc.type === "safety-file" ||
        doc.type === "safety-plan" ||
        doc.code.startsWith("SAF")
      ) {
        counts["safety-files"] = (counts["safety-files"] || 0) + 1;
      }
    });
    return counts;
  }, [documents]);

  const pendingApprovalsCount = useMemo(() => {
    return approvalRequests.filter((r) => r.status === "Pending").length;
  }, [approvalRequests]);

  // Category titles & subtitles
  const getCategoryMeta = () => {
    switch (currentCategory) {
      case "library":
        return {
          title: "Document Library",
          subtitle:
            "Central repository containing all standard operating procedures, safety plans, compliance cross-walks, and agentic workflows.",
        };
      case "team-approvals":
        return {
          title: "Team & Approvals Central",
          subtitle:
            "Company team database, multi-tier approval verification gates, and agentic workflow triggers across Slack, Odoo, and MCP.",
        };
      case "builder":
        return {
          title: "Procedure & Plan Builder Studio",
          subtitle:
            "Interactive step builder with AI prompt intake, hazard mitigations, verification gates, and stakeholder delegation.",
        };
      case "sop":
        return {
          title: "SOP Creation & Standardization",
          subtitle:
            "Draft complete Standard Operating Procedures from interviews, raw notes, or existing documents: structured, standardized, and audit-ready.",
        };
      case "safety-files":
        return {
          title: "Safety Files & Operational Plans",
          subtitle:
            "Standalone studio for HSE site health plans, Job Hazard Analyses (JHA), LOTO programs, and emergency action files.",
        };
      case "compliance":
        return {
          title: "Compliance Documentation",
          subtitle:
            "Procedures mapped clause-by-clause against regulatory standards (ISO 9001, OSHA, HIPAA, SOC 2, FDA).",
        };
      case "workflow":
        return {
          title: "Process Mapping & Workflow Documentation",
          subtitle:
            "Visual, step-by-step workflow diagrams for processes that connect with MCPs, Slack, and Odoo ERP.",
        };
      case "ai-governance":
        return {
          title: "AI Governance & Model-Use Procedures",
          subtitle:
            "Procedures governing generative AI deployment, human-in-the-loop validation, data privacy, and EU AI Act alignment.",
        };
      case "audit":
        return {
          title: "Documentation Audits & Gap Analysis",
          subtitle:
            "Structured review flagging outdated steps, missing sign-offs, and procedures that exist nowhere but in someone's head.",
        };
      case "rollout":
        return {
          title: "Rollout & Team Training",
          subtitle:
            "Publish into your QMS or wiki and brief the team that has to follow it, with comprehension sign-off tracking.",
        };
      default:
        return {
          title: "Procedure Repository",
          subtitle: "Enterprise procedural governance and safety engineering.",
        };
    }
  };

  const { title: categoryTitle, subtitle: categorySubtitle } = getCategoryMeta();

  // Handlers
  const handleSelectDoc = (doc: ProcedureDocument) => {
    setSelectedDocId(doc.id);
    setViewMode("detail");
  };

  const handleUpdateDocument = (updatedDoc: ProcedureDocument) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === updatedDoc.id ? updatedDoc : d))
    );
  };

  // Navigates directly to the Procedure and Plan Builder page (No pop-up!)
  const handleOpenBuilder = (defaultType: string = "sop", defaultTitle: string = "") => {
    setBuilderInitialType(defaultType);
    setBuilderInitialTitle(defaultTitle);
    setCurrentCategory("builder");
    setViewMode("list");
  };

  const handleSaveBuilderDocument = (newDoc: ProcedureDocument) => {
    setDocuments([newDoc, ...documents]);
    setSelectedDocId(newDoc.id);
    // Add approval request for this new doc
    const newApproval: ApprovalRequest = {
      id: `appr-${Date.now()}`,
      procedureId: newDoc.id,
      procedureCode: newDoc.code,
      procedureTitle: newDoc.title,
      submittedBy: "Lead Quality Engineer",
      submittedDate: new Date().toISOString().split("T")[0],
      department: newDoc.department,
      framework: newDoc.framework,
      riskLevel: newDoc.riskLevel,
      currentTier: "Tier 1 - Peer Review",
      status: "Pending",
      reviewers: newDoc.signOffs.map((s, idx) => ({
        memberId: `tm-${idx + 1}`,
        name: s.name,
        role: s.role,
        status: s.status as any,
      })),
      verificationMilestones: [
        { id: "m-1", title: "Procedural step sequence validated by operator", completed: true, verifiedBy: "Alex Mercer", timestamp: "Today" },
        { id: "m-2", title: "Hazard controls & PPE cross-checked against OSHA/ISO", completed: false },
        { id: "m-3", title: "Regulatory clause citations cross-walked", completed: false },
        { id: "m-4", title: "Supervisory sign-off applied with cryptographic hash", completed: false },
      ],
      agenticTriggers: {
        slackNotified: false,
        odooSynced: false,
        mcpBroadcast: true,
      },
    };
    setApprovalRequests([newApproval, ...approvalRequests]);
    setCurrentCategory(newDoc.type as ServiceCategory);
    setViewMode("detail");
  };

  // Approval Actions
  const handleApproveRequest = (requestId: string, reviewerId: string, comment?: string) => {
    setApprovalRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;

        const updatedReviewers = req.reviewers.map((r) => {
          if (r.memberId === reviewerId) {
            return {
              ...r,
              status: "Approved" as const,
              comment: comment || "Approved and verified against ISO / OSHA standards.",
              digitalSignature: `SHA256:0x${Math.random().toString(16).substr(2, 8).toUpperCase()}`,
            };
          }
          return r;
        });

        const allApproved = updatedReviewers.every((r) => r.status === "Approved");
        return {
          ...req,
          status: allApproved ? ("Approved" as const) : ("Pending" as const),
          reviewers: updatedReviewers,
        };
      })
    );

    // Sync with main document
    const req = approvalRequests.find((r) => r.id === requestId);
    if (req) {
      setDocuments((prevDocs) =>
        prevDocs.map((d) => {
          if (d.id === req.procedureId) {
            return {
              ...d,
              status: "Approved",
              signOffs: d.signOffs.map((s) => ({
                ...s,
                status: "Approved",
                date: new Date().toISOString().split("T")[0],
              })),
            };
          }
          return d;
        })
      );
    }
  };

  const handleRequestRevision = (requestId: string, reviewerId: string, comment: string) => {
    setApprovalRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;
        return {
          ...req,
          status: "Revision Requested",
          reviewers: req.reviewers.map((r) =>
            r.memberId === reviewerId
              ? { ...r, status: "Revision Requested", comment }
              : r
          ),
        };
      })
    );
  };

  const handleAddTeamMember = (newMember: TeamMember) => {
    setTeamMembers([newMember, ...teamMembers]);
  };

  const handleToggleMilestone = (requestId: string, milestoneId: string) => {
    setApprovalRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;
        return {
          ...req,
          verificationMilestones: req.verificationMilestones.map((m) => {
            if (m.id === milestoneId) {
              const nextState = !m.completed;
              return {
                ...m,
                completed: nextState,
                verifiedBy: nextState ? "Dr. Elena Rostova" : undefined,
                timestamp: nextState ? "Just now" : undefined,
              };
            }
            return m;
          }),
        };
      })
    );
  };

  const handleTriggerAgenticSync = (requestId: string, type: "slack" | "odoo" | "mcp") => {
    setApprovalRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;
        return {
          ...req,
          agenticTriggers: {
            ...req.agenticTriggers,
            slackNotified: type === "slack" ? !req.agenticTriggers.slackNotified : req.agenticTriggers.slackNotified,
            odooSynced: type === "odoo" ? !req.agenticTriggers.odooSynced : req.agenticTriggers.odooSynced,
            mcpBroadcast: type === "mcp" ? !req.agenticTriggers.mcpBroadcast : req.agenticTriggers.mcpBroadcast,
          },
        };
      })
    );
  };

  const handleRunAudit = (doc: ProcedureDocument) => {
    setSelectedDocId(doc.id);
    setCurrentCategory("audit");
  };

  const handleApplyAuditFix = (doc: ProcedureDocument, remediation: string) => {
    const updated = {
      ...doc,
      status: "Approved" as const,
      steps: [
        ...doc.steps,
        {
          stepNumber: doc.steps.length + 1,
          title: "Remediated Audit Verification",
          actor: "Compliance Officer",
          instruction: remediation,
          clauseCitation: `[${doc.framework.split("&")[0].trim()} §8.5]`,
        },
      ],
    };
    handleUpdateDocument(updated);
  };

  const handleExportMarkdown = (doc: ProcedureDocument) => {
    const markdown = `# ${doc.title}
**Code:** ${doc.code} | **Version:** ${doc.version} | **Status:** ${doc.status}
**Department:** ${doc.department} | **Framework:** ${doc.framework} | **Risk Level:** ${doc.riskLevel}
**Effective Date:** ${doc.effectiveDate} | **Review Date:** ${doc.reviewDate}

---

## 1. Purpose & Objectives
${doc.purpose}

## 2. Scope & Applicability
${doc.scopeDescription}

## 3. Roles & Responsibilities
${doc.responsibilities.map((r) => `- **${r.role}**: ${r.responsibility}`).join("\n")}

## 4. Definitions & Terms
${doc.definitions.map((d) => `- **${d.term}**: ${d.definition}`).join("\n")}

## 5. Regulatory Framework & Clause Citations
${doc.clausesReferenced.map((c) => `- **${c.framework} Clause ${c.clause}**: ${c.description}`).join("\n")}

## 6. Procedural Steps
${doc.steps
  .map(
    (s) =>
      `### Step ${s.stepNumber}: ${s.title}
- **Actor:** ${s.actor}
- **Instruction:** ${s.instruction}
${s.safetyWarning ? `- **Safety Directive:** ${s.safetyWarning}` : ""}
${s.systemTool ? `- **System / Tool:** ${s.systemTool}` : ""}
${s.clauseCitation ? `- **Citation:** ${s.clauseCitation}` : ""}`
  )
  .join("\n\n")}

## 7. Safety Safeguards & Hazard Controls
${doc.safetyControls.map((sc) => `- **${sc.hazard}** (${sc.controlLevel}): ${sc.requirement}`).join("\n")}

## 8. Audit & Evidence Verification
${doc.auditChecklist.map((ac) => `- **${ac.requirement}**: Status: ${ac.status} (Evidence: ${ac.evidenceRequired})`).join("\n")}

## 9. Sign-off Ledger
${doc.signOffs.map((so) => `- **${so.role}**: ${so.name} — ${so.status} ${so.date ? `(${so.date})` : ""}`).join("\n")}
`;

    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${doc.code}_${doc.title.replace(/\s+/g, "_")}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleAddComment = (text: string) => {
    const newComment = {
      id: `c-${Date.now()}`,
      author: "Alex Mercer",
      timestamp: "Just now",
      message: text,
    };
    const updated = {
      ...selectedDoc,
      comments: [newComment, ...(selectedDoc.comments || [])],
    };
    handleUpdateDocument(updated);
  };

  const handleAddAttachment = (file: AttachmentFile) => {
    const updated = {
      ...selectedDoc,
      attachments: [...(selectedDoc.attachments || []), file],
    };
    handleUpdateDocument(updated);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f9f9f9] text-slate-900 font-sans antialiased">
      {/* 1. Left-Hand Collapsible Sidebar */}
      <Sidebar
        currentCategory={currentCategory}
        onSelectCategory={(cat) => {
          setCurrentCategory(cat);
          setViewMode("list");
        }}
        onOpenBuilder={handleOpenBuilder}
        onOpenWorkspaceSettings={() => setIsSettingsDrawerOpen(true)}
        documentCountByCategory={documentCountByCategory}
        pendingApprovalsCount={pendingApprovalsCount}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
      />

      {/* 2. Main Content Center Column */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f9f9f9]">
        {/* Top Header */}
        <Header
          currentCategory={currentCategory}
          categoryTitle={categoryTitle}
          categorySubtitle={categorySubtitle}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          statusCounts={statusCounts}
          isInspectorOpen={isInspectorOpen}
          onToggleInspector={() => setIsInspectorOpen((prev) => !prev)}
          onOpenCreateModal={() => handleOpenBuilder(currentCategory)}
          hasAiKey={true}
        />

        {/* Scrollable Workspace View */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* Sub-header Controls when inside Document Detail */}
          {viewMode === "detail" &&
            currentCategory !== "safety-files" &&
            currentCategory !== "audit" &&
            currentCategory !== "rollout" &&
            currentCategory !== "builder" &&
            currentCategory !== "library" &&
            currentCategory !== "team-approvals" && (
              <div className="flex items-center justify-between pb-2">
                <button
                  onClick={() => setViewMode("list")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-[#75b5ef] text-slate-700 text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-[#75b5ef]" />
                  <span>Back to {categoryTitle} List</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">
                    Editing: <strong className="text-slate-800">{selectedDoc.code}</strong>
                  </span>
                </div>
              </div>
            )}

          {/* Conditional View Rendering based on active service category */}
          {currentCategory === "builder" ? (
            /* Procedure and Plan Builder Studio Page (No pop-up!) */
            <ProcedureBuilderStudio
              onBack={() => setCurrentCategory("library")}
              onSaveDocument={handleSaveBuilderDocument}
              teamMembers={teamMembers}
              initialType={builderInitialType}
              initialTitle={builderInitialTitle}
            />
          ) : currentCategory === "library" ? (
            /* Document Library Full Section */
            <DocumentLibrary
              documents={documents}
              onSelectDoc={(doc) => {
                setSelectedDocId(doc.id);
                setCurrentCategory(doc.type as ServiceCategory);
                setViewMode("detail");
              }}
              onOpenBuilder={handleOpenBuilder}
            />
          ) : currentCategory === "team-approvals" ? (
            /* Team & Approvals Central Section */
            <TeamAndApprovals
              teamMembers={teamMembers}
              approvalRequests={approvalRequests}
              onApproveRequest={handleApproveRequest}
              onRequestRevision={handleRequestRevision}
              onAddTeamMember={handleAddTeamMember}
              onToggleMilestone={handleToggleMilestone}
              onTriggerAgenticSync={handleTriggerAgenticSync}
            />
          ) : currentCategory === "safety-files" ? (
            <SafetyFilesHub
              safetyDocuments={safetyDocs}
              onSelectDoc={(doc) => {
                setSelectedDocId(doc.id);
                setViewMode("detail");
              }}
              onOpenCreateModal={handleOpenBuilder}
            />
          ) : currentCategory === "audit" ? (
            <AuditStudio
              documents={documents}
              selectedDoc={selectedDoc}
              onSelectDoc={(doc) => setSelectedDocId(doc.id)}
              onApplyFix={handleApplyAuditFix}
            />
          ) : currentCategory === "rollout" ? (
            <RolloutTraining
              document={selectedDoc}
              onUpdateDocument={handleUpdateDocument}
            />
          ) : viewMode === "detail" ? (
            <ProcedureEditor
              document={selectedDoc}
              onUpdateDocument={handleUpdateDocument}
              onRunAudit={handleRunAudit}
              onExportMarkdown={handleExportMarkdown}
            />
          ) : (
            <div>
              {/* Category Overview Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {categoryTitle}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Showing {filteredDocuments.length} registered procedures in current view
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenBuilder(currentCategory)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#75b5ef] hover:bg-[#5da5e6] text-white text-xs font-bold shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-[#00d8ff]" />
                    <span>New {categoryTitle.split(" ")[0]}</span>
                  </button>
                </div>
              </div>

              {/* Cards Grid */}
              <DocumentCardList
                documents={filteredDocuments}
                selectedDocId={selectedDocId}
                onSelectDoc={handleSelectDoc}
                onOpenCreateModal={handleOpenBuilder}
                category={currentCategory}
              />
            </div>
          )}
        </main>
      </div>

      {/* 3. Right-Hand Inspector & Audit Dossier Panel */}
      <InspectorPanel
        document={selectedDoc}
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        onAddComment={handleAddComment}
        onAddAttachment={handleAddAttachment}
      />

      {/* 4. Workspace Settings Slide-Out Drawer Menu (MCP / Slack / Odoo) */}
      <WorkspaceSettingsDrawer
        isOpen={isSettingsDrawerOpen}
        onClose={() => setIsSettingsDrawerOpen(false)}
        settings={workspaceSettings}
        onSaveSettings={(newSettings) => setWorkspaceSettings(newSettings)}
      />
    </div>
  );
}
