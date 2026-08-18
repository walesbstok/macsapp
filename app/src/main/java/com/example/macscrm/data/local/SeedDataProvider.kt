package com.example.macscrm.data.local

import com.example.macscrm.data.local.entity.*
import com.example.macscrm.data.model.*

object SeedDataProvider {

    fun getDefaultUsers(): List<UserEntity> = listOf(
        UserEntity(
            id = "usr_lukasz_w",
            name = "Łukasz W.",
            email = "lukasz.w@macsmedical.eu",
            role = "ADMIN",
            isActive = true,
            createdAt = "2026-01-01T00:00:00.000Z",
            password = "Macs123",
            mustChangePassword = false
        ),
        UserEntity(
            id = "usr_pawel_p",
            name = "Paweł Plesiak",
            email = "pawel.p@macsmedical.eu",
            role = "MANAGER",
            isActive = true,
            createdAt = "2026-01-01T00:00:00.000Z",
            password = "Macs123",
            mustChangePassword = false
        ),
        UserEntity(
            id = "usr_rep_1",
            name = "Łukasz Nowak",
            email = "lukasz.nowak@base44.pl",
            role = "SALES_REP",
            isActive = true,
            createdAt = "2026-01-15T00:00:00.000Z",
            password = "Macs123",
            mustChangePassword = false
        )
    )

    fun getDefaultSettings(): SettingsEntity = SettingsEntity(
        id = "system_settings",
        brandName = "Mac's CRM",
        enableMeetingApprovals = true,
        defaultMapLat = 53.7739,
        defaultMapLng = 20.4950,
        productsList = listOf(
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
        )
    )

