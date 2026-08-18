package com.example.macscrm.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.example.macscrm.data.model.*

@Entity(tableName = "hospitals")
data class HospitalEntity(
    @PrimaryKey val id: String,
    val name: String,
    val address: String,
    val city: String,
    val voivodeship: String,
    val phone: String,
    val email: String,
    val website: String,
    val pipelineStatus: String,
    val lat: Double?,
    val lng: Double?,
    val notes: String,
    val segment: String,
    val createdAt: String,
    val updatedAt: String,
    val postalCode: String,
val importanceScore: Int,
) {
    fun toDomain(): Hospital = Hospital(
        id = id,
        name = name,
        address = address,
        city = city,
        voivodeship = voivodeship,
        phone = phone,
        email = email,
        website = website,
        pipelineStatus = PipelineStatus.fromString(pipelineStatus),
        lat = lat,
        lng = lng,
        notes = notes,
        segment = segment,
        createdAt = createdAt,
        updatedAt = updatedAt
    )

    companion object {
    fun fromDomain(h: Hospital): HospitalEntity = HospitalEntity(
        id = h.id,
        name = h.name,
        address = h.address,
        city = h.city,
        voivodeship = h.voivodeship,
        phone = h.phone,
        email = h.email,
        website = h.website,
        pipelineStatus = h.pipelineStatus.name,
        lat = h.lat,
        lng = h.lng,
        notes = h.notes,
        segment = h.segment,
        createdAt = h.createdAt,
        updatedAt = h.updatedAt,
        postalCode = h.postalCode,
        importanceScore = h.importanceScore  // ADD THIS LINE
    )
}
}

@Entity(tableName = "departments")
data class DepartmentEntity(
    @PrimaryKey val id: String,
    val hospitalId: String,
    val name: String,
    val type: String,
    val createdAt: String
) {
    fun toDomain(): Department = Department(
        id = id,
        hospitalId = hospitalId,
        name = name,
        type = DepartmentType.fromString(type),
        createdAt = createdAt
    )

    companion object {
        fun fromDomain(d: Department): DepartmentEntity = DepartmentEntity(
            id = d.id,
            hospitalId = d.hospitalId,
            name = d.name,
            type = d.type.name,
            createdAt = d.createdAt
        )
    }
}

@Entity(tableName = "doctors")
data class DoctorEntity(
    @PrimaryKey val id: String,
    val firstName: String,
    val lastName: String,
    val title: String,
    val hospitalId: String,
    val departmentId: String,
    val phone: String,
    val email: String,
    val specialization: String,
    val notes: String,
    val createdAt: String,
    val updatedAt: String
) {
    fun toDomain(): Doctor = Doctor(
        id = id,
        firstName = firstName,
        lastName = lastName,
        title = title,
        hospitalId = hospitalId,
        departmentId = departmentId,
        phone = phone,
        email = email,
        specialization = specialization,
        notes = notes,
        createdAt = createdAt,
        updatedAt = updatedAt
    )

    companion object {
        fun fromDomain(doc: Doctor): DoctorEntity = DoctorEntity(
            id = doc.id,
            firstName = doc.firstName,
            lastName = doc.lastName,
            title = doc.title,
            hospitalId = doc.hospitalId,
            departmentId = doc.departmentId,
            phone = doc.phone,
            email = doc.email,
            specialization = doc.specialization,
            notes = doc.notes,
            createdAt = doc.createdAt,
            updatedAt = doc.updatedAt
        )
    }
}

@Entity(tableName = "meetings")
data class MeetingEntity(
    @PrimaryKey val id: String,
    val title: String,
    val meetingDate: String,
    val hospitalId: String,
    val departmentId: String?,
    val doctorId: String?,
    val doctorIds: List<String>,
    val productTags: List<String>,
    val contentMarkdown: String,
    val meetingType: String,
    val closedAt: String?,
    val createdAt: String,
    val updatedAt: String,
    val approvalStatus: String,
    val managerComment: String,
    val representativeName: String
) {
    fun toDomain(): Meeting = Meeting(
        id = id,
        title = title,
        meetingDate = meetingDate,
        hospitalId = hospitalId,
        departmentId = departmentId,
        doctorId = doctorId,
        doctorIds = doctorIds,
        productTags = productTags,
        contentMarkdown = contentMarkdown,
        meetingType = MeetingType.fromString(meetingType),
        closedAt = closedAt,
        createdAt = createdAt,
        updatedAt = updatedAt,
        approvalStatus = ApprovalStatus.fromString(approvalStatus),
        managerComment = managerComment,
        representativeName = representativeName
    )

    companion object {
        fun fromDomain(m: Meeting): MeetingEntity = MeetingEntity(
            id = m.id,
            title = m.title,
            meetingDate = m.meetingDate,
            hospitalId = m.hospitalId,
            departmentId = m.departmentId,
            doctorId = m.doctorId,
            doctorIds = m.doctorIds,
            productTags = m.productTags,
            contentMarkdown = m.contentMarkdown,
            meetingType = m.meetingType.name,
            closedAt = m.closedAt,
            createdAt = m.createdAt,
            updatedAt = m.updatedAt,
            approvalStatus = m.approvalStatus.name,
            managerComment = m.managerComment,
            representativeName = m.representativeName
        )
    }
}

