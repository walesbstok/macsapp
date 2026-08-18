import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Bell, 
  User, 
  Shield, 
  Check, 
  Building2, 
  Lock, 
  Smartphone, 
  Mail, 
  Clock, 
  Save, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { CrmUser, UserRole, SystemSettings } from '../types';
import { 
  getSystemSettings, 
  saveSystemSettings, 
  getUsers, 
  saveUser 
} from '../db';
import { 
  isNotificationSupported, 
  getNotificationPermissionStatus, 
  requestNotificationPermission, 
  sendSystemNotification 
} from '../utils/notifications';

interface SettingsViewProps {
  currentUser: CrmUser;
  currentRole: UserRole;
  onSettingsChange: () => void;
  onNavigateBack?: () => void;
}

export default function SettingsView({ 
  currentUser, 
  currentRole, 
  onSettingsChange,
  onNavigateBack 
}: SettingsViewProps) {
  // Powiadomienia
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [reminderMinutes, setReminderMinutes] = useState('15');
  const [permissionStatus, setPermissionStatus] = useState<string>(getNotificationPermissionStatus());

  // Ustawienia systemowe CRM
  const [sysSettings, setSysSettings] = useState<SystemSettings>(() => getSystemSettings());
  const [brandName, setBrandName] = useState(sysSettings.brandName);
  const [newProductTag, setNewProductTag] = useState('');
  const [productsList, setProductsList] = useState<string[]>(sysSettings.productsList || []);

  // Konto użytkownika
  const [userName, setUserName] = useState(currentUser.name);
  const [userEmail, setUserEmail] = useState(currentUser.email);
  const [userPassword, setUserPassword] = useState(currentUser.password || '');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setPermissionStatus(getNotificationPermissionStatus());
  }, []);

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    setPermissionStatus(getNotificationPermissionStatus());
  };

  const handleSendTestNotification = () => {
    sendSystemNotification('Test Mac\'s CRM', {
      body: 'Powiadomienia mobilne i systemowe działają prawidłowo!',
      tag: 'test-settings'
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: CrmUser = {
      ...currentUser,
      name: userName,
      email: userEmail,
      password: userPassword
    };
    saveUser(updatedUser);
    setPasswordSuccess(true);
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  const handleSaveSystemSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SystemSettings = {
      ...sysSettings,
      brandName,
      productsList
    };
    saveSystemSettings(updated);
    setSysSettings(updated);
    onSettingsChange();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAddProduct = () => {
    if (!newProductTag.trim()) return;
    if (!productsList.includes(newProductTag.trim())) {
      setProductsList([...productsList, newProductTag.trim()]);
    }
    setNewProductTag('');
  };

  const handleRemoveProduct = (tag: string) => {
    setProductsList(productsList.filter(p => p !== tag));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fadeIn">
      {/* NAGŁÓWEK WIDOKU */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 shrink-0">
            <SettingsIcon size={24} />
          </div>
          <div>
            <h2 className="font-display font-bold text-2xl text-slate-900 tracking-tight">Ustawienia Systemu & Powiadomień</h2>
            <p className="text-xs text-slate-500 mt-0.5">Zarządzaj powiadomieniami na telefonie, ustawieniami konta oraz konfiguracją CRM.</p>
          </div>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold animate-fadeIn">
            <Check size={16} />
            <span>Zapisano zmiany!</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEWA KOLUMNA: POWIADOMIENIA I PRZYPOMNIENIA */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Bell size={20} className="text-blue-600" />
            <h3 className="font-display font-bold text-lg text-slate-900">Powiadomienia na Telefon i Przeglądarkę</h3>
          </div>

          {/* STAN UPRAWNIEŃ W TELEFONIE */}
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone size={18} className="text-slate-600" />
                <span className="text-xs font-bold text-slate-800">Status powiadomień na urządzeniu</span>
              </div>
              
              {permissionStatus === 'granted' && (
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px] flex items-center gap-1">
                  <Check size={12} /> Aktywne
                </span>
              )}
              {permissionStatus === 'denied' && (
                <span className="px-2.5 py-1 bg-red-100 text-red-800 rounded-full font-bold text-[10px]">
                  Zablokowane
                </span>
              )}
              {(permissionStatus === 'default' || permissionStatus === 'prompt') && (
                <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full font-bold text-[10px]">
                  Wymagają zgody
                </span>
              )}
              {permissionStatus === 'unsupported' && (
                <span className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded-full font-bold text-[10px]">
                  Brak obsługi
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Powiadomienia Push pozwalają otrzymywać przypomnienia o wizytach i pilnych zadaniach bezpośrednio na telefonie (również gdy aplikacja jest w tle).
            </p>

            <div className="pt-2 flex flex-wrap gap-2">
              {permissionStatus !== 'granted' && isNotificationSupported() && (
                <button
                  type="button"
                  onClick={handleRequestPermission}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Bell size={15} />
                  <span>Włącz powiadomienia na telefonie</span>
                </button>
              )}

              {permissionStatus === 'granted' && (
                <button
                  type="button"
                  onClick={handleSendTestNotification}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles size={14} className="text-blue-600" />
                  <span>Wyślij testowe powiadomienie</span>
                </button>
              )}
            </div>
          </div>

          {/* PRZEŁĄCZNIKI */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-800">Wyskakujące powiadomienia Push</p>
                <p className="text-[11px] text-slate-500">Wyświetlaj baner przed nadchodzącą wizytą</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={pushEnabled}
                  onChange={(e) => setPushEnabled(e.target.checked)}
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-800">Powiadomienia e-mail</p>
                <p className="text-[11px] text-slate-500">Wysyłaj poranny raport zadań na adres e-mail</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={emailEnabled}
                  onChange={(e) => setEmailEnabled(e.target.checked)}
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* CZAS PRZYPOMNIENIA */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Clock size={14} className="text-blue-600" />
                <span>Czas przypomnienia przed wizytą</span>
              </label>
              <select
                value={reminderMinutes}
                onChange={(e) => setReminderMinutes(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="15">15 minut przed wizytą</option>
                <option value="30">30 minut przed wizytą</option>
                <option value="60">1 godzina przed wizytą</option>
                <option value="1440">1 dzień przed wizytą</option>
              </select>
            </div>
          </div>
        </div>

        {/* PRAWA KOLUMNA: PROFIL I KONFIGURACJA */}
        <div className="space-y-6">
          
          {/* MOJE KONTO */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <User size={20} className="text-blue-600" />
              <h3 className="font-display font-bold text-lg text-slate-900">Moje Konto Użytkownika</h3>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Imię i Nazwisko</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Adres E-mail</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hasło</label>
                <input
                  type="text"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-400">Rola: <strong className="text-blue-600 uppercase">{currentRole}</strong></span>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Save size={14} />
                  <span>Zapisz profil</span>
                </button>
              </div>

              {passwordSuccess && (
                <p className="text-xs text-emerald-600 font-bold flex items-center gap-1 pt-1">
                  <Check size={14} /> Profil i dane logowania zostały zaktualizowane!
                </p>
              )}
            </form>
          </div>

          {/* KONFIGURACJA CRM (DLA ADMINA / MENEDŻERA) */}
          {(currentRole === 'admin' || currentRole === 'manager') && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <Building2 size={20} className="text-purple-600" />
                <h3 className="font-display font-bold text-lg text-slate-900">Ustawienia Ogólne CRM</h3>
              </div>

              <form onSubmit={handleSaveSystemSettings} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nazwa Systemu / Marka</label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="np. Mac's CRM"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Portfolio Produktów</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newProductTag}
                      onChange={(e) => setNewProductTag(e.target.value)}
                      placeholder="Dodaj nowy produkt..."
                      className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddProduct}
                      className="px-3 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      Dodaj
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {productsList.map(tag => (
                      <span key={tag} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-xs font-semibold">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(tag)}
                          className="hover:text-red-600 text-purple-400 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Save size={14} />
                    <span>Zapisz konfigurację CRM</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
