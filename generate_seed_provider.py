import csv
import re
import json

raw_csv_path = "/app/applet/app/src/main/assets/initial_crm_data.csv"

# First, read CSV content
with open(raw_csv_path, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f, delimiter=';')
    rows = list(reader)

hospitals = []
departments = []
doctors = []
meetings = []
tasks = []

hosp_name_to_id = {}
hosp_id_to_hosp = {}

for r in rows:
    rtype = r.get("TYP_REKORDU", "").strip().upper()
    rid = r.get("ID", "").strip()
    title = r.get("NAZWA_LUB_TYTUL", "").strip()
    hosp_name = r.get("SZPITAL_PLACOWKA", "").strip()
    city = r.get("MIASTO", "").strip()
    voiv = r.get("WOJEWODZTWO", "").strip()
    dept_name = r.get("ODDZIAL", "").strip()
    doc_name = r.get("LEKARZ_OSOBA_KONTAKTOWA", "").strip()
    spec = r.get("SPECJALIZACJA_LUB_TYP", "").strip()
    phone = r.get("TELEFON", "").strip()
    email = r.get("EMAIL", "").strip()
    status = r.get("STATUS_LUB_ETAP", "").strip()
    date_term = r.get("DATA_LUB_TERMIN", "").strip()
    tags = r.get("TAGI_PRODUKTOWE", "").strip()
    notes = r.get("TRESC_NOTATKI_OPIS", "").strip()
    rep = r.get("PRZEDSTAWICIEL_AUTOR", "").strip() or "Łukasz W."

    if rtype == "SZPITAL":
        pipeline = status.upper().replace(" ", "_")
        if pipeline not in ["PROSPECT", "ACTIVE", "KEY_ACCOUNT", "INACTIVE"]:
            pipeline = "PROSPECT"
        hosp_name_to_id[title] = rid
        if hosp_name:
            hosp_name_to_id[hosp_name] = rid
        hosp_dict = {
            "id": rid,
            "name": title,
            "address": f"ul. Szpitalna 1, {city}" if city else "ul. Szpitalna 1",
            "city": city,
            "voivodeship": voiv,
            "phone": phone,
            "email": email,
            "pipelineStatus": pipeline,
            "segment": spec or "Segment B",
            "notes": notes,
            "createdAt": date_term or "2026-05-01T00:00:00.000Z"
        }
        hospitals.append(hosp_dict)
        hosp_id_to_hosp[rid] = hosp_dict

# Second pass for Departments
dept_lookup = {} # (hosp_id, dept_name.lower()) -> dept_id
for r in rows:
    rtype = r.get("TYP_REKORDU", "").strip().upper()
    if rtype in ["ODDZIAŁ", "ODDZIAL"]:
        rid = r.get("ID", "").strip()
        title = r.get("NAZWA_LUB_TYTUL", "").strip()
        hosp_name = r.get("SZPITAL_PLACOWKA", "").strip()
        dept_name = r.get("ODDZIAL", "").strip() or title
        spec = r.get("SPECJALIZACJA_LUB_TYP", "").strip().lower()
        date_term = r.get("DATA_LUB_TERMIN", "").strip()

        h_id = hosp_name_to_id.get(hosp_name)
        if not h_id:
            # Match by id pattern e.g. dept_10_1 -> hosp_10
            m = re.match(r'dept_(\d+)_', rid)
            if m:
                h_id = f"hosp_{m.group(1)}"
            elif "hosp_" in rid:
                m2 = re.search(r'hosp_\d+', rid)
                if m2:
                    h_id = m2.group(0)

        dtype = "SURGICAL"
        if "zachowawczy" in spec:
            dtype = "CONSERVATIVE"
        elif "diagnostyczny" in spec:
            dtype = "DIAGNOSTIC"

        dept_dict = {
            "id": rid,
            "hospitalId": h_id or "hosp_1",
            "name": title or dept_name,
            "type": dtype,
            "description": "",
            "createdAt": date_term or "2026-05-01T00:00:00.000Z"
        }
        departments.append(dept_dict)
        if h_id:
            dept_lookup[(h_id, (title or dept_name).strip().lower())] = rid

# Helper for doctor name parsing
def parse_doctor_name(raw_name):
    clean = raw_name.strip()
    title = ""
    # Check known titles
    title_patterns = [
        r'^(prof\. dr hab\. med\.|prof\. dr hab\.|prof\. dr|prof\.|dr hab\. n\. med\.|dr hab\. med\.|dr hab\.|dr n\. med\.|dr n med\.|dr\.|dr|DR|plg\.|plg|mgr\.|mgr|lek\.|lek)\s*',
    ]
    for p in title_patterns:
        m = re.match(p, clean, re.IGNORECASE)
        if m:
            title = m.group(0).strip()
            clean = clean[m.end():].strip()
            break
    
    parts = clean.split()
    if len(parts) >= 2:
        first_name = parts[0]
        last_name = " ".join(parts[1:])
    elif len(parts) == 1:
        first_name = parts[0]
        last_name = ""
    else:
        first_name = "Lekarz"
        last_name = ""
    
    if not title:
        title = "dr"
    return title, first_name, last_name

