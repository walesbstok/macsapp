package com.example.macscrm.data.backup

import com.example.macscrm.data.local.AppDatabase
import com.example.macscrm.data.local.entity.*
import com.example.macscrm.data.model.*
import org.json.JSONArray
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.*

data class BackupStats(
    val hospitalsCount: Int = 0,
    val departmentsCount: Int = 0,
    val doctorsCount: Int = 0,
    val meetingsCount: Int = 0,
    val tasksCount: Int = 0,
    val tripsCount: Int = 0,
    val usersCount: Int = 0,
    val exportDate: String = ""
)

data class BackupResult(
    val isSuccess: Boolean,
    val message: String,
    val stats: BackupStats = BackupStats()
)

class BackupManager(private val database: AppDatabase) {

    private val hospitalDao = database.hospitalDao()
    private val departmentDao = database.departmentDao()
    private val doctorDao = database.doctorDao()
    private val meetingDao = database.meetingDao()
    private val taskDao = database.taskDao()
    private val tripDao = database.tripDao()
    private val userDao = database.userDao()
    private val settingsDao = database.settingsDao()

    // Helper: read a JSON array of strings, tolerant of a missing/absent key
    private fun JSONObject.getStringList(key: String): List<String> {
        if (!has(key)) return emptyList()
        val arr = optJSONArray(key) ?: return emptyList()
        val list = mutableListOf<String>()
        for (i in 0 until arr.length()) list.add(arr.getString(i))
        return list
    }

    suspend fun createBackupJson(): String {
        val root = JSONObject()
        val nowIso = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.getDefault()).format(Date())

        // Metadata
        val meta = JSONObject()
        meta.put("version", 1)
        meta.put("exportedAt", nowIso)
        meta.put("app", "MACS CRM")
        root.put("metadata", meta)

        // Settings
        val settings = settingsDao.getSettingsSnapshot()
        if (settings != null) {
            val settingsJson = JSONObject()
            settingsJson.put("brandName", settings.brandName)
            settingsJson.put("enableMeetingApprovals", settings.enableMeetingApprovals)
            settingsJson.put("defaultMapLat", settings.defaultMapLat)
            settingsJson.put("defaultMapLng", settings.defaultMapLng)
            settingsJson.put("productsList", JSONArray(settings.productsList))
            root.put("settings", settingsJson)
        }

        // Users
        val users = userDao.getAllSnapshot()
        val usersArray = JSONArray()
        users.forEach { u ->
            val obj = JSONObject()
            obj.put("id", u.id)
            obj.put("name", u.name)
            obj.put("email", u.email)
            obj.put("role", u.role)
            obj.put("isActive", u.isActive)
            obj.put("createdAt", u.createdAt)
            obj.put("password", u.password)
            obj.put("mustChangePassword", u.mustChangePassword)
            usersArray.put(obj)
        }
        root.put("users", usersArray)

        // Hospitals
        val hospitals = hospitalDao.getAllSnapshot()
        val hospitalsArray = JSONArray()
        hospitals.forEach { h ->
            val obj = JSONObject()
            obj.put("id", h.id)
            obj.put("name", h.name)
            obj.put("address", h.address)
            obj.put("city", h.city)
            obj.put("voivodeship", h.voivodeship)
            obj.put("phone", h.phone)
            obj.put("email", h.email)
            obj.put("website", h.website)
            obj.put("pipelineStatus", h.pipelineStatus)
            obj.put("lat", h.lat)
            obj.put("lng", h.lng)
            obj.put("notes", h.notes)
            obj.put("segment", h.segment)
            obj.put("postalCode", h.postalCode)
            obj.put("importanceScore", h.importanceScore)
            obj.put("createdAt", h.createdAt)
            obj.put("updatedAt", h.updatedAt)
            hospitalsArray.put(obj)
        }
        root.put("hospitals", hospitalsArray)

        // Departments
        val departments = departmentDao.getAllSnapshot()
        val departmentsArray = JSONArray()
        departments.forEach { d ->
            val obj = JSONObject()
            obj.put("id", d.id)
            obj.put("hospitalId", d.hospitalId)
            obj.put("name", d.name)
            obj.put("type", d.type)
            obj.put("createdAt", d.createdAt)
            departmentsArray.put(obj)
        }
        root.put("departments", departmentsArray)

