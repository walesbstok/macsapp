import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  FileText, 
  Plus, 
  ChevronLeft, 
  Edit, 
  Trash2, 
  Eye, 
  Grid, 
  Users, 
  CalendarDays,
  PlusCircle,
  X,
  Stethoscope,
  ChevronDown,
  ChevronRight,
  Check,
  Download,
  FileSpreadsheet,
  CheckSquare,
  Square,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Layers
} from 'lucide-react';
import { Hospital, Department, Doctor, Meeting, PipelineStatus, DepartmentType, UserRole, Task } from '../types';
import FollowUpPromptModal from './FollowUpPromptModal';

export const VOIVODESHIPS = [
  'Dolnośląskie',
  'Kujawsko-Pomorskie',
  'Lubelskie',
  'Lubuskie',
  'Łódzkie',
  'Małopolskie',
  'Mazowieckie',
  'Opolskie',
  'Podkarpackie',
  'Podlaskie',
  'Pomorskie',
  'Śląskie',
  'Świętokrzyskie',
  'Warmińsko-Mazurskie',
  'Wielkopolskie',
  'Zachodniopomorskie'
];

export const CITY_TO_VOIVODESHIP: Record<string, string> = {
  'bełżyce': 'Lubelskie',
  'biała podlaska': 'Lubelskie',
  'chełm': 'Lubelskie',
  'dęblin': 'Lubelskie',
  'hrubieszów': 'Lubelskie',
  'janów lubelski': 'Lubelskie',
  'krasnystaw': 'Lubelskie',
  'kraśnik': 'Lubelskie',
  'lubartów': 'Lubelskie',
  'lublin': 'Lubelskie',
  'łęczna': 'Lubelskie',
  'łuków': 'Lubelskie',
  'międzyrzec podlaski': 'Lubelskie',
  'parczew': 'Lubelskie',
  'puławy': 'Lubelskie',
  'radzyń podlaski': 'Lubelskie',
  'szczebrzeszyn': 'Lubelskie',
  'świdnik': 'Lubelskie',
  'tomaszów lubelski': 'Lubelskie',
  'włodawa': 'Lubelskie',
  'zamość': 'Lubelskie',

  'augustów': 'Podlaskie',
  'białystok': 'Podlaskie',
  'bielsk podlaski': 'Podlaskie',
  'grajewo': 'Podlaskie',
  'hajnówka': 'Podlaskie',
  'kolno': 'Podlaskie',
  'łapy': 'Podlaskie',
  'łomża': 'Podlaskie',
  'mońki': 'Podlaskie',
  'sejny': 'Podlaskie',
  'siemiatycze': 'Podlaskie',
  'sokółka': 'Podlaskie',
  'suwałki': 'Podlaskie',
  'wysokie mazowieckie': 'Podlaskie',
  'zambrów': 'Podlaskie',

  'bartoszyce': 'Warmińsko-Mazurskie',
  'biskupiec': 'Warmińsko-Mazurskie',
  'działdowo': 'Warmińsko-Mazurskie',
  'elbląg': 'Warmińsko-Mazurskie',
  'ełk': 'Warmińsko-Mazurskie',
  'giżycko': 'Warmińsko-Mazurskie',
  'gołdap': 'Warmińsko-Mazurskie',
  'iława': 'Warmińsko-Mazurskie',
  'kętrzyn': 'Warmińsko-Mazurskie',
  'morąg': 'Warmińsko-Mazurskie',
  'mrągowo': 'Warmińsko-Mazurskie',
  'nidzica': 'Warmińsko-Mazurskie',
  'nowe miasto lubawskie': 'Warmińsko-Mazurskie',
  'olecko': 'Warmińsko-Mazurskie',
  'olsztyn': 'Warmińsko-Mazurskie',
  'ostróda': 'Warmińsko-Mazurskie',
  'pisz': 'Warmińsko-Mazurskie',
  'szczytno': 'Warmińsko-Mazurskie',

  'żuromin': 'Mazowieckie',
  'mława': 'Mazowieckie',
  'ciechanów': 'Mazowieckie',
  'pułtusk': 'Mazowieckie',
  'przasnysz': 'Mazowieckie',
  'maków mazowiecki': 'Mazowieckie',
  'ostrołęka': 'Mazowieckie',
  'ostrów mazowiecka': 'Mazowieckie',
  'wyszków': 'Mazowieckie',
  'węgrów': 'Mazowieckie',
  'sokołów podlaski': 'Mazowieckie',
  'siedlce': 'Mazowieckie',
};

export const getHospitalVoivodeship = (hosp: Hospital): string => {
  if (hosp.voivodeship) return hosp.voivodeship;
  const cityLower = hosp.city.toLowerCase().trim();
  return CITY_TO_VOIVODESHIP[cityLower] || 'Other';
};

interface ContactsViewProps {
  key?: React.Key;
  hospitals: Hospital[];
  departments: Department[];
  doctors: Doctor[];
  meetings: Meeting[];
  tasks?: Task[];
  onSaveHospital: (hospital: Hospital) => void;
  onDeleteHospital: (id: string) => void;
  onSaveDepartment: (dept: Department) => void;
  onDeleteDepartment: (id: string) => void;
  onSaveDoctor: (doctor: Doctor) => void;
  onDeleteDoctor: (id: string) => void;
  onSaveTask?: (task: Task) => void;
  onDeleteTask?: (id: string) => void;
  onNavigateToMeeting: (meetingId: string) => void;
  initialSelectedId?: string | null;
  initialType?: 'hospital' | 'doctor' | null;
  initialShowNewDoctor?: boolean;
  initialShowNewHospital?: boolean;
  currentRole: UserRole;
}

