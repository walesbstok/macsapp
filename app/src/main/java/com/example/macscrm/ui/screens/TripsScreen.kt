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
import androidx.compose.ui.unit.dp
import com.example.macscrm.data.model.*
import com.example.macscrm.ui.components.SearchBar
import com.example.macscrm.ui.theme.*
import com.example.macscrm.ui.viewmodel.CrmViewModel
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TripsScreen(
    viewModel: CrmViewModel,
    onNavigateToHospital: (String) -> Unit
) {
    val trips by viewModel.trips.collectAsState()
    val hospitals by viewModel.hospitals.collectAsState()
    val doctors by viewModel.doctors.collectAsState()

    var showCreateTripDialog by remember { mutableStateOf(false) }
    var selectedTrip by remember { mutableStateOf<Trip?>(null) }

    LaunchedEffect(trips) {
        if (selectedTrip == null && trips.isNotEmpty()) {
            selectedTrip = trips.first()
        }
    }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showCreateTripDialog = true },
                containerColor = OceanBlue,
                contentColor = Color.White,
                modifier = Modifier.testTag("trips_fab_add")
            ) {
                Icon(Icons.Default.Add, contentDescription = "Nowa trasa")
            }
        }
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp)
                .testTag("trips_screen"),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Header
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = OceanBlueDark),
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Route, contentDescription = null, tint = Color.White, modifier = Modifier.size(28.dp))
                            Spacer(modifier = Modifier.width(10.dp))
                            Text(
                                text = "Planer Tras Tygodniowych",
                                style = MaterialTheme.typography.titleLarge,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Układaj trasy objazdowe, planuj noclegi i stałe punkty wizyt w szpitalach.",
                            style = MaterialTheme.typography.bodySmall,
                            color = Color.White.copy(alpha = 0.85f)
                        )
                    }
                }
            }

            // Route List
            if (trips.isEmpty()) {
                item {
                    Card(
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(
                            text = "Brak zaplanowanych tras. Kliknij '+' aby utworzyć plan tygodniowy.",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.padding(16.dp)
                        )
                    }
                }
            } else {
                items(trips) { trip ->
                    Card(
                        colors = CardDefaults.cardColors(
                            containerColor = if (selectedTrip?.id == trip.id) OceanBlueLight else MaterialTheme.colorScheme.surface
                        ),
                        shape = RoundedCornerShape(14.dp),
                        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { selectedTrip = trip }
                            .testTag("trip_card_${trip.id}")
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = trip.title,
                                    style = MaterialTheme.typography.titleMedium,
                                    fontWeight = FontWeight.Bold,
                                    color = if (selectedTrip?.id == trip.id) OceanBlueDark else MaterialTheme.colorScheme.onSurface
                                )
                                Surface(
                                    color = if (trip.status == "confirmed") StatusSuccessBg else StatusWarningBg,
                                    shape = RoundedCornerShape(6.dp)
                                ) {
                                    Text(
                                        text = if (trip.status == "confirmed") "Zatwierdzona" else "Wersja robocza",
                                        style = MaterialTheme.typography.labelSmall,
                                        color = if (trip.status == "confirmed") StatusSuccess else StatusWarning,
                                        fontWeight = FontWeight.Bold,
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                                    )
                                }
                            }
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = "Termin: ${trip.startDate} do ${trip.endDate}",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )

                            Spacer(modifier = Modifier.height(12.dp))
                            HorizontalDivider(color = SlateBorder)
                            Spacer(modifier = Modifier.height(8.dp))

                            // Day Schedule details
                            val sampleDays = listOf(
                                Triple("Poniedziałek (24.08)", "Olsztyn", listOf("08:00 - Blok Operacyjny (WSS Olsztyn)", "10:30 - Oddział Urologii (dr Kałużny)")),
                                Triple("Wtorek (25.08)", "Białystok", listOf("08:00 - Kardiochirurgia (USK Białystok)", "11:00 - Urologia (dr Grabowski)")),
                                Triple("Środa (26.08)", "Białystok", listOf("09:00 - Chirurgia Naczyniowa i Transplantacji")),
                                Triple("Czwartek (27.08)", "Suwałki", listOf("12:00 - Warsztaty Orascoptic (Szpital Suwałki)")),
                                Triple("Piątek (28.08)", "Powrót", listOf("Podsumowanie tygodnia, raporty w systemie"))
                            )

                            sampleDays.forEach { (dayName, overnight, stops) ->
                                Column(modifier = Modifier.padding(vertical = 4.dp)) {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween
                                    ) {
                                        Text(text = dayName, fontWeight = FontWeight.Bold, style = MaterialTheme.typography.bodyMedium)
                                        Text(text = "Nocleg: $overnight", style = MaterialTheme.typography.labelSmall, color = MedicalTeal, fontWeight = FontWeight.SemiBold)
                                    }
                                    stops.forEach { stop ->
                                        Row(
                                            verticalAlignment = Alignment.CenterVertically,
                                            modifier = Modifier.padding(start = 8.dp, top = 2.dp)
                                        ) {
                                            Box(
                                                modifier = Modifier
                                                    .size(6.dp)
                                                    .clip(CircleShape)
                                                    .background(OceanBlue)
                                            )
                                            Spacer(modifier = Modifier.width(6.dp))
                                            Text(text = stop, style = MaterialTheme.typography.labelSmall)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            item { Spacer(modifier = Modifier.height(80.dp)) }
        }
    }

    if (showCreateTripDialog) {
        var title by remember { mutableStateOf("") }
        var startDate by remember { mutableStateOf(SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())) }
        var endDate by remember {
            mutableStateOf(SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date(System.currentTimeMillis() + 5 * 24 * 3600 * 1000L)))
        }

        AlertDialog(
            onDismissRequest = { showCreateTripDialog = false },
            title = { Text("Utwórz nową trasę") },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    OutlinedTextField(
                        value = title,
                        onValueChange = { title = it },
                        label = { Text("Nazwa trasy (np. Trasa Mazowsze)") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    OutlinedTextField(
                        value = startDate,
                        onValueChange = { startDate = it },
                        label = { Text("Data początkowa (YYYY-MM-DD)") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    OutlinedTextField(
                        value = endDate,
                        onValueChange = { endDate = it },
                        label = { Text("Data końcowa (YYYY-MM-DD)") },
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (title.isNotBlank()) {
                            val newTrip = Trip(
                                id = "trip_${System.currentTimeMillis()}",
                                startDate = startDate,
                                endDate = endDate,
                                title = title.trim(),
                                status = "confirmed"
                            )
                            viewModel.saveTrip(newTrip, emptyList(), emptyList())
                            showCreateTripDialog = false
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = OceanBlue)
                ) {
                    Text("Utwórz")
                }
            },
            dismissButton = {
                TextButton(onClick = { showCreateTripDialog = false }) {
                    Text("Anuluj")
                }
            }
        )
    }
}
