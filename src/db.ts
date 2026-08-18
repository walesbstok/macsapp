import { Hospital, Department, Doctor, Meeting, Task, MeetingStatus, PipelineStatus, DepartmentType, PRESET_PRODUCTS, SystemSettings, CrmUser, Trip, TripDay, Visit } from './types';
import { rawHospitals } from './hospitalData';
import { db } from './firebase';
import { collection, doc, setDoc, deleteDoc, getDocs, onSnapshot } from 'firebase/firestore';
import { processSeedReports } from './seedData';

const STORAGE_KEYS = {
  HOSPITALS: 'med_crm_hospitals',
  DEPARTMENTS: 'med_crm_departments',
  DOCTORS: 'med_crm_doctors',
  MEETINGS: 'med_crm_meetings',
  TASKS: 'med_crm_tasks',
  INITIALIZED: 'med_crm_initialized_v2026_08_11_restored_v2',
  SETTINGS: 'med_crm_settings',
  USERS: 'med_crm_users',
  TRIPS: 'med_crm_trips_v1',
  TRIP_DAYS: 'med_crm_trip_days_v1',
  VISITS: 'med_crm_visits_v1',
};

export const PRIMARY_ADMIN_USER: CrmUser = {
  id: 'usr_lukasz_w',
  name: 'Łukasz W.',
  email: 'lukasz.w@macsmedical.eu',
  role: 'admin',
  isActive: true,
  created_at: '2026-01-01T00:00:00.000Z',
  password: 'Macs123',
  mustChangePassword: false
};

export const DEMO_EMAILS: string[] = [];

export function isDemoUserLoggedIn(): boolean {
  return false;
}

// Helper to remove 'undefined' values which cause Firebase Firestore setDoc to fail
export function sanitizeForFirestore(obj: any): any {
  if (obj === null || obj === undefined) return null;
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeForFirestore(item));
  }
  if (typeof obj === 'object') {
    const clean: any = {};
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (val !== undefined) {
        clean[key] = sanitizeForFirestore(val);
      }
    }
    return clean;
  }
  return obj;
}

// Pomocniki do synchronizacji z Firebase Firestore
export async function syncDocToFirestore(collectionName: string, id: string, data: any) {
  try {
    const cleanData = sanitizeForFirestore(data);
    await setDoc(doc(db, collectionName, id), cleanData, { merge: true });
  } catch (err) {
    console.error(`Firebase Firestore sync error (${collectionName}/${id}):`, err);
  }
}

export async function deleteDocFromFirestore(collectionName: string, id: string) {
  try {
    await deleteDoc(doc(db, collectionName, id));
  } catch (err) {
    console.error(`Firebase Firestore delete error (${collectionName}/${id}):`, err);
  }
}

export async function resetLocalStateFromFirestore() {
  try {
    const seedMap: Record<string, string> = {
      hospitals: STORAGE_KEYS.HOSPITALS,
      departments: STORAGE_KEYS.DEPARTMENTS,
      doctors: STORAGE_KEYS.DOCTORS,
      meetings: STORAGE_KEYS.MEETINGS,
      tasks: STORAGE_KEYS.TASKS,
      users: STORAGE_KEYS.USERS,
      trips: STORAGE_KEYS.TRIPS,
      trip_days: STORAGE_KEYS.TRIP_DAYS,
      visits: STORAGE_KEYS.VISITS,
    };

    for (const [colName, storageKey] of Object.entries(seedMap)) {
      const snap = await getDocs(collection(db, colName));
      const items: any[] = [];
      snap.forEach(docSnap => {
        items.push(docSnap.data());
      });
      localStorage.setItem(storageKey, JSON.stringify(items));
    }
  } catch (err) {
    console.error('Error resetting local state from Firestore:', err);
  }
}

export async function seedFirestoreIfEmpty() {
  try {
    const hospSnap = await getDocs(collection(db, 'hospitals'));
    if (hospSnap.empty) {
      console.log('Firestore is empty. Syncing initial data to Firebase Cloud Firestore...');
      const seedMap: Record<string, string> = {
        hospitals: STORAGE_KEYS.HOSPITALS,
        departments: STORAGE_KEYS.DEPARTMENTS,
        doctors: STORAGE_KEYS.DOCTORS,
        meetings: STORAGE_KEYS.MEETINGS,
        tasks: STORAGE_KEYS.TASKS,
        users: STORAGE_KEYS.USERS,
        trips: STORAGE_KEYS.TRIPS,
        trip_days: STORAGE_KEYS.TRIP_DAYS,
        visits: STORAGE_KEYS.VISITS,
      };

      for (const [colName, storageKey] of Object.entries(seedMap)) {
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          try {
            const items = JSON.parse(raw);
            if (Array.isArray(items)) {
              for (const item of items) {
                if (item.id) {
                  await setDoc(doc(db, colName, item.id), sanitizeForFirestore(item));
                }
              }
            }
          } catch (e) {
            console.error(`Error seeding collection ${colName}:`, e);
          }
        }
      }

      const settingsRaw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (settingsRaw) {
        try {
          await setDoc(doc(db, 'settings', 'systemSettings'), sanitizeForFirestore(JSON.parse(settingsRaw)));
        } catch (e) {
          console.error('Error seeding settings:', e);
        }
      }
      console.log('Firebase Cloud Firestore successfully initialized!');
    } else {
      // Sync any missing seed meetings/tasks/doctors/departments from seed data to Firestore
      const seedMap: Record<string, string> = {
        departments: STORAGE_KEYS.DEPARTMENTS,
        doctors: STORAGE_KEYS.DOCTORS,
        meetings: STORAGE_KEYS.MEETINGS,
        tasks: STORAGE_KEYS.TASKS,
      };
      for (const [colName, storageKey] of Object.entries(seedMap)) {
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          try {
            const items = JSON.parse(raw);
            if (Array.isArray(items)) {
              for (const item of items) {
                if (item.id) {
                  await setDoc(doc(db, colName, item.id), sanitizeForFirestore(item), { merge: true });
                }
              }
            }
          } catch (e) {
            console.error(`Error ensuring items in ${colName}:`, e);
          }
        }
      }
    }
  } catch (err) {
    console.error('Firestore check/seed error:', err);
  }
}