    fun getInitialHospitals(): List<HospitalEntity> = listOf(
        HospitalEntity(
            id = "hosp_1",
            name = "WOJEWÓDZKI SZPITAL SPECJALISTYCZNY W OLSZTYNIE",
            address = "ul. Żołnierska 18, 10-561 Olsztyn",
            city = "Olsztyn",
            voivodeship = "Warmińsko-Mazurskie",
            phone = "+48 89 538 62 00",
            email = "sekretariat@szpital.olsztyn.pl",
            website = "www.szpital.olsztyn.pl",
            pipelineStatus = "KEY_ACCOUNT",
            lat = 53.7739,
            lng = 20.4950,
            notes = "Kluczowy ośrodek referencyjny w regionie. Bardzo aktywne oddziały kardiochirurgii, urologii i chirurgii naczyniowej.",
            segment = "A",
            createdAt = "2026-01-10T10:00:00Z",
            updatedAt = "2026-05-21T15:00:00Z"
        ),
        HospitalEntity(
            id = "hosp_2",
            name = "UNIWERSYTECKI SZPITAL KLINICZNY W BIAŁYMSTOKU",
            address = "ul. M.C. Skłodowskiej 24A, 15-276 Białystok",
            city = "Białystok",
            voivodeship = "Podlaskie",
            phone = "+48 85 746 80 00",
            email = "kancelaria@uskwb.pl",
            website = "www.uskwb.pl",
            pipelineStatus = "KEY_ACCOUNT",
            lat = 53.1270,
            lng = 23.1570,
            notes = "Główny szpital kliniczny na Podlasiu. Regularne zamówienia Scanlan, Allium oraz Biosis.",
            segment = "A",
            createdAt = "2026-01-10T10:00:00Z",
            updatedAt = "2026-05-20T14:00:00Z"
        ),
        HospitalEntity(
            id = "hosp_3",
            name = "SAMODZIELNY PUBLICZNY ZAKŁAD OPIEKI ZDROWOTNEJ W AUGUSTOWIE",
            address = "ul. Szpitalna 12, 16-300 Augustów",
            city = "Augustów",
            voivodeship = "Podlaskie",
            phone = "+48 87 644 42 00",
            email = "sekretariat@spzoz.augustow.pl",
            website = "www.spzoz.augustow.pl",
            pipelineStatus = "ACTIVE",
            lat = 53.8453,
            lng = 22.9803,
            notes = "Oddział chirurgii ogólnej i blok operacyjny. Testy kleszczyków Scanlan i igłotrzymaczy.",
            segment = "B",
            createdAt = "2026-01-12T10:00:00Z",
            updatedAt = "2026-05-22T10:00:00Z"
        ),
        HospitalEntity(
            id = "hosp_4",
            name = "CENTRUM ONKOLOGII ZIEMI LUBELSKIEJ IM. ŚW. JANA Z DUKLI",
            address = "ul. Dra Kazimierza Jaczewskiego 7, 20-090 Lublin",
            city = "Lublin",
            voivodeship = "Lubelskie",
            phone = "+48 81 740 00 00",
            email = "cozl@cozl.pl",
            website = "www.cozl.pl",
            pipelineStatus = "KEY_ACCOUNT",
            lat = 51.2389,
            lng = 22.5480,
            notes = "Onkologia i urologia onkologiczna. Zaawansowane zabiegi robotyczne i laparoskopowe.",
            segment = "A",
            createdAt = "2026-01-15T10:00:00Z",
            updatedAt = "2026-05-18T16:00:00Z"
        ),
        HospitalEntity(
            id = "hosp_5",
            name = "BIAŁOSTOCKIE CENTRUM ONKOLOGII IM. M. SKŁODOWSKIEJ-CURIE",
            address = "ul. Ogrodowa 12, 15-027 Białystok",
            city = "Białystok",
            voivodeship = "Podlaskie",
            phone = "+48 85 664 68 00",
            email = "bco@onkologia.bialystok.pl",
            website = "www.onkologia.bialystok.pl",
            pipelineStatus = "ACTIVE",
            lat = 53.1325,
            lng = 23.1510,
            notes = "Oddział Chirurgii Piersi i Rekonstrukcji oraz Oddział Urologii. Zainteresowanie Scanlan i Orascoptic.",
            segment = "A",
            createdAt = "2026-01-20T10:00:00Z",
            updatedAt = "2026-05-19T11:00:00Z"
        ),
        HospitalEntity(
            id = "hosp_6",
            name = "MIEJSKI SZPITAL ZESPOLONY W OLSZTYNIE",
            address = "ul. Niepodległości 44, 10-045 Olsztyn",
            city = "Olsztyn",
            voivodeship = "Warmińsko-Mazurskie",
            phone = "+48 89 532 62 00",
            email = "sekretariat@szpital.olsztyn.pl",
            website = "www.msz.olsztyn.pl",
            pipelineStatus = "ACTIVE",
            lat = 53.7756,
            lng = 20.4842,
            notes = "Urologia i chirurgia ogólna. Potencjalny klient na stenty moczowodowe Allium.",
            segment = "B",
            createdAt = "2026-02-01T09:00:00Z",
            updatedAt = "2026-05-20T09:00:00Z"
        ),
        HospitalEntity(
            id = "hosp_7",
            name = "UNIWERSYTECKI SZPITAL KLINICZNY NR 4 W LUBLINIE",
            address = "ul. Dra Kazimierza Jaczewskiego 8, 20-090 Lublin",
            city = "Lublin",
            voivodeship = "Lubelskie",
            phone = "+48 81 724 44 44",
            email = "sekretariat@spsk4.lublin.pl",
            website = "www.spsk4.lublin.pl",
            pipelineStatus = "KEY_ACCOUNT",
            lat = 51.2392,
            lng = 22.5495,
            notes = "Duża kardiochirurgia i neurochirurgia. Wykorzystanie NEOS SternFix i Cranial Loop.",
            segment = "A",
            createdAt = "2026-02-05T10:00:00Z",
            updatedAt = "2026-05-21T12:00:00Z"
        ),
        HospitalEntity(
            id = "hosp_8",
            name = "SZPITAL WOJEWÓDZKI W SUWAŁKACH",
            address = "ul. Szpitalna 60, 16-400 Suwałki",
            city = "Suwałki",
            voivodeship = "Podlaskie",
            phone = "+48 87 562 92 00",
            email = "sekretariat@szpital.suwalki.pl",
            website = "www.szpital.suwalki.pl",
            pipelineStatus = "PROSPECT",
            lat = 54.1000,
            lng = 22.9333,
            notes = "Planowana wizyta demonstracyjna lup Orascoptic oraz narzędzi do chirurgii naczyniowej.",
            segment = "C",
            createdAt = "2026-03-01T10:00:00Z",
            updatedAt = "2026-05-15T10:00:00Z"
        )
    )

