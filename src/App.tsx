import React, { useState, useEffect } from 'react';
import { 
  getHospitals, 
  saveHospital, 
  deleteHospital, 
  getDepartments, 
  saveDepartment, 
  deleteDepartment, 
  getDoctors, 
  saveDoctor, 
  deleteDoctor, 
  getMeetings, 
  saveMeeting, 
  deleteMeeting, 
  getTasks, 
  saveTask, 
  deleteTask, 
  resetDatabase, 
  initializeDatabase,
  seedFirestoreIfEmpty,
  getSystemSettings,
  subscribeToFirestore,
  resetLocalStateFromFirestore
} from './db';
import { Hospital, Department, Doctor, Meeting, Task, UserRole, CrmUser } from './types';
import { Menu, Building2, ShieldAlert, LogOut, User, RefreshCw, Settings } from 'lucide-react';
import BottomNav from './components/BottomNav';
import DashboardView from './components/DashboardView';
import ContactsView from './components/ContactsView';
import MeetingsView from './components/MeetingsView';
import MeetingDetailView from './components/MeetingDetailView';
import CalendarView from './components/CalendarView';
import AdminView from './components/AdminView';
import ManagerView from './components/ManagerView';
import LoginView from './components/LoginView';
import TasksView from './components/TasksView';
import SettingsView from './components/SettingsView';
import { getUsers } from './db';