        // Doctors
        val doctors = doctorDao.getAllSnapshot()
        val doctorsArray = JSONArray()
        doctors.forEach { doc ->
            val obj = JSONObject()
            obj.put("id", doc.id)
            obj.put("hospitalId", doc.hospitalId)
            obj.put("departmentId", doc.departmentId)
            obj.put("firstName", doc.firstName)
            obj.put("lastName", doc.lastName)
            obj.put("title", doc.title)
            obj.put("specialization", doc.specialization)
            obj.put("phone", doc.phone)
            obj.put("email", doc.email)
            obj.put("notes", doc.notes)
            obj.put("createdAt", doc.createdAt)
            obj.put("updatedAt", doc.updatedAt)
            doctorsArray.put(obj)
        }
        root.put("doctors", doctorsArray)

        // Meetings
        val meetings = meetingDao.getAllSnapshot()
        val meetingsArray = JSONArray()
        meetings.forEach { m ->
            val obj = JSONObject()
            obj.put("id", m.id)
            obj.put("hospitalId", m.hospitalId)
            obj.put("departmentId", m.departmentId)
            obj.put("doctorId", m.doctorId)
            obj.put("doctorIds", JSONArray(m.doctorIds))
            obj.put("title", m.title)
            obj.put("meetingDate", m.meetingDate)
            obj.put("meetingType", m.meetingType)
            obj.put("representativeName", m.representativeName)
            obj.put("contentMarkdown", m.contentMarkdown)
            obj.put("productTags", JSONArray(m.productTags))
            obj.put("closedAt", m.closedAt)
            obj.put("approvalStatus", m.approvalStatus)
            obj.put("managerComment", m.managerComment)
            obj.put("createdAt", m.createdAt)
            obj.put("updatedAt", m.updatedAt)
            meetingsArray.put(obj)
        }
        root.put("meetings", meetingsArray)

        // Tasks
        val tasks = taskDao.getAllSnapshot()
        val tasksArray = JSONArray()
        tasks.forEach { t ->
            val obj = JSONObject()
            obj.put("id", t.id)
            obj.put("meetingId", t.meetingId)
            obj.put("hospitalId", t.hospitalId)
            obj.put("departmentId", t.departmentId)
            obj.put("doctorId", t.doctorId)
            obj.put("description", t.description)
            obj.put("dueDate", t.dueDate)
            obj.put("isDone", t.isDone)
            obj.put("createdAt", t.createdAt)
            tasksArray.put(obj)
        }
        root.put("tasks", tasksArray)

        // Trips
        val trips = tripDao.getAllTripsSnapshot()
        val tripsArray = JSONArray()
        trips.forEach { tr ->
            val obj = JSONObject()
            obj.put("id", tr.id)
            obj.put("startDate", tr.startDate)
            obj.put("endDate", tr.endDate)
            obj.put("title", tr.title)
            obj.put("status", tr.status)
            obj.put("createdAt", tr.createdAt)
            tripsArray.put(obj)
        }
        root.put("trips", tripsArray)

        val tripDays = tripDao.getAllTripDaysSnapshot()
        val tripDaysArray = JSONArray()
        tripDays.forEach { td ->
            val obj = JSONObject()
            obj.put("id", td.id)
            obj.put("tripId", td.tripId)
            obj.put("date", td.date)
            obj.put("overnightLocation", td.overnightLocation)
            obj.put("overnightSundayLocation", td.overnightSundayLocation)
            obj.put("orderIndex", td.orderIndex)
            tripDaysArray.put(obj)
        }
        root.put("tripDays", tripDaysArray)

        val visits = tripDao.getAllVisitsSnapshot()
        val visitsArray = JSONArray()
        visits.forEach { v ->
            val obj = JSONObject()
            obj.put("id", v.id)
            obj.put("tripDayId", v.tripDayId)
            obj.put("hospitalId", v.hospitalId)
            obj.put("departmentId", v.departmentId)
            obj.put("doctorId", v.doctorId)
            obj.put("isFixedSlot", v.isFixedSlot)
            obj.put("timeSlot", v.timeSlot)
            visitsArray.put(obj)
        }
        root.put("visits", visitsArray)

