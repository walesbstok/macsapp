package com.example.macscrm.ui.screens

import android.content.Intent
import android.net.Uri
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
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.example.macscrm.data.model.*
import com.example.macscrm.ui.components.*
import com.example.macscrm.ui.theme.*
import com.example.macscrm.ui.viewmodel.CrmViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ContactsScreen(
    viewModel: CrmViewModel,
    onNavigateToMeeting: (String) -> Unit
) {
    val context = LocalContext.current
    var selectedTab by remember { mutableStateOf(0) } // 0: Szpitale, 1: Oddziały, 2: Lekarze
    var searchQuery by remember { mutableStateOf("") }
    var selectedPipelineFilter by remember { mutableStateOf<PipelineStatus?>(null) }
    var selectedVoivodeshipFilter by remember { mutableStateOf<String?>(null) }

    val hospitals by viewModel.hospitals.collectAsState()
    val departments by viewModel.departments.collectAsState()
    val doctors by viewModel.doctors.collectAsState()
    val meetings by viewModel.meetings.collectAsState()

    // Dialog States
    var showAddHospitalDialog by remember { mutableStateOf(false) }
    var editingHospital by remember { mutableStateOf<Hospital?>(null) }
    var selectedHospitalDetail by remember { mutableStateOf<Hospital?>(null) }

    var showAddDepartmentDialog by remember { mutableStateOf(false) }
    var editingDepartment by remember { mutableStateOf<Department?>(null) }

    var showAddDoctorDialog by remember { mutableStateOf(false) }
    var editingDoctor by remember { mutableStateOf<Doctor?>(null) }
    var selectedDoctorDetail by remember { mutableStateOf<Doctor?>(null) }

    var itemToDelete by remember { mutableStateOf<Triple<String, String, () -> Unit>?>(null) }

    val quickAddTrigger by viewModel.quickAddTrigger.collectAsState()

    LaunchedEffect(quickAddTrigger) {
        when (quickAddTrigger) {
            QuickAddTarget.HOSPITAL -> {
                selectedTab = 0
                editingHospital = null
                showAddHospitalDialog = true
                viewModel.clearQuickAddTrigger()
            }
            QuickAddTarget.DOCTOR -> {
                selectedTab = 2
                editingDoctor = null
                showAddDoctorDialog = true
                viewModel.clearQuickAddTrigger()
            }
            QuickAddTarget.DEPARTMENT -> {
                selectedTab = 1
                editingDepartment = null
                showAddDepartmentDialog = true
                viewModel.clearQuickAddTrigger()
            }
            else -> {}
        }
    }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = {
                    when (selectedTab) {
                        0 -> { editingHospital = null; showAddHospitalDialog = true }
                        1 -> { editingDepartment = null; showAddDepartmentDialog = true }
                        2 -> { editingDoctor = null; showAddDoctorDialog = true }
                    }
                },
                containerColor = OceanBlue,
                contentColor = Color.White,
                modifier = Modifier.testTag("contacts_fab_add")
            ) {
                Icon(Icons.Default.Add, contentDescription = "Dodaj")
            }
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .testTag("contacts_screen")
        ) {
            // Tabs
            TabRow(
                selectedTabIndex = selectedTab,
                containerColor = MaterialTheme.colorScheme.surface,
                contentColor = OceanBlue
            ) {
                Tab(
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 },
                    text = { Text("Szpitale (${hospitals.size})", fontWeight = FontWeight.Bold) },
                    modifier = Modifier.testTag("tab_hospitals")
                )
                Tab(
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    text = { Text("Oddziały (${departments.size})", fontWeight = FontWeight.Bold) },
                    modifier = Modifier.testTag("tab_departments")
                )
                Tab(
                    selected = selectedTab == 2,
                    onClick = { selectedTab = 2 },
                    text = { Text("Lekarze (${doctors.size})", fontWeight = FontWeight.Bold) },
                    modifier = Modifier.testTag("tab_doctors")
                )
            }

            // Search Bar
            Box(modifier = Modifier.padding(16.dp)) {
                SearchBar(
                    query = searchQuery,
                    onQueryChange = { searchQuery = it },
                    placeholder = when (selectedTab) {
                        0 -> "Szukaj szpitala po nazwie, mieście..."
                        1 -> "Szukaj oddziału..."
                        else -> "Szukaj lekarza po nazwisku, specjalizacji..."
                    }
                )
            }

            // Sub-filters for Hospitals tab
            if (selectedTab == 0) {
                LazyRow(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    item {
                        FilterChip(
                            selected = selectedPipelineFilter == null,
                            onClick = { selectedPipelineFilter = null },
                            label = { Text("Wszystkie") }
                        )
                    }
                    items(PipelineStatus.values()) { status ->
                        FilterChip(
                            selected = selectedPipelineFilter == status,
                            onClick = {
                                selectedPipelineFilter = if (selectedPipelineFilter == status) null else status
                            },
                            label = { Text(status.label) }
                        )
                    }
                }
                Spacer(modifier = Modifier.height(8.dp))
            }

            // Tab Content
            when (selectedTab) {
                0 -> {
                    // HOSPITALS LIST
                    val filtered = hospitals.filter { h ->
                        (searchQuery.isBlank() || h.name.contains(searchQuery, ignoreCase = true) || h.city.contains(searchQuery, ignoreCase = true) || h.voivodeship.contains(searchQuery, ignoreCase = true)) &&
                                (selectedPipelineFilter == null || h.pipelineStatus == selectedPipelineFilter)
                    }

                    LazyColumn(
                        modifier = Modifier.fillMaxSize().padding(horizontal = 16.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        items(filtered) { hospital ->
                            val hospitalDepts = departments.filter { it.hospitalId == hospital.id }
                            val hospitalDocs = doctors.filter { it.hospitalId == hospital.id }

                            Card(
                                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                                shape = RoundedCornerShape(12.dp),
                                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable { selectedHospitalDetail = hospital }
                                    .testTag("hospital_card_${hospital.id}")
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
                                                    .size(36.dp)
                                                    .clip(CircleShape)
                                                    .background(OceanBlueLight),
                                                contentAlignment = Alignment.Center
                                            ) {
                                                Icon(
                                                    Icons.Default.LocalHospital,
                                                    contentDescription = null,
                                                    tint = OceanBlueDark,
                                                    modifier = Modifier.size(18.dp)
                                                )
                                            }
                                            Spacer(modifier = Modifier.width(10.dp))
                                            Column {
                                                Text(
                                                    text = hospital.name,
                                                    style = MaterialTheme.typography.titleMedium,
                                                    fontWeight = FontWeight.Bold,
                                                    maxLines = 2,
                                                    overflow = TextOverflow.Ellipsis
                                                )
                                                Text(
                                                    text = "${hospital.city}, ${hospital.voivodeship}",
                                                    style = MaterialTheme.typography.bodyMedium,
                                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                                )
                                            }
                                        }
                                        PipelineStatusBadge(status = hospital.pipelineStatus)
                                    }

                                    Spacer(modifier = Modifier.height(10.dp))
                                    HorizontalDivider(color = SlateBorder)
                                    Spacer(modifier = Modifier.height(8.dp))

                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                                            Text(
                                                text = "${hospitalDepts.size} oddziałów",
                                                style = MaterialTheme.typography.labelSmall,
                                                color = MaterialTheme.colorScheme.onSurfaceVariant
                                            )
                                            Text(
                                                text = "${hospitalDocs.size} lekarzy",
                                                style = MaterialTheme.typography.labelSmall,
                                                color = MedicalTeal,
                                                fontWeight = FontWeight.SemiBold
                                            )
                                        }

                                        Row {
                                            if (hospital.phone.isNotBlank()) {
                                                IconButton(
                                                    onClick = {
                                                        val intent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:${hospital.phone}"))
                                                        context.startActivity(intent)
                                                    },
                                                    modifier = Modifier.size(32.dp)
                                                ) {
                                                    Icon(Icons.Default.Phone, contentDescription = "Zadzwoń", tint = OceanBlue, modifier = Modifier.size(18.dp))
                                                }
                                            }
                                            IconButton(
                                                onClick = {
                                                    editingHospital = hospital
                                                    showAddHospitalDialog = true
                                                },
                                                modifier = Modifier.size(32.dp)
                                            ) {
                                                Icon(Icons.Default.Edit, contentDescription = "Edytuj", tint = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.size(18.dp))
                                            }
                                            IconButton(
                                                onClick = {
                                                    itemToDelete = Triple("Szpital: ${hospital.name}", "Czy na pewno chcesz usunąć ten szpital?") {
                                                        viewModel.deleteHospital(hospital.id)
                                                    }
                                                },
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

                1 -> {
                    // DEPARTMENTS LIST
                    val filtered = departments.filter { d ->
                        searchQuery.isBlank() || d.name.contains(searchQuery, ignoreCase = true)
                    }

                    LazyColumn(
                        modifier = Modifier.fillMaxSize().padding(horizontal = 16.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        items(filtered) { dept ->
                            val hospital = hospitals.find { it.id == dept.hospitalId }
                            val deptDoctors = doctors.filter { it.departmentId == dept.id }

                            Card(
                                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                                shape = RoundedCornerShape(12.dp),
                                modifier = Modifier.fillMaxWidth().testTag("dept_card_${dept.id}")
                            ) {
                                Row(
                                    modifier = Modifier.padding(14.dp).fillMaxWidth(),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Box(
                                        modifier = Modifier
                                            .size(38.dp)
                                            .clip(RoundedCornerShape(8.dp))
                                            .background(MedicalTealLight),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Icon(Icons.Default.Domain, contentDescription = null, tint = MedicalTeal, modifier = Modifier.size(20.dp))
                                    }
                                    Spacer(modifier = Modifier.width(12.dp))
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(
                                            text = dept.name,
                                            style = MaterialTheme.typography.titleMedium,
                                            fontWeight = FontWeight.Bold
                                        )
                                        Text(
                                            text = hospital?.name ?: "Szpital",
                                            style = MaterialTheme.typography.bodyMedium,
                                            color = MaterialTheme.colorScheme.onSurfaceVariant
                                        )
                                        Row(
                                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            Surface(
                                                color = OceanBlueLight,
                                                shape = RoundedCornerShape(4.dp)
                                            ) {
                                                Text(
                                                    text = dept.type.label,
                                                    style = MaterialTheme.typography.labelSmall,
                                                    color = OceanBlueDark,
                                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                                )
                                            }
                                            Text(
                                                text = "${deptDoctors.size} lekarzy",
                                                style = MaterialTheme.typography.labelSmall,
                                                color = MaterialTheme.colorScheme.onSurfaceVariant
                                            )
                                        }
                                    }
                                    Row {
                                        IconButton(
                                            onClick = {
                                                editingDepartment = dept
                                                showAddDepartmentDialog = true
                                            },
                                            modifier = Modifier.size(32.dp)
                                        ) {
                                            Icon(Icons.Default.Edit, contentDescription = "Edytuj", tint = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.size(18.dp))
                                        }
                                        IconButton(
                                            onClick = {
                                                itemToDelete = Triple("Oddział: ${dept.name}", "Czy na pewno chcesz usunąć ten oddział?") {
                                                    viewModel.deleteDepartment(dept.id)
                                                }
                                            },
                                            modifier = Modifier.size(32.dp)
                                        ) {
                                            Icon(Icons.Default.Delete, contentDescription = "Usuń", tint = StatusDanger, modifier = Modifier.size(18.dp))
                                        }
                                    }
                                }
                            }
                        }
                        item { Spacer(modifier = Modifier.height(80.dp)) }
                    }
                }

                2 -> {
                    // DOCTORS LIST
                    val filtered = doctors.filter { doc ->
                        searchQuery.isBlank() || doc.fullName.contains(searchQuery, ignoreCase = true) || doc.specialization.contains(searchQuery, ignoreCase = true)
                    }

                    LazyColumn(
                        modifier = Modifier.fillMaxSize().padding(horizontal = 16.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        items(filtered) { doctor ->
                            val hospital = hospitals.find { it.id == doctor.hospitalId }
                            val dept = departments.find { it.id == doctor.departmentId }

                            Card(
                                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                                shape = RoundedCornerShape(12.dp),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable { selectedDoctorDetail = doctor }
                                    .testTag("doctor_card_${doctor.id}")
                            ) {
                                Column(modifier = Modifier.padding(14.dp)) {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Box(
                                            modifier = Modifier
                                                .size(40.dp)
                                                .clip(CircleShape)
                                                .background(OceanBlueLight),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Icon(Icons.Default.Person, contentDescription = null, tint = OceanBlueDark, modifier = Modifier.size(22.dp))
                                        }
                                        Spacer(modifier = Modifier.width(12.dp))
                                        Column(modifier = Modifier.weight(1f)) {
                                            Text(
                                                text = doctor.fullName,
                                                style = MaterialTheme.typography.titleMedium,
                                                fontWeight = FontWeight.Bold
                                            )
                                            Text(
                                                text = doctor.specialization,
                                                style = MaterialTheme.typography.bodyMedium,
                                                color = MedicalTeal,
                                                fontWeight = FontWeight.Medium
                                            )
                                            Text(
                                                text = "${hospital?.name ?: ""}${if (dept != null) " • ${dept.name}" else ""}",
                                                style = MaterialTheme.typography.labelSmall,
                                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                                maxLines = 1,
                                                overflow = TextOverflow.Ellipsis
                                            )
                                        }

                                        Row {
                                            if (doctor.phone.isNotBlank()) {
                                                IconButton(
                                                    onClick = {
                                                        val intent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:${doctor.phone}"))
                                                        context.startActivity(intent)
                                                    },
                                                    modifier = Modifier.size(32.dp)
                                                ) {
                                                    Icon(Icons.Default.Phone, contentDescription = "Zadzwoń", tint = OceanBlue, modifier = Modifier.size(18.dp))
                                                }
                                            }
                                            IconButton(
                                                onClick = {
                                                    editingDoctor = doctor
                                                    showAddDoctorDialog = true
                                                },
                                                modifier = Modifier.size(32.dp)
                                            ) {
                                                Icon(Icons.Default.Edit, contentDescription = "Edytuj", tint = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.size(18.dp))
                                            }
                                            IconButton(
                                                onClick = {
                                                    itemToDelete = Triple("Lekarz: ${doctor.fullName}", "Czy na pewno chcesz usunąć tego lekarza?") {
                                                        viewModel.deleteDoctor(doctor.id)
                                                    }
                                                },
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
    }

    // Hospital Add/Edit Dialog
    if (showAddHospitalDialog) {
        var name by remember { mutableStateOf(editingHospital?.name ?: "") }
        var address by remember { mutableStateOf(editingHospital?.address ?: "") }
        var city by remember { mutableStateOf(editingHospital?.city ?: "") }
        var voivodeship by remember { mutableStateOf(editingHospital?.voivodeship ?: "Warmińsko-Mazurskie") }
        var phone by remember { mutableStateOf(editingHospital?.phone ?: "") }
        var email by remember { mutableStateOf(editingHospital?.email ?: "") }
        var website by remember { mutableStateOf(editingHospital?.website ?: "") }
        var notes by remember { mutableStateOf(editingHospital?.notes ?: "") }
        var pipelineStatus by remember { mutableStateOf(editingHospital?.pipelineStatus ?: PipelineStatus.PROSPECT) }
        var segment by remember { mutableStateOf(editingHospital?.segment ?: "B") }

        AlertDialog(
            onDismissRequest = { showAddHospitalDialog = false },
            title = { Text(if (editingHospital == null) "Dodaj Szpital" else "Edytuj Szpital") },
            text = {
                LazyColumn(
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                    modifier = Modifier.fillMaxWidth().heightIn(max = 450.dp)
                ) {
                    item {
                        OutlinedTextField(
                            value = name,
                            onValueChange = { name = it },
                            label = { Text("Nazwa szpitala *") },
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                    item {
                        OutlinedTextField(
                            value = city,
                            onValueChange = { city = it },
                            label = { Text("Miasto *") },
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                    item {
                        OutlinedTextField(
                            value = address,
                            onValueChange = { address = it },
                            label = { Text("Adres") },
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                    item {
                        OutlinedTextField(
                            value = voivodeship,
                            onValueChange = { voivodeship = it },
                            label = { Text("Województwo") },
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                    item {
                        OutlinedTextField(
                            value = phone,
                            onValueChange = { phone = it },
                            label = { Text("Telefon") },
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                    item {
                        OutlinedTextField(
                            value = email,
                            onValueChange = { email = it },
                            label = { Text("Email") },
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                    item {
                        OutlinedTextField(
                            value = notes,
                            onValueChange = { notes = it },
                            label = { Text("Notatki / Informacje") },
                            modifier = Modifier.fillMaxWidth(),
                            minLines = 3
                        )
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (name.isNotBlank()) {
                            viewModel.saveHospital(
                                Hospital(
                                    id = editingHospital?.id ?: "",
                                    name = name.trim(),
                                    address = address.trim(),
                                    city = city.trim(),
                                    voivodeship = voivodeship.trim(),
                                    phone = phone.trim(),
                                    email = email.trim(),
                                    website = website.trim(),
                                    notes = notes.trim(),
                                    pipelineStatus = pipelineStatus,
                                    segment = segment
                                )
                            )
                            showAddHospitalDialog = false
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = OceanBlue)
                ) {
                    Text("Zapisz")
                }
            },
            dismissButton = {
                TextButton(onClick = { showAddHospitalDialog = false }) {
                    Text("Anuluj")
                }
            }
        )
    }

    // Department Add/Edit Dialog
    if (showAddDepartmentDialog) {
        var name by remember { mutableStateOf(editingDepartment?.name ?: "") }
        var selectedHospId by remember { mutableStateOf(editingDepartment?.hospitalId ?: hospitals.firstOrNull()?.id ?: "") }
        var deptType by remember { mutableStateOf(editingDepartment?.type ?: DepartmentType.ZABIEGOWY) }

        AlertDialog(
            onDismissRequest = { showAddDepartmentDialog = false },
            title = { Text(if (editingDepartment == null) "Dodaj Oddział" else "Edytuj Oddział") },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    OutlinedTextField(
                        value = name,
                        onValueChange = { name = it },
                        label = { Text("Nazwa oddziału *") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    Text("Wybierz szpital:", style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Bold)
                    LazyColumn(modifier = Modifier.heightIn(max = 150.dp)) {
                        items(hospitals) { hosp ->
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable { selectedHospId = hosp.id }
                                    .padding(vertical = 4.dp)
                            ) {
                                RadioButton(
                                    selected = selectedHospId == hosp.id,
                                    onClick = { selectedHospId = hosp.id }
                                )
                                Text(hosp.name, style = MaterialTheme.typography.bodyMedium, maxLines = 1, overflow = TextOverflow.Ellipsis)
                            }
                        }
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (name.isNotBlank() && selectedHospId.isNotBlank()) {
                            viewModel.saveDepartment(
                                Department(
                                    id = editingDepartment?.id ?: "",
                                    hospitalId = selectedHospId,
                                    name = name.trim(),
                                    type = deptType
                                )
                            )
                            showAddDepartmentDialog = false
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = OceanBlue)
                ) {
                    Text("Zapisz")
                }
            },
            dismissButton = {
                TextButton(onClick = { showAddDepartmentDialog = false }) {
                    Text("Anuluj")
                }
            }
        )
    }

    // Doctor Add/Edit Dialog
    if (showAddDoctorDialog) {
        var firstName by remember { mutableStateOf(editingDoctor?.firstName ?: "") }
        var lastName by remember { mutableStateOf(editingDoctor?.lastName ?: "") }
        var title by remember { mutableStateOf(editingDoctor?.title ?: "dr n. med.") }
        var spec by remember { mutableStateOf(editingDoctor?.specialization ?: "") }
        var phone by remember { mutableStateOf(editingDoctor?.phone ?: "") }
        var email by remember { mutableStateOf(editingDoctor?.email ?: "") }
        var notes by remember { mutableStateOf(editingDoctor?.notes ?: "") }
        var selectedHospId by remember { mutableStateOf(editingDoctor?.hospitalId ?: hospitals.firstOrNull()?.id ?: "") }
        var selectedDeptId by remember { mutableStateOf(editingDoctor?.departmentId ?: "") }

        var hospitalExpanded by remember { mutableStateOf(false) }
        var departmentExpanded by remember { mutableStateOf(false) }

        val currentHosp = hospitals.find { it.id == selectedHospId }
        val availableDepts = departments.filter { it.hospitalId == selectedHospId }
        val currentDept = availableDepts.find { it.id == selectedDeptId }

        AlertDialog(
            onDismissRequest = { showAddDoctorDialog = false },
            title = { Text(if (editingDoctor == null) "Dodaj Lekarza" else "Edytuj Lekarza") },
            text = {
                LazyColumn(
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                    modifier = Modifier.fillMaxWidth().heightIn(max = 480.dp)
                ) {
                    item {
                        OutlinedTextField(
                            value = title,
                            onValueChange = { title = it },
                            label = { Text("Tytuł (np. dr n. med., prof.)") },
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                    item {
                        OutlinedTextField(
                            value = firstName,
                            onValueChange = { firstName = it },
                            label = { Text("Imię *") },
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                    item {
                        OutlinedTextField(
                            value = lastName,
                            onValueChange = { lastName = it },
                            label = { Text("Nazwisko *") },
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                    item {
                        OutlinedTextField(
                            value = spec,
                            onValueChange = { spec = it },
                            label = { Text("Specjalizacja (np. Urologia, Kardiochirurgia)") },
                            modifier = Modifier.fillMaxWidth()
                        )
                    }

                    // Przypisanie do Szpitala
                    item {
                        ExposedDropdownMenuBox(
                            expanded = hospitalExpanded,
                            onExpandedChange = { hospitalExpanded = !hospitalExpanded },
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            OutlinedTextField(
                                value = currentHosp?.name ?: if (hospitals.isEmpty()) "Brak szpitali" else "Wybierz szpital *",
                                onValueChange = {},
                                readOnly = true,
                                label = { Text("Szpital *") },
                                trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = hospitalExpanded) },
                                colors = ExposedDropdownMenuDefaults.outlinedTextFieldColors(),
                                modifier = Modifier
                                    .menuAnchor()
                                    .fillMaxWidth()
                            )
                            ExposedDropdownMenu(
                                expanded = hospitalExpanded,
                                onDismissRequest = { hospitalExpanded = false }
                            ) {
                                hospitals.forEach { hosp ->
                                    DropdownMenuItem(
                                        text = {
                                            Column {
                                                Text(hosp.name, fontWeight = FontWeight.Medium)
                                                if (hosp.city.isNotBlank()) {
                                                    Text(hosp.city, style = MaterialTheme.typography.bodySmall, color = Color(0xFF64748B))
                                                }
                                            }
                                        },
                                        onClick = {
                                            selectedHospId = hosp.id
                                            selectedDeptId = ""
                                            hospitalExpanded = false
                                        }
                                    )
                                }
                            }
                        }
                    }

                    // Przypisanie do Oddziału
                    item {
                        ExposedDropdownMenuBox(
                            expanded = departmentExpanded,
                            onExpandedChange = { departmentExpanded = !departmentExpanded },
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            OutlinedTextField(
                                value = currentDept?.name ?: if (availableDepts.isEmpty()) "Brak oddziałów (lub wybór ogólny)" else "Wybierz oddział (opcjonalnie)",
                                onValueChange = {},
                                readOnly = true,
                                label = { Text("Oddział") },
                                trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = departmentExpanded) },
                                colors = ExposedDropdownMenuDefaults.outlinedTextFieldColors(),
                                modifier = Modifier
                                    .menuAnchor()
                                    .fillMaxWidth()
                            )
                            if (availableDepts.isNotEmpty()) {
                                ExposedDropdownMenu(
                                    expanded = departmentExpanded,
                                    onDismissRequest = { departmentExpanded = false }
                                ) {
                                    DropdownMenuItem(
                                        text = { Text("— Brak przypisanego oddziału —", fontStyle = FontStyle.Italic) },
                                        onClick = {
                                            selectedDeptId = ""
                                            departmentExpanded = false
                                        }
                                    )
                                    availableDepts.forEach { dept ->
                                        DropdownMenuItem(
                                            text = { Text(dept.name) },
                                            onClick = {
                                                selectedDeptId = dept.id
                                                departmentExpanded = false
                                            }
                                        )
                                    }
                                }
                            }
                        }
                    }

                    item {
                        OutlinedTextField(
                            value = phone,
                            onValueChange = { phone = it },
                            label = { Text("Telefon") },
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                    item {
                        OutlinedTextField(
                            value = email,
                            onValueChange = { email = it },
                            label = { Text("Email") },
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                    item {
                        OutlinedTextField(
                            value = notes,
                            onValueChange = { notes = it },
                            label = { Text("Notatki / Preferencje") },
                            modifier = Modifier.fillMaxWidth(),
                            minLines = 2
                        )
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (firstName.isNotBlank() && lastName.isNotBlank() && selectedHospId.isNotBlank()) {
                            viewModel.saveDoctor(
                                Doctor(
                                    id = editingDoctor?.id ?: "",
                                    firstName = firstName.trim(),
                                    lastName = lastName.trim(),
                                    title = title.trim(),
                                    specialization = spec.trim(),
                                    phone = phone.trim(),
                                    email = email.trim(),
                                    notes = notes.trim(),
                                    hospitalId = selectedHospId,
                                    departmentId = selectedDeptId
                                )
                            )
                            showAddDoctorDialog = false
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = OceanBlue)
                ) {
                    Text("Zapisz")
                }
            },
            dismissButton = {
                TextButton(onClick = { showAddDoctorDialog = false }) {
                    Text("Anuluj")
                }
            }
        )
    }

    // Delete Confirmation Dialog
    if (itemToDelete != null) {
        val (title, msg, onConfirm) = itemToDelete!!
        AlertDialog(
            onDismissRequest = { itemToDelete = null },
            title = { Text(title) },
            text = { Text(msg) },
            confirmButton = {
                Button(
                    onClick = {
                        onConfirm()
                        itemToDelete = null
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = StatusDanger)
                ) {
                    Text("Usuń")
                }
            },
            dismissButton = {
                TextButton(onClick = { itemToDelete = null }) {
                    Text("Anuluj")
                }
            }
        )
    }
}
