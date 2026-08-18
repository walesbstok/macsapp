package com.example.macscrm.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
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
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
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
    NavItem("dashboard", "Pulpit", Icons.Default.Dashboard),
    NavItem("contacts", "Kontakty", Icons.Default.People),
    NavItem("meetings", "Wizyty", Icons.Default.EventNote),
    NavItem("calendar", "Kalendarz", Icons.Default.CalendarMonth),
    NavItem("tasks", "Zadania", Icons.Default.CheckCircle),
    NavItem("trips", "Planer tras", Icons.Default.Route),
    NavItem("manager", "Manager", Icons.Default.Assessment, requiredRole = UserRole.MANAGER),
    NavItem("admin", "Admin", Icons.Default.AdminPanelSettings, requiredRole = UserRole.ADMIN)
)

val BOTTOM_NAV_ITEMS = listOf(
    NavItem("dashboard", "Pulpit", Icons.Default.Dashboard),
    NavItem("contacts", "Kontakty", Icons.Default.People),
    NavItem("meetings", "Wizyty", Icons.Default.EventNote),
    NavItem("calendar", "Kalendarz", Icons.Default.CalendarMonth),
    NavItem("tasks", "Zadania", Icons.Default.CheckCircle)
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CrmTopAppBar(
    title: String,
    currentUser: CrmUser?,
    currentRole: UserRole,
    onMenuClick: () -> Unit,
    onRoleChange: (UserRole) -> Unit,
    onProfileClick: () -> Unit
) {
    var showRoleMenu by remember { mutableStateOf(false) }

    TopAppBar(
        title = {
            Column {
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
                Text(
                    text = currentUser?.name ?: "Mac's CRM",
                    style = MaterialTheme.typography.labelSmall,
                    color = Color.White.copy(alpha = 0.8f)
                )
            }
        },
        navigationIcon = {
            IconButton(
                onClick = onMenuClick,
                modifier = Modifier.testTag("nav_drawer_button")
            ) {
                Icon(
                    imageVector = Icons.Default.Menu,
                    contentDescription = "Menu",
                    tint = Color.White
                )
            }
        },
        actions = {
            // Role switcher button
            Box {
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = Color.White.copy(alpha = 0.2f),
                    modifier = Modifier
                        .clickable { showRoleMenu = true }
                        .padding(end = 8.dp)
                        .testTag("role_switcher_chip")
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                    ) {
                        Icon(
                            imageVector = when (currentRole) {
                                UserRole.ADMIN -> Icons.Default.Shield
                                UserRole.MANAGER -> Icons.Default.SupervisorAccount
                                UserRole.SALES_REP -> Icons.Default.Person
                            },
                            contentDescription = null,
                            tint = Color.White,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = when (currentRole) {
                                UserRole.ADMIN -> "Admin"
                                UserRole.MANAGER -> "Manager"
                                UserRole.SALES_REP -> "Rep"
                            },
                            style = MaterialTheme.typography.labelSmall,
                            color = Color.White,
                            fontWeight = FontWeight.SemiBold
                        )
                        Icon(
                            imageVector = Icons.Default.ArrowDropDown,
                            contentDescription = null,
                            tint = Color.White,
                            modifier = Modifier.size(16.dp)
                        )
                    }
                }

                DropdownMenu(
                    expanded = showRoleMenu,
                    onDismissRequest = { showRoleMenu = false }
                ) {
                    DropdownMenuItem(
                        text = { Text("Przedstawiciel Handlowy (Rep)") },
                        onClick = {
                            onRoleChange(UserRole.SALES_REP)
                            showRoleMenu = false
                        },
                        leadingIcon = { Icon(Icons.Default.Person, contentDescription = null) }
                    )
                    DropdownMenuItem(
                        text = { Text("Manager Zespołu") },
                        onClick = {
                            onRoleChange(UserRole.MANAGER)
                            showRoleMenu = false
                        },
                        leadingIcon = { Icon(Icons.Default.SupervisorAccount, contentDescription = null) }
                    )
                    DropdownMenuItem(
                        text = { Text("Administrator Systemu") },
                        onClick = {
                            onRoleChange(UserRole.ADMIN)
                            showRoleMenu = false
                        },
                        leadingIcon = { Icon(Icons.Default.Shield, contentDescription = null) }
                    )
                }
            }

            IconButton(
                onClick = onProfileClick,
                modifier = Modifier.testTag("user_profile_button")
            ) {
                Box(
                    modifier = Modifier
                        .size(32.dp)
                        .clip(CircleShape)
                        .background(Color.White),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Person,
                        contentDescription = "User",
                        tint = OceanBlue,
                        modifier = Modifier.size(20.dp)
                    )
                }
            }
        },
        colors = TopAppBarDefaults.topAppBarColors(
            containerColor = OceanBlueDark,
            titleContentColor = Color.White,
            navigationIconContentColor = Color.White,
            actionIconContentColor = Color.White
        )
    )
}

