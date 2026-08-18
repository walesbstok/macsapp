package com.example.macscrm.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.example.macscrm.data.model.Meeting
import com.example.macscrm.ui.components.MeetingStatusBadge
import com.example.macscrm.ui.theme.*
import com.example.macscrm.ui.viewmodel.CrmViewModel
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun CalendarScreen(
    viewModel: CrmViewModel,
    onNavigateToMeeting: (String) -> Unit
) {
    val meetings by viewModel.meetings.collectAsState()
    val hospitals by viewModel.hospitals.collectAsState()
    val doctors by viewModel.doctors.collectAsState()

    var currentCalendar by remember { mutableStateOf(Calendar.getInstance()) }
    var selectedDateString by remember {
        mutableStateOf(SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date()))
    }

    val monthYearFormat = SimpleDateFormat("LLLL yyyy", Locale("pl", "PL"))
    val dayFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())

    // Calculate days for the month grid
    val calCopy = currentCalendar.clone() as Calendar
    calCopy.set(Calendar.DAY_OF_MONTH, 1)
    val firstDayOfWeek = (calCopy.get(Calendar.DAY_OF_WEEK) + 5) % 7 // Monday = 0
    val maxDaysInMonth = calCopy.getActualMaximum(Calendar.DAY_OF_MONTH)

    val currentMonthStr = monthYearFormat.format(currentCalendar.time).replaceFirstChar { it.uppercase() }

    val daysInMonth = (1..maxDaysInMonth).toList()

    val meetingsForSelectedDate = meetings.filter { it.meetingDate.startsWith(selectedDateString) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .testTag("calendar_screen")
    ) {
        // Month Selector Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(
                onClick = {
                    val c = currentCalendar.clone() as Calendar
                    c.add(Calendar.MONTH, -1)
                    currentCalendar = c
                }
            ) {
                Icon(Icons.Default.ChevronLeft, contentDescription = "Poprzedni miesiąc")
            }

            Text(
                text = currentMonthStr,
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                color = OceanBlueDark
            )

            IconButton(
                onClick = {
                    val c = currentCalendar.clone() as Calendar
                    c.add(Calendar.MONTH, 1)
                    currentCalendar = c
                }
            ) {
                Icon(Icons.Default.ChevronRight, contentDescription = "Następny miesiąc")
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Weekday names
        val weekdays = listOf("Pn", "Wt", "Śr", "Cz", "Pt", "Sb", "Nd")
        Row(modifier = Modifier.fillMaxWidth()) {
            weekdays.forEach { dayName ->
                Text(
                    text = dayName,
                    style = MaterialTheme.typography.labelSmall,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.weight(1f)
                )
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Calendar Days Grid
        Card(
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            shape = RoundedCornerShape(16.dp),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            LazyVerticalGrid(
                columns = GridCells.Fixed(7),
                modifier = Modifier
                    .padding(8.dp)
                    .height(240.dp)
            ) {
                // Empty padding items before the 1st day of month
                items(firstDayOfWeek) {
                    Box(modifier = Modifier.size(36.dp))
                }

                items(daysInMonth) { day ->
                    val year = currentCalendar.get(Calendar.YEAR)
                    val month = currentCalendar.get(Calendar.MONTH) + 1
                    val dateStr = String.format(Locale.getDefault(), "%04d-%02d-%02d", year, month, day)
                    val hasMeetings = meetings.any { it.meetingDate.startsWith(dateStr) }
                    val isSelected = selectedDateString == dateStr

                    Box(
                        modifier = Modifier
                            .padding(2.dp)
                            .aspectRatio(1f)
                            .clip(CircleShape)
                            .background(
                                when {
                                    isSelected -> OceanBlue
                                    hasMeetings -> OceanBlueLight
                                    else -> Color.Transparent
                                }
                            )
                            .clickable { selectedDateString = dateStr },
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = "$day",
                                style = MaterialTheme.typography.bodyMedium,
                                fontWeight = if (isSelected || hasMeetings) FontWeight.Bold else FontWeight.Normal,
                                color = when {
                                    isSelected -> Color.White
                                    hasMeetings -> OceanBlueDark
                                    else -> MaterialTheme.colorScheme.onSurface
                                }
                            )
                            if (hasMeetings && !isSelected) {
                                Box(
                                    modifier = Modifier
                                        .size(4.dp)
                                        .clip(CircleShape)
                                        .background(OceanBlue)
                                )
                            }
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Schedule list for selected day
        Text(
            text = "Wizyty na dzień: $selectedDateString",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(8.dp))

        if (meetingsForSelectedDate.isEmpty()) {
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    text = "Brak zaplanowanych spotkań na ten dzień.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.padding(16.dp)
                )
            }
        } else {
            LazyColumn(
                modifier = Modifier.fillMaxWidth().weight(1f),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(meetingsForSelectedDate) { meeting ->
                    val hospital = hospitals.find { it.id == meeting.hospitalId }
                    val doctor = doctors.find { it.id == meeting.doctorId }
                    val status = viewModel.calculateMeetingStatus(meeting)

                    Card(
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { onNavigateToMeeting(meeting.id) }
                    ) {
                        Row(
                            modifier = Modifier.padding(12.dp).fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = meeting.title,
                                    style = MaterialTheme.typography.titleMedium,
                                    fontWeight = FontWeight.Bold,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                                Text(
                                    text = hospital?.name ?: "Szpital",
                                    style = MaterialTheme.typography.bodyMedium,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                                if (doctor != null) {
                                    Text(
                                        text = "Lekarz: ${doctor.fullName}",
                                        style = MaterialTheme.typography.labelSmall,
                                        color = MedicalTeal
                                    )
                                }
                            }
                            MeetingStatusBadge(status = status)
                        }
                    }
                }
            }
        }
    }
}
