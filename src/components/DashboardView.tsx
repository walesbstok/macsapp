import React, { useState } from 'react';
import { 
  Users, 
  Building2, 
  CalendarDays, 
  CheckSquare, 
  AlertTriangle, 
  ChevronRight, 
  FileText,
  Clock,
  PlusCircle,
  UserPlus,
  Trash2,
  CheckCircle2,
  Square,
  X,
  Plus,
  Layers
} from 'lucide-react';
import { Hospital, Department, Doctor, Meeting, Task, UserRole } from '../types';
import { getMeetingStatus } from '../db';
import FollowUpPromptModal from './FollowUpPromptModal';

interface DashboardViewProps {
  hospitals: Hospital[];
  departments?: Department[];
  doctors: Doctor[];
  meetings: Meeting[];
  tasks: Task[];
  onNavigateToPage: (page: string, params?: any) => void;
  onDeleteMeeting?: (id: string) => void;
  onSaveTask?: (task: Task) => void;
  currentRole: UserRole;
}

export default function DashboardView({ 
  hospitals, 
  departments = [],
  doctors, 
  meetings, 
  tasks,
  onNavigateToPage,
  onDeleteMeeting,
  onSaveTask,
  currentRole
}: DashboardViewProps) {

  // Follow-Up prompt state
  const [completedTaskForPrompt, setCompletedTaskForPrompt] = useState<Task | null>(null);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskMeetingId, setNewTaskMeetingId] = useState('');

  const handleConfirmAddFollowUp = (task: Task, meetingId: string) => {
    setCompletedTaskForPrompt(null);
    setNewTaskDesc('');
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    setNewTaskDueDate(nextWeek.toISOString().split('T')[0]);
    setNewTaskMeetingId(meetingId || '');
    setIsNewTaskModalOpen(true);
  };

  const handleSaveNewTaskFromDashboard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskDesc.trim()) {
      alert('Wpisz treść zadania / Follow-Up!');
      return;
    }
    if (onSaveTask) {
      onSaveTask({
        id: `task_${Date.now()}`,
        meeting_id: newTaskMeetingId,
        description: newTaskDesc.trim(),
        due_date: newTaskDueDate || null,
        is_done: false,
        created_at: new Date().toISOString()
      });
    }
    setIsNewTaskModalOpen(false);
  };

  // 1. Calculate stats
  const totalDoctors = doctors.length;
  const activeHospitals = hospitals.filter(h => h.pipeline_status === 'active' || h.pipeline_status === 'key_account').length;
  
  // Meetings this month (current year and month)
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const meetingsThisMonth = meetings.filter(m => {
    const d = new Date(m.meeting_date);
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  }).length;

  // Open tasks
  const openTasks = tasks.filter(t => !t.is_done).length;

  // 2. Filter meetings by status
  const scheduledMeetings = meetings
    .filter(m => getMeetingStatus(m) === 'scheduled')
    .sort((a, b) => new Date(a.meeting_date).getTime() - new Date(b.meeting_date).getTime())
    .slice(0, 10);

  // Attention required: To close and Overdue, sorted from oldest
  const attentionRequiredMeetings = meetings
    .filter(m => {
      const status = getMeetingStatus(m);
      return status === 'to_close' || status === 'overdue';
    })
    .sort((a, b) => new Date(a.meeting_date).getTime() - new Date(b.meeting_date).getTime());

  // Recent notes: Last 5 closed meetings with content, from newest
  const recentClosedMeetings = meetings
    .filter(m => Boolean(m.closed_at))
    .sort((a, b) => new Date(b.closed_at!).getTime() - new Date(a.closed_at!).getTime())
    .slice(0, 5);

  // Helper to map hospital/doctor/department details
  const getHospitalName = (id: string) => hospitals.find(h => h.id === id)?.name || 'Nieznany szpital';
  const getDepartmentName = (meet: Meeting) => {
    if (meet.department_id) {
      const dept = departments.find(d => d.id === meet.department_id);
      if (dept) return dept.name;
    }
    const docId = meet.doctor_id || (meet.doctor_ids && meet.doctor_ids[0]);
    if (docId) {
      const doc = doctors.find(d => d.id === docId);
      if (doc?.department_id) {
        const dept = departments.find(d => d.id === doc.department_id);
        if (dept) return dept.name;
      }
    }
    return null;
  };
  const getDoctorLabel = (id: string | null) => {
    if (!id) return 'No doctor assigned';
    const doc = doctors.find(d => d.id === id);
    return doc ? `${doc.title} ${doc.first_name} ${doc.last_name}` : 'Unknown Doctor';
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in p-3 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
        <div>
          <h2 className="font-display font-bold text-xl sm:text-3xl text-slate-900 tracking-tight">Dashboard</h2>
        </div>
        <div className="bg-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2 text-xs sm:text-sm self-start sm:self-auto">
          <Clock size={14} className="text-blue-500 shrink-0" />
          <span className="font-medium text-slate-700">Today:</span>
          <span className="font-mono text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 text-xs">
            {now.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
      </div>



      {/* Grid: Attention Required & Upcoming Meetings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        
        {/* SECTION: Attention Required */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
              <AlertTriangle size={18} className="text-red-500 shrink-0" />
              <span>Requires Attention ({attentionRequiredMeetings.length})</span>
            </h3>
            <span className="text-[11px] text-slate-500">Complete notes / close</span>
          </div>

          <div className="space-y-3 max-h-[380px] sm:max-h-[460px] overflow-y-auto pr-1">
            {attentionRequiredMeetings.length === 0 ? (
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 sm:p-6 text-center">
                <span className="text-xl sm:text-2xl">🎉</span>
                <p className="text-emerald-800 font-medium mt-1 text-xs sm:text-sm">All caught up!</p>
                <p className="text-emerald-600 text-xs mt-0.5">No unclosed visits pending settlement.</p>
              </div>
            ) : (
              attentionRequiredMeetings.map(meet => {
                const status = getMeetingStatus(meet);
                const isOverdue = status === 'overdue';
                return (
                  <div 
                    key={meet.id}
                    onClick={() => onNavigateToPage('meeting_detail', { id: meet.id })}
                    className={`bg-white border-2 p-3.5 sm:p-4 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between ${
                      isOverdue ? 'border-red-600/80' : 'border-amber-500/80'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          isOverdue ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {isOverdue ? 'Overdue (>24h)' : 'Pending closure (<24h)'}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">{formatDate(meet.meeting_date)}</span>
                      </div>
                      <h4 className="font-semibold text-slate-800 text-sm hover:text-blue-600 transition-colors break-words whitespace-normal leading-snug">
                        {meet.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 font-medium flex items-start gap-1 min-w-0">
                        <Building2 size={12} className="shrink-0 text-slate-400 mt-0.5" />
                        <span className="break-words whitespace-normal leading-snug">{getHospitalName(meet.hospital_id)}</span>
                      </p>
                      {getDepartmentName(meet) && (
                        <p className="text-xs text-slate-700 mt-0.5 font-medium flex items-start gap-1 min-w-0">
                          <Layers size={12} className="shrink-0 text-slate-400 mt-0.5" />
                          <span className="break-words whitespace-normal leading-snug">Oddział: {getDepartmentName(meet)}</span>
                        </p>
                      )}
                      <p className="text-xs text-slate-600 mt-0.5 font-medium flex items-start gap-1 min-w-0">
                        <Users size={12} className="shrink-0 text-slate-400 mt-0.5" />
                        <span className="break-words whitespace-normal leading-snug">{getDoctorLabel(meet.doctor_id)}</span>
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-medium">
                      <span className="text-red-600 flex items-center gap-1 text-[11px]">
                        <AlertTriangle size={12} />
                        Requires note
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600 hover:underline flex items-center gap-0.5 text-xs font-semibold">
                          Complete report <ChevronRight size={14} />
                        </span>
                        {onDeleteMeeting && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`Are you sure you want to delete this unclosed visit: "${meet.title}"?`)) {
                                onDeleteMeeting(meet.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete unclosed visit"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* SECTION: Upcoming Meetings */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
              <CalendarDays size={18} className="text-blue-600 shrink-0" />
              <span>Upcoming Visits ({scheduledMeetings.length})</span>
            </h3>
            <button 
              onClick={() => onNavigateToPage('meetings', { showNewForm: true })}
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              + Schedule
            </button>
          </div>

          <div className="space-y-3 max-h-[380px] sm:max-h-[460px] overflow-y-auto pr-1">
            {scheduledMeetings.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-6 text-center">
                <span className="text-xl sm:text-2xl">💤</span>
                <p className="text-slate-600 font-medium mt-1 text-xs sm:text-sm">No upcoming visits</p>
                <p className="text-slate-400 text-xs mt-0.5">Use the button above to schedule a new visit.</p>
              </div>
            ) : (
              scheduledMeetings.map(meet => (
                <div 
                  key={meet.id}
                  onClick={() => onNavigateToPage('meeting_detail', { id: meet.id })}
                  className="bg-white border border-slate-200 p-3.5 sm:p-4 rounded-xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700">
                        Scheduled
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 font-medium">{formatDate(meet.meeting_date)}</span>
                    </div>
                    <h4 className="font-semibold text-slate-800 text-sm break-words whitespace-normal leading-snug">
                      {meet.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 flex items-start gap-1 font-medium min-w-0">
                      <Building2 size={12} className="shrink-0 text-slate-400 mt-0.5" />
                      <span className="break-words whitespace-normal leading-snug">{getHospitalName(meet.hospital_id)}</span>
                    </p>
                    {getDepartmentName(meet) && (
                      <p className="text-xs text-slate-700 mt-0.5 flex items-start gap-1 font-medium min-w-0">
                        <Layers size={12} className="shrink-0 text-slate-400 mt-0.5" />
                        <span className="break-words whitespace-normal leading-snug">Oddział: {getDepartmentName(meet)}</span>
                      </p>
                    )}
                    <p className="text-xs text-slate-600 mt-0.5 flex items-start gap-1 font-medium min-w-0">
                      <Users size={12} className="shrink-0 text-slate-400 mt-0.5" />
                      <span className="break-words whitespace-normal leading-snug">{getDoctorLabel(meet.doctor_id)}</span>
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-medium">
                    <span className="flex items-center gap-0.5 hover:underline text-xs font-semibold text-blue-600">
                      Details <ChevronRight size={14} />
                    </span>
                    {onDeleteMeeting && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Are you sure you want to delete this unclosed visit: "${meet.title}"?`)) {
                            onDeleteMeeting(meet.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete unclosed visit"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* SECTION: Tasks & Follow-Up (FU) Widget */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm animate-fade-in space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
              <CheckSquare size={20} className="text-amber-600 shrink-0" />
              <span>Urgent Tasks & Visit Follow-Ups ({tasks.filter(t => !t.is_done).length})</span>
            </h3>
          </div>
          <button
            onClick={() => onNavigateToPage('tasks')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            Full task list <ChevronRight size={14} />
          </button>
        </div>

        {tasks.filter(t => !t.is_done).length === 0 ? (
          <div className="p-6 text-center bg-slate-50 border border-slate-200/60 border-dashed rounded-xl">
            <CheckCircle2 size={28} className="text-emerald-500 mx-auto mb-1.5" />
            <p className="text-slate-700 font-semibold text-xs sm:text-sm">No pending follow-up tasks!</p>
            <p className="text-slate-400 text-xs mt-0.5">All visit agreements have been successfully completed.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {tasks
              .filter(t => !t.is_done)
              .sort((a, b) => {
                if (!a.due_date) return 1;
                if (!b.due_date) return -1;
                return a.due_date.localeCompare(b.due_date);
              })
              .slice(0, 6)
              .map(task => {
                const todayStr = new Date().toISOString().split('T')[0];
                const overdue = task.due_date && task.due_date < todayStr;
                const meet = meetings.find(m => m.id === task.meeting_id);
                const hosp = meet ? hospitals.find(h => h.id === meet.hospital_id) : null;
                const doc = meet ? doctors.find(d => d.id === (meet.doctor_id || (meet.doctor_ids && meet.doctor_ids[0]))) : null;

                return (
                  <div
                    key={task.id}
                    className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                      overdue
                        ? 'bg-red-50/40 border-red-200 hover:border-red-300'
                        : 'bg-slate-50/50 border-slate-200 hover:border-blue-200'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs sm:text-sm font-semibold text-slate-800 break-words whitespace-normal leading-snug">
                          {task.description}
                        </p>
                        {onSaveTask && (
                          <button
                            type="button"
                            onClick={() => {
                              onSaveTask({ ...task, is_done: true });
                              setCompletedTaskForPrompt(task);
                            }}
                            className="text-slate-400 hover:text-emerald-600 transition-colors shrink-0 p-1"
                            title="Oznacz jako wykonane"
                          >
                            <Square size={18} />
                          </button>
                        )}
                      </div>

                      <div className="space-y-1 text-[11px] text-slate-500 font-medium">
                        {hosp && (
                          <div className="flex items-start gap-1 min-w-0">
                            <Building2 size={11} className="text-slate-400 shrink-0 mt-0.5" />
                            <span className="break-words whitespace-normal leading-tight">{hosp.name}</span>
                          </div>
                        )}
                        {meet && getDepartmentName(meet) && (
                          <div className="flex items-start gap-1 min-w-0">
                            <Layers size={11} className="text-slate-400 shrink-0 mt-0.5" />
                            <span className="break-words whitespace-normal leading-tight text-slate-700 font-medium">Oddział: {getDepartmentName(meet)}</span>
                          </div>
                        )}
                        {doc && (
                          <div className="flex items-start gap-1 min-w-0">
                            <Users size={11} className="text-slate-400 shrink-0 mt-0.5" />
                            <span className="break-words whitespace-normal leading-tight">{doc.title} {doc.first_name} {doc.last_name}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                      {task.due_date ? (
                        <span className={`font-semibold flex items-center gap-1 ${
                          overdue ? 'text-red-700' : 'text-slate-600'
                        }`}>
                          <Clock size={11} />
                          {overdue ? 'Overdue: ' : 'Due: '}
                          {task.due_date}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">No date</span>
                      )}

                      {meet && (
                        <button
                          onClick={() => onNavigateToPage('meeting_detail', { id: meet.id })}
                          className="text-blue-600 hover:underline font-semibold flex items-center gap-0.5"
                        >
                          Visit <ChevronRight size={11} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* KPI Cards (Only Meetings this month & Open Tasks) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
        {/* Meetings this month */}
        <div 
          onClick={() => onNavigateToPage('meetings')}
          className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between gap-1">
            <div className="space-y-0.5">
              <span className="text-xs font-medium text-slate-500">Visits this month</span>
              <h3 className="font-display font-bold text-xl sm:text-3xl text-slate-900">{meetingsThisMonth}</h3>
            </div>
            <div className="p-2 sm:p-3 bg-violet-50 rounded-lg sm:rounded-xl text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors shrink-0">
              <CalendarDays size={16} className="sm:w-5 sm:h-5" />
            </div>
          </div>
          <p className="text-[11px] sm:text-xs text-violet-600 font-medium mt-2 sm:mt-4 flex items-center gap-0.5 group-hover:underline">
            Calendar <ChevronRight size={12} />
          </p>
        </div>

        {/* Open Tasks */}
        <div 
          onClick={() => onNavigateToPage('tasks')}
          className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between gap-1">
            <div className="space-y-0.5">
              <span className="text-xs font-medium text-slate-500">Open Tasks & Follow-Ups</span>
              <h3 className="font-display font-bold text-xl sm:text-3xl text-slate-900">{openTasks}</h3>
            </div>
            <div className="p-2 sm:p-3 bg-amber-50 rounded-lg sm:rounded-xl text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors shrink-0">
              <CheckSquare size={16} className="sm:w-5 sm:h-5" />
            </div>
          </div>
          <p className="text-[11px] sm:text-xs text-amber-600 font-medium mt-2 sm:mt-4 flex items-center gap-0.5 group-hover:underline">
            View all tasks <ChevronRight size={12} />
          </p>
        </div>
      </div>

      {/* SECTION: Recent Notes */}
      <div className="space-y-3">
        <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
          <FileText size={18} className="text-slate-700 shrink-0" />
          <span>Recent Visit Notes</span>
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {recentClosedMeetings.length === 0 ? (
            <div className="col-span-full bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-6 text-center">
              <span className="text-xl sm:text-2xl">✍️</span>
              <p className="text-slate-600 font-medium mt-1 text-xs sm:text-sm">No settled visits</p>
              <p className="text-slate-400 text-xs mt-0.5">Complete the report and close the visit to display it here.</p>
            </div>
          ) : (
            recentClosedMeetings.map(meet => (
              <div 
                key={meet.id}
                onClick={() => onNavigateToPage('meeting_detail', { id: meet.id })}
                className="bg-white border border-slate-200 p-3.5 sm:p-4 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                      Closed
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {meet.closed_at ? new Date(meet.closed_at).toLocaleDateString('en-US') : ''}
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-800 text-xs sm:text-sm break-words whitespace-normal leading-snug mb-1.5">
                    {meet.title}
                  </h4>
                  <div className="bg-slate-50 p-2 sm:p-2.5 rounded-lg border border-slate-100 text-xs text-slate-600 italic break-words whitespace-normal line-clamp-3 mb-2">
                    "{meet.content_markdown || 'No report content.'}"
                  </div>
                  <p className="text-[11px] text-slate-500 flex items-start gap-1 font-medium min-w-0">
                    <Building2 size={10} className="shrink-0 mt-0.5" />
                    <span className="break-words whitespace-normal leading-tight">{getHospitalName(meet.hospital_id)}</span>
                  </p>
                  {getDepartmentName(meet) && (
                    <p className="text-[11px] text-slate-700 flex items-start gap-1 font-medium mt-0.5 min-w-0">
                      <Layers size={10} className="shrink-0 mt-0.5" />
                      <span className="break-words whitespace-normal leading-tight">Oddział: {getDepartmentName(meet)}</span>
                    </p>
                  )}
                  <p className="text-[11px] text-slate-500 flex items-start gap-1 font-medium mt-0.5 min-w-0">
                    <Users size={10} className="shrink-0 mt-0.5" />
                    <span className="break-words whitespace-normal leading-tight">{getDoctorLabel(meet.doctor_id)}</span>
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400">
                  <span>Visit: {new Date(meet.meeting_date).toLocaleDateString('en-US')}</span>
                  <span className="text-blue-600 hover:underline flex items-center gap-0.5">
                    Report <ChevronRight size={12} />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Popup prompt do tworzenia Follow-Up po wykonaniu zadania */}
      <FollowUpPromptModal
        task={completedTaskForPrompt}
        meetings={meetings}
        hospitals={hospitals}
        departments={departments}
        doctors={doctors}
        onClose={() => setCompletedTaskForPrompt(null)}
        onConfirmAddFollowUp={handleConfirmAddFollowUp}
      />

      {/* Modal tworzenia nowego zadania z poziomu Dashboardu */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                <CheckSquare size={20} className="text-blue-600" />
                <span>Nowy Follow-Up / Zadanie</span>
              </h3>
              <button
                onClick={() => setIsNewTaskModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveNewTaskFromDashboard} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Treść zadania / Follow-Up *
                </label>
                <textarea
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="np. Wysłać ofertę na lupy, omówić z ordynatorem kolejny krok..."
                  rows={3}
                  required
                  className="w-full text-sm border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Termin wykonania
                </label>
                <input
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Powiązana wizyta / Lekarz
                </label>
                <select
                  value={newTaskMeetingId}
                  onChange={(e) => setNewTaskMeetingId(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50"
                >
                  <option value="">-- Brak bezpośredniego powiązania --</option>
                  {meetings.map(m => {
                    const hosp = hospitals.find(h => h.id === m.hospital_id);
                    const deptName = getDepartmentName(m);
                    const doc = doctors.find(d => d.id === (m.doctor_id || (m.doctor_ids && m.doctor_ids[0])));
                    const docLabel = doc ? `${doc.title ? doc.title + ' ' : ''}${doc.first_name} ${doc.last_name}` : '';
                    return (
                      <option key={m.id} value={m.id}>
                        {m.title} {docLabel ? `[Lekarz: ${docLabel}]` : ''} {deptName ? `[Oddział: ${deptName}]` : ''} ({hosp ? hosp.name : 'Szpital'}) - {new Date(m.meeting_date).toLocaleDateString('pl-PL')}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewTaskModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow transition-all flex items-center gap-1.5"
                >
                  <Plus size={16} />
                  <span>Dodaj zadanie</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