@Composable
fun CrmBottomNavigation(
    currentScreen: String,
    onNavigate: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    NavigationBar(
        modifier = modifier.testTag("bottom_navigation_bar"),
        containerColor = MaterialTheme.colorScheme.surface,
        tonalElevation = 8.dp
    ) {
        BOTTOM_NAV_ITEMS.forEach { item ->
            val isSelected = currentScreen == item.id
            NavigationBarItem(
                selected = isSelected,
                onClick = { onNavigate(item.id) },
                icon = {
                    Icon(
                        imageVector = item.icon,
                        contentDescription = item.title
                    )
                },
                label = {
                    Text(
                        text = item.title,
                        style = MaterialTheme.typography.labelSmall
                    )
                },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = OceanBlue,
                    selectedTextColor = OceanBlue,
                    indicatorColor = OceanBlueLight,
                    unselectedIconColor = MaterialTheme.colorScheme.onSurfaceVariant,
                    unselectedTextColor = MaterialTheme.colorScheme.onSurfaceVariant
                ),
                modifier = Modifier.testTag("nav_tab_${item.id}")
            )
        }
    }
}

@Composable
fun CrmNavigationDrawerContent(
    currentScreen: String,
    currentRole: UserRole,
    currentUser: CrmUser?,
    brandName: String,
    onNavigate: (String) -> Unit,
    onLogout: () -> Unit
) {
    ModalDrawerSheet(
        modifier = Modifier.width(300.dp),
        drawerContainerColor = MaterialTheme.colorScheme.surface
    ) {
        // Drawer Header
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(OceanBlueDark)
                .padding(20.dp)
        ) {
            Column {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(44.dp)
                            .clip(RoundedCornerShape(10.dp))
                            .background(Color.White),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.MedicalServices,
                            contentDescription = null,
                            tint = OceanBlueDark,
                            modifier = Modifier.size(28.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(
                            text = brandName,
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                        Text(
                            text = "Medical Rep CRM",
                            style = MaterialTheme.typography.labelSmall,
                            color = Color.White.copy(alpha = 0.8f)
                        )
                    }
                }
                Spacer(modifier = Modifier.height(16.dp))
                HorizontalDivider(color = Color.White.copy(alpha = 0.2f))
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    text = currentUser?.name ?: "Zalogowany",
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.SemiBold,
                    color = Color.White
                )
                Text(
                    text = currentUser?.email ?: "",
                    style = MaterialTheme.typography.labelSmall,
                    color = Color.White.copy(alpha = 0.7f)
                )
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Navigation Items
        NAV_ITEMS.forEach { item ->
            val isAllowed = when (item.requiredRole) {
                UserRole.ADMIN -> currentRole == UserRole.ADMIN
                UserRole.MANAGER -> currentRole == UserRole.MANAGER || currentRole == UserRole.ADMIN
                null -> true
                else -> true
            }

            if (isAllowed) {
                val isSelected = currentScreen == item.id
                NavigationDrawerItem(
                    label = { Text(item.title, fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal) },
                    icon = { Icon(item.icon, contentDescription = null) },
                    selected = isSelected,
                    onClick = { onNavigate(item.id) },
                    colors = NavigationDrawerItemDefaults.colors(
                        selectedContainerColor = OceanBlueLight,
                        selectedIconColor = OceanBlue,
                        selectedTextColor = OceanBlue
                    ),
                    modifier = Modifier
                        .padding(horizontal = 12.dp, vertical = 2.dp)
                        .testTag("drawer_item_${item.id}")
                )
            }
        }

        Spacer(modifier = Modifier.weight(1f))

        HorizontalDivider(modifier = Modifier.padding(horizontal = 16.dp))
        Spacer(modifier = Modifier.height(8.dp))

        NavigationDrawerItem(
            label = { Text("Wyloguj się", color = MaterialTheme.colorScheme.error) },
            icon = { Icon(Icons.Default.ExitToApp, contentDescription = null, tint = MaterialTheme.colorScheme.error) },
            selected = false,
            onClick = onLogout,
            modifier = Modifier
                .padding(horizontal = 12.dp, vertical = 8.dp)
                .testTag("drawer_logout_button")
        )
    }
}