    fun getInitialDepartments(): List<DepartmentEntity> = listOf(
        DepartmentEntity("dept_1", "hosp_1", "Kliniczny Oddział Kardiochirurgii", "ZABIEGOWY", "2026-01-10T10:00:00Z"),
        DepartmentEntity("dept_2", "hosp_1", "Oddział Urologiczny i Onkologii Urologicznej", "ZABIEGOWY", "2026-01-10T10:00:00Z"),
        DepartmentEntity("dept_3", "hosp_1", "Centralna Sterylizatornia", "STERYLIZATORNIA", "2026-01-10T10:00:00Z"),
        DepartmentEntity("dept_4", "hosp_1", "Centralny Blok Operacyjny", "BLOK_OPERACYJNY", "2026-01-10T10:00:00Z"),
        DepartmentEntity("dept_5", "hosp_2", "Klinika Kardiochirurgii z Blokiem Operacyjnym", "BLOK_OPERACYJNY", "2026-01-10T10:00:00Z"),
        DepartmentEntity("dept_6", "hosp_2", "Klinika Urologii i Urologii Onkologicznej", "ZABIEGOWY", "2026-01-10T10:00:00Z"),
        DepartmentEntity("dept_7", "hosp_2", "Klinika Chirurgii Naczyń i Transplantacji", "ZABIEGOWY", "2026-01-10T10:00:00Z"),
        DepartmentEntity("dept_8", "hosp_3", "Oddział Chirurgii Ogólnej", "ZABIEGOWY", "2026-01-12T10:00:00Z"),
        DepartmentEntity("dept_9", "hosp_4", "Oddział Urologiczny", "ZABIEGOWY", "2026-01-15T10:00:00Z"),
        DepartmentEntity("dept_10", "hosp_4", "Oddział Chirurgii Piersi i Rekonstrukcji", "ZABIEGOWY", "2026-01-15T10:00:00Z"),
        DepartmentEntity("dept_11", "hosp_7", "Kliniczny Oddział Kardiochirurgii", "ZABIEGOWY", "2026-02-05T10:00:00Z")
    )

    fun getInitialDoctors(): List<DoctorEntity> = listOf(
        DoctorEntity(
            id = "doc_1",
            firstName = "Adam",
            lastName = "Kałużny",
            title = "dr n. med.",
            hospitalId = "hosp_1",
            departmentId = "dept_2",
            phone = "+48 89 538 62 31",
            email = "a.kaluzny@szpital.olsztyn.pl",
            specialization = "Urologia",
            notes = "Kierownik oddziału. Zainteresowany narzędziami Scanlan i lupami Orascoptic 3.0x.",
            createdAt = "2026-01-10T10:00:00Z",
            updatedAt = "2026-05-21T15:00:00Z"
        ),
        DoctorEntity(
            id = "doc_2",
            firstName = "Piotr",
            lastName = "Zieliński",
            title = "prof. dr hab.",
            hospitalId = "hosp_1",
            departmentId = "dept_1",
            phone = "+48 89 538 62 15",
            email = "p.zielinski@kardiochirurgia.olsztyn.pl",
            specialization = "Kardiochirurgia",
            notes = "Często wykonuje zabiegi CABG i wymiany zastawek. Stosuje NEOS SternFix i nożyczki tytanowe Scanlan.",
            createdAt = "2026-01-10T10:00:00Z",
            updatedAt = "2026-05-10T11:00:00Z"
        ),
        DoctorEntity(
            id = "doc_3",
            firstName = "Marek",
            lastName = "Grabowski",
            title = "dr hab. n. med.",
            hospitalId = "hosp_2",
            departmentId = "dept_6",
            phone = "+48 85 746 82 10",
            email = "m.grabowski@uskwb.pl",
            specialization = "Urologia i Onkologia",
            notes = "Zainteresowany stentami Allium do zwężeń moczowodu. Planowane warsztaty kliniczne.",
            createdAt = "2026-01-10T10:00:00Z",
            updatedAt = "2026-05-20T14:00:00Z"
        ),
        DoctorEntity(
            id = "doc_4",
            firstName = "Krzysztof",
            lastName = "Wójcik",
            title = "lek. med.",
            hospitalId = "hosp_3",
            departmentId = "dept_8",
            phone = "+48 87 644 42 12",
            email = "k.wojcik@spzoz.augustow.pl",
            specialization = "Chirurgia ogólna i onkologiczna",
            notes = "Pozytywna opinia po testach narzędzi mikrochirurgicznych.",
            createdAt = "2026-01-12T10:00:00Z",
            updatedAt = "2026-05-22T10:00:00Z"
        ),
        DoctorEntity(
            id = "doc_5",
            firstName = "Tomasz",
            lastName = "Mazur",
            title = "prof. dr hab.",
            hospitalId = "hosp_7",
            departmentId = "dept_11",
            phone = "+48 81 724 45 10",
            email = "t.mazur@spsk4.lublin.pl",
            specialization = "Kardiochirurgia i Chirurgia Naczyniowa",
            notes = "Kluczowy KOL w południowo-wschodniej Polsce. Poleca systemy stabilizacji mostka SternFix.",
            createdAt = "2026-02-05T10:00:00Z",
            updatedAt = "2026-05-18T16:00:00Z"
        )
    )

