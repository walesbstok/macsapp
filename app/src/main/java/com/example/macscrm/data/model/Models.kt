package com.example.macscrm.data.model

data class Hospital(
    val id: String,
    val name: String,
    val address: String,
    val city: String,
    val voivodeship: String = "",
    val phone: String = "",
    val email: String = "",
    val website: String = "",
    val pipelineStatus: PipelineStatus = PipelineStatus.PROSPECT,
    val lat: Double? = null,
    val lng: Double? = null,
    val notes: String = "",
    val segment: String = "B",
    val postalCode: String = "",
    val importanceScore: Int = 3,
    val createdAt: String = "",
    val updatedAt: String = ""
)

data class Department(
    val id: String,
    val hospitalId: String,
    val name: String,
    val type: DepartmentType = DepartmentType.STANDARD,
    val createdAt: String = ""
)

data class Doctor(
    val id: String,
    val firstName: String,
    val lastName: String,
    val title: String = "lek.",
    val hospitalId: String,
    val departmentId: String,
    val phone: String = "",
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
