package com.example.macscrm.data.repository

import com.example.macscrm.data.local.AppDatabase
import com.example.macscrm.data.local.SeedDataProvider
import com.example.macscrm.data.local.entity.*
import com.example.macscrm.data.model.*
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

class CrmRepository(private val database: AppDatabase) {

    private val hospitalDao = database.hospitalDao()
    private val departmentDao = database.departmentDao()
    private val doctorDao = database.doctorDao()
    private val meetingDao = database.meetingDao()
    private val taskDao = database.taskDao()
    private val tripDao = database.tripDao()
    private val userDao = database.userDao()
    private val settingsDao = database.settingsDao()

    // Hospitals
    val allHospitals: Flow<List<Hospital>> = hospitalDao.getAll().map { list ->
        list.map { it.toDomain() }
    }

    suspend fun saveHospital(hospital: Hospital) {
        hospitalDao.insert(HospitalEntity.fromDomain(hospital))
    }

    suspend fun deleteHospital(id: String) {
        hospitalDao.deleteById(id)
    }

    // Departments
    val allDepartments: Flow<List<Department>> = departmentDao.getAll().map { list ->
        list.map { it.toDomain() }
    }

    fun getDepartmentsForHospital(hospitalId: String): Flow<List<Department>> {
        return departmentDao.getByHospitalId(hospitalId).map { list ->
            list.map { it.toDomain() }
        }
    }

    suspend fun saveDepartment(department: Department) {
        departmentDao.insert(DepartmentEntity.fromDomain(department))
    }

    suspend fun deleteDepartment(id: String) {
        departmentDao.deleteById(id)
    }

    // Doctors
    val allDoctors: Flow<List<Doctor>> = doctorDao.getAll().map { list ->
        list.map { it.toDomain() }
    }

    fun getDoctorsForHospital(hospitalId: String): Flow<List<Doctor>> {
        return doctorDao.getByHospitalId(hospitalId).map { list ->
            list.map { it.toDomain() }
        }
    }

    suspend fun saveDoctor(doctor: Doctor) {
        doctorDao.insert(DoctorEntity.fromDomain(doctor))
    }

    suspend fun deleteDoctor(id: String) {
        doctorDao.deleteById(id)
    }

    // Meetings
    val allMeetings: Flow<List<Meeting>> = meetingDao.getAll().map { list ->
        list.map { it.toDomain() }
    }

    suspend fun getMeetingById(id: String): Meeting? {
        return meetingDao.getById(id)?.toDomain()
    }

    suspend fun saveMeeting(meeting: Meeting) {
        meetingDao.insert(MeetingEntity.fromDomain(meeting))
    }

    suspend fun deleteMeeting(id: String) {
        meetingDao.deleteById(id)
    }

    // Tasks
    val allTasks: Flow<List<Task>> = taskDao.getAll().map { list ->
        list.map { it.toDomain() }
    }

    suspend fun saveTask(task: Task) {
        taskDao.insert(TaskEntity.fromDomain(task))
    }

    suspend fun deleteTask(id: String) {
        taskDao.deleteById(id)
    }

    // Trips
    val allTrips: Flow<List<Trip>> = tripDao.getAllTrips().map { list ->
        list.map { it.toDomain() }
    }

    fun getTripDays(tripId: String): Flow<List<TripDay>> {
        return tripDao.getDaysForTrip(tripId).map { list ->
            list.map { it.toDomain() }
        }
    }

    fun getVisitsForDay(dayId: String): Flow<List<Visit>> {
        return tripDao.getVisitsForDay(dayId).map { list ->
            list.map { it.toDomain() }
        }
    }

    suspend fun saveTrip(trip: Trip, days: List<TripDay>, visits: List<Visit>) {
        tripDao.insertTrip(TripEntity.fromDomain(trip))
        tripDao.deleteTripDays(trip.id)
        tripDao.insertTripDays(days.map { TripDayEntity.fromDomain(it) })
        for (day in days) {
            tripDao.deleteVisits(day.id)
        }
        tripDao.insertVisits(visits.map { VisitEntity.fromDomain(it) })
    }

    suspend fun deleteTrip(tripId: String) {
        tripDao.deleteTripById(tripId)
        tripDao.deleteTripDays(tripId)
    }

    // Users
    val allUsers: Flow<List<CrmUser>> = userDao.getAll().map { list ->
        list.map { it.toDomain() }
    }

    suspend fun saveUser(user: CrmUser) {
        userDao.insert(UserEntity.fromDomain(user))
    }

    suspend fun deleteUser(id: String) {
        userDao.deleteById(id)
    }

    // Settings
    val systemSettings: Flow<SystemSettings> = settingsDao.getSettings().map {
        it?.toDomain() ?: SystemSettings()
    }

    suspend fun saveSettings(settings: SystemSettings) {
        settingsDao.saveSettings(SettingsEntity.fromDomain(settings))
    }

    // Backup & Restore
    private val backupManager = com.example.macscrm.data.backup.BackupManager(database)

    suspend fun exportDatabaseToJson(): String {
        return backupManager.createBackupJson()
    }

    suspend fun exportDatabaseToCsv(): String {
        return backupManager.createExportCsv()
    }

    suspend fun importDatabaseFromJson(jsonString: String, overwriteExisting: Boolean): com.example.macscrm.data.backup.BackupResult {
        return backupManager.restoreFromJson(jsonString, overwriteExisting)
    }

    // Reset Database
    suspend fun resetDatabaseToSeed() {
        hospitalDao.deleteAll()
        departmentDao.deleteAll()
        doctorDao.deleteAll()
        meetingDao.deleteAll()
        taskDao.deleteAll()
        userDao.deleteAll()
        
        AppDatabase.populateDatabase(database)
    }
}