export default function App() {
  // Navigation & Mobile Drawer
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [navigationParams, setNavigationParams] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // System Settings State
  const [systemSettings, setSystemSettings] = useState(() => getSystemSettings());

  const handleSettingsChange = () => {
    setSystemSettings(getSystemSettings());
  };

  // Authentication & Current User State
  const [currentUser, setCurrentUser] = useState<CrmUser | null>(() => {
    initializeDatabase(); // Ensure DB is initialized before looking up users
    const savedId = localStorage.getItem('med_crm_logged_in_user_id');
    if (savedId) {
      const allUsers = getUsers();
      const found = allUsers.find(u => u.id === savedId);
      if (found && found.isActive) {
        return found;
      }
    }
    return null;
  });

  // User Role State
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    if (currentUser) return currentUser.role;
    const saved = localStorage.getItem('med_crm_user_role');
    return (saved as UserRole) || 'sales representative';
  });

  // Keep role state in sync if currentUser changes
  useEffect(() => {
    if (currentUser) {
      setCurrentRole(currentUser.role);
    }
  }, [currentUser]);

  // Save role to localStorage when changed
  useEffect(() => {
    localStorage.setItem('med_crm_user_role', currentRole);
  }, [currentRole]);

  const handleLogin = async (user: CrmUser) => {
    localStorage.setItem('med_crm_logged_in_user_id', user.id);
    setCurrentUser(user);
    setCurrentRole(user.role);
    setCurrentPage('dashboard');
    await resetLocalStateFromFirestore();
    loadDatabaseData();
  };

  const handleLogout = async () => {
    localStorage.removeItem('med_crm_logged_in_user_id');
    setCurrentUser(null);
    await resetLocalStateFromFirestore();
    loadDatabaseData();
  };

  // States tabel bazodanowych
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Inicjalizacja i załadowanie danych bezpośrednio z Firebase Cloud Firestore
  const loadDatabaseData = () => {
    initializeDatabase(false);
    setHospitals(getHospitals());
    setDepartments(getDepartments());
    setDoctors(getDoctors());
    setMeetings(getMeetings());
    setTasks(getTasks());
  };

  useEffect(() => {
    loadDatabaseData();
    seedFirestoreIfEmpty();
    const unsubscribe = subscribeToFirestore(() => {
      setHospitals(getHospitals());
      setDepartments(getDepartments());
      setDoctors(getDoctors());
      setMeetings(getMeetings());
      setTasks(getTasks());
      setSystemSettings(getSystemSettings());
    });
    return () => unsubscribe();
  }, []);

  // Handlers dla nawigacji z parametrami
  const handleNavigateToPage = (page: string, params: any = null) => {
    setCurrentPage(page);
    setNavigationParams(params);
  };

  // Handlers CRUD - Szpitale
  const handleSaveHospital = (hospital: Hospital) => {
    saveHospital(hospital);
    setHospitals(getHospitals());
  };

  const handleDeleteHospital = (id: string) => {
    deleteHospital(id);
    setHospitals(getHospitals());
  };

  // Handlers CRUD - Oddziały
  const handleSaveDepartment = (dept: Department) => {
    saveDepartment(dept);
    setDepartments(getDepartments());
  };

  const handleDeleteDepartment = (id: string) => {
    deleteDepartment(id);
    setDepartments(getDepartments());
  };

  // Handlers CRUD - Lekarze
  const handleSaveDoctor = (doctor: Doctor) => {
    saveDoctor(doctor);
    setDoctors(getDoctors());
  };

  const handleDeleteDoctor = (id: string) => {
    deleteDoctor(id);
    setDoctors(getDoctors());
  };

  // Handlers CRUD - Spotkania
  const handleSaveMeeting = (meeting: Meeting) => {
    saveMeeting(meeting);
    setMeetings(getMeetings());
  };

  const handleDeleteMeeting = (id: string) => {
    deleteMeeting(id);
    setMeetings(getMeetings());
  };

  // Handlers CRUD - Zadania
  const handleSaveTask = (task: Task) => {
    saveTask(task);
    setTasks(getTasks());
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
    setTasks(getTasks());
  };

  // Reset całej bazy do nasion
  const handleResetDatabase = () => {
    resetDatabase();
    localStorage.removeItem('med_crm_logged_in_user_id');
    setCurrentUser(null);
    loadDatabaseData();
    setCurrentPage('dashboard');
    setNavigationParams(null);
  };

  // Renderowanie aktywnego widoku
  const renderActiveView = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <DashboardView
            hospitals={hospitals}
            departments={departments}
            doctors={doctors}
            meetings={meetings}
            tasks={tasks}
            onNavigateToPage={handleNavigateToPage}
            onDeleteMeeting={handleDeleteMeeting}
            onSaveTask={handleSaveTask}
            currentRole={currentRole}
          />
        );

      case 'tasks':
        return (
          <TasksView
            key={`tasks_${navigationParams?._ts || 'static'}`}
            tasks={tasks}
            meetings={meetings}
            hospitals={hospitals}
            departments={departments}
            doctors={doctors}
            onSaveTask={handleSaveTask}
            onDeleteTask={handleDeleteTask}
            onNavigateToMeeting={(meetingId) => handleNavigateToPage('meeting_detail', { id: meetingId })}
            initialShowNewTask={navigationParams?.showNewTask || false}
            currentRole={currentRole}
          />
        );
      
      case 'contacts':
        return (
          <ContactsView
            key={`contacts_${navigationParams?._ts || 'static'}`}
            hospitals={hospitals}
            departments={departments}
            doctors={doctors}
            meetings={meetings}
            tasks={tasks}
            onSaveHospital={handleSaveHospital}
            onDeleteHospital={handleDeleteHospital}
            onSaveDepartment={handleSaveDepartment}
            onDeleteDepartment={handleDeleteDepartment}
            onSaveDoctor={handleSaveDoctor}
            onDeleteDoctor={handleDeleteDoctor}
            onSaveTask={handleSaveTask}
            onDeleteTask={handleDeleteTask}
            onNavigateToMeeting={(meetingId) => handleNavigateToPage('meeting_detail', { id: meetingId })}
            initialSelectedId={navigationParams?.id || null}
            initialType={navigationParams?.type || null}
            initialShowNewDoctor={navigationParams?.showNewDoctor || false}
            initialShowNewHospital={navigationParams?.showNewHospital || false}
            currentRole={currentRole}
          />
        );

      case 'meetings':
        return (
          <MeetingsView
            key={`meetings_${navigationParams?._ts || 'static'}`}
            meetings={meetings}
            hospitals={hospitals}
            departments={departments}
            doctors={doctors}
            onSaveMeeting={handleSaveMeeting}
            onDeleteMeeting={handleDeleteMeeting}
            onNavigateToDetail={(meetingId) => handleNavigateToPage('meeting_detail', { id: meetingId })}
            initialShowNewForm={navigationParams?.showNewForm || false}
            currentRole={currentRole}
          />
        );

      case 'meeting_detail':
        return (
          <MeetingDetailView
            meetingId={navigationParams?.id}
            meetings={meetings}
            hospitals={hospitals}
            departments={departments}
            doctors={doctors}
            tasks={tasks}
            onSaveMeeting={handleSaveMeeting}
            onSaveTask={handleSaveTask}
            onDeleteTask={handleDeleteTask}
            onDeleteMeeting={handleDeleteMeeting}
            onNavigateBack={() => handleNavigateToPage('meetings')}
            currentRole={currentRole}
          />
        );

      case 'calendar':
        return (
          <CalendarView
            meetings={meetings}
            hospitals={hospitals}
            departments={departments}
            doctors={doctors}
            onNavigateToMeeting={(meetingId) => handleNavigateToPage('meeting_detail', { id: meetingId })}
            onDeleteMeeting={handleDeleteMeeting}
            currentRole={currentRole}
          />
        );

      case 'manager_panel':
        return (
          <ManagerView
            meetings={meetings}
            hospitals={hospitals}
            departments={departments}
            doctors={doctors}
            onSaveMeeting={handleSaveMeeting}
            currentRole={currentRole}
          />
        );

      case 'admin_panel':
        return (
          <AdminView
            onSettingsChange={handleSettingsChange}
            currentRole={currentRole}
          />
        );

      case 'settings':
        return (
          <SettingsView
            currentUser={currentUser!}
            currentRole={currentRole}
            onSettingsChange={handleSettingsChange}
            onNavigateBack={() => handleNavigateToPage('dashboard')}
          />
        );

      default:
        return (
          <div className="p-8 text-center">
            <h2 className="text-xl font-bold">Page Under Construction</h2>
            <button onClick={() => setCurrentPage('dashboard')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
              Back to Dashboard
            </button>
          </div>
        );
    }
  };

  if (!currentUser) {
    return <LoginView onLoginSuccess={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 relative">
      
      {/* TOP HEADER BAR */}
      <header className="bg-slate-900 text-white flex items-center justify-between px-4 py-3 border-b border-slate-800 shrink-0 sticky top-0 z-30 shadow-md">
        <button 
          onClick={() => handleNavigateToPage('dashboard')}
          className="flex items-center gap-2.5 text-left hover:opacity-90 transition-opacity focus:outline-none group"
          title="Przejdź do pulpitu"
        >
          <div className="p-1.5 bg-blue-600 rounded-lg text-white group-hover:bg-blue-500 transition-colors shadow-sm">
            <Building2 size={18} />
          </div>
          <div>
            <h1 className="font-display font-bold text-base text-white tracking-tight leading-none">{systemSettings.brandName || "Mac's CRM"}</h1>
            <span className="text-[10px] text-slate-400 font-mono">Medical CRM</span>
          </div>
        </button>

        {/* User Badge & Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => handleNavigateToPage('settings')}
            className={`p-2 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold ${
              currentPage === 'settings' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="Ustawienia systemu i powiadomień"
          >
            <Settings size={18} />
            <span className="hidden sm:inline">Ustawienia</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-slate-800/80 rounded-full border border-slate-700/60 text-xs">
            <div className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-300 flex items-center justify-center font-bold text-[10px] border border-blue-500/30">
              {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
            </div>
            <span className="font-medium text-slate-200 text-xs truncate max-w-[120px]">{currentUser?.name}</span>
            <span className="text-[9px] font-bold text-blue-400 uppercase tracking-wider bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-900/40">
              {currentRole}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="p-1.5 text-slate-400 hover:text-rose-300 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 text-xs"
            title="Wyloguj z systemu"
          >
            <LogOut size={16} />
            <span className="hidden md:inline font-medium text-xs">Wyloguj</span>
          </button>
        </div>
      </header>

      {/* GŁÓWNY OBSZAR ROBOCZY - z padding-bottom na dolne menu */}
      <main className="flex-1 min-w-0 min-h-0 flex flex-col w-full pb-20">
        <div className="flex-1 min-w-0 w-full">
          {renderActiveView()}
        </div>
      </main>

      {/* DOLNA BELKA NAWIGACYJNA (BOTTOM NAV) Z CENTRALNYM (+) */}
      <BottomNav 
        currentPage={currentPage}
        onPageChange={(page, params) => handleNavigateToPage(page, params)}
        currentRole={currentRole}
        currentUser={currentUser}
        onLogout={handleLogout}
        onResetDb={handleResetDatabase}
      />

    </div>
  );
}