doc_name_to_id = {}
# Third pass for Doctors
for r in rows:
    rtype = r.get("TYP_REKORDU", "").strip().upper()
    if rtype in ["LEKARZ", "DOKTOR"]:
        rid = r.get("ID", "").strip()
        title_str = r.get("NAZWA_LUB_TYTUL", "").strip()
        hosp_name = r.get("SZPITAL_PLACOWKA", "").strip()
        dept_name = r.get("ODDZIAL", "").strip()
        doc_contact = r.get("LEKARZ_OSOBA_KONTAKTOWA", "").strip() or title_str
        spec = r.get("SPECJALIZACJA_LUB_TYP", "").strip()
        phone = r.get("TELEFON", "").strip()
        email = r.get("EMAIL", "").strip()
        notes = r.get("TRESC_NOTATKI_OPIS", "").strip()
        date_term = r.get("DATA_LUB_TERMIN", "").strip()

        h_id = hosp_name_to_id.get(hosp_name)
        if not h_id:
            m = re.search(r'hosp_\d+', rid)
            if m:
                h_id = m.group(0)

        d_id = None
        if h_id and dept_name:
            d_id = dept_lookup.get((h_id, dept_name.strip().lower()))

        parsed_title, first_n, last_n = parse_doctor_name(doc_contact)

        doc_dict = {
            "id": rid,
            "hospitalId": h_id or "hosp_1",
            "departmentId": d_id,
            "firstName": first_n,
            "lastName": last_n,
            "title": parsed_title,
            "specialization": spec or "Ogólna",
            "phone": phone,
            "email": email,
            "notes": notes,
            "createdAt": date_term or "2026-05-01T00:00:00.000Z"
        }
        doctors.append(doc_dict)
        doc_name_to_id[doc_contact.strip().lower()] = rid
        doc_name_to_id[f"{first_n} {last_n}".strip().lower()] = rid

# Fourth pass for Meetings
meeting_id_set = set()
for r in rows:
    rtype = r.get("TYP_REKORDU", "").strip().upper()
    if rtype in ["WIZYTA / SPOTKANIE", "WIZYTA", "SPOTKANIE"]:
        rid = r.get("ID", "").strip()
        title_str = r.get("NAZWA_LUB_TYTUL", "").strip()
        hosp_name = r.get("SZPITAL_PLACOWKA", "").strip()
        dept_name = r.get("ODDZIAL", "").strip()
        doc_contact = r.get("LEKARZ_OSOBA_KONTAKTOWA", "").strip()
        spec = r.get("SPECJALIZACJA_LUB_TYP", "").strip()
        status = r.get("STATUS_LUB_ETAP", "").strip()
        date_term = r.get("DATA_LUB_TERMIN", "").strip()
        tags_str = r.get("TAGI_PRODUKTOWE", "").strip()
        notes = r.get("TRESC_NOTATKI_OPIS", "").strip()
        rep = r.get("PRZEDSTAWICIEL_AUTOR", "").strip() or "Łukasz W."

        h_id = hosp_name_to_id.get(hosp_name)
        if not h_id:
            m = re.search(r'hosp_\d+', rid)
            if m:
                h_id = m.group(0)

        d_id = None
        if h_id and dept_name:
            d_id = dept_lookup.get((h_id, dept_name.strip().lower()))

        doc_id = None
        if doc_contact:
            doc_id = doc_name_to_id.get(doc_contact.strip().lower())
            if not doc_id:
                _, fn, ln = parse_doctor_name(doc_contact)
                doc_id = doc_name_to_id.get(f"{fn} {ln}".strip().lower())

        tag_list = [t.strip() for t in tags_str.split(",") if t.strip()] if tags_str else []

        m_dict = {
            "id": rid,
            "title": title_str,
            "meetingDate": date_term or "2026-05-01T10:00:00",
            "hospitalId": h_id or "hosp_1",
            "departmentId": d_id,
            "doctorIds": [doc_id] if doc_id else [],
            "productTags": tag_list,
            "contentMarkdown": notes,
            "meetingType": "PRESENTATION" if "presentation" in spec.lower() else "REGULAR",
            "closedAt": date_term if status.lower() in ["zamknięte", "zamkniete", "closed"] else None,
            "approvalStatus": "APPROVED",
            "representativeName": rep,
            "createdAt": date_term or "2026-05-01T00:00:00.000Z"
        }
        meetings.append(m_dict)
        meeting_id_set.add(rid)