    fun getInitialMeetings(): List<MeetingEntity> = listOf(
        MeetingEntity(
            id = "meet_16286",
            title = "Prezentacja Scanlan & Orascoptic - Oddział Urologii Olsztyn",
            meetingDate = "2026-05-21T08:00:00",
            hospitalId = "hosp_1",
            departmentId = "dept_2",
            doctorId = "doc_1",
            doctorIds = listOf("doc_1"),
            productTags = listOf("SCANLAN", "ORASCOPTIC"),
            contentMarkdown = "Wysoce obiecujące spotkanie ws. Scanlan i Orascoptic. Pokazano narzędzia mikrochirurgiczne LC oraz lupy 3.0x z oświetleniem LED.\n\nDoktor Kałużny wyraził chęć przetestowania narzędzi podczas zaplanowanego zabiegu w przyszły wtorek. Uzgodniono kontakt z Pielęgniarką Oddziałową ws. protokołu testowego.",
            meetingType = "REGULAR",
            closedAt = "2026-05-21T15:07:00",
            createdAt = "2026-05-21T08:30:00Z",
            updatedAt = "2026-05-21T15:07:00Z",
            approvalStatus = "APPROVED",
            managerComment = "Bardzo dobry kontakt z ordynatorem. Zabezpiecz próbki przed wtorkiem.",
            representativeName = "Łukasz W."
        ),
        MeetingEntity(
            id = "meet_16287",
            title = "Konsultacja ws. Stentów Allium i Biosis - USK Białystok",
            meetingDate = "2026-05-20T11:00:00",
            hospitalId = "hosp_2",
            departmentId = "dept_6",
            doctorId = "doc_3",
            doctorIds = listOf("doc_3"),
            productTags = listOf("ALLIUM", "BIOSIS"),
            contentMarkdown = "Omówiono doświadczenia kliniczne ze stentami Allium w trudnych zwężeniach moczowodów. Prof. Grabowski potwierdził kwalifikację dwóch pacjentów do implantacji.",
            meetingType = "PRESENTATION",
            closedAt = "2026-05-20T14:30:00",
            createdAt = "2026-05-20T11:30:00Z",
            updatedAt = "2026-05-20T14:30:00Z",
            approvalStatus = "APPROVED",
            managerComment = "Świetna robota, przygotujmy ofertę przetargową.",
            representativeName = "Łukasz W."
        ),
        MeetingEntity(
            id = "meet_16288",
            title = "Dzień Operacyjny - Prezentacja narzędzi chirurgicznych Augustów",
            meetingDate = "2026-05-22T09:00:00",
            hospitalId = "hosp_3",
            departmentId = "dept_8",
            doctorId = "doc_4",
            doctorIds = listOf("doc_4"),
            productTags = listOf("SCANLAN", "SSU"),
            contentMarkdown = "Prezentacja na sali operacyjnej. Chirurg testował preparatory i imadła Scanlan. Bardzo dobra ergonomia chwytu.",
            meetingType = "OPERATING_DAY",
            closedAt = "2026-05-22T13:00:00",
            createdAt = "2026-05-22T09:00:00Z",
            updatedAt = "2026-05-22T13:00:00Z",
            approvalStatus = "APPROVED",
            managerComment = "Wzorcowy raport.",
            representativeName = "Łukasz W."
        ),
        MeetingEntity(
            id = "meet_16289",
            title = "Zaplanowana wizyta: Wdrożenie NEOS SternFix - Lublin SPSK4",
            meetingDate = "2026-08-25T10:00:00",
            hospitalId = "hosp_7",
            departmentId = "dept_11",
            doctorId = "doc_5",
            doctorIds = listOf("doc_5"),
            productTags = listOf("NEOS SternFix", "SCANLAN"),
            contentMarkdown = "Spotkanie z prof. Mazurem w sprawie wdrożenia procedury stabilizacji mostka po zabiegach kardiochirurgicznych u pacjentów z grupy ryzyka.",
            meetingType = "REGULAR",
            closedAt = null,
            createdAt = "2026-08-15T10:00:00Z",
            updatedAt = "2026-08-15T10:00:00Z",
            approvalStatus = "PENDING",
            managerComment = "",
            representativeName = "Łukasz W."
        ),
        MeetingEntity(
            id = "meet_16290",
            title = "Prezentacja lup chirurgicznych Orascoptic - Suwałki",
            meetingDate = "2026-08-28T12:00:00",
            hospitalId = "hosp_8",
            departmentId = null,
            doctorId = null,
            doctorIds = emptyList(),
            productTags = listOf("ORASCOPTIC"),
            contentMarkdown = "Demonstracja lup Orascoptic dla zespołu chirurgów naczyniowych i ogólnych.",
            meetingType = "PRESENTATION",
            closedAt = null,
            createdAt = "2026-08-16T12:00:00Z",
            updatedAt = "2026-08-16T12:00:00Z",
            approvalStatus = "PENDING",
            managerComment = "",
            representativeName = "Łukasz W."
        )
    )