export function subscribeToFirestore(onUpdate: () => void) {
  const collectionsToWatch = [
    { key: STORAGE_KEYS.HOSPITALS, col: 'hospitals' },
    { key: STORAGE_KEYS.DEPARTMENTS, col: 'departments' },
    { key: STORAGE_KEYS.DOCTORS, col: 'doctors' },
    { key: STORAGE_KEYS.MEETINGS, col: 'meetings' },
    { key: STORAGE_KEYS.TASKS, col: 'tasks' },
    { key: STORAGE_KEYS.USERS, col: 'users' },
    { key: STORAGE_KEYS.TRIPS, col: 'trips' },
    { key: STORAGE_KEYS.TRIP_DAYS, col: 'trip_days' },
    { key: STORAGE_KEYS.VISITS, col: 'visits' },
  ];

  const unsubscribes = collectionsToWatch.map(({ key, col }) => {
    return onSnapshot(collection(db, col), (snapshot) => {
      let items: any[] = [];
      if (!snapshot.empty) {
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data());
        });
      }

      if (col === 'users') {
        const demo = PRIMARY_ADMIN_USER;
        if (!items.some((u: any) => u.email && u.email.toLowerCase() === demo.email.toLowerCase())) {
          items.push(demo);
          syncDocToFirestore('users', demo.id, demo);
        }
      }

      localStorage.setItem(key, JSON.stringify(items));
      onUpdate();
    }, (err) => {
      console.warn(`Firestore subscription warning for ${col}:`, err);
    });
  });

  const unsubSettings = onSnapshot(doc(db, 'settings', 'systemSettings'), (docSnap) => {
    if (docSnap.exists()) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(docSnap.data()));
      onUpdate();
    }
  }, (err) => {
    console.warn('Firestore subscription warning for settings:', err);
  });

  return () => {
    unsubscribes.forEach(unsub => unsub());
    unsubSettings();
  };
}

// Pomocnik do obliczania dynamicznych statusów spotkań
export function getMeetingStatus(meeting: Meeting): MeetingStatus {
  if (meeting.closed_at && meeting.closed_at !== null && meeting.closed_at !== '') {
    return 'closed';
  }

  const meetingDate = new Date(meeting.meeting_date);
  const now = new Date();

  if (meetingDate > now) {
    return 'scheduled';
  }

  // Spotkanie minęło. Obliczamy ile godzin temu.
  const diffMs = now.getTime() - meetingDate.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 24) {
    return 'to_close';
  } else {
    return 'overdue';
  }
}

// Synchronizacja brakujących rekordów z seedData do istniejącej bazy
export function syncMissingSeedData() {
  try {
    const rawHosp = localStorage.getItem(STORAGE_KEYS.HOSPITALS);
    const rawDept = localStorage.getItem(STORAGE_KEYS.DEPARTMENTS);
    if (!rawHosp || !rawDept) return;

    const hospitals: Hospital[] = JSON.parse(rawHosp);
    let departments: Department[] = JSON.parse(rawDept);

    const seed = processSeedReports(hospitals, departments);

    // 1. Scal oddziały
    let deptsModified = false;
    seed.departments.forEach(sd => {
      if (!departments.some(d => d.id === sd.id)) {
        departments.push(sd);
        deptsModified = true;
        syncDocToFirestore('departments', sd.id, sd);
      }
    });
    if (deptsModified) {
      setItem(STORAGE_KEYS.DEPARTMENTS, departments);
    }

    // 2. Scal lekarzy
    const doctors = getDoctors();
    let docsModified = false;
    seed.doctors.forEach(sDoc => {
      const existingIdx = doctors.findIndex(d => 
        d.id === sDoc.id || 
        (d.hospital_id === sDoc.hospital_id && 
         d.first_name.toLowerCase() === sDoc.first_name.toLowerCase() && 
         d.last_name.toLowerCase() === sDoc.last_name.toLowerCase())
      );
      if (existingIdx === -1) {
        doctors.push(sDoc);
        docsModified = true;
        syncDocToFirestore('doctors', sDoc.id, sDoc);
      }
    });
    if (docsModified) {
      setItem(STORAGE_KEYS.DOCTORS, doctors);
    }

    // 3. Scal spotkania
    const meetings = getMeetings();
    let meetingsModified = false;
    seed.meetings.forEach(sMeet => {
      const existing = meetings.find(m => m.id === sMeet.id);
      if (!existing) {
        meetings.push(sMeet);
        meetingsModified = true;
        syncDocToFirestore('meetings', sMeet.id, sMeet);
      }
    });
    if (meetingsModified) {
      setItem(STORAGE_KEYS.MEETINGS, meetings);
    }

    // 4. Scal zadania
    const tasks = getTasks();
    let tasksModified = false;
    seed.tasks.forEach(sTask => {
      const existing = tasks.find(t => t.id === sTask.id || (t.meeting_id === sTask.meeting_id && t.description === sTask.description));
      if (!existing) {
        tasks.push(sTask);
        tasksModified = true;
        syncDocToFirestore('tasks', sTask.id, sTask);
      }
    });
    if (tasksModified) {
      setItem(STORAGE_KEYS.TASKS, tasks);
    }
  } catch (err) {
    console.error('Error in syncMissingSeedData:', err);
  }
}