export default function ContactsView({
  hospitals,
  departments,
  doctors,
  meetings,
  tasks = [],
  onSaveHospital,
  onDeleteHospital,
  onSaveDepartment,
  onDeleteDepartment,
  onSaveDoctor,
  onDeleteDoctor,
  onSaveTask,
  onDeleteTask,
  onNavigateToMeeting,
  initialSelectedId = null,
  initialType = null,
  initialShowNewDoctor = false,
  initialShowNewHospital = false,
  currentRole
}: ContactsViewProps) {

  // Główny tab kontaktu: 'hospitals' | 'doctors'
  const [activeTab, setActiveTab] = useState<'hospitals' | 'doctors'>(
    (initialType === 'doctor' || initialShowNewDoctor) ? 'doctors' : 'hospitals'
  );

  // -------------------------------------------------------------
  // STATES DLA SZPITALI / PLACÓWEK
  // -------------------------------------------------------------
  const [hospitalViewState, setHospitalViewState] = useState<'list' | 'detail' | 'add' | 'edit'>(
    initialShowNewHospital ? 'add' : ((initialSelectedId && (initialType === 'hospital' || !initialType)) ? 'detail' : 'list')
  );
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(
    (initialType === 'hospital' || !initialType) ? initialSelectedId : null
  );

  // Filtry szpitali
  const [hospitalSearchQuery, setHospitalSearchQuery] = useState('');
  const [hospitalStatusFilter, setHospitalStatusFilter] = useState<string>('all');
  const [hospitalSegmentFilter, setHospitalSegmentFilter] = useState<string>('all');
  const [hospitalTaskFilter, setHospitalTaskFilter] = useState<'all' | 'with_tasks' | 'with_overdue'>('all');
  const [expandedHospitals, setExpandedHospitals] = useState<Record<string, boolean>>({});
  const [expandedDepartments, setExpandedDepartments] = useState<Record<string, boolean>>({});

  // Stan zadań szpitala
  const [selectedHospitalTaskTab, setSelectedHospitalTaskTab] = useState<'all' | 'pending' | 'completed'>('pending');
  const [isHospitalTaskModalOpen, setIsHospitalTaskModalOpen] = useState(false);
  const [hospitalTaskEditing, setHospitalTaskEditing] = useState<Task | null>(null);
  const [hTaskHospitalId, setHTaskHospitalId] = useState('');
  const [hTaskDepartmentId, setHTaskDepartmentId] = useState('');
  const [hTaskDoctorId, setHTaskDoctorId] = useState('');
  const [hTaskMeetingId, setHTaskMeetingId] = useState('');
  const [hTaskDescription, setHTaskDescription] = useState('');
  const [hTaskDueDate, setHTaskDueDate] = useState('');
  const [completedTaskForPrompt, setCompletedTaskForPrompt] = useState<Task | null>(null);

  // Formularz szpitala
  const [hFormName, setHFormName] = useState('');
  const [hFormAddress, setHFormAddress] = useState('');
  const [hFormCity, setHFormCity] = useState('');
  const [hFormVoivodeship, setHFormVoivodeship] = useState('Lubelskie');
  const [hFormPhone, setHFormPhone] = useState('');
  const [hFormEmail, setHFormEmail] = useState('');
  const [hFormWebsite, setHFormWebsite] = useState('');
  const [hFormStatus, setHFormStatus] = useState<PipelineStatus>('prospect');
  const [hFormNotes, setHFormNotes] = useState('');
  const [hFormLat, setHFormLat] = useState<string>('');
  const [hFormLng, setHFormLng] = useState<string>('');

  // Formularz nowego oddziału (inline w szczegółach szpitala)
  const [showAddDeptForm, setShowAddDeptForm] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptType, setNewDeptType] = useState<DepartmentType>('zabiegowy');

  // Załadowanie danych szpitala do edycji
  const handleEditHospitalClick = (hosp: Hospital) => {
    setSelectedHospitalId(hosp.id);
    setHFormName(hosp.name);
    setHFormAddress(hosp.address);
    setHFormCity(hosp.city);
    setHFormVoivodeship(hosp.voivodeship || getHospitalVoivodeship(hosp));
    setHFormPhone(hosp.phone);
    setHFormEmail(hosp.email);
    setHFormWebsite(hosp.website);
    setHFormStatus(hosp.pipeline_status);
    setHFormNotes(hosp.notes);
    setHFormLat(hosp.lat !== null ? hosp.lat.toString() : '');
    setHFormLng(hosp.lng !== null ? hosp.lng.toString() : '');
    setHospitalViewState('edit');
  };

  // Otwarcie formularza dodawania nowego szpitala
  const handleAddHospitalClick = () => {
    setHFormName('');
    setHFormAddress('');
    setHFormCity('');
    setHFormVoivodeship('Lubelskie');
    setHFormPhone('');
    setHFormEmail('');
    setHFormWebsite('');
    setHFormStatus('prospect');
    setHFormNotes('');
    setHFormLat('');
    setHFormLng('');
    setHospitalViewState('add');
  };

  // Zapis formularza szpitala
  const handleHospitalFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hFormName.trim() || !hFormCity.trim() || !hFormAddress.trim()) {
      alert('Name, address and city are required!');
      return;
    }

    const savedHosp: Hospital = {
      id: hospitalViewState === 'edit' && selectedHospitalId ? selectedHospitalId : `hosp_${Date.now()}`,
      name: hFormName,
      address: hFormAddress,
      city: hFormCity,
      voivodeship: hFormVoivodeship,
      phone: hFormPhone,
      email: hFormEmail,
      website: hFormWebsite,
      pipeline_status: hFormStatus,
      lat: hFormLat ? parseFloat(hFormLat) : null,
      lng: hFormLng ? parseFloat(hFormLng) : null,
      notes: hFormNotes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    onSaveHospital(savedHosp);
    setSelectedHospitalId(savedHosp.id);
    setHospitalViewState('detail');
  };

  // Usunięcie szpitala
  const handleHospitalDeleteClick = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the hospital "${name}"? This will delete the hospital profile, but keep doctors and meetings in the database.`)) {
      onDeleteHospital(id);
      if (selectedHospitalId === id) {
        setSelectedHospitalId(null);
      }
      setHospitalViewState('list');
    }
  };

  // Zapis nowego oddziału
  const handleAddDepartmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName.trim() || !selectedHospitalId) {
      alert('Please enter the department name');
      return;
    }

    const newDept: Department = {
      id: `dept_${Date.now()}`,
      hospital_id: selectedHospitalId,
      name: newDeptName,
      type: newDeptType,
      created_at: new Date().toISOString(),
    };

    onSaveDepartment(newDept);
    setNewDeptName('');
    setShowAddDeptForm(false);
  };

  // Usunięcie oddziału
  const handleDeleteDept = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the department "${name}"?`)) {
      onDeleteDepartment(id);
    }
  };


  // -------------------------------------------------------------
  // STATES DLA LEKARZY / PERSONELU
  // -------------------------------------------------------------
  const [doctorViewState, setDoctorViewState] = useState<'list' | 'detail' | 'add' | 'edit'>(
    initialShowNewDoctor ? 'add' : ((initialSelectedId && initialType === 'doctor') ? 'detail' : 'list')
  );
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(
    initialType === 'doctor' ? initialSelectedId : null
  );

  // Filtry lekarzy
  const [doctorSearchQuery, setDoctorSearchQuery] = useState('');
  const [doctorHospitalFilter, setDoctorHospitalFilter] = useState('all');
  const [doctorDeptFilter, setDoctorDeptFilter] = useState('all');
  const [doctorVoivodeshipFilter, setDoctorVoivodeshipFilter] = useState('all');
  
  // Stan rozwijania województw i miast (true = zwinięte, domyślnie false/undefined = rozwinięte)
  const [collapsedVoivodeships, setCollapsedVoivodeships] = useState<Record<string, boolean>>({});
  const [collapsedCities, setCollapsedCities] = useState<Record<string, boolean>>({});

  // Formularz lekarza
  const [dFormTitle, setDFormTitle] = useState('lek. med.');
  const [dFormFirstName, setDFormFirstName] = useState('');
  const [dFormLastName, setDFormLastName] = useState('');
  const [dFormHospitalId, setDFormHospitalId] = useState('');
  const [dFormDepartmentId, setDFormDepartmentId] = useState('');
  const [dFormPhone, setDFormPhone] = useState('');
  const [dFormEmail, setDFormEmail] = useState('');
  const [dFormSpecialization, setDFormSpecialization] = useState('');
  const [dFormNotes, setDFormNotes] = useState('');
  const [dFormHospitalSearch, setDFormHospitalSearch] = useState('');
  const [isHospitalDropdownOpen, setIsHospitalDropdownOpen] = useState(false);

  // Sync initial creation triggers
  React.useEffect(() => {
    if (initialShowNewHospital) {
      setActiveTab('hospitals');
      setHospitalViewState('add');
      setHFormName('');
      setHFormAddress('');
      setHFormCity('');
      setHFormVoivodeship('Lubelskie');
      setHFormPhone('');
      setHFormEmail('');
      setHFormWebsite('');
      setHFormStatus('prospect');
      setHFormNotes('');
      setHFormLat('');
      setHFormLng('');
    } else if (initialShowNewDoctor) {
      setActiveTab('doctors');
      setDoctorViewState('add');
      setDFormTitle('lek. med.');
      setDFormFirstName('');
      setDFormLastName('');
      const defaultHospId = hospitals.length > 0 ? hospitals[0].id : '';
      setDFormHospitalId(defaultHospId);
      const defaultHospDepts = departments.filter(d => d.hospital_id === defaultHospId);
      setDFormDepartmentId(defaultHospDepts.length > 0 ? defaultHospDepts[0].id : '');
      setDFormPhone('');
      setDFormEmail('');
      setDFormSpecialization('');
      setDFormNotes('');
    }
  }, [initialShowNewHospital, initialShowNewDoctor]);

  // Załadowanie lekarza do edycji
  const handleEditDoctorClick = (doc: Doctor) => {
    setSelectedDoctorId(doc.id);
    setDFormTitle(doc.title);
    setDFormFirstName(doc.first_name);
    setDFormLastName(doc.last_name);
    setDFormHospitalId(doc.hospital_id);
    setDFormDepartmentId(doc.department_id);
    setDFormPhone(doc.phone);
    setDFormEmail(doc.email);
    setDFormSpecialization(doc.specialization);
    setDFormNotes(doc.notes);
    setDFormHospitalSearch('');
    setIsHospitalDropdownOpen(false);
    setDoctorViewState('edit');
  };

  // Dodanie nowego lekarza
  const handleAddDoctorClick = () => {
    setDFormTitle('lek. med.');
    setDFormFirstName('');
    setDFormLastName('');
    const defaultHospId = hospitals.length > 0 ? hospitals[0].id : '';
    setDFormHospitalId(defaultHospId);
    
    const defaultHospDepts = departments.filter(d => d.hospital_id === defaultHospId);
    setDFormDepartmentId(defaultHospDepts.length > 0 ? defaultHospDepts[0].id : '');
    
    setDFormPhone('');
    setDFormEmail('');
    setDFormSpecialization('');
    setDFormNotes('');
    setDFormHospitalSearch('');
    setIsHospitalDropdownOpen(false);
    setDoctorViewState('add');
  };

  // Zmiana szpitala w formularzu lekarza
  const handleDFormHospitalChange = (hospId: string) => {
    setDFormHospitalId(hospId);
    const relatedDepts = departments.filter(d => d.hospital_id === hospId);
    if (relatedDepts.length > 0) {
      setDFormDepartmentId(relatedDepts[0].id);
    } else {
      setDFormDepartmentId('');
    }
  };

  // Pomocnicze obiekty do wyszukiwarki szpitali w formularzu
  const selectedHospitalObj = hospitals.find(h => h.id === dFormHospitalId);
  const filteredFormHospitals = hospitals.filter(h =>
    h.name.toLowerCase().includes(dFormHospitalSearch.toLowerCase()) ||
    h.city.toLowerCase().includes(dFormHospitalSearch.toLowerCase())
  );

  // Zapis formularza lekarza
  const handleDoctorFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dFormFirstName.trim() || !dFormLastName.trim() || !dFormHospitalId || !dFormDepartmentId) {
      alert('First name, last name, hospital, and department are required fields!');
      return;
    }

    const savedDoc: Doctor = {
      id: doctorViewState === 'edit' && selectedDoctorId ? selectedDoctorId : `doc_${Date.now()}`,
      title: dFormTitle || 'lek. med.',
      first_name: dFormFirstName.trim(),
      last_name: dFormLastName.trim(),
      hospital_id: dFormHospitalId,
      department_id: dFormDepartmentId,
      phone: dFormPhone.trim(),
      email: dFormEmail.trim(),
      specialization: dFormSpecialization.trim() || 'Ogólna',
      notes: dFormNotes.trim(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    onSaveDoctor(savedDoc);
    setSelectedDoctorId(savedDoc.id);
    setDoctorViewState('detail');
  };

  // Usunięcie lekarza
  const handleDoctorDeleteClick = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete doctor ${name} from CRM?`)) {
      onDeleteDoctor(id);
      if (selectedDoctorId === id) {
        setSelectedDoctorId(null);
      }
      setDoctorViewState('list');
    }
  };


  // -------------------------------------------------------------
  // HELPERY I OBSŁUGA ZADAŃ SZPITALI
  // -------------------------------------------------------------
  const getHospitalTasks = (hospId: string): Task[] => {
    if (!tasks || tasks.length === 0) return [];
    const hospMeetingIds = new Set(meetings.filter(m => m.hospital_id === hospId).map(m => m.id));
    return tasks.filter(t => t.hospital_id === hospId || (t.meeting_id && hospMeetingIds.has(t.meeting_id)));
  };

  const isTaskOverdue = (task: Task): boolean => {
    if (task.is_done || !task.due_date) return false;
    const today = new Date().toISOString().split('T')[0];
    return task.due_date < today;
  };

  const isTaskDueToday = (task: Task): boolean => {
    if (task.is_done || !task.due_date) return false;
    const today = new Date().toISOString().split('T')[0];
    return task.due_date === today;
  };

  const handleToggleHospitalTask = (task: Task) => {
    if (!onSaveTask) return;
    const willBeDone = !task.is_done;
    const updated: Task = {
      ...task,
      is_done: willBeDone
    };
    onSaveTask(updated);
    if (willBeDone) {
      setCompletedTaskForPrompt(task);
    }
  };

  const handleOpenAddHospitalTask = (hospitalId: string, departmentId?: string, doctorId?: string) => {
    setHospitalTaskEditing(null);
    setHTaskHospitalId(hospitalId);
    setHTaskDepartmentId(departmentId || '');
    setHTaskDoctorId(doctorId || '');
    setHTaskMeetingId('');
    setHTaskDescription('');
    setHTaskDueDate(new Date().toISOString().split('T')[0]);
    setIsHospitalTaskModalOpen(true);
  };

  const handleOpenEditHospitalTask = (task: Task) => {
    setHospitalTaskEditing(task);
    const meet = meetings.find(m => m.id === task.meeting_id);
    setHTaskHospitalId(task.hospital_id || meet?.hospital_id || selectedHospitalId || '');
    setHTaskDepartmentId(task.department_id || meet?.department_id || '');
    setHTaskDoctorId(task.doctor_id || meet?.doctor_id || '');
    setHTaskMeetingId(task.meeting_id || '');
    setHTaskDescription(task.description);
    setHTaskDueDate(task.due_date || '');
    setIsHospitalTaskModalOpen(true);
  };

  const handleSaveHospitalTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hTaskDescription.trim() || !onSaveTask) return;
    const targetHospId = hTaskHospitalId || selectedHospitalId || '';
    const newTask: Task = {
      id: hospitalTaskEditing ? hospitalTaskEditing.id : `task_${Date.now()}`,
      meeting_id: hTaskMeetingId || '',
      hospital_id: targetHospId || undefined,
      department_id: hTaskDepartmentId || undefined,
      doctor_id: hTaskDoctorId || undefined,
      description: hTaskDescription.trim(),
      due_date: hTaskDueDate || null,
      is_done: hospitalTaskEditing ? hospitalTaskEditing.is_done : false,
      created_at: hospitalTaskEditing ? hospitalTaskEditing.created_at : new Date().toISOString()
    };
    onSaveTask(newTask);
    setIsHospitalTaskModalOpen(false);
  };

  const handleDeleteHospitalTaskClick = (taskId: string) => {
    if (window.confirm('Czy na pewno chcesz usunąć to zadanie?')) {
      if (onDeleteTask) {
        onDeleteTask(taskId);
      }
    }
  };

  const handleConfirmAddFollowUp = (prevTask: Task, meetingId: string) => {
    setCompletedTaskForPrompt(null);
    setHospitalTaskEditing(null);
    const meet = meetings.find(m => m.id === meetingId);
    setHTaskHospitalId(prevTask.hospital_id || meet?.hospital_id || selectedHospitalId || '');
    setHTaskDepartmentId(prevTask.department_id || meet?.department_id || '');
    setHTaskDoctorId(prevTask.doctor_id || meet?.doctor_id || '');
    setHTaskMeetingId(meetingId || '');
    setHTaskDescription('');
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    setHTaskDueDate(nextWeek.toISOString().split('T')[0]);
    setIsHospitalTaskModalOpen(true);
  };

  // -------------------------------------------------------------
  // AKCESORIA POMOCNICZE / FILTROWANIE
  // -------------------------------------------------------------
  // 1. Szpitale filtr
  const filteredHospitals = hospitals.filter(hosp => {
    const matchesSearch = 
      hosp.name.toLowerCase().includes(hospitalSearchQuery.toLowerCase()) ||
      hosp.city.toLowerCase().includes(hospitalSearchQuery.toLowerCase()) ||
      hosp.address.toLowerCase().includes(hospitalSearchQuery.toLowerCase());
    
    const matchesStatus = hospitalStatusFilter === 'all' || hosp.pipeline_status === hospitalStatusFilter;
    const matchesSegment = hospitalSegmentFilter === 'all' || hosp.segment === hospitalSegmentFilter;

    let matchesTasks = true;
    if (hospitalTaskFilter === 'with_tasks') {
      const hTasks = getHospitalTasks(hosp.id);
      matchesTasks = hTasks.some(t => !t.is_done);
    } else if (hospitalTaskFilter === 'with_overdue') {
      const hTasks = getHospitalTasks(hosp.id);
      matchesTasks = hTasks.some(t => isTaskOverdue(t));
    }

    return matchesSearch && matchesStatus && matchesSegment && matchesTasks;
  });

  // 2. Lekarze filtr
  const filteredDoctors = doctors.filter(doc => {
    const hosp = hospitals.find(h => h.id === doc.hospital_id);
    const hospName = hosp ? hosp.name : '';
    
    const matchesSearch = 
      doc.first_name.toLowerCase().includes(doctorSearchQuery.toLowerCase()) ||
      doc.last_name.toLowerCase().includes(doctorSearchQuery.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(doctorSearchQuery.toLowerCase()) ||
      hospName.toLowerCase().includes(doctorSearchQuery.toLowerCase());

    const matchesHospital = doctorHospitalFilter === 'all' || doc.hospital_id === doctorHospitalFilter;
    const matchesDept = doctorDeptFilter === 'all' || doc.department_id === doctorDeptFilter;

    const docVoivodeship = hosp ? getHospitalVoivodeship(hosp) : 'Nieznane';
    const matchesVoivodeship = doctorVoivodeshipFilter === 'all' || docVoivodeship === doctorVoivodeshipFilter;

    return matchesSearch && matchesHospital && matchesDept && matchesVoivodeship;
  });

  // Szczegóły szpitala
  const selectedHospital = hospitals.find(h => h.id === selectedHospitalId);
  const selectedHospitalDepts = departments.filter(d => d.hospital_id === selectedHospitalId);
  const selectedHospitalDoctors = doctors.filter(d => d.hospital_id === selectedHospitalId);
  const selectedHospitalMeetings = meetings
    .filter(m => m.hospital_id === selectedHospitalId)
    .sort((a, b) => new Date(b.meeting_date).getTime() - new Date(a.meeting_date).getTime());
  const selectedHospitalTasks = selectedHospitalId ? getHospitalTasks(selectedHospitalId) : [];

  // Szczegóły lekarza
  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId);
  const selectedDoctorHospital = selectedDoctor ? hospitals.find(h => h.id === selectedDoctor.hospital_id) : null;
  const selectedDoctorDepartment = selectedDoctor ? departments.find(d => d.id === selectedDoctor.department_id) : null;
  const selectedDoctorMeetings = meetings
    .filter(m => m.doctor_id === selectedDoctorId)
    .sort((a, b) => new Date(b.meeting_date).getTime() - new Date(a.meeting_date).getTime());

  // Oddziały dla filtra lekarza
  const availableDeptsForDocFilter = doctorHospitalFilter === 'all' 
    ? [] 
    : departments.filter(d => d.hospital_id === doctorHospitalFilter);

  // Pomocnicze funkcje pobierające datę ostatniej wizyty
  const getLastVisitDateForHospital = (hospitalId: string): string | null => {
    const hospMeetings = meetings.filter(m => m.hospital_id === hospitalId);
    if (hospMeetings.length === 0) return null;
    const sorted = [...hospMeetings].sort((a, b) => new Date(b.meeting_date).getTime() - new Date(a.meeting_date).getTime());
    const latestDate = new Date(sorted[0].meeting_date);
    if (isNaN(latestDate.getTime())) return null;
    return latestDate.toLocaleDateString('pl-PL');
  };

  const getLastVisitDateForDepartment = (deptId: string): string | null => {
    const deptDocIds = doctors.filter(doc => doc.department_id === deptId).map(doc => doc.id);
    const deptMeetings = meetings.filter(m => 
      m.department_id === deptId ||
      (m.doctor_id && deptDocIds.includes(m.doctor_id)) ||
      (m.doctor_ids && m.doctor_ids.some(id => deptDocIds.includes(id)))
    );
    if (deptMeetings.length === 0) return null;
    const sorted = [...deptMeetings].sort((a, b) => new Date(b.meeting_date).getTime() - new Date(a.meeting_date).getTime());
    const latestDate = new Date(sorted[0].meeting_date);
    if (isNaN(latestDate.getTime())) return null;
    return latestDate.toLocaleDateString('pl-PL');
  };

  const getLastVisitDateForDoctor = (doctorId: string): string | null => {
    const docMeetings = meetings.filter(m => 
      m.doctor_id === doctorId || 
      (m.doctor_ids && m.doctor_ids.includes(doctorId))
    );
    if (docMeetings.length === 0) return null;
    const sorted = [...docMeetings].sort((a, b) => new Date(b.meeting_date).getTime() - new Date(a.meeting_date).getTime());
    const latestDate = new Date(sorted[0].meeting_date);
    if (isNaN(latestDate.getTime())) return null;
    return latestDate.toLocaleDateString('pl-PL');
  };


  // Badges translators
  const getPipelineStatusBadge = (status: PipelineStatus) => {
    switch (status) {
      case 'prospect':
        return <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Prospect</span>;
      case 'active':
        return <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Active</span>;
      case 'key_account':
        return <span className="bg-violet-100 text-violet-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Key Account</span>;
      case 'inactive':
        return <span className="bg-slate-100 text-slate-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Inactive</span>;
      default:
        return null;
    }
  };

  const getDepartmentTypeBadge = (type: DepartmentType) => {
    switch (type) {
      case 'zabiegowy':
        return <span className="bg-orange-50 text-orange-700 border border-orange-100 text-[10px] font-medium px-2 py-0.5 rounded">Surgical</span>;
      case 'zachowawczy':
        return <span className="bg-cyan-50 text-cyan-700 border border-cyan-100 text-[10px] font-medium px-2 py-0.5 rounded">Conservative</span>;
      case 'diagnostyczny':
        return <span className="bg-purple-50 text-purple-700 border border-purple-100 text-[10px] font-medium px-2 py-0.5 rounded">Diagnostic</span>;
    }
  };

  // Eksport bazy szpitali do pliku CSV (Excel)
  const exportHospitalsToCSV = () => {
    if (!hospitals || hospitals.length === 0) {
      alert('Brak szpitali w bazie do wyeksportowania.');
      return;
    }

    const headers = [
      'ID',
      'Nazwa Szpitala',
      'Adres',
      'Miejscowość',
      'Województwo',
      'Telefon',
      'Email',
      'Strona WWW',
      'Status Pipeline',
      'Segment',
      'Oddziały',
      'Szerokość Geograficzna (Lat)',
      'Długość Geograficzna (Lng)',
      'Notatki'
    ];

    const rows = hospitals.map(h => {
      const hospDepts = departments
        .filter(d => d.hospital_id === h.id)
        .map(d => d.name)
        .join('; ');

      const voiv = h.voivodeship || getHospitalVoivodeship(h);

      return [
        `"${(h.id || '').replace(/"/g, '""')}"`,
        `"${(h.name || '').replace(/"/g, '""')}"`,
        `"${(h.address || '').replace(/"/g, '""')}"`,
        `"${(h.city || '').replace(/"/g, '""')}"`,
        `"${(voiv || '').replace(/"/g, '""')}"`,
        `"${(h.phone || '').replace(/"/g, '""')}"`,
        `"${(h.email || '').replace(/"/g, '""')}"`,
        `"${(h.website || '').replace(/"/g, '""')}"`,
        `"${(h.pipeline_status || '').replace(/"/g, '""')}"`,
        `"${(h.segment || 'C').replace(/"/g, '""')}"`,
        `"${(hospDepts || '').replace(/"/g, '""')}"`,
        `"${(h.lat !== null && h.lat !== undefined ? h.lat : '').toString().replace(/"/g, '""')}"`,
        `"${(h.lng !== null && h.lng !== undefined ? h.lng : '').toString().replace(/"/g, '""')}"`,
        `"${(h.notes || '').replace(/"/g, '""')}"`
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `baza_szpitali_macscrm_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Eksport bazy lekarzy do pliku CSV (Excel)
  const exportDoctorsToCSV = () => {
    if (!doctors || doctors.length === 0) {
      alert('Brak lekarzy w bazie do wyeksportowania.');
      return;
    }

    const headers = [
      'ID',
      'Tytuł',
      'Imię',
      'Nazwisko',
      'Specjalizacja',
      'Szpital',
      'Miejscowość',
      'Województwo',
      'Oddział',
      'Telefon',
      'Email',
      'Notatki'
    ];

    const rows = doctors.map(d => {
      const hosp = hospitals.find(h => h.id === d.hospital_id);
      const dept = departments.find(dep => dep.id === d.department_id);
      const voiv = hosp ? (hosp.voivodeship || getHospitalVoivodeship(hosp)) : '';

      return [
        `"${(d.id || '').replace(/"/g, '""')}"`,
        `"${(d.title || '').replace(/"/g, '""')}"`,
        `"${(d.first_name || '').replace(/"/g, '""')}"`,
        `"${(d.last_name || '').replace(/"/g, '""')}"`,
        `"${(d.specialization || '').replace(/"/g, '""')}"`,
        `"${(hosp?.name || '').replace(/"/g, '""')}"`,
        `"${(hosp?.city || '').replace(/"/g, '""')}"`,
        `"${(voiv || '').replace(/"/g, '""')}"`,
        `"${(dept?.name || '').replace(/"/g, '""')}"`,
        `"${(d.phone || '').replace(/"/g, '""')}"`,
        `"${(d.email || '').replace(/"/g, '""')}"`,
        `"${(d.notes || '').replace(/"/g, '""')}"`
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `baza_lekarzy_macscrm_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Eksport bazy w strukturze: MIASTO / SZPITAL / ODDZIAŁ / LEKARZE
  const exportFullHierarchyToCSV = () => {
    if (!hospitals || hospitals.length === 0) {
      alert('Brak danych w bazie do wyeksportowania.');
      return;
    }

    const headers = [
      'Miasto',
      'Województwo',
      'Szpital',
      'Segment Szpitala',
      'Adres Szpitala',
      'Telefon Szpitala',
      'Email Szpitala',
      'Status Pipeline',
      'Oddział',
      'Typ Oddziału',
      'Tytuł Lekarza',
      'Imię Lekarza',
      'Nazwisko Lekarza',
      'Pełne Imię i Nazwisko Lekarza',
      'Specjalizacja Lekarza',
      'Telefon Lekarza',
      'Email Lekarza',
      'Notatki'
    ];

    const escapeCSV = (val: string | null | undefined): string => {
      if (val === null || val === undefined) return '""';
      const cleanStr = String(val).replace(/"/g, '""').replace(/\r?\n/g, ' ');
      return `"${cleanStr}"`;
    };

    // Sortowanie szpitali po Miejscowości, potem po Nazwie Szpitala
    const sortedHospitals = [...hospitals].sort((a, b) => {
      const cityA = (a.city || '').toLowerCase();
      const cityB = (b.city || '').toLowerCase();
      if (cityA !== cityB) return cityA.localeCompare(cityB, 'pl');
      return (a.name || '').localeCompare(b.name || '', 'pl');
    });

    const rows: string[] = [];

    sortedHospitals.forEach(hosp => {
      const city = hosp.city || 'Nieokreślone';
      const voiv = hosp.voivodeship || getHospitalVoivodeship(hosp) || '';
      const hospName = hosp.name || '';
      const segment = hosp.segment || 'C';
      const address = hosp.address || '';
      const phone = hosp.phone || '';
      const email = hosp.email || '';
      const pipeline = hosp.pipeline_status || '';

      const hospDepts = departments.filter(d => d.hospital_id === hosp.id);
      const hospDocs = doctors.filter(doc => doc.hospital_id === hosp.id);

      if (hospDepts.length === 0 && hospDocs.length === 0) {
        rows.push([
          escapeCSV(city),
          escapeCSV(voiv),
          escapeCSV(hospName),
          escapeCSV(segment),
          escapeCSV(address),
          escapeCSV(phone),
          escapeCSV(email),
          escapeCSV(pipeline),
          escapeCSV('— brak oddziałów —'),
          escapeCSV(''),
          escapeCSV(''),
          escapeCSV(''),
          escapeCSV(''),
          escapeCSV(''),
          escapeCSV(''),
          escapeCSV(''),
          escapeCSV(''),
          escapeCSV(hosp.notes || '')
        ].join(','));
        return;
      }

      const processedDocIds = new Set<string>();

      if (hospDepts.length > 0) {
        hospDepts.forEach(dept => {
          const deptName = dept.name || '';
          const deptType = dept.type || '';
          const deptDocs = hospDocs.filter(doc => doc.department_id === dept.id);

          if (deptDocs.length === 0) {
            rows.push([
              escapeCSV(city),
              escapeCSV(voiv),
              escapeCSV(hospName),
              escapeCSV(segment),
              escapeCSV(address),
              escapeCSV(phone),
              escapeCSV(email),
              escapeCSV(pipeline),
              escapeCSV(deptName),
              escapeCSV(deptType),
              escapeCSV(''),
              escapeCSV(''),
              escapeCSV(''),
              escapeCSV('— brak przypisanych lekarzy —'),
              escapeCSV(''),
              escapeCSV(''),
              escapeCSV(''),
              escapeCSV(hosp.notes || '')
            ].join(','));
          } else {
            deptDocs.forEach(doc => {
              processedDocIds.add(doc.id);
              const docTitle = doc.title || '';
              const firstName = doc.first_name || '';
              const lastName = doc.last_name || '';
              const fullName = `${docTitle} ${firstName} ${lastName}`.trim();

              rows.push([
                escapeCSV(city),
                escapeCSV(voiv),
                escapeCSV(hospName),
                escapeCSV(segment),
                escapeCSV(address),
                escapeCSV(phone),
                escapeCSV(email),
                escapeCSV(pipeline),
                escapeCSV(deptName),
                escapeCSV(deptType),
                escapeCSV(docTitle),
                escapeCSV(firstName),
                escapeCSV(lastName),
                escapeCSV(fullName),
                escapeCSV(doc.specialization || ''),
                escapeCSV(doc.phone || ''),
                escapeCSV(doc.email || ''),
                escapeCSV(doc.notes || hosp.notes || '')
              ].join(','));
            });
          }
        });
      }

      // Lekarze z tego szpitala bez przypisanego oddziału
      const unassignedDocs = hospDocs.filter(doc => !processedDocIds.has(doc.id));
      unassignedDocs.forEach(doc => {
        const docTitle = doc.title || '';
        const firstName = doc.first_name || '';
        const lastName = doc.last_name || '';
        const fullName = `${docTitle} ${firstName} ${lastName}`.trim();

        rows.push([
          escapeCSV(city),
          escapeCSV(voiv),
          escapeCSV(hospName),
          escapeCSV(segment),
          escapeCSV(address),
          escapeCSV(phone),
          escapeCSV(email),
          escapeCSV(pipeline),
          escapeCSV('Inny / Ogólny'),
          escapeCSV(''),
          escapeCSV(docTitle),
          escapeCSV(firstName),
          escapeCSV(lastName),
          escapeCSV(fullName),
          escapeCSV(doc.specialization || ''),
          escapeCSV(doc.phone || ''),
          escapeCSV(doc.email || ''),
          escapeCSV(doc.notes || '')
        ].join(','));
      });
    });

    const csvContent = '\uFEFF' + [headers.map(h => `"${h}"`).join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `baza_miasto_szpital_oddzial_lekarze_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="animate-fade-in p-6 space-y-6">
      
      {/* NAGŁÓWEK GŁÓWNY Z TAB-SWITCHEREM I PRZYCISKIEM EKSPORTU */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="font-display font-bold text-3xl text-slate-900 tracking-tight">CONTACTS</h2>
          <p className="text-slate-500 mt-1 text-sm">Integrated database of hospitals, departments, and medical staff.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Przycisk głównego eksportu strukturalnego */}
          <button
            id="btn-export-full-hierarchy-csv"
            onClick={exportFullHierarchyToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
            title="Eksportuj pełną strukturę: Miasto -> Szpital -> Oddział -> Lekarze do pliku CSV (Excel)"
          >
            <FileSpreadsheet size={16} />
            <span>Eksportuj strukturę CSV (Miasto/Szpital/Oddział/Lekarze)</span>
          </button>

          {/* Tab switcher */}
          <div className="flex p-1 bg-slate-100 border border-slate-200/50 rounded-xl shrink-0">
            <button
              id="tab-contacts-hospitals"
              onClick={() => {
                setActiveTab('hospitals');
                setHospitalViewState('list');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'hospitals'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Building2 size={14} />
              <span>Hospitals ({hospitals.length})</span>
            </button>
            <button
              id="tab-contacts-doctors"
              onClick={() => {
                setActiveTab('doctors');
                setDoctorViewState('list');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'doctors'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users size={14} />
              <span>Doctors ({doctors.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* ----------------- SEKCJA 1: SZPITALE I PLACÓWKI ----------------- */}
      {activeTab === 'hospitals' && (
        <div className="space-y-6">

          {/* NAGŁÓWEK SZPITALI (gdy lista) */}
          {hospitalViewState === 'list' && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display font-bold text-xl text-slate-900">Hospitals & Facilities</h3>
                <p className="text-slate-500 text-xs mt-0.5">Manage relationships, department structures, and medical contracts.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  id="btn-export-hospitals-csv"
                  onClick={exportHospitalsToCSV}
                  className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
                  title="Eksportuj całą bazę szpitali do pliku CSV (Excel)"
                >
                  <FileSpreadsheet size={15} />
                  <span>Eksportuj bazę (CSV / Excel)</span>
                </button>
                <button
                  id="btn-add-hospital-unified"
                  onClick={handleAddHospitalClick}
                  className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
                >
                  <Plus size={15} />
                  <span>Add Hospital</span>
                </button>
              </div>
            </div>
          )}

          {/* LISTA SZPITALI */}
          {hospitalViewState === 'list' && (
            <div className="space-y-6">
              {/* Filtry */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    id="hospital-search-unified"
                    type="text"
                    placeholder="Search by hospital name or city..."
                    value={hospitalSearchQuery}
                    onChange={(e) => setHospitalSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 placeholder-slate-400"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto shrink-0">
                  <select
                    id="hospital-status-filter-unified"
                    value={hospitalStatusFilter}
                    onChange={(e) => setHospitalStatusFilter(e.target.value)}
                    className="w-full sm:w-48 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 cursor-pointer"
                  >
                    <option value="all">All statuses</option>
                    <option value="prospect">Prospect</option>
                    <option value="active">Active</option>
                    <option value="key_account">Key Account</option>
                    <option value="inactive">Inactive</option>
                  </select>

                  <select
                    id="hospital-segment-filter-unified"
                    value={hospitalSegmentFilter}
                    onChange={(e) => setHospitalSegmentFilter(e.target.value)}
                    className="w-full sm:w-36 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 cursor-pointer"
                  >
                    <option value="all">All segments</option>
                    <option value="A">Segment A</option>
                    <option value="B">Segment B</option>
                    <option value="C">Segment C</option>
                  </select>

                  <select
                    id="hospital-task-filter-unified"
                    value={hospitalTaskFilter}
                    onChange={(e) => setHospitalTaskFilter(e.target.value as any)}
                    className="w-full sm:w-44 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 cursor-pointer font-medium"
                  >
                    <option value="all">Zadania: Wszystkie</option>
                    <option value="with_tasks">Z otwartymi zadaniami</option>
                    <option value="with_overdue">Z zaległymi zadaniami</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => {
                      const nextExpanded: Record<string, boolean> = {};
                      const nextDeptExpanded: Record<string, boolean> = {};
                      filteredHospitals.forEach(h => {
                        nextExpanded[h.id] = true;
                        departments.filter(d => d.hospital_id === h.id).forEach(d => {
                          nextDeptExpanded[d.id] = true;
                        });
                      });
                      setExpandedHospitals(nextExpanded);
                      setExpandedDepartments(nextDeptExpanded);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 text-slate-600 hover:text-blue-600 font-semibold text-xs border border-transparent hover:border-slate-200 hover:bg-slate-50 rounded-xl transition-all"
                  >
                    <ChevronDown size={15} className="text-slate-500" />
                    <span>Expand All</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setExpandedHospitals({});
                      setExpandedDepartments({});
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 text-slate-600 hover:text-blue-600 font-semibold text-xs border border-transparent hover:border-slate-200 hover:bg-slate-50 rounded-xl transition-all"
                  >
                    <ChevronRight size={15} className="text-slate-500" />
                    <span>Collapse All</span>
                  </button>
                </div>
              </div>

              {/* Lista placówek jako karty */}
              {filteredHospitals.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 text-center">
                  <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-4">
                    <Building2 size={24} />
                  </div>
                  <h3 className="font-display font-bold text-base text-slate-800">No facilities found</h3>
                  <p className="text-slate-500 text-xs mt-1 max-w-xs mx-auto">Adjust filters or add a new facility.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredHospitals.map((hosp) => {
                    const deptCount = departments.filter(d => d.hospital_id === hosp.id).length;
                    const docCount = doctors.filter(d => d.hospital_id === hosp.id).length;
                    const isHospExpanded = !!expandedHospitals[hosp.id];
                    const hospitalDepts = departments.filter(d => d.hospital_id === hosp.id);

                    return (
                      <div 
                        key={hosp.id} 
                        className="bg-white border border-slate-200 shadow-xs hover:shadow-sm rounded-2xl overflow-hidden transition-all duration-250"
                      >
                        {/* GÓRNY PANEL / NAGŁÓWEK SZPITALA */}
                        <div className="p-4 sm:p-5 flex flex-col gap-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                              {/* Przycisk rozwijania szpitala */}
                              <button
                                type="button"
                                onClick={() => {
                                  setExpandedHospitals(prev => ({
                                    ...prev,
                                    [hosp.id]: !prev[hosp.id]
                                  }));
                                }}
                                className="p-1 sm:p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none shrink-0 mt-0.5"
                              >
                                <ChevronRight 
                                  size={18} 
                                  className={`transform transition-transform duration-200 ${isHospExpanded ? 'rotate-90' : ''}`} 
                                />
                              </button>

                              {/* Niebieska ikona szpitala */}
                              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-blue-50 text-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 border border-blue-100/60 mt-0.5">
                                <Building2 size={20} className="stroke-[1.75]" />
                              </div>

                              {/* Nazwa i dane */}
                              <div className="min-w-0 flex-1">
                                <h4 
                                  onClick={() => {
                                    setExpandedHospitals(prev => ({
                                      ...prev,
                                      [hosp.id]: !prev[hosp.id]
                                    }));
                                  }}
                                  className="font-display font-bold text-slate-900 text-sm sm:text-base hover:text-blue-600 transition-colors cursor-pointer leading-snug break-words"
                                >
                                  {hosp.name}
                                </h4>
                                <div className="flex items-center gap-1.5 sm:gap-2.5 flex-wrap mt-1.5">
                                  {/* Status */}
                                  {hosp.pipeline_status === 'prospect' && (
                                    <span className="bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-semibold px-2 py-0.5 rounded-full">Prospect</span>
                                  )}
                                  {hosp.pipeline_status === 'active' && (
                                    <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-semibold px-2 py-0.5 rounded-full">Active</span>
                                  )}
                                  {hosp.pipeline_status === 'key_account' && (
                                    <span className="bg-purple-50 text-purple-600 border border-purple-100 text-[10px] font-semibold px-2 py-0.5 rounded-full">Key Account</span>
                                  )}
                                  {hosp.pipeline_status === 'inactive' && (
                                    <span className="bg-slate-50 text-slate-500 border border-slate-200/60 text-[10px] font-semibold px-2 py-0.5 rounded-full">Inactive</span>
                                  )}

                                  {/* Segment */}
                                  {hosp.segment && (
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                      hosp.segment === 'A' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                      hosp.segment === 'B' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                      'bg-indigo-50 text-indigo-600 border-indigo-100'
                                    }`}>
                                      Segment {hosp.segment}
                                    </span>
                                  )}

                                  {/* Miasto */}
                                  <span className="text-slate-500 text-xs font-medium">{hosp.city}</span>

                                  {/* Liczba lekarzy */}
                                  <span className="inline-flex items-center gap-1 text-slate-400 text-xs font-medium">
                                    <Users size={13} className="text-slate-400" />
                                    <span>{docCount}</span>
                                  </span>

                                  {/* Data ostatniej wizyty */}
                                  {(() => {
                                    const lastVisit = getLastVisitDateForHospital(hosp.id);
                                    return (
                                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100/90 px-2 py-0.5 rounded-full border border-slate-200/70" title="Data ostatniej wizyty">
                                        <CalendarDays size={12} className="text-blue-600" />
                                        <span>Ost. wizyta: <strong className="text-slate-800">{lastVisit || 'brak'}</strong></span>
                                      </span>
                                    );
                                  })()}

                                  {/* Liczba zadań dla szpitala */}
                                  {(() => {
                                    const hospTasks = getHospitalTasks(hosp.id);
                                    const openTasks = hospTasks.filter(t => !t.is_done);
                                    const overdueTasks = hospTasks.filter(t => isTaskOverdue(t));
                                    if (hospTasks.length === 0) return null;
                                    return (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedHospitalId(hosp.id);
                                          setHospitalViewState('detail');
                                        }}
                                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                                          overdueTasks.length > 0
                                            ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                                            : openTasks.length > 0
                                              ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                                              : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                        }`}
                                        title={`Zadania: ${openTasks.length} do zrobienia, ${overdueTasks.length} zaległych, ${hospTasks.length} łącznie`}
                                      >
                                        <CheckSquare size={12} className={overdueTasks.length > 0 ? 'text-red-600' : 'text-blue-600'} />
                                        <span>{openTasks.length > 0 ? `${openTasks.length} zadania` : `${hospTasks.length} wykonane`}</span>
                                        {overdueTasks.length > 0 && (
                                          <span className="bg-red-600 text-white text-[9px] px-1 rounded-full font-bold">
                                            !{overdueTasks.length}
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })()}
                                </div>
                              </div>
                            </div>

                            {/* Akcje po prawej */}
                            <div className="flex items-center gap-0.5 sm:gap-1 shrink-0 self-start">
                              <button
                                id={`btn-view-h-${hosp.id}`}
                                title="Szczegóły"
                                onClick={() => {
                                  setSelectedHospitalId(hosp.id);
                                  setHospitalViewState('detail');
                                }}
                                className="p-1.5 sm:p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-lg transition-colors"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                id={`btn-edit-h-${hosp.id}`}
                                title="Edit"
                                onClick={() => handleEditHospitalClick(hosp)}
                                className="p-1.5 sm:p-2 hover:bg-slate-100 text-slate-400 hover:text-blue-600 rounded-lg transition-colors"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                id={`btn-delete-h-${hosp.id}`}
                                title="Delete"
                                onClick={() => handleHospitalDeleteClick(hosp.id, hosp.name)}
                                className="p-1.5 sm:p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>

                          {/* Adres / Lokalizacja na dole */}
                          <div className="flex items-start gap-1.5 text-xs text-slate-500 font-medium pl-0.5 min-w-0">
                            <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                            <span className="break-words whitespace-normal leading-snug">
                              {hosp.address ? `${hosp.address}, ` : ''}{hosp.city}{hosp.voivodeship ? ` (${hosp.voivodeship})` : ''}
                            </span>
                          </div>
                        </div>

                        {/* LISTA ODDZIAŁÓW (JEŚLI ROZWINIĘTE) */}
                        {isHospExpanded && (
                          <div className="border-t border-slate-100/80 bg-slate-50/20 px-3 sm:px-5 pb-5 pt-3 space-y-3.5">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                Department structure ({deptCount})
                              </span>
                              <span className="text-[9px] text-slate-400 font-medium italic hidden sm:inline">
                                Click on a department to see doctors
                              </span>
                            </div>

                            {hospitalDepts.length === 0 ? (
                              <p className="text-xs text-slate-400 italic py-5 text-center bg-white rounded-2xl border border-slate-150 shadow-3xs">
                                No departments defined. Go to "Details" (eye icon) to add departments.
                              </p>
                            ) : (
                              <div className="space-y-2.5">
                                {hospitalDepts.map((dept) => {
                                  const isDeptExpanded = !!expandedDepartments[dept.id];
                                  const deptDoctors = doctors.filter(doc => doc.hospital_id === hosp.id && doc.department_id === dept.id);

                                  return (
                                    <div 
                                      key={dept.id} 
                                      className="bg-white border border-slate-200/85 rounded-2xl overflow-hidden shadow-3xs hover:border-slate-300 transition-all duration-200"
                                    >
                                      {/* Pasek oddziału */}
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setExpandedDepartments(prev => ({
                                            ...prev,
                                            [dept.id]: !prev[dept.id]
                                          }));
                                        }}
                                        className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-slate-50/50 transition-colors text-left focus:outline-none gap-2"
                                      >
                                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                                          {/* Chevron dla oddziału */}
                                          <ChevronRight 
                                            size={16} 
                                            className={`text-slate-400 transform transition-transform duration-200 shrink-0 ${isDeptExpanded ? 'rotate-90' : ''}`} 
                                          />
                                          
                                          {/* Zielona ikona stetoskopu */}
                                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center shrink-0 border border-emerald-100/40">
                                            <Stethoscope size={18} className="stroke-[1.75]" />
                                          </div>

                                          {/* Nazwa oddziału */}
                                          <div className="min-w-0 flex-1">
                                            <span className="font-display font-bold text-xs sm:text-sm text-slate-900 tracking-tight block uppercase break-words whitespace-normal leading-snug">
                                              {dept.name}
                                            </span>
                                            <div className="flex items-center gap-2 mt-0.5">
                                              <span className="text-[10px] sm:text-xs text-slate-400">
                                                {deptDoctors.length} {deptDoctors.length === 1 ? 'doctor' : 'doctors'}
                                              </span>
                                              <span className="text-slate-300">•</span>
                                              {(() => {
                                                const lastDeptVisit = getLastVisitDateForDepartment(dept.id);
                                                return (
                                                  <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-slate-500 font-medium">
                                                    <CalendarDays size={11} className="text-emerald-600 shrink-0" />
                                                    <span>Ost. wizyta: <strong className="text-slate-700">{lastDeptVisit || 'brak'}</strong></span>
                                                  </span>
                                                );
                                              })()}
                                            </div>
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                          {getDepartmentTypeBadge(dept.type)}
                                        </div>
                                      </button>

                                      {/* LISTA LEKARZY W ODDZIALE (JEŚLI ROZWINIĘTE) */}
                                      {isDeptExpanded && (
                                        <div className="border-t border-slate-100 bg-slate-50/40 p-4">
                                          {deptDoctors.length === 0 ? (
                                            <p className="text-xs text-slate-400 italic text-center py-4 bg-white rounded-xl border border-slate-100/50">
                                              No registered doctors in this department.
                                            </p>
                                          ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                              {deptDoctors.map((doc) => (
                                                <div 
                                                  key={doc.id} 
                                                  className="p-4 bg-white border border-slate-150 rounded-xl flex items-start justify-between shadow-3xs hover:shadow-2xs transition-all duration-200"
                                                >
                                                  <div className="space-y-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                      <h6 className="text-xs sm:text-sm font-bold text-slate-900">
                                                        {doc.title} {doc.first_name} {doc.last_name}
                                                      </h6>
                                                      {(() => {
                                                        const lastDocVisit = getLastVisitDateForDoctor(doc.id);
                                                        return (
                                                          <span className="inline-flex items-center gap-1 text-[10px] text-slate-600 font-medium bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                                                            <CalendarDays size={10} className="text-blue-500 shrink-0" />
                                                            <span>Ost. wizyta: <strong className="text-slate-800">{lastDocVisit || 'brak'}</strong></span>
                                                          </span>
                                                        );
                                                      })()}
                                                    </div>
                                                    {doc.specialization && (
                                                      <p className="text-[10px] sm:text-xs text-blue-600 font-semibold">
                                                        {doc.specialization}
                                                      </p>
                                                    )}
                                                    
                                                    {/* Dane kontaktowe */}
                                                    <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1.5 text-[10px] sm:text-xs text-slate-500 font-medium">
                                                      {doc.phone && (
                                                        <span className="flex items-center gap-1">
                                                          <Phone size={11} className="text-slate-400" /> 
                                                          <span className="font-mono">{doc.phone}</span>
                                                        </span>
                                                      )}
                                                      {doc.email && (
                                                        <span className="flex items-center gap-1">
                                                          <Mail size={11} className="text-slate-400" /> 
                                                          <span>{doc.email}</span>
                                                        </span>
                                                      )}
                                                    </div>
                                                  </div>

                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      setActiveTab('doctors');
                                                      setSelectedDoctorId(doc.id);
                                                      setDoctorViewState('detail');
                                                    }}
                                                    className="text-[10px] text-blue-600 hover:text-blue-700 font-bold shrink-0 border border-blue-100 hover:border-blue-200 px-3 py-1.5 rounded-xl bg-blue-50/40 hover:bg-blue-50 transition-all shadow-3xs"
                                                  >
                                                    Profile →
                                                  </button>
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* SEKCJA ZADAŃ DLA TEGO SZPITALA W WIDOKU ROZWINIĘTYM */}
                            {(() => {
                              const hospTasks = getHospitalTasks(hosp.id);
                              const openTasks = hospTasks.filter(t => !t.is_done);
                              const overdueTasks = hospTasks.filter(t => isTaskOverdue(t));

                              return (
                                <div className="mt-4 pt-3.5 border-t border-slate-200/80 space-y-2.5">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <CheckSquare size={15} className="text-blue-600" />
                                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                                        Zadania i Follow-Upy ({hospTasks.length})
                                      </span>
                                      {openTasks.length > 0 && (
                                        <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full">
                                          {openTasks.length} do zrobienia
                                        </span>
                                      )}
                                      {overdueTasks.length > 0 && (
                                        <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
                                          {overdueTasks.length} zaległe!
                                        </span>
                                      )}
                                    </div>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenAddHospitalTask(hosp.id);
                                      }}
                                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                                    >
                                      <Plus size={13} />
                                      <span>Dodaj zadanie</span>
                                    </button>
                                  </div>

                                  {hospTasks.length === 0 ? (
                                    <div className="bg-white border border-slate-200/70 border-dashed rounded-xl p-3 text-center">
                                      <p className="text-xs text-slate-400">Brak zadań przypisanych do tego szpitala.</p>
                                    </div>
                                  ) : (
                                    <div className="space-y-1.5">
                                      {hospTasks.slice(0, 4).map(task => {
                                        const overdue = isTaskOverdue(task);
                                        const dueToday = isTaskDueToday(task);
                                        const doc = task.doctor_id ? doctors.find(d => d.id === task.doctor_id) : (task.meeting_id ? doctors.find(d => d.id === meetings.find(m => m.id === task.meeting_id)?.doctor_id) : null);
                                        const dept = task.department_id ? departments.find(d => d.id === task.department_id) : (task.meeting_id ? departments.find(d => d.id === meetings.find(m => m.id === task.meeting_id)?.department_id) : null);

                                        return (
                                          <div
                                            key={task.id}
                                            className={`p-2.5 bg-white rounded-xl border flex items-center justify-between gap-3 text-xs transition-all ${
                                              task.is_done
                                                ? 'border-slate-100 bg-slate-50/50 text-slate-400'
                                                : overdue
                                                  ? 'border-red-200 bg-red-50/30 text-slate-800'
                                                  : 'border-slate-200 text-slate-800 hover:border-blue-200'
                                            }`}
                                          >
                                            <div className="flex items-start gap-2.5 min-w-0 flex-1">
                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleToggleHospitalTask(task);
                                                }}
                                                className={`p-0.5 rounded transition-colors shrink-0 cursor-pointer mt-0.5 ${
                                                  task.is_done ? 'text-emerald-600' : overdue ? 'text-red-500' : 'text-slate-400 hover:text-blue-600'
                                                }`}
                                                title={task.is_done ? 'Oznacz jako niewykonane' : 'Oznacz jako wykonane'}
                                              >
                                                {task.is_done ? <CheckCircle2 size={16} className="fill-emerald-100 text-emerald-600" /> : <Square size={16} />}
                                              </button>
                                              <span className={`font-medium break-words whitespace-normal leading-snug ${task.is_done ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                                                {task.description}
                                              </span>
                                              {task.due_date && (
                                                <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold shrink-0 ${
                                                  task.is_done
                                                    ? 'bg-slate-100 text-slate-400'
                                                    : overdue
                                                      ? 'bg-red-100 text-red-700'
                                                      : dueToday
                                                        ? 'bg-amber-100 text-amber-700'
                                                        : 'bg-blue-50 text-blue-700'
                                                }`}>
                                                  {overdue ? 'Zaległe: ' : dueToday ? 'Dziś: ' : ''}{task.due_date}
                                                </span>
                                              )}
                                              {doc && (
                                                <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded shrink-0 hidden md:inline">
                                                  {doc.title ? `${doc.title} ` : ''}{doc.first_name} {doc.last_name}
                                                </span>
                                              )}
                                              {dept && (
                                                <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded shrink-0 hidden lg:inline">
                                                  {dept.name}
                                                </span>
                                              )}
                                            </div>

                                            <div className="flex items-center gap-1 shrink-0">
                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleOpenEditHospitalTask(task);
                                                }}
                                                className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors cursor-pointer"
                                                title="Edytuj zadanie"
                                              >
                                                <Edit size={13} />
                                              </button>
                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleDeleteHospitalTaskClick(task.id);
                                                }}
                                                className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                                                title="Usuń zadanie"
                                              >
                                                <Trash2 size={13} />
                                              </button>
                                            </div>
                                          </div>
                                        );
                                      })}
                                      {hospTasks.length > 4 && (
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedHospitalId(hosp.id);
                                            setHospitalViewState('detail');
                                          }}
                                          className="w-full text-center py-1.5 text-xs text-blue-600 hover:text-blue-700 font-semibold hover:underline cursor-pointer"
                                        >
                                          Zobacz wszystkie {hospTasks.length} zadania w szczegółach szpitala →
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* SZCZEGÓŁY SZPITALA */}
          {hospitalViewState === 'detail' && selectedHospital && (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() => setHospitalViewState('list')}
                  className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-semibold text-xs transition-colors"
                >
                  <ChevronLeft size={14} />
                  <span>Back to facilities list</span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditHospitalClick(selectedHospital)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-sm transition-all"
                  >
                    <Edit size={13} />
                    <span>Edit details</span>
                  </button>
                  <button
                    onClick={() => handleHospitalDeleteClick(selectedHospital.id, selectedHospital.name)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 bg-white hover:bg-red-50 text-red-600 rounded-xl text-xs font-semibold shadow-sm transition-all"
                  >
                    <Trash2 size={13} />
                    <span>Delete hospital</span>
                  </button>
                </div>
              </div>

              {/* Informacje główne */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-4 md:max-w-2xl">
                  <div className="flex items-start gap-3">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shrink-0 mt-1">
                      <Building2 size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-display font-bold text-xl text-slate-950 tracking-tight leading-tight">{selectedHospital.name}</h4>
                        {getPipelineStatusBadge(selectedHospital.pipeline_status)}
                        {selectedHospital.segment && (
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                            selectedHospital.segment === 'A' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                            selectedHospital.segment === 'B' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                            'bg-indigo-50 text-indigo-600 border-indigo-100'
                          }`}>
                            Segment {selectedHospital.segment}
                          </span>
                        )}
                        {(() => {
                          const lastVisit = getLastVisitDateForHospital(selectedHospital.id);
                          return (
                            <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                              <CalendarDays size={13} className="text-blue-600" />
                              <span>Ostatnia wizyta: {lastVisit || 'brak'}</span>
                            </span>
                          );
                        })()}
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1.5 font-medium">
                        <MapPin size={13} className="text-slate-400" />
                        {selectedHospital.address}, {selectedHospital.city}
                      </p>
                    </div>
                  </div>

                  {selectedHospital.notes && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-600 flex gap-2">
                      <FileText size={15} className="text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-700 block mb-0.5 uppercase tracking-wider text-[10px]">Internal Notes:</span>
                        {selectedHospital.notes}
                      </div>
                    </div>
                  )}
                </div>

                {/* Dane teleadresowe */}
                <div className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-5 md:w-72 shrink-0 grid grid-cols-1 gap-3 text-xs">
                  <h5 className="font-bold text-slate-700 uppercase tracking-wider text-[9px] mb-1">Contact Information</h5>
                  
                  <div className="flex items-center gap-2.5 text-slate-600">
                    <Phone size={13} className="text-slate-400" />
                    <span className="font-mono">{selectedHospital.phone || 'No phone'}</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-slate-600">
                    <Mail size={13} className="text-slate-400 shrink-0" />
                    <span className="break-all">{selectedHospital.email || 'No email'}</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-slate-600">
                    <Globe size={13} className="text-slate-400" />
                    {selectedHospital.website ? (
                      <a href={`https://${selectedHospital.website.replace(/^(https?:\/\/)?(www\.)?/, '')}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {selectedHospital.website}
                      </a>
                    ) : (
                      <span className="text-slate-400">No website</span>
                    )}
                  </div>

                  {selectedHospital.lat && selectedHospital.lng && (
                    <div className="flex items-center gap-2.5 text-slate-600 pt-2 border-t border-slate-200">
                      <MapPin size={13} className="text-blue-500 animate-bounce" />
                      <div>
                        <p className="font-semibold text-slate-800 text-[10px]">GPS Coordinates:</p>
                        <p className="font-mono text-[9px] text-slate-500">{selectedHospital.lat.toFixed(4)}, {selectedHospital.lng.toFixed(4)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* SEKCJA ZADAŃ DLA SZPITALA */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                      <CheckSquare size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="font-display font-bold text-base text-slate-900">
                          Zadania i Akcje placówki
                        </h5>
                        <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2 py-0.5 rounded-full">
                          {selectedHospitalTasks.length}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Zarządzaj zadaniami, ustaleniami i follow-upami bezpośrednio dla tego szpitala
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      id="btn-add-task-for-hospital"
                      type="button"
                      onClick={() => handleOpenAddHospitalTask(selectedHospital.id)}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>Dodaj zadanie</span>
                    </button>
                  </div>
                </div>

                {/* Zakładki filtrów zadań */}
                {selectedHospitalTasks.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setSelectedHospitalTaskTab('pending')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        selectedHospitalTaskTab === 'pending'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Do zrobienia ({selectedHospitalTasks.filter(t => !t.is_done).length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedHospitalTaskTab('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        selectedHospitalTaskTab === 'all'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Wszystkie ({selectedHospitalTasks.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedHospitalTaskTab('completed')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        selectedHospitalTaskTab === 'completed'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Ukończone ({selectedHospitalTasks.filter(t => t.is_done).length})
                    </button>
                  </div>
                )}

                {/* Lista zadań */}
                {(() => {
                  const tasksToShow = selectedHospitalTasks.filter(t => {
                    if (selectedHospitalTaskTab === 'pending') return !t.is_done;
                    if (selectedHospitalTaskTab === 'completed') return t.is_done;
                    return true;
                  });

                  if (selectedHospitalTasks.length === 0) {
                    return (
                      <div className="py-8 text-center bg-slate-50/50 rounded-xl border border-slate-100 space-y-2">
                        <CheckCircle2 size={28} className="mx-auto text-slate-300" />
                        <p className="text-xs font-medium text-slate-600">Brak zadań przypisanych do tego szpitala.</p>
                        <p className="text-[11px] text-slate-400">Dodaj zadanie ręcznie lub utwórz follow-up podczas wizyty handlowej.</p>
                        <button
                          type="button"
                          onClick={() => handleOpenAddHospitalTask(selectedHospital.id)}
                          className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                        >
                          <Plus size={13} />
                          <span>Utwórz pierwsze zadanie</span>
                        </button>
                      </div>
                    );
                  }

                  if (tasksToShow.length === 0) {
                    return (
                      <div className="py-6 text-center text-xs text-slate-400 bg-slate-50/50 rounded-xl">
                        Brak zadań w wybranej kategorii ({selectedHospitalTaskTab === 'pending' ? 'Wszystko zrobione! 🎉' : 'Brak'}).
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-2">
                      {tasksToShow.map(task => {
                        const overdue = isTaskOverdue(task);
                        const dueToday = isTaskDueToday(task);
                        const meet = meetings.find(m => m.id === task.meeting_id);
                        const docId = task.doctor_id || meet?.doctor_id;
                        const deptId = task.department_id || meet?.department_id;
                        const doc = docId ? doctors.find(d => d.id === docId) : null;
                        const dept = deptId ? departments.find(d => d.id === deptId) : null;

                        return (
                          <div
                            key={task.id}
                            className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                              task.is_done
                                ? 'bg-slate-50/80 border-slate-200/60 opacity-80'
                                : overdue
                                  ? 'bg-red-50/30 border-red-200 hover:border-red-300'
                                  : 'bg-white border-slate-200 hover:border-blue-200 shadow-3xs'
                            }`}
                          >
                            <div className="flex items-start gap-3 min-w-0 flex-1">
                              <button
                                type="button"
                                onClick={() => handleToggleHospitalTask(task)}
                                className={`mt-0.5 p-0.5 rounded transition-colors shrink-0 cursor-pointer ${
                                  task.is_done ? 'text-emerald-600' : overdue ? 'text-red-500' : 'text-slate-400 hover:text-blue-600'
                                }`}
                                title={task.is_done ? 'Oznacz jako niewykonane' : 'Oznacz jako wykonane'}
                              >
                                {task.is_done ? <CheckCircle2 size={18} className="fill-emerald-100 text-emerald-600" /> : <Square size={18} />}
                              </button>

                              <div className="min-w-0 flex-1">
                                <p className={`text-xs font-semibold leading-snug break-words ${
                                  task.is_done ? 'line-through text-slate-400' : 'text-slate-900'
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
                                      <Grid size={10} className="text-slate-400" />
                                      <span>{dept.name}</span>
                                    </span>
                                  )}

                                  {doc && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                                      <Stethoscope size={10} className="text-slate-400" />
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
                                      <CalendarDays size={10} />
                                      <span>Wizyta: {meet.title}</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                              <button
                                type="button"
                                onClick={() => handleOpenEditHospitalTask(task)}
                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                title="Edytuj zadanie"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteHospitalTaskClick(task.id)}
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
                  );
                })()}
              </div>

              {/* Grid: Oddziały, Lekarze, Wizyty */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* ODDZIAŁY */}
                <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="font-display font-bold text-base text-slate-900 flex items-center gap-1.5">
                      <Grid size={16} className="text-slate-600" />
                      Departments ({selectedHospitalDepts.length})
                    </h5>
                    <button
                      onClick={() => setShowAddDeptForm(!showAddDeptForm)}
                      className="p-1 hover:bg-slate-100 text-blue-600 rounded-lg transition-colors flex items-center gap-0.5 text-xs font-semibold"
                    >
                      <PlusCircle size={13} />
                      <span>Add</span>
                    </button>
                  </div>

                  {showAddDeptForm && (
                    <form onSubmit={handleAddDepartmentSubmit} className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
                      <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                        <span className="text-[10px] font-bold text-slate-700">New department</span>
                        <button type="button" onClick={() => setShowAddDeptForm(false)} className="text-slate-400 hover:text-slate-600"><X size={13} /></button>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-semibold text-slate-500 block uppercase">Name</label>
                        <input
                          id="new-dept-name-unified"
                          type="text"
                          required
                          placeholder="e.g., Invasive Cardiology"
                          value={newDeptName}
                          onChange={(e) => setNewDeptName(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-semibold text-slate-500 block uppercase">Type</label>
                        <select
                          id="new-dept-type-unified"
                          value={newDeptType}
                          onChange={(e) => setNewDeptType(e.target.value as DepartmentType)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none"
                        >
                          <option value="zabiegowy">Surgical</option>
                          <option value="zachowawczy">Conservative</option>
                          <option value="diagnostyczny">Diagnostic</option>
                        </select>
                      </div>
                      <button
                        type="submit"
                        className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
                      >
                        Save department
                      </button>
                    </form>
                  )}

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {selectedHospitalDepts.length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-6 text-center">No departments defined.</p>
                    ) : (
                      selectedHospitalDepts.map(dept => (
                        <div key={dept.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-3 group">
                          <div>
                            <h6 className="text-xs font-bold text-slate-800">{dept.name}</h6>
                            <div className="flex items-center gap-2 mt-0.5">
                              <p className="text-[9px] text-slate-400">Created: {new Date(dept.created_at).toLocaleDateString('en-US')}</p>
                              <span className="text-slate-300">•</span>
                              <p className="text-[9px] text-slate-600 font-medium inline-flex items-center gap-0.5">
                                <CalendarDays size={10} className="text-blue-500" />
                                <span>Ost. wizyta: <strong>{getLastVisitDateForDepartment(dept.id) || 'brak'}</strong></span>
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {getDepartmentTypeBadge(dept.type)}
                            <button
                              onClick={() => handleDeleteDept(dept.id, dept.name)}
                              className="p-1 hover:bg-slate-200 text-slate-400 hover:text-red-600 rounded opacity-0 group-hover:opacity-100 transition-all"
                              title="Delete department"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* LEKARZE SZPITALA */}
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                  <h5 className="font-display font-bold text-base text-slate-900 flex items-center gap-1.5">
                    <Users size={16} className="text-slate-600" />
                    Doctors in facility ({selectedHospitalDoctors.length})
                  </h5>

                  <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                    {selectedHospitalDoctors.length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-6 text-center">No assigned doctors. Go to the "Doctors" tab above to add a contact.</p>
                    ) : (
                      selectedHospitalDoctors.map(doc => {
                        const deptName = departments.find(d => d.id === doc.department_id)?.name || 'No department';
                        return (
                          <div key={doc.id} className="p-3.5 border border-slate-100 bg-slate-50/50 hover:bg-slate-50 rounded-xl flex items-start justify-between gap-4 transition-colors">
                            <div>
                              <h6 className="text-xs font-bold text-slate-950">{doc.title} {doc.first_name} {doc.last_name}</h6>
                              <p className="text-[10px] text-blue-600 font-semibold mt-0.5">{doc.specialization} • {deptName}</p>
                              <div className="flex gap-3 mt-1.5 text-[9px] text-slate-400 font-medium items-center flex-wrap">
                                <span>Tel: {doc.phone || 'none'}</span>
                                <span>Email: {doc.email || 'none'}</span>
                                <span className="text-slate-600 font-semibold inline-flex items-center gap-0.5 bg-slate-100 px-1.5 py-0.5 rounded">
                                  <CalendarDays size={10} className="text-blue-500" />
                                  <span>Ost. wizyta: {getLastVisitDateForDoctor(doc.id) || 'brak'}</span>
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                  setActiveTab('doctors');
                                  setSelectedDoctorId(doc.id);
                                  setDoctorViewState('detail');
                              }}
                              className="text-[10px] text-blue-600 hover:underline font-bold self-center shrink-0"
                            >
                              Details →
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* WIZYTY W SZPITALU */}
                <div className="lg:col-span-12 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                  <h5 className="font-display font-bold text-base text-slate-900 flex items-center gap-1.5">
                    <CalendarDays size={16} className="text-slate-600" />
                    Sales visit history ({selectedHospitalMeetings.length})
                  </h5>

                  <div className="space-y-2">
                    {selectedHospitalMeetings.length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-6 text-center">No recorded meetings at this facility.</p>
                    ) : (
                      <div className="divide-y divide-slate-100 text-xs">
                        {selectedHospitalMeetings.map(meet => {
                          const doc = doctors.find(d => d.id === meet.doctor_id);
                          const isClosed = Boolean(meet.closed_at);
                          return (
                            <div 
                              key={meet.id} 
                              onClick={() => onNavigateToMeeting(meet.id)}
                              className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50 px-2 rounded-lg transition-colors cursor-pointer"
                            >
                              <div className="flex-1">
                                <h6 className="font-bold text-slate-800">{meet.title}</h6>
                                <p className="text-[10px] text-slate-400 mt-0.5">
                                  {new Date(meet.meeting_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                  {doc && ` • Doctor: ${doc.title} ${doc.first_name} ${doc.last_name}`}
                                </p>
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                  isClosed ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                                }`}>
                                  {isClosed ? 'Closed' : 'Scheduled'}
                                </span>
                                <span className="text-blue-600 font-bold text-[10px]">Details →</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* FORMULARZ SZPITALA (ADD/EDIT) */}
          {(hospitalViewState === 'add' || hospitalViewState === 'edit') && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden max-w-3xl mx-auto">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <h4 className="font-display font-bold text-lg text-slate-900">
                  {hospitalViewState === 'add' ? 'Add new medical facility' : 'Edit facility details'}
                </h4>
                <button
                  onClick={() => setHospitalViewState(selectedHospitalId ? 'detail' : 'list')}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleHospitalFormSubmit} className="p-6 space-y-5 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 space-y-1">
                    <label className="font-bold text-slate-700 uppercase tracking-wider block">Full hospital / facility name *</label>
                    <input
                      id="form-h-name"
                      type="text"
                      required
                      placeholder="e.g., General Hospital..."
                      value={hFormName}
                      onChange={(e) => setHFormName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 uppercase tracking-wider block">Street and number *</label>
                    <input
                      id="form-h-address"
                      type="text"
                      required
                      placeholder="e.g., 45 Grunwaldska St."
                      value={hFormAddress}
                      onChange={(e) => setHFormAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 uppercase tracking-wider block">City *</label>
                    <input
                      id="form-h-city"
                      type="text"
                      required
                      placeholder="e.g., Poznan"
                      value={hFormCity}
                      onChange={(e) => {
                        const newCity = e.target.value;
                        setHFormCity(newCity);
                        const guessed = CITY_TO_VOIVODESHIP[newCity.toLowerCase().trim()];
                        if (guessed) {
                          setHFormVoivodeship(guessed);
                        }
                      }}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 uppercase tracking-wider block">Voivodeship *</label>
                    <select
                      id="form-h-voivodeship"
                      value={hFormVoivodeship}
                      onChange={(e) => setHFormVoivodeship(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
                    >
                      {VOIVODESHIPS.map(v => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 uppercase tracking-wider block">Phone</label>
                    <input
                      id="form-h-phone"
                      type="text"
                      placeholder="e.g., +48 61 800 20 00"
                      value={hFormPhone}
                      onChange={(e) => setHFormPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 uppercase tracking-wider block">Email</label>
                    <input
                      id="form-h-email"
                      type="email"
                      placeholder="e.g., office@hospital.com"
                      value={hFormEmail}
                      onChange={(e) => setHFormEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 uppercase tracking-wider block">Website</label>
                    <input
                      id="form-h-web"
                      type="text"
                      placeholder="e.g., www.hospital.com"
                      value={hFormWebsite}
                      onChange={(e) => setNewDeptName && setHFormWebsite(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 uppercase tracking-wider block">Pipeline Status *</label>
                    <select
                      id="form-h-status"
                      value={hFormStatus}
                      onChange={(e) => setHFormStatus(e.target.value as PipelineStatus)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    >
                      <option value="prospect">Prospect</option>
                      <option value="active">Active (Ongoing cooperation)</option>
                      <option value="key_account">Key Account (Key partner)</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 uppercase tracking-wider block">Latitude GPS</label>
                    <input
                      id="form-h-lat"
                      type="number"
                      step="any"
                      placeholder="e.g., 52.4082"
                      value={hFormLat}
                      onChange={(e) => setHFormLat(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 uppercase tracking-wider block">Longitude GPS</label>
                    <input
                      id="form-h-lng"
                      type="number"
                      step="any"
                      placeholder="e.g., 16.9324"
                      value={hFormLng}
                      onChange={(e) => setHFormLng(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-mono"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="font-bold text-slate-700 uppercase tracking-wider block">Notes / Commercial information</label>
                    <textarea
                      id="form-h-notes"
                      rows={4}
                      placeholder="Key info, decision-makers..."
                      value={hFormNotes}
                      onChange={(e) => setHFormNotes(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none resize-none text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setHospitalViewState(selectedHospitalId ? 'detail' : 'list')}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl font-semibold text-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors shadow-sm"
                  >
                    Save facility
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      )}


      {/* ----------------- SEKCJA 2: LEKARZE I PERSONEL ----------------- */}
      {activeTab === 'doctors' && (
        <div className="space-y-6">

          {/* NAGŁÓWEK LEKARZY (gdy lista) */}
          {doctorViewState === 'list' && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display font-bold text-xl text-slate-900">Doctors and Contacts</h3>
                <p className="text-slate-500 text-xs mt-0.5">Contact directory of medical specialists and healthcare personnel.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  id="btn-export-doctors-csv"
                  onClick={exportDoctorsToCSV}
                  className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
                  title="Eksportuj całą bazę lekarzy do pliku CSV (Excel)"
                >
                  <FileSpreadsheet size={15} />
                  <span>Eksportuj lekarzy (CSV / Excel)</span>
                </button>
                <button
                  id="btn-add-doctor-unified"
                  onClick={handleAddDoctorClick}
                  className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
                >
                  <Plus size={15} />
                  <span>Add doctor</span>
                </button>
              </div>
            </div>
          )}

          {/* LISTA LEKARZY */}
          {doctorViewState === 'list' && (
            <div className="space-y-4">
              {/* Filtry */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative w-full lg:flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    id="doctor-search-unified"
                    type="text"
                    placeholder="Search by name, specialization, hospital..."
                    value={doctorSearchQuery}
                    onChange={(e) => setDoctorSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                    <span className="text-xs font-semibold text-slate-500 shrink-0 uppercase tracking-wider">Voivodeship:</span>
                    <select
                      id="doctor-voivodeship-filter-unified"
                      value={doctorVoivodeshipFilter}
                      onChange={(e) => {
                        setDoctorVoivodeshipFilter(e.target.value);
                        setDoctorHospitalFilter('all');
                        setDoctorDeptFilter('all');
                      }}
                      className="w-full sm:w-40 px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    >
                      <option value="all">All voivodeships</option>
                      {VOIVODESHIPS.map(v => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                    <span className="text-xs font-semibold text-slate-500 shrink-0 uppercase tracking-wider">Hospital:</span>
                    <select
                      id="doctor-hospital-filter-unified"
                      value={doctorHospitalFilter}
                      onChange={(e) => {
                        setDoctorHospitalFilter(e.target.value);
                        setDoctorDeptFilter('all');
                      }}
                      className="w-full sm:w-44 px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    >
                      <option value="all">All hospitals</option>
                      {hospitals
                        .filter(h => doctorVoivodeshipFilter === 'all' || getHospitalVoivodeship(h) === doctorVoivodeshipFilter)
                        .map(h => (
                          <option key={h.id} value={h.id}>{h.city} - {h.name}</option>
                        ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                    <span className="text-xs font-semibold text-slate-500 shrink-0 uppercase tracking-wider">Department:</span>
                    <select
                      id="doctor-dept-filter-unified"
                      disabled={doctorHospitalFilter === 'all'}
                      value={doctorDeptFilter}
                      onChange={(e) => setDoctorDeptFilter(e.target.value)}
                      className="w-full sm:w-40 px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white disabled:opacity-50"
                    >
                      <option value="all">All departments</option>
                      {availableDeptsForDocFilter.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Tabela lekarzy */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {filteredDoctors.length === 0 ? (
                  <div className="p-16 text-center">
                    <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-4">
                      <Users size={24} />
                    </div>
                    <h3 className="font-display font-bold text-base text-slate-800">No doctors in database</h3>
                    <p className="text-slate-500 text-xs mt-1 max-w-xs mx-auto">Try clearing the filters or adding a new doctor.</p>
                  </div>
                ) : (
                  <div>
                    {/* Control Bar for Expanding/Collapsing */}
                    <div className="px-6 py-3 bg-slate-50/75 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5 font-medium">
                        <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Structure:</span>
                        <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded font-semibold text-[11px]">Voivodeship &gt; City</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">Voivodeships:</span>
                          <button
                            id="btn-expand-all-v"
                            type="button"
                            onClick={() => setCollapsedVoivodeships({})}
                            className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-[11px] font-semibold text-slate-700 transition-colors shadow-xs"
                          >
                            Expand all
                          </button>
                          <button
                            id="btn-collapse-all-v"
                            type="button"
                            onClick={() => {
                              const uniqueV: Record<string, boolean> = {};
                              filteredDoctors.forEach(doc => {
                                const hosp = hospitals.find(h => h.id === doc.hospital_id);
                                const v = hosp ? getHospitalVoivodeship(hosp) : 'Unknown';
                                uniqueV[v] = true;
                              });
                              setCollapsedVoivodeships(uniqueV);
                            }}
                            className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-[11px] font-semibold text-slate-700 transition-colors shadow-xs"
                          >
                            Collapse all
                          </button>
                        </div>

                        <div className="w-px h-4 bg-slate-200 hidden sm:block" />

                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">Cities:</span>
                          <button
                            id="btn-expand-all-c"
                            type="button"
                            onClick={() => setCollapsedCities({})}
                            className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-[11px] font-semibold text-slate-700 transition-colors shadow-xs"
                          >
                            Expand all
                          </button>
                          <button
                            id="btn-collapse-all-c"
                            type="button"
                            onClick={() => {
                              const uniqueC: Record<string, boolean> = {};
                              filteredDoctors.forEach(doc => {
                                const hosp = hospitals.find(h => h.id === doc.hospital_id);
                                const v = hosp ? getHospitalVoivodeship(hosp) : 'Nieznane';
                                const city = hosp ? hosp.city : 'Nieznane miejscowość';
                                uniqueC[`${v}-${city}`] = true;
                              });
                              setCollapsedCities(uniqueC);
                            }}
                            className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-[11px] font-semibold text-slate-700 transition-colors shadow-xs"
                          >
                            Collapse all
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-150 bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                            <th className="p-4 pl-6">Doctor / Contact</th>
                            <th className="p-4">Hospital</th>
                            <th className="p-4">Department</th>
                            <th className="p-4">Specialization</th>
                            <th className="p-4">Ost. wizyta</th>
                            <th className="p-4">Phone</th>
                            <th className="p-4">Email</th>
                            <th className="p-4 text-right pr-6">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                          {(() => {
                            const grouped: Record<string, Record<string, Doctor[]>> = {};

                            filteredDoctors.forEach(doc => {
                              const hosp = hospitals.find(h => h.id === doc.hospital_id);
                              const city = hosp ? hosp.city : 'Nieznana miejscowość';
                              const voivodeship = hosp ? getHospitalVoivodeship(hosp) : 'Nieznane';

                              if (!grouped[voivodeship]) {
                                grouped[voivodeship] = {};
                              }
                              if (!grouped[voivodeship][city]) {
                                grouped[voivodeship][city] = [];
                              }
                              grouped[voivodeship][city].push(doc);
                            });

                            const sortedVoivodeships = Object.keys(grouped).sort((a, b) => a.localeCompare(b, 'pl'));

                            return sortedVoivodeships.flatMap(voivodeship => {
                              const totalVoivodeshipDocs = Object.values(grouped[voivodeship]).reduce((sum, list) => sum + list.length, 0);
                              const sortedCities = Object.keys(grouped[voivodeship]).sort((a, b) => a.localeCompare(b, 'pl'));
                              const isVCollapsed = !!collapsedVoivodeships[voivodeship];

                              const toggleVoivodeship = () => {
                                setCollapsedVoivodeships(prev => ({
                                  ...prev,
                                  [voivodeship]: !prev[voivodeship]
                                }));
                              };

                              if (isVCollapsed) {
                                return [
                                  // Voivodeship header row (collapsed state)
                                  <tr 
                                    key={`v-header-${voivodeship}`} 
                                    onClick={toggleVoivodeship}
                                    className="bg-slate-100/95 border-y border-slate-200 cursor-pointer hover:bg-slate-200/80 transition-colors select-none group/row"
                                  >
                                    <td colSpan={8} className="px-4 py-2.5 font-display font-bold text-slate-800 text-xs uppercase tracking-wider">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                          <ChevronRight size={14} className="text-slate-500 shrink-0 transition-transform group-hover/row:translate-x-0.5" />
                                          <MapPin size={13} className="text-slate-400 shrink-0" />
                                          <span className="text-slate-700">{voivodeship}</span>
                                          <span className="text-slate-400 font-medium font-sans normal-case ml-1">({totalVoivodeshipDocs} {totalVoivodeshipDocs === 1 ? 'doctor' : 'doctors'})</span>
                                        </div>
                                        <span className="text-[10px] text-slate-400 normal-case font-semibold tracking-normal pr-2">
                                          Click to expand
                                        </span>
                                      </div>
                                    </td>
                                  </tr>
                                ];
                              }

                              return [
                                // Voivodeship header row (expanded state)
                                <tr 
                                  key={`v-header-${voivodeship}`} 
                                  onClick={toggleVoivodeship}
                                  className="bg-slate-100/95 border-y border-slate-200 cursor-pointer hover:bg-slate-200/80 transition-colors select-none"
                                >
                                  <td colSpan={8} className="px-4 py-2.5 font-display font-bold text-slate-800 text-xs uppercase tracking-wider">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-1.5">
                                        <ChevronDown size={14} className="text-slate-500 shrink-0" />
                                        <MapPin size={13} className="text-blue-600 shrink-0" />
                                        <span>{voivodeship}</span>
                                        <span className="text-slate-400 font-medium font-sans normal-case ml-1">({totalVoivodeshipDocs} {totalVoivodeshipDocs === 1 ? 'doctor' : 'doctors'})</span>
                                      </div>
                                      <span className="text-[10px] text-slate-400 normal-case font-normal tracking-normal pr-2">
                                        Click to collapse
                                      </span>
                                    </div>
                                  </td>
                                </tr>,
                                ...sortedCities.flatMap(city => {
                                  const cityDocs = grouped[voivodeship][city];
                                  const cityKey = `${voivodeship}-${city}`;
                                  const isCCollapsed = !!collapsedCities[cityKey];

                                  const toggleCity = () => {
                                    setCollapsedCities(prev => ({
                                      ...prev,
                                      [cityKey]: !prev[cityKey]
                                    }));
                                  };

                                  const sortedDocs = [...cityDocs].sort((a, b) => {
                                    const lastCompare = a.last_name.localeCompare(b.last_name, 'pl');
                                    if (lastCompare !== 0) return lastCompare;
                                    return a.first_name.localeCompare(b.first_name, 'pl');
                                  });

                                  if (isCCollapsed) {
                                    return [
                                      // City header row (collapsed state)
                                      <tr 
                                        key={`c-header-${voivodeship}-${city}`} 
                                        onClick={toggleCity}
                                        className="bg-slate-50 border-b border-slate-150 cursor-pointer hover:bg-slate-100/80 transition-colors select-none group/city"
                                      >
                                        <td colSpan={8} className="px-6 py-2 font-semibold text-slate-600 text-xs">
                                          <div className="flex items-center justify-between pl-2">
                                            <div className="flex items-center gap-1.5">
                                              <ChevronRight size={13} className="text-slate-400 shrink-0 transition-transform group-hover/city:translate-x-0.5" />
                                              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                                              <span className="text-slate-600">{city}</span>
                                              <span className="text-slate-400 font-normal ml-1">({cityDocs.length} {cityDocs.length === 1 ? 'contact' : 'contacts'})</span>
                                            </div>
                                            <span className="text-[10px] text-slate-400 font-semibold pr-4 normal-case">
                                              Click to expand
                                            </span>
                                          </div>
                                        </td>
                                      </tr>
                                    ];
                                  }

                                  return [
                                    // City header row (expanded state)
                                    <tr 
                                      key={`c-header-${voivodeship}-${city}`} 
                                      onClick={toggleCity}
                                      className="bg-slate-50 border-b border-slate-150 cursor-pointer hover:bg-slate-100/80 transition-colors select-none"
                                    >
                                      <td colSpan={8} className="px-6 py-2 font-semibold text-slate-600 text-xs">
                                        <div className="flex items-center justify-between pl-2">
                                          <div className="flex items-center gap-1.5">
                                            <ChevronDown size={13} className="text-slate-400 shrink-0" />
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                            <span>{city}</span>
                                            <span className="text-slate-400 font-normal ml-1">({cityDocs.length} {cityDocs.length === 1 ? 'contact' : 'contacts'})</span>
                                          </div>
                                          <span className="text-[10px] text-slate-400 font-normal pr-4 normal-case">
                                            Click to collapse
                                          </span>
                                        </div>
                                      </td>
                                    </tr>,
                                    ...sortedDocs.map(doc => {
                                      const hosp = hospitals.find(h => h.id === doc.hospital_id);
                                      const dept = departments.find(d => d.id === doc.department_id);
                                      return (
                                        <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                                          <td className="p-4 pl-12 font-semibold text-slate-950 break-words whitespace-normal">
                                            {doc.title} {doc.first_name} {doc.last_name}
                                          </td>
                                          <td className="p-4 text-slate-600 break-words whitespace-normal" title={hosp?.name || 'Brak'}>
                                            {hosp ? hosp.name : <span className="text-slate-400 italic">Nieznany</span>}
                                          </td>
                                          <td className="p-4 text-slate-500 break-words whitespace-normal">
                                            {dept ? dept.name : <span className="text-slate-400 italic">None</span>}
                                          </td>
                                          <td className="p-4">
                                            <span className="bg-blue-50 text-blue-700 border border-blue-100/50 text-[10px] font-bold px-2 py-0.5 rounded-md break-words">
                                              {doc.specialization}
                                            </span>
                                          </td>
                                          <td className="p-4 whitespace-nowrap">
                                            {(() => {
                                              const lastDocVisit = getLastVisitDateForDoctor(doc.id);
                                              return (
                                                <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md ${
                                                  lastDocVisit ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-100'
                                                }`}>
                                                  <CalendarDays size={11} className={lastDocVisit ? 'text-emerald-600' : 'text-slate-400'} />
                                                  <span>{lastDocVisit || 'None'}</span>
                                                </span>
                                              );
                                            })()}
                                          </td>
                                          <td className="p-4 font-mono text-slate-600">{doc.phone || '—'}</td>
                                          <td className="p-4 text-slate-600 break-all">{doc.email || '—'}</td>
                                          <td className="p-4 text-right pr-6">
                                            <div className="flex items-center justify-end gap-1">
                                              <button
                                                id={`btn-view-doc-u-${doc.id}`}
                                                title="Details"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setSelectedDoctorId(doc.id);
                                                  setDoctorViewState('detail');
                                                }}
                                                className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-lg transition-colors"
                                              >
                                                <Eye size={15} />
                                              </button>
                                              <button
                                                id={`btn-edit-doc-u-${doc.id}`}
                                                title="Edit"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleEditDoctorClick(doc);
                                                }}
                                                className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-blue-600 rounded-lg transition-colors"
                                              >
                                                <Edit size={15} />
                                              </button>
                                              <button
                                                id={`btn-delete-doc-u-${doc.id}`}
                                                title="Delete"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleDoctorDeleteClick(doc.id, `${doc.title} ${doc.first_name} ${doc.last_name}`);
                                                }}
                                                className="p-1.5 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-lg transition-colors"
                                              >
                                                <Trash2 size={15} />
                                              </button>
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    })
                                  ];
                                })
                              ];
                            });
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SZCZEGÓŁY LEKARZA */}
          {doctorViewState === 'detail' && selectedDoctor && (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() => setDoctorViewState('list')}
                  className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-semibold text-xs transition-colors"
                >
                  <ChevronLeft size={14} />
                  <span>Back to doctors list</span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditDoctorClick(selectedDoctor)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-sm transition-all"
                  >
                    <Edit size={13} />
                    <span>Edit doctor</span>
                  </button>
                  <button
                    onClick={() => handleDoctorDeleteClick(selectedDoctor.id, `${selectedDoctor.title} ${selectedDoctor.first_name} ${selectedDoctor.last_name}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 bg-white hover:bg-red-50 text-red-600 rounded-xl text-xs font-semibold shadow-sm transition-all"
                  >
                    <Trash2 size={13} />
                    <span>Delete doctor</span>
                  </button>
                </div>
              </div>

              {/* Informacje główne lekarza */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-4 md:max-w-xl">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-indigo-600 text-white rounded-2xl shrink-0 flex items-center justify-center font-bold text-base font-display shadow-md shadow-blue-500/10">
                      {selectedDoctor.first_name[0]}{selectedDoctor.last_name[0]}
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-xl text-slate-950 tracking-tight leading-tight">
                        {selectedDoctor.title} {selectedDoctor.first_name} {selectedDoctor.last_name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap text-xs text-slate-500">
                        <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {selectedDoctor.specialization}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="font-medium flex items-center gap-1">
                          <Building2 size={12} />
                          {selectedDoctorHospital ? selectedDoctorHospital.name : 'No assigned hospital'}
                        </span>
                        {selectedDoctorDepartment && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span className="font-medium flex items-center gap-1">
                              <Grid size={12} />
                              Department: {selectedDoctorDepartment.name}
                            </span>
                          </>
                        )}
                        <span className="text-slate-300">•</span>
                        {(() => {
                          const lastDocVisit = getLastVisitDateForDoctor(selectedDoctor.id);
                          return (
                            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                              <CalendarDays size={11} className="text-emerald-600" />
                              <span>Ostatnia wizyta: {lastDocVisit || 'brak'}</span>
                            </span>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  {selectedDoctor.notes && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-600 flex gap-2">
                      <FileText size={15} className="text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-700 block mb-0.5 uppercase tracking-wider text-[10px]">Doctor profile / contact notes:</span>
                        {selectedDoctor.notes}
                      </div>
                    </div>
                  )}
                </div>

                {/* Kanały kontaktu */}
                <div className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-5 md:w-72 shrink-0 grid grid-cols-1 gap-3 text-xs">
                  <h5 className="font-bold text-slate-700 uppercase tracking-wider text-[9px] mb-1">Contact Channels</h5>
                  
                  <div className="flex items-center gap-2.5 text-slate-600">
                    <Phone size={13} className="text-slate-400" />
                    <div>
                      <p className="text-[9px] text-slate-400 font-semibold uppercase">Phone:</p>
                      <span className="font-mono font-medium text-slate-800">{selectedDoctor.phone || 'Not provided'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 text-slate-600">
                    <Mail size={13} className="text-slate-400" />
                    <div>
                      <p className="text-[9px] text-slate-400 font-semibold uppercase">Email:</p>
                      <span className="font-medium text-slate-800">{selectedDoctor.email || 'Not provided'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* HISTORIA INTERAKCJI Z TYM LEKARZEM */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h5 className="font-display font-bold text-base text-slate-900 flex items-center gap-1.5">
                  <CalendarDays size={16} className="text-slate-600" />
                  Interaction and sales visit history ({selectedDoctorMeetings.length})
                </h5>

                <div className="space-y-2">
                  {selectedDoctorMeetings.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-6 text-center">No recorded meetings with this doctor in the CRM database.</p>
                  ) : (
                    <div className="divide-y divide-slate-100 text-xs">
                      {selectedDoctorMeetings.map(meet => {
                        const isClosed = Boolean(meet.closed_at);
                        return (
                          <div 
                            key={meet.id} 
                            onClick={() => onNavigateToMeeting(meet.id)}
                            className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50 px-2 rounded-lg transition-colors cursor-pointer"
                          >
                            <div className="flex-1">
                              <h6 className="font-bold text-slate-800">{meet.title}</h6>
                              <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5 font-medium">
                                <span className="font-mono bg-slate-100 px-1 py-0.5 rounded border border-slate-200/30">
                                  {new Date(meet.meeting_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <span>•</span>
                                <span>Facility: {selectedDoctorHospital ? selectedDoctorHospital.city : 'None'}</span>
                              </div>
                              {meet.content_markdown && (
                                <p className="text-[11px] text-slate-500 italic mt-1 line-clamp-1">
                                  "{meet.content_markdown}"
                                </p>
                              )}
                            </div>
                            <div className="shrink-0 flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                isClosed ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                              }`}>
                                {isClosed ? 'Closed' : 'Scheduled'}
                              </span>
                              <span className="text-blue-600 font-bold text-[10px]">Details →</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* FORMULARZ LEKARZA (ADD/EDIT) */}
          {(doctorViewState === 'add' || doctorViewState === 'edit') && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden max-w-2xl mx-auto">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <h4 className="font-display font-bold text-lg text-slate-900">
                  {doctorViewState === 'add' ? 'Add new doctor / contact' : 'Edit doctor details'}
                </h4>
                <button
                  onClick={() => setDoctorViewState(selectedDoctorId ? 'detail' : 'list')}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleDoctorFormSubmit} className="p-6 space-y-5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* First Name (Required) */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 uppercase tracking-wider block">
                      First Name <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      id="form-d-firstname"
                      type="text"
                      required
                      placeholder="e.g. John"
                      value={dFormFirstName}
                      onChange={(e) => setDFormFirstName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
                    />
                  </div>

                  {/* Last Name (Required) */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 uppercase tracking-wider block">
                      Last Name <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      id="form-d-lastname"
                      type="text"
                      required
                      placeholder="e.g. Smith"
                      value={dFormLastName}
                      onChange={(e) => setDFormLastName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
                    />
                  </div>

                  {/* Hospital / Facility with search (Required) */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-700 uppercase tracking-wider block">
                      Hospital / Facility <span className="text-red-500 font-bold">*</span>
                    </label>
                    <div className="relative">
                      <div className="relative flex items-center">
                        <Search size={16} className="absolute left-3 text-slate-400 pointer-events-none" />
                        <input
                          type="text"
                          placeholder="Type hospital name or city to filter list..."
                          value={dFormHospitalSearch}
                          onChange={(e) => {
                            setDFormHospitalSearch(e.target.value);
                            setIsHospitalDropdownOpen(true);
                          }}
                          onFocus={() => setIsHospitalDropdownOpen(true)}
                          className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-xs font-medium"
                        />
                        {dFormHospitalSearch && (
                          <button
                            type="button"
                            onClick={() => setDFormHospitalSearch('')}
                            className="absolute right-2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>

                      {/* Wybrany szpital badge / card */}
                      {selectedHospitalObj && (
                        <div className="mt-2 p-2.5 bg-blue-50/80 border border-blue-200 rounded-xl flex items-center justify-between gap-2">
                          <div className="flex items-start gap-2 min-w-0 flex-1">
                            <Building2 size={16} className="text-blue-600 shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-1">
                              <span className="font-bold text-slate-800 text-xs break-words whitespace-normal">{selectedHospitalObj.name}</span>
                              <span className="text-slate-500 text-[11px] ml-1.5 font-medium">({selectedHospitalObj.city})</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                              Seg {selectedHospitalObj.segment}
                            </span>
                            <button
                              type="button"
                              onClick={() => setIsHospitalDropdownOpen(!isHospitalDropdownOpen)}
                              className="text-xs text-blue-700 hover:underline font-semibold ml-1 cursor-pointer"
                            >
                              {isHospitalDropdownOpen ? 'Hide list' : 'Change facility'}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Rozwijana lista z filtrowaniem */}
                      {isHospitalDropdownOpen && (
                        <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-56 overflow-y-auto divide-y divide-slate-100">
                          {filteredFormHospitals.length === 0 ? (
                            <div className="p-3 text-slate-400 text-xs text-center">
                              No facility found matching "{dFormHospitalSearch}"
                            </div>
                          ) : (
                            filteredFormHospitals.map(h => (
                              <button
                                key={h.id}
                                type="button"
                                onClick={() => {
                                  handleDFormHospitalChange(h.id);
                                  setDFormHospitalSearch('');
                                  setIsHospitalDropdownOpen(false);
                                }}
                                className={`w-full p-2.5 text-left text-xs flex items-center justify-between gap-2 hover:bg-slate-50 transition-colors cursor-pointer ${
                                  dFormHospitalId === h.id ? 'bg-blue-50/70 font-semibold text-blue-900' : 'text-slate-700'
                                }`}
                              >
                                <div className="pr-2 min-w-0 flex-1">
                                  <div className="font-semibold text-slate-800 break-words whitespace-normal">{h.name}</div>
                                  <div className="text-[11px] text-slate-500 break-words">{h.city} &bull; {h.address}</div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                                    Seg {h.segment}
                                  </span>
                                  {dFormHospitalId === h.id && <Check size={14} className="text-blue-600 shrink-0" />}
                                </div>
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Department (Required) */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-700 uppercase tracking-wider block">
                      Department <span className="text-red-500 font-bold">*</span>
                    </label>
                    <select
                      id="form-d-dept"
                      required
                      value={dFormDepartmentId}
                      onChange={(e) => setDFormDepartmentId(e.target.value)}
                      disabled={!dFormHospitalId}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white disabled:opacity-50"
                    >
                      <option value="" disabled>
                        {dFormHospitalId ? 'Select department in facility...' : 'Select a hospital first'}
                      </option>
                      {departments.filter(d => d.hospital_id === dFormHospitalId).map(d => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.type === 'zabiegowy' ? 'Surgical' : d.type === 'zachowawczy' ? 'Conservative' : 'Diagnostics'})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Academic / professional title (Optional) */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase tracking-wider block">
                      Title <span className="text-[10px] font-normal text-slate-400 lowercase">(optional)</span>
                    </label>
                    <input
                      id="form-d-title"
                      type="text"
                      placeholder="e.g. MD, PhD, Prof."
                      value={dFormTitle}
                      onChange={(e) => setDFormTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
                    />
                  </div>

                  {/* Specialization (Optional) */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase tracking-wider block">
                      Specialization <span className="text-[10px] font-normal text-slate-400 lowercase">(optional)</span>
                    </label>
                    <input
                      id="form-d-spec"
                      type="text"
                      placeholder="e.g. Cardiology, Surgery, Orthopedics..."
                      value={dFormSpecialization}
                      onChange={(e) => setDFormSpecialization(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    />
                  </div>

                  {/* Phone (Optional) */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase tracking-wider block">
                      Phone <span className="text-[10px] font-normal text-slate-400 lowercase">(optional)</span>
                    </label>
                    <input
                      id="form-d-phone"
                      type="text"
                      placeholder="e.g. +48 500 123 456"
                      value={dFormPhone}
                      onChange={(e) => setDFormPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-mono"
                    />
                  </div>

                  {/* Email (Optional) */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase tracking-wider block">
                      Email <span className="text-[10px] font-normal text-slate-400 lowercase">(optional)</span>
                    </label>
                    <input
                      id="form-d-email"
                      type="email"
                      placeholder="e.g. john.smith@hospital.com"
                      value={dFormEmail}
                      onChange={(e) => setDFormEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    />
                  </div>

                  {/* Notes (Optional) */}
                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-bold text-slate-500 uppercase tracking-wider block">
                      Notes / Relationship profile <span className="text-[10px] font-normal text-slate-400 lowercase">(optional)</span>
                    </label>
                    <textarea
                      id="form-d-notes"
                      rows={3}
                      placeholder="Contact preferences, shift days, decision maker profile..."
                      value={dFormNotes}
                      onChange={(e) => setDFormNotes(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setDoctorViewState(selectedDoctorId ? 'detail' : 'list')}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl font-semibold text-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors shadow-sm"
                  >
                    Save contact
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      )}

      {/* MODAL ZADANIA DLA SZPITALA / KONTAKTU */}
      {isHospitalTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <CheckSquare size={16} />
                </div>
                <h3 className="font-display font-bold text-base text-slate-900">
                  {hospitalTaskEditing ? 'Edytuj zadanie' : 'Nowe zadanie dla placówki'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsHospitalTaskModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveHospitalTaskSubmit} className="p-6 space-y-4 text-xs">
              {/* Wybór szpitala */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block uppercase text-[10px] tracking-wider">
                  Szpital / Placówka *
                </label>
                <select
                  required
                  value={hTaskHospitalId}
                  onChange={(e) => {
                    setHTaskHospitalId(e.target.value);
                    setHTaskDepartmentId('');
                    setHTaskDoctorId('');
                  }}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                >
                  <option value="">Wybierz szpital...</option>
                  {hospitals.map(h => (
                    <option key={h.id} value={h.id}>{h.name} ({h.city})</option>
                  ))}
                </select>
              </div>

              {/* Wybór oddziału i lekarza */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block uppercase text-[10px] tracking-wider">
                    Oddział <span className="text-slate-400 font-normal">(opcjonalnie)</span>
                  </label>
                  <select
                    value={hTaskDepartmentId}
                    onChange={(e) => setHTaskDepartmentId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                  >
                    <option value="">Wszystkie / Nie dotyczy</option>
                    {departments
                      .filter(d => !hTaskHospitalId || d.hospital_id === hTaskHospitalId)
                      .map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block uppercase text-[10px] tracking-wider">
                    Lekarz <span className="text-slate-400 font-normal">(opcjonalnie)</span>
                  </label>
                  <select
                    value={hTaskDoctorId}
                    onChange={(e) => setHTaskDoctorId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                  >
                    <option value="">Wszyscy / Nie dotyczy</option>
                    {doctors
                      .filter(doc => (!hTaskHospitalId || doc.hospital_id === hTaskHospitalId) && (!hTaskDepartmentId || doc.department_id === hTaskDepartmentId))
                      .map(doc => (
                        <option key={doc.id} value={doc.id}>
                          {doc.title ? `${doc.title} ` : ''}{doc.first_name} {doc.last_name} ({doc.specialization})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Wybór powiązanej wizyty (opcjonalnie) */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block uppercase text-[10px] tracking-wider">
                  Powiązana wizyta handlowa <span className="text-slate-400 font-normal">(opcjonalnie)</span>
                </label>
                <select
                  value={hTaskMeetingId}
                  onChange={(e) => setHTaskMeetingId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                >
                  <option value="">Brak powiązanej wizyty</option>
                  {meetings
                    .filter(m => !hTaskHospitalId || m.hospital_id === hTaskHospitalId)
                    .map(m => (
                      <option key={m.id} value={m.id}>
                        {m.title} ({new Date(m.meeting_date).toLocaleDateString('pl-PL')})
                      </option>
                    ))}
                </select>
              </div>

              {/* Opis zadania */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block uppercase text-[10px] tracking-wider">
                  Treść zadania / Ustalenia *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="np. Przesłać ofertę na cewniki, ponowić kontakt z ordynatorem po przetargu..."
                  value={hTaskDescription}
                  onChange={(e) => setHTaskDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none text-slate-800"
                />
              </div>

              {/* Termin wykonania */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block uppercase text-[10px] tracking-wider">
                  Termin wykonania (Due date)
                </label>
                <input
                  type="date"
                  value={hTaskDueDate}
                  onChange={(e) => setHTaskDueDate(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsHospitalTaskModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl font-semibold text-slate-700 transition-colors cursor-pointer"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors shadow-sm cursor-pointer"
                >
                  {hospitalTaskEditing ? 'Zapisz zmiany' : 'Dodaj zadanie'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL FOLLOW-UP PROMPT PO UKOŃCZENIU ZADANIA */}
      {completedTaskForPrompt && (
        <FollowUpPromptModal
          task={completedTaskForPrompt}
          meetings={meetings}
          hospitals={hospitals}
          departments={departments}
          doctors={doctors}
          onClose={() => setCompletedTaskForPrompt(null)}
          onConfirmAddFollowUp={handleConfirmAddFollowUp}
        />
      )}

    </div>
  );
}
