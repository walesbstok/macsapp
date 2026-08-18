import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Building2, 
  Users, 
  CalendarDays, 
  Clock, 
  FileText, 
  CheckSquare, 
  Square, 
  Trash2, 
  Plus, 
  CheckCircle, 
  AlertTriangle,
  Info
} from 'lucide-react';
import { Hospital, Department, Doctor, Meeting, Task, UserRole, MeetingType, PRESET_PRODUCTS } from '../types';
import { getMeetingStatus } from '../db';
import FollowUpPromptModal from './FollowUpPromptModal';

interface MeetingDetailViewProps {
  meetingId: string;
  meetings: Meeting[];
  hospitals: Hospital[];
  departments: Department[];
  doctors: Doctor[];
  tasks: Task[];
  onSaveMeeting: (meeting: Meeting) => void;
  onSaveTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onDeleteMeeting?: (id: string) => void;
  onNavigateBack: () => void;
  currentRole: UserRole;
}

export default function MeetingDetailView({
  meetingId,
  meetings,
  hospitals,
  departments,
  doctors,
  tasks,
  onSaveMeeting,
  onSaveTask,
  onDeleteTask,
  onDeleteMeeting,
  onNavigateBack,
  currentRole
}: MeetingDetailViewProps) {

  const meeting = meetings.find(m => m.id === meetingId);
  if (!meeting) {
    return (
      <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl animate-fade-in max-w-lg mx-auto mt-12">
        <AlertTriangle className="text-red-500 mx-auto mb-4" size={32} />
        <h3 className="font-display font-bold text-lg text-slate-800">Meeting not found</h3>
        <p className="text-slate-500 text-sm mt-1">This meeting might have been deleted or the provided ID is invalid.</p>
        <button onClick={onNavigateBack} className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl">
          Back to list
        </button>
      </div>
    );
  }

  // Helper to parse date and time from ISO / date string
  const parseDateTime = (isoStr: string) => {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return { date: '', time: '10:00' };
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return {
      date: `${year}-${month}-${day}`,
      time: `${hours}:${minutes}`
    };
  };

  const initialDT = parseDateTime(meeting.meeting_date);

  // States
  const [meetingTitle, setMeetingTitle] = useState(meeting.title);
  const [meetingDate, setMeetingDate] = useState(initialDT.date);
  const [meetingTime, setMeetingTime] = useState(initialDT.time);
  const [noteContent, setNoteContent] = useState(meeting.content_markdown);
  const [meetingType, setMeetingType] = useState<MeetingType>(meeting.meeting_type || 'REGULAR');
  const [selectedDoctorIds, setSelectedDoctorIds] = useState<string[]>(
    meeting.doctor_ids && meeting.doctor_ids.length > 0 
      ? meeting.doctor_ids 
      : meeting.doctor_id 
        ? [meeting.doctor_id] 
        : []
  );
  const [selectedProducts, setSelectedProducts] = useState<string[]>(meeting.product_tags || []);
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [completedTaskForPrompt, setCompletedTaskForPrompt] = useState<Task | null>(null);

  // Combined date and time ISO string
  const getMeetingDateTimeISO = (): string => {
    if (!meetingDate) return meeting.meeting_date;
    const timePart = meetingTime || '10:00';
    const datetimeStr = `${meetingDate}T${timePart}:00`;
    const parsed = new Date(datetimeStr);
    return !isNaN(parsed.getTime()) ? parsed.toISOString() : meeting.meeting_date;
  };

  const currentDateTimeISO = getMeetingDateTimeISO();

  // Dynamic status calculation
  const meetingStatus = getMeetingStatus({
    ...meeting,
    meeting_date: currentDateTimeISO
  });

  // Słowniki i asocjacje
  const hospital = hospitals.find(h => h.id === meeting.hospital_id);
  const department = departments.find(d => d.id === meeting.department_id);

  const meetingTasks = tasks.filter(t => t.meeting_id === meeting.id);

  // Walidacja notatki (minimum 5 znaków)
  const isNoteValid = noteContent.trim().length >= 5;

  // Akcja: Zwykły zapis (zostaje otwarte)
  const handleSaveOnly = () => {
    const updatedMeeting: Meeting = {
      ...meeting,
      title: meetingTitle.trim() || meeting.title,
      meeting_date: getMeetingDateTimeISO(),
      content_markdown: noteContent,
      meeting_type: meetingType,
      doctor_id: selectedDoctorIds[0] || null,
      doctor_ids: selectedDoctorIds,
      product_tags: selectedProducts,
      updated_at: new Date().toISOString()
    };
    onSaveMeeting(updatedMeeting);
    alert('Szczegóły spotkania (w tym data i godzina) zostały pomyślnie zapisane.');
  };

  // Akcja: Zapis i zamknięcie
  const handleSaveAndClose = () => {
    if (!isNoteValid) {
      alert('Treść raportu musi mieć co najmniej 5 znaków, aby zamknąć spotkanie!');
      return;
    }
    const updatedMeeting: Meeting = {
      ...meeting,
      title: meetingTitle.trim() || meeting.title,
      meeting_date: getMeetingDateTimeISO(),
      content_markdown: noteContent,
      meeting_type: meetingType,
      doctor_id: selectedDoctorIds[0] || null,
      doctor_ids: selectedDoctorIds,
      product_tags: selectedProducts,
      closed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    onSaveMeeting(updatedMeeting);
    alert('Raport oraz zmieniona data/godzina zostały zapisane, a spotkanie zostało zamknięte.');
  };

  // Akcja: Tylko Zamknięcie spotkania
  const handleCloseOnly = () => {
    if (!isNoteValid) {
      alert('Aby zamknąć spotkanie, musisz najpierw wpisać notatkę z wizyty (min. 5 znaków)!');
      return;
    }
    const updatedMeeting: Meeting = {
      ...meeting,
      title: meetingTitle.trim() || meeting.title,
      meeting_date: getMeetingDateTimeISO(),
      content_markdown: noteContent,
      meeting_type: meetingType,
      doctor_id: selectedDoctorIds[0] || null,
      doctor_ids: selectedDoctorIds,
      product_tags: selectedProducts,
      closed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    onSaveMeeting(updatedMeeting);
  };

  // Akcja: Otwórz ponownie spotkanie
  const handleReopen = () => {
    const updatedMeeting: Meeting = {
      ...meeting,
      closed_at: null,
      updated_at: new Date().toISOString()
    };
    onSaveMeeting(updatedMeeting);
    alert('The meeting has been reopened.');
  };

  // Akcja: Dodanie zadania follow-up
  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskDesc.trim()) {
      alert('Please enter a task description!');
      return;
    }

    const newTask: Task = {
      id: `task_${Date.now()}`,
      meeting_id: meeting.id,
      description: newTaskDesc,
      due_date: newTaskDueDate || null,
      is_done: false,
      created_at: new Date().toISOString(),
    };

    onSaveTask(newTask);
    setNewTaskDesc('');
    setNewTaskDueDate('');
  };

  // Akcja: Toggle statusu zadania
  const handleToggleTask = (task: Task) => {
    const willBeDone = !task.is_done;
    const updatedTask: Task = {
      ...task,
      is_done: willBeDone
    };
    onSaveTask(updatedTask);
    if (willBeDone) {
      setCompletedTaskForPrompt(task);
    }
  };

  const handleConfirmAddFollowUp = () => {
    setCompletedTaskForPrompt(null);
    setNewTaskDesc('');
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    setNewTaskDueDate(nextWeek.toISOString().split('T')[0]);
    setTimeout(() => {
      const el = document.getElementById('new-task-desc');
      if (el) el.focus();
    }, 100);
  };

  // Status badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <span className="bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 w-fit"><Clock size={14} /> Scheduled</span>;
      case 'to_close':
        return <span className="bg-red-100 text-red-800 border border-red-200 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 w-fit"><AlertTriangle size={14} /> To close</span>;
      case 'overdue':
        return <span className="bg-red-950 text-red-200 border border-red-900 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 w-fit"><AlertTriangle size={14} /> Overdue (&gt;24h)</span>;
      case 'closed':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 w-fit"><CheckCircle size={14} /> Closed</span>;
      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in p-6 space-y-6 max-w-4xl mx-auto">
      
      {/* Przycisk wstecz */}
      <button
        onClick={onNavigateBack}
        className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-semibold text-sm transition-colors"
      >
        <ChevronLeft size={16} />
        <span>Back to meetings list</span>
      </button>

      {/* Podsumowanie wizyty w karcie */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-6 shadow-sm space-y-4 max-w-7xl mx-auto w-full min-w-0">
        
        {/* Manager Review Status Notice */}
        {meeting.approval_status && (
          <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs ${
            meeting.approval_status === 'approved'
              ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
              : meeting.approval_status === 'rejected'
                ? 'bg-red-50 border-red-100 text-red-800'
                : 'bg-amber-50 border-amber-100 text-amber-800'
          }`}>
            <div className="p-1 rounded-full bg-white shadow-sm mt-0.5">
              {meeting.approval_status === 'approved' ? (
                <CheckCircle size={14} className="text-emerald-600" />
              ) : meeting.approval_status === 'rejected' ? (
                <AlertTriangle size={14} className="text-red-600" />
              ) : (
                <Clock size={14} className="text-amber-600" />
              )}
            </div>
            <div className="space-y-1">
              <span className="font-bold uppercase tracking-wider block text-[10px]">
                Manager Evaluation: {meeting.approval_status === 'approved' ? 'APPROVED' : meeting.approval_status === 'rejected' ? 'REJECTED' : 'PENDING REVIEW'}
              </span>
              {meeting.manager_comment ? (
                <p className="font-semibold text-slate-700 italic">
                  "{meeting.manager_comment}"
                </p>
              ) : (
                <p className="text-slate-500 italic">
                  No evaluation feedback message left by the manager yet.
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {getStatusBadge(meetingStatus)}
              
              {/* Wybór rodzaju spotkania (Meeting Type) */}
              {meetingStatus !== 'closed' ? (
                <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Type:</span>
                  <select
                    id="edit-meeting-type-select"
                    value={meetingType}
                    onChange={(e) => setMeetingType(e.target.value as MeetingType)}
                    className="bg-transparent text-[10px] font-bold text-slate-800 focus:outline-none cursor-pointer pr-1"
                  >
                    <option value="REGULAR">💼 REGULAR</option>
                    <option value="PRESENTATION">📊 PRESENTATION</option>
                    <option value="OPERATING DAY">🏥 OPERATING DAY</option>
                    <option value="PHONE_CALL">📞 TELEFONICZNA</option>
                  </select>
                </div>
              ) : (
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  meetingType === 'REGULAR' 
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                    : meetingType === 'PRESENTATION'
                      ? 'bg-purple-50 border-purple-200 text-purple-700'
                      : meetingType === 'OPERATING DAY'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}>
                  {meetingType === 'REGULAR' ? '💼 REGULAR' : meetingType === 'PRESENTATION' ? '📊 PRESENTATION' : meetingType === 'OPERATING DAY' ? '🏥 OPERATING DAY' : '📞 TELEFONICZNA'}
                </span>
              )}
            </div>
            <div className="space-y-1 mt-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tytuł spotkania</label>
              <input
                id="edit-meeting-title-input"
                type="text"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                className="w-full font-display font-bold text-xl text-slate-950 px-3 py-1.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Tytuł / cel spotkania..."
              />
            </div>
            
            {/* Edycja Daty i Czasu spotkania */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-2.5 mt-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <CalendarDays size={16} className="text-blue-600" />
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Termin spotkania (Data i Godzina)</span>
                </div>
                <span className="text-xs font-mono font-semibold text-blue-900 bg-blue-50/80 border border-blue-200/70 px-2.5 py-1 rounded-lg">
                  📍 {new Date(currentDateTimeISO).toLocaleString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Data spotkania *</label>
                  <input
                    id="edit-meeting-date"
                    type="date"
                    required
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Godzina spotkania *</label>
                  <input
                    id="edit-meeting-time"
                    type="time"
                    required
                    value={meetingTime}
                    onChange={(e) => setMeetingTime(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Przycisk usunięcia wizyty */}
          {onDeleteMeeting && (
            <button
              id="btn-delete-meeting-top"
              type="button"
              onClick={() => {
                if (window.confirm('Czy na pewno chcesz usunąć tę wizytę z bazy danych? Operacja jest nieodwracalna.')) {
                  onDeleteMeeting(meeting.id);
                  onNavigateBack();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 shadow-sm"
              title="Usuń wizytę"
            >
              <Trash2 size={15} />
              <span>Usuń wizytę</span>
            </button>
          )}
        </div>

        {/* Metryki powiązań */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
          
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Hospital / Facility</span>
            <span className="font-semibold text-slate-800 flex items-start gap-1">
              <Building2 size={14} className="text-slate-400 shrink-0 mt-0.5" />
              <span className="break-words whitespace-normal leading-tight">{hospital ? hospital.name : '—'}</span>
            </span>
            <span className="text-slate-500 block pl-5">{hospital ? hospital.city : ''}</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Department</span>
            <span className="font-semibold text-slate-800 flex items-start gap-1">
              <FileText size={14} className="text-slate-400 shrink-0 mt-0.5" />
              <span className="break-words whitespace-normal leading-tight">{department ? department.name : '—'}</span>
            </span>
            <span className="text-slate-500 block pl-5">{department ? `Type: ${department.type === 'zabiegowy' ? 'Surgical' : department.type === 'zachowawczy' ? 'Conservative' : 'Diagnostic'}` : ''}</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Doctors / Contacts</span>
            <div className="space-y-1.5 font-medium">
              {selectedDoctorIds.length === 0 ? (
                <span className="text-slate-500 italic block font-medium">No assigned doctors</span>
              ) : (
                selectedDoctorIds.map(id => {
                  const doc = doctors.find(d => d.id === id);
                  if (!doc) return null;
                  return (
                    <div key={id} className="font-semibold text-slate-800 flex flex-col leading-tight border-b border-slate-200/50 last:border-0 pb-1 last:pb-0">
                      <span className="flex items-start gap-1">
                        <Users size={13} className="text-slate-400 shrink-0 mt-0.5" />
                        <span className="break-words whitespace-normal leading-tight">{doc.title} {doc.first_name} {doc.last_name}</span>
                      </span>
                      <span className="text-blue-600 text-[10px] pl-4 font-semibold">{doc.specialization}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Grid: Raport z Notatki & Zadania Follow-up */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEWA STRONA: SPORZĄDZENIE RAPORTU (Col: 7) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                <FileText size={18} className="text-slate-700" />
                Visit Report (Notes)
              </h4>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                isNoteValid ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
              }`}>
                {noteContent.trim().length} chars {isNoteValid ? '✓ Ready' : '(min. 5 chars)'}
              </span>
            </div>

            {/* Dynamiczna edycja lekarzy i produktów bezpośrednio w szczegółach raportu */}
            <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200/60 text-xs">
              <div>
                <span className="font-bold text-slate-700 uppercase tracking-wide block mb-1.5">Change Meeting Participants (Doctors)</span>
                <div className="max-h-32 overflow-y-auto space-y-1.5 bg-white border border-slate-200 rounded-lg p-2.5">
                  {doctors
                    .filter(doc => doc.hospital_id === meeting.hospital_id)
                    .map(doc => {
                      const isChecked = selectedDoctorIds.includes(doc.id);
                      return (
                        <label key={doc.id} className="flex items-center gap-2 cursor-pointer p-0.5 hover:bg-slate-50 rounded text-slate-700 font-medium">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setSelectedDoctorIds(selectedDoctorIds.filter(id => id !== doc.id));
                              } else {
                                setSelectedDoctorIds([...selectedDoctorIds, doc.id]);
                              }
                            }}
                            className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 border-slate-300"
                          />
                          <span>{doc.title} {doc.first_name} {doc.last_name} <span className="text-slate-400 font-normal">({doc.specialization})</span></span>
                        </label>
                      );
                    })}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 uppercase tracking-wide block mb-1.5">Discussed Product Tags</span>
                <div className="max-h-36 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-1.5 bg-white border border-slate-200 rounded-lg p-2.5 font-medium">
                  {PRESET_PRODUCTS.map(product => {
                    const isChecked = selectedProducts.includes(product);
                    return (
                      <label key={product} className="flex items-start gap-2 cursor-pointer p-0.5 hover:bg-slate-50 rounded text-slate-700">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setSelectedProducts(selectedProducts.filter(p => p !== product));
                            } else {
                              setSelectedProducts([...selectedProducts, product]);
                            }
                          }}
                          className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 mt-0.5 border-slate-300"
                        />
                        <span className="leading-tight">{product}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Detailed visit summary and established agreements</label>
              <textarea
                id="meeting-note-textarea"
                rows={10}
                placeholder="Enter meeting details here. What did you discuss? What is the doctor interested in? What are the next steps? Keep to the min. 5 characters requirement for the final report..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm resize-none"
              />
            </div>

            {meetingStatus !== 'closed' && !isNoteValid && (
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-700 text-xs flex gap-2">
                <Info size={16} className="shrink-0 text-blue-500 mt-0.5" />
                <p>To be able to close and settle the medical meeting (Closed status), write a note of at least <strong>minimum 5 characters</strong>.</p>
              </div>
            )}
          </div>

          {/* Przyciski operacyjne zależne od stanu zamknięcia */}
          <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-3">
            {meetingStatus === 'closed' ? (
              // Jeśli spotkanie jest zamknięte, dajemy edycję, re-open oraz usunięcie
              <>
                <button
                  id="btn-reopen-meeting"
                  onClick={handleReopen}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors"
                >
                  Otwórz ponownie wizytę
                </button>
                <button
                  id="btn-save-closed-note"
                  onClick={handleSaveOnly}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-colors"
                >
                  Zapisz zmiany w notatce
                </button>
                {onDeleteMeeting && (
                  <button
                    id="btn-delete-closed-meeting"
                    type="button"
                    onClick={() => {
                      if (window.confirm('Czy na pewno chcesz usunąć tę wizytę z bazy danych? Operacja jest nieodwracalna.')) {
                        onDeleteMeeting(meeting.id);
                        onNavigateBack();
                      }
                    }}
                    className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Trash2 size={15} />
                    <span>Usuń wizytę</span>
                  </button>
                )}
              </>
            ) : (
              // Jeśli spotkanie jest otwarte
              <>
                <button
                  id="btn-save-note-draft"
                  onClick={handleSaveOnly}
                  className="flex-1 px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                >
                  Zapisz szkic
                </button>
                
                <button
                  id="btn-save-and-close"
                  onClick={handleSaveAndClose}
                  disabled={!isNoteValid}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-blue-500/10 cursor-pointer"
                >
                  Zapisz i zamknij
                </button>

                <button
                  id="btn-close-meeting-only"
                  onClick={handleCloseOnly}
                  disabled={!isNoteValid}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-emerald-500/10 cursor-pointer"
                >
                  Rozlicz i zamknij wizytę
                </button>

                {onDeleteMeeting && (
                  <button
                    id="btn-delete-unclosed-meeting"
                    type="button"
                    onClick={() => {
                      if (window.confirm('Czy na pewno chcesz usunąć tę wizytę z bazy danych? Operacja jest nieodwracalna.')) {
                        onDeleteMeeting(meeting.id);
                        onNavigateBack();
                      }
                    }}
                    className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Trash2 size={15} />
                    <span>Usuń wizytę</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* PRAWA STRONA: ZADANIA FOLLOW-UP (Col: 5) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h4 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <CheckSquare size={18} className="text-blue-600" />
            Tasks and Follow-ups ({meetingTasks.length})
          </h4>

          {/* Formularz dodawania zadań */}
          {meetingStatus !== 'closed' ? (
            <form onSubmit={handleAddTaskSubmit} className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
              <span className="text-xs font-bold text-slate-700 block uppercase tracking-wide">Add post-meeting task</span>
              
              <div className="space-y-1">
                <input
                  id="new-task-desc"
                  type="text"
                  placeholder="e.g., Send PDF price offer..."
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 block uppercase">Due Date (optional)</label>
                <input
                  id="new-task-due-date"
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                />
              </div>

              <button
                id="btn-add-task-submit"
                type="submit"
                className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"
              >
                <Plus size={14} />
                <span>Add task</span>
              </button>
            </form>
          ) : (
            <div className="p-3 bg-slate-50 text-slate-500 border border-slate-100 rounded-xl text-xs">
              Modifying or adding tasks is locked for closed visits. Reopen the visit to add tasks.
            </div>
          )}

          {/* Lista zadań */}
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {meetingTasks.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-6 text-center">No tasks assigned to this visit.</p>
            ) : (
              meetingTasks.map(task => {
                const isOverdueTask = task.due_date && new Date(task.due_date) < new Date() && !task.is_done;
                return (
                  <div 
                    key={task.id} 
                    className={`p-3 border rounded-xl flex items-start gap-3 justify-between transition-all group ${
                      task.is_done 
                        ? 'bg-slate-50/50 border-slate-100/60 opacity-60' 
                        : isOverdueTask 
                          ? 'border-red-200 bg-red-50/20' 
                          : 'bg-white border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <button
                        type="button"
                        onClick={() => meetingStatus !== 'closed' && handleToggleTask(task)}
                        disabled={meetingStatus === 'closed'}
                        className={`mt-0.5 text-slate-400 hover:text-blue-600 transition-colors shrink-0 ${
                          meetingStatus === 'closed' ? 'cursor-not-allowed' : ''
                        }`}
                      >
                        {task.is_done ? (
                          <CheckCircle size={16} className="text-emerald-600" />
                        ) : (
                          <div className="w-4 h-4 border border-slate-300 rounded hover:border-blue-500" />
                        )}
                      </button>

                      <div>
                        <p className={`text-xs font-medium text-slate-800 ${task.is_done ? 'line-through text-slate-400' : ''}`}>
                          {task.description}
                        </p>
                        {task.due_date && (
                          <span className={`text-[9px] font-mono font-bold mt-1 inline-block px-1.5 py-0.5 rounded ${
                            task.is_done 
                              ? 'bg-slate-100 text-slate-400' 
                              : isOverdueTask 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-blue-50 text-blue-600'
                          }`}>
                            Due: {task.due_date} {isOverdueTask && ' (Overdue)'}
                          </span>
                        )}
                      </div>
                    </div>

                    {meetingStatus !== 'closed' && (
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="text-slate-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 rounded transition-all"
                        title="Delete task"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Popup prompt z pytaniem o kolejny Follow-Up */}
      <FollowUpPromptModal
        task={completedTaskForPrompt}
        meetings={meetings}
        hospitals={hospitals}
        doctors={doctors}
        onClose={() => setCompletedTaskForPrompt(null)}
        onConfirmAddFollowUp={handleConfirmAddFollowUp}
      />

    </div>
  );
}
