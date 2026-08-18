import React, { useState } from 'react';
import { 
  CalendarDays, 
  Search, 
  Building2, 
  Users, 
  Plus, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  X,
  FileText,
  UserPlus,
  Trash2,
  Layers
} from 'lucide-react';
import { Hospital, Department, Doctor, Meeting, UserRole, MeetingType, PRESET_PRODUCTS } from '../types';
import { getMeetingStatus } from '../db';

interface MeetingsViewProps {
  key?: React.Key;
  meetings: Meeting[];
  hospitals: Hospital[];
  departments: Department[];
  doctors: Doctor[];
  onSaveMeeting: (meeting: Meeting) => void;
  onDeleteMeeting?: (id: string) => void;
  onNavigateToDetail: (meetingId: string) => void;
  initialShowNewForm?: boolean;
  currentRole: UserRole;
}

export default function MeetingsView({
  meetings,
  hospitals,
  departments,
  doctors,
  onSaveMeeting,
  onDeleteMeeting,
  onNavigateToDetail,
  initialShowNewForm = false,
  currentRole
}: MeetingsViewProps) {

  // Zakładki: 'planned' | 'past'
  const [activeTab, setActiveTab] = useState<'planned' | 'past'>('planned');
  const [showNewForm, setShowNewForm] = useState(initialShowNewForm);

  React.useEffect(() => {
    if (initialShowNewForm) {
      setShowNewForm(true);
      setActiveTab('planned');
    }
  }, [initialShowNewForm]);

  // Wyszukiwanie na liście spotkań
  const [listSearchQuery, setListSearchQuery] = useState('');

  // Stan szybkiej edycji terminu (daty i godziny) spotkania
  const [editingDateTimeMeeting, setEditingDateTimeMeeting] = useState<Meeting | null>(null);
  const [editDateValue, setEditDateValue] = useState('');
  const [editTimeValue, setEditTimeValue] = useState('10:00');

  const handleOpenEditDateTime = (meet: Meeting, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingDateTimeMeeting(meet);
    const d = new Date(meet.meeting_date);
    if (!isNaN(d.getTime())) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      setEditDateValue(`${year}-${month}-${day}`);
      setEditTimeValue(`${hours}:${minutes}`);
    } else {
      setEditDateValue('');
      setEditTimeValue('10:00');
    }
  };

  const handleSaveDateTime = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDateTimeMeeting || !editDateValue) return;

    const datetimeStr = `${editDateValue}T${editTimeValue || '10:00'}:00`;
    const newDateIso = new Date(datetimeStr).toISOString();

    const updated: Meeting = {
      ...editingDateTimeMeeting,
      meeting_date: newDateIso,
      updated_at: new Date().toISOString()
    };

    onSaveMeeting(updated);
    setEditingDateTimeMeeting(null);
  };

  // Stan formularza nowego spotkania
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('10:00');
  const [formMeetingType, setFormMeetingType] = useState<MeetingType>('REGULAR');
  const [formNotes, setFormNotes] = useState('');

  // Filtrowanie po rodzaju spotkania
  const [filterMeetingType, setFilterMeetingType] = useState<string>('ALL');

  // Autocomplete szpitala
  const [hospitalSearch, setHospitalSearch] = useState('');
  const [selectedHospitalId, setSelectedHospitalId] = useState('');
  const [showHospDropdown, setShowHospDropdown] = useState(false);

  // Autocomplete lekarza (Szybki wybór lekarza i autouzupełnianie placówki)
  const [doctorSearchQuery, setDoctorSearchQuery] = useState('');
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);

  // Wybór oddziału, lekarzy oraz produktów
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [selectedDoctorIds, setSelectedDoctorIds] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Pomocnicze wyszukiwanie dla Autocomplete Szpitala
  const filteredHospitalsAutocomplete = hospitals.filter(h => 
    h.name.toLowerCase().includes(hospitalSearch.toLowerCase()) ||
    h.city.toLowerCase().includes(hospitalSearch.toLowerCase()) ||
    h.address.toLowerCase().includes(hospitalSearch.toLowerCase())
  );

  // Wyszukiwanie lekarza w całej bazie
  const filteredDoctorsAutocomplete = doctorSearchQuery.trim().length > 0
    ? doctors.filter(doc => {
        const query = doctorSearchQuery.toLowerCase().trim();
        const fullStr = `${doc.title || ''} ${doc.first_name} ${doc.last_name} ${doc.specialization || ''}`.toLowerCase();
        return fullStr.includes(query);
      })
    : [];

  const handleSelectDoctorAutocomplete = (doc: Doctor) => {
    // 1. Zaznacz lekarza
    setSelectedDoctorIds([doc.id]);

    // 2. Automatycznie przypisz szpital i ustaw ciąg tekstowy wyszukiwarki szpitali
    setSelectedHospitalId(doc.hospital_id);
    const hosp = hospitals.find(h => h.id === doc.hospital_id);
    if (hosp) {
      setHospitalSearch(`${hosp.city} - ${hosp.name}`);
    }

    // 3. Automatycznie przypisz oddział
    if (doc.department_id) {
      setSelectedDeptId(doc.department_id);
    } else {
      setSelectedDeptId('');
    }

    // 4. Ustaw nagłówek wyszukiwania lekarza i zamknij listę
    setDoctorSearchQuery(`${doc.title ? doc.title + ' ' : ''}${doc.first_name} ${doc.last_name}`);
    setShowDoctorDropdown(false);
  };

  const handleClearDoctorSelection = () => {
    setDoctorSearchQuery('');
    setSelectedDoctorIds([]);
  };

  // Filtrowane oddziały (tylko dla wybranego szpitala)
  const availableDepts = selectedHospitalId 
    ? departments.filter(d => d.hospital_id === selectedHospitalId)
    : [];

  // Filtrowani lekarze (tylko dla wybranego szpitala, opcjonalnie wybranego oddziału)
  const availableDoctors = selectedHospitalId
    ? doctors.filter(doc => {
        const matchesHosp = doc.hospital_id === selectedHospitalId;
        const matchesDept = !selectedDeptId || doc.department_id === selectedDeptId;
        return matchesHosp && matchesDept;
      })
    : [];

  const handleSelectHospital = (hosp: Hospital) => {
    setSelectedHospitalId(hosp.id);
    setHospitalSearch(`${hosp.city} - ${hosp.name}`);
    setShowHospDropdown(false);
    
    // Auto-resetuj oddział i lekarza przy zmianie szpitala
    setSelectedDeptId('');
    setSelectedDoctorIds([]);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('Meeting title is required!');
      return;
    }
    if (!formDate) {
      alert('Meeting date is required!');
      return;
    }
    if (!selectedHospitalId) {
      alert('You must select a hospital from the autocomplete list!');
      return;
    }

    // Łączenie daty i godziny w jeden ISO String
    const datetimeStr = `${formDate}T${formTime || '12:00'}:00`;
    const meetingDateTime = new Date(datetimeStr).toISOString();

    const newMeeting: Meeting = {
      id: `meet_${Date.now()}`,
      title: formTitle,
      meeting_date: meetingDateTime,
      hospital_id: selectedHospitalId,
      department_id: selectedDeptId || null,
      doctor_id: selectedDoctorIds[0] || null,
      doctor_ids: selectedDoctorIds,
      product_tags: selectedProducts,
      content_markdown: formNotes,
      meeting_type: formMeetingType,
      closed_at: null, // Nowo planowane jest zawsze otwarte
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    onSaveMeeting(newMeeting);
    
    // Resetuj formularz
    setFormTitle('');
    setFormDate('');
    setFormTime('10:00');
    setFormMeetingType('REGULAR');
    setFormNotes('');
    setHospitalSearch('');
    setSelectedHospitalId('');
    setSelectedDeptId('');
    setSelectedDoctorIds([]);
    setSelectedProducts([]);
    setDoctorSearchQuery('');
    setShowDoctorDropdown(false);
    
    setShowNewForm(false);
    setActiveTab('planned');
  };

  // Kwalifikacja spotkań do zakładek
  const categorizedMeetings = meetings.map(m => ({
    ...m,
    status: getMeetingStatus(m)
  }));

  const plannedMeetings = categorizedMeetings.filter(m => m.status !== 'closed');
  const pastMeetings = categorizedMeetings.filter(m => m.status === 'closed');

  // Helper to get Department Name
  const getDepartmentName = (meet: Meeting) => {
    if (meet.department_id) {
      const dept = departments.find(d => d.id === meet.department_id);
      if (dept) return dept.name;
    }
    const docIds = meet.doctor_ids && meet.doctor_ids.length > 0 
      ? meet.doctor_ids 
      : meet.doctor_id 
        ? [meet.doctor_id] 
        : [];
    if (docIds.length > 0) {
      const doc = doctors.find(d => d.id === docIds[0]);
      if (doc?.department_id) {
        const dept = departments.find(d => d.id === doc.department_id);
        if (dept) return dept.name;
      }
    }
    return null;
  };

  // Filtrowanie tekstowe na danej zakładce
  const getFilteredMeetingsForTab = (tabList: typeof categorizedMeetings) => {
    return tabList.filter(m => {
      const hosp = hospitals.find(h => h.id === m.hospital_id);
      const hospName = hosp ? hosp.name : '';
      const deptName = getDepartmentName(m) || '';
      
      // Get all doctors names for search
      const docIds = m.doctor_ids && m.doctor_ids.length > 0 
        ? m.doctor_ids 
        : m.doctor_id 
          ? [m.doctor_id] 
          : [];
      const doctorsNames = docIds.map(id => {
        const doc = doctors.find(d => d.id === id);
        return doc ? `${doc.title} ${doc.first_name} ${doc.last_name}`.toLowerCase() : '';
      }).join(' ');

      const matchesDoctor = doctorsNames.includes(listSearchQuery.toLowerCase());
      const matchesDept = deptName.toLowerCase().includes(listSearchQuery.toLowerCase());

      const productMatches = m.product_tags && m.product_tags.some(tag => 
        tag.toLowerCase().includes(listSearchQuery.toLowerCase())
      );
      
      const matchesSearch = (
        m.title.toLowerCase().includes(listSearchQuery.toLowerCase()) ||
        hospName.toLowerCase().includes(listSearchQuery.toLowerCase()) ||
        matchesDept ||
        matchesDoctor ||
        productMatches
      );

      const mType = m.meeting_type || 'REGULAR';
      const matchesType = filterMeetingType === 'ALL' || mType === filterMeetingType;

      return matchesSearch && matchesType;
    });
  };

  const visiblePlanned = getFilteredMeetingsForTab(plannedMeetings);
  const visiblePast = getFilteredMeetingsForTab(pastMeetings);

  // Formaty i kolory statusów
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <span className="bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1"><Clock size={12} /> Scheduled</span>;
      case 'to_close':
        return <span className="bg-red-100 text-red-800 border border-red-200 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1"><AlertTriangle size={12} /> To close</span>;
      case 'overdue':
        return <span className="bg-red-950 text-red-200 border border-red-900 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1"><AlertTriangle size={12} /> Overdue (&gt;24h)</span>;
      case 'closed':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1"><CheckCircle size={12} /> Closed</span>;
      default:
        return null;
    }
  };

  const getMeetingTypeBadge = (type?: MeetingType) => {
    const t = type || 'REGULAR';
    switch (t) {
      case 'REGULAR':
        return <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">💼 REGULAR</span>;
      case 'PRESENTATION':
        return <span className="bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">📊 PRESENTATION</span>;
      case 'OPERATING DAY':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">🏥 OPERATING DAY</span>;
      case 'PHONE_CALL':
        return <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">📞 PHONE CALL</span>;
      default:
        return null;
    }
  };

  const getHospitalName = (id: string) => hospitals.find(h => h.id === id)?.name || 'Nieznany szpital';
  const getDoctorLabel = (id: string | null) => {
    if (!id) return 'No assigned doctor';
    const doc = doctors.find(d => d.id === id);
    return doc ? `${doc.title} ${doc.first_name} ${doc.last_name}` : 'Unknown doctor';
  };

  const getDoctorsLabel = (meet: Meeting) => {
    const docIds = meet.doctor_ids && meet.doctor_ids.length > 0 
      ? meet.doctor_ids 
      : meet.doctor_id 
        ? [meet.doctor_id] 
        : [];
        
    if (docIds.length === 0) return 'No assigned doctor';
    
    return docIds.map(id => {
      const doc = doctors.find(d => d.id === id);
      return doc ? `${doc.title} ${doc.first_name} ${doc.last_name}`.trim() : 'Unknown doctor';
    }).join(', ');
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
    <div className="animate-fade-in p-3 sm:p-6 space-y-6 max-w-7xl mx-auto w-full min-w-0">
      
      {/* NAGŁÓWEK */}
      {!showNewForm && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-3xl text-slate-900 tracking-tight">Visits and Meetings</h2>
            <p className="text-slate-500 mt-1">Planning sales meetings, logging discussions, and managing follow-up tasks.</p>
          </div>
          <button
            id="btn-trigger-new-meeting"
            onClick={() => setShowNewForm(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-sm shadow-blue-500/10 transition-all text-sm self-start sm:self-center"
          >
            <Plus size={18} />
            <span>Plan meeting</span>
          </button>
        </div>
      )}

      {/* ----------------- FORMULARZ PLANOWANIA SPOTKANIA ----------------- */}
      {showNewForm && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto overflow-hidden animate-fade-in">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
              <CalendarDays size={20} className="text-blue-600" />
              Plan a New Medical Meeting
            </h3>
            <button
              onClick={() => setShowNewForm(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="p-6 space-y-5 text-sm">
            
            {/* Tytuł wizyty */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Meeting Title / Objective *</label>
              <input
                id="form-meet-title"
                type="text"
                required
                placeholder="e.g., Presentation of new drug-eluting stents"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            {/* Data i Godzina */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Meeting Date *</label>
                <input
                  id="form-meet-date"
                  type="date"
                  required
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Meeting Time *</label>
                <input
                  id="form-meet-time"
                  type="time"
                  required
                  value={formTime}
                  onChange={(e) => setFormTime(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-mono"
                />
              </div>
            </div>

            {/* Rodzaj spotkania (Meeting Type) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Meeting Type (Rodzaj spotkania) *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  type="button"
                  id="btn-meet-type-regular"
                  onClick={() => setFormMeetingType('REGULAR')}
                  className={`py-2.5 px-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-0.5 font-semibold ${
                    formMeetingType === 'REGULAR'
                      ? 'bg-indigo-50 border-indigo-400 text-indigo-700 ring-2 ring-indigo-500/10'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <span className="text-xs">💼 REGULAR</span>
                  <span className="text-[10px] opacity-70 font-normal">Standard visit</span>
                </button>

                <button
                  type="button"
                  id="btn-meet-type-presentation"
                  onClick={() => setFormMeetingType('PRESENTATION')}
                  className={`py-2.5 px-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-0.5 font-semibold ${
                    formMeetingType === 'PRESENTATION'
                      ? 'bg-purple-50 border-purple-400 text-purple-700 ring-2 ring-purple-500/10'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <span className="text-xs">📊 PRESENTATION</span>
                  <span className="text-[10px] opacity-70 font-normal">Product presentation</span>
                </button>

                <button
                  type="button"
                  id="btn-meet-type-operating-day"
                  onClick={() => setFormMeetingType('OPERATING DAY')}
                  className={`py-2.5 px-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-0.5 font-semibold ${
                    formMeetingType === 'OPERATING DAY'
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-700 ring-2 ring-emerald-500/10'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <span className="text-xs">🏥 OPERATING DAY</span>
                  <span className="text-[10px] opacity-70 font-normal">Practical demos / OR</span>
                </button>

                <button
                  type="button"
                  id="btn-meet-type-phone-call"
                  onClick={() => setFormMeetingType('PHONE_CALL')}
                  className={`py-2.5 px-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-0.5 font-semibold ${
                    formMeetingType === 'PHONE_CALL'
                      ? 'bg-amber-50 border-amber-400 text-amber-800 ring-2 ring-amber-500/10'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <span className="text-xs">📞 PHONE CALL</span>
                  <span className="text-[10px] opacity-70 font-normal">Phone call visit</span>
                </button>
              </div>
            </div>

            {/* Szybkie wyszukiwanie Lekarza (Szybki wybór lekarza i autouzupełnianie) */}
            <div className="space-y-1.5 relative bg-blue-50/60 p-3.5 rounded-xl border border-blue-100">
              <label className="text-xs font-bold text-blue-900 block uppercase tracking-wider flex items-center justify-between">
                <span>👨‍⚕️ Quick Doctor Selection (Auto-fills hospital & department)</span>
                <span className="text-[10px] font-normal text-blue-600">Quick search</span>
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400" size={16} />
                <input
                  id="form-meet-doc-search"
                  type="text"
                  placeholder="Type doctor's name, surname or specialization..."
                  value={doctorSearchQuery}
                  onChange={(e) => {
                    setDoctorSearchQuery(e.target.value);
                    setShowDoctorDropdown(true);
                  }}
                  onFocus={() => setShowDoctorDropdown(true)}
                  className="w-full pl-11 pr-8 py-2.5 bg-white border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800 shadow-2xs"
                />
                {doctorSearchQuery && (
                  <button
                    type="button"
                    onClick={handleClearDoctorSelection}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Dropdown autouzupełniania lekarza */}
              {showDoctorDropdown && doctorSearchQuery.trim().length > 0 && (
                <div className="absolute z-40 left-3.5 right-3.5 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-56 overflow-y-auto divide-y divide-slate-100">
                  {filteredDoctorsAutocomplete.length === 0 ? (
                    <div className="p-3 text-xs text-slate-500 italic">No doctor found matching "{doctorSearchQuery}"</div>
                  ) : (
                    filteredDoctorsAutocomplete.map(doc => {
                      const hosp = hospitals.find(h => h.id === doc.hospital_id);
                      const dept = departments.find(d => d.id === doc.department_id);
                      return (
                        <button
                          type="button"
                          key={doc.id}
                          onClick={() => handleSelectDoctorAutocomplete(doc)}
                          className="w-full text-left px-4 py-2.5 hover:bg-blue-50/80 transition-colors text-xs flex flex-col gap-0.5 group"
                        >
                          <div className="font-bold text-slate-900 group-hover:text-blue-700 flex items-center justify-between">
                            <span>{doc.title} {doc.first_name} {doc.last_name}</span>
                            {doc.specialization && (
                              <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-semibold">{doc.specialization}</span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1">
                            <span>🏥 {hosp ? `${hosp.city} - ${hosp.name}` : 'No hospital'}</span>
                            {dept && <span className="text-slate-400">• {dept.name}</span>}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              )}

              {/* Informacja o wybranym lekarzu */}
              {selectedDoctorIds.length > 0 && (
                <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                  <div className="flex items-start sm:items-center gap-1.5 min-w-0">
                    <CheckCircle size={14} className="text-emerald-600 shrink-0 mt-0.5 sm:mt-0" />
                    <span className="break-words whitespace-normal leading-tight">
                      Auto-assigned: {
                        selectedDoctorIds.map(id => {
                          const d = doctors.find(doc => doc.id === id);
                          return d ? `${d.title} ${d.first_name} ${d.last_name}` : '';
                        }).filter(Boolean).join(', ')
                      }
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearDoctorSelection}
                    className="text-[10px] underline text-emerald-800 hover:text-emerald-950 shrink-0 self-end sm:self-auto"
                  >
                    Change / Clear
                  </button>
                </div>
              )}
            </div>

            {/* Szpital AUTOCOMPLETE */}
            <div className="space-y-1.5 relative">
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Hospital / Facility (Autocomplete search) *</label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  id="form-meet-hosp-search"
                  type="text"
                  placeholder="Type city or hospital name..."
                  value={hospitalSearch}
                  onChange={(e) => {
                    setHospitalSearch(e.target.value);
                    setSelectedHospitalId(''); // resetuj wybór dopóki nie kliknie
                    setShowHospDropdown(true);
                  }}
                  onFocus={() => setShowHospDropdown(true)}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium text-slate-800"
                />
              </div>

              {/* Dropdown overlay */}
              {showHospDropdown && hospitalSearch && (
                <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto divide-y divide-slate-100">
                  {filteredHospitalsAutocomplete.length === 0 ? (
                    <div className="p-3 text-xs text-slate-500 italic">No search results found</div>
                  ) : (
                    filteredHospitalsAutocomplete.map(h => (
                      <button
                        type="button"
                        key={h.id}
                        onClick={() => handleSelectHospital(h)}
                        className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-xs text-slate-800 font-semibold flex items-center justify-between"
                      >
                        <span>{h.name}</span>
                        <span className="bg-slate-100 text-slate-500 text-[10px] px-1.5 py-0.5 rounded font-mono">{h.city}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
              {selectedHospitalId && (
                <span className="text-[11px] text-emerald-600 font-semibold block mt-1">✓ Selected: {getHospitalName(selectedHospitalId)}</span>
              )}
            </div>

            {/* Oddział (filtrowany) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Hospital Department (optional)</label>
              <select
                id="form-meet-dept"
                value={selectedDeptId}
                onChange={(e) => {
                  setSelectedDeptId(e.target.value);
                  setSelectedDoctorIds([]); // resetuj lekarza przy zmianie oddziału
                }}
                disabled={!selectedHospitalId}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all disabled:opacity-50"
              >
                <option value="">-- Select department (All) --</option>
                {availableDepts.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.type === 'zabiegowy' ? 'Surgical' : d.type === 'zachowawczy' ? 'Conservative' : 'Diagnostic'})</option>
                ))}
              </select>
            </div>

            {/* Lekarze (filtrowani - wybór wielu) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Doctors / Contacts (optional - select one or more)</label>
              {!selectedHospitalId ? (
                <div className="text-xs text-slate-400 italic bg-slate-50 border border-slate-200 rounded-xl p-3">
                  Select a hospital first to see available doctors.
                </div>
              ) : availableDoctors.length === 0 ? (
                <div className="text-xs text-slate-400 italic bg-slate-50 border border-slate-200 rounded-xl p-3">
                  No doctors registered in this hospital.
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 max-h-40 overflow-y-auto">
                  {availableDoctors.map(doc => {
                    const isChecked = selectedDoctorIds.includes(doc.id);
                    return (
                      <label key={doc.id} className="flex items-center gap-2.5 p-1.5 hover:bg-white rounded-lg cursor-pointer transition-colors text-xs font-medium text-slate-700">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setSelectedDoctorIds(selectedDoctorIds.filter(id => id !== doc.id));
                            } else {
                              setSelectedDoctorIds([...selectedDoctorIds, doc.id]);
                              // Auto-select department if not set
                              if (!selectedDeptId && doc.department_id) {
                                setSelectedDeptId(doc.department_id);
                              }
                            }
                          }}
                          className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 border-slate-300"
                        />
                        <span>{doc.title} {doc.first_name} {doc.last_name} <span className="text-slate-400 font-normal">({doc.specialization})</span></span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Otagowanie produktami */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Discussed Products (Tagi produktów)</label>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto font-medium">
                {PRESET_PRODUCTS.map(product => {
                  const isChecked = selectedProducts.includes(product);
                  return (
                    <label key={product} className="flex items-start gap-2.5 p-1.5 hover:bg-white rounded-lg cursor-pointer transition-colors text-xs font-medium text-slate-700">
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
                        className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 mt-0.5 border-slate-300"
                      />
                      <span className="leading-tight">{product}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Wstępna Notatka / Przygotowanie */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Preparation Notes / Agenda (optional)</label>
              <textarea
                id="form-meet-notes"
                rows={3}
                placeholder="What do you want to discuss? What materials to prepare? Enter pre-meeting plans here..."
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowNewForm(false)}
                className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl font-semibold text-xs text-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                id="btn-save-meeting-submit"
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs transition-colors shadow-sm shadow-blue-500/10"
              >
                Plan meeting
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ----------------- WIDOK: LISTY SPOTKAŃ Z TABAMI ----------------- */}
      {!showNewForm && (
        <div className="space-y-5">
          
          {/* TABY NAWIGACYJNE I SZUKAJ */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex p-1 bg-slate-100 rounded-xl w-full md:w-auto">
              <button
                id="tab-meetings-planned"
                onClick={() => setActiveTab('planned')}
                className={`flex-1 md:flex-initial px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'planned' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Scheduled Meetings</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  activeTab === 'planned' ? 'bg-slate-200 text-slate-800' : 'bg-slate-200/50 text-slate-500'
                }`}>
                  {plannedMeetings.length}
                </span>
              </button>

              <button
                id="tab-meetings-past"
                onClick={() => setActiveTab('past')}
                className={`flex-1 md:flex-initial px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'past' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Past Visits</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  activeTab === 'past' ? 'bg-slate-200 text-slate-800' : 'bg-slate-200/50 text-slate-500'
                }`}>
                  {pastMeetings.length}
                </span>
              </button>
            </div>

            {/* Filtry po prawej stronie */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <select
                id="filter-meeting-type-select"
                value={filterMeetingType}
                onChange={(e) => setFilterMeetingType(e.target.value)}
                className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700 cursor-pointer"
              >
                <option value="ALL">🔍 All Types</option>
                <option value="REGULAR">💼 REGULAR</option>
                <option value="PRESENTATION">📊 PRESENTATION</option>
                <option value="OPERATING DAY">🏥 OPERATING DAY</option>
                <option value="PHONE_CALL">📞 TELEFONICZNA</option>
              </select>

              {/* Szukajka lokalna */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  id="meeting-list-search"
                  type="text"
                  placeholder="Search by title, doctor, hospital..."
                  value={listSearchQuery}
                  onChange={(e) => setListSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>
          </div>

          {/* LISTA WŁAŚCIWA */}
          <div>
            {activeTab === 'planned' ? (
              // ZAKŁADKA PLANOWANE
              visiblePlanned.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-4">
                    <CalendarDays size={28} />
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-800">No scheduled meetings</h3>
                  <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">Your schedule is empty! Plan your next client visit to build lasting relationships.</p>
                  <button
                    onClick={() => setShowNewForm(true)}
                    className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs transition-colors"
                  >
                    <Plus size={14} />
                    <span>Add new meeting</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {visiblePlanned.map(meet => {
                    const isOverdue = meet.status === 'overdue';
                    const isToClose = meet.status === 'to_close';
                    return (
                      <div
                        key={meet.id}
                        onClick={() => onNavigateToDetail(meet.id)}
                        className={`bg-white border p-5 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between ${
                          isOverdue ? 'border-red-600/60 bg-red-50/10' : isToClose ? 'border-amber-500/60' : 'border-slate-200 hover:border-blue-200'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center gap-2">
                            {getStatusBadge(meet.status)}
                            {getMeetingTypeBadge(meet.meeting_type)}
                            {meet.approval_status && (
                              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                                meet.approval_status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : meet.approval_status === 'rejected'
                                    ? 'bg-red-100 text-red-800 border border-red-200'
                                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                              }`}>
                                {meet.approval_status}
                              </span>
                            )}
                            <span className="text-xs font-mono text-slate-400 ml-auto">{formatDate(meet.meeting_date)}</span>
                          </div>

                          <h4 className="font-bold text-slate-900 text-base break-words whitespace-normal leading-snug">
                            {meet.title}
                          </h4>

                          <div className="space-y-1.5 text-xs text-slate-600 font-medium">
                            <p className="flex items-start gap-1.5 min-w-0">
                              <Building2 size={13} className="text-slate-400 shrink-0 mt-0.5" />
                              <span className="break-words whitespace-normal leading-snug">{getHospitalName(meet.hospital_id)}</span>
                            </p>
                            {getDepartmentName(meet) && (
                              <p className="flex items-start gap-1.5 min-w-0">
                                <Layers size={13} className="text-slate-400 shrink-0 mt-0.5" />
                                <span className="break-words whitespace-normal leading-snug text-slate-700 font-medium">Oddział: {getDepartmentName(meet)}</span>
                              </p>
                            )}
                            <p className="flex items-start gap-1.5 min-w-0">
                              <Users size={13} className="text-slate-400 shrink-0 mt-0.5" />
                              <span className="break-words whitespace-normal leading-snug">{getDoctorsLabel(meet)}</span>
                            </p>
                          </div>

                          {meet.product_tags && meet.product_tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {meet.product_tags.map(tag => (
                                <span key={tag} className="bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                                  📦 {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {meet.content_markdown && (
                            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-500 italic line-clamp-2">
                              "{meet.content_markdown}"
                            </div>
                          )}
                        </div>

                        <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                          <span className="text-blue-600 flex items-center gap-1">
                            {isOverdue || isToClose ? 'Complete and close visit' : 'View details'}
                            <ChevronRight size={16} />
                          </span>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => handleOpenEditDateTime(meet, e)}
                              className="px-2.5 py-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-semibold border border-slate-200 hover:border-blue-200"
                              title="Zmień datę i czas spotkania"
                            >
                              <Clock size={13} />
                              <span>Zmień termin</span>
                            </button>

                            {onDeleteMeeting && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (window.confirm(`Czy na pewno chcesz usunąć wizytę: "${meet.title}"?`)) {
                                    onDeleteMeeting(meet.id);
                                  }
                                }}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Usuń wizytę"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              // ZAKŁADKA MINIONE
              visiblePast.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-4">
                    <FileText size={28} />
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-800 font-display">No closed visits</h3>
                  <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">All past meetings will remain under the "Scheduled" tab until they are closed with a report note.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {visiblePast.map(meet => (
                    <div
                      key={meet.id}
                      onClick={() => onNavigateToDetail(meet.id)}
                      className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          {getStatusBadge(meet.status)}
                          {getMeetingTypeBadge(meet.meeting_type)}
                          {meet.approval_status && (
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                              meet.approval_status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : meet.approval_status === 'rejected'
                                  ? 'bg-red-100 text-red-800 border border-red-200'
                                  : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}>
                              {meet.approval_status}
                            </span>
                          )}
                          <span className="text-xs text-slate-400 font-mono ml-auto">
                            Completed: {meet.closed_at ? new Date(meet.closed_at).toLocaleDateString('en-US') : ''}
                          </span>
                        </div>

                        <h4 className="font-bold text-slate-900 text-base break-words whitespace-normal leading-snug">
                          {meet.title}
                        </h4>

                        <div className="space-y-1.5 text-xs text-slate-600 font-medium">
                          <p className="flex items-start gap-1.5 min-w-0">
                            <Building2 size={13} className="text-slate-400 shrink-0 mt-0.5" />
                            <span className="break-words whitespace-normal leading-snug">{getHospitalName(meet.hospital_id)}</span>
                          </p>
                          {getDepartmentName(meet) && (
                            <p className="flex items-start gap-1.5 min-w-0">
                              <Layers size={13} className="text-slate-400 shrink-0 mt-0.5" />
                              <span className="break-words whitespace-normal leading-snug text-slate-700 font-medium">Oddział: {getDepartmentName(meet)}</span>
                            </p>
                          )}
                          <p className="flex items-start gap-1.5 min-w-0">
                            <Users size={13} className="text-slate-400 shrink-0 mt-0.5" />
                            <span className="break-words whitespace-normal leading-snug">{getDoctorsLabel(meet)}</span>
                          </p>
                        </div>

                        {meet.product_tags && meet.product_tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 my-1.5">
                            {meet.product_tags.map(tag => (
                              <span key={tag} className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                                📦 {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="p-3 bg-emerald-50/30 border border-emerald-100/50 rounded-xl text-xs text-slate-600 italic line-clamp-3">
                          "{meet.content_markdown || 'No notes provided.'}"
                        </div>
                      </div>

                      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400">
                        <span>Visit: {new Date(meet.meeting_date).toLocaleDateString('en-US')}</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => handleOpenEditDateTime(meet, e)}
                            className="px-2.5 py-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-semibold border border-slate-200 hover:border-blue-200"
                            title="Zmień datę i czas spotkania"
                          >
                            <Clock size={13} />
                            <span>Zmień termin</span>
                          </button>
                          <span className="text-blue-600 flex items-center hover:underline">Szczegóły raportu <ChevronRight size={14} /></span>
                          {onDeleteMeeting && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`Czy na pewno chcesz usunąć wizytę: "${meet.title}"?`)) {
                                  onDeleteMeeting(meet.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Usuń wizytę"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>

        </div>
      )}

      {/* MODAL ZMIANY DATY I GODZINY */}
      {editingDateTimeMeeting && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                <Clock size={18} className="text-blue-600" />
                Zmień datę i czas spotkania
              </h3>
              <button
                onClick={() => setEditingDateTimeMeeting(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveDateTime} className="p-6 space-y-4 text-sm">
              <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl space-y-1">
                <p className="font-bold text-slate-900 text-sm break-words whitespace-normal leading-snug">{editingDateTimeMeeting.title}</p>
                <p className="text-xs text-slate-600 font-medium break-words whitespace-normal leading-tight">{getHospitalName(editingDateTimeMeeting.hospital_id)}</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Nowa data spotkania *</label>
                <input
                  type="date"
                  required
                  value={editDateValue}
                  onChange={(e) => setEditDateValue(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-mono text-xs font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Nowa godzina spotkania *</label>
                <input
                  type="time"
                  required
                  value={editTimeValue}
                  onChange={(e) => setEditTimeValue(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-mono text-xs font-semibold"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingDateTimeMeeting(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-bold text-xs"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-sm"
                >
                  Zapisz nowy termin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