// Inicjalizacja bazy danych nasionami (seed)
export function initializeDatabase(force = false) {
  const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  
  if (isInitialized && !force) {
    syncMissingSeedData();
    return;
  }

  const now = new Date();

  // 1. Szpitale (na podstawie rawHospitals)
  const hospitals: Hospital[] = rawHospitals.map((raw, idx) => {
    const phonePrefix = raw.voivodeship === 'Lubelskie' ? '+48 81'
                       : raw.voivodeship === 'Podlaskie' ? '+48 85'
                       : raw.voivodeship === 'Warmińsko-Mazurskie' ? '+48 89'
                       : '+48 22';
    
    let pipeline_status: PipelineStatus = 'prospect';
    if (idx % 5 === 0) pipeline_status = 'active';
    else if (idx % 7 === 0) pipeline_status = 'key_account';
    else if (idx % 12 === 0) pipeline_status = 'inactive';

    const citySlug = raw.city.toLowerCase().replace(/[^a-z0-9]/g, '') || 'hospital';

    return {
      id: `hosp_${idx + 1}`,
      name: raw.name,
      address: raw.address,
      city: raw.city,
      voivodeship: raw.voivodeship,
      phone: `${phonePrefix} ${Math.floor(100 + Math.random() * 900)} ${Math.floor(10 + Math.random() * 90)} ${Math.floor(10 + Math.random() * 90)}`,
      email: `office@spzoz-${citySlug}.pl`,
      website: `www.spzoz-${citySlug}.pl`,
      pipeline_status,
      lat: raw.lat,
      lng: raw.lng,
      notes: '',
      created_at: new Date(now.getTime() - (30 + (idx % 60)) * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(now.getTime() - (1 + (idx % 5)) * 24 * 60 * 60 * 1000).toISOString(),
    };
  });

  // 2. Oddziały (na podstawie rawHospitals i ich departments)
  let departments: Department[] = [];
  rawHospitals.forEach((raw, hospIdx) => {
    raw.departments.forEach((deptName, deptIdx) => {
      let type: DepartmentType = 'zabiegowy';
      const nameLower = deptName.toLowerCase();
      if (nameLower.includes('diagnostyk') || nameLower.includes('obrazow') || nameLower.includes('radiolog') || nameLower.includes('usg') || nameLower.includes('mri')) {
        type = 'diagnostyczny';
      } else if (nameLower.includes('wewnętrz') || nameLower.includes('interna') || nameLower.includes('nefrolog') || nameLower.includes('diabetolog') || nameLower.includes('geriatr') || nameLower.includes('nefrologii')) {
        type = 'zachowawczy';
      }

      departments.push({
        id: `dept_${hospIdx + 1}_${deptIdx + 1}`,
        hospital_id: `hosp_${hospIdx + 1}`,
        name: deptName,
        type,
        created_at: new Date(now.getTime() - (100 + (hospIdx % 30)) * 24 * 60 * 60 * 1000).toISOString(),
      });
    });
  });

  departments.push(
    { id: "dept_45_pharmacy", hospital_id: "hosp_45", name: "Apteka Szpitalna", type: "diagnostyczny", created_at: now.toISOString() },
    { id: "dept_45_or", hospital_id: "hosp_45", name: "Blok Operacyjny", type: "zabiegowy", created_at: now.toISOString() },
    { id: "dept_45_oph", hospital_id: "hosp_45", name: "Oddział Okulistyczny", type: "zabiegowy", created_at: now.toISOString() },
    { id: "dept_45_onco", hospital_id: "hosp_45", name: "Oddział Onkologiczny", type: "zachowawczy", created_at: now.toISOString() },
    { id: "dept_45_ster", hospital_id: "hosp_45", name: "Centralna Sterylizatornia", type: "diagnostyczny", created_at: now.toISOString() },
    { id: "dept_49_ster", hospital_id: "hosp_49", name: "Centralna Sterylizatornia", type: "diagnostyczny", created_at: now.toISOString() }
  );

  hospitals.forEach((h) => {
    const hospDepts = departments.filter(d => d.hospital_id === h.id);
    const hasOr = hospDepts.some(d => d.name.toLowerCase().includes('blok operacyj') || d.name.toLowerCase().includes('operating block'));
    const hasSter = hospDepts.some(d => d.name.toLowerCase().includes('steryliz') || d.name.toLowerCase().includes('steriliz'));

    if (!hasOr) {
      departments.push({
        id: `dept_${h.id.replace('hosp_', '')}_or_auto`,
        hospital_id: h.id,
        name: "Blok Operacyjny",
        type: "zabiegowy",
        created_at: now.toISOString()
      });
    }

    if (!hasSter) {
      departments.push({
        id: `dept_${h.id.replace('hosp_', '')}_ster_auto`,
        hospital_id: h.id,
        name: "Centralna Sterylizatornia",
        type: "diagnostyczny",
        created_at: now.toISOString()
      });
    }
  });

  const defaultSettings: SystemSettings = {
    brandName: "Mac's CRM",
    enableMeetingApprovals: true,
    defaultMapLat: 53.1325,
    defaultMapLng: 23.1510,
    productsList: [...PRESET_PRODUCTS]
  };

  const defaultUsers: CrmUser[] = [PRIMARY_ADMIN_USER];

  // 3. Lekarze, spotkania, zadania z raportów z wizyt
  const seed = processSeedReports(hospitals, departments);
  const doctors = seed.doctors;
  const meetings = seed.meetings;
  const tasks = seed.tasks;
  departments = seed.departments;
  const trips: Trip[] = [];
  const tripDays: TripDay[] = [];
  const visits: Visit[] = [];

  localStorage.setItem(STORAGE_KEYS.HOSPITALS, JSON.stringify(hospitals));
  localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(departments));
  localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(doctors));
  localStorage.setItem(STORAGE_KEYS.MEETINGS, JSON.stringify(meetings));
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
  localStorage.setItem(STORAGE_KEYS.TRIP_DAYS, JSON.stringify(tripDays));
  localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(visits));
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
  localStorage.setItem(STORAGE_KEYS.INITIALIZED, STORAGE_KEYS.INITIALIZED);

  // Synchronizacja kolekcji do Cloud Firestore
  hospitals.forEach(h => syncDocToFirestore('hospitals', h.id, h));
  departments.forEach(d => syncDocToFirestore('departments', d.id, d));
  doctors.forEach(docItem => syncDocToFirestore('doctors', docItem.id, docItem));
  meetings.forEach(m => syncDocToFirestore('meetings', m.id, m));
  tasks.forEach(t => syncDocToFirestore('tasks', t.id, t));
  defaultUsers.forEach(u => syncDocToFirestore('users', u.id, u));
  syncDocToFirestore('settings', 'systemSettings', defaultSettings);
}

