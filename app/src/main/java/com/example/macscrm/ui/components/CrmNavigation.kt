package com.example.macscrm.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.ExitToApp
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.example.macscrm.data.model.CrmUser
import com.example.macscrm.data.model.UserRole
import com.example.macscrm.ui.theme.OceanBlue
import com.example.macscrm.ui.theme.OceanBlueDark
import com.example.macscrm.ui.theme.OceanBlueLight

data class NavItem(
    val id: String,
    val title: String,
    val icon: ImageVector,
    val badgeCount: Int = 0,
    val requiredRole: UserRole? = null
)

val NAV_ITEMS = listOf(
    NavItem("dashboard", "Pulpit", Icons.Default.GridView),
    NavItem("profile", "Mój Profil", Icons.Default.AccountCircle),
    NavItem("contacts", "Baza", Icons.Default.People),
    NavItem("meetings", "Wizyty", Icons.Default.EventNote),
    NavItem("calendar", "Kalendarz", Icons.Default.CalendarMonth),
    NavItem("tasks", "Zadania", Icons.Default.CheckCircle),
    NavItem("trips", "Planer tras", Icons.Default.Route),
    NavItem("manager", "Panel Managera", Icons.Default.WorkspacePremium, requiredRole = UserRole.MANAGER),
    NavItem("admin", "Panel Administratora", Icons.Default.Shield, requiredRole = UserRole.ADMIN)
)

val BOTTOM_NAV_ITEMS = listOf(
    NavItem("dashboard", "Pulpit", Icons.Default.GridView),
    NavItem("contacts", "Baza", Icons.Default.People),
    NavItem("add", "DODAJ", Icons.Default.Add),
    NavItem("calendar", "Kalendarz", Icons.Default.CalendarMonth),
    NavItem("more", "Więcej", Icons.Default.MoreHoriz)
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CrmTopAppBar(
    currentUser: CrmUser?,
    currentRole: UserRole,
    onSettingsClick: () -> Unit,
    onLogoutClick: () -> Unit
) {
    TopAppBar(
        title = {
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                // App Logo Icon
                Box(
                    modifier = Modifier
                        .size(42.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(Color(0xFF2563EB)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Apartment,
                        contentDescription = "Logo",
                        tint = Color.White,
                        modifier = Modifier.size(24.dp)
                    )
                }
                Spacer(modifier = Modifier.width(12.dp))
                Column {
                    Text(
                        text = "Mac’s CRM",
                        style = MaterialTheme.typography.titleMedium.copy(
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                    )
                    Text(
                        text = "Medical CRM",
                        style = MaterialTheme.typography.labelSmall.copy(
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Medium,
                            color = Color(0xFF94A3B8),
                            letterSpacing = 0.5.sp
                        )
                    )
                }
            }
        },
        actions = {
            IconButton(
                onClick = onSettingsClick,
                modifier = Modifier.testTag("top_settings_button")
            ) {
                Icon(
                    imageVector = Icons.Outlined.Settings,
                    contentDescription = "Ustawienia",
                    tint = Color(0xFF94A3B8)
                )
            }
            IconButton(
                onClick = onLogoutClick,
                modifier = Modifier.testTag("top_logout_button")
            ) {
                Icon(
                    imageVector = Icons.AutoMirrored.Outlined.ExitToApp,
                    contentDescription = "Wyloguj",
                    tint = Color(0xFF94A3B8)
                )
            }
        },
        colors = TopAppBarDefaults.topAppBarColors(
            containerColor = Color(0xFF0F172A),
            titleContentColor = Color.White,
            actionIconContentColor = Color(0xFF94A3B8)
        )
    )
}

@Composable
fun CrmBottomNavigation(
    currentScreen: String,
    onNavigate: (String) -> Unit,
    onAddClick: () -> Unit,
    onMoreClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Surface(
        modifier = modifier
            .fillMaxWidth()
            .testTag("bottom_navigation_bar"),
        color = Color(0xFF0B132B),
        shadowElevation = 16.dp
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .navigationBarsPadding()
                .padding(vertical = 6.dp),
            horizontalArrangement = Arrangement.SpaceAround,
            verticalAlignment = Alignment.CenterVertically
        ) {
            // 1. Pulpit
            BottomNavItemView(
                title = "Pulpit",
                icon = Icons.Default.GridView,
                isSelected = currentScreen == "dashboard",
                onClick = { onNavigate("dashboard") }
            )

            // 2. Baza
            BottomNavItemView(
                title = "Baza",
                icon = Icons.Default.People,
                isSelected = currentScreen == "contacts",
                onClick = { onNavigate("contacts") }
            )

            // 3. Central DODAJ (+) Button
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier
                    .clickable { onAddClick() }
                    .testTag("bottom_nav_add_button")
                    .padding(horizontal = 4.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(48.dp)
                        .shadow(8.dp, CircleShape)
                        .clip(CircleShape)
                        .background(
                            Brush.verticalGradient(
                                colors = listOf(Color(0xFF3B82F6), Color(0xFF1D4ED8))
                            )
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Add,
                        contentDescription = "Dodaj",
                        tint = Color.White,
                        modifier = Modifier.size(28.dp)
                    )
                }
                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    text = "DODAJ",
                    style = MaterialTheme.typography.labelSmall.copy(
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF60A5FA)
                    )
                )
            }

            // 4. Kalendarz
            BottomNavItemView(
                title = "Kalendarz",
                icon = Icons.Default.CalendarMonth,
                isSelected = currentScreen == "calendar",
                onClick = { onNavigate("calendar") }
            )

            // 5. Więcej
            BottomNavItemView(
                title = "Więcej",
                icon = Icons.Default.MoreHoriz,
                isSelected = currentScreen in listOf("tasks", "meetings", "manager", "admin", "profile", "trips"),
                onClick = { onMoreClick() }
            )
        }
    }
}

