package com.example.macscrm.ui.screens

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
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
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.macscrm.data.backup.BackupResult
import com.example.macscrm.data.model.CrmUser
import com.example.macscrm.data.model.UserRole
import com.example.macscrm.ui.components.ProductTagChip
import com.example.macscrm.ui.components.SectionHeader
import com.example.macscrm.ui.theme.*
import com.example.macscrm.ui.viewmodel.CrmViewModel
import java.io.BufferedReader
import java.io.InputStreamReader
import java.io.OutputStreamWriter
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AdminScreen(
    viewModel: CrmViewModel
) {
    val context = LocalContext.current
    val clipboardManager = LocalClipboardManager.current

    val currentRole by viewModel.currentRole.collectAsState()
    val systemSettings by viewModel.systemSettings.collectAsState()
    val users by viewModel.users.collectAsState()
    val hospitals by viewModel.hospitals.collectAsState()
    val doctors by viewModel.doctors.collectAsState()
    val meetings by viewModel.meetings.collectAsState()
    val tasks by viewModel.tasks.collectAsState()
    val trips by viewModel.trips.collectAsState()

    var brandNameInput by remember(systemSettings.brandName) { mutableStateOf(systemSettings.brandName) }
    var newProductInput by remember { mutableStateOf("") }

    var showAddUserDialog by remember { mutableStateOf(false) }
    var showResetConfirmDialog by remember { mutableStateOf(false) }

    // Backup & Import States
    var showPasteImportDialog by remember { mutableStateOf(false) }
    var pasteJsonText by remember { mutableStateOf("") }
    var importOverwriteMode by remember { mutableStateOf(true) }
    var backupResultDialog by remember { mutableStateOf<BackupResult?>(null) }
    var isExporting by remember { mutableStateOf(false) }
    var pendingExportJson by remember { mutableStateOf<String?>(null) }

    // Launcher for Saving Exported JSON to a File
    val saveFileLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.CreateDocument("application/json")
    ) { uri: Uri? ->
        if (uri != null && pendingExportJson != null) {
            try {
                context.contentResolver.openOutputStream(uri)?.use { outputStream ->
                    OutputStreamWriter(outputStream).use { writer ->
                        writer.write(pendingExportJson)
                    }
                }
                Toast.makeText(context, "Kopia zapasowa zapisana pomyślnie!", Toast.LENGTH_LONG).show()
            } catch (e: Exception) {
                Toast.makeText(context, "Błąd zapisu pliku: ${e.message}", Toast.LENGTH_LONG).show()
            }
            pendingExportJson = null
        }
    }

    // Launcher for Picking a JSON File to Import
    val pickFileLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        if (uri != null) {
            try {
                val inputStream = context.contentResolver.openInputStream(uri)
                val jsonString = BufferedReader(InputStreamReader(inputStream)).use { it.readText() }
                viewModel.importDatabaseJson(jsonString, overwrite = importOverwriteMode) { result ->
                    backupResultDialog = result
                }
            } catch (e: Exception) {
                backupResultDialog = BackupResult(
                    isSuccess = false,
                    message = "Nie udało się odczytać pliku: ${e.localizedMessage ?: e.message}"
                )
            }
        }
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .testTag("admin_screen"),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Admin Header
        item {
            Card(
                colors = CardDefaults.cardColors(
                    containerColor = if (currentRole == UserRole.ADMIN) OceanBlueDark else StatusWarningBg
                ),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            Icons.Default.AdminPanelSettings,
                            contentDescription = null,
                            tint = if (currentRole == UserRole.ADMIN) Color.White else StatusWarning,
                            modifier = Modifier.size(28.dp)
                        )
                        Spacer(modifier = Modifier.width(10.dp))
                        Text(
                            text = "Panel Administracyjny (Tylko Administrator)",
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Bold,
                            color = if (currentRole == UserRole.ADMIN) Color.White else StatusWarning
                        )
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = if (currentRole == UserRole.ADMIN) {
                            "Zarządzanie konfiguracją systemu, importem i eksportem całej bazy w jednym pliku JSON, słownikami i użytkownikami."
                        } else {
                            "Uwaga: Jesteś zalogowany jako ${currentRole.label}. Pełny import/eksport bazy oraz edycja parametrów systemowych są zarezerwowane dla Administratora."
                        },
                        style = MaterialTheme.typography.bodySmall,
                        color = if (currentRole == UserRole.ADMIN) Color.White.copy(alpha = 0.85f) else SlateTextPrimary
                    )
                    if (currentRole != UserRole.ADMIN) {
                        Spacer(modifier = Modifier.height(8.dp))
                        Button(
                            onClick = { viewModel.setRole(UserRole.ADMIN) },
                            colors = ButtonDefaults.buttonColors(containerColor = OceanBlue),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text("Przełącz na profil Administratora")
                        }
                    }
                }
            }
        }

        // Database Backup & Restore (IMPORT / EXPORT)
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                shape = RoundedCornerShape(16.dp),
                elevation = CardDefaults.cardElevation(defaultElevation = 3.dp),
                modifier = Modifier.fillMaxWidth().testTag("backup_section_card")
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            Icons.Default.CloudSync,
                            contentDescription = null,
                            tint = OceanBlue,
                            modifier = Modifier.size(24.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Kopia Zapasowa (Import / Eksport)",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "Możesz wyeksportować całą bazę (szpitale, lekarze, wizyty, trasy, zadania) do pliku JSON lub zaimportować dane z innego urządzenia.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    // Database Live Stats pill
                    Surface(
                        color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("🏥 Szpitale: ${hospitals.size}", style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.SemiBold)
                            Text("👨‍⚕️ Lekarze: ${doctors.size}", style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.SemiBold)
                            Text("📋 Wizyty: ${meetings.size}", style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.SemiBold)
                            Text("🛣️ Trasy: ${trips.size}", style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.SemiBold)
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    Text(
                        text = "Eksport Danych",
                        style = MaterialTheme.typography.labelLarge,
                        fontWeight = FontWeight.Bold,
                        color = OceanBlueDark
                    )
                    Spacer(modifier = Modifier.height(6.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        // Export to File Button
                        Button(
                            onClick = {
                                isExporting = true
                                viewModel.exportDatabaseJson { json ->
                                    isExporting = false
                                    pendingExportJson = json
                                    val dateStr = SimpleDateFormat("yyyyMMdd_HHmm", Locale.getDefault()).format(Date())
                                    saveFileLauncher.launch("macs_crm_backup_$dateStr.json")
                                }
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = OceanBlue),
                            shape = RoundedCornerShape(10.dp),
                            modifier = Modifier.weight(1f).testTag("export_json_file_button")
                        ) {
                            Icon(Icons.Default.FileDownload, contentDescription = null, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Zapisz plik")
                        }

                        // Share / Send JSON
                        OutlinedButton(
                            onClick = {
                                viewModel.exportDatabaseJson { json ->
                                    val sendIntent = Intent().apply {
                                        action = Intent.ACTION_SEND
                                        putExtra(Intent.EXTRA_TEXT, json)
                                        putExtra(Intent.EXTRA_TITLE, "Kopia zapasowa MACS CRM")
                                        type = "text/plain"
                                    }
                                    val shareIntent = Intent.createChooser(sendIntent, "Udostępnij / Wyślij kopię zapasową")
                                    context.startActivity(shareIntent)
                                }
                            },
                            shape = RoundedCornerShape(10.dp),
                            modifier = Modifier.weight(1f).testTag("share_backup_button")
                        ) {
                            Icon(Icons.Default.Share, contentDescription = null, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Udostępnij")
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    // Copy to clipboard
                    TextButton(
                        onClick = {
                            viewModel.exportDatabaseJson { json ->
                                clipboardManager.setText(AnnotatedString(json))
                                Toast.makeText(context, "Skopiowano całą bazę JSON do schowka!", Toast.LENGTH_SHORT).show()
                            }
                        },
                        modifier = Modifier.align(Alignment.CenterHorizontally)
                    ) {
                        Icon(Icons.Default.ContentCopy, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Kopiuj JSON do schowka")
                    }

                    Divider(modifier = Modifier.padding(vertical = 12.dp))

                    Text(
                        text = "Import Danych",
                        style = MaterialTheme.typography.labelLarge,
                        fontWeight = FontWeight.Bold,
                        color = OceanBlueDark
                    )
                    Spacer(modifier = Modifier.height(6.dp))

                    // Mode switch: Overwrite vs Merge
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Checkbox(
                            checked = importOverwriteMode,
                            onCheckedChange = { importOverwriteMode = it }
                        )
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = if (importOverwriteMode) "Tryb: Zastąp całą bazę (Czyste przywrócenie)" else "Tryb: Scal z obecną bazą (Merge)",
                                style = MaterialTheme.typography.bodySmall,
                                fontWeight = FontWeight.SemiBold
                            )
                            Text(
                                text = if (importOverwriteMode) "Usuwa obecne rekordy i ładuje stan z pliku" else "Dodaje i aktualizuje rekordy bez kasowania pozostałych",
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Button(
                            onClick = {
                                pickFileLauncher.launch("*/*")
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = EmeraldGreen),
                            shape = RoundedCornerShape(10.dp),
                            modifier = Modifier.weight(1f).testTag("import_file_button")
                        ) {
                            Icon(Icons.Default.FileUpload, contentDescription = null, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Wczytaj plik")
                        }

                        OutlinedButton(
                            onClick = {
                                pasteJsonText = ""
                                showPasteImportDialog = true
                            },
                            shape = RoundedCornerShape(10.dp),
                            modifier = Modifier.weight(1f).testTag("import_paste_button")
                        ) {
                            Icon(Icons.Default.ContentPaste, contentDescription = null, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Wklej tekst")
                        }
                    }
                }
            }
        }

        // System Settings Card
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                shape = RoundedCornerShape(16.dp),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "Ustawienia Ogólne",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = brandNameInput,
                        onValueChange = { brandNameInput = it },
                        label = { Text("Nazwa Systemu / Brand") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "Wymagaj akceptacji raportów",
                                style = MaterialTheme.typography.bodyMedium,
                                fontWeight = FontWeight.SemiBold
                            )
                            Text(
                                text = "Raporty wizyt trafiają do weryfikacji przez Managera",
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                        Switch(
                            checked = systemSettings.enableMeetingApprovals,
                            onCheckedChange = { isEnabled ->
                                viewModel.saveSettings(systemSettings.copy(enableMeetingApprovals = isEnabled, brandName = brandNameInput))
                            }
                        )
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    Button(
                        onClick = {
                            viewModel.saveSettings(systemSettings.copy(brandName = brandNameInput))
                            Toast.makeText(context, "Ustawienia zostały zapisane.", Toast.LENGTH_SHORT).show()
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = OceanBlue),
                        modifier = Modifier.align(Alignment.End)
                    ) {
                        Text("Zapisz zmiany")
                    }
                }
            }
        }

        // Products Catalog
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                shape = RoundedCornerShape(16.dp),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "Słownik Marek i Produktów Medycznych",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(8.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        OutlinedTextField(
                            value = newProductInput,
                            onValueChange = { newProductInput = it },
                            placeholder = { Text("Nowa marka (np. BIO-HEAL)") },
                            modifier = Modifier.weight(1f),
                            singleLine = true
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Button(
                            onClick = {
                                if (newProductInput.isNotBlank()) {
                                    viewModel.addProductTag(newProductInput.trim())
                                    newProductInput = ""
                                }
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = OceanBlue)
                        ) {
                            Text("Dodaj")
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    FlowRow(
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        systemSettings.productsList.forEach { product ->
                            ProductTagChip(
                                tag = product,
                                onDelete = { viewModel.removeProductTag(product) }
                            )
                        }
                    }
                }
            }
        }

        // Users Management
        item {
            SectionHeader(
                title = "Użytkownicy i Uprawnienia",
                count = users.size,
                actionText = "Dodaj użytkownika",
                onActionClick = { showAddUserDialog = true }
            )
        }

        items(users) { user ->
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(12.dp).fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(text = user.name, fontWeight = FontWeight.Bold, style = MaterialTheme.typography.bodyMedium)
                        Text(text = user.email, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                    Surface(
                        color = when (user.role) {
                            UserRole.ADMIN -> StatusDangerBg
                            UserRole.MANAGER -> StatusWarningBg
                            UserRole.SALES_REP -> OceanBlueLight
                        },
                        shape = RoundedCornerShape(6.dp)
                    ) {
                        Text(
                            text = user.role.label,
                            color = when (user.role) {
                                UserRole.ADMIN -> StatusDanger
                                UserRole.MANAGER -> StatusWarning
                                UserRole.SALES_REP -> OceanBlueDark
                            },
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                        )
                    }
                    IconButton(
                        onClick = { viewModel.deleteUser(user.id) },
                        modifier = Modifier.size(32.dp)
                    ) {
                        Icon(Icons.Default.Delete, contentDescription = "Usuń", tint = StatusDanger, modifier = Modifier.size(18.dp))
                    }
                }
            }
        }

        // Danger Zone: Reset Database
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = StatusDangerBg.copy(alpha = 0.5f)),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "Strefa Narzędziowa Bazy Danych",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = StatusDanger
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Przywróć początkowe dane demonstracyjne szpitali, oddziałów, lekarzy i wizyt.",
                        style = MaterialTheme.typography.bodySmall,
                        color = SlateTextPrimary
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Button(
                        onClick = { showResetConfirmDialog = true },
                        colors = ButtonDefaults.buttonColors(containerColor = StatusDanger),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Icon(Icons.Default.Refresh, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Zresetuj bazę do danych startowych")
                    }
                }
            }
        }

        item { Spacer(modifier = Modifier.height(80.dp)) }
    }

    // Paste JSON Import Dialog
    if (showPasteImportDialog) {
        AlertDialog(
            onDismissRequest = { showPasteImportDialog = false },
            title = { Text("Importuj bazę z tekstu JSON") },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text(
                        text = "Wklej poniżej treść kopii zapasowej w formacie JSON:",
                        style = MaterialTheme.typography.bodySmall
                    )
                    OutlinedTextField(
                        value = pasteJsonText,
                        onValueChange = { pasteJsonText = it },
                        placeholder = { Text("{\"metadata\": ...}") },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(200.dp),
                        maxLines = 10
                    )
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Checkbox(
                            checked = importOverwriteMode,
                            onCheckedChange = { importOverwriteMode = it }
                        )
                        Text("Zastąp obecne dane (Czysty import)", style = MaterialTheme.typography.labelMedium)
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (pasteJsonText.isNotBlank()) {
                            viewModel.importDatabaseJson(pasteJsonText.trim(), overwrite = importOverwriteMode) { result ->
                                showPasteImportDialog = false
                                backupResultDialog = result
                            }
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = EmeraldGreen)
                ) {
                    Text("Importuj")
                }
            },
            dismissButton = {
                TextButton(onClick = { showPasteImportDialog = false }) {
                    Text("Anuluj")
                }
            }
        )
    }

    // Backup / Import Result Dialog
    backupResultDialog?.let { result ->
        AlertDialog(
            onDismissRequest = { backupResultDialog = null },
            title = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        if (result.isSuccess) Icons.Default.CheckCircle else Icons.Default.Error,
                        contentDescription = null,
                        tint = if (result.isSuccess) EmeraldGreen else StatusDanger
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(if (result.isSuccess) "Import Zakończony Sukcesem" else "Błąd Importu")
                }
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(result.message, style = MaterialTheme.typography.bodyMedium)
                    if (result.isSuccess) {
                        Divider()
                        Text("Zaimportowane obiekty:", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.bodySmall)
                        Text("• Szpitale: ${result.stats.hospitalsCount}", style = MaterialTheme.typography.bodySmall)
                        Text("• Oddziały: ${result.stats.departmentsCount}", style = MaterialTheme.typography.bodySmall)
                        Text("• Lekarze: ${result.stats.doctorsCount}", style = MaterialTheme.typography.bodySmall)
                        Text("• Wizyty: ${result.stats.meetingsCount}", style = MaterialTheme.typography.bodySmall)
                        Text("• Zadania: ${result.stats.tasksCount}", style = MaterialTheme.typography.bodySmall)
                        Text("• Trasy i wizyty: ${result.stats.tripsCount}", style = MaterialTheme.typography.bodySmall)
                        Text("• Użytkownicy: ${result.stats.usersCount}", style = MaterialTheme.typography.bodySmall)
                    }
                }
            },
            confirmButton = {
                Button(onClick = { backupResultDialog = null }) {
                    Text("OK")
                }
            }
        )
    }

    // Add User Dialog
    if (showAddUserDialog) {
        var name by remember { mutableStateOf("") }
        var email by remember { mutableStateOf("") }
        var selectedRole by remember { mutableStateOf(UserRole.SALES_REP) }

        AlertDialog(
            onDismissRequest = { showAddUserDialog = false },
            title = { Text("Dodaj użytkownika CRM") },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    OutlinedTextField(
                        value = name,
                        onValueChange = { name = it },
                        label = { Text("Imię i Nazwisko *") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    OutlinedTextField(
                        value = email,
                        onValueChange = { email = it },
                        label = { Text("Email *") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    Text("Rola użytkownika:", style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Bold)
                    UserRole.values().forEach { role ->
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            RadioButton(selected = selectedRole == role, onClick = { selectedRole = role })
                            Text(role.label, style = MaterialTheme.typography.bodyMedium)
                        }
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (name.isNotBlank() && email.isNotBlank()) {
                            viewModel.saveUser(
                                CrmUser(
                                    id = "",
                                    name = name.trim(),
                                    email = email.trim(),
                                    role = selectedRole,
                                    isActive = true
                                )
                            )
                            showAddUserDialog = false
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = OceanBlue)
                ) {
                    Text("Dodaj")
                }
            },
            dismissButton = {
                TextButton(onClick = { showAddUserDialog = false }) {
                    Text("Anuluj")
                }
            }
        )
    }

    // Reset Confirm Dialog
    if (showResetConfirmDialog) {
        AlertDialog(
            onDismissRequest = { showResetConfirmDialog = false },
            title = { Text("Zresetować bazę danych?") },
            text = { Text("Spowoduje to wyczyszczenie wprowadzonych zmian i załadowanie zestawu danych demonstracyjnych.") },
            confirmButton = {
                Button(
                    onClick = {
                        viewModel.resetDatabase()
                        showResetConfirmDialog = false
                        Toast.makeText(context, "Baza danych została zresetowana.", Toast.LENGTH_SHORT).show()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = StatusDanger)
                ) {
                    Text("Zresetuj")
                }
            },
            dismissButton = {
                TextButton(onClick = { showResetConfirmDialog = false }) {
                    Text("Anuluj")
                }
            }
        )
    }
}