export async function purgeUserCollectionsFromFirestore() {
  try {
    const collectionsToPurge = ['doctors', 'meetings', 'tasks', 'visits', 'trips', 'trip_days'];
    for (const colName of collectionsToPurge) {
      const snap = await getDocs(collection(db, colName));
      for (const docSnap of snap.docs) {
        await deleteDoc(doc(db, colName, docSnap.id));
      }
    }
    console.log('Successfully purged doctors, meetings, tasks, visits, trips from Firestore.');
  } catch (err) {
    console.error('Error purging Firestore collections:', err);
  }
}

// Funkcje dostępu do danych z obsługą błędów i automatycznej inicjalizacji
function getParsedItem<T>(key: string, defaultValue: T[]): T[] {
  const val = localStorage.getItem(key);
  if (!val) return defaultValue;
  try {
    return JSON.parse(val) as T[];
  } catch (e) {
    console.error('Error parsing storage key:', key, e);
    return defaultValue;
  }
}

function setItem<T>(key: string, items: T[]) {
  localStorage.setItem(key, JSON.stringify(items));
}

export function toPolishVoivodeship(v: string): string {
  if (!v) return v;
  if (v.includes('Lublin')) return 'Lubelskie';
  if (v.includes('Podlaskie')) return 'Podlaskie';
  if (v.includes('Warmian') || v.includes('Warmińsko')) return 'Warmińsko-Mazurskie';
  if (v.includes('Masovian') || v.includes('Mazowieckie')) return 'Mazowieckie';
  if (v.includes('Pomeranian') || v.includes('Pomorskie')) return 'Pomorskie';
  return v;
}