@Composable
private fun BottomNavItemView(
    title: String,
    icon: ImageVector,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    val contentColor = if (isSelected) Color(0xFF38BDF8) else Color(0xFF94A3B8)

    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
        modifier = Modifier
            .clickable { onClick() }
            .padding(horizontal = 8.dp, vertical = 4.dp)
            .testTag("nav_tab_$title")
    ) {
        Icon(
            imageVector = icon,
            contentDescription = title,
            tint = contentColor,
            modifier = Modifier.size(22.dp)
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = title,
            style = MaterialTheme.typography.labelSmall.copy(
                fontSize = 11.sp,
                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                color = contentColor
            )
        )
    }
}

@Composable
fun MoreNavigationModal(
    currentRole: UserRole,
    currentUser: CrmUser?,
    onDismiss: () -> Unit,
    onNavigate: (String) -> Unit,
    onLogout: () -> Unit,
    onResetDatabase: () -> Unit
) {
    Dialog(onDismissRequest = onDismiss) {
        Surface(
            shape = RoundedCornerShape(20.dp),
            color = Color(0xFF131E32),
            modifier = Modifier
                .fillMaxWidth()
                .padding(8.dp)
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                // Header Row
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "NAWIGACJA I SYSTEM",
                        style = MaterialTheme.typography.labelMedium.copy(
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF94A3B8),
                            letterSpacing = 1.sp
                        )
                    )
                    IconButton(
                        onClick = onDismiss,
                        modifier = Modifier.size(24.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Close,
                            contentDescription = "Zamknij",
                            tint = Color(0xFF94A3B8)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Menu Items
                MoreMenuItem(
                    title = "Zadania & Follow-upy",
                    icon = Icons.Default.CheckBox,
                    iconTint = Color(0xFF38BDF8),
                    onClick = {
                        onDismiss()
                        onNavigate("tasks")
                    }
                )

                MoreMenuItem(
                    title = "Lista Wizyt",
                    icon = Icons.Default.CalendarMonth,
                    iconTint = Color(0xFF34D399),
                    onClick = {
                        onDismiss()
                        onNavigate("meetings")
                    }
                )

                MoreMenuItem(
                    title = "Ustawienia & Powiadomienia",
                    icon = Icons.Default.Settings,
                    iconTint = Color(0xFF60A5FA),
                    onClick = {
                        onDismiss()
                        onNavigate("profile")
                    }
                )

                MoreMenuItem(
                    title = "Panel Menedżera",
                    icon = Icons.Default.WorkspacePremium,
                    iconTint = Color(0xFFFBBF24),
                    onClick = {
                        onDismiss()
                        onNavigate("manager")
                    }
                )

                MoreMenuItem(
                    title = "Panel Administratora",
                    icon = Icons.Default.Shield,
                    iconTint = Color(0xFFA78BFA),
                    onClick = {
                        onDismiss()
                        onNavigate("admin")
                    }
                )

                Spacer(modifier = Modifier.height(16.dp))
                HorizontalDivider(color = Color(0xFF1E293B))
                Spacer(modifier = Modifier.height(14.dp))

                // User Info Row
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = "Rola: ",
                            style = MaterialTheme.typography.bodyMedium.copy(
                                color = Color(0xFF94A3B8)
                            )
                        )
                        Text(
                            text = currentRole.name,
                            style = MaterialTheme.typography.bodyMedium.copy(
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF38BDF8)
                            )
                        )
                    }
                    Text(
                        text = currentUser?.name ?: "Łukasz W.",
                        style = MaterialTheme.typography.bodyMedium.copy(
                            color = Color(0xFF94A3B8)
                        )
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Action Buttons Row
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Button(
                        onClick = {
                            onDismiss()
                            onLogout()
                        },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Color(0xFF3B1822)
                        ),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier
                            .weight(1f)
                            .border(1.dp, Color(0xFFEF4444).copy(alpha = 0.4f), RoundedCornerShape(10.dp))
                    ) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Outlined.ExitToApp,
                            contentDescription = null,
                            tint = Color(0xFFF87171),
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "Wyloguj",
                            color = Color(0xFFF87171),
                            fontWeight = FontWeight.Bold
                        )
                    }

                    Button(
                        onClick = {
                            onDismiss()
                            onResetDatabase()
                        },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Color(0xFF1E293B)
                        ),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.weight(1f)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Refresh,
                            contentDescription = null,
                            tint = Color(0xFF94A3B8),
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "Reset Bazy",
                            color = Color(0xFFCBD5E1),
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun MoreMenuItem(
    title: String,
    icon: ImageVector,
    iconTint: Color,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() }
            .padding(vertical = 12.dp, horizontal = 4.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = title,
            tint = iconTint,
            modifier = Modifier.size(22.dp)
        )
        Spacer(modifier = Modifier.width(14.dp))
        Text(
            text = title,
            style = MaterialTheme.typography.bodyLarge.copy(
                fontWeight = FontWeight.SemiBold,
                color = Color.White
            )
        )
    }
}

