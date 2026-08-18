-- ====================================================================
-- SKRYPT TWORZENIA TABEL DLA SUPABASE (Medical CRM)
-- Wklej ten skrypt w Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ====================================================================

-- 1. Tabela szpitali (hospitals)
CREATE TABLE IF NOT EXISTS public.hospitals (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT,
    city TEXT NOT NULL,
    voivodeship TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    pipeline_status TEXT DEFAULT 'prospect',
    lat NUMERIC,
    lng NUMERIC,
    notes TEXT,
    segment TEXT DEFAULT 'B',
    created_at TEXT,
    updated_at TEXT
);

-- 2. Tabela oddziałów (departments)
CREATE TABLE IF NOT EXISTS public.departments (
    id TEXT PRIMARY KEY,
    hospital_id TEXT NOT NULL,
    name TEXT NOT NULL,
    type TEXT,
    created_at TEXT
);

-- 3. Tabela lekarzy (doctors)
CREATE TABLE IF NOT EXISTS public.doctors (
    id TEXT PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    title TEXT,
    hospital_id TEXT NOT NULL,
    department_id TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    specialization TEXT,
    notes TEXT,
    created_at TEXT,
    updated_at TEXT
);

-- 4. Tabela spotkań i wizyt (meetings)
CREATE TABLE IF NOT EXISTS public.meetings (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    meeting_date TEXT NOT NULL,
    hospital_id TEXT NOT NULL,
    department_id TEXT,
    doctor_id TEXT,
    doctor_ids JSONB DEFAULT '[]'::jsonb,
    product_tags JSONB DEFAULT '[]'::jsonb,
    content_markdown TEXT,
    meeting_type TEXT DEFAULT 'in_person',
    closed_at TEXT,
    approval_status TEXT DEFAULT 'approved',
    manager_comment TEXT,
    representative_name TEXT,
    created_at TEXT,
    updated_at TEXT
);

-- 5. Tabela zadań (tasks)
CREATE TABLE IF NOT EXISTS public.tasks (
    id TEXT PRIMARY KEY,
    meeting_id TEXT NOT NULL,
    description TEXT NOT NULL,
    due_date TEXT,
    is_done BOOLEAN DEFAULT false,
    created_at TEXT
);

-- 6. Tabela użytkowników (users)
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'representative',
    is_active BOOLEAN DEFAULT true,
    password TEXT,
    must_change_password BOOLEAN DEFAULT false,
    created_at TEXT
);

-- 7. Tabela ustawień (settings)
CREATE TABLE IF NOT EXISTS public.settings (
    id TEXT PRIMARY KEY DEFAULT 'systemSettings',
    brand_name TEXT,
    enable_meeting_approvals BOOLEAN DEFAULT false,
    default_map_lat NUMERIC,
    default_map_lng NUMERIC,
    products_list JSONB DEFAULT '[]'::jsonb
);

-- 8. Tabela wyjazdów (trips)
CREATE TABLE IF NOT EXISTS public.trips (
    id TEXT PRIMARY KEY,
    start_date TEXT,
    end_date TEXT,
    status TEXT,
    created_at TEXT
);

-- 9. Tabela dni wyjazdów (trip_days)
CREATE TABLE IF NOT EXISTS public.trip_days (
    id TEXT PRIMARY KEY,
    trip_id TEXT,
    date TEXT,
    overnight_location TEXT,
    overnight_sunday_location TEXT,
    order_num INT
);

-- 10. Tabela wizyt wyjazdowych (visits)
CREATE TABLE IF NOT EXISTS public.visits (
    id TEXT PRIMARY KEY,
    trip_day_id TEXT,
    hospital_id TEXT,
    department_id TEXT,
    doctor_id TEXT,
    is_fixed_slot BOOLEAN DEFAULT false,
    time_slot TEXT
);

-- ====================================================================
-- WŁĄCZENIE ROW LEVEL SECURITY (RLS) ORAZ POLITYK PUBLICZNEGO DOSTĘPU
-- ====================================================================

DO $$
DECLARE
    tbl text;
BEGIN
    FOR tbl IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
          AND table_name IN ('hospitals', 'departments', 'doctors', 'meetings', 'tasks', 'users', 'settings', 'trips', 'trip_days', 'visits')
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl);
        EXECUTE format('DROP POLICY IF EXISTS "Public access on %I" ON public.%I;', tbl, tbl);
        EXECUTE format('CREATE POLICY "Public access on %I" ON public.%I FOR ALL USING (true) WITH CHECK (true);', tbl, tbl);
    END LOOP;
END $$;