export function toPolishDepartmentName(name: string): string {
  if (!name) return name;
  let n = name;

  n = n.replace(/General Surgery Department with Intensive Postoperative Care/gi, "Oddział Chirurgiczny Ogólny z Pododdziałem Intensywnej Opieki Pooperacyjnej");
  n = n.replace(/General Surgery Department with Endoscopic Surgery Subunit/gi, "Oddział Chirurgiczny Ogólny z Pododdziałem Chirurgii Endoskopowej");
  n = n.replace(/General Surgery Department with Urology Subunit/gi, "Oddział Chirurgiczny Ogólny z Pododdziałem Urologicznym");
  n = n.replace(/1st Department of Surgical Oncology/gi, "I Oddział Chirurgii Onkologicznej");
  n = n.replace(/2nd Department of Gastrointestinal Surgical Oncology/gi, "II Oddział Chirurgii Onkologicznej Przewodu Pokarmowego");
  n = n.replace(/General Surgery Department with Orthopedic Trauma Subunit/gi, "Oddział Chirurgii Ogólnej z Pododdziałem Urazowo-Ortopedycznym");
  n = n.replace(/Pediatric Surgery and Traumatology Department/gi, "Oddział Chirurgii i Traumatologii Dziecięcej");
  n = n.replace(/Vascular Surgery and Angiology Department/gi, "Oddział Chirurgii Naczyniowej i Angiologii");
  n = n.replace(/General, Gastrointestinal and Oncological Surgery Department/gi, "Oddział Chirurgii Ogólnej, Gastroenterologicznej i Nowotworów Przewodu Pokarmowego");
  n = n.replace(/Clinical Thoracic Surgery Department/gi, "Kliniczny Oddział Chirurgii Klatki Piersiowej");
  n = n.replace(/Clinical Vascular Surgery Department/gi, "Kliniczny Oddział Chirurgii Naczyniowej");
  n = n.replace(/Clinical General Surgery and Nutritional Therapy Department/gi, "Kliniczny Oddział Chirurgii Ogólnej i Leczenia Żywieniowego");
  n = n.replace(/Clinical General, Plastic, Reconstructive and Microsurgery Department/gi, "Kliniczny Oddział Chirurgii Ogólnej, Plastycznej, Rekonstrukcyjnej i Mikrochirurgii");
  n = n.replace(/Clinical Neurosurgery Department/gi, "Kliniczny Oddział Neurochirurgii");
  n = n.replace(/Clinical Transplantology Department/gi, "Kliniczny Oddział Transplantologii");
  n = n.replace(/Clinical Urology and Urological Oncology Department/gi, "Kliniczny Oddział Urologii i Onkologii Urologicznej");
  n = n.replace(/Clinical Cardiosurgery Department/gi, "Kliniczny Oddział Kardiochirurgii");
  n = n.replace(/Urology and Urological Oncology Department with Kidney Stone Treatment Center/gi, "Oddział Urologii i Onkologii Urologicznej z Centrum Leczenia Kamicy Układu Moczowego");
  n = n.replace(/General and Oncological Surgery Department with Thoracic Surgery Subunit/gi, "Oddział Chirurgii Ogólnej i Onkologicznej z Pododdziałem Chirurgii Klatki Piersiowej");
  n = n.replace(/General and Minimally Invasive Surgery Department/gi, "Oddział Chirurgii Ogólnej i Minimalnie Inwazyjnej");
  n = n.replace(/Eastern Center for Burn Treatment and Reconstructive Surgery/gi, "Wschodnie Centrum Leczenia Oparzeń i Chirurgii Rekonstrukcyjnej");
  n = n.replace(/General and Trauma Surgery Department/gi, "Oddział Chirurgii Ogólnej i Urazowej");
  n = n.replace(/Surgical-Trauma Department with Gynecology Subunit/gi, "Oddział Chirurgiczno-Urazowy z Pododdziałem Ginekologicznym");
  n = n.replace(/General Surgery Department with Orthopedic-Trauma and Gynecology Profile/gi, "Oddział Chirurgii Ogólnej z Profilem Urazowo-Ortopedycznym i Ginekologicznym");
  n = n.replace(/Breast Surgery and Reconstruction Department/gi, "Oddział Chirurgii Piersi i Rekonstrukcji");
  n = n.replace(/Oncological Surgery and General Surgery Department/gi, "Oddział Chirurgii Onkologicznej i Chirurgii Ogólnej");
  n = n.replace(/General, Minimally Invasive and Oncological Surgery Department/gi, "Oddział Chirurgii Ogólnej, Małoinwazyjnej i Onkologicznej");
  n = n.replace(/Urological Oncology and General Urology Department/gi, "Oddział Urologii Onkologicznej i Ogólnej");
  n = n.replace(/Pediatric Surgery and Urology Clinic with Pediatric Ophthalmology Subunit/gi, "Klinika Chirurgii i Urologii Dziecięcej z Pododdziałem Okulistyki Dziecięcej");
  n = n.replace(/1st General, Oncological and Endocrinological Surgery Clinic/gi, "I Klinika Chirurgii Ogólnej, Onkologicznej i Endokrynologicznej");
  n = n.replace(/1st Nephrology, Transplantology and Internal Medicine Clinic with Dialysis Center/gi, "I Klinika Nefrologii, Transplantologii i Chorób Wewnętrznych z Ośrodkiem Dializ");
  n = n.replace(/2nd General, Gastrointestinal and Oncological Surgery Clinic/gi, "II Klinika Chirurgii Ogólnej, Gastroenterologicznej i Onkologicznej");
  n = n.replace(/Vascular Surgery and Transplantation Clinic/gi, "Klinika Chirurgii Naczyń i Transplantacji");
  n = n.replace(/Cardiosurgery Clinic with Operating Theatre/gi, "Klinika Kardiochirurgii z Blokiem Operacyjnym");
  n = n.replace(/Surgery Department with Vascular Surgery Subunit/gi, "Oddział Chirurgiczny z Pododdziałem Chirurgii Naczyniowej");
  n = n.replace(/Laparoscopic and Classical Surgery Department with Surgical Treatment of Obesity/gi, "Oddział Chirurgii Laparoskopowej i Klasycznej z Chirurgicznym Leczeniem Otyłości");
  n = n.replace(/General Surgery Department with Orthopedics and Musculoskeletal Traumatology/gi, "Oddział Chirurgii Ogólnej z Pododdziałem Ortopedii i Traumatologii Narządu Ruchu");
  n = n.replace(/Surgery Department with Surgical Oncology and Vascular Surgery/gi, "Oddział Chirurgiczny z Pododdziałem Chirurgii Onkologicznej i Naczyniowej");
  n = n.replace(/General Surgery Department with Pain Management Beds/gi, "Oddział Chirurgiczny Ogólny z Łóżkami Leczenia Bólu");
  n = n.replace(/Surgery Department with Orthopedic Subunit/gi, "Oddział Chirurgiczny z Pododdziałem Ortopedycznym");
  n = n.replace(/Surgical Oncology Department with Breast Surgery Subunit/gi, "Oddział Chirurgii Onkologicznej z Pododdziałem Chirurgii Piersi");
  n = n.replace(/Neurosurgery, Neurotraumatology and Spine Surgery Department/gi, "Oddział Neurochirurgii, Neurotraumatologii i Chirurgii Kręgosłupa");
  n = n.replace(/General Surgery Department - One Day Hospitalization/gi, "Oddział Chirurgii Ogólnej-Hospitalizacja Jednodniowa");
  n = n.replace(/Surgical Oncology and General Clinic with Urology Subunit/gi, "Klinika Chirurgii Onkologicznej i Ogólnej z Pododdziałem Urologicznym");
  n = n.replace(/Clinical Department of Pediatric Surgery and Urology/gi, "Oddział Kliniczny Chirurgii i Urologii Dziecięcej z Ośrodkiem Leczenia Zmian Naczyniowych");
  n = n.replace(/Surgery Department with Orthopedic-Trauma Subunit/gi, "Oddział Chirurgiczny z Pododdziałem Urazowo-Ortopedycznym");
  n = n.replace(/General Surgery Department with Orthopedic-Trauma Subunit/gi, "Oddział Chirurgiczny Ogólny z Pododdziałem Chirurgii Urazowo-Ortopedycznej");
  n = n.replace(/General, Oncological and Bariatric Surgery Department/gi, "Oddział Chirurgii Ogólnej, Onkologicznej i Bariatrycznej");
  n = n.replace(/General Surgery Department Named after Dr Jerzy Olszewski/gi, "Oddział Chirurgii Ogólnej Im Dr Jerzego Olszewskiego");
  n = n.replace(/Multiprofile Treatment Department/gi, "Oddział Wieloprofilowy-Zabiegowy");
  n = n.replace(/Operating Block|Operating Theatre/gi, "Blok Operacyjny");
  n = n.replace(/Central Sterilization Department|Sterilization Department/gi, "Centralna Sterylizatornia");
  n = n.replace(/Pharmacy/gi, "Apteka Szpitalna");
  n = n.replace(/Ophthalmology Department/gi, "Oddział Okulistyczny");
  n = n.replace(/Oncology Department/gi, "Oddział Onkologiczny");
  n = n.replace(/Surgery Department/gi, "Oddział Chirurgiczny");
  n = n.replace(/Neurosurgery Department/gi, "Oddział Neurochirurgiczny");
  n = n.replace(/Urology Department/gi, "Oddział Urologiczny");
  n = n.replace(/Surgical Oncology Subunit/gi, "Pododdział Chirurgii Onkologicznej");
  n = n.replace(/Surgery Department with Laryngology Subunit/gi, "Oddział Chirurgiczny z Pododdziałem Laryngologicznym");
  n = n.replace(/General Surgery Department/gi, "Oddział Chirurgii Ogólnej");
  n = n.replace(/Plastic Surgery Department/gi, "Oddział Chirurgii Plastycznej");
  n = n.replace(/Surgical Oncology Department/gi, "Oddział Chirurgii Onkologicznej");
  n = n.replace(/Breast Surgery Department/gi, "Oddział Chirurgii Piersi");
  n = n.replace(/Traumatology Department/gi, "Oddział Traumatologii");
  n = n.replace(/Neurosurgery Clinic/gi, "Klinika Neurochirurgii");
  n = n.replace(/Urology and Urological Oncology Clinic/gi, "Klinika Urologii i Urologii Onkologicznej");
  n = n.replace(/Thoracic Surgery Clinic/gi, "Klinika Chirurgii Klatki Piersiowej");
  n = n.replace(/Surgical Oncology Clinic/gi, "Klinika Chirurgii Onkologicznej");
  n = n.replace(/Clinical Department of General Surgery with Breast Diseases/gi, "Oddział Kliniczny Chirurgii Ogólnej z Pododdziałem Chorób Piersi");
  n = n.replace(/Thoracic Surgery Department/gi, "Oddział Chirurgii Klatki Piersiowej");
  n = n.replace(/Cardiosurgery Department/gi, "Oddział Kardiochirurgiczny");
  n = n.replace(/Transplantology Department/gi, "Oddział Transplantologiczny");
  n = n.replace(/Urology Subunit/gi, "Pododdział Urologiczny");

  return n;
}

