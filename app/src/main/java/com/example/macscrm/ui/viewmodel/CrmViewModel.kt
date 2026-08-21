package com.example.macscrm.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.macscrm.data.local.AppDatabase
import com.example.macscrm.data.model.*
import com.example.macscrm.data.repository.CrmRepository
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

class CrmViewModel(application: Application) : AndroidViewModel(application) {

    private val repository: CrmRepository
    
    init {
        val database = AppDatabase.getDatabase(application, viewModelScope)
        repository = CrmRepository(database)
    }

    // Active User and Role State
    private val _currentUser = MutableStateFlow<CrmUser?>(
        CrmUser(
            id = "usr_lukasz_w",
            name = "Łukasz W.",
            email = "lukasz.w@macsmedical.eu",
            role = UserRole.ADMIN,
            isActive = true
        )
    )
    val currentUser: StateFlow<CrmUser?> = _currentUser.asStateFlow()

    private val _currentRole = MutableStateFlow<UserRole>(UserRole.ADMIN)
    val currentRole: StateFlow<UserRole> = _currentRole.asStateFlow()

    // Current Screen
    private val _currentScreen = MutableStateFlow("dashboard")
    val currentScreen: StateFlow<String> = _currentScreen.asStateFlow()

    // Selected Meeting for Detail View
    private val _selectedMeetingId = MutableStateFlow<String?>(null)
    val selectedMeetingId: StateFlow<String?> = _selectedMeetingId.asStateFlow()

    // Quick Add Action Trigger
    private val _quickAddTrigger = MutableStateFlow<QuickAddTarget?>(null)
    val quickAddTrigger: StateFlow<QuickAddTarget?> = _quickAddTrigger.asStateFlow()

    fun triggerQuickAdd(target: QuickAddTarget) {
        _quickAddTrigger.value = target
        when (target) {
            QuickAddTarget.MEETING -> _currentScreen.value = "meetings"
            QuickAddTarget.DOCTOR -> _currentScreen.value = "contacts"
            QuickAddTarget.HOSPITAL -> _currentScreen.value = "contacts"
            QuickAddTarget.DEPARTMENT -> _currentScreen.value = "contacts"
            QuickAddTarget.TASK -> _currentScreen.value = "tasks"
        }
    }

    fun clearQuickAddTrigger() {
        _quickAddTrigger.value = null
    }

