import React from 'react';
import { CheckCircle2, Building2, Users, FileText, Plus, X, Layers } from 'lucide-react';
import { Task, Meeting, Hospital, Doctor, Department } from '../types';

interface FollowUpPromptModalProps {
  task: Task | null;
  meetings: Meeting[];
  hospitals: Hospital[];
  departments?: Department[];
  doctors: Doctor[];
  onClose: () => void;
  onConfirmAddFollowUp: (task: Task, meetingId: string) => void;
}

export default function FollowUpPromptModal({
  task,
  meetings,
  hospitals,
  departments = [],
  doctors,
  onClose,
  onConfirmAddFollowUp
}: FollowUpPromptModalProps) {
  if (!task) return null;

  const meeting = meetings.find(m => m.id === task.meeting_id);
  const hospital = (meeting ? hospitals.find(h => h.id === meeting.hospital_id) : null) || (task.hospital_id ? hospitals.find(h => h.id === task.hospital_id) : null);
  
  // Department lookup
  const deptId = meeting?.department_id || task.department_id;
  let department = deptId ? departments.find(d => d.id === deptId) : null;
  
  // Doctor lookup
  const docId = meeting ? (meeting.doctor_id || (meeting.doctor_ids && meeting.doctor_ids[0])) : task.doctor_id;
  const doctor = docId ? doctors.find(d => d.id === docId) : null;
  const doctorName = doctor ? `${doctor.title ? doctor.title + ' ' : ''}${doctor.first_name} ${doctor.last_name}`.trim() : null;

  if (!department && doctor?.department_id) {
    department = departments.find(d => d.id === doctor.department_id) || null;
  }

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-100 space-y-4 animate-scale-up text-left">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-200">
              <CheckCircle2 size={24} className="sm:w-7 sm:h-7" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 leading-tight">
                Zadanie wykonane!
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Czy chcesz dodać kolejny Follow-Up?
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Info card about finished task and associated doctor/hospital */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-2.5 text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
              Wykonane zadanie
            </span>
            <p className="font-semibold text-slate-800 break-words leading-snug">
              "{task.description}"
            </p>
          </div>

          <div className="pt-2 border-t border-slate-200/60 space-y-1.5 text-slate-600 font-medium">
            {hospital && (
              <div className="flex items-start gap-1.5 min-w-0">
                <Building2 size={14} className="text-slate-400 shrink-0 mt-0.5" />
                <span className="break-words">
                  Szpital: <strong className="text-slate-800">{hospital.name} ({hospital.city})</strong>
                </span>
              </div>
            )}

            {department && (
              <div className="flex items-start gap-1.5 min-w-0">
                <Layers size={14} className="text-slate-400 shrink-0 mt-0.5" />
                <span className="break-words">
                  Oddział: <strong className="text-slate-800">{department.name}</strong>
                </span>
              </div>
            )}

            {doctorName && (
              <div className="flex items-start gap-1.5 min-w-0">
                <Users size={14} className="text-slate-400 shrink-0 mt-0.5" />
                <span className="break-words">
                  Lekarz: <strong className="text-slate-800">{doctorName}</strong>
                </span>
              </div>
            )}

            {meeting && (
              <div className="flex items-start gap-1.5 min-w-0">
                <FileText size={14} className="text-slate-400 shrink-0 mt-0.5" />
                <span className="break-words">
                  Wizyta: <strong className="text-slate-800">{meeting.title}</strong>
                </span>
              </div>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-600 font-medium">
          Wybranie "Tak" otworzy formularz tworzenia nowego zadania z automatycznie przypisanym tym samym lekarzem i wizytą.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer text-center"
          >
            Nie, zamknij
          </button>
          <button
            type="button"
            onClick={() => onConfirmAddFollowUp(task, task.meeting_id)}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Plus size={16} />
            <span>Tak, dodaj kolejny Follow-Up</span>
          </button>
        </div>

      </div>
    </div>
  );
}
