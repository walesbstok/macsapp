import React, { useState } from 'react';
import { 
  CheckSquare, 
  Square, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit2, 
  Building2, 
  Users, 
  ChevronRight, 
  X,
  CheckCircle2,
  FileText,
  FileSpreadsheet,
  RotateCw,
  Layers
} from 'lucide-react';
import { Task, Meeting, Hospital, Department, Doctor, UserRole } from '../types';
import { initializeDatabase } from '../db';
import FollowUpPromptModal from './FollowUpPromptModal';

interface TasksViewProps {
  key?: React.Key;
  tasks: Task[];
  meetings: Meeting[];
  hospitals: Hospital[];
  departments?: Department[];
  doctors: Doctor[];
  onSaveTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onNavigateToMeeting: (meetingId: string) => void;
  initialShowNewTask?: boolean;
  currentRole: UserRole;
}

export default function TasksView({
  tasks,
  meetings,
  hospitals,
  departments = [],
  doctors,
  onSaveTask,
  onDeleteTask,
  onNavigateToMeeting,
  initialShowNewTask = false,
  currentRole
}: TasksViewProps) {
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'overdue' | 'completed'>('pending');
  const [hospitalFilter, setHospitalFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'by_hospital'>('list');
  
  // Modal / Form state for new or edit task
  const [isModalOpen, setIsModalOpen] = useState(initialShowNewTask);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskHospitalId, setTaskHospitalId] = useState('');
  const [taskDepartmentId, setTaskDepartmentId] = useState('');
  const [taskDoctorId, setTaskDoctorId] = useState('');
  const [taskMeetingId, setTaskMeetingId] = useState('');

  React.useEffect(() => {
    if (initialShowNewTask) {
      setEditingTask(null);
      setTaskDescription('');
      setTaskDueDate('');
      setTaskHospitalId('');
      setTaskDepartmentId('');
      setTaskDoctorId('');
      setTaskMeetingId('');
      setIsModalOpen(true);
    }
  }, [initialShowNewTask]);

  // Follow-Up Prompt modal state
  const [completedTaskForPrompt, setCompletedTaskForPrompt] = useState<Task | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  // Helper getters
  const getMeeting = (meetingId?: string) => meetingId ? meetings.find(m => m.id === meetingId) : null;
  
  const getHospitalForMeeting = (meetingId?: string) => {
    if (!meetingId) return null;
    const meet = getMeeting(meetingId);
    if (!meet) return null;
    return hospitals.find(h => h.id === meet.hospital_id);
  };

  const getHospitalForTask = (task: Task) => {
    if (task.hospital_id) {
      const h = hospitals.find(hosp => hosp.id === task.hospital_id);
      if (h) return h;
    }
    return getHospitalForMeeting(task.meeting_id);
  };

  const getDepartmentForMeeting = (meetingId?: string) => {
    if (!meetingId) return null;
    const meet = getMeeting(meetingId);
    if (!meet) return null;
    if (meet.department_id && departments) {
      const d = departments.find(dep => dep.id === meet.department_id);
      if (d) return d;
    }
    const doc = getDoctorForMeeting(meetingId);
    if (doc?.department_id && departments) {
      const d = departments.find(dep => dep.id === doc.department_id);
      if (d) return d;
    }
    return null;
  };

  const getDepartmentForTask = (task: Task) => {
    if (task.department_id && departments) {
      const d = departments.find(dep => dep.id === task.department_id);
      if (d) return d;
    }
    return getDepartmentForMeeting(task.meeting_id);
  };

  const getDoctorForMeeting = (meetingId?: string) => {
    if (!meetingId) return null;
    const meet = getMeeting(meetingId);
    if (!meet) return null;
    return doctors.find(d => d.id === (meet.doctor_id || (meet.doctor_ids && meet.doctor_ids[0])));
  };

  const getDoctorForTask = (task: Task) => {
    if (task.doctor_id) {
      const doc = doctors.find(d => d.id === task.doctor_id);
      if (doc) return doc;
    }
    return getDoctorForMeeting(task.meeting_id);
  };

  // Helper check overdue
  const isOverdue = (task: Task) => {
    if (task.is_done || !task.due_date) return false;
    return task.due_date < todayStr;
  };

  const isDueToday = (task: Task) => {
    if (task.is_done || !task.due_date) return false;
    return task.due_date === todayStr;
  };

  // Stats
  const totalCount = tasks.length;
  const pendingCount = tasks.filter(t => !t.is_done).length;
  const overdueCount = tasks.filter(t => isOverdue(t)).length;
  const completedCount = tasks.filter(t => t.is_done).length;

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    // Status filter
    if (statusFilter === 'pending' && task.is_done) return false;
    if (statusFilter === 'completed' && !task.is_done) return false;
    if (statusFilter === 'overdue' && !isOverdue(task)) return false;

    // Hospital filter
    const taskHosp = getHospitalForTask(task);
    if (hospitalFilter !== 'all') {
      if (hospitalFilter === 'none') {
        if (taskHosp) return false;
      } else {
        if (taskHosp?.id !== hospitalFilter) return false;
      }
    }

    // Search term
    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();
    const matchesDesc = task.description.toLowerCase().includes(term);
    
    const meet = getMeeting(task.meeting_id);
    const matchesMeeting = meet?.title.toLowerCase().includes(term);
    
    const hosp = taskHosp;
    const matchesHosp = hosp?.name.toLowerCase().includes(term) || hosp?.city.toLowerCase().includes(term);

    const doc = getDoctorForTask(task);
    const matchesDoc = doc ? `${doc.first_name} ${doc.last_name}`.toLowerCase().includes(term) : false;

    const dept = getDepartmentForTask(task);
    const matchesDept = dept ? dept.name.toLowerCase().includes(term) : false;

    return matchesDesc || matchesMeeting || matchesHosp || matchesDoc || matchesDept;
  }).sort((a, b) => {
    // Put overdue & uncompleted first, then by due date
    if (a.is_done !== b.is_done) return a.is_done ? 1 : -1;
    if (!a.due_date) return 1;
    if (!b.due_date) return -1;
    return a.due_date.localeCompare(b.due_date);
  });

  // Handlers
  const handleToggleDone = (task: Task) => {
    const willBeDone = !task.is_done;
    onSaveTask({
      ...task,
      is_done: willBeDone
    });

    if (willBeDone) {
      setCompletedTaskForPrompt(task);
    }
  };

  const handleConfirmAddFollowUp = (task: Task, meetingId: string) => {
    setCompletedTaskForPrompt(null);
    setEditingTask(null);
    setTaskDescription('');
    
    // Set default due date +7 days
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    setTaskDueDate(nextWeek.toISOString().split('T')[0]);
    
    const meet = meetings.find(m => m.id === meetingId);
    setTaskHospitalId(task.hospital_id || meet?.hospital_id || '');
    setTaskDepartmentId(task.department_id || meet?.department_id || '');
    setTaskDoctorId(task.doctor_id || meet?.doctor_id || '');
    setTaskMeetingId(meetingId || '');
    setIsModalOpen(true);
  };

  const handleOpenCreateModal = (presetHospitalId?: string) => {
    setEditingTask(null);
    setTaskDescription('');
    setTaskDueDate(todayStr);
    setTaskHospitalId(presetHospitalId || (hospitalFilter !== 'all' && hospitalFilter !== 'none' ? hospitalFilter : ''));
    setTaskDepartmentId('');
    setTaskDoctorId('');
    setTaskMeetingId('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setTaskDescription(task.description);
    setTaskDueDate(task.due_date || '');
    const meet = meetings.find(m => m.id === task.meeting_id);
    setTaskHospitalId(task.hospital_id || meet?.hospital_id || '');
    setTaskDepartmentId(task.department_id || meet?.department_id || '');
    setTaskDoctorId(task.doctor_id || meet?.doctor_id || '');
    setTaskMeetingId(task.meeting_id || '');
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskDescription.trim()) {
      alert('Proszę podać treść zadania!');
      return;
    }

    const newTask: Task = {
      id: editingTask ? editingTask.id : `task_${Date.now()}`,
      meeting_id: taskMeetingId || '',
      hospital_id: taskHospitalId || undefined,
      department_id: taskDepartmentId || undefined,
      doctor_id: taskDoctorId || undefined,
      description: taskDescription.trim(),
      due_date: taskDueDate || null,
      is_done: editingTask ? editingTask.is_done : false,
      created_at: editingTask ? editingTask.created_at : new Date().toISOString()
    };

    onSaveTask(newTask);
    setIsModalOpen(false);
  };

  // Funkcja eksportu całej bazy zadań z hierarchią (Miasto / Szpital / Oddział / Lekarz / Spotkanie / Zadanie) do pliku CSV
  const exportTasksToCSV = () => {
    if (!tasks || tasks.length === 0) {
      alert('Brak zadań w bazie do wyeksportowania.');
      return;
    }

    const headers = [
      'Miasto',
      'Województwo',
      'Szpital',
      'Segment Szpitala',
      'Oddział',
      'Lekarz',
      'Tytuł Spotkania',
      'Data Spotkania',
      'ID Zadania',
      'Treść Zadania / Follow-Up',
      'Termin Wykonania',
      'Status Wykonania',
      'Data Utworzenia'
    ];

    const escapeCSV = (val: string | null | undefined): string => {
      if (val === null || val === undefined) return '""';
      const cleanStr = String(val).replace(/"/g, '""').replace(/\r?\n/g, ' ');
      return `"${cleanStr}"`;
    };

    // Sortowanie: nieukończone/zaległe na początku, według miejscowości i nazwy szpitala
    const sortedTasks = [...tasks].sort((a, b) => {
      const meetA = meetings.find(m => m.id === a.meeting_id);
      const meetB = meetings.find(m => m.id === b.meeting_id);
      const hospA = meetA ? hospitals.find(h => h.id === meetA.hospital_id) : null;
      const hospB = meetB ? hospitals.find(h => h.id === meetB.hospital_id) : null;

      const cityA = (hospA?.city || '').toLowerCase();
      const cityB = (hospB?.city || '').toLowerCase();

      if (cityA !== cityB) return cityA.localeCompare(cityB, 'pl');
      
      if (a.is_done !== b.is_done) return a.is_done ? 1 : -1;
      
      if (a.due_date && b.due_date) return a.due_date.localeCompare(b.due_date);
      if (a.due_date) return -1;
      if (b.due_date) return 1;
      
      return b.created_at.localeCompare(a.created_at);
    });

    const rows = sortedTasks.map(task => {
      const meet = meetings.find(m => m.id === task.meeting_id);
      const hosp = meet ? hospitals.find(h => h.id === meet.hospital_id) : null;
      const dept = meet?.department_id && departments ? departments.find(d => d.id === meet.department_id) : null;
      
      const doc = meet ? doctors.find(d => d.id === (meet.doctor_id || (meet.doctor_ids && meet.doctor_ids[0]))) : null;
      const docFullName = doc ? `${doc.title ? doc.title + ' ' : ''}${doc.first_name || ''} ${doc.last_name || ''}`.trim() : '';

      const city = hosp?.city || '';
      const voiv = hosp?.voivodeship || '';
      const hospName = hosp?.name || '';
      const segment = hosp?.segment || '';
      const deptName = dept?.name || '';
      const meetingTitle = meet?.title || '';
      const meetingDate = meet?.meeting_date ? new Date(meet.meeting_date).toLocaleString('pl-PL') : '';

      let taskStatus = 'Do zrobienia';
      if (task.is_done) {
        taskStatus = 'Wykonane';
      } else if (isOverdue(task)) {
        taskStatus = 'Zaległe';
      }

      return [
        escapeCSV(city),
        escapeCSV(voiv),
        escapeCSV(hospName),
        escapeCSV(segment),
        escapeCSV(deptName),
        escapeCSV(docFullName),
        escapeCSV(meetingTitle),
        escapeCSV(meetingDate),
        escapeCSV(task.id),
        escapeCSV(task.description),
        escapeCSV(task.due_date || 'Brak terminu'),
        escapeCSV(taskStatus),
        escapeCSV(task.created_at ? new Date(task.created_at).toLocaleString('pl-PL') : '')
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.map(h => `"${h}"`).join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `baza_zadan_macscrm_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in p-3 sm:p-6 max-w-7xl mx-auto">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl sm:text-3xl text-slate-900 tracking-tight flex items-center gap-2.5">
            <CheckSquare className="text-blue-600 shrink-0" size={28} />
            <span>Tasks & Follow-Ups (FU)</span>
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            All post-visit actions, doctor agreements, and reminders in one place.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => {
              if (confirm('Czy na pewno chcesz odświeżyć i zsynchronizować całą bazę raportów PDF i zadań Follow-Up?')) {
                initializeDatabase(true);
                window.location.reload();
              }
            }}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
            title="Szybkie odświeżenie i zsynchronizowanie bazy danych z pełną listą wizyt i zadań z raportów PDF"
          >
            <RotateCw size={18} />
            <span>Zsynchronizuj bazę PDF</span>
          </button>

          <button
            id="btn-export-tasks-csv"
            onClick={exportTasksToCSV}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
            title="Eksportuj całą bazę zadań z kontekstem szpitali i lekarzy do pliku CSV (Excel)"
          >
            <FileSpreadsheet size={18} />
            <span>Eksportuj zadania (CSV)</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus size={18} />
            <span>Add New Task / FU</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <button
          onClick={() => setStatusFilter('pending')}
          className={`p-4 rounded-2xl border transition-all text-left flex items-center justify-between ${
            statusFilter === 'pending'
              ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div>
            <span className="text-xs font-medium text-slate-500 block">To Do</span>
            <span className="font-display font-bold text-2xl text-blue-700">{pendingCount}</span>
          </div>
          <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
            <Clock size={20} />
          </div>
        </button>

        <button
          onClick={() => setStatusFilter('overdue')}
          className={`p-4 rounded-2xl border transition-all text-left flex items-center justify-between ${
            statusFilter === 'overdue'
              ? 'bg-red-50/80 border-red-300 ring-2 ring-red-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div>
            <span className="text-xs font-medium text-slate-500 block">Overdue</span>
            <span className="font-display font-bold text-2xl text-red-600">{overdueCount}</span>
          </div>
          <div className="p-2.5 bg-red-100 text-red-600 rounded-xl">
            <AlertTriangle size={20} />
          </div>
        </button>

        <button
          onClick={() => setStatusFilter('completed')}
          className={`p-4 rounded-2xl border transition-all text-left flex items-center justify-between ${
            statusFilter === 'completed'
              ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div>
            <span className="text-xs font-medium text-slate-500 block">Completed</span>
            <span className="font-display font-bold text-2xl text-emerald-600">{completedCount}</span>
          </div>
          <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
            <CheckCircle2 size={20} />
          </div>
        </button>

        <button
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-2xl border transition-all text-left flex items-center justify-between ${
            statusFilter === 'all'
              ? 'bg-slate-100 border-slate-300 ring-2 ring-slate-400/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div>
            <span className="text-xs font-medium text-slate-500 block">All Tasks</span>
            <span className="font-display font-bold text-2xl text-slate-800">{totalCount}</span>
          </div>
          <div className="p-2.5 bg-slate-100 text-slate-700 rounded-xl">
            <Filter size={20} />
          </div>
        </button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Szukaj w treści, szpitalu, oddziale, lekarzu lub tytule wizyty..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Hospital Filter Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Building2 size={16} className="text-slate-400 shrink-0 hidden sm:inline" />
            <select
              value={hospitalFilter}
              onChange={(e) => setHospitalFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 sm:max-w-[260px]"
              title="Filtruj zadania wg wybranego szpitala"
            >
              <option value="all">Wszystkie szpitale ({tasks.length})</option>
              {hospitals.map(h => {
                const hospTaskCount = tasks.filter(t => getHospitalForTask(t)?.id === h.id).length;
                return (
                  <option key={h.id} value={h.id}>
                    {h.name} ({hospTaskCount})
                  </option>
                );
              })}
              <option value="none">Bez powiązanego szpitala</option>
            </select>
          </div>

          {/* View mode switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0 text-xs font-semibold">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckSquare size={14} />
              <span>Lista</span>
            </button>
            <button
              onClick={() => setViewMode('by_hospital')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'by_hospital'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 size={14} />
              <span>Grupuj wg Szpitali</span>
            </button>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 overflow-x-auto text-xs font-semibold">
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === 'pending'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Do zrobienia ({pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter('overdue')}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === 'overdue'
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Zaległe ({overdueCount})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === 'completed'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ukończone ({completedCount})
            </button>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Wszystkie ({totalCount})
            </button>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Wyniki: <strong className="text-slate-700">{filteredTasks.length}</strong> zadań
          </div>
        </div>
      </div>

      {/* RENDEROWANIE: WIDOK GRUPOWANY WG SZPITALI LUB ZWYKŁA LISTA */}
      {viewMode === 'by_hospital' ? (
        <div className="space-y-6">
          {(() => {
            // Group tasks by hospital
            const groupedMap = new Map<string, Task[]>();
            filteredTasks.forEach(task => {
              const hosp = getHospitalForTask(task);
              const key = hosp ? hosp.id : '__no_hospital__';
              if (!groupedMap.has(key)) {
                groupedMap.set(key, []);
              }
              groupedMap.get(key)!.push(task);
            });

            if (filteredTasks.length === 0) {
              return (
                <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-8 sm:p-12 text-center">
                  <CheckSquare size={40} className="text-slate-300 mx-auto mb-3" />
                  <h3 className="font-display font-bold text-slate-800 text-base sm:text-lg">Brak zadań w tej kategorii</h3>
                  <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-md mx-auto">
                    {searchTerm 
                      ? 'Brak wyników pasujących do wyszukiwania.'
                      : 'Świetnie! Nie masz oczekujących zadań w wybranym filtrze.'}
                  </p>
                  <button
                    onClick={() => handleOpenCreateModal()}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
                  >
                    <Plus size={16} /> Dodaj nowe zadanie
                  </button>
                </div>
              );
            }

            const hospitalKeys = Array.from(groupedMap.keys()).sort((a, b) => {
              if (a === '__no_hospital__') return 1;
              if (b === '__no_hospital__') return -1;
              const hospA = hospitals.find(h => h.id === a);
              const hospB = hospitals.find(h => h.id === b);
              return (hospA?.name || '').localeCompare(hospB?.name || '');
            });

            return hospitalKeys.map(hospId => {
              const hosp = hospId !== '__no_hospital__' ? hospitals.find(h => h.id === hospId) : null;
              const hospTasks = groupedMap.get(hospId) || [];
              const hospPendingCount = hospTasks.filter(t => !t.is_done).length;
              const hospOverdueCount = hospTasks.filter(t => isOverdue(t)).length;

              return (
                <div key={hospId} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                  {/* Nagłówek szpitala */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <Building2 size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-display font-bold text-base text-slate-900 break-words whitespace-normal">
                            {hosp ? hosp.name : 'Zadania bez przypisanego szpitala'}
                          </h4>
                          {hosp?.city && (
                            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                              {hosp.city}
                            </span>
                          )}
                          {hosp?.segment && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              hosp.segment === 'A' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                              hosp.segment === 'B' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                              'bg-indigo-50 text-indigo-600 border-indigo-100'
                            }`}>
                              Segment {hosp.segment}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span>Do zrobienia: <strong className="text-slate-800">{hospPendingCount}</strong></span>
                          {hospOverdueCount > 0 && (
                            <span className="text-red-600 font-semibold bg-red-50 px-1.5 py-0.2 rounded">
                              • {hospOverdueCount} zaległe!
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenCreateModal(hosp?.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-xl transition-colors shrink-0 cursor-pointer self-start sm:self-auto"
                    >
                      <Plus size={14} />
                      <span>Dodaj zadanie dla tej placówki</span>
                    </button>
                  </div>

                  {/* Lista zadań szpitala */}
                  <div className="space-y-2.5">
                    {hospTasks.map(task => {
                      const overdue = isOverdue(task);
                      const dueToday = isDueToday(task);
                      const meet = getMeeting(task.meeting_id);
                      const dept = getDepartmentForTask(task);
                      const doc = getDoctorForTask(task);

                      return (
                        <div
                          key={task.id}
                          className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                            task.is_done
                              ? 'bg-slate-50/80 border-slate-200/60 opacity-80'
                              : overdue
                                ? 'bg-red-50/30 border-red-200 hover:border-red-300'
                                : dueToday
                                  ? 'bg-amber-50/20 border-amber-200 hover:border-amber-300'
                                  : 'bg-white border-slate-200 hover:border-blue-200 shadow-3xs'
                          }`}
                        >
                          <div className="flex items-start gap-3 min-w-0 flex-1">
                            <button
                              type="button"
                              onClick={() => handleToggleDone(task)}
                              className={`mt-0.5 p-0.5 rounded transition-colors shrink-0 cursor-pointer ${
                                task.is_done ? 'text-emerald-600' : overdue ? 'text-red-500' : 'text-slate-400 hover:text-blue-600'
                              }`}
                              title={task.is_done ? 'Oznacz jako niewykonane' : 'Oznacz jako wykonane'}
                            >
                              {task.is_done ? <CheckCircle2 size={18} className="fill-emerald-100 text-emerald-600" /> : <Square size={18} />}
                            </button>

                            <div className="min-w-0 flex-1">
                              <p className={`text-xs font-semibold leading-snug break-words ${
                                task.is_done ? 'line-through text-slate-400 font-normal' : 'text-slate-900'
                              }`}>
                                {task.description}
                              </p>

                              <div className="flex items-center gap-2 flex-wrap mt-1.5">
                                {task.due_date && (
                                  <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                    task.is_done
                                      ? 'bg-slate-100 text-slate-500'
                                      : overdue
                                        ? 'bg-red-100 text-red-700 border border-red-200'
                                        : dueToday
                                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                          : 'bg-blue-50 text-blue-700 border border-blue-100'
                                  }`}>
                                    <Clock size={10} />
                                    <span>{overdue ? 'Zaległe: ' : dueToday ? 'Dziś: ' : 'Termin: '}{task.due_date}</span>
                                  </span>
                                )}

                                {dept && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                                    <Layers size={10} className="text-slate-400" />
                                    <span>Oddział: {dept.name}</span>
                                  </span>
                                )}

                                {doc && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                                    <Users size={10} className="text-slate-400" />
                                    <span>{doc.title ? `${doc.title} ` : ''}{doc.first_name} {doc.last_name}</span>
                                  </span>
                                )}

                                {meet && (
                                  <button
                                    type="button"
                                    onClick={() => onNavigateToMeeting(meet.id)}
                                    className="inline-flex items-center gap-1 text-[10px] font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-full transition-colors cursor-pointer"
                                    title="Przejdź do wizyty"
                                  >
                                    <FileText size={10} />
                                    <span>Wizyta: {meet.title}</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(task)}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              title="Edytuj zadanie"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm('Czy na pewno chcesz usunąć to zadanie?')) {
                                  onDeleteTask(task.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Usuń zadanie"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            });
          })()}
        </div>
      ) : (
        /* Task List */
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-8 sm:p-12 text-center">
              <CheckSquare size={40} className="text-slate-300 mx-auto mb-3" />
              <h3 className="font-display font-bold text-slate-800 text-base sm:text-lg">Brak zadań w tej kategorii</h3>
              <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-md mx-auto">
                {searchTerm 
                  ? 'Brak wyników pasujących do wyszukiwania. Spróbuj zmienić parametry.'
                  : 'Świetnie! Nie masz oczekujących zadań w wybranym filtrze.'}
              </p>
              <button
                onClick={() => handleOpenCreateModal()}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
              >
                <Plus size={16} /> Dodaj zadanie
              </button>
            </div>
          ) : (
            filteredTasks.map(task => {
              const overdue = isOverdue(task);
              const dueToday = isDueToday(task);
              const meeting = getMeeting(task.meeting_id);
              const hospital = getHospitalForTask(task);
              const department = getDepartmentForTask(task);
              const doctor = getDoctorForTask(task);

              return (
                <div
                  key={task.id}
                  className={`bg-white border p-4 sm:p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    task.is_done
                      ? 'border-slate-200 bg-slate-50/50 opacity-75'
                      : overdue
                        ? 'border-red-300 bg-red-50/30'
                        : dueToday
                          ? 'border-amber-300 bg-amber-50/20'
                          : 'border-slate-200 hover:border-blue-200'
                  }`}
                >
                  {/* Left side: Checkbox & Task details */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={() => handleToggleDone(task)}
                      className={`mt-0.5 p-1 rounded-lg transition-colors shrink-0 ${
                        task.is_done
                          ? 'text-emerald-600 hover:text-emerald-700'
                          : overdue
                            ? 'text-red-500 hover:text-red-600'
                            : 'text-slate-400 hover:text-blue-600'
                      }`}
                      title={task.is_done ? "Oznacz jako niewykonane" : "Oznacz jako wykonane"}
                    >
                      {task.is_done ? (
                        <CheckCircle2 size={22} className="fill-emerald-100 text-emerald-600" />
                      ) : (
                        <Square size={22} />
                      )}
                    </button>

                    <div className="space-y-1.5 flex-1 min-w-0 w-full">
                      <div className="flex flex-wrap items-center gap-2 w-full">
                        <p className={`text-sm sm:text-base font-semibold text-slate-900 leading-snug break-words whitespace-normal min-w-0 flex-1 ${
                          task.is_done ? 'line-through text-slate-500 font-normal' : ''
                        }`}>
                          {task.description}
                        </p>

                        {/* Due date badge */}
                        {task.due_date && (
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 shrink-0 ${
                            task.is_done
                              ? 'bg-slate-100 text-slate-500'
                              : overdue
                                ? 'bg-red-100 text-red-800 border border-red-200'
                                : dueToday
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-blue-50 text-blue-700 border border-blue-100'
                          }`}>
                            <Clock size={12} className="shrink-0" />
                            {overdue ? 'Zaległe: ' : dueToday ? 'Dziś: ' : ''}
                            {task.due_date}
                          </span>
                        )}
                      </div>

                      {/* Metadata tags: Meeting, Hospital, Department, Doctor */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-600 font-medium pt-1 w-full min-w-0">
                        {hospital && (
                          <span className="inline-flex items-center gap-1.5 text-slate-700 bg-slate-100/90 px-2.5 py-1 rounded-lg break-words max-w-full">
                            <Building2 size={13} className="text-slate-400 shrink-0" />
                            <span className="break-words whitespace-normal leading-tight">{hospital.name} ({hospital.city})</span>
                          </span>
                        )}

                        {department && (
                          <span className="inline-flex items-center gap-1.5 text-slate-700 bg-slate-100/90 px-2.5 py-1 rounded-lg break-words max-w-full">
                            <Layers size={13} className="text-slate-400 shrink-0" />
                            <span className="break-words whitespace-normal leading-tight">Oddział: {department.name}</span>
                          </span>
                        )}

                        {doctor && (
                          <span className="inline-flex items-center gap-1.5 text-slate-700 bg-slate-100/90 px-2.5 py-1 rounded-lg break-words max-w-full">
                            <Users size={13} className="text-slate-400 shrink-0" />
                            <span className="break-words whitespace-normal leading-tight">{doctor.title ? `${doctor.title} ` : ''}{doctor.first_name} {doctor.last_name}</span>
                          </span>
                        )}

                        {meeting && (
                          <button
                            onClick={() => onNavigateToMeeting(meeting.id)}
                            className="inline-flex items-center gap-1.5 text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg hover:bg-blue-100 transition-colors font-medium break-words max-w-full text-left cursor-pointer"
                          >
                            <FileText size={13} className="shrink-0 text-blue-500" />
                            <span className="break-words whitespace-normal leading-tight">Wizyta: {meeting.title} ({new Date(meeting.meeting_date).toLocaleDateString('pl-PL')})</span>
                            <ChevronRight size={12} className="shrink-0" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right side: Action buttons */}
                  <div className="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <button
                      onClick={() => handleOpenEditModal(task)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-xs flex items-center gap-1 font-medium cursor-pointer"
                      title="Edytuj zadanie"
                    >
                      <Edit2 size={15} />
                      <span className="hidden sm:inline">Edytuj</span>
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm('Czy na pewno chcesz usunąć to zadanie?')) {
                          onDeleteTask(task.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-xs flex items-center gap-1 font-medium cursor-pointer"
                      title="Usuń zadanie"
                    >
                      <Trash2 size={15} />
                      <span className="hidden sm:inline">Usuń</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Modal create/edit task */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                <CheckSquare size={20} className="text-blue-600" />
                <span>{editingTask ? 'Edytuj zadanie' : 'Nowe zadanie / Follow-Up'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
              {/* Szpital */}
              <div className="space-y-1">
                <label className="block font-semibold text-slate-700 uppercase tracking-wider text-[10px]">
                  Szpital / Placówka (opcjonalnie)
                </label>
                <select
                  value={taskHospitalId}
                  onChange={(e) => {
                    setTaskHospitalId(e.target.value);
                    setTaskDepartmentId('');
                    setTaskDoctorId('');
                  }}
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 text-slate-800"
                >
                  <option value="">-- Wybierz szpital (lub brak) --</option>
                  {hospitals.map(h => (
                    <option key={h.id} value={h.id}>{h.name} ({h.city})</option>
                  ))}
                </select>
              </div>

              {/* Oddział i Lekarz */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider text-[10px]">
                    Oddział
                  </label>
                  <select
                    value={taskDepartmentId}
                    onChange={(e) => setTaskDepartmentId(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 text-slate-800"
                  >
                    <option value="">Wszystkie / Brak</option>
                    {departments
                      .filter(d => !taskHospitalId || d.hospital_id === taskHospitalId)
                      .map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider text-[10px]">
                    Lekarz
                  </label>
                  <select
                    value={taskDoctorId}
                    onChange={(e) => setTaskDoctorId(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 text-slate-800"
                  >
                    <option value="">Wszyscy / Brak</option>
                    {doctors
                      .filter(doc => (!taskHospitalId || doc.hospital_id === taskHospitalId) && (!taskDepartmentId || doc.department_id === taskDepartmentId))
                      .map(doc => (
                        <option key={doc.id} value={doc.id}>
                          {doc.title ? `${doc.title} ` : ''}{doc.first_name} {doc.last_name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Powiązana wizyta */}
              <div className="space-y-1">
                <label className="block font-semibold text-slate-700 uppercase tracking-wider text-[10px]">
                  Powiązana wizyta handlowa (opcjonalnie)
                </label>
                <select
                  value={taskMeetingId}
                  onChange={(e) => {
                    const mid = e.target.value;
                    setTaskMeetingId(mid);
                    if (mid) {
                      const m = meetings.find(meet => meet.id === mid);
                      if (m) {
                        if (m.hospital_id) setTaskHospitalId(m.hospital_id);
                        if (m.department_id) setTaskDepartmentId(m.department_id);
                        if (m.doctor_id) setTaskDoctorId(m.doctor_id);
                      }
                    }
                  }}
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 text-slate-800"
                >
                  <option value="">-- Brak bezpośredniego powiązania z wizytą --</option>
                  {meetings
                    .filter(m => !taskHospitalId || m.hospital_id === taskHospitalId)
                    .map(m => {
                      const hosp = hospitals.find(h => h.id === m.hospital_id);
                      const dept = m.department_id && departments ? departments.find(d => d.id === m.department_id) : null;
                      const doc = doctors.find(d => d.id === (m.doctor_id || (m.doctor_ids && m.doctor_ids[0])));
                      const docLabel = doc ? `${doc.title ? doc.title + ' ' : ''}${doc.first_name} ${doc.last_name}` : '';
                      const deptLabel = dept ? `[Oddział: ${dept.name}]` : '';
                      return (
                        <option key={m.id} value={m.id}>
                          {m.title} {docLabel ? `[Lekarz: ${docLabel}]` : ''} {deptLabel} ({hosp ? hosp.name : 'Szpital'}) - {new Date(m.meeting_date).toLocaleDateString('pl-PL')}
                        </option>
                      );
                    })}
                </select>
              </div>

              {/* Opis zadania */}
              <div className="space-y-1">
                <label className="block font-semibold text-slate-700 uppercase tracking-wider text-[10px]">
                  Treść zadania / Ustalenia *
                </label>
                <textarea
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="np. Przesłać ofertę na cewniki ALLIUM, przygotować próbki na zabieg..."
                  rows={3}
                  required
                  className="w-full text-xs border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 resize-none text-slate-800"
                />
              </div>

              {/* Termin wykonania */}
              <div className="space-y-1">
                <label className="block font-semibold text-slate-700 uppercase tracking-wider text-[10px]">
                  Termin wykonania (Due date)
                </label>
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 text-slate-800 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow transition-all cursor-pointer"
                >
                  {editingTask ? 'Zapisz zmiany' : 'Dodaj zadanie'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Popup z pytaniem o utworzenie kolejnego Follow-Up po wykonaniu zadania */}
      <FollowUpPromptModal
        task={completedTaskForPrompt}
        meetings={meetings}
        hospitals={hospitals}
        departments={departments}
        doctors={doctors}
        onClose={() => setCompletedTaskForPrompt(null)}
        onConfirmAddFollowUp={handleConfirmAddFollowUp}
      />
    </div>
  );
}