// SZPITALE (Hospitals)
export function getHospitals(): Hospital[] {
  let rawHospitalsList = getParsedItem<Hospital>(STORAGE_KEYS.HOSPITALS, []);
  let departments = getDepartments();

  if (!localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
    initializeDatabase(true);
    rawHospitalsList = getParsedItem<Hospital>(STORAGE_KEYS.HOSPITALS, []);
    departments = getDepartments();
  }

  return rawHospitalsList.map(h => {
    const voivodeship = toPolishVoivodeship(h.voivodeship);
    const hospDepts = departments.filter(d => d.hospital_id === h.id);
    const segmentDepts = hospDepts.filter(d => {
      const nameLower = d.name.toLowerCase();
      return !nameLower.includes('steryliz') && 
             !nameLower.includes('blok operacyj') && 
             !nameLower.includes('steril') && 
             !nameLower.includes('operating');
    });
    const count = segmentDepts.length;
    let segment: 'A' | 'B' | 'C' = 'C';
    if (count >= 3) {
      segment = 'A';
    } else if (count === 2) {
      segment = 'B';
    } else {
      segment = 'C';
    }
    return {
      ...h,
      voivodeship,
      segment
    };
  });
}

export function saveHospital(hospital: Hospital): Hospital {
  const hospitals = getHospitals();
  const idx = hospitals.findIndex(h => h.id === hospital.id);
  const now = new Date().toISOString();
  let saved: Hospital;
  
  if (idx >= 0) {
    saved = { ...hospital, updated_at: now };
    hospitals[idx] = saved;
  } else {
    saved = { ...hospital, created_at: hospital.created_at || now, updated_at: now };
    hospitals.push(saved);
  }
  setItem(STORAGE_KEYS.HOSPITALS, hospitals);
  syncDocToFirestore('hospitals', saved.id, saved);
  return saved;
}

export function deleteHospital(id: string) {
  const hospitals = getHospitals().filter(h => h.id !== id);
  setItem(STORAGE_KEYS.HOSPITALS, hospitals);
  deleteDocFromFirestore('hospitals', id);
}

