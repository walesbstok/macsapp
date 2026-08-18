package com.example.macscrm.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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
fun ManagerScreen(
    viewModel: CrmViewModel,
    onNavigateToMeeting: (String) -> Unit
) {
    val meetings by viewModel.meetings.collectAsState()
    val hospitals by viewModel.hospitals.collectAsState()
    val doctors by viewModel.doctors.collectAsState()
    val users by viewModel.users.collectAsState()
    val systemSettings by viewModel.systemSettings.collectAsState()

    val pendingApprovals = meetings.filter { it.approvalStatus == ApprovalStatus.PENDING }
    val approvedCount = meetings.count { it.approvalStatus == ApprovalStatus.APPROVED }
    val closedCount = meetings.count { it.isClosed }

    var selectedMeetingForReview by remember { mutableStateOf<Meeting?>(null) }
    var reviewComment by remember { mutableStateOf("") }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .testTag("manager_screen"),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Manager Header
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = OceanBlueDark),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.SupervisorAccount, contentDescription = null, tint = Color.White, modifier = Modifier.size(28.dp))
                        Spacer(modifier = Modifier.width(10.dp))
                        Text(
                            text = "Panel Managera Sprzedaży",
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Nadzór nad realizacją wizyt handlowych, weryfikacja raportów i wskaźniki KPI.",
                        style = MaterialTheme.typography.bodySmall,
                        color = Color.White.copy(alpha = 0.85f)
                    )
                }
            }
        }

        // KPI Summary Cards
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                StatCard(
                    title = "Oczekujące na ocenę",
                    value = "${pendingApprovals.size}",
                    subtitle = "Wymaga akceptacji",
                    icon = Icons.Default.PendingActions,
                    iconColor = StatusWarning,
                    iconBgColor = StatusWarningBg,
                    modifier = Modifier.weight(1f)
                )
                StatCard(
                    title = "Zatwierdzone raporty",
                    value = "$approvedCount",
                    subtitle = "${meetings.size} łącznie",
                    icon = Icons.Default.CheckCircle,
                    iconColor = StatusSuccess,
                    iconBgColor = StatusSuccessBg,
                    modifier = Modifier.weight(1f)
                )
            }
        }

        // Product Coverage Distribution
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                shape = RoundedCornerShape(16.dp),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "Ekspozycja marek medycznych w wizytach",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(12.dp))

                    val topProducts = listOf("SCANLAN", "ALLIUM", "BIOSIS", "ORASCOPTIC", "NEOS SternFix")
                    topProducts.forEach { product ->
                        val count = meetings.count { it.productTags.contains(product) }
                        val pct = if (meetings.isNotEmpty()) (count.toFloat() / meetings.size.toFloat()) else 0f
                        Column(modifier = Modifier.padding(vertical = 4.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(text = product, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold)
                                Text(text = "$count wizyt (${(pct * 100).toInt()}%)", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            }
                            Spacer(modifier = Modifier.height(4.dp))
                            LinearProgressIndicator(
                                progress = { pct },
                                modifier = Modifier.fillMaxWidth().height(8.dp).clip(RoundedCornerShape(4.dp)),
                                color = OceanBlue,
                                trackColor = OceanBlueLight
                            )
                        }
                    }
                }
            }
        }

        // Pending Reports for Review
        item {
            SectionHeader(
                title = "Raporty oczekujące na akceptację",
                count = pendingApprovals.size
            )
        }

        if (pendingApprovals.isEmpty()) {
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = "Brak oczekujących raportów. Wszystkie wizyty zostały zweryfikowane.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = StatusSuccess,
                        modifier = Modifier.padding(16.dp)
                    )
                }
            }
        } else {
            items(pendingApprovals) { meeting ->
                val hospital = hospitals.find { it.id == meeting.hospitalId }
                val doc = doctors.find { it.id == meeting.doctorId }

                Card(
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    shape = RoundedCornerShape(14.dp),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { selectedMeetingForReview = meeting }
                        .testTag("manager_pending_meeting_${meeting.id}")
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = meeting.title,
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.weight(1f)
                            )
                            ApprovalBadge(status = meeting.approvalStatus)
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "${hospital?.name ?: ""} • Przedstawiciel: ${meeting.representativeName}",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        if (doc != null) {
                            Text(
                                text = "Lekarz: ${doc.fullName} (${doc.specialization})",
                                style = MaterialTheme.typography.labelSmall,
                                color = MedicalTeal
                            )
                        }
                        if (meeting.contentMarkdown.isNotBlank()) {
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(
                                text = meeting.contentMarkdown,
                                style = MaterialTheme.typography.bodySmall,
                                maxLines = 2,
                                overflow = TextOverflow.Ellipsis
                            )
                        }
                        Spacer(modifier = Modifier.height(10.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Button(
                                onClick = {
                                    viewModel.updateMeetingApproval(meeting, ApprovalStatus.APPROVED, "Zatwierdzono przez managera.")
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = StatusSuccess),
                                shape = RoundedCornerShape(8.dp),
                                modifier = Modifier.weight(1f)
                            ) {
                                Icon(Icons.Default.ThumbUp, contentDescription = null, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("Zatwierdź")
                            }
                            OutlinedButton(
                                onClick = {
                                    selectedMeetingForReview = meeting
                                },
                                shape = RoundedCornerShape(8.dp),
                                modifier = Modifier.weight(1f)
                            ) {
                                Text("Komentarz")
                            }
                        }
                    }
                }
            }
        }

        item { Spacer(modifier = Modifier.height(80.dp)) }
    }

    // Review Dialog
    if (selectedMeetingForReview != null) {
        val meeting = selectedMeetingForReview!!
        AlertDialog(
            onDismissRequest = { selectedMeetingForReview = null },
            title = { Text("Weryfikacja raportu: ${meeting.title}") },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text(
                        text = "Treść raportu: ${meeting.contentMarkdown.ifBlank { "Brak" }}",
                        style = MaterialTheme.typography.bodySmall
                    )
                    OutlinedTextField(
                        value = reviewComment,
                        onValueChange = { reviewComment = it },
                        label = { Text("Komentarz zwrotny dla przedstawiciela") },
                        modifier = Modifier.fillMaxWidth(),
                        minLines = 2
                    )
                }
            },
            confirmButton = {
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Button(
                        onClick = {
                            viewModel.updateMeetingApproval(meeting, ApprovalStatus.APPROVED, reviewComment.trim())
                            selectedMeetingForReview = null
                            reviewComment = ""
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = StatusSuccess)
                    ) {
                        Text("Zatwierdź")
                    }
                    Button(
                        onClick = {
                            viewModel.updateMeetingApproval(meeting, ApprovalStatus.REJECTED, reviewComment.trim())
                            selectedMeetingForReview = null
                            reviewComment = ""
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = StatusDanger)
                    ) {
                        Text("Odrzuć")
                    }
                }
            },
            dismissButton = {
                TextButton(onClick = { selectedMeetingForReview = null }) {
                    Text("Anuluj")
                }
            }
        )
    }
}
