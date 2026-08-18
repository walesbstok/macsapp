package com.example.macscrm

import com.example.macscrm.data.local.SeedDataProvider
import com.example.macscrm.data.model.ApprovalStatus
import com.example.macscrm.data.model.PipelineStatus
import com.example.macscrm.data.model.UserRole
import org.junit.Assert.*
import org.junit.Test

class CrmModelTest {

    @Test
    fun testSeedDataHospitals() {
        val hospitals = SeedDataProvider.getInitialHospitals()
        assertTrue("Hospitals list should not be empty", hospitals.isNotEmpty())
        val keyAccount = hospitals.find { it.pipelineStatus == "KEY_ACCOUNT" }
        assertNotNull("Should contain key account hospitals", keyAccount)
    }

    @Test
    fun testSeedDataDoctors() {
        val doctors = SeedDataProvider.getInitialDoctors()
        assertTrue("Doctors list should not be empty", doctors.isNotEmpty())
        assertEquals("dr n. med. Adam Kałużny", doctors.first().toDomain().fullName)
    }

    @Test
    fun testEnumParsing() {
        assertEquals(PipelineStatus.KEY_ACCOUNT, PipelineStatus.fromString("KEY_ACCOUNT"))
        assertEquals(ApprovalStatus.APPROVED, ApprovalStatus.fromString("APPROVED"))
        assertEquals(UserRole.MANAGER, UserRole.fromString("MANAGER"))
    }

    @Test
    fun testBackupModelCounts() {
        val hospitals = SeedDataProvider.getInitialHospitals()
        val doctors = SeedDataProvider.getInitialDoctors()
        val meetings = SeedDataProvider.getInitialMeetings()
        val tasks = SeedDataProvider.getInitialTasks()

        assertTrue(hospitals.size >= 3)
        assertTrue(doctors.size >= 4)
        assertTrue(meetings.size >= 4)
        assertTrue(tasks.size >= 3)
    }
}