@Composable
fun QuickAddModal(
    onDismiss: () -> Unit,
    onAddMeeting: () -> Unit,
    onAddDoctor: () -> Unit,
    onAddHospital: () -> Unit,
    onAddTask: () -> Unit
) {
    Dialog(onDismissRequest = onDismiss) {
        Surface(
            shape = RoundedCornerShape(20.dp),
            color = MaterialTheme.colorScheme.surface,
            modifier = Modifier
                .fillMaxWidth()
                .padding(8.dp)
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "Szybkie Dodawanie",
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "Wybierz rodzaj rekordu do utworzenia:",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Default.Close, contentDescription = "Zamknij")
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    QuickAddCard(
                        title = "NOWA WIZYTA",
                        subtitle = "Zaplanuj lub zaraportuj spotkanie lub asystę",
                        icon = Icons.Default.EventNote,
                        color = Color(0xFF2563EB),
                        modifier = Modifier.weight(1f),
                        onClick = {
                            onDismiss()
                            onAddMeeting()
                        }
                    )
                    QuickAddCard(
                        title = "NOWY LEKARZ",
                        subtitle = "Dodaj lekarza do oddziału i szpitala",
                        icon = Icons.Default.Person,
                        color = Color(0xFF0D9488),
                        modifier = Modifier.weight(1f),
                        onClick = {
                            onDismiss()
                            onAddDoctor()
                        }
                    )
                }

                Spacer(modifier = Modifier.height(12.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    QuickAddCard(
                        title = "NOWY SZPITAL",
                        subtitle = "Zarejestruj nową placówkę medyczną",
                        icon = Icons.Default.LocalHospital,
                        color = Color(0xFF8B5CF6),
                        modifier = Modifier.weight(1f),
                        onClick = {
                            onDismiss()
                            onAddHospital()
                        }
                    )
                    QuickAddCard(
                        title = "NOWE ZADANIE",
                        subtitle = "Utwórz follow-up lub przypomnienie",
                        icon = Icons.Default.CheckCircle,
                        color = Color(0xFFF59E0B),
                        modifier = Modifier.weight(1f),
                        onClick = {
                            onDismiss()
                            onAddTask()
                        }
                    )
                }
            }
        }
    }
}

@Composable
private fun QuickAddCard(
    title: String,
    subtitle: String,
    icon: ImageVector,
    color: Color,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Card(
        onClick = onClick,
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = color.copy(alpha = 0.08f)),
        modifier = modifier
            .border(1.dp, color.copy(alpha = 0.25f), RoundedCornerShape(14.dp))
    ) {
        Column(
            modifier = Modifier.padding(14.dp),
            horizontalAlignment = Alignment.Start
        ) {
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .clip(CircleShape)
                    .background(color.copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = color,
                    modifier = Modifier.size(20.dp)
                )
            }
            Spacer(modifier = Modifier.height(10.dp))
            Text(
                text = title,
                style = MaterialTheme.typography.labelLarge,
                fontWeight = FontWeight.Bold,
                color = color
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = subtitle,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                lineHeight = 16.sp
            )
        }
    }
}