@Entity(tableName = "tasks")
data class TaskEntity(
    @PrimaryKey val id: String,
    val meetingId: String,
    val hospitalId: String,
    val departmentId: String,
    val doctorId: String,
    val description: String,
    val dueDate: String?,
    val isDone: Boolean,
    val createdAt: String
) {
    fun toDomain(): Task = Task(
        id = id,
        meetingId = meetingId,
        hospitalId = hospitalId,
        departmentId = departmentId,
        doctorId = doctorId,
        description = description,
        dueDate = dueDate,
        isDone = isDone,
        createdAt = createdAt
    )

    companion object {
        fun fromDomain(t: Task): TaskEntity = TaskEntity(
            id = t.id,
            meetingId = t.meetingId,
            hospitalId = t.hospitalId,
            departmentId = t.departmentId,
            doctorId = t.doctorId,
            description = t.description,
            dueDate = t.dueDate,
            isDone = t.isDone,
            createdAt = t.createdAt
        )
    }
}

@Entity(tableName = "trips")
data class TripEntity(
    @PrimaryKey val id: String,
    val startDate: String,
    val endDate: String,
    val status: String,
    val title: String,
    val createdAt: String
) {
    fun toDomain(): Trip = Trip(
        id = id,
        startDate = startDate,
        endDate = endDate,
        status = status,
        title = title,
        createdAt = createdAt
    )

    companion object {
        fun fromDomain(t: Trip): TripEntity = TripEntity(
            id = t.id,
            startDate = t.startDate,
            endDate = t.endDate,
            status = t.status,
            title = t.title,
            createdAt = t.createdAt
        )
    }
}

@Entity(tableName = "trip_days")
data class TripDayEntity(
    @PrimaryKey val id: String,
    val tripId: String,
    val date: String,
    val overnightLocation: String?,
    val overnightSundayLocation: String?,
    val orderIndex: Int
) {
    fun toDomain(): TripDay = TripDay(
        id = id,
        tripId = tripId,
        date = date,
        overnightLocation = overnightLocation,
        overnightSundayLocation = overnightSundayLocation,
        order = orderIndex
    )

    companion object {
        fun fromDomain(td: TripDay): TripDayEntity = TripDayEntity(
            id = td.id,
            tripId = td.tripId,
            date = td.date,
            overnightLocation = td.overnightLocation,
            overnightSundayLocation = td.overnightSundayLocation,
            orderIndex = td.order
        )
    }
}

@Entity(tableName = "visits")
data class VisitEntity(
    @PrimaryKey val id: String,
    val tripDayId: String,
    val hospitalId: String,
    val departmentId: String,
    val doctorId: String?,
    val isFixedSlot: Boolean,
    val timeSlot: String
) {
    fun toDomain(): Visit = Visit(
        id = id,
        tripDayId = tripDayId,
        hospitalId = hospitalId,
        departmentId = departmentId,
        doctorId = doctorId,
        isFixedSlot = isFixedSlot,
        timeSlot = timeSlot
    )

    companion object {
        fun fromDomain(v: Visit): VisitEntity = VisitEntity(
            id = v.id,
            tripDayId = v.tripDayId,
            hospitalId = v.hospitalId,
            departmentId = v.departmentId,
            doctorId = v.doctorId,
            isFixedSlot = v.isFixedSlot,
            timeSlot = v.timeSlot
        )
    }
}

@Entity(tableName = "users")
data class UserEntity(
    @PrimaryKey val id: String,
    val name: String,
    val email: String,
    val role: String,
    val isActive: Boolean,
    val createdAt: String,
    val password: String,
    val mustChangePassword: Boolean
) {
    fun toDomain(): CrmUser = CrmUser(
        id = id,
        name = name,
        email = email,
        role = UserRole.fromString(role) ?: UserRole.SALES_REP,
        isActive = isActive,
        createdAt = createdAt,
        password = password,
        mustChangePassword = mustChangePassword
    )

    companion object {
        fun fromDomain(u: CrmUser): UserEntity = UserEntity(
            id = u.id,
            name = u.name,
            email = u.email,
            role = u.role.name,
            isActive = u.isActive,
            createdAt = u.createdAt,
            password = u.password,
            mustChangePassword = u.mustChangePassword
        )
    }
}

@Entity(tableName = "settings")
data class SettingsEntity(
    @PrimaryKey val id: String = "system_settings",
    val brandName: String,
    val enableMeetingApprovals: Boolean,
    val defaultMapLat: Double,
    val defaultMapLng: Double,
    val productsList: List<String>
) {
    fun toDomain(): SystemSettings = SystemSettings(
        brandName = brandName,
        enableMeetingApprovals = enableMeetingApprovals,
        defaultMapLat = defaultMapLat,
        defaultMapLng = defaultMapLng,
        productsList = productsList
    )

    companion object {
        fun fromDomain(s: SystemSettings): SettingsEntity = SettingsEntity(
            id = "system_settings",
            brandName = s.brandName,
            enableMeetingApprovals = s.enableMeetingApprovals,
            defaultMapLat = s.defaultMapLat,
            defaultMapLng = s.defaultMapLng,
            productsList = s.productsList
        )
    }
}
