import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CalendarDays, 
  CheckSquare, 
  Calendar, 
  Plus, 
  X, 
  Stethoscope, 
  Award, 
  Shield, 
  LogOut, 
  RefreshCw, 
  MoreHorizontal,
  CalendarPlus,
  UserPlus,
  Building2,
  Settings
} from 'lucide-react';
import { UserRole, CrmUser } from '../types';

interface BottomNavProps {
  currentPage: string;
  onPageChange: (page: string, params?: any) => void;
  currentRole: UserRole;
  currentUser: CrmUser | null;
  onLogout: () => void;
  onResetDb: () => void;
}

export default function BottomNav({
  currentPage,
  onPageChange,
  currentRole,
  currentUser,
  onLogout,
  onResetDb
}: BottomNavProps) {
  // Stan dla okienka szybkiego dodawania (+)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Stan dla menu "Więcej"
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  // Otwarcie modalnego szybkiego dodawania
  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
    setIsMoreMenuOpen(false);
  };

  // Zamknięcie okna dodawania
  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  // Wybór "Nowa Wizyta"
  const handleSelectVisit = () => {
    handleCloseAddModal();
    onPageChange('meetings', { showNewForm: true, _ts: Date.now() });
  };

  // Wybór "Nowy Lekarz"
  const handleSelectDoctor = () => {
    handleCloseAddModal();
    onPageChange('contacts', { type: 'doctor', showNewDoctor: true, _ts: Date.now() });
  };

  // Wybór "Nowy Szpital"
  const handleSelectHospital = () => {
    handleCloseAddModal();
    onPageChange('contacts', { type: 'hospital', showNewHospital: true, _ts: Date.now() });
  };

  // Wybór "Nowe Zadanie"
  const handleSelectTask = () => {
    handleCloseAddModal();
    onPageChange('tasks', { showNewTask: true, _ts: Date.now() });
  };

  return (
    <>
      {/* ------------------------------------------------------------- */}
      {/* FIXED BOTTOM NAVIGATION BAR - PERFECT 5-COLUMN SYMMETRIC GRID */}
      {/* ------------------------------------------------------------- */}
      <nav 
        id="bottom-nav-bar"
        className="fixed bottom-0 inset-x-0 bg-slate-900 border-t border-slate-800 text-slate-300 z-40 shadow-2xl px-1 py-1 sm:px-4"
      >
        <div className="max-w-md mx-auto grid grid-cols-5 items-center relative">
          
          {/* COL 1: Pulpit */}
          <button
            id="bottom-nav-dashboard"
            onClick={() => onPageChange('dashboard')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl text-xs font-medium transition-colors ${
              currentPage === 'dashboard'
                ? 'text-blue-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard size={20} className={currentPage === 'dashboard' ? 'text-blue-400' : 'text-slate-400'} />
            <span className="text-[10px] mt-0.5">Pulpit</span>
          </button>

          {/* COL 2: Baza (Kontakty & Szpitale) */}
          <button
            id="bottom-nav-contacts"
            onClick={() => onPageChange('contacts')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl text-xs font-medium transition-colors ${
              currentPage === 'contacts'
                ? 'text-blue-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users size={20} className={currentPage === 'contacts' ? 'text-blue-400' : 'text-slate-400'} />
            <span className="text-[10px] mt-0.5">Baza</span>
          </button>

          {/* COL 3: CENTRALNY PRZYCISK PLUS (+) */}
          <div className="flex flex-col items-center justify-center relative -top-3">
            <button
              id="bottom-nav-add-btn"
              onClick={handleOpenAddModal}
              className="w-12 h-12 sm:w-13 sm:h-13 bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full shadow-xl shadow-blue-900/60 border-4 border-slate-900 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 focus:outline-none"
              title="Dodaj nową wizytę lub lekarza"
            >
              <Plus size={26} className="stroke-[2.5]" />
            </button>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight -mt-0.5">Dodaj</span>
          </div>

          {/* COL 4: Kalendarz */}
          <button
            id="bottom-nav-calendar"
            onClick={() => onPageChange('calendar')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl text-xs font-medium transition-colors ${
              currentPage === 'calendar'
                ? 'text-blue-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar size={20} className={currentPage === 'calendar' ? 'text-blue-400' : 'text-slate-400'} />
            <span className="text-[10px] mt-0.5">Kalendarz</span>
          </button>

          {/* COL 5: Więcej (Zadania, Wizyty, Ustawienia itp.) */}
          <button
            id="bottom-nav-more"
            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
            className={`flex flex-col items-center justify-center py-1 rounded-xl text-xs font-medium transition-colors ${
              ['tasks', 'meetings', 'manager_panel', 'admin_panel', 'settings'].includes(currentPage) || isMoreMenuOpen
                ? 'text-blue-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MoreHorizontal size={20} className={['tasks', 'meetings', 'manager_panel', 'admin_panel', 'settings'].includes(currentPage) ? 'text-blue-400' : 'text-slate-400'} />
            <span className="text-[10px] mt-0.5">Więcej</span>
          </button>

        </div>
      </nav>

      {/* ------------------------------------------------------------- */}
      {/* POPUP MENU "WIĘCEJ" (ZADANIA, KALENDARZ, MANAGER, ADMIN, LOGOUT, RESET) */}
      {/* ------------------------------------------------------------- */}
      {isMoreMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-slate-950/60 z-40 animate-fadeIn"
            onClick={() => setIsMoreMenuOpen(false)}
          />
          <div 
            id="more-menu-panel"
            className="fixed bottom-16 right-4 sm:right-12 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 text-slate-300 z-50 space-y-3 animate-slideUp"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Nawigacja i System</span>
              <button onClick={() => setIsMoreMenuOpen(false)} className="text-slate-500 hover:text-slate-300">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-1">
              <button
                id="more-nav-tasks"
                onClick={() => { onPageChange('tasks'); setIsMoreMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  currentPage === 'tasks' ? 'bg-blue-600 text-white font-medium' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <CheckSquare size={18} className="text-blue-400" />
                <span>Zadania & Follow-upy</span>
              </button>

              <button
                id="more-nav-meetings"
                onClick={() => { onPageChange('meetings'); setIsMoreMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  currentPage === 'meetings' ? 'bg-blue-600 text-white font-medium' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <CalendarDays size={18} className="text-emerald-400" />
                <span>Lista Wizyt</span>
              </button>

              <button
                id="more-nav-settings"
                onClick={() => { onPageChange('settings'); setIsMoreMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  currentPage === 'settings' ? 'bg-blue-600 text-white font-medium' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <Settings size={18} className="text-blue-400" />
                <span>Ustawienia & Powiadomienia</span>
              </button>

              {(currentRole === 'manager' || currentRole === 'admin') && (
                <button
                  id="more-nav-manager"
                  onClick={() => { onPageChange('manager_panel'); setIsMoreMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    currentPage === 'manager_panel' ? 'bg-blue-600 text-white font-medium' : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <Award size={18} className="text-amber-400" />
                  <span>Panel Menedżera</span>
                </button>
              )}

              {currentRole === 'admin' && (
                <button
                  id="more-nav-admin"
                  onClick={() => { onPageChange('admin_panel'); setIsMoreMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    currentPage === 'admin_panel' ? 'bg-blue-600 text-white font-medium' : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <Shield size={18} className="text-purple-400" />
                  <span>Panel Administratora</span>
                </button>
              )}
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>Rola: <strong className="text-blue-400 uppercase">{currentRole}</strong></span>
                <span className="text-[10px] text-slate-500">{currentUser?.name}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  id="more-btn-logout"
                  onClick={() => { setIsMoreMenuOpen(false); onLogout(); }}
                  className="flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 border border-rose-900/40 rounded-lg transition-colors"
                >
                  <LogOut size={13} />
                  <span>Wyloguj</span>
                </button>

                <button
                  id="more-btn-reset-db"
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    if (window.confirm('Czy na pewno chcesz zresetować bazę danych do ustawień fabrycznych?')) {
                      onResetDb();
                    }
                  }}
                  className="flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-mono bg-slate-800/40 hover:bg-red-950/40 text-slate-400 hover:text-red-300 border border-slate-700/50 rounded-lg transition-colors"
                >
                  <RefreshCw size={11} />
                  <span>Reset Bazy</span>
                </button>
              </div>
            </div>

          </div>
        </>
      )}

      {/* ------------------------------------------------------------- */}
      {/* OKNO MODALNE SZYBKIEGO DODAWANIA (+) - TYLKO WIZYTA LUB LEKARZ */}
      {/* ------------------------------------------------------------- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div 
            id="quick-add-modal"
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden animate-scaleUp"
          >
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg leading-tight">Co chcesz dodać?</h3>
                <p className="text-xs text-slate-400 mt-0.5">Wybierz nowy wpis do rejestracji</p>
              </div>
              <button
                id="quick-add-close-btn"
                onClick={handleCloseAddModal}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content - WYBORY SZYBKIEGO DODAWANIA */}
            <div className="p-4 sm:p-5 space-y-2.5 max-h-[75vh] overflow-y-auto">
              
              {/* Opcja 1: Wizyta */}
              <button
                id="add-choice-visit"
                onClick={handleSelectVisit}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/50 transition-all group flex items-center gap-3 shadow-xs hover:shadow-md"
              >
                <div className="p-2 bg-blue-600 text-white rounded-xl shrink-0 group-hover:scale-105 transition-transform shadow-md shadow-blue-500/20">
                  <CalendarPlus size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 group-hover:text-blue-700 text-xs sm:text-sm">Nowa Wizyta</h4>
                    <span className="text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Zaplanuj lub zarejestruj raport z wizyty.
                  </p>
                </div>
              </button>

              {/* Opcja 2: Lekarz */}
              <button
                id="add-choice-doctor"
                onClick={handleSelectDoctor}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-teal-500 bg-slate-50 hover:bg-teal-50/50 transition-all group flex items-center gap-3 shadow-xs hover:shadow-md"
              >
                <div className="p-2 bg-teal-600 text-white rounded-xl shrink-0 group-hover:scale-105 transition-transform shadow-md shadow-teal-500/20">
                  <Stethoscope size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 group-hover:text-teal-700 text-xs sm:text-sm">Nowy Lekarz</h4>
                    <span className="text-xs font-semibold text-teal-600 group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Dodaj nowy profil lekarza lub specjalisty.
                  </p>
                </div>
              </button>

              {/* Opcja 3: Szpital / Placówka */}
              <button
                id="add-choice-hospital"
                onClick={handleSelectHospital}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/50 transition-all group flex items-center gap-3 shadow-xs hover:shadow-md"
              >
                <div className="p-2 bg-indigo-600 text-white rounded-xl shrink-0 group-hover:scale-105 transition-transform shadow-md shadow-indigo-500/20">
                  <Building2 size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 group-hover:text-indigo-700 text-xs sm:text-sm">Nowa Placówka / Szpital</h4>
                    <span className="text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Dodaj nowy szpital lub placówkę medyczną.
                  </p>
                </div>
              </button>

              {/* Opcja 4: Zadanie / Follow-Up */}
              <button
                id="add-choice-task"
                onClick={handleSelectTask}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-amber-500 bg-slate-50 hover:bg-amber-50/50 transition-all group flex items-center gap-3 shadow-xs hover:shadow-md"
              >
                <div className="p-2 bg-amber-600 text-white rounded-xl shrink-0 group-hover:scale-105 transition-transform shadow-md shadow-amber-500/20">
                  <CheckSquare size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 group-hover:text-amber-700 text-xs sm:text-sm">Nowe Zadanie / Follow-Up</h4>
                    <span className="text-xs font-semibold text-amber-600 group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Utwórz nowe zadanie lub powiadomienie.
                  </p>
                </div>
              </button>

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-slate-100 p-2.5 text-center">
              <button
                id="quick-add-cancel-btn"
                onClick={handleCloseAddModal}
                className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors py-1 px-3"
              >
                Anuluj
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

