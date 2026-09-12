export type ServiceCategory =
  | "sop"
  | "compliance"
  | "workflow"
  | "ai-governance"
  | "audit"
  | "rollout"
  | "safety-files"
  | "library"
  | "team-approvals"
  | "builder";

export type DocumentStatus = "Draft" | "In Review" | "Audited" | "Approved";

export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar: string;
  certifications: string[];
  status: "Active" | "On Leave" | "Suspended";
  approvalAuthorityLevel: "Tier 1 - Peer" | "Tier 2 - Lead" | "Tier 3 - Executive / QMS Director";
  activeProceduresCount: number;
  pendingApprovalsCount: number;
}

export interface VerificationMilestone {
  id: string;
  title: string;
  completed: boolean;
  verifiedBy?: string;
  timestamp?: string;
}

export interface ApprovalRequest {
  id: string;
  procedureId: string;
  procedureCode: string;
  procedureTitle: string;
  department: string;
  framework: string;
  riskLevel: RiskLevel;
  submittedBy: string;
  submittedDate: string;
  currentTier: string;
  status: "Pending" | "Approved" | "Revision Requested";
  reviewers: Array<{
    memberId: string;
    name: string;
    role: string;
    status: "Approved" | "Pending" | "Rejected";
    date?: string;
    comment?: string;
    digitalSignature?: string;
  }>;
  agenticTriggers: {
    slackNotified: boolean;
    odooSynced: boolean;
    mcpBroadcast: boolean;
  };
  verificationMilestones: VerificationMilestone[];
}

export interface WorkspaceSettingsData {
  companyName: string;
  qmsPrefix: string;
  isoStandard: string;
  primaryAuditorEmail: string;
  autoArchiveMonths: number;
  dualSignOffRequiredForHighRisk: boolean;
  mcpServerUrl: string;
  mcpEnabled: boolean;
  slackWebhookUrl: string;
  slackChannel: string;
  slackEnabled: boolean;
  odooServerUrl: string;
  odooDatabase: string;
  odooApiKey: string;
  odooEnabled: boolean;
  aiAuditorAutopilot: boolean;
}

export interface ClauseReference {
  framework: string;
  clause: string;
  description: string;
}

export interface ProcedureStep {
  stepNumber: number;
  title: string;
  actor: string;
  instruction: string;
  safetyWarning?: string;
  systemTool?: string;
  clauseCitation?: string;
}

export interface WorkflowStage {
  stage: string;
  action: string;
  owner: string;
  handoffTo: string;
  iconType?: string;
}

export interface SafetyControl {
  hazard: string;
  controlLevel: "Engineering" | "Administrative" | "PPE" | "Elimination";
  requirement: string;
  riskRating?: "Low" | "Medium" | "High";
}

export interface AuditChecklistItem {
  requirement: string;
  status: "Compliant" | "Observation" | "Non-Conformance";
  evidenceRequired: string;
}

export interface SignOff {
  role: string;
  name: string;
  status: "Approved" | "Pending" | "Rejected";
  date?: string;
  signature?: string;
}

export interface AttachmentFile {
  name: string;
  size: string;
  date: string;
  type: string;
}

export interface CommentItem {
  id: string;
  author: string;
  avatar: string;
  timestamp: string;
  message: string;
}

export interface ProcedureDocument {
  id: string;
  code: string;
  title: string;
  type: ServiceCategory | "safety-file" | "safety-plan";
  status: DocumentStatus;
  version: string;
  effectiveDate: string;
  reviewDate: string;
  department: string;
  framework: string;
  riskLevel: RiskLevel;
  purpose: string;
  scopeDescription: string;
  responsibilities: Array<{ role: string; responsibility: string }>;
  definitions: Array<{ term: string; definition: string }>;
  clausesReferenced: ClauseReference[];
  steps: ProcedureStep[];
  workflowStages: WorkflowStage[];
  safetyControls: SafetyControl[];
  exceptions: string[];
  auditChecklist: AuditChecklistItem[];
  signOffs: SignOff[];
  attachments?: AttachmentFile[];
  comments?: CommentItem[];
  rawNotes?: string;
}

export interface AuditFinding {
  category: string;
  severity: "Low" | "Medium" | "High";
  issue: string;
  remediation: string;
}

export interface AuditResult {
  readinessScore: number;
  summary: string;
  findings: AuditFinding[];
  strengths: string[];
  auditFramework: string;
}
