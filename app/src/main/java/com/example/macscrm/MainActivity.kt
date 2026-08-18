package com.example.macscrm

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import com.example.macscrm.ui.components.CrmBottomNavigation
import com.example.macscrm.ui.components.CrmNavigationDrawerContent
import com.example.macscrm.ui.components.CrmTopAppBar
import com.example.macscrm.ui.screens.*
import com.example.macscrm.ui.theme.MacsCRMTheme
import com.example.macscrm.ui.viewmodel.CrmViewModel
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {

    private val viewModel: CrmViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            MacsCRMTheme {
                val currentScreen by viewModel.currentScreen.collectAsState()
                val currentUser by viewModel.currentUser.collectAsState()
                val currentRole by viewModel.currentRole.collectAsState()
                val systemSettings by viewModel.systemSettings.collectAsState()
                val selectedMeetingId by viewModel.selectedMeetingId.collectAsState()

                val drawerState = rememberDrawerState(initialValue = DrawerValue.Closed)
                val scope = rememberCoroutineScope()

                // Back press handling
                BackHandler(enabled = currentScreen != "dashboard" && currentScreen != "login") {
                    if (currentScreen == "meeting_detail") {
                        viewModel.navigateTo("meetings")
                    } else {
                        viewModel.navigateTo("dashboard")
                    }
                }

                if (currentScreen == "login" || currentUser == null) {
                    LoginScreen(
                        viewModel = viewModel,
                        onLoginSuccess = { viewModel.navigateTo("dashboard") }
                    )
                } else {
                    ModalNavigationDrawer(
                        drawerState = drawerState,
                        drawerContent = {
                            CrmNavigationDrawerContent(
                                currentScreen = currentScreen,
                                currentRole = currentRole,
                                currentUser = currentUser,
                                brandName = systemSettings.brandName,
                                onNavigate = { screen ->
                                    viewModel.navigateTo(screen)
                                    scope.launch { drawerState.close() }
                                },
                                onLogout = {
                                    viewModel.logout()
                                    scope.launch { drawerState.close() }
                                }
                            )
                        }
                    ) {
                        Scaffold(
                            topBar = {
                                if (currentScreen != "meeting_detail") {
                                    val title = when (currentScreen) {
                                        "dashboard" -> "Pulpit Główny"
                                        "contacts" -> "Szpitale i Kontakty"
                                        "meetings" -> "Wizyty i Raporty"
                                        "calendar" -> "Kalendarz Wizyt"
                                        "tasks" -> "Zadania Handlowe"
                                        "trips" -> "Planer Tras"
                                        "manager" -> "Panel Managera"
                                        "admin" -> "Panel Administratora"
                                        else -> systemSettings.brandName
                                    }
                                    CrmTopAppBar(
                                        title = title,
                                        currentUser = currentUser,
                                        currentRole = currentRole,
                                        onMenuClick = { scope.launch { drawerState.open() } },
                                        onRoleChange = { role -> viewModel.setRole(role) },
                                        onProfileClick = { scope.launch { drawerState.open() } }
                                    )
                                }
                            },
                            bottomBar = {
                                if (currentScreen != "meeting_detail" && currentScreen != "login") {
                                    CrmBottomNavigation(
                                        currentScreen = currentScreen,
                                        onNavigate = { screen -> viewModel.navigateTo(screen) }
                                    )
                                }
                            }
                        ) { innerPadding ->
                            Surface(
                                modifier = Modifier
                                    .fillMaxSize()
                                    .padding(innerPadding),
                                color = MaterialTheme.colorScheme.background
                            ) {
                                when (currentScreen) {
                                    "dashboard" -> DashboardScreen(
                                        viewModel = viewModel,
                                        onNavigate = { screen, meetingId -> viewModel.navigateTo(screen, meetingId) }
                                    )
                                    "contacts" -> ContactsScreen(
                                        viewModel = viewModel,
                                        onNavigateToMeeting = { meetingId -> viewModel.navigateTo("meeting_detail", meetingId) }
                                    )
                                    "meetings" -> MeetingsScreen(
                                        viewModel = viewModel,
                                        onNavigateToDetail = { meetingId -> viewModel.navigateTo("meeting_detail", meetingId) }
                                    )
                                    "meeting_detail" -> {
                                        if (selectedMeetingId != null) {
                                            MeetingDetailScreen(
                                                meetingId = selectedMeetingId!!,
                                                viewModel = viewModel,
                                                onBack = { viewModel.navigateTo("meetings") }
                                            )
                                        } else {
                                            MeetingsScreen(
                                                viewModel = viewModel,
                                                onNavigateToDetail = { meetingId -> viewModel.navigateTo("meeting_detail", meetingId) }
                                            )
                                        }
                                    }
                                    "calendar" -> CalendarScreen(
                                        viewModel = viewModel,
                                        onNavigateToMeeting = { meetingId -> viewModel.navigateTo("meeting_detail", meetingId) }
                                    )
                                    "tasks" -> TasksScreen(viewModel = viewModel)
                                    "trips" -> TripsScreen(
                                        viewModel = viewModel,
                                        onNavigateToHospital = { /* no-op or filter */ }
                                    )
                                    "manager" -> ManagerScreen(
                                        viewModel = viewModel,
                                        onNavigateToMeeting = { meetingId -> viewModel.navigateTo("meeting_detail", meetingId) }
                                    )
                                    "admin" -> AdminScreen(viewModel = viewModel)
                                    else -> DashboardScreen(
                                        viewModel = viewModel,
                                        onNavigate = { screen, meetingId -> viewModel.navigateTo(screen, meetingId) }
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
