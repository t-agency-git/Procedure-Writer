import React, { useState } from "react";
import {
  Sparkles,
  ArrowLeft,
  FileText,
  ShieldCheck,
  GitFork,
  Cpu,
  HardHat,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Send,
  Wand2,
  Layers,
  ChevronRight,
  HelpCircle,
  Clock,
  ShieldAlert,
  User,
  Building,
  CheckSquare
} from "lucide-react";
import {
  ProcedureDocument,
  ServiceCategory,
  RiskLevel,
  ProcedureStep,
  SafetyControl,
  SignOff,
} from "../types";
import { TeamMember } from "../types";

interface ProcedureBuilderStudioProps {
  onBack: () => void;
  onSaveDocument: (doc: ProcedureDocument) => void;
  teamMembers: TeamMember[];
  initialType?: string;
  initialTitle?: string;
}

export const ProcedureBuilderStudio: React.FC<ProcedureBuilderStudioProps> = ({
  onBack,
  onSaveDocument,
  teamMembers,
  initialType = "sop",
  initialTitle = "",
}) => {
  // Builder Steps navigation
  const [activeStepTab, setActiveStepTab] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [docType, setDocType] = useState<string>(initialType);
  const [title, setTitle] = useState<string>(initialTitle);
  const [code, setCode] = useState<string>(
    initialType === "safety-files" || initialType === "safety-plan"
      ? `SAF-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`
      : initialType === "compliance"
      ? `CMP-${Math.floor(1000 + Math.random() * 9000)}`
      : initialType === "workflow"
      ? `WKF-${Math.floor(100 + Math.random() * 900)}`
      : initialType === "ai-governance"
      ? `AIG-${Math.floor(200 + Math.random() * 800)}`
      : `SOP-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [department, setDepartment] = useState<string>("Quality Assurance & Operations");
  const [framework, setFramework] = useState<string>("ISO 9001:2015 & OSHA 1910");
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("High");
  const [purpose, setPurpose] = useState<string>(
    "Define standardized execution steps, supervisory verification gates, and hazard controls to ensure zero compliance deviations."
  );
  const [scopeDescription, setScopeDescription] = useState<string>(
    "Applies to all certified operators, technicians, shift managers, and cross-functional teams executing operational cycles."
  );

  // Raw Prompt / AI Intake
  const [aiIntakePrompt, setAiIntakePrompt] = useState<string>("");
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);

  // Procedural Steps
  const [steps, setSteps] = useState<ProcedureStep[]>([
    {
      stepNumber: 1,
      title: "Pre-Operational Verification & Safety Check",
      actor: "Lead Operator",
      instruction: "Inspect the primary workspace, confirm lockout tags and calibrate diagnostic telemetry before starting.",
      safetyWarning: "Mandatory PPE (Class 2 eye protection and static-dissipative footwear) required prior to entry.",
      systemTool: "Odoo ERP / Telemetry Station",
      clauseCitation: "ISO 9001 §8.5.1",
    },
    {
      stepNumber: 2,
      title: "Sequence Execution & In-Process Validation",
      actor: "Operations Specialist",
      instruction: "Execute processing parameters according to standard tolerance bands (±0.2% variance allowed).",
      systemTool: "Veeva Vault QMS",
      clauseCitation: "OSHA 1910.147",
    },
  ]);

  // Safety Controls
  const [safetyControls, setSafetyControls] = useState<SafetyControl[]>([
    {
      hazard: "Pinch Point & Mechanical Entanglement Hazard",
      controlLevel: "Engineering",
      requirement: "Physical interlock guardrails must be locked during operation.",
      riskRating: "High",
    },
    {
      hazard: "Chemical / Toxic Vapor Exhalation",
      controlLevel: "PPE",
      requirement: "Vapor respirator with organic filter cartridges rated NIOSH N95.",
      riskRating: "Medium",
    },
  ]);

  // Signatories
  const [signOffs, setSignOffs] = useState<SignOff[]>([
    {
      role: "Operations Lead",
      name: teamMembers[4]?.name || "Carlos Mendez",
      status: "Pending",
    },
    {
      role: "Quality & Compliance Director",
      name: teamMembers[0]?.name || "Dr. Elena Rostova",
      status: "Pending",
    },
  ]);

  // Handle doc type change and adjust defaults
  const handleTypeChange = (type: string) => {
    setDocType(type);
    if (type === "safety-files" || type === "safety-plan") {
      setCode(`SAF-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
      setFramework("OSHA 1910 & NFPA 70E");
      setRiskLevel("Critical");
    } else if (type === "compliance") {
      setCode(`CMP-${Math.floor(1000 + Math.random() * 9000)}`);
      setFramework("ISO 9001:2015 / SOC 2 Type II");
      setRiskLevel("High");
    } else if (type === "workflow") {
      setCode(`WKF-${Math.floor(100 + Math.random() * 900)}`);
      setFramework("Enterprise MCP & Odoo QMS Process Map");
      setRiskLevel("Medium");
    } else if (type === "ai-governance") {
      setCode(`AIG-${Math.floor(200 + Math.random() * 800)}`);
      setFramework("EU AI Act / NIST AI RMF 1.0");
      setRiskLevel("High");
    } else {
      setCode(`SOP-${Math.floor(1000 + Math.random() * 9000)}`);
      setFramework("ISO 9001:2015 & cGMP");
      setRiskLevel("High");
    }
  };

  // Trigger AI Auto-Fill & Synthesis
  const handleGenerateWithAi = async () => {
    setIsAiGenerating(true);

    try {
      const response = await fetch("/api/generate-procedure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: docType,
          title: title || `${docType.toUpperCase()} Standard Procedure`,
          department,
          framework,
          riskLevel,
          notes: aiIntakePrompt,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.title) setTitle(data.title);
        if (data.purpose) setPurpose(data.purpose);
        if (data.scopeDescription) setScopeDescription(data.scopeDescription);
        if (data.steps && data.steps.length > 0) setSteps(data.steps);
        if (data.safetyControls && data.safetyControls.length > 0)
          setSafetyControls(data.safetyControls);
      } else {
        // Fallback intelligent generator
        applyFallbackGeneration();
      }
    } catch {
      applyFallbackGeneration();
    } finally {
      setIsAiGenerating(false);
      setActiveStepTab(3); // Jump to steps tab to inspect
    }
  };

  const applyFallbackGeneration = () => {
    if (docType === "safety-files" || docType === "safety-plan") {
      setTitle(title || "Hazardous Chemical Handling & Emergency Spill Response Protocol");
      setPurpose("Establish zero-exposure containment protocols, emergency PPE gear requirements, and secondary containment procedures.");
      setSteps([
        {
          stepNumber: 1,
          title: "Pre-Entry Atmosphere & Gas Scrubber Check",
          actor: "HSE Specialist",
          instruction: "Verify multi-gas detector shows oxygen > 19.5% and VOC levels under 5 ppm.",
          safetyWarning: "DO NOT enter containment cell if auditory alarm triggers.",
          systemTool: "Dräger Multi-Gas Monitor",
          clauseCitation: "OSHA 1910.120",
        },
        {
          stepNumber: 2,
          title: "Secondary Containment Valve Lockdown",
          actor: "Facility Technician",
          instruction: "Turn primary intake manifold 90 degrees clockwise to engage manual mechanical lockbox.",
          safetyWarning: "Full face shield and butyl gloves required.",
          systemTool: "Lockout Station B",
          clauseCitation: "OSHA 1910.147",
        },
        {
          stepNumber: 3,
          title: "Neutralization & Hazmat Waste Disposal",
          actor: "Certified Hazmat Handler",
          instruction: "Spread vermiculite absorbent across liquid boundary from exterior to center.",
          systemTool: "Hazmat Drum Station",
          clauseCitation: "EPA RCRA Title 40",
        },
      ]);
      setSafetyControls([
        {
          hazard: "Corrosive Acidic Splash",
          controlLevel: "PPE",
          requirement: "Level B Chemical Resistant suit with positive pressure respirator.",
          riskRating: "Critical",
        },
        {
          hazard: "Toxic Vapor Inhalation",
          controlLevel: "Engineering",
          requirement: "Emergency exfiltration fan with carbon scrubbers operating at 1200 CFM.",
          riskRating: "Critical",
        },
      ]);
    } else {
      setTitle(title || "Standard Operating Procedure: Enterprise Batch Certification");
      setPurpose("Establish verifiable procedural steps, digital signature sign-offs, and compliance checkpoints.");
      setSteps([
        {
          stepNumber: 1,
          title: "Intake Document Verification",
          actor: "QA Analyst",
          instruction: "Audit upstream production records against lot certification parameters.",
          systemTool: "Odoo ERP / QMS",
          clauseCitation: "ISO 9001 §8.6",
        },
        {
          stepNumber: 2,
          title: "Calibration & Tolerance Check",
          actor: "Lead Inspector",
          instruction: "Check sensor calibration certificates within 30-day validity window.",
          systemTool: "Fluke Calibrator",
          clauseCitation: "ISO 9001 §7.1.5",
        },
        {
          stepNumber: 3,
          title: "Supervisory Batch Sign-Off",
          actor: "Operations Lead",
          instruction: "Review non-conformance logs and counter-sign electronic batch record.",
          systemTool: "Digital Vault",
          clauseCitation: "21 CFR Part 11",
        },
      ]);
    }
  };

  // Add Step
  const handleAddStep = () => {
    setSteps([
      ...steps,
      {
        stepNumber: steps.length + 1,
        title: "New Procedural Step",
        actor: "Assigned Operator",
        instruction: "Describe explicit action to perform, criteria to meet, and tools required.",
        systemTool: "QMS Station",
        clauseCitation: "Clause Ref",
      },
    ]);
  };

  // Remove Step
  const handleRemoveStep = (index: number) => {
    const updated = steps.filter((_, i) => i !== index).map((s, idx) => ({ ...s, stepNumber: idx + 1 }));
    setSteps(updated);
  };

  // Add Safety Control
  const handleAddSafetyControl = () => {
    setSafetyControls([
      ...safetyControls,
      {
        hazard: "Uncontrolled Energy Release",
        controlLevel: "Engineering",
        requirement: "Install lockbox lockout hasp and verify zero voltage with multimeter.",
        riskRating: "High",
      },
    ]);
  };

  // Final Publish / Save
  const handleComplete = () => {
    const newDoc: ProcedureDocument = {
      id: `doc-${Date.now()}`,
      code: code || `SOP-${Math.floor(1000 + Math.random() * 9000)}`,
      title: title || "Untitled Procedure",
      type: (docType as ServiceCategory) || "sop",
      status: "Draft",
      version: "1.0.0",
      effectiveDate: new Date().toISOString().split("T")[0],
      reviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      department,
      framework,
      riskLevel,
      purpose,
      scopeDescription,
      responsibilities: [
        { role: steps[0]?.actor || "Lead Operator", responsibility: "Executes primary sequential verification." },
        { role: "Supervisor", responsibility: "Validates adherence to quality criteria." },
      ],
      definitions: [
        { term: "Critical Control Point (CCP)", definition: "A step at which control can be applied to prevent or eliminate a safety hazard." },
      ],
      clausesReferenced: [
        { framework, clause: "§8.5", description: "Operational planning and standardized control." },
      ],
      steps,
      workflowStages: steps.map((s) => ({
        stage: s.title,
        action: s.instruction,
        owner: s.actor,
        handoffTo: "Next Stage Reviewer",
      })),
      safetyControls,
      exceptions: ["Deviations must be logged within 2 hours in QMS Non-Conformance report."],
      auditChecklist: [
        { requirement: "Operator certified on active procedure revision", status: "Compliant", evidenceRequired: "Training sign-off record" },
        { requirement: "Physical verification gates documented in log", status: "Compliant", evidenceRequired: "Electronic batch sheet" },
      ],
      signOffs,
      attachments: [],
      comments: [
        {
          id: `c-${Date.now()}`,
          author: "ProcedureWriter AI",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          timestamp: "Just now",
          message: `Created via Procedure & Plan Builder with ${steps.length} sequential execution gates.`,
        },
      ],
    };

    onSaveDocument(newDoc);
  };

  const documentTypeOptions = [
    {
      id: "sop",
      label: "Standard Operating Procedure (SOP)",
      desc: "Uniform, repeatable multi-step procedures with actor roles, tools, and regulatory citations.",
      icon: <FileText className="w-5 h-5 text-[#75b5ef]" />,
      badge: "ISO 9001 / cGMP",
    },
    {
      id: "safety-files",
      label: "Safety File & Operational Plan",
      desc: "High-risk operational plans, Emergency Action Plans (EAP), Job Hazard Analyses (JHA), LOTO & Spill protocols.",
      icon: <HardHat className="w-5 h-5 text-[#00d8ff]" />,
      badge: "OSHA 1910 / NFPA 70E",
    },
    {
      id: "compliance",
      label: "Compliance & Regulatory Mapping",
      desc: "Cross-walk procedures clause-by-clause against HIPAA, SOC 2, ISO 27001, and FDA standards.",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
      badge: "SOC 2 / HIPAA",
    },
    {
      id: "workflow",
      label: "Process & Agentic Workflow Map",
      desc: "Sequence diagrams and agentic triggers connecting with MCPs, Slack, and Odoo ERP.",
      icon: <GitFork className="w-5 h-5 text-sky-500" />,
      badge: "MCP / Odoo / Slack",
    },
    {
      id: "ai-governance",
      label: "AI Governance & Model-Use Protocol",
      desc: "Model risk management, human-in-the-loop validation, and EU AI Act / NIST AI RMF compliance.",
      icon: <Cpu className="w-5 h-5 text-purple-500" />,
      badge: "EU AI Act / NIST",
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f9f9f9] text-slate-900 overflow-y-auto">
      {/* Top Header Bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title="Return to previous view"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0284c7] px-2 py-0.5 rounded bg-[#75b5ef]/15">
                  PROCEDURE & PLAN BUILDER
                </span>
                <span className="text-xs font-mono font-semibold text-slate-500">
                  {code}
                </span>
              </div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
                {title || "New Procedure / Operational Plan"}
              </h1>
            </div>
          </div>

          {/* Builder Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleComplete}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#75b5ef] hover:bg-[#5da5e6] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-[#00d8ff]" />
              <span>Save & Launch in Editor</span>
            </button>
          </div>
        </div>

        {/* 4-Step Progress Tabs */}
        <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs font-bold">
          <button
            onClick={() => setActiveStepTab(1)}
            className={`flex items-center justify-center gap-2 py-2 rounded-lg transition-all cursor-pointer ${
              activeStepTab === 1
                ? "bg-[#75b5ef] text-white shadow-xs"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
              1
            </span>
            <span className="hidden sm:inline">Select Architecture</span>
          </button>
          <button
            onClick={() => setActiveStepTab(2)}
            className={`flex items-center justify-center gap-2 py-2 rounded-lg transition-all cursor-pointer ${
              activeStepTab === 2
                ? "bg-[#75b5ef] text-white shadow-xs"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
              2
            </span>
            <span className="hidden sm:inline">AI Intake & Scope</span>
          </button>
          <button
            onClick={() => setActiveStepTab(3)}
            className={`flex items-center justify-center gap-2 py-2 rounded-lg transition-all cursor-pointer ${
              activeStepTab === 3
                ? "bg-[#75b5ef] text-white shadow-xs"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
              3
            </span>
            <span className="hidden sm:inline">Execution Steps & Hazards</span>
          </button>
          <button
            onClick={() => setActiveStepTab(4)}
            className={`flex items-center justify-center gap-2 py-2 rounded-lg transition-all cursor-pointer ${
              activeStepTab === 4
                ? "bg-[#75b5ef] text-white shadow-xs"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
              4
            </span>
            <span className="hidden sm:inline">Signatories & Milestones</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 max-w-5xl mx-auto w-full space-y-6">
        {/* STEP 1: SELECT ARCHITECTURE */}
        {activeStepTab === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Select Procedure Architecture
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Choose the structured template model suited for your regulatory framework and team requirements.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documentTypeOptions.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => handleTypeChange(opt.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    docType === opt.id
                      ? "bg-white border-[#75b5ef] shadow-md ring-2 ring-[#75b5ef]/30"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      {opt.icon}
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {opt.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mt-3">
                    {opt.label}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {opt.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setActiveStepTab(2)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#75b5ef] hover:bg-[#5da5e6] text-white text-xs font-bold shadow-sm transition-all"
              >
                <span>Continue to AI Intake</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: AI INTAKE & METADATA */}
        {activeStepTab === 2 && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#75b5ef]/10 via-[#00d8ff]/10 to-transparent border border-[#75b5ef]/30 shadow-xs">
              <div className="flex items-center gap-2.5 mb-2">
                <Sparkles className="w-5 h-5 text-[#0284c7]" />
                <h3 className="font-bold text-slate-900 text-sm">
                  ProcedureWriter AI Intake Assistant
                </h3>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                Paste raw interview transcripts, messy field notes, machine specs, or audit findings. The AI will synthesize standard procedural steps, safety warnings, and ISO/OSHA clause citations.
              </p>
              <textarea
                value={aiIntakePrompt}
                onChange={(e) => setAiIntakePrompt(e.target.value)}
                placeholder="e.g., 'We need an emergency action plan for ammonia refrigeration leakage in Building 4. Operators must wear full acid gear, evacuate sub-basement within 90 seconds, and notify the local hazmat coordinator...'"
                rows={4}
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:border-[#75b5ef] focus:ring-2 focus:ring-[#75b5ef]/20 outline-hidden bg-white text-slate-800"
              />
              <div className="flex justify-between items-center mt-3">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Wand2 className="w-3.5 h-3.5 text-[#75b5ef]" />
                  Auto-derives roles, tools, hazard ratings, and steps
                </span>
                <button
                  onClick={handleGenerateWithAi}
                  disabled={isAiGenerating}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#75b5ef] hover:bg-[#5da5e6] text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50"
                >
                  {isAiGenerating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Synthesizing Procedure...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#00d8ff]" />
                      <span>Generate Draft with AI</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Document Metadata Form */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
                Document Identity & Framework Specifications
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Procedure Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Hazardous Chemical Handling & Emergency Spill Response"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#75b5ef] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Document Code / Prefix *
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold focus:border-[#75b5ef] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Responsible Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#75b5ef] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Primary Regulatory Framework
                  </label>
                  <input
                    type="text"
                    value={framework}
                    onChange={(e) => setFramework(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#75b5ef] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Risk / Hazard Rating
                  </label>
                  <select
                    value={riskLevel}
                    onChange={(e) => setRiskLevel(e.target.value as RiskLevel)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#75b5ef] outline-hidden bg-white"
                  >
                    <option value="Low">Low Risk (Standard Administrative)</option>
                    <option value="Medium">Medium Risk (Operational & Equipment)</option>
                    <option value="High">High Risk (Chemical, Biological, Compliance)</option>
                    <option value="Critical">Critical Risk (Life Safety, High Voltage, LOTO)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Review Cycle
                  </label>
                  <select className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#75b5ef] outline-hidden bg-white">
                    <option>Annual (12 Months - Standard ISO/OSHA)</option>
                    <option>Semi-Annual (6 Months - High Hazard)</option>
                    <option>Quarterly (3 Months - New AI Systems)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 text-xs mb-1">
                  Purpose & Strategic Objective
                </label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  rows={2}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#75b5ef] outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 text-xs mb-1">
                  Scope & Application
                </label>
                <textarea
                  value={scopeDescription}
                  onChange={(e) => setScopeDescription(e.target.value)}
                  rows={2}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#75b5ef] outline-hidden"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setActiveStepTab(1)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold"
              >
                Back
              </button>
              <button
                onClick={() => setActiveStepTab(3)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#75b5ef] hover:bg-[#5da5e6] text-white text-xs font-bold shadow-sm transition-all"
              >
                <span>Continue to Steps & Hazards</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SEQUENTIAL STEPS & SAFETY CONTROLS */}
        {activeStepTab === 3 && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Sequential Execution Gates ({steps.length} Steps)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Numbered sequential steps with designated actor roles, tool systems, and safety warnings.
                  </p>
                </div>
                <button
                  onClick={handleAddStep}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#75b5ef]/15 text-[#0284c7] hover:bg-[#75b5ef]/25 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Step</span>
                </button>
              </div>

              <div className="space-y-3">
                {steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-[#75b5ef] text-white flex items-center justify-center text-xs font-black">
                          {step.stepNumber}
                        </span>
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => {
                            const copy = [...steps];
                            copy[idx].title = e.target.value;
                            setSteps(copy);
                          }}
                          className="font-bold text-slate-900 text-xs px-2 py-1 rounded bg-white border border-slate-200 focus:border-[#75b5ef] outline-hidden"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-500">Actor:</span>
                        <input
                          type="text"
                          value={step.actor}
                          onChange={(e) => {
                            const copy = [...steps];
                            copy[idx].actor = e.target.value;
                            setSteps(copy);
                          }}
                          className="text-xs font-semibold text-slate-700 px-2 py-1 rounded bg-white border border-slate-200 focus:border-[#75b5ef] outline-hidden"
                        />
                        {steps.length > 1 && (
                          <button
                            onClick={() => handleRemoveStep(idx)}
                            className="p-1 rounded text-red-500 hover:bg-red-50"
                            title="Delete step"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <textarea
                      value={step.instruction}
                      onChange={(e) => {
                        const copy = [...steps];
                        copy[idx].instruction = e.target.value;
                        setSteps(copy);
                      }}
                      placeholder="Specific step instructions..."
                      rows={2}
                      className="w-full text-xs p-2 rounded-lg bg-white border border-slate-200 focus:border-[#75b5ef] outline-hidden"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">
                          Safety Warning / Precaution
                        </label>
                        <input
                          type="text"
                          value={step.safetyWarning || ""}
                          onChange={(e) => {
                            const copy = [...steps];
                            copy[idx].safetyWarning = e.target.value;
                            setSteps(copy);
                          }}
                          placeholder="e.g. Verify zero energy with voltmeter before contact"
                          className="w-full px-2 py-1 rounded bg-white border border-amber-200 text-amber-900 focus:border-amber-400 outline-hidden text-[11px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">
                          System Tool / Software
                        </label>
                        <input
                          type="text"
                          value={step.systemTool || ""}
                          onChange={(e) => {
                            const copy = [...steps];
                            copy[idx].systemTool = e.target.value;
                            setSteps(copy);
                          }}
                          placeholder="e.g. Odoo ERP, Fluke Multimeter, Veeva Vault"
                          className="w-full px-2 py-1 rounded bg-white border border-slate-200 focus:border-[#75b5ef] outline-hidden text-[11px]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety Controls / Hierarchy of Controls */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-[#00d8ff]" />
                    <span>Hierarchy of Safety Controls ({safetyControls.length})</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Engineering, Administrative, and PPE controls mitigating operational hazards.
                  </p>
                </div>
                <button
                  onClick={handleAddSafetyControl}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#75b5ef]/15 text-[#0284c7] hover:bg-[#75b5ef]/25 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Control</span>
                </button>
              </div>

              <div className="space-y-2">
                {safetyControls.map((ctrl, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{ctrl.hazard}</span>
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                          {ctrl.controlLevel} Control
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px]">{ctrl.requirement}</p>
                    </div>
                    <button
                      onClick={() =>
                        setSafetyControls(safetyControls.filter((_, idx) => idx !== i))
                      }
                      className="text-slate-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setActiveStepTab(2)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold"
              >
                Back
              </button>
              <button
                onClick={() => setActiveStepTab(4)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#75b5ef] hover:bg-[#5da5e6] text-white text-xs font-bold shadow-sm transition-all"
              >
                <span>Continue to Signatories</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SIGNATORIES & VERIFICATION MILESTONES */}
        {activeStepTab === 4 && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Stakeholders, Signatories & Verification Milestones
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Assign qualified signatories from your company team database for mandatory review and multi-tier approval.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teamMembers.slice(0, 4).map((member) => (
                  <div
                    key={member.id}
                    className="p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-3 bg-slate-50/50"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-300"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">
                          {member.name}
                        </h4>
                        <p className="text-[11px] text-slate-500">{member.role}</p>
                        <span className="text-[10px] font-semibold text-[#0284c7]">
                          {member.approvalAuthorityLevel}
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked={signOffs.some((s) => s.name === member.name)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSignOffs([
                            ...signOffs,
                            { role: member.role, name: member.name, status: "Pending" },
                          ]);
                        } else {
                          setSignOffs(signOffs.filter((s) => s.name !== member.name));
                        }
                      }}
                      className="w-4 h-4 rounded text-[#75b5ef] focus:ring-[#75b5ef]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Ready to Publish Summary Card */}
            <div className="p-6 rounded-2xl bg-[#75b5ef]/10 border border-[#75b5ef]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[#0284c7] uppercase">
                  READY TO INITIALIZE
                </span>
                <h3 className="text-base font-black text-slate-900 mt-0.5">
                  {title || "Untitled Procedure"}
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Includes {steps.length} sequential execution steps, {safetyControls.length} safety controls, and {signOffs.length} assigned signatories.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={onBack}
                  className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Discard
                </button>
                <button
                  onClick={handleComplete}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#75b5ef] hover:bg-[#5da5e6] text-white text-xs font-bold shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#00d8ff]" />
                  <span>Create & Launch Procedure</span>
                </button>
              </div>
            </div>

            <div className="flex justify-start pt-2">
              <button
                onClick={() => setActiveStepTab(3)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold"
              >
                Back to Steps
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
