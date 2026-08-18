package com.example.macscrm.data.local.dao

import androidx.room.*
import com.example.macscrm.data.local.entity.*
import kotlinx.coroutines.flow.Flow

@Dao
interface HospitalDao {
    @Query("SELECT * FROM hospitals ORDER BY name ASC")
    fun getAll(): Flow<List<HospitalEntity>>

    @Query("SELECT * FROM hospitals")
    suspend fun getAllSnapshot(): List<HospitalEntity>

    @Query("SELECT * FROM hospitals WHERE id = :id")
    suspend fun getById(id: String): HospitalEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(hospital: HospitalEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(hospitals: List<HospitalEntity>)

    @Delete
    suspend fun delete(hospital: HospitalEntity)

    @Query("DELETE FROM hospitals WHERE id = :id")
    suspend fun deleteById(id: String)

    @Query("DELETE FROM hospitals")
    suspend fun deleteAll()
}

@Dao
interface DepartmentDao {
    @Query("SELECT * FROM departments ORDER BY name ASC")
    fun getAll(): Flow<List<DepartmentEntity>>

    @Query("SELECT * FROM departments")
    suspend fun getAllSnapshot(): List<DepartmentEntity>

    @Query("SELECT * FROM departments WHERE hospitalId = :hospitalId")
    fun getByHospitalId(hospitalId: String): Flow<List<DepartmentEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(department: DepartmentEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(departments: List<DepartmentEntity>)

    @Delete
    suspend fun delete(department: DepartmentEntity)

    @Query("DELETE FROM departments WHERE id = :id")
    suspend fun deleteById(id: String)

    @Query("DELETE FROM departments")
    suspend fun deleteAll()
}

@Dao
interface DoctorDao {
    @Query("SELECT * FROM doctors ORDER BY lastName ASC, firstName ASC")
    fun getAll(): Flow<List<DoctorEntity>>

    @Query("SELECT * FROM doctors")
    suspend fun getAllSnapshot(): List<DoctorEntity>

    @Query("SELECT * FROM doctors WHERE hospitalId = :hospitalId")
    fun getByHospitalId(hospitalId: String): Flow<List<DoctorEntity>>

    @Query("SELECT * FROM doctors WHERE id = :id")
    suspend fun getById(id: String): DoctorEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(doctor: DoctorEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(doctors: List<DoctorEntity>)

    @Delete
    suspend fun delete(doctor: DoctorEntity)

    @Query("DELETE FROM doctors WHERE id = :id")
    suspend fun deleteById(id: String)

    @Query("DELETE FROM doctors")
    suspend fun deleteAll()
}

@Dao
interface MeetingDao {
    @Query("SELECT * FROM meetings ORDER BY meetingDate DESC")
    fun getAll(): Flow<List<MeetingEntity>>

    @Query("SELECT * FROM meetings")
    suspend fun getAllSnapshot(): List<MeetingEntity>

    @Query("SELECT * FROM meetings WHERE id = :id")
    suspend fun getById(id: String): MeetingEntity?

    @Query("SELECT * FROM meetings WHERE hospitalId = :hospitalId")
    fun getByHospitalId(hospitalId: String): Flow<List<MeetingEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(meeting: MeetingEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(meetings: List<MeetingEntity>)

    @Delete
    suspend fun delete(meeting: MeetingEntity)

    @Query("DELETE FROM meetings WHERE id = :id")
    suspend fun deleteById(id: String)

    @Query("DELETE FROM meetings")
    suspend fun deleteAll()
}

@Dao
interface TaskDao {
    @Query("SELECT * FROM tasks ORDER BY dueDate ASC, createdAt DESC")
    fun getAll(): Flow<List<TaskEntity>>

    @Query("SELECT * FROM tasks")
    suspend fun getAllSnapshot(): List<TaskEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(task: TaskEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(tasks: List<TaskEntity>)

    @Delete
    suspend fun delete(task: TaskEntity)

    @Query("DELETE FROM tasks WHERE id = :id")
    suspend fun deleteById(id: String)

    @Query("DELETE FROM tasks")
    suspend fun deleteAll()
}

@Dao
interface TripDao {
    @Query("SELECT * FROM trips ORDER BY startDate DESC")
    fun getAllTrips(): Flow<List<TripEntity>>

    @Query("SELECT * FROM trips")
    suspend fun getAllTripsSnapshot(): List<TripEntity>

    @Query("SELECT * FROM trip_days WHERE tripId = :tripId ORDER BY orderIndex ASC")
    fun getDaysForTrip(tripId: String): Flow<List<TripDayEntity>>

    @Query("SELECT * FROM trip_days")
    suspend fun getAllTripDaysSnapshot(): List<TripDayEntity>

    @Query("SELECT * FROM visits WHERE tripDayId = :dayId")
    fun getVisitsForDay(dayId: String): Flow<List<VisitEntity>>

    @Query("SELECT * FROM visits")
    suspend fun getAllVisitsSnapshot(): List<VisitEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertTrip(trip: TripEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertTrips(trips: List<TripEntity>)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertTripDays(days: List<TripDayEntity>)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertVisits(visits: List<VisitEntity>)

    @Query("DELETE FROM trips WHERE id = :id")
    suspend fun deleteTripById(id: String)

    @Query("DELETE FROM trip_days WHERE tripId = :tripId")
    suspend fun deleteTripDays(tripId: String)

    @Query("DELETE FROM visits WHERE tripDayId = :dayId")
    suspend fun deleteVisits(dayId: String)

    @Query("DELETE FROM trips")
    suspend fun deleteAllTrips()

    @Query("DELETE FROM trip_days")
    suspend fun deleteAllTripDays()

    @Query("DELETE FROM visits")
    suspend fun deleteAllVisits()
}

@Dao
interface UserDao {
    @Query("SELECT * FROM users ORDER BY name ASC")
    fun getAll(): Flow<List<UserEntity>>

    @Query("SELECT * FROM users")
    suspend fun getAllSnapshot(): List<UserEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(user: UserEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(users: List<UserEntity>)

    @Query("DELETE FROM users WHERE id = :id")
    suspend fun deleteById(id: String)

    @Query("DELETE FROM users")
    suspend fun deleteAll()
}

@Dao
interface SettingsDao {
    @Query("SELECT * FROM settings WHERE id = 'system_settings' LIMIT 1")
    fun getSettings(): Flow<SettingsEntity?>

    @Query("SELECT * FROM settings WHERE id = 'system_settings' LIMIT 1")
    suspend fun getSettingsSnapshot(): SettingsEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun saveSettings(settings: SettingsEntity)
}
