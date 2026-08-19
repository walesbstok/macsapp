package com.example.macscrm.data.local

import android.content.Context
import androidx.room.*
import androidx.sqlite.db.SupportSQLiteDatabase
import com.example.macscrm.data.local.dao.*
import com.example.macscrm.data.local.entity.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Database(
    entities = [
        HospitalEntity::class,
        DepartmentEntity::class,
        DoctorEntity::class,
        MeetingEntity::class,
        TaskEntity::class,
        TripEntity::class,
        TripDayEntity::class,
        VisitEntity::class,
        UserEntity::class,
        SettingsEntity::class
    ],
    version = 7,
    exportSchema = false
)
@TypeConverters(Converters::class)
abstract class AppDatabase : RoomDatabase() {

    abstract fun hospitalDao(): HospitalDao
    abstract fun departmentDao(): DepartmentDao
    abstract fun doctorDao(): DoctorDao
    abstract fun meetingDao(): MeetingDao
    abstract fun taskDao(): TaskDao
    abstract fun tripDao(): TripDao
    abstract fun userDao(): UserDao
    abstract fun settingsDao(): SettingsDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context, scope: CoroutineScope = CoroutineScope(Dispatchers.IO)): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "macs_crm_database"
                )
                    .fallbackToDestructiveMigration()
                    .addCallback(DatabaseCallback(context.applicationContext, scope))
                    .build()
                INSTANCE = instance
                instance
            }
        }

        private class DatabaseCallback(
            private val context: Context,
            private val scope: CoroutineScope
        ) : RoomDatabase.Callback() {
            override fun onCreate(db: SupportSQLiteDatabase) {
                super.onCreate(db)
                INSTANCE?.let { database ->
                    scope.launch(Dispatchers.IO) {
                        populateDatabase(database, context)
                    }
                }
            }

            override fun onOpen(db: SupportSQLiteDatabase) {
                super.onOpen(db)
                INSTANCE?.let { database ->
                    scope.launch(Dispatchers.IO) {
                        val currentDocs = database.doctorDao().getAllSnapshot()
                        if (currentDocs.isEmpty()) {
                            populateDatabase(database, context)
                        }
                    }
                }
            }
        }

        suspend fun populateDatabase(database: AppDatabase, context: Context? = null) {
            database.hospitalDao().insertAll(SeedDataProvider.getInitialHospitals())
            database.departmentDao().insertAll(SeedDataProvider.getInitialDepartments())
            database.doctorDao().insertAll(SeedDataProvider.getInitialDoctors())
            database.userDao().insertAll(SeedDataProvider.getDefaultUsers())
            database.settingsDao().saveSettings(SeedDataProvider.getDefaultSettings())
        }

        suspend fun clearAllCrmData(database: AppDatabase) {
            database.hospitalDao().deleteAll()
            database.departmentDao().deleteAll()
            database.doctorDao().deleteAll()
            database.meetingDao().deleteAll()
            database.taskDao().deleteAll()
        }
    }
}
