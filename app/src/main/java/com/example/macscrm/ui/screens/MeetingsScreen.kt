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
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MeetingsScreen(
    viewModel: CrmViewModel,
    onNavigateToDetail: (String) -> Unit
) {
    var activeTab by remember { mutableStateOf(0) } // 0: Zaplanowane, 1: Zrealizowane / Historia
    var searchQuery by remember { mutableStateOf("") }
    var selectedProductFilter by remember { mutableStateOf<String?>(null) }

    val meetings by viewModel.meetings.collectAsState()
    val hospitals by viewModel.hospitals.collectAsState()
    val departments by viewModel.departments.collectAsState()
    val doctors by viewModel.doctors.collectAsState()
    val systemSettings by viewModel.systemSettings.collectAsState()

    var showAddMeetingDialog by remember { mutableStateOf(false) }
    var editingMeeting by remember { mutableStateOf<Meeting?>(null) }
    var meetingToDelete by remember { mutableStateOf<Meeting?>(null) }

    val plannedMeetings = meetings.filter { !it.isClosed }
    val pastMeetings = meetings.filter { it.isClosed }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = {
                    editingMeeting = null
                    showAddMeetingDialog = true
                },
                containerColor = OceanBlue,
                contentColor = Color.White,
                modifier = Modifier.testTag("meetings_fab_add")
            ) {
                Icon(Icons.Default.Add, contentDescription = "Nowa Wizyta")
            }
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .testTag("meetings_screen")
        ) {
            // Tabs
            TabRow(
                selectedTabIndex = activeTab,
                containerColor = MaterialTheme.colorScheme.surface,
                contentColor = OceanBlue
            ) {
                Tab(
                    selected = activeTab == 0,
                    onClick = { activeTab = 0 },
                    text = { Text("Zaplanowane (${plannedMeetings.size})", fontWeight = FontWeight.Bold) },
                    modifier = Modifier.testTag("tab_planned_meetings")
                )
                Tab(
                    selected = activeTab == 1,
                    onClick = { activeTab = 1 },
                    text = { Text("Zrealizowane (${pastMeetings.size})", fontWeight = FontWeight.Bold) },
                    modifier = Modifier.testTag("tab_past_meetings")
                )
            }

            // Search Bar
            Box(modifier = Modifier.padding(16.dp)) {
                SearchBar(
                    query = searchQuery,
                    onQueryChange = { searchQuery = it },
                    placeholder = "Szukaj wizyty po tytule, szpitalu, lekarzu..."
                )
            }

            // Product Tag Filter Chips
            LazyRow(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                item {
                    FilterChip(
                        selected = selectedProductFilter == null,
                        onClick = { selectedProductFilter = null },
                        label = { Text("Wszystkie produkty") }
                    )
                }
                items(systemSettings.productsList) { product ->
                    FilterChip(
                        selected = selectedProductFilter == product,
                        onClick = {
                            selectedProductFilter = if (selectedProductFilter == product) null else product
                        },
                        label = { Text(product) }
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Meetings List
            val currentList = if (activeTab == 0) plannedMeetings else pastMeetings
            val filtered = currentList.filter { meet ->
                val hospital = hospitals.find { it.id == meet.hospitalId }
                val doc = doctors.find { it.id == meet.doctorId }
                val matchSearch = searchQuery.isBlank() ||
                        meet.title.contains(searchQuery, ignoreCase = true) ||
                        (hospital?.name?.contains(searchQuery, ignoreCase = true) == true) ||
                        (doc?.fullName?.contains(searchQuery, ignoreCase = true) == true) ||
                        meet.productTags.any { it.contains(searchQuery, ignoreCase = true) }

                val matchProduct = selectedProductFilter == null || meet.productTags.contains(selectedProductFilter)
                matchSearch && matchProduct
            }

            if (filtered.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(32.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = if (activeTab == 0) "Brak zaplanowanych wizyt" else "Brak zrealizowanych wizyt",
                        style = MaterialTheme.typography.bodyLarge,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            } else {
                LazyColumn(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(horizontal = 16.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    items(filtered) { meeting ->
                        val hospital = hospitals.find { it.id == meeting.hospitalId }
                        val doctor = doctors.find { it.id == meeting.doctorId }
                        val status = viewModel.calculateMeetingStatus(meeting)

                        Card(
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                            shape = RoundedCornerShape(14.dp),
                            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable { onNavigateToDetail(meeting.id) }
                                .testTag("meeting_card_${meeting.id}")
                        ) {
                            Column(modifier = Modifier.padding(14.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Row(
                                        modifier = Modifier.weight(1f),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Box(
                                            modifier = Modifier
                                                .size(38.dp)
                                                .clip(CircleShape)
                                                .background(OceanBlueLight),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Icon(
                                                imageVector = when (meeting.meetingType) {
                                                    MeetingType.OPERATING_DAY -> Icons.Default.MedicalServices
                                                    MeetingType.PRESENTATION -> Icons.Default.Slideshow
                                                    MeetingType.PHONE_CALL -> Icons.Default.Phone
                                                    else -> Icons.Default.EventNote
                                                },
                                                contentDescription = null,
                                                tint = OceanBlueDark,
                                                modifier = Modifier.size(20.dp)
                                            )
                                        }
                                        Spacer(modifier = Modifier.width(10.dp))
                                        Column {
                                            Text(
                                                text = meeting.title,
                                                style = MaterialTheme.typography.titleMedium,
                                                fontWeight = FontWeight.Bold,
                                                maxLines = 2,
                                                overflow = TextOverflow.Ellipsis
                                            )
                                            Text(
                                                text = "Data: ${meeting.meetingDate.take(16).replace("T", " ")}",
                                                style = MaterialTheme.typography.labelSmall,
                                                color = MaterialTheme.colorScheme.onSurfaceVariant
                                            )
                                        }
                                    }
                                    MeetingStatusBadge(status = status)
                                }

                                Spacer(modifier = Modifier.height(10.dp))

                                Text(
                                    text = hospital?.name ?: "Szpital",
                                    style = MaterialTheme.typography.bodyMedium,
                                    fontWeight = FontWeight.Medium,
                                    color = MaterialTheme.colorScheme.onSurface
                                )

                                if (doctor != null) {
                                    Text(
                                        text = "Lekarz: ${doctor.fullName} (${doctor.specialization})",
                                        style = MaterialTheme.typography.labelSmall,
                                        color = MedicalTeal
                                    )
                                }

                                if (meeting.productTags.isNotEmpty()) {
                                    Spacer(modifier = Modifier.height(8.dp))
                                    Row(
                                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                                        modifier = Modifier.fillMaxWidth()
                                    ) {
                                        meeting.productTags.take(4).forEach { tag ->
                                            ProductTagChip(tag = tag)
                                        }
                                    }
                                }

                                if (meeting.approvalStatus != ApprovalStatus.PENDING) {
                                    Spacer(modifier = Modifier.height(6.dp))
                                    ApprovalBadge(status = meeting.approvalStatus)
                                }

                                Spacer(modifier = Modifier.height(10.dp))
                                HorizontalDivider(color = SlateBorder)
                                Spacer(modifier = Modifier.height(6.dp))

                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(
                                        text = "Przedstawiciel: ${meeting.representativeName}",
                                        style = MaterialTheme.typography.labelSmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                    Row {
                                        if (!meeting.isClosed) {
                                            IconButton(
                                                onClick = { viewModel.closeMeeting(meeting) },
                                                modifier = Modifier.size(32.dp)
                                            ) {
                                                Icon(Icons.Default.CheckCircleOutline, contentDescription = "Zamknij wizytę", tint = StatusSuccess, modifier = Modifier.size(18.dp))
                                            }
                                        }
                                        IconButton(
                                            onClick = {
                                                editingMeeting = meeting
                                                showAddMeetingDialog = true
                                            },
                                            modifier = Modifier.size(32.dp)
                                        ) {
                                            Icon(Icons.Default.Edit, contentDescription = "Edytuj", tint = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.size(18.dp))
                                        }
                                        IconButton(
                                            onClick = { meetingToDelete = meeting },
                                            modifier = Modifier.size(32.dp)
                                        ) {
                                            Icon(Icons.Default.Delete, contentDescription = "Usuń", tint = StatusDanger, modifier = Modifier.size(18.dp))
                                        }
                                    }
                                }
                            }
                        }
                    }
                    item { Spacer(modifier = Modifier.height(80.dp)) }
                }
            }
        }
    }

    // Add / Edit Meeting Dialog
    if (showAddMeetingDialog) {
        var title by remember { mutableStateOf(editingMeeting?.title ?: "") }
        var meetingDate by remember {
            mutableStateOf(
                editingMeeting?.meetingDate ?: SimpleDateFormat("yyyy-MM-dd'T'10:00", Locale.getDefault()).format(Date())
            )
        }
        var selectedHospId by remember { mutableStateOf(editingMeeting?.hospitalId ?: hospitals.firstOrNull()?.id ?: "") }
        var selectedDeptId by remember { mutableStateOf(editingMeeting?.departmentId ?: "") }
        var selectedDocId by remember { mutableStateOf(editingMeeting?.doctorId ?: "") }
        var meetingType by remember { mutableStateOf(editingMeeting?.meetingType ?: MeetingType.REGULAR) }
        var selectedProducts by remember { mutableStateOf(editingMeeting?.productTags ?: emptyList()) }
        var notes by remember { mutableStateOf(editingMeeting?.contentMarkdown ?: "") }

        val availableDepts = departments.filter { it.hospitalId == selectedHospId }
        val availableDocs = doctors.filter { it.hospitalId == selectedHospId }

        AlertDialog(
            onDismissRequest = { showAddMeetingDialog = false },
            title = { Text(if (editingMeeting == null) "Nowa Wizyta / Raport" else "Edytuj Wizytę") },
            text = {
                LazyColumn(
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                    modifier = Modifier.fillMaxWidth().heightIn(max = 480.dp)
                ) {
                    item {
                        OutlinedTextField(
                            value = title,
                            onValueChange = { title = it },
                            label = { Text("Tytuł spotkania *") },
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                    item {
                        OutlinedTextField(
                            value = meetingDate,
                            onValueChange = { meetingDate = it },
                            label = { Text("Data i godzina (YYYY-MM-DDTHH:mm)") },
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                    item {
                        Text("Wybierz Szpital:", style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Bold)
                        LazyColumn(modifier = Modifier.heightIn(max = 120.dp)) {
                            items(hospitals) { hosp ->
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clickable {
                                            selectedHospId = hosp.id
                                            selectedDeptId = ""
                                            selectedDocId = ""
                                        }
                                        .padding(vertical = 3.dp)
                                ) {
                                    RadioButton(selected = selectedHospId == hosp.id, onClick = { selectedHospId = hosp.id })
                                    Text(hosp.name, style = MaterialTheme.typography.bodySmall, maxLines = 1, overflow = TextOverflow.Ellipsis)
                                }
                            }
                        }
                    }

                    if (availableDocs.isNotEmpty()) {
                        item {
                            Text("Wybierz Lekarza:", style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Bold)
                            LazyColumn(modifier = Modifier.heightIn(max = 100.dp)) {
                                items(availableDocs) { doc ->
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .clickable { selectedDocId = doc.id }
                                            .padding(vertical = 3.dp)
                                    ) {
                                        RadioButton(selected = selectedDocId == doc.id, onClick = { selectedDocId = doc.id })
                                        Text("${doc.fullName} (${doc.specialization})", style = MaterialTheme.typography.bodySmall)
                                    }
                                }
                            }
                        }
                    }

                    item {
                        Text("Produkty medyczne:", style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Bold)
                        FlowRow(
                            horizontalArrangement = Arrangement.spacedBy(6.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            systemSettings.productsList.forEach { tag ->
                                val isSelected = selectedProducts.contains(tag)
                                FilterChip(
                                    selected = isSelected,
                                    onClick = {
                                        selectedProducts = if (isSelected) {
                                            selectedProducts - tag
                                        } else {
                                            selectedProducts + tag
                                        }
                                    },
                                    label = { Text(tag, style = MaterialTheme.typography.labelSmall) }
                                )
                            }
                        }
                    }

                    item {
                        OutlinedTextField(
                            value = notes,
                            onValueChange = { notes = it },
                            label = { Text("Notatki z wizyty / Ustalenia / Next steps") },
                            modifier = Modifier.fillMaxWidth(),
                            minLines = 3
                        )
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (title.isNotBlank() && selectedHospId.isNotBlank()) {
                            viewModel.saveMeeting(
                                Meeting(
                                    id = editingMeeting?.id ?: "",
                                    title = title.trim(),
                                    meetingDate = meetingDate.trim(),
                                    hospitalId = selectedHospId,
                                    departmentId = selectedDeptId.ifBlank { null },
                                    doctorId = selectedDocId.ifBlank { null },
                                    doctorIds = if (selectedDocId.isNotBlank()) listOf(selectedDocId) else emptyList(),
                                    productTags = selectedProducts,
                                    contentMarkdown = notes.trim(),
                                    meetingType = meetingType,
                                    closedAt = editingMeeting?.closedAt
                                )
                            )
                            showAddMeetingDialog = false
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = OceanBlue)
                ) {
                    Text("Zapisz")
                }
            },
            dismissButton = {
                TextButton(onClick = { showAddMeetingDialog = false }) {
                    Text("Anuluj")
                }
            }
        )
    }

    // Delete confirmation
    if (meetingToDelete != null) {
        AlertDialog(
            onDismissRequest = { meetingToDelete = null },
            title = { Text("Usuń wizytę") },
            text = { Text("Czy na pewno chcesz usunąć spotkanie: \"${meetingToDelete?.title}\"?") },
            confirmButton = {
                Button(
                    onClick = {
                        meetingToDelete?.let { viewModel.deleteMeeting(it.id) }
                        meetingToDelete = null
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = StatusDanger)
                ) {
                    Text("Usuń")
                }
            },
            dismissButton = {
                TextButton(onClick = { meetingToDelete = null }) {
                    Text("Anuluj")
                }
            }
        )
    }
}