// ODDZIAŁY (Departments)
export function getDepartments(): Department[] {
  let depts = getParsedItem<Department>(STORAGE_KEYS.DEPARTMENTS, []);
  if (!localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
    initializeDatabase(true);
    depts = getParsedItem<Department>(STORAGE_KEYS.DEPARTMENTS, []);
  }
  return depts;
}

export function getHospitalDepartments(hospitalId: string): Department[] {
  return getDepartments().filter(d => d.hospital_id === hospitalId);
}

export function saveDepartment(department: Department): Department {
  const departments = getDepartments();
  const idx = departments.findIndex(d => d.id === department.id);
  let saved: Department;
  if (idx >= 0) {
    saved = department;
    departments[idx] = saved;
  } else {
    saved = department;
    departments.push(saved);
  }
  setItem(STORAGE_KEYS.DEPARTMENTS, departments);
  syncDocToFirestore('departments', saved.id, saved);
  return saved;
}

export function deleteDepartment(id: string) {
  const depts = getDepartments().filter(d => d.id !== id);
  setItem(STORAGE_KEYS.DEPARTMENTS, depts);
  deleteDocFromFirestore('departments', id);
}

// LEKARZE (Doctors)
export function getDoctors(): Doctor[] {
  return getParsedItem<Doctor>(STORAGE_KEYS.DOCTORS, []);
}

export function saveDoctor(doctor: Doctor): Doctor {
  const doctors = getDoctors();
  const idx = doctors.findIndex(d => d.id === doctor.id);
  const now = new Date().toISOString();
  let saved: Doctor;

  if (idx >= 0) {
    saved = { ...doctor, updated_at: now };
    doctors[idx] = saved;
  } else {
    saved = { ...doctor, created_at: doctor.created_at || now, updated_at: now };
    doctors.push(saved);
  }
  setItem(STORAGE_KEYS.DOCTORS, doctors);
  syncDocToFirestore('doctors', saved.id, saved);
  return saved;
}

export function deleteDoctor(id: string) {
  const docs = getDoctors().filter(d => d.id !== id);
  setItem(STORAGE_KEYS.DOCTORS, docs);
  deleteDocFromFirestore('doctors', id);
}

// SPOTKANIA (Meetings)
export function getMeetings(): Meeting[] {
  const rawMeetings = getParsedItem<Meeting>(STORAGE_KEYS.MEETINGS, []);
  const settings = getSystemSettings();
  const allowedProducts = settings.productsList || PRESET_PRODUCTS;
  const allowedUpper = allowedProducts.map(p => p.toUpperCase());
  // Sanitize meetings to ensure they only contain valid product tags from productsList
  return rawMeetings.map(meet => {
    if (meet.product_tags && Array.isArray(meet.product_tags)) {
      return {
        ...meet,
        product_tags: meet.product_tags.filter(tag => 
          allowedProducts.includes(tag) || allowedUpper.includes(tag.toUpperCase())
        )
      };
    }
    return meet;
  });
}

export function saveMeeting(meeting: Meeting): Meeting {
  const meetings = getMeetings();
  const idx = meetings.findIndex(m => m.id === meeting.id);
  const now = new Date().toISOString();
  let saved: Meeting;

  if (idx >= 0) {
    saved = { ...meeting, updated_at: now };
    meetings[idx] = saved;
  } else {
    saved = { ...meeting, created_at: meeting.created_at || now, updated_at: now };
    meetings.push(saved);
  }
  setItem(STORAGE_KEYS.MEETINGS, meetings);
  syncDocToFirestore('meetings', saved.id, saved);
  return saved;
}

export function deleteMeeting(id: string) {
  const meets = getMeetings().filter(m => m.id !== id);
  setItem(STORAGE_KEYS.MEETINGS, meets);
  deleteDocFromFirestore('meetings', id);
}

// ZADANIA (Tasks)
export function getTasks(): Task[] {
  return getParsedItem<Task>(STORAGE_KEYS.TASKS, []);
}

export function getMeetingTasks(meetingId: string): Task[] {
  return getTasks().filter(t => t.meeting_id === meetingId);
}

export function saveTask(task: Task): Task {
  const tasks = getTasks();
  const idx = tasks.findIndex(t => t.id === task.id);
  let saved: Task;
  if (idx >= 0) {
    saved = task;
    tasks[idx] = saved;
  } else {
    saved = task;
    tasks.push(saved);
  }
  setItem(STORAGE_KEYS.TASKS, tasks);
  syncDocToFirestore('tasks', saved.id, saved);
  return saved;
}

export function deleteTask(id: string) {
  const tasks = getTasks().filter(t => t.id !== id);
  setItem(STORAGE_KEYS.TASKS, tasks);
  deleteDocFromFirestore('tasks', id);
}

// Resetowanie bazy danych do stanu nasion
export function resetDatabase() {
  initializeDatabase(true);
}

// SETTINGS
export function getSystemSettings(): SystemSettings {
  const defaultSettings: SystemSettings = {
    brandName: "Mac's CRM",
    enableMeetingApprovals: true,
    defaultMapLat: 53.1325,
    defaultMapLng: 23.1510,
    productsList: [...PRESET_PRODUCTS]
  };
  const val = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (!val) return defaultSettings;
  try {
    return JSON.parse(val) as SystemSettings;
  } catch (e) {
    return defaultSettings;
  }
}

export function saveSystemSettings(settings: SystemSettings) {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  syncDocToFirestore('settings', 'systemSettings', settings);
}

