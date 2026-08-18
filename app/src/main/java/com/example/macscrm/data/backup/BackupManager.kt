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
    val prodArray = JSONArray()
    (settings.productsList ?: "").split(",").filter { it.isNotEmpty() }.forEach { product -> prodArray.put(product.trim()) }
    settingsJson.put("productsList", prodArray)
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
            obj.put("city", h.city)
            obj.put("address", h.address)
            obj.put("postalCode", h.postalCode)
            obj.put("pipelineStatus", h.pipelineStatus)
            obj.put("importanceScore", h.importanceScore)
            obj.put("notes", h.notes)
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
            obj.put("floor", d.floor)
            obj.put("notes", d.notes)
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
            obj.put("academicTitle", doc.academicTitle)
            obj.put("specialization", doc.specialization)
            obj.put("phoneNumber", doc.phoneNumber)
            obj.put("email", doc.email)
            obj.put("availabilityNotes", doc.availabilityNotes)
            obj.put("attitude", doc.attitude)
            obj.put("isKeyContact", doc.isKeyContact)
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
            obj.put("title", m.title)
            obj.put("meetingDate", m.meetingDate)
            obj.put("representativeName", m.representativeName)
            obj.put("contentMarkdown", m.contentMarkdown)
            obj.put("productTags", m.productTags)
            obj.put("followUpPlan", m.followUpPlan)
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
            obj.put("overnightCity", td.overnightCity)
            obj.put("notes", td.notes)
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
            obj.put("plannedTime", v.plannedTime)
            obj.put("purpose", v.purpose)
            obj.put("orderIndex", v.orderIndex)
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
                val prods = if (settingsJson.has("productsList")) {
                    val arr = settingsJson.getJSONArray("productsList")
                    val list = mutableListOf<String>()
                    for (i in 0 until arr.length()) {
                        list.add(arr.getString(i))
                    }
                    list.joinToString(",")
                } else {
                    "SCANLAN,ALLIUM,BIOSIS,ORASCOPTIC,NEOS SternFix"
                }
                settingsDao.saveSettings(
                    SettingsEntity(
                        id = "system_settings",
                        brandName = brandName,
                        enableMeetingApprovals = enableApprovals,
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
                            createdAt = obj.optString("createdAt", "")
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
                            city = obj.optString("city", ""),
                            address = obj.optString("address", ""),
                            postalCode = obj.optString("postalCode", ""),
                            pipelineStatus = obj.optString("pipelineStatus", "ACTIVE"),
                            importanceScore = obj.optInt("importanceScore", 3),
                            notes = obj.optString("notes", ""),
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
                            floor = obj.optString("floor", ""),
                            notes = obj.optString("notes", ""),
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
                            hospitalId = obj.getString("hospitalId"),
                            departmentId = obj.optString("departmentId", ""),
                            firstName = obj.optString("firstName", ""),
                            lastName = obj.optString("lastName", ""),
                            academicTitle = obj.optString("academicTitle", "lek. med."),
                            specialization = obj.optString("specialization", "Chirurgia"),
                            phoneNumber = obj.optString("phoneNumber", ""),
                            email = obj.optString("email", ""),
                            availabilityNotes = obj.optString("availabilityNotes", ""),
                            attitude = obj.optString("attitude", "NEUTRAL"),
                            isKeyContact = obj.optBoolean("isKeyContact", false),
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
                            hospitalId = obj.getString("hospitalId"),
                            departmentId = obj.optString("departmentId", ""),
                            doctorId = obj.optString("doctorId", ""),
                            title = obj.getString("title"),
                            meetingDate = obj.getString("meetingDate"),
                            representativeName = obj.optString("representativeName", "Łukasz W."),
                            contentMarkdown = obj.optString("contentMarkdown", ""),
                            productTags = obj.optString("productTags", ""),
                            followUpPlan = obj.optString("followUpPlan", ""),
                            closedAt = if (obj.has("closedAt") && !obj.isNull("closedAt")) obj.getString("closedAt") else null,
                            approvalStatus = obj.optString("approvalStatus", "APPROVED"),
                            managerComment = obj.optString("managerComment", ""),
                            createdAt = obj.optString("createdAt", ""),
                            updatedAt = obj.optString("updatedAt", "")
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
                            title = obj.getString("title"),
                            status = obj.optString("status", "draft")
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
                            overnightCity = obj.optString("overnightCity", ""),
                            notes = obj.optString("notes", ""),
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
                            doctorId = obj.optString("doctorId", ""),
                            plannedTime = obj.optString("plannedTime", ""),
                            purpose = obj.optString("purpose", ""),
                            orderIndex = obj.optInt("orderIndex", 0)
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