    fun getInitialTasks(): List<TaskEntity> = listOf(
        TaskEntity(
            id = "task_1",
            meetingId = "meet_16286",
            hospitalId = "hosp_1",
            departmentId = "dept_2",
            doctorId = "doc_1",
            description = "Wysłać katalog narzędzi Scanlan i uzgodnić protokół testowy z oddziałową",
            dueDate = "2026-08-22",
            isDone = true,
            createdAt = "2026-05-21T15:00:00Z"
        ),
        TaskEntity(
            id = "task_2",
            meetingId = "meet_16287",
            hospitalId = "hosp_2",
            departmentId = "dept_6",
            doctorId = "doc_3",
            description = "Dostarczyć próbki stentów Allium na planowany zabieg 28 sierpnia",
            dueDate = "2026-08-24",
            isDone = false,
            createdAt = "2026-05-20T14:30:00Z"
        ),
        TaskEntity(
            id = "task_3",
            meetingId = "meet_16289",
            hospitalId = "hosp_7",
            departmentId = "dept_11",
            doctorId = "doc_5",
            description = "Przygotować ofertę cenową na zestaw startowy NEOS SternFix",
            dueDate = "2026-08-26",
            isDone = false,
            createdAt = "2026-08-15T10:00:00Z"
        ),
        TaskEntity(
            id = "task_4",
            meetingId = "",
            hospitalId = "hosp_8",
            departmentId = "",
            doctorId = "",
            description = "Potwierdzić termin warsztatów demonstracyjnych lup w Suwałkach",
            dueDate = "2026-08-27",
            isDone = false,
            createdAt = "2026-08-16T12:00:00Z"
        )
    )

    fun getInitialTrips(): List<TripEntity> = listOf(
        TripEntity(
            id = "trip_week_35",
            startDate = "2026-08-24",
            endDate = "2026-08-28",
            status = "confirmed",
            title = "Trasa Północno-Wschodnia: Olsztyn - Białystok - Suwałki",
            createdAt = "2026-08-10T10:00:00Z"
        )
    )

    fun getInitialTripDays(): List<TripDayEntity> = listOf(
        TripDayEntity("td_1", "trip_week_35", "2026-08-24", "Olsztyn", null, 0),
        TripDayEntity("td_2", "trip_week_35", "2026-08-25", "Białystok", null, 1),
        TripDayEntity("td_3", "trip_week_35", "2026-08-26", "Białystok", null, 2),
        TripDayEntity("td_4", "trip_week_35", "2026-08-27", "Suwałki", null, 3),
        TripDayEntity("td_5", "trip_week_35", "2026-08-28", null, null, 4)
    )

    fun getInitialVisits(): List<VisitEntity> = listOf(
        VisitEntity("v_1", "td_1", "hosp_1", "dept_4", null, true, "08:00"),
        VisitEntity("v_2", "td_1", "hosp_1", "dept_2", "doc_1", false, "10:30"),
        VisitEntity("v_3", "td_2", "hosp_2", "dept_5", null, true, "08:00"),
        VisitEntity("v_4", "td_2", "hosp_2", "dept_6", "doc_3", false, "11:00"),
        VisitEntity("v_5", "td_4", "hosp_8", "", null, false, "12:00")
    )
}
