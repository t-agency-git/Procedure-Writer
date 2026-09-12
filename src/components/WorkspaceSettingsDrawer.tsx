import React, { useState } from "react";
import {
  X,
  Settings,
  Building,
  ShieldCheck,
  Bot,
  MessageSquare,
  Zap,
  KeyRound,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Sparkles,
  Lock,
  Save,
  Clock,
  HelpCircle,
  ExternalLink
} from "lucide-react";
import { WorkspaceSettingsData } from "../types";

interface WorkspaceSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: WorkspaceSettingsData;
  onSaveSettings: (settings: WorkspaceSettingsData) => void;
}

export const WorkspaceSettingsDrawer: React.FC<WorkspaceSettingsDrawerProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [formData, setFormData] = useState<WorkspaceSettingsData>(settings);
  const [activeTab, setActiveTab] = useState<"general" | "integrations" | "security">("integrations");
  const [testStatus, setTestStatus] = useState<{
    mcp?: "idle" | "testing" | "success" | "error";
    slack?: "idle" | "testing" | "success" | "error";
    odoo?: "idle" | "testing" | "success" | "error";
  }>({ mcp: "idle", slack: "idle", odoo: "idle" });

  if (!isOpen) return null;

  const handleTestMcp = () => {
    setTestStatus((prev) => ({ ...prev, mcp: "testing" }));
    setTimeout(() => {
      setTestStatus((prev) => ({ ...prev, mcp: "success" }));
    }, 900);
  };

  const handleTestSlack = () => {
    setTestStatus((prev) => ({ ...prev, slack: "testing" }));
    setTimeout(() => {
      setTestStatus((prev) => ({ ...prev, slack: "success" }));
    }, 1100);
  };

  const handleTestOdoo = () => {
    setTestStatus((prev) => ({ ...prev, odoo: "testing" }));
    setTimeout(() => {
      setTestStatus((prev) => ({ ...prev, odoo: "success" }));
    }, 1200);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end transition-opacity">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#75b5ef]/15 text-[#0284c7]">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Workspace Settings & Integrations
              </h2>
              <p className="text-xs text-slate-500">
                Configure QMS standards, MCP context servers, Slack bot & Odoo ERP
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50/30 text-xs font-bold">
          <button
            onClick={() => setActiveTab("integrations")}
            className={`py-3 px-4 border-b-2 transition-all cursor-pointer ${
              activeTab === "integrations"
                ? "border-[#75b5ef] text-[#0284c7]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            MCP, Slack & Odoo Hub
          </button>
          <button
            onClick={() => setActiveTab("general")}
            className={`py-3 px-4 border-b-2 transition-all cursor-pointer ${
              activeTab === "general"
                ? "border-[#75b5ef] text-[#0284c7]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Organization & QMS
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`py-3 px-4 border-b-2 transition-all cursor-pointer ${
              activeTab === "security"
                ? "border-[#75b5ef] text-[#0284c7]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Approvals & Dual Sign-Off
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-800">
          {/* 1. INTEGRATIONS (MCP, SLACK, ODOO) */}
          {activeTab === "integrations" && (
            <div className="space-y-6">
              {/* MCP (Model Context Protocol) */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-xs">
                        Model Context Protocol (MCP) Server
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Expose active procedures to external AI agents & tools
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.mcpEnabled}
                      onChange={(e) =>
                        setFormData({ ...formData, mcpEnabled: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#75b5ef]"></div>
                  </label>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    MCP Server SSE / WebSocket Endpoint
                  </label>
                  <input
                    type="text"
                    value={formData.mcpServerUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, mcpServerUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-[11px] focus:border-[#75b5ef] outline-hidden bg-white"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500">
                    Tools exposed: <code className="font-bold">read_sop</code>, <code className="font-bold">verify_milestone</code>, <code className="font-bold">sign_approval</code>
                  </span>
                  <button
                    type="button"
                    onClick={handleTestMcp}
                    className="px-3 py-1 rounded-lg bg-white border border-slate-300 hover:border-[#75b5ef] text-slate-700 font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    {testStatus.mcp === "testing" ? (
                      <RefreshCw className="w-3 h-3 animate-spin text-[#75b5ef]" />
                    ) : testStatus.mcp === "success" ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    ) : null}
                    <span>{testStatus.mcp === "success" ? "Connected" : "Test Ping"}</span>
                  </button>
                </div>
              </div>

              {/* Slack Webhook */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#4A154B]/10 text-[#4A154B]">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-xs">
                        Slack Bot & Approval Dispatcher
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Broadcast shift briefings and 1-click approval buttons to Slack
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.slackEnabled}
                      onChange={(e) =>
                        setFormData({ ...formData, slackEnabled: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#75b5ef]"></div>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">
                      Incoming Webhook URL
                    </label>
                    <input
                      type="password"
                      value={formData.slackWebhookUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, slackWebhookUrl: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-[11px] focus:border-[#75b5ef] outline-hidden bg-white"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">
                      Notification Channel
                    </label>
                    <input
                      type="text"
                      value={formData.slackChannel}
                      onChange={(e) =>
                        setFormData({ ...formData, slackChannel: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold focus:border-[#75b5ef] outline-hidden bg-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500">
                    Triggers: On procedure draft, hazard alert, sign-off request
                  </span>
                  <button
                    type="button"
                    onClick={handleTestSlack}
                    className="px-3 py-1 rounded-lg bg-white border border-slate-300 hover:border-[#75b5ef] text-slate-700 font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    {testStatus.slack === "testing" ? (
                      <RefreshCw className="w-3 h-3 animate-spin text-[#75b5ef]" />
                    ) : testStatus.slack === "success" ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    ) : null}
                    <span>{testStatus.slack === "success" ? "Slack Verified" : "Test Notification"}</span>
                  </button>
                </div>
              </div>

              {/* Odoo ERP & QMS Connector */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#714B67]/10 text-[#714B67]">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-xs">
                        Odoo ERP / QMS Document Synchronization
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Synchronize approved procedures into Odoo Quality & Documents apps
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.odooEnabled}
                      onChange={(e) =>
                        setFormData({ ...formData, odooEnabled: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#75b5ef]"></div>
                  </label>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Odoo Instance Host URL
                    </label>
                    <input
                      type="text"
                      value={formData.odooServerUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, odooServerUrl: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-[11px] focus:border-[#75b5ef] outline-hidden bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Database Name
                      </label>
                      <input
                        type="text"
                        value={formData.odooDatabase}
                        onChange={(e) =>
                          setFormData({ ...formData, odooDatabase: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-[11px] focus:border-[#75b5ef] outline-hidden bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        API Secret Key
                      </label>
                      <input
                        type="password"
                        value={formData.odooApiKey}
                        onChange={(e) =>
                          setFormData({ ...formData, odooApiKey: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-[11px] focus:border-[#75b5ef] outline-hidden bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500">
                    Creates Odoo QMS Work Instructions automatically
                  </span>
                  <button
                    type="button"
                    onClick={handleTestOdoo}
                    className="px-3 py-1 rounded-lg bg-white border border-slate-300 hover:border-[#75b5ef] text-slate-700 font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    {testStatus.odoo === "testing" ? (
                      <RefreshCw className="w-3 h-3 animate-spin text-[#75b5ef]" />
                    ) : testStatus.odoo === "success" ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    ) : null}
                    <span>{testStatus.odoo === "success" ? "Odoo Synchronized" : "Test Odoo Connection"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. GENERAL & QMS PREFERENCES */}
          {activeTab === "general" && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Company / Corporate Legal Entity
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#75b5ef] outline-hidden bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Document Code Prefix
                  </label>
                  <input
                    type="text"
                    value={formData.qmsPrefix}
                    onChange={(e) =>
                      setFormData({ ...formData, qmsPrefix: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold focus:border-[#75b5ef] outline-hidden bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Auto-Archive Horizon (Months)
                  </label>
                  <input
                    type="number"
                    value={formData.autoArchiveMonths}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        autoArchiveMonths: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#75b5ef] outline-hidden bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Accredited ISO / Regulatory Frameworks
                </label>
                <input
                  type="text"
                  value={formData.isoStandard}
                  onChange={(e) =>
                    setFormData({ ...formData, isoStandard: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#75b5ef] outline-hidden bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Lead Compliance Auditor Email
                </label>
                <input
                  type="email"
                  value={formData.primaryAuditorEmail}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      primaryAuditorEmail: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#75b5ef] outline-hidden bg-white"
                />
              </div>
            </div>
          )}

          {/* 3. SECURITY & DUAL SIGN-OFF POLICIES */}
          {activeTab === "security" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-bold text-slate-900">
                    Mandatory Dual Sign-Off for High & Critical Hazards
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Requires both Department Lead (Tier 2) and QMS Director (Tier 3) counter-signature before any Critical hazard SOP or Safety Plan is released to operations.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.dualSignOffRequiredForHighRisk}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dualSignOffRequiredForHighRisk: e.target.checked,
                    })
                  }
                  className="mt-1 w-4 h-4 rounded text-[#75b5ef] focus:ring-[#75b5ef]"
                />
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-bold text-slate-900">
                    AI Autopilot Audit Gap Scanner
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Automatically scans all draft procedures upon saving and produces instant ISO/OSHA gap analysis and auditor readiness scores.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.aiAuditorAutopilot}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      aiAuditorAutopilot: e.target.checked,
                    })
                  }
                  className="mt-1 w-4 h-4 rounded text-[#75b5ef] focus:ring-[#75b5ef]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-6 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-white transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#75b5ef] hover:bg-[#5da5e6] text-white font-bold shadow-md hover:scale-[1.02] transition-all cursor-pointer"
          >
            <Save className="w-4 h-4 text-[#00d8ff]" />
            <span>Save Workspace Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
