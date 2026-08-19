package com.example.macscrm.data.local

import android.content.Context
import android.util.Log
import com.example.macscrm.data.local.entity.*
import java.io.BufferedReader
import java.io.InputStream
import java.io.InputStreamReader

data class CrmSeedDataBundle(
    val hospitals: List<HospitalEntity>,
    val departments: List<DepartmentEntity>,
    val doctors: List<DoctorEntity>,
    val meetings: List<MeetingEntity>,
    val tasks: List<TaskEntity>
)

object CsvDataParser {
    private const val TAG = "CsvDataParser"

    fun parseFromAssets(context: Context, assetFileName: String = "initial_crm_data.csv"): CrmSeedDataBundle {
        return try {
            val inputStream = context.assets.open(assetFileName)
            parseInputStream(inputStream)
        } catch (e: Exception) {
            Log.e(TAG, "Error reading $assetFileName from assets", e)
            CrmSeedDataBundle(emptyList(), emptyList(), emptyList(), emptyList(), emptyList())
        }
    }

    fun parseInputStream(inputStream: InputStream): CrmSeedDataBundle {
        val reader = BufferedReader(InputStreamReader(inputStream, Charsets.UTF_8))
        val lines = reader.readLines()
        return parseLines(lines)
    }

    fun parseCsvString(csvText: String): CrmSeedDataBundle {
        val lines = csvText.lines()
        return parseLines(lines)
    }

