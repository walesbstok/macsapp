export type PipelineStatus = 'prospect' | 'active' | 'key_account' | 'inactive';

export type DepartmentType = 'zabiegowy' | 'zachowawczy' | 'diagnostyczny' | 'standard' | 'sterylizatornia' | 'blok_operacyjny';

export type UserRole = 'admin' | 'manager' | 'sales representative';

export type MeetingType = 'REGULAR' | 'PRESENTATION' | 'OPERATING DAY' | 'PHONE_CALL';

export interface Hospital {
  id: string;
  name: string;
  address: string;
  city: string;
  voivodeship?: string;
  phone: string;
  email: string;
  website: string;
  pipeline_status: PipelineStatus;
  lat: number | null;
  lng: number | null;
  notes: string;
  created_at: string;
  updated_at: string;
  segment?: 'A' | 'B' | 'C';
}

export interface Department {
  id: string;
  hospital_id: string;
  name: string;
  type: DepartmentType;
  created_at: string;
}

export interface Doctor {
  id: string;
  first_name: string;
  last_name: string;
  title: string; // np. "dr", "prof. dr hab."
  hospital_id: string;
  department_id: string;
  phone: string;
  email: string;
  specialization: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export type MeetingStatus = 'scheduled' | 'to_close' | 'overdue' | 'closed';

export interface Meeting {
  id: string;
  title: string;
  meeting_date: string; // ISO String datetime
  hospital_id: string;
  department_id: string | null;
  doctor_id: string | null;
  doctor_ids?: string[]; // Wsparcie dla wielu lekarzy
  product_tags?: string[]; // Tagi produktów medycznych
  content_markdown: string;
  meeting_type?: MeetingType; // REGULAR, PRESENTATION, OPERATING DAY
  closed_at: string | null; // ISO String, null = otwarte
  created_at: string;
  updated_at: string;
  approval_status?: 'pending' | 'approved' | 'rejected';
  manager_comment?: string;
  representative_name?: string;
}

export interface SystemSettings {
  brandName: string;
  enableMeetingApprovals: boolean;
  defaultMapLat: number;
  defaultMapLng: number;
  productsList: string[];
}

export interface CrmUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  created_at: string;
  password?: string;
  mustChangePassword?: boolean;
}

export const PRESET_PRODUCTS = [
  "ALLIUM",
  "BLUENEEN",
  "BIOSIS",
  "TISGENEX",
  "SCANLAN",
  "SSU",
  "GENESEE",
  "NEOS SternFix",
  "NEOS Cranial Loop",
  "CINVIVO",
  "DEGANIA",
  "ORASCOPTIC",
  "OTHER"
];

export interface Task {
  id: string;
  meeting_id: string;
  hospital_id?: string;
  department_id?: string;
  doctor_id?: string;
  description: string;
  due_date: string | null; // YYYY-MM-DD, opcjonalnie
  is_done: boolean;
  created_at: string;
}

export interface Trip {
  id: string;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  status: 'draft' | 'confirmed';
  created_at?: string;
}

export interface TripDay {
  id: string;
  trip_id: string;
  date: string; // YYYY-MM-DD
  overnight_location: string | null;
  overnight_sunday_location?: string | null; // Nocleg z niedzieli na poniedziałek
  order: number;
}

export interface Visit {
  id: string;
  trip_day_id: string;
  hospital_id: string;
  department_id: string;
  doctor_id: string | null;
  is_fixed_slot: boolean; // true dla sterylizatorni/bloku operacyjnego
  time_slot?: string; // np. "08:00"
}
