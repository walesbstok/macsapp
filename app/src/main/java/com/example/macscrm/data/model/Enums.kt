package com.example.macscrm.data.model

enum class PipelineStatus(val label: String, val colorHex: Long) {
    PROSPECT("Prospect", 0xFF64748B),
    ACTIVE("Active", 0xFF0284C7),
    KEY_ACCOUNT("Key Account", 0xFF0D9488),
    INACTIVE("Inactive", 0xFF94A3B8);

    companion object {
        fun fromString(value: String?): PipelineStatus {
            return when (value?.lowercase()) {
                "active" -> ACTIVE
                "key_account", "key account" -> KEY_ACCOUNT
                "inactive" -> INACTIVE
                else -> PROSPECT
            }
        }
    }
}

enum class DepartmentType(val label: String) {
    ZABIEGOWY("Zabiegowy"),
    ZACHOWAWCZY("Zachowawczy"),
    DIAGNOSTYCZNY("Diagnostyczny"),
    STANDARD("Standardowy"),
    STERYLIZATORNIA("Sterylizatornia"),
    BLOK_OPERACYJNY("Blok Operacyjny");

    companion object {
        fun fromString(value: String?): DepartmentType {
            return when (value?.lowercase()) {
                "zabiegowy" -> ZABIEGOWY
                "zachowawczy" -> ZACHOWAWCZY
                "diagnostyczny" -> DIAGNOSTYCZNY
                "sterylizatornia" -> STERYLIZATORNIA
                "blok_operacyjny", "blok operacyjny" -> BLOK_OPERACYJNY
                else -> STANDARD
            }
        }
    }
}

enum class UserRole(val label: String) {
    ADMIN("Administrator"),
    MANAGER("Manager"),
    SALES_REP("Sales Representative");

    companion object {
        fun fromString(value: String?): UserRole {
            return when (value?.lowercase()?.trim()) {
                "admin", "administrator" -> ADMIN
                "manager" -> MANAGER
                else -> SALES_REP
            }
        }
    }
}

enum class MeetingType(val label: String) {
    REGULAR("Wizyta standardowa"),
    PRESENTATION("Prezentacja / Warsztat"),
    OPERATING_DAY("Dzień operacyjny"),
    PHONE_CALL("Rozmowa telefoniczna");

    companion object {
        fun fromString(value: String?): MeetingType {
            return when (value?.uppercase()?.replace(" ", "_")) {
                "PRESENTATION" -> PRESENTATION
                "OPERATING_DAY", "OPERATING DAY" -> OPERATING_DAY
                "PHONE_CALL", "PHONE CALL" -> PHONE_CALL
                else -> REGULAR
            }
        }
    }
}

enum class MeetingStatus(val label: String, val colorHex: Long) {
    SCHEDULED("Zaplanowane", 0xFF0284C7),
    TO_CLOSE("Do zamknięcia (<24h)", 0xFFEAB308),
    OVERDUE("Przeterminowane (>24h)", 0xFFEF4444),
    CLOSED("Zrealizowane", 0xFF10B981)
}

enum class ApprovalStatus(val label: String) {
    PENDING("Do akceptacji"),
    APPROVED("Zaakceptowane"),
    REJECTED("Odrzucone");

    companion object {
        fun fromString(value: String?): ApprovalStatus {
            return when (value?.lowercase()?.trim()) {
                "approved", "accepted" -> APPROVED
                "rejected" -> REJECTED
                else -> PENDING
            }
        }
    }
}

enum class QuickAddTarget {
    MEETING,
    DOCTOR,
    HOSPITAL,
    DEPARTMENT,
    TASK
}
