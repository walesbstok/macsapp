package com.example.macscrm.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.example.macscrm.data.model.*
import com.example.macscrm.ui.components.*
import com.example.macscrm.ui.theme.*
import com.example.macscrm.ui.viewmodel.CrmViewModel

@Composable
fun DashboardScreen(
    viewModel: CrmViewModel,
    onNavigate: (String, String?) -> Unit
) {
    val hospitals by viewModel.hospitals.collectAsState()
    val departments by viewModel.departments.collectAsState()
    val doctors by viewModel.doctors.collectAsState()
    val meetings by viewModel.meetings.collectAsState()
    val tasks by viewModel.tasks.collectAsState()
    val currentRole by viewModel.currentRole.collectAsState()

    val pendingTasks = tasks.filter { !it.isDone }
    val scheduledMeetings = meetings.filter { !it.isClosed }
    val closedMeetings = meetings.filter { it.isClosed }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .testTag("dashboard_screen"),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Welcome Banner
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = OceanBlueDark),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text(
                        text = "Witaj w Mac's CRM",
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "System zarządzania relacjami medycznymi, szpitalami i raportami wizyt.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = Color.White.copy(alpha = 0.85f)
                    )
                }
            }
        }

        // Stats Grid
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                StatCard(
                    title = "Szpitale",
                    value = "${hospitals.size}",
                    subtitle = "${hospitals.count { it.pipelineStatus == PipelineStatus.KEY_ACCOUNT }} Key Accounts",
                    icon = Icons.Default.LocalHospital,
                    iconColor = OceanBlue,
                    iconBgColor = OceanBlueLight,
                    modifier = Modifier.weight(1f),
                    onClick = { onNavigate("contacts", null) }
                )
                StatCard(
                    title = "Lekarze",
                    value = "${doctors.size}",
                    subtitle = "${departments.size} oddziałów",
                    icon = Icons.Default.Person,
                    iconColor = MedicalTeal,
                    iconBgColor = MedicalTealLight,
                    modifier = Modifier.weight(1f),
                    onClick = { onNavigate("contacts", null) }
                )
            }
        }

        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                StatCard(
                    title = "Wizyty / Raporty",
                    value = "${meetings.size}",
                    subtitle = "${closedMeetings.size} zrealizowanych",
                    icon = Icons.Default.EventNote,
                    iconColor = StatusSuccess,
                    iconBgColor = StatusSuccessBg,
                    modifier = Modifier.weight(1f),
                    onClick = { onNavigate("meetings", null) }
                )
                StatCard(
                    title = "Otwarte zadania",
                    value = "${pendingTasks.size}",
                    subtitle = "${tasks.count { it.isDone }} ukończonych",
                    icon = Icons.Default.CheckCircle,
                    iconColor = StatusWarning,
                    iconBgColor = StatusWarningBg,
                    modifier = Modifier.weight(1f),
                    onClick = { onNavigate("tasks", null) }
                )
            }
        }

        // Quick Actions
        item {
            SectionHeader(title = "Szybkie akcje")
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Button(
                    onClick = { onNavigate("meetings", null) },
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = OceanBlue),
                    modifier = Modifier
                        .weight(1f)
                        .testTag("quick_action_new_meeting")
                ) {
                    Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Nowa Wizyta", maxLines = 1)
                }
                Button(
                    onClick = { onNavigate("trips", null) },
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = MedicalTeal),
                    modifier = Modifier
                        .weight(1f)
                        .testTag("quick_action_plan_trip")
                ) {
                    Icon(Icons.Default.Route, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Planer Tras", maxLines = 1)
                }
            }
        }

        // Upcoming Visits Section
        item {
            SectionHeader(
                title = "Nadchodzące i otwarte wizyty",
                count = scheduledMeetings.size,
                actionText = "Zobacz wszystkie",
                onActionClick = { onNavigate("meetings", null) }
            )
        }

        if (scheduledMeetings.isEmpty()) {
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = "Brak zaplanowanych spotkań. Dodaj nową wizytę powyżej!",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(16.dp)
                    )
                }
            }
        } else {
            items(scheduledMeetings.take(4)) { meeting ->
                val hospital = hospitals.find { it.id == meeting.hospitalId }
                val doctor = doctors.find { it.id == meeting.doctorId }
                val status = viewModel.calculateMeetingStatus(meeting)

                Card(
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    shape = RoundedCornerShape(12.dp),
                    elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { onNavigate("meeting_detail", meeting.id) }
                        .testTag("dashboard_meeting_item_${meeting.id}")
                ) {
                    Row(
                        modifier = Modifier
                            .padding(14.dp)
                            .fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(40.dp)
                                .clip(CircleShape)
                                .background(OceanBlueLight),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.Event,
                                contentDescription = null,
                                tint = OceanBlueDark,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = meeting.title,
                                    style = MaterialTheme.typography.titleMedium,
                                    fontWeight = FontWeight.SemiBold,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis,
                                    modifier = Modifier.weight(1f)
                                )
                                MeetingStatusBadge(status = status)
                            }
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = hospital?.name ?: "Szpital",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                            if (doctor != null) {
                                Text(
                                    text = "Lekarz: ${doctor.fullName} (${doctor.specialization})",
                                    style = MaterialTheme.typography.labelSmall,
                                    color = MedicalTeal
                                )
                            }
                            if (meeting.productTags.isNotEmpty()) {
                                Spacer(modifier = Modifier.height(6.dp))
                                Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                    meeting.productTags.take(3).forEach { tag ->
                                        ProductTagChip(tag = tag)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // Pending Tasks Section
        item {
            SectionHeader(
                title = "Zadania i Follow-up",
                count = pendingTasks.size,
                actionText = "Wszystkie zadania",
                onActionClick = { onNavigate("tasks", null) }
            )
        }

        if (pendingTasks.isEmpty()) {
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = "Wszystkie zadania zrealizowane! Brak zaległości.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = StatusSuccess,
                        modifier = Modifier.padding(16.dp)
                    )
                }
            }
        } else {
            items(pendingTasks.take(4)) { task ->
                val hosp = hospitals.find { it.id == task.hospitalId }
                Card(
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("dashboard_task_item_${task.id}")
                ) {
                    Row(
                        modifier = Modifier
                            .padding(12.dp)
                            .fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        IconButton(
                            onClick = { viewModel.toggleTaskDone(task) },
                            modifier = Modifier.size(36.dp)
                        ) {
                            Icon(
                                imageVector = if (task.isDone) Icons.Default.CheckCircle else Icons.Default.RadioButtonUnchecked,
                                contentDescription = "Toggle task",
                                tint = if (task.isDone) StatusSuccess else MaterialTheme.colorScheme.outline
                            )
                        }
                        Spacer(modifier = Modifier.width(8.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = task.description,
                                style = MaterialTheme.typography.bodyMedium,
                                fontWeight = FontWeight.Medium
                            )
                            if (hosp != null || !task.dueDate.isNullOrBlank()) {
                                Row(
                                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    if (hosp != null) {
                                        Text(
                                            text = hosp.city,
                                            style = MaterialTheme.typography.labelSmall,
                                            color = MaterialTheme.colorScheme.onSurfaceVariant
                                        )
                                    }
                                    if (!task.dueDate.isNullOrBlank()) {
                                        Text(
                                            text = "Termin: ${task.dueDate}",
                                            style = MaterialTheme.typography.labelSmall,
                                            color = StatusWarning,
                                            fontWeight = FontWeight.SemiBold
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        item {
            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}
