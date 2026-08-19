package com.example.macscrm.ui.screens

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
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
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import com.example.macscrm.data.model.CrmUser
import com.example.macscrm.data.model.UserRole
import com.example.macscrm.ui.theme.*
import com.example.macscrm.ui.viewmodel.CrmViewModel
import com.example.macscrm.util.CrmNotificationManager

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreen(
    viewModel: CrmViewModel,
    onBack: () -> Unit = {}
) {
    val context = LocalContext.current
    val currentUser by viewModel.currentUser.collectAsState()
    val currentRole by viewModel.currentRole.collectAsState()

    val user = currentUser ?: CrmUser(
        id = "usr_default",
        name = "Przedstawiciel Medyczny",
        email = "przedstawiciel@macsmedical.eu",
        role = UserRole.SALES_REP
    )

    // Form states initialized from currentUser
    var name by remember(user.id) { mutableStateOf(user.name) }
    var email by remember(user.id) { mutableStateOf(user.email) }
    var phone by remember(user.id) { mutableStateOf(user.phone) }
    var photoUriString by remember(user.id) { mutableStateOf(user.photoUri) }
    var territory by remember(user.id) { mutableStateOf(user.territory) }
    var specializationLine by remember(user.id) { mutableStateOf(user.specializationLine) }
    var monthlyVisitTarget by remember(user.id) { mutableStateOf(user.monthlyVisitTarget.toString()) }
    var vehiclePlate by remember(user.id) { mutableStateOf(user.vehiclePlate) }

    // Settings states
    var notificationsEnabled by remember(user.id) { mutableStateOf(user.notificationsEnabled) }
    var reminderMinutesBefore by remember(user.id) { mutableStateOf(user.reminderMinutesBefore) }
    var dailyMorningPlanReminder by remember(user.id) { mutableStateOf(user.dailyMorningPlanReminder) }
    var defaultNavigationApp by remember(user.id) { mutableStateOf(user.defaultNavigationApp) }
    var reportTemplateSignature by remember(user.id) { mutableStateOf(user.reportTemplateSignature) }

    var isSavedToast by remember { mutableStateOf(false) }

    // Photo picker launcher
    val photoPickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        if (uri != null) {
            photoUriString = uri.toString()
        }
    }

    // Permission launcher for notifications (Android 13+)
    val notificationPermissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestPermission()
    ) { isGranted: Boolean ->
        if (isGranted) {
            Toast.makeText(context, "Uprawnienie do powiadomień zostało przyznane!", Toast.LENGTH_SHORT).show()
            CrmNotificationManager.sendTestNotification(
                context,
                "Powiadomienia aktywne 🔔",
                "MACS CRM będzie informować Cię o nadchodzących wizytach u lekarzy."
            )
        } else {
            Toast.makeText(context, "Powiadomienia są wyłączone w ustawieniach systemu.", Toast.LENGTH_LONG).show()
        }
    }

    fun requestNotificationPermissionIfNeeded() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            val permission = Manifest.permission.POST_NOTIFICATIONS
            if (ContextCompat.checkSelfPermission(context, permission) != PackageManager.PERMISSION_GRANTED) {
                notificationPermissionLauncher.launch(permission)
            } else {
                CrmNotificationManager.sendTestNotification(
                    context,
                    "Powiadomienie testowe MACS CRM",
                    "Wszystko działa prawidłowo! Otrzymasz alert 30 min przed wizytą."
                )
                Toast.makeText(context, "Wysłano testowe powiadomienie!", Toast.LENGTH_SHORT).show()
            }
        } else {
            CrmNotificationManager.sendTestNotification(
                context,
                "Powiadomienie testowe MACS CRM",
                "Wszystko działa prawidłowo! Otrzymasz alert 30 min przed wizytą."
            )
            Toast.makeText(context, "Wysłano testowe powiadomienie!", Toast.LENGTH_SHORT).show()
        }
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .testTag("profile_screen"),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Top Profile Card with Avatar & Header
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = OceanBlueDark),
                shape = RoundedCornerShape(20.dp),
                elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    // Avatar Box
                    Box(
                        contentAlignment = Alignment.BottomEnd,
                        modifier = Modifier.size(90.dp)
                    ) {
                        Surface(
                            shape = CircleShape,
                            color = OceanBlueLight,
                            modifier = Modifier
                                .size(90.dp)
                                .border(3.dp, Color.White, CircleShape)
                                .clickable { photoPickerLauncher.launch("image/*") }
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                if (photoUriString.isNotBlank()) {
                                    // Initials or placeholder visual
                                    Text(
                                        text = name.split(" ").mapNotNull { it.firstOrNull()?.toString() }.take(2).joinToString("").uppercase(),
                                        style = MaterialTheme.typography.headlineMedium,
                                        fontWeight = FontWeight.Bold,
                                        color = OceanBlueDark
                                    )
                                } else {
                                    Text(
                                        text = name.split(" ").mapNotNull { it.firstOrNull()?.toString() }.take(2).joinToString("").uppercase(),
                                        style = MaterialTheme.typography.headlineMedium,
                                        fontWeight = FontWeight.Bold,
                                        color = OceanBlueDark
                                    )
                                }
                            }
                        }

                        // Edit photo badge
                        Surface(
                            shape = CircleShape,
                            color = EmeraldGreen,
                            modifier = Modifier
                                .size(28.dp)
                                .clickable { photoPickerLauncher.launch("image/*") }
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Icon(
                                    Icons.Default.CameraAlt,
                                    contentDescription = "Zmień zdjęcie",
                                    tint = Color.White,
                                    modifier = Modifier.size(16.dp)
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    Text(
                        text = name.ifBlank { "Przedstawiciel Medyczny" },
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )

                    Spacer(modifier = Modifier.height(4.dp))

                    Surface(
                        color = Color.White.copy(alpha = 0.2f),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text(
                            text = currentRole.label,
                            color = Color.White,
                            style = MaterialTheme.typography.labelMedium,
                            fontWeight = FontWeight.SemiBold,
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    Text(
                        text = email,
                        style = MaterialTheme.typography.bodySmall,
                        color = Color.White.copy(alpha = 0.85f)
                    )

                    if (territory.isNotBlank()) {
                        Text(
                            text = "📍 $territory",
                            style = MaterialTheme.typography.labelSmall,
                            color = Color.White.copy(alpha = 0.75f)
                        )
                    }
                }
            }
        }

        // Section: Personal & Contact Data
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                shape = RoundedCornerShape(16.dp),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Person, contentDescription = null, tint = OceanBlue, modifier = Modifier.size(22.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Dane Kontaktowe i Region",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    OutlinedTextField(
                        value = name,
                        onValueChange = { name = it },
                        label = { Text("Imię i Nazwisko *") },
                        leadingIcon = { Icon(Icons.Default.Badge, contentDescription = null) },
                        modifier = Modifier.fillMaxWidth().testTag("profile_name_input"),
                        singleLine = true
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    OutlinedTextField(
                        value = email,
                        onValueChange = { email = it },
                        label = { Text("Służbowy Adres Email *") },
                        leadingIcon = { Icon(Icons.Default.Email, contentDescription = null) },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                        modifier = Modifier.fillMaxWidth().testTag("profile_email_input"),
                        singleLine = true
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    OutlinedTextField(
                        value = phone,
                        onValueChange = { phone = it },
                        label = { Text("Numer Telefonu Przedstawiciela") },
                        leadingIcon = { Icon(Icons.Default.Phone, contentDescription = null) },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                        modifier = Modifier.fillMaxWidth().testTag("profile_phone_input"),
                        singleLine = true
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    OutlinedTextField(
                        value = territory,
                        onValueChange = { territory = it },
                        label = { Text("Obsługiwany Region / Województwa") },
                        placeholder = { Text("np. Mazowieckie, Podlaskie") },
                        leadingIcon = { Icon(Icons.Default.LocationOn, contentDescription = null) },
                        modifier = Modifier.fillMaxWidth().testTag("profile_territory_input"),
                        singleLine = true
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    OutlinedTextField(
                        value = specializationLine,
                        onValueChange = { specializationLine = it },
                        label = { Text("Linia Produktowa / Specjalizacje") },
                        placeholder = { Text("np. Chirurgia, Kardiochirurgia, Urologia") },
                        leadingIcon = { Icon(Icons.Default.MedicalServices, contentDescription = null) },
                        modifier = Modifier.fillMaxWidth().testTag("profile_specialization_input")
                    )
                }
            }
        }

        // Section: Representative Targets & Fleet Info
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                shape = RoundedCornerShape(16.dp),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.TrackChanges, contentDescription = null, tint = OceanBlue, modifier = Modifier.size(22.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Cele Handlowe i Samochód Służbowy",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        OutlinedTextField(
                            value = monthlyVisitTarget,
                            onValueChange = { monthlyVisitTarget = it },
                            label = { Text("Cel wizyt / m-c") },
                            leadingIcon = { Icon(Icons.Default.Flag, contentDescription = null) },
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                            modifier = Modifier.weight(1f).testTag("profile_target_input"),
                            singleLine = true
                        )

                        OutlinedTextField(
                            value = vehiclePlate,
                            onValueChange = { vehiclePlate = it },
                            label = { Text("Nr Rej. Auta") },
                            leadingIcon = { Icon(Icons.Default.DirectionsCar, contentDescription = null) },
                            modifier = Modifier.weight(1f).testTag("profile_vehicle_input"),
                            singleLine = true
                        )
                    }
                }
            }
        }

        // Section: Notification Settings & Mobile Alerts
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                shape = RoundedCornerShape(16.dp),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.NotificationsActive, contentDescription = null, tint = OceanBlue, modifier = Modifier.size(22.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Powiadomienia na Telefonie",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    // Master Toggle
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "Włącz powiadomienia systemowe",
                                style = MaterialTheme.typography.bodyMedium,
                                fontWeight = FontWeight.SemiBold
                            )
                            Text(
                                text = "Otrzymuj alerty o wizytach u lekarzy i upływających terminach",
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                        Switch(
                            checked = notificationsEnabled,
                            onCheckedChange = { notificationsEnabled = it }
                        )
                    }

                    if (notificationsEnabled) {
                        Divider(modifier = Modifier.padding(vertical = 10.dp))

                        // Reminder timing
                        Text(
                            text = "Czas przypomnienia przed wizytą:",
                            style = MaterialTheme.typography.labelMedium,
                            fontWeight = FontWeight.SemiBold
                        )
                        Spacer(modifier = Modifier.height(6.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            listOf(15, 30, 60).forEach { mins ->
                                FilterChip(
                                    selected = reminderMinutesBefore == mins,
                                    onClick = { reminderMinutesBefore = mins },
                                    label = { Text("$mins minut wcześniej") },
                                    leadingIcon = if (reminderMinutesBefore == mins) {
                                        { Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(16.dp)) }
                                    } else null
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(10.dp))

                        // Morning Briefing toggle
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = "Poranny briefing o 08:00",
                                    style = MaterialTheme.typography.bodySmall,
                                    fontWeight = FontWeight.SemiBold
                                )
                                Text(
                                    text = "Podsumowanie zaplanowanych szpitali i lekarzy na dany dzień",
                                    style = MaterialTheme.typography.labelSmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                            Switch(
                                checked = dailyMorningPlanReminder,
                                onCheckedChange = { dailyMorningPlanReminder = it }
                            )
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        // Test Notification Button
                        OutlinedButton(
                            onClick = { requestNotificationPermissionIfNeeded() },
                            shape = RoundedCornerShape(10.dp),
                            modifier = Modifier.fillMaxWidth().testTag("test_notification_btn")
                        ) {
                            Icon(Icons.Default.Send, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Wyślij powiadomienie testowe na telefon")
                        }
                    }
                }
            }
        }

        // Section: Navigation App & Report Preferences
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                shape = RoundedCornerShape(16.dp),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Navigation, contentDescription = null, tint = OceanBlue, modifier = Modifier.size(22.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Aplikacja do Nawigacji i Szablony",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    Text(
                        text = "Domyślna nawigacja GPS do szpitali:",
                        style = MaterialTheme.typography.labelMedium,
                        fontWeight = FontWeight.SemiBold
                    )
                    Spacer(modifier = Modifier.height(6.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        listOf("Google Maps", "Waze", "Yanosik").forEach { app ->
                            FilterChip(
                                selected = defaultNavigationApp == app,
                                onClick = { defaultNavigationApp = app },
                                label = { Text(app) }
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    Text(
                        text = "Szablon stopki / podpisu w raportach wizyt:",
                        style = MaterialTheme.typography.labelMedium,
                        fontWeight = FontWeight.SemiBold
                    )
                    Spacer(modifier = Modifier.height(6.dp))

                    OutlinedTextField(
                        value = reportTemplateSignature,
                        onValueChange = { reportTemplateSignature = it },
                        modifier = Modifier.fillMaxWidth(),
                        minLines = 2,
                        maxLines = 4,
                        placeholder = { Text("Z poważaniem,\nPrzedstawiciel Medyczny MACS") }
                    )
                }
            }
        }

        // Save Button Action
        item {
            Button(
                onClick = {
                    val targetNum = monthlyVisitTarget.toIntOrNull() ?: 40
                    val updatedUser = user.copy(
                        name = name.trim().ifBlank { user.name },
                        email = email.trim().ifBlank { user.email },
                        phone = phone.trim(),
                        photoUri = photoUriString,
                        territory = territory.trim(),
                        specializationLine = specializationLine.trim(),
                        monthlyVisitTarget = targetNum,
                        vehiclePlate = vehiclePlate.trim(),
                        notificationsEnabled = notificationsEnabled,
                        reminderMinutesBefore = reminderMinutesBefore,
                        dailyMorningPlanReminder = dailyMorningPlanReminder,
                        defaultNavigationApp = defaultNavigationApp,
                        reportTemplateSignature = reportTemplateSignature
                    )
                    viewModel.saveUser(updatedUser)
                    viewModel.setCurrentUser(updatedUser)
                    Toast.makeText(context, "Profil przedstawiciela został pomyślnie zaktualizowany!", Toast.LENGTH_SHORT).show()
                },
                colors = ButtonDefaults.buttonColors(containerColor = OceanBlue),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp)
                    .testTag("save_profile_button")
            ) {
                Icon(Icons.Default.Save, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Zapisz Zmiany w Profilu",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
            }
        }

        item { Spacer(modifier = Modifier.height(80.dp)) }
    }
}