    // Data streams from repository
    val hospitals: StateFlow<List<Hospital>> = repository.allHospitals
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val departments: StateFlow<List<Department>> = repository.allDepartments
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val doctors: StateFlow<List<Doctor>> = repository.allDoctors
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val meetings: StateFlow<List<Meeting>> = repository.allMeetings
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val tasks: StateFlow<List<Task>> = repository.allTasks
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val trips: StateFlow<List<Trip>> = repository.allTrips
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val users: StateFlow<List<CrmUser>> = repository.allUsers
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val systemSettings: StateFlow<SystemSettings> = repository.systemSettings
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), SystemSettings())

    // Navigation helper
    fun navigateTo(screen: String, meetingId: String? = null) {
        _currentScreen.value = screen
        if (meetingId != null) {
            _selectedMeetingId.value = meetingId
        }
    }

    // Authentication & Role
    fun setCurrentUser(user: CrmUser) {
        _currentUser.value = user
        _currentRole.value = user.role
    }

    fun setRole(role: UserRole) {
        _currentRole.value = role
    }

    fun logout() {
        _currentUser.value = null
        _currentScreen.value = "login"
    }

    // CRUD: Hospitals
    fun saveHospital(hospital: Hospital) {
        viewModelScope.launch {
            val updated = if (hospital.id.isBlank()) {
                hospital.copy(
                    id = "hosp_${System.currentTimeMillis()}",
                    createdAt = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.getDefault()).format(Date()),
                    updatedAt = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.getDefault()).format(Date())
                )
            } else {
                hospital.copy(
                    updatedAt = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.getDefault()).format(Date())
                )
            }
            repository.saveHospital(updated)
        }
    }

    fun deleteHospital(id: String) {
        viewModelScope.launch {
            repository.deleteHospital(id)
        }
    }

    // CRUD: Departments
    fun saveDepartment(department: Department) {
        viewModelScope.launch {
            val updated = if (department.id.isBlank()) {
                department.copy(
                    id = "dept_${System.currentTimeMillis()}",
                    createdAt = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.getDefault()).format(Date())
                )
            } else {
                department
            }
            repository.saveDepartment(updated)
        }
    }

    fun deleteDepartment(id: String) {
        viewModelScope.launch {
            repository.deleteDepartment(id)
        }
    }

    // CRUD: Doctors
    fun saveDoctor(doctor: Doctor) {
        viewModelScope.launch {
            val updated = if (doctor.id.isBlank()) {
                doctor.copy(
                    id = "doc_${System.currentTimeMillis()}",
                    createdAt = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.getDefault()).format(Date()),
                    updatedAt = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.getDefault()).format(Date())
                )
            } else {
                doctor.copy(
                    updatedAt = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.getDefault()).format(Date())
                )
            }
            repository.saveDoctor(updated)
        }
    }

    fun deleteDoctor(id: String) {
        viewModelScope.launch {
            repository.deleteDoctor(id)
        }
    }

    // CRUD: Meetings
    fun saveMeeting(meeting: Meeting) {
        viewModelScope.launch {
            val nowStr = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.getDefault()).format(Date())
            val repName = _currentUser.value?.name ?: "Łukasz W."
            val updated = if (meeting.id.isBlank()) {
                meeting.copy(
                    id = "meet_${System.currentTimeMillis()}",
                    createdAt = nowStr,
                    updatedAt = nowStr,
                    representativeName = repName
                )
            } else {
                meeting.copy(updatedAt = nowStr)
            }
            repository.saveMeeting(updated)
        }
    }

    fun closeMeeting(meeting: Meeting) {
        viewModelScope.launch {
            val nowStr = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.getDefault()).format(Date())
            val updated = meeting.copy(
                closedAt = nowStr,
                updatedAt = nowStr
            )
            repository.saveMeeting(updated)
        }
    }

    fun updateMeetingApproval(meeting: Meeting, status: ApprovalStatus, managerComment: String) {
        viewModelScope.launch {
            val nowStr = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.getDefault()).format(Date())
            val updated = meeting.copy(
                approvalStatus = status,
                managerComment = managerComment,
                updatedAt = nowStr
            )
            repository.saveMeeting(updated)
        }
    }

    fun deleteMeeting(id: String) {
        viewModelScope.launch {
            repository.deleteMeeting(id)
        }
    }

    // CRUD: Tasks
    fun saveTask(task: Task) {
        viewModelScope.launch {
            val nowStr = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.getDefault()).format(Date())
            val updated = if (task.id.isBlank()) {
                task.copy(
                    id = "task_${System.currentTimeMillis()}",
                    createdAt = nowStr
                )
            } else {
                task
            }
            repository.saveTask(updated)
        }
    }

    fun toggleTaskDone(task: Task) {
        viewModelScope.launch {
            repository.saveTask(task.copy(isDone = !task.isDone))
        }
    }

    fun deleteTask(id: String) {
        viewModelScope.launch {
            repository.deleteTask(id)
        }
    }

    // CRUD: Trips
    fun saveTrip(trip: Trip, days: List<TripDay>, visits: List<Visit>) {
        viewModelScope.launch {
            repository.saveTrip(trip, days, visits)
        }
    }

    fun deleteTrip(tripId: String) {
        viewModelScope.launch {
            repository.deleteTrip(tripId)
        }
    }

    // Settings & Users
    fun saveSettings(settings: SystemSettings) {
        viewModelScope.launch {
            repository.saveSettings(settings)
        }
    }

    fun addProductTag(product: String) {
        viewModelScope.launch {
            val current = systemSettings.value
            if (!current.productsList.contains(product.trim())) {
                repository.saveSettings(current.copy(productsList = current.productsList + product.trim()))
            }
        }
    }

    fun removeProductTag(product: String) {
        viewModelScope.launch {
            val current = systemSettings.value
            repository.saveSettings(current.copy(productsList = current.productsList.filter { it != product }))
        }
    }

    fun saveUser(user: CrmUser) {
        viewModelScope.launch {
            val updated = if (user.id.isBlank()) {
                user.copy(
                    id = "usr_${System.currentTimeMillis()}",
                    createdAt = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.getDefault()).format(Date())
                )
            } else {
                user
            }
            repository.saveUser(updated)
        }
    }

    fun deleteUser(id: String) {
        viewModelScope.launch {
            repository.deleteUser(id)
        }
    }

    fun resetDatabase() {
        viewModelScope.launch {
            repository.resetDatabaseToSeed()
        }
    }

    // Export & Import Database
    fun exportDatabaseJson(onComplete: (String) -> Unit) {
        viewModelScope.launch {
            val json = repository.exportDatabaseToJson()
            onComplete(json)
        }
    }

    fun exportDatabaseCsv(onComplete: (String) -> Unit) {
        viewModelScope.launch {
            val csv = repository.exportDatabaseToCsv()
            onComplete(csv)
        }
    }

    fun importDatabaseJson(jsonString: String, overwrite: Boolean, onResult: (com.example.macscrm.data.backup.BackupResult) -> Unit) {
        viewModelScope.launch {
            val result = repository.importDatabaseFromJson(jsonString, overwrite)
            onResult(result)
        }
    }

    // Status helper for meetings
    fun calculateMeetingStatus(meeting: Meeting): MeetingStatus {
        if (!meeting.closedAt.isNullOrBlank()) {
            return MeetingStatus.CLOSED
        }
        return try {
            val format = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
            val date = format.parse(meeting.meetingDate.substring(0, 10))
            val now = Date()
            if (date != null && date.after(now)) {
                MeetingStatus.SCHEDULED
            } else {
                MeetingStatus.TO_CLOSE
            }
        } catch (e: Exception) {
            MeetingStatus.SCHEDULED
        }
    }
}
