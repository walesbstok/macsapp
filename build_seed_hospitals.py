import csv

with open("app/src/main/assets/hospitals.csv", "r", encoding="utf-8") as f:
    reader = csv.DictReader(f, delimiter=";")
    rows = list(reader)

print("Parsed count:", len(rows))

lines = []
lines.append("package com.example.macscrm.data.local")
lines.append("")
lines.append("import com.example.macscrm.data.local.entity.*")
lines.append("import com.example.macscrm.data.model.*")
lines.append("")
lines.append("object SeedDataProvider {")
lines.append("")
lines.append("    fun getDefaultUsers(): List<UserEntity> = listOf(")
lines.append("        UserEntity(")
lines.append("            id = \"usr_lukasz_w\",")
lines.append("            name = \"Łukasz W.\",")
lines.append("            email = \"lukasz.w@macsmedical.eu\",")
lines.append("            role = \"ADMIN\",")
lines.append("            isActive = true,")
lines.append("            createdAt = \"2026-01-01T00:00:00.000Z\",")
lines.append("            password = \"Macs123\",")
lines.append("            mustChangePassword = false")
lines.append("        ),")
lines.append("        UserEntity(")
lines.append("            id = \"usr_pawel_p\",")
lines.append("            name = \"Paweł Plesiak\",")
lines.append("            email = \"pawel.p@macsmedical.eu\",")
lines.append("            role = \"MANAGER\",")
lines.append("            isActive = true,")
lines.append("            createdAt = \"2026-01-01T00:00:00.000Z\",")
lines.append("            password = \"Macs123\",")
lines.append("            mustChangePassword = false")
lines.append("        ),")
lines.append("        UserEntity(")
lines.append("            id = \"usr_rep_1\",")
lines.append("            name = \"Łukasz Nowak\",")
lines.append("            email = \"lukasz.nowak@base44.pl\",")
lines.append("            role = \"SALES_REP\",")
lines.append("            isActive = true,")
lines.append("            createdAt = \"2026-01-15T00:00:00.000Z\",")
lines.append("            password = \"Macs123\",")
lines.append("            mustChangePassword = false")
lines.append("        )")
lines.append("    )")
lines.append("")
lines.append("    fun getDefaultSettings(): SettingsEntity = SettingsEntity(")
lines.append("        id = \"system_settings\",")
lines.append("        brandName = \"Mac's CRM\",")
lines.append("        enableMeetingApprovals = true,")
lines.append("        defaultMapLat = 52.2297,")
lines.append("        defaultMapLng = 21.0122,")
lines.append("        productsList = listOf(")
lines.append("            \"ALLIUM\",")
lines.append("            \"BLUENEEN\",")
lines.append("            \"BIOSIS\",")
lines.append("            \"TISGENEX\",")
lines.append("            \"SCANLAN\",")
lines.append("            \"SSU\",")
lines.append("            \"GENESEE\",")
lines.append("            \"NEOS SternFix\",")
lines.append("            \"NEOS Cranial Loop\",")
lines.append("            \"CINVIVO\",")
lines.append("            \"DEGANIA\",")
lines.append("            \"ORASCOPTIC\",")
lines.append("            \"OTHER\"")
lines.append("        )")
lines.append("    )")
lines.append("")
lines.append("    fun getInitialHospitals(): List<HospitalEntity> = listOf(")

for i, r in enumerate(rows):
    hid = r.get("ID Placówki", "").strip()
    name = r.get("Nazwa Szpitala / Placówki", "").strip().replace('"', '\\"')
    city = r.get("Miasto", "").strip().replace('"', '\\"')
    addr = r.get("Adres", "").strip().replace('"', '\\"')
    voiv = r.get("Województwo", "").strip().replace('"', '\\"')
    seg = r.get("Segment", "").strip().replace('"', '\\"')
    status = r.get("Status Relacji", "").strip().upper().replace(" ", "_")
    phone = r.get("Telefon", "").strip().replace('"', '\\"')
    email = r.get("Email", "").strip().replace('"', '\\"')
    web = r.get("Strona WWW", "").strip().replace('"', '\\"')
    try:
        lat = float(r.get("Szerokość GPS (Lat)", "0.0") or 0.0)
    except:
        lat = 0.0
    try:
        lng = float(r.get("Długość GPS (Lng)", "0.0") or 0.0)
    except:
        lng = 0.0
    notes = r.get("Notatki", "").strip().replace('"', '\\"')
    created = r.get("Data Utworzenia", "").strip().replace('"', '\\"')
    updated = r.get("Data Aktualizacji", "").strip().replace('"', '\\"')
    
    score = 5 if seg == "A" else (4 if seg == "B" else 3)
    
    comma = "," if i < len(rows) - 1 else ""
    lines.append(f"""        HospitalEntity(
            id = "{hid}",
            name = "{name}",
            address = "{addr}",
            city = "{city}",
            voivodeship = "{voiv}",
            phone = "{phone}",
            email = "{email}",
            website = "{web}",
            pipelineStatus = "{status}",
            lat = {lat},
            lng = {lng},
            postalCode = "",
            importanceScore = {score},
            notes = "{notes}",
            segment = "{seg}",
            createdAt = "{created}",
            updatedAt = "{updated}"
        ){comma}""")

lines.append("    )")
lines.append("")
lines.append("    fun getInitialDepartments(): List<DepartmentEntity> = emptyList()")
lines.append("")
lines.append("    fun getInitialDoctors(): List<DoctorEntity> = emptyList()")
lines.append("")
lines.append("    fun getInitialMeetings(): List<MeetingEntity> = emptyList()")
lines.append("")
lines.append("    fun getInitialTasks(): List<TaskEntity> = emptyList()")
lines.append("")
lines.append("    fun getInitialTrips(): List<TripEntity> = emptyList()")
lines.append("")
lines.append("    fun getInitialTripDays(): List<TripDayEntity> = emptyList()")
lines.append("")
lines.append("    fun getInitialVisits(): List<VisitEntity> = emptyList()")
lines.append("}")
lines.append("")

with open("app/src/main/java/com/example/macscrm/data/local/SeedDataProvider.kt", "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print("Successfully written SeedDataProvider.kt with 87 hospitals.")
