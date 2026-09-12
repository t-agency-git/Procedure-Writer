import React, { useState } from "react";
import {
  X,
  User,
  Users,
  Tag,
  CheckSquare,
  Clock,
  Paperclip,
  FileText,
  Download,
  Send,
  Sparkles,
  ShieldCheck,
  Calendar,
  Layers,
  CheckCircle2,
  HardHat,
} from "lucide-react";
import { ProcedureDocument, CommentItem, AttachmentFile } from "../types";

interface InspectorPanelProps {
  document: ProcedureDocument;
  isOpen: boolean;
  onClose: () => void;
  onAddComment: (comment: string) => void;
  onAddAttachment: (file: AttachmentFile) => void;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  document,
  isOpen,
  onClose,
  onAddComment,
  onAddAttachment,
}) => {
  const [commentText, setCommentText] = useState("");
  const [activeActions, setActiveActions] = useState<Record<string, boolean>>({
    "Technical Review": true,
    "Safety Inspection": true,
    "Legal / Compliance Check": false,
    "Team Training Briefing": false,
  });

  if (!isOpen) return null;

  const toggleAction = (key: string) => {
    setActiveActions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(commentText);
    setCommentText("");
  };

  const defaultAttachments: AttachmentFile[] = document.attachments || [
    {
      name: `${document.code}_Audit_Checksheet.pdf`,
      size: "1.4 MB",
      date: "2026-03-12",
      type: "PDF",
    },
    {
      name: "Safety_Assessment_Evidence.xlsx",
      size: "512 KB",
      date: "2026-03-10",
      type: "Spreadsheet",
    },
  ];

  const defaultComments: CommentItem[] = document.comments || [
    {
      id: "c1",
      author: "Gilbert Oliver",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=60",
      timestamp: "Today at 09:30 AM",
      message: `Verified clause references against ${document.framework}. Ready for supervisory review.`,
    },
  ];

  return (
    <aside className="w-80 lg:w-96 bg-white border-l border-[#e2e8f0] h-full overflow-y-auto flex flex-col justify-between shrink-0 shadow-sm text-slate-800">
      <div className="p-5 space-y-6">
        {/* Panel Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#00d8ff]" />
            <h3 className="font-black text-slate-900 text-sm tracking-tight">
              Inspector & Audit Dossier
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section: Document Meta */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              Document Code
            </span>
            <span className="font-mono font-bold text-[#0284c7] bg-[#75b5ef]/10 px-2 py-0.5 rounded">
              {document.code}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              Review Due
            </span>
            <span className="font-medium text-slate-700 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {document.reviewDate}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              Compliance Standard
            </span>
            <span className="font-medium text-slate-700 truncate max-w-[170px]">
              {document.framework}
            </span>
          </div>
        </div>

        {/* Section: Authorized Signatories & Stakeholders */}
        <div className="space-y-2.5 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Users className="w-3 h-3 text-[#75b5ef]" />
              Stakeholders & Signatories
            </span>
            <span className="text-[10px] font-bold text-[#0284c7]">
              {document.signOffs.length} assigned
            </span>
          </div>

          <div className="space-y-2">
            {document.signOffs.map((so, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-[#75b5ef]/20 text-[#0284c7] font-bold flex items-center justify-center text-[10px] shrink-0">
                    {so.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">
                      {so.name}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">
                      {so.role}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    so.status === "Approved"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {so.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Action Tasks Checklist (Directly inspired by UI Design.png) */}
        <div className="space-y-2.5 pt-2 border-t border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <CheckSquare className="w-3 h-3 text-[#75b5ef]" />
            Verification Milestones
          </span>

          <div className="space-y-1.5 text-xs">
            {Object.entries(activeActions).map(([action, checked]) => (
              <div
                key={action}
                onClick={() => toggleAction(action)}
                className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {}}
                  className="rounded text-[#75b5ef] focus:ring-[#00d8ff] w-4 h-4 cursor-pointer accent-[#75b5ef]"
                />
                <span
                  className={`font-medium ${
                    checked
                      ? "line-through text-slate-400"
                      : "text-slate-800"
                  }`}
                >
                  {action}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Shared Files & Attachments (Inspired by UI Design.png) */}
        <div className="space-y-2.5 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Paperclip className="w-3 h-3 text-[#75b5ef]" />
              Shared Files & Evidence
            </span>
            <span className="text-[10px] text-slate-400">
              {defaultAttachments.length} files
            </span>
          </div>

          <div className="space-y-2">
            {defaultAttachments.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-[#75b5ef] transition-all text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#75b5ef] shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {file.size} • {file.date}
                    </p>
                  </div>
                </div>
                <button
                  className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Audit Activity & Comments */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Audit Activity & Review Notes
          </span>

          <div className="space-y-3">
            {defaultComments.map((comment) => (
              <div
                key={comment.id}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">
                    {comment.author}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {comment.timestamp}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {comment.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comment Input Footer (Inspired by UI Design.png message box) */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <form onSubmit={handleSendComment} className="relative">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Type review note or audit question..."
            className="w-full bg-white border border-slate-300 rounded-xl pl-3 pr-10 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#75b5ef] focus:ring-2 focus:ring-[#00d8ff]/20"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-[#75b5ef] hover:bg-[#5da5e6] text-white transition-colors cursor-pointer"
          >
            <Send className="w-3 h-3" />
          </button>
        </form>
      </div>
    </aside>
  );
};