    fun parseLines(lines: List<String>): CrmSeedDataBundle {
        val hospitals = mutableListOf<HospitalEntity>()
        val departments = mutableListOf<DepartmentEntity>()
        val doctors = mutableListOf<DoctorEntity>()
        val meetings = mutableListOf<MeetingEntity>()
        val tasks = mutableListOf<TaskEntity>()

        val hospitalNameToId = mutableMapOf<String, String>()
        val deptNameToId = mutableMapOf<String, String>()

        for (rawLine in lines) {
            val line = rawLine.trim()
            if (line.isEmpty() || line.startsWith("TYP_REKORDU") || line.startsWith("#")) {
                continue
            }

            // Split by ';' handling optional quotes
            val cols = parseSemicolonLine(line)
            if (cols.size < 4) continue

            val recordType = cols.getOrNull(0)?.trim()?.uppercase() ?: ""
            val id = cols.getOrNull(1)?.trim() ?: ""
            val nameOrTitle = cols.getOrNull(2)?.trim() ?: ""
            val facility = cols.getOrNull(3)?.trim() ?: ""
            val city = cols.getOrNull(4)?.trim() ?: ""
            val voivodeship = cols.getOrNull(5)?.trim() ?: ""
            val deptName = cols.getOrNull(6)?.trim() ?: ""
            val doctorName = cols.getOrNull(7)?.trim() ?: ""
            val specOrType = cols.getOrNull(8)?.trim() ?: ""
            val phone = cols.getOrNull(9)?.trim() ?: ""
            val email = cols.getOrNull(10)?.trim() ?: ""
            val statusOrStage = cols.getOrNull(11)?.trim() ?: ""
            val dateOrTerm = cols.getOrNull(12)?.trim() ?: ""
            val productTagsStr = cols.getOrNull(13)?.trim() ?: ""
            val noteContent = cols.getOrNull(14)?.trim() ?: ""
            val managerComment = cols.getOrNull(15)?.trim() ?: ""
            val repAuthor = cols.getOrNull(16)?.trim() ?: "Adam Przedstawiciel"

            when (recordType) {
                "SZPITAL", "HOSPITAL" -> {
                    val cleanId = if (id.isNotEmpty()) id else "hosp_${hospitals.size + 1}"
                    hospitalNameToId[facility] = cleanId
                    hospitalNameToId[nameOrTitle] = cleanId

                    hospitals.add(
                        HospitalEntity(
                            id = cleanId,
                            name = nameOrTitle.ifEmpty { facility },
                            address = if (city.isNotEmpty()) "ul. Szpitalna 1, $city" else "ul. Szpitalna 1",
                            city = city.ifEmpty { "Polska" },
                            voivodeship = voivodeship.ifEmpty { "Mazowieckie" },
                            phone = phone.ifEmpty { "+48 22 000 00 00" },
                            email = email.ifEmpty { "sekretariat@szpital.pl" },
                            website = "https://www.szpital.pl",
                            pipelineStatus = mapPipelineStatus(statusOrStage),
                            lat = null,
                            lng = null,
                            notes = noteContent,
                            segment = if (specOrType.isNotEmpty()) specOrType else "Segment B",
                            createdAt = dateOrTerm.ifEmpty { "2026-06-01T08:00:00Z" },
                            updatedAt = dateOrTerm.ifEmpty { "2026-06-01T08:00:00Z" },
                            postalCode = "00-001",
                            importanceScore = if (specOrType.contains("A")) 90 else if (specOrType.contains("B")) 70 else 50
                        )
                    )
                }

                "ODDZIAL", "ODDZIAŁ", "DEPARTMENT" -> {
                    val cleanId = if (id.isNotEmpty()) id else "dept_${departments.size + 1}"
                    val hospId = hospitalNameToId[facility] ?: hospitalNameToId.entries.firstOrNull { facility.contains(it.key) || it.key.contains(facility) }?.value ?: "hosp_1"
                    deptNameToId[nameOrTitle] = cleanId
                    deptNameToId[deptName] = cleanId

                    departments.add(
                        DepartmentEntity(
                            id = cleanId,
                            hospitalId = hospId,
                            name = nameOrTitle.ifEmpty { deptName.ifEmpty { "Oddział Ogólny" } },
                            type = specOrType.ifEmpty { "Chirurgia ogólna" },
                            createdAt = dateOrTerm.ifEmpty { "2026-06-01T08:00:00Z" }
                        )
                    )
                }

                "LEKARZ", "DOCTOR" -> {
                    val cleanId = if (id.isNotEmpty()) id else "doc_${doctors.size + 1}"
                    val hospId = hospitalNameToId[facility] ?: hospitalNameToId.entries.firstOrNull { facility.contains(it.key) || it.key.contains(facility) }?.value ?: "hosp_1"
                    val dId = deptNameToId[deptName] ?: deptNameToId.entries.firstOrNull { deptName.contains(it.key) || it.key.contains(deptName) }?.value ?: "dept_1"

                    val fullName = doctorName.ifEmpty { nameOrTitle }
                    val parts = fullName.split(" ").filter { it.isNotBlank() }
                    val (title, firstName, lastName) = when {
                        parts.size >= 4 -> Triple(parts.take(2).joinToString(" "), parts[2], parts.drop(3).joinToString(" "))
                        parts.size == 3 -> Triple(parts[0], parts[1], parts[2])
                        parts.size == 2 -> Triple("lek. med.", parts[0], parts[1])
                        parts.size == 1 -> Triple("lek. med.", parts[0], "")
                        else -> Triple("lek. med.", "Lekarz", "")
                    }

                    doctors.add(
                        DoctorEntity(
                            id = cleanId,
                            firstName = firstName,
                            lastName = lastName,
                            title = title,
                            hospitalId = hospId,
                            departmentId = dId,
                            phone = phone.ifEmpty { "+48 500 123 456" },
                            email = email.ifEmpty { "lekarz@szpital.pl" },
                            specialization = specOrType.ifEmpty { "Chirurgia" },
                            notes = listOfNotNull(
                                noteContent.takeIf { it.isNotEmpty() },
                                managerComment.takeIf { it.isNotEmpty() }?.let { "Manager: $it" },
                                productTagsStr.takeIf { it.isNotEmpty() }?.let { "Produkty: $it" }
                            ).joinToString(" | "),
                            createdAt = dateOrTerm.ifEmpty { "2026-06-01T08:00:00Z" },
                            updatedAt = dateOrTerm.ifEmpty { "2026-06-01T08:00:00Z" }
                        )
                    )
                }

                "SPOTKANIE", "WIZYTA", "MEETING" -> {
                    val cleanId = if (id.isNotEmpty()) id else "meet_${meetings.size + 1}"
                    val hospId = hospitalNameToId[facility] ?: hospitalNameToId.entries.firstOrNull { facility.contains(it.key) || it.key.contains(facility) }?.value ?: "hosp_1"
                    val dId = deptNameToId[deptName] ?: deptNameToId.entries.firstOrNull { deptName.contains(it.key) || it.key.contains(deptName) }?.value

                    val tags = if (productTagsStr.isNotEmpty()) {
                        productTagsStr.split(",").map { it.trim() }.filter { it.isNotEmpty() }
                    } else {
                        emptyList()
                    }

                    meetings.add(
                        MeetingEntity(
                            id = cleanId,
                            title = nameOrTitle.ifEmpty { noteContent.take(50).ifEmpty { "Spotkanie handlowe" } },
                            meetingDate = dateOrTerm.ifEmpty { "2026-08-15T10:00:00Z" },
                            hospitalId = hospId,
                            departmentId = dId,
                            doctorId = null,
                            doctorIds = emptyList(),
                            productTags = tags,
                            contentMarkdown = noteContent.ifEmpty { "Notatka ze spotkania z personelem medycznym." },
                            meetingType = "IN_PERSON",
                            closedAt = if (statusOrStage.equals("completed", ignoreCase = true)) dateOrTerm else null,
                            createdAt = dateOrTerm.ifEmpty { "2026-08-15T10:00:00Z" },
                            updatedAt = dateOrTerm.ifEmpty { "2026-08-15T10:00:00Z" },
                            approvalStatus = "APPROVED",
                            managerComment = managerComment,
                            representativeName = repAuthor
                        )
                    )
                }

                "ZADANIE", "TASK" -> {
                    val cleanId = if (id.isNotEmpty()) id else "task_${tasks.size + 1}"
                    val hospId = hospitalNameToId[facility] ?: hospitalNameToId.entries.firstOrNull { facility.contains(it.key) || it.key.contains(facility) }?.value ?: "hosp_1"
                    val dId = deptNameToId[deptName] ?: deptNameToId.entries.firstOrNull { deptName.contains(it.key) || it.key.contains(deptName) }?.value ?: ""

                    tasks.add(
                        TaskEntity(
                            id = cleanId,
                            meetingId = "",
                            hospitalId = hospId,
                            departmentId = dId,
                            doctorId = "",
                            description = nameOrTitle.ifEmpty { noteContent.ifEmpty { "Zadanie handlowe" } },
                            dueDate = if (dateOrTerm.contains("T")) dateOrTerm.substringBefore("T") else dateOrTerm.ifEmpty { "2026-08-30" },
                            isDone = statusOrStage.equals("completed", ignoreCase = true) || statusOrStage.equals("done", ignoreCase = true),
                            createdAt = "2026-08-01T08:00:00Z"
                        )
                    )
                }
            }
        }

        return CrmSeedDataBundle(
            hospitals = hospitals,
            departments = departments,
            doctors = doctors,
            meetings = meetings,
            tasks = tasks
        )
    }

    private fun mapPipelineStatus(status: String): String {
        return when (status.lowercase().trim()) {
            "key_account" -> "KEY_ACCOUNT"
            "active" -> "ACTIVE"
            "prospect" -> "PROSPECT"
            "inactive" -> "INACTIVE"
            "lead" -> "LEAD"
            else -> "ACTIVE"
        }
    }

    private fun parseSemicolonLine(line: String): List<String> {
        val result = mutableListOf<String>()
        val sb = java.lang.StringBuilder()
        var inQuotes = false

        for (i in 0 until line.length) {
            val c = line[i]
            if (c == '"') {
                inQuotes = !inQuotes
            } else if (c == ';' && !inQuotes) {
                result.add(sb.toString().trim())
                sb.setLength(0)
            } else {
                sb.append(c)
            }
        }
        result.add(sb.toString().trim())
        return result
    }
}