# Fifth pass for Tasks
for r in rows:
    rtype = r.get("TYP_REKORDU", "").strip().upper()
    if rtype in ["FOLLOW-UP / ZADANIE", "ZADANIE", "TASK", "FOLLOW-UP"]:
        rid = r.get("ID", "").strip()
        title_str = r.get("NAZWA_LUB_TYTUL", "").strip()
        hosp_name = r.get("SZPITAL_PLACOWKA", "").strip()
        dept_name = r.get("ODDZIAL", "").strip()
        doc_contact = r.get("LEKARZ_OSOBA_KONTAKTOWA", "").strip()
        spec = r.get("SPECJALIZACJA_LUB_TYP", "").strip()
        status = r.get("STATUS_LUB_ETAP", "").strip()
        date_term = r.get("DATA_LUB_TERMIN", "").strip()
        notes = r.get("TRESC_NOTATKI_OPIS", "").strip()

        h_id = hosp_name_to_id.get(hosp_name)
        if not h_id:
            m = re.search(r'hosp_\d+', rid)
            if m:
                h_id = m.group(0)

        d_id = None
        if h_id and dept_name:
            d_id = dept_lookup.get((h_id, dept_name.strip().lower()))

        doc_id = None
        if doc_contact:
            doc_id = doc_name_to_id.get(doc_contact.strip().lower())
            if not doc_id:
                _, fn, ln = parse_doctor_name(doc_contact)
                doc_id = doc_name_to_id.get(f"{fn} {ln}".strip().lower())

        is_done = "zrealizowane" in status.lower() or "wykonane" in spec.lower() or "done" in status.lower()

        # Find linked meeting id
        linked_mid = None
        # if rid starts with t_16070 -> m_16070
        m_match = re.match(r't_(\w+?)_', rid)
        if m_match:
            candidate_m = f"m_{m_match.group(1)}"
            if candidate_m in meeting_id_set:
                linked_mid = candidate_m

        t_dict = {
            "id": rid,
            "description": title_str,
            "hospitalId": h_id,
            "departmentId": d_id,
            "doctorId": doc_id,
            "meetingId": linked_mid,
            "dueDate": date_term.split("T")[0] if date_term else "2026-08-31",
            "isDone": is_done,
            "assignedTo": "Łukasz W.",
            "createdAt": "2026-05-01T00:00:00.000Z"
        }
        tasks.append(t_dict)

print(f"Parsed: {len(hospitals)} hospitals, {len(departments)} departments, {len(doctors)} doctors, {len(meetings)} meetings, {len(tasks)} tasks.")

# Write Kotlin SeedDataProvider.kt
def escape_kotlin(s):
    if s is None:
        return ""
    return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("$", "\\$")

kt_code = """package com.example.macscrm.data.local

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
            mustChangePassword = false,
            phone = "+48 600 100 200",
            territory = "Polska Północno-Wschodnia (Podlaskie, Mazowieckie, Lubelskie, Warmińsko-Mazurskie)",
            specialization = "Kardiochirurgia / Chirurgia Naczyniowa",
            monthlyTargetVisits = 45,
            vehiclePlate = "BI 98765",
            preferredNavigationApp = "Google Maps",
            notificationsEnabled = true,
            advanceReminderMinutes = 30
        ),
        UserEntity(
            id = "usr_pawel_p",
            name = "Paweł Plesiak",
            email = "pawel.p@macsmedical.eu",
            role = "MANAGER",
            isActive = true,
            createdAt = "2026-01-01T00:00:00.000Z",
            password = "Macs123",
            mustChangePassword = false,
            phone = "+48 600 300 400",
            territory = "Polska Centralna",
            specialization = "Urologia / Chirurgia Małoinwazyjna",
            monthlyTargetVisits = 30,
            vehiclePlate = "WI 12345"
        ),
        UserEntity(
            id = "usr_rep_1",
            name = "Łukasz Nowak",
            email = "lukasz.nowak@base44.pl",
            role = "SALES_REP",
            isActive = true,
            createdAt = "2026-01-15T00:00:00.000Z",
            password = "Macs123",
            mustChangePassword = false,
            phone = "+48 600 500 600",
            territory = "Lubelskie / Podlaskie",
            specialization = "Lupy Orascoptic / Narzędzia Scanlan",
            monthlyTargetVisits = 40,
            vehiclePlate = "LU 54321"
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
            "Scanlan SU",
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
"""