// USERS
export const DEFAULT_DEMO_USERS: CrmUser[] = [PRIMARY_ADMIN_USER];

export function getUsers(): CrmUser[] {
  const users = getParsedItem<CrmUser>(STORAGE_KEYS.USERS, []);
  // Filter out legacy demo users
  const filteredUsers = users.filter(u => !['usr_1', 'usr_2', 'usr_3', 'usr_4', 'usr_5'].includes(u.id) && !u.email.endsWith('@base44.pl'));
  
  const merged = [...filteredUsers];
  let changed = users.length !== filteredUsers.length;

  const demo = PRIMARY_ADMIN_USER;
  const existingIdx = merged.findIndex(u => u.email.toLowerCase() === demo.email.toLowerCase());
  if (existingIdx === -1) {
    merged.push(demo);
    changed = true;
    syncDocToFirestore('users', demo.id, demo);
  } else {
    if (merged[existingIdx].role !== demo.role || merged[existingIdx].id !== demo.id) {
      merged[existingIdx] = { ...merged[existingIdx], role: 'admin' };
      changed = true;
      syncDocToFirestore('users', merged[existingIdx].id, merged[existingIdx]);
    }
  }

  if (changed || merged.length === 0) {
    setItem(STORAGE_KEYS.USERS, merged);
  }

  return merged;
}

export function saveUser(user: CrmUser): CrmUser {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === user.id);
  let saved: CrmUser;
  if (idx >= 0) {
    saved = user;
    users[idx] = saved;
  } else {
    saved = user;
    users.push(saved);
  }
  setItem(STORAGE_KEYS.USERS, users);
  syncDocToFirestore('users', saved.id, saved);
  return saved;
}

export function deleteUser(id: string) {
  const users = getUsers().filter(u => u.id !== id);
  setItem(STORAGE_KEYS.USERS, users);
  deleteDocFromFirestore('users', id);
}

// WYJAZDY (Trips)
export function getTrips(): Trip[] {
  return getParsedItem<Trip>(STORAGE_KEYS.TRIPS, []);
}

export function saveTrip(trip: Trip): Trip {
  const trips = getTrips();
  const idx = trips.findIndex(t => t.id === trip.id);
  let saved: Trip;
  if (idx >= 0) {
    saved = trip;
    trips[idx] = saved;
  } else {
    saved = trip;
    trips.push(saved);
  }
  setItem(STORAGE_KEYS.TRIPS, trips);
  syncDocToFirestore('trips', saved.id, saved);
  return saved;
}

export function saveTrips(tripsList: Trip[]) {
  setItem(STORAGE_KEYS.TRIPS, tripsList);
  tripsList.forEach(t => syncDocToFirestore('trips', t.id, t));
}

export function deleteTrip(id: string) {
  const trips = getTrips().filter(t => t.id !== id);
  setItem(STORAGE_KEYS.TRIPS, trips);
  deleteDocFromFirestore('trips', id);
  
  // Cascade delete days and visits
  const days = getTripDays();
  const daysToDelete = days.filter(d => d.trip_id === id);
  const dayIds = daysToDelete.map(d => d.id);
  
  const remainingDays = days.filter(d => d.trip_id !== id);
  setItem(STORAGE_KEYS.TRIP_DAYS, remainingDays);
  daysToDelete.forEach(d => deleteDocFromFirestore('trip_days', d.id));
  
  const visits = getVisits();
  const visitsToDelete = visits.filter(v => dayIds.includes(v.trip_day_id));
  const remainingVisits = visits.filter(v => !dayIds.includes(v.trip_day_id));
  setItem(STORAGE_KEYS.VISITS, remainingVisits);
  visitsToDelete.forEach(v => deleteDocFromFirestore('visits', v.id));
}

// DNI WYJAZDU (TripDays)
export function getTripDays(): TripDay[] {
  return getParsedItem<TripDay>(STORAGE_KEYS.TRIP_DAYS, []);
}

export function saveTripDay(day: TripDay): TripDay {
  const days = getTripDays();
  const idx = days.findIndex(d => d.id === day.id);
  let saved: TripDay;
  if (idx >= 0) {
    saved = day;
    days[idx] = saved;
  } else {
    saved = day;
    days.push(saved);
  }
  setItem(STORAGE_KEYS.TRIP_DAYS, days);
  syncDocToFirestore('trip_days', saved.id, saved);
  return saved;
}

export function saveTripDays(daysList: TripDay[]) {
  setItem(STORAGE_KEYS.TRIP_DAYS, daysList);
  daysList.forEach(d => syncDocToFirestore('trip_days', d.id, d));
}

// WIZYTY (Visits)
export function getVisits(): Visit[] {
  return getParsedItem<Visit>(STORAGE_KEYS.VISITS, []);
}

export function saveVisit(visit: Visit): Visit {
  const visits = getVisits();
  const idx = visits.findIndex(v => v.id === visit.id);
  let saved: Visit;
  if (idx >= 0) {
    saved = visit;
    visits[idx] = saved;
  } else {
    saved = visit;
    visits.push(saved);
  }
  setItem(STORAGE_KEYS.VISITS, visits);
  syncDocToFirestore('visits', saved.id, saved);
  return saved;
}

export function saveVisits(visitsList: Visit[]) {
  setItem(STORAGE_KEYS.VISITS, visitsList);
  visitsList.forEach(v => syncDocToFirestore('visits', v.id, v));
}

export function deleteVisit(id: string) {
  const visits = getVisits().filter(v => v.id !== id);
  setItem(STORAGE_KEYS.VISITS, visits);
  deleteDocFromFirestore('visits', id);
}

