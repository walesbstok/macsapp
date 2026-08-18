package com.example.macscrm.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import com.example.macscrm.data.model.Task
import com.example.macscrm.ui.components.SearchBar
import com.example.macscrm.ui.theme.*
import com.example.macscrm.ui.viewmodel.CrmViewModel
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TasksScreen(
    viewModel: CrmViewModel
) {
    var selectedFilter by remember { mutableStateOf(0) } // 0: Wszystkie, 1: Do zrobienia, 2: Zrobione
    var searchQuery by remember { mutableStateOf("") }

    val tasks by viewModel.tasks.collectAsState()
    val hospitals by viewModel.hospitals.collectAsState()
    val doctors by viewModel.doctors.collectAsState()

    var showAddTaskDialog by remember { mutableStateOf(false) }
    var editingTask by remember { mutableStateOf<Task?>(null) }
    var taskToDelete by remember { mutableStateOf<Task?>(null) }

    val filteredTasks = tasks.filter { task ->
        val matchesFilter = when (selectedFilter) {
            1 -> !task.isDone
            2 -> task.isDone
            else -> true
        }
        val hosp = hospitals.find { it.id == task.hospitalId }
        val doc = doctors.find { it.id == task.doctorId }
        val matchesSearch = searchQuery.isBlank() ||
                task.description.contains(searchQuery, ignoreCase = true) ||
                (hosp?.name?.contains(searchQuery, ignoreCase = true) == true) ||
                (doc?.fullName?.contains(searchQuery, ignoreCase = true) == true)

        matchesFilter && matchesSearch
    }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = {
                    editingTask = null
                    showAddTaskDialog = true
                },
                containerColor = OceanBlue,
                contentColor = Color.White,
                modifier = Modifier.testTag("tasks_fab_add")
            ) {
                Icon(Icons.Default.Add, contentDescription = "Dodaj zadanie")
            }
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .testTag("tasks_screen")
        ) {
            // Filter Tabs
            TabRow(
                selectedTabIndex = selectedFilter,
                containerColor = MaterialTheme.colorScheme.surface,
                contentColor = OceanBlue
            ) {
                Tab(
                    selected = selectedFilter == 0,
                    onClick = { selectedFilter = 0 },
                    text = { Text("Wszystkie (${tasks.size})") }
                )
                Tab(
                    selected = selectedFilter == 1,
                    onClick = { selectedFilter = 1 },
                    text = { Text("Do zrobienia (${tasks.count { !it.isDone }})") }
                )
                Tab(
                    selected = selectedFilter == 2,
                    onClick = { selectedFilter = 2 },
                    text = { Text("Zrobione (${tasks.count { it.isDone }})") }
                )
            }

            // Search Bar
            Box(modifier = Modifier.padding(16.dp)) {
                SearchBar(
                    query = searchQuery,
                    onQueryChange = { searchQuery = it },
                    placeholder = "Szukaj w zadaniach..."
                )
            }

            // Task List
            if (filteredTasks.isEmpty()) {
                Box(
                    modifier = Modifier.fillMaxSize().padding(32.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "Brak zadań w wybranej kategorii.",
                        style = MaterialTheme.typography.bodyLarge,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize().padding(horizontal = 16.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(filteredTasks) { task ->
                        val hospital = hospitals.find { it.id == task.hospitalId }
                        val doctor = doctors.find { it.id == task.doctorId }

                        Card(
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                            shape = RoundedCornerShape(12.dp),
                            elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                            modifier = Modifier.fillMaxWidth().testTag("task_card_${task.id}")
                        ) {
                            Row(
                                modifier = Modifier.padding(12.dp).fillMaxWidth(),
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
                                Spacer(modifier = Modifier.width(10.dp))
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = task.description,
                                        style = MaterialTheme.typography.bodyMedium,
                                        fontWeight = FontWeight.Medium,
                                        textDecoration = if (task.isDone) TextDecoration.LineThrough else TextDecoration.None,
                                        color = if (task.isDone) MaterialTheme.colorScheme.onSurfaceVariant else MaterialTheme.colorScheme.onSurface
                                    )
                                    Row(
                                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        if (hospital != null) {
                                            Text(
                                                text = hospital.name,
                                                style = MaterialTheme.typography.labelSmall,
                                                color = OceanBlueDark
                                            )
                                        }
                                        if (doctor != null) {
                                            Text(
                                                text = "• ${doctor.fullName}",
                                                style = MaterialTheme.typography.labelSmall,
                                                color = MedicalTeal
                                            )
                                        }
                                        if (!task.dueDate.isNullOrBlank()) {
                                            Text(
                                                text = "Termin: ${task.dueDate}",
                                                style = MaterialTheme.typography.labelSmall,
                                                color = if (task.isDone) MaterialTheme.colorScheme.onSurfaceVariant else StatusWarning,
                                                fontWeight = FontWeight.SemiBold
                                            )
                                        }
                                    }
                                }
                                Row {
                                    IconButton(
                                        onClick = {
                                            editingTask = task
                                            showAddTaskDialog = true
                                        },
                                        modifier = Modifier.size(32.dp)
                                    ) {
                                        Icon(Icons.Default.Edit, contentDescription = "Edytuj", tint = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.size(18.dp))
                                    }
                                    IconButton(
                                        onClick = { taskToDelete = task },
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
        }
    }

    // Add / Edit Task Dialog
    if (showAddTaskDialog) {
        var description by remember { mutableStateOf(editingTask?.description ?: "") }
        var dueDate by remember {
            mutableStateOf(
                editingTask?.dueDate ?: SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date(System.currentTimeMillis() + 3 * 24 * 3600 * 1000L))
            )
        }
        var selectedHospId by remember { mutableStateOf(editingTask?.hospitalId ?: "") }
        var selectedDocId by remember { mutableStateOf(editingTask?.doctorId ?: "") }

        AlertDialog(
            onDismissRequest = { showAddTaskDialog = false },
            title = { Text(if (editingTask == null) "Nowe Zadanie" else "Edytuj Zadanie") },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    OutlinedTextField(
                        value = description,
                        onValueChange = { description = it },
                        label = { Text("Treść zadania *") },
                        modifier = Modifier.fillMaxWidth(),
                        minLines = 2
                    )
                    OutlinedTextField(
                        value = dueDate,
                        onValueChange = { dueDate = it },
                        label = { Text("Termin (YYYY-MM-DD)") },
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (description.isNotBlank()) {
                            viewModel.saveTask(
                                Task(
                                    id = editingTask?.id ?: "",
                                    meetingId = editingTask?.meetingId ?: "",
                                    hospitalId = selectedHospId,
                                    departmentId = editingTask?.departmentId ?: "",
                                    doctorId = selectedDocId,
                                    description = description.trim(),
                                    dueDate = dueDate.trim(),
                                    isDone = editingTask?.isDone ?: false
                                )
                            )
                            showAddTaskDialog = false
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = OceanBlue)
                ) {
                    Text("Zapisz")
                }
            },
            dismissButton = {
                TextButton(onClick = { showAddTaskDialog = false }) {
                    Text("Anuluj")
                }
            }
        )
    }

    // Delete Confirmation
    if (taskToDelete != null) {
        AlertDialog(
            onDismissRequest = { taskToDelete = null },
            title = { Text("Usuń zadanie") },
            text = { Text("Czy na pewno chcesz usunąć to zadanie?") },
            confirmButton = {
                Button(
                    onClick = {
                        taskToDelete?.let { viewModel.deleteTask(it.id) }
                        taskToDelete = null
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = StatusDanger)
                ) {
                    Text("Usuń")
                }
            },
            dismissButton = {
                TextButton(onClick = { taskToDelete = null }) {
                    Text("Anuluj")
                }
            }
        )
    }
}
