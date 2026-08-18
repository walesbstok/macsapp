package com.example.macscrm.ui.screens

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.background
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
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.macscrm.data.model.*
import com.example.macscrm.ui.components.*
import com.example.macscrm.ui.theme.*
import com.example.macscrm.ui.viewmodel.CrmViewModel
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MeetingDetailScreen(
    meetingId: String,
    viewModel: CrmViewModel,
    onBack: () -> Unit
) {
    val context = LocalContext.current
    val meetings by viewModel.meetings.collectAsState()
    val hospitals by viewModel.hospitals.collectAsState()
    val departments by viewModel.departments.collectAsState()
    val doctors by viewModel.doctors.collectAsState()
    val tasks by viewModel.tasks.collectAsState()
    val currentRole by viewModel.currentRole.collectAsState()

    val meeting = meetings.find { it.id == meetingId }

    if (meeting == null) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text("Nie znaleziono spotkania.", style = MaterialTheme.typography.bodyLarge)
                Spacer(modifier = Modifier.height(8.dp))
                Button(onClick = onBack) { Text("Wróć") }
            }
        }
        return
    }

    val hospital = hospitals.find { it.id == meeting.hospitalId }
    val department = departments.find { it.id == meeting.departmentId }
    val doctor = doctors.find { it.id == meeting.doctorId }
    val meetingTasks = tasks.filter { it.meetingId == meeting.id }
    val status = viewModel.calculateMeetingStatus(meeting)

    var showFollowUpDialog by remember { mutableStateOf(false) }
    var newTaskDesc by remember { mutableStateOf("") }
    var newTaskDueDate by remember {
        mutableStateOf(SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date(System.currentTimeMillis() + 7 * 24 * 3600 * 1000L)))
    }

    var managerCommentInput by remember { mutableStateOf(meeting.managerComment) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Szczegóły Wizyty", style = MaterialTheme.typography.titleLarge) },
                navigationIcon = {
                    IconButton(onClick = onBack, modifier = Modifier.testTag("meeting_detail_back_button")) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Wróć")
                    }
                },
                actions = {
                    if (!meeting.isClosed) {
                        Button(
                            onClick = { viewModel.closeMeeting(meeting) },
                            colors = ButtonDefaults.buttonColors(containerColor = StatusSuccess),
                            shape = RoundedCornerShape(8.dp),
                            modifier = Modifier.padding(end = 8.dp).testTag("close_meeting_button")
                        ) {
                            Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("Zamknij wizytę")
                        }
                    }
                }
            )
        }
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp)
                .testTag("meeting_detail_screen"),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Header Card
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    shape = RoundedCornerShape(16.dp),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = meeting.meetingType.label,
                                style = MaterialTheme.typography.labelSmall,
                                color = OceanBlue,
                                fontWeight = FontWeight.Bold
                            )
                            MeetingStatusBadge(status = status)
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = meeting.title,
                            style = MaterialTheme.typography.headlineSmall,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Termin: ${meeting.meetingDate.take(16).replace("T", " ")}",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        if (meeting.closedAt != null) {
                            Text(
                                text = "Zamknięto: ${meeting.closedAt.take(16).replace("T", " ")}",
                                style = MaterialTheme.typography.labelSmall,
                                color = StatusSuccess,
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                    }
                }
            }

            // Hospital & Contact Section
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    shape = RoundedCornerShape(16.dp),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = "Lokalizacja i Kontakt",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(10.dp))

                        if (hospital != null) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.LocalHospital, contentDescription = null, tint = OceanBlue)
                                Spacer(modifier = Modifier.width(8.dp))
                                Column {
                                    Text(text = hospital.name, fontWeight = FontWeight.SemiBold, style = MaterialTheme.typography.bodyMedium)
                                    Text(text = "${hospital.city}, ${hospital.address}", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                }
                            }
                        }

                        if (doctor != null) {
                            Spacer(modifier = Modifier.height(10.dp))
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(Icons.Default.Person, contentDescription = null, tint = MedicalTeal)
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Column {
                                        Text(text = doctor.fullName, fontWeight = FontWeight.SemiBold, style = MaterialTheme.typography.bodyMedium)
                                        Text(text = doctor.specialization, style = MaterialTheme.typography.labelSmall, color = MedicalTeal)
                                    }
                                }
                                if (doctor.phone.isNotBlank()) {
                                    IconButton(onClick = {
                                        val intent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:${doctor.phone}"))
                                        context.startActivity(intent)
                                    }) {
                                        Icon(Icons.Default.Phone, contentDescription = "Zadzwoń", tint = OceanBlue)
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // Products Discussed
            if (meeting.productTags.isNotEmpty()) {
                item {
                    Card(
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        shape = RoundedCornerShape(16.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text(
                                text = "Omawiane produkty",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            FlowRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                meeting.productTags.forEach { tag ->
                                    ProductTagChip(tag = tag)
                                }
                            }
                        }
                    }
                }
            }

            // Meeting Content & Notes
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = "Notatki i Przebieg Wizyty",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = meeting.contentMarkdown.ifBlank { "Brak szczegółowych notatek." },
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                    }
                }
            }

            // Follow-Up Tasks
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "Zadania z tej wizyty",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold
                            )
                            TextButton(
                                onClick = { showFollowUpDialog = true },
                                modifier = Modifier.testTag("add_followup_task_button")
                            ) {
                                Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("Dodaj zadanie")
                            }
                        }

                        if (meetingTasks.isEmpty()) {
                            Text(
                                text = "Brak przypisanych zadań.",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        } else {
                            meetingTasks.forEach { task ->
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(vertical = 4.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    IconButton(
                                        onClick = { viewModel.toggleTaskDone(task) },
                                        modifier = Modifier.size(32.dp)
                                    ) {
                                        Icon(
                                            imageVector = if (task.isDone) Icons.Default.CheckCircle else Icons.Default.RadioButtonUnchecked,
                                            contentDescription = null,
                                            tint = if (task.isDone) StatusSuccess else MaterialTheme.colorScheme.outline
                                        )
                                    }
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(text = task.description, style = MaterialTheme.typography.bodyMedium)
                                        if (!task.dueDate.isNullOrBlank()) {
                                            Text(text = "Termin: ${task.dueDate}", style = MaterialTheme.typography.labelSmall, color = StatusWarning)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // Manager Review & Feedback
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "Ocena i Akceptacja Managera",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold
                            )
                            ApprovalBadge(status = meeting.approvalStatus)
                        }

                        if (meeting.managerComment.isNotBlank()) {
                            Spacer(modifier = Modifier.height(8.dp))
                            Surface(
                                color = OceanBlueLight,
                                shape = RoundedCornerShape(8.dp),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Column(modifier = Modifier.padding(10.dp)) {
                                    Text(
                                        text = "Komentarz Managera:",
                                        style = MaterialTheme.typography.labelSmall,
                                        fontWeight = FontWeight.Bold,
                                        color = OceanBlueDark
                                    )
                                    Text(
                                        text = meeting.managerComment,
                                        style = MaterialTheme.typography.bodyMedium,
                                        color = SlateTextPrimary
                                    )
                                }
                            }
                        }

                        if (currentRole == UserRole.MANAGER || currentRole == UserRole.ADMIN) {
                            Spacer(modifier = Modifier.height(12.dp))
                            OutlinedTextField(
                                value = managerCommentInput,
                                onValueChange = { managerCommentInput = it },
                                label = { Text("Wpisz feedback / komentarz") },
                                modifier = Modifier.fillMaxWidth(),
                                minLines = 2
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Button(
                                    onClick = {
                                        viewModel.updateMeetingApproval(meeting, ApprovalStatus.APPROVED, managerCommentInput.trim())
                                    },
                                    colors = ButtonDefaults.buttonColors(containerColor = StatusSuccess),
                                    shape = RoundedCornerShape(8.dp),
                                    modifier = Modifier.weight(1f)
                                ) {
                                    Icon(Icons.Default.ThumbUp, contentDescription = null, modifier = Modifier.size(16.dp))
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text("Zatwierdź")
                                }
                                Button(
                                    onClick = {
                                        viewModel.updateMeetingApproval(meeting, ApprovalStatus.REJECTED, managerCommentInput.trim())
                                    },
                                    colors = ButtonDefaults.buttonColors(containerColor = StatusDanger),
                                    shape = RoundedCornerShape(8.dp),
                                    modifier = Modifier.weight(1f)
                                ) {
                                    Icon(Icons.Default.ThumbDown, contentDescription = null, modifier = Modifier.size(16.dp))
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text("Odrzuć")
                                }
                            }
                        }
                    }
                }
            }

            item {
                Spacer(modifier = Modifier.height(40.dp))
            }
        }
    }

    // Follow-up Task Dialog
    if (showFollowUpDialog) {
        AlertDialog(
            onDismissRequest = { showFollowUpDialog = false },
            title = { Text("Dodaj zadanie Follow-up") },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    OutlinedTextField(
                        value = newTaskDesc,
                        onValueChange = { newTaskDesc = it },
                        label = { Text("Treść zadania *") },
                        modifier = Modifier.fillMaxWidth(),
                        minLines = 2
                    )
                    OutlinedTextField(
                        value = newTaskDueDate,
                        onValueChange = { newTaskDueDate = it },
                        label = { Text("Termin (YYYY-MM-DD)") },
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (newTaskDesc.isNotBlank()) {
                            viewModel.saveTask(
                                Task(
                                    id = "",
                                    meetingId = meeting.id,
                                    hospitalId = meeting.hospitalId,
                                    departmentId = meeting.departmentId ?: "",
                                    doctorId = meeting.doctorId ?: "",
                                    description = newTaskDesc.trim(),
                                    dueDate = newTaskDueDate.trim(),
                                    isDone = false
                                )
                            )
                            newTaskDesc = ""
                            showFollowUpDialog = false
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = OceanBlue)
                ) {
                    Text("Dodaj")
                }
            },
            dismissButton = {
                TextButton(onClick = { showFollowUpDialog = false }) {
                    Text("Anuluj")
                }
            }
        )
    }
}