        return root.toString(2)
    }

    suspend fun restoreFromJson(jsonString: String, overwriteExisting: Boolean): BackupResult {
        return try {
            val root = JSONObject(jsonString)

            if (overwriteExisting) {
                hospitalDao.deleteAll()
                departmentDao.deleteAll()
                doctorDao.deleteAll()
                meetingDao.deleteAll()
                taskDao.deleteAll()
                tripDao.deleteAllTrips()
                tripDao.deleteAllTripDays()
                tripDao.deleteAllVisits()
                userDao.deleteAll()
            }

            // Restore Settings
            if (root.has("settings")) {
                val settingsJson = root.getJSONObject("settings")
                val brandName = settingsJson.optString("brandName", "MACS CRM")
                val enableApprovals = settingsJson.optBoolean("enableMeetingApprovals", true)
                val defaultMapLat = settingsJson.optDouble("defaultMapLat", 52.2297)
                val defaultMapLng = settingsJson.optDouble("defaultMapLng", 21.0122)
                val prods = if (settingsJson.has("productsList")) {
                    settingsJson.getStringList("productsList")
                } else {
                    listOf("SCANLAN", "ALLIUM", "BIOSIS", "ORASCOPTIC", "NEOS SternFix")
                }
                settingsDao.saveSettings(
                    SettingsEntity(
                        id = "system_settings",
                        brandName = brandName,
                        enableMeetingApprovals = enableApprovals,
                        defaultMapLat = defaultMapLat,
                        defaultMapLng = defaultMapLng,
                        productsList = prods
                    )
                )
            }

            // Restore Users
            val userEntities = mutableListOf<UserEntity>()
            if (root.has("users")) {
                val arr = root.getJSONArray("users")
                for (i in 0 until arr.length()) {
                    val obj = arr.getJSONObject(i)
                    userEntities.add(
                        UserEntity(
                            id = obj.getString("id"),
                            name = obj.getString("name"),
                            email = obj.getString("email"),
                            role = obj.getString("role"),
                            isActive = obj.optBoolean("isActive", true),
                            createdAt = obj.optString("createdAt", ""),
                            password = obj.optString("password", ""),
                            mustChangePassword = obj.optBoolean("mustChangePassword", false)
                        )
                    )
                }
                userDao.insertAll(userEntities)
            }

            // Restore Hospitals
            val hospitalEntities = mutableListOf<HospitalEntity>()
            if (root.has("hospitals")) {
                val arr = root.getJSONArray("hospitals")
                for (i in 0 until arr.length()) {
                    val obj = arr.getJSONObject(i)
                    hospitalEntities.add(
                        HospitalEntity(
                            id = obj.getString("id"),
                            name = obj.getString("name"),
                            address = obj.optString("address", ""),
                            city = obj.optString("city", ""),
                            voivodeship = obj.optString("voivodeship", ""),
                            phone = obj.optString("phone", ""),
                            email = obj.optString("email", ""),
                            website = obj.optString("website", ""),
                            pipelineStatus = obj.optString("pipelineStatus", "ACTIVE"),
                            lat = if (obj.has("lat") && !obj.isNull("lat")) obj.getDouble("lat") else null,
                            lng = if (obj.has("lng") && !obj.isNull("lng")) obj.getDouble("lng") else null,
                            notes = obj.optString("notes", ""),
                            segment = obj.optString("segment", ""),
                            postalCode = obj.optString("postalCode", ""),
                            importanceScore = obj.optInt("importanceScore", 3),
                            createdAt = obj.optString("createdAt", ""),
                            updatedAt = obj.optString("updatedAt", "")
                        )
                    )
                }
                hospitalDao.insertAll(hospitalEntities)
            }

            // Restore Departments
            val departmentEntities = mutableListOf<DepartmentEntity>()
            if (root.has("departments")) {
                val arr = root.getJSONArray("departments")
                for (i in 0 until arr.length()) {
                    val obj = arr.getJSONObject(i)
                    departmentEntities.add(
                        DepartmentEntity(
                            id = obj.getString("id"),
                            hospitalId = obj.getString("hospitalId"),
                            name = obj.getString("name"),
                            type = obj.optString("type", ""),
                            createdAt = obj.optString("createdAt", "")
                        )
                    )
                }
                departmentDao.insertAll(departmentEntities)
            }

            // Restore Doctors
            val doctorEntities = mutableListOf<DoctorEntity>()
            if (root.has("doctors")) {
                val arr = root.getJSONArray("doctors")
                for (i in 0 until arr.length()) {
                    val obj = arr.getJSONObject(i)
                    doctorEntities.add(
                        DoctorEntity(
                            id = obj.getString("id"),
                            firstName = obj.optString("firstName", ""),
                            lastName = obj.optString("lastName", ""),
                            title = obj.optString("title", "lek. med."),
                            hospitalId = obj.getString("hospitalId"),
                            departmentId = obj.optString("departmentId", ""),
                            phone = obj.optString("phone", ""),
                            email = obj.optString("email", ""),
                            specialization = obj.optString("specialization", "Chirurgia"),
                            notes = obj.optString("notes", ""),
                            createdAt = obj.optString("createdAt", ""),
                            updatedAt = obj.optString("updatedAt", "")
                        )
                    )
                }
                doctorDao.insertAll(doctorEntities)
            }

            // Restore Meetings
            val meetingEntities = mutableListOf<MeetingEntity>()
            if (root.has("meetings")) {
                val arr = root.getJSONArray("meetings")
                for (i in 0 until arr.length()) {
                    val obj = arr.getJSONObject(i)
                    meetingEntities.add(
                        MeetingEntity(
                            id = obj.getString("id"),
                            title = obj.getString("title"),
                            meetingDate = obj.getString("meetingDate"),
                            hospitalId = obj.getString("hospitalId"),
                            departmentId = if (obj.has("departmentId") && !obj.isNull("departmentId")) obj.getString("departmentId") else null,
                            doctorId = if (obj.has("doctorId") && !obj.isNull("doctorId")) obj.getString("doctorId") else null,
                            doctorIds = obj.getStringList("doctorIds"),
                            productTags = obj.getStringList("productTags"),
                            contentMarkdown = obj.optString("contentMarkdown", ""),
                            meetingType = obj.optString("meetingType", "STANDARD"),
                            closedAt = if (obj.has("closedAt") && !obj.isNull("closedAt")) obj.getString("closedAt") else null,
                            createdAt = obj.optString("createdAt", ""),
                            updatedAt = obj.optString("updatedAt", ""),
                            approvalStatus = obj.optString("approvalStatus", "APPROVED"),
                            managerComment = obj.optString("managerComment", ""),
                            representativeName = obj.optString("representativeName", "Łukasz W.")
                        )
                    )
                }
                meetingDao.insertAll(meetingEntities)
            }

            // Restore Tasks
            val taskEntities = mutableListOf<TaskEntity>()
            if (root.has("tasks")) {
                val arr = root.getJSONArray("tasks")
                for (i in 0 until arr.length()) {
                    val obj = arr.getJSONObject(i)
                    taskEntities.add(
                        TaskEntity(
                            id = obj.getString("id"),
                            meetingId = obj.optString("meetingId", ""),
                            hospitalId = obj.optString("hospitalId", ""),
                            departmentId = obj.optString("departmentId", ""),
                            doctorId = obj.optString("doctorId", ""),
                            description = obj.getString("description"),
                            dueDate = if (obj.has("dueDate") && !obj.isNull("dueDate")) obj.getString("dueDate") else null,
                            isDone = obj.optBoolean("isDone", false),
                            createdAt = obj.optString("createdAt", "")
                        )
                    )
                }
                taskDao.insertAll(taskEntities)
            }

            // Restore Trips
            val tripEntities = mutableListOf<TripEntity>()
            if (root.has("trips")) {
                val arr = root.getJSONArray("trips")
                for (i in 0 until arr.length()) {
                    val obj = arr.getJSONObject(i)
                    tripEntities.add(
                        TripEntity(
                            id = obj.getString("id"),
                            startDate = obj.getString("startDate"),
                            endDate = obj.getString("endDate"),
                            status = obj.optString("status", "draft"),
                            title = obj.getString("title"),
                            createdAt = obj.optString("createdAt", "")
                        )
                    )
                }
                tripDao.insertTrips(tripEntities)
            }

            if (root.has("tripDays")) {
                val arr = root.getJSONArray("tripDays")
                val tripDayEntities = mutableListOf<TripDayEntity>()
                for (i in 0 until arr.length()) {
                    val obj = arr.getJSONObject(i)
                    tripDayEntities.add(
                        TripDayEntity(
                            id = obj.getString("id"),
                            tripId = obj.getString("tripId"),
                            date = obj.getString("date"),
                            overnightLocation = if (obj.has("overnightLocation") && !obj.isNull("overnightLocation")) obj.getString("overnightLocation") else null,
                            overnightSundayLocation = if (obj.has("overnightSundayLocation") && !obj.isNull("overnightSundayLocation")) obj.getString("overnightSundayLocation") else null,
                            orderIndex = obj.optInt("orderIndex", 0)
                        )
                    )
                }
                tripDao.insertTripDays(tripDayEntities)
            }

            if (root.has("visits")) {
                val arr = root.getJSONArray("visits")
                val visitEntities = mutableListOf<VisitEntity>()
                for (i in 0 until arr.length()) {
                    val obj = arr.getJSONObject(i)
                    visitEntities.add(
                        VisitEntity(
                            id = obj.getString("id"),
                            tripDayId = obj.getString("tripDayId"),
                            hospitalId = obj.getString("hospitalId"),
                            departmentId = obj.optString("departmentId", ""),
                            doctorId = if (obj.has("doctorId") && !obj.isNull("doctorId")) obj.getString("doctorId") else null,
                            isFixedSlot = obj.optBoolean("isFixedSlot", false),
                            timeSlot = obj.optString("timeSlot", "")
                        )
                    )
                }
                tripDao.insertVisits(visitEntities)
            }

            val stats = BackupStats(
                hospitalsCount = hospitalEntities.size,
                departmentsCount = departmentEntities.size,
                doctorsCount = doctorEntities.size,
                meetingsCount = meetingEntities.size,
                tasksCount = taskEntities.size,
                tripsCount = tripEntities.size,
                usersCount = userEntities.size,
                exportDate = root.optJSONObject("metadata")?.optString("exportedAt") ?: ""
            )

            BackupResult(
                isSuccess = true,
                message = "Pomyślnie zaimportowano bazę danych.",
                stats = stats
            )
        } catch (e: Exception) {
            BackupResult(
                isSuccess = false,
                message = "Błąd importu pliku JSON: ${e.localizedMessage ?: e.message}"
            )
        }
    }
}
    val email: String = "",
    val specialization: String = "",
    val notes: String = "",
    val createdAt: String = "",
    val updatedAt: String = ""
) {
    val fullName: String get() = if (title.isNotBlank()) "$title $firstName $lastName" else "$firstName $lastName"
}