for h in hospitals:
    kt_code += f"""        HospitalEntity(
            id = "{escape_kotlin(h['id'])}",
            name = "{escape_kotlin(h['name'])}",
            address = "{escape_kotlin(h['address'])}",
            city = "{escape_kotlin(h['city'])}",
            voivodeship = "{escape_kotlin(h['voivodeship'])}",
            phone = "{escape_kotlin(h['phone'])}",
            email = "{escape_kotlin(h['email'])}",
            pipelineStatus = "{escape_kotlin(h['pipelineStatus'])}",
            segment = "{escape_kotlin(h['segment'])}",
            notes = "{escape_kotlin(h['notes'])}",
            createdAt = "{escape_kotlin(h['createdAt'])}"
        ),\n"""

kt_code += """    )

    fun getInitialDepartments(): List<DepartmentEntity> = listOf(
"""

for d in departments:
    kt_code += f"""        DepartmentEntity(
            id = "{escape_kotlin(d['id'])}",
            hospitalId = "{escape_kotlin(d['hospitalId'])}",
            name = "{escape_kotlin(d['name'])}",
            type = "{escape_kotlin(d['type'])}",
            description = "{escape_kotlin(d['description'])}",
            createdAt = "{escape_kotlin(d['createdAt'])}"
        ),\n"""

kt_code += """    )

    fun getInitialDoctors(): List<DoctorEntity> = listOf(
"""

for doc in doctors:
    dep_val = f'"{escape_kotlin(doc["departmentId"])}"' if doc["departmentId"] else "null"
    kt_code += f"""        DoctorEntity(
            id = "{escape_kotlin(doc['id'])}",
            hospitalId = "{escape_kotlin(doc['hospitalId'])}",
            departmentId = {dep_val},
            firstName = "{escape_kotlin(doc['firstName'])}",
            lastName = "{escape_kotlin(doc['lastName'])}",
            title = "{escape_kotlin(doc['title'])}",
            specialization = "{escape_kotlin(doc['specialization'])}",
            phone = "{escape_kotlin(doc['phone'])}",
            email = "{escape_kotlin(doc['email'])}",
            notes = "{escape_kotlin(doc['notes'])}",
            createdAt = "{escape_kotlin(doc['createdAt'])}"
        ),\n"""

kt_code += """    )

    fun getInitialMeetings(): List<MeetingEntity> = listOf(
"""

for m in meetings:
    dep_val = f'"{escape_kotlin(m["departmentId"])}"' if m["departmentId"] else "null"
    doc_ids_str = ", ".join([f'"{escape_kotlin(di)}"' for di in m["doctorIds"]])
    tags_str = ", ".join([f'"{escape_kotlin(t)}"' for t in m["productTags"]])
    closed_val = f'"{escape_kotlin(m["closedAt"])}"' if m["closedAt"] else "null"

    kt_code += f"""        MeetingEntity(
            id = "{escape_kotlin(m['id'])}",
            title = "{escape_kotlin(m['title'])}",
            meetingDate = "{escape_kotlin(m['meetingDate'])}",
            hospitalId = "{escape_kotlin(m['hospitalId'])}",
            departmentId = {dep_val},
            doctorIds = listOf({doc_ids_str}),
            productTags = listOf({tags_str}),
            contentMarkdown = \"\"\"{m['contentMarkdown']}\"\"\",
            meetingType = "{escape_kotlin(m['meetingType'])}",
            closedAt = {closed_val},
            approvalStatus = "{escape_kotlin(m['approvalStatus'])}",
            representativeName = "{escape_kotlin(m['representativeName'])}",
            createdAt = "{escape_kotlin(m['createdAt'])}"
        ),\n"""

kt_code += """    )

    fun getInitialTasks(): List<TaskEntity> = listOf(
"""

for t in tasks:
    hosp_val = f'"{escape_kotlin(t["hospitalId"])}"' if t["hospitalId"] else "null"
    dep_val = f'"{escape_kotlin(t["departmentId"])}"' if t["departmentId"] else "null"
    doc_val = f'"{escape_kotlin(t["doctorId"])}"' if t["doctorId"] else "null"
    meet_val = f'"{escape_kotlin(t["meetingId"])}"' if t["meetingId"] else "null"
    done_val = "true" if t["isDone"] else "false"

    kt_code += f"""        TaskEntity(
            id = "{escape_kotlin(t['id'])}",
            description = "{escape_kotlin(t['description'])}",
            hospitalId = {hosp_val},
            departmentId = {dep_val},
            doctorId = {doc_val},
            meetingId = {meet_val},
            dueDate = "{escape_kotlin(t['dueDate'])}",
            isDone = {done_val},
            assignedTo = "{escape_kotlin(t['assignedTo'])}",
            createdAt = "{escape_kotlin(t['createdAt'])}"
        ),\n"""

kt_code += """    )
}
"""

with open("/app/applet/app/src/main/java/com/example/macscrm/data/local/SeedDataProvider.kt", "w", encoding="utf-8") as out:
    out.write(kt_code)

print("Successfully written SeedDataProvider.kt!")