data class Meeting(
    val id: String,
    val title: String,
    val meetingDate: String, // ISO String / formatted string
    val hospitalId: String,
    val departmentId: String? = null,
    val doctorId: String? = null,
    val doctorIds: List<String> = emptyList(),
    val productTags: List<String> = emptyList(),
    val contentMarkdown: String = "",
    val meetingType: MeetingType = MeetingType.REGULAR,
    val closedAt: String? = null,
    val createdAt: String = "",
    val updatedAt: String = "",
    val approvalStatus: ApprovalStatus = ApprovalStatus.PENDING,
    val managerComment: String = "",
    val representativeName: String = "Łukasz W."
) {
    val isClosed: Boolean get() = !closedAt.isNullOrBlank()
}

data class Task(
    val id: String,
    val meetingId: String = "",
    val hospitalId: String = "",
    val departmentId: String = "",
    val doctorId: String = "",
    val description: String,
    val dueDate: String? = null,
    val isDone: Boolean = false,
    val createdAt: String = ""
)

data class Trip(
    val id: String,
    val startDate: String,
    val endDate: String,
    val status: String = "draft", // draft | confirmed
    val title: String = "Tydzień Handlowy",
    val createdAt: String = ""
)

data class TripDay(
    val id: String,
    val tripId: String,
    val date: String,
    val overnightLocation: String? = null,
    val overnightSundayLocation: String? = null,
    val order: Int = 0
)

data class Visit(
    val id: String,
    val tripDayId: String,
    val hospitalId: String,
    val departmentId: String,
    val doctorId: String? = null,
    val isFixedSlot: Boolean = false,
    val timeSlot: String = "08:00"
)

data class CrmUser(
    val id: String,
    val name: String,
    val email: String,
    val role: UserRole = UserRole.SALES_REP,
    val isActive: Boolean = true,
    val createdAt: String = "",
    val password: String = "Macs123",
    val mustChangePassword: Boolean = false
)

data class SystemSettings(
    val brandName: String = "Mac's CRM",
    val enableMeetingApprovals: Boolean = true,
    val defaultMapLat: Double = 52.2297,
    val defaultMapLng: Double = 21.0122,
    val productsList: List<String> = listOf(
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
