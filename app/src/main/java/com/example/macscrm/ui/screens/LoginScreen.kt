package com.example.macscrm.ui.screens

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
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import com.example.macscrm.data.model.CrmUser
import com.example.macscrm.data.model.UserRole
import com.example.macscrm.ui.theme.*
import com.example.macscrm.ui.viewmodel.CrmViewModel

@Composable
fun LoginScreen(
    viewModel: CrmViewModel,
    onLoginSuccess: () -> Unit
) {
    val users by viewModel.users.collectAsState()
    val systemSettings by viewModel.systemSettings.collectAsState()

    var emailInput by remember { mutableStateOf("lukasz.w@macsmedical.eu") }
    var passwordInput by remember { mutableStateOf("Macs123") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(SlateBackground)
            .padding(24.dp)
            .testTag("login_screen"),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        // App Logo Icon
        Box(
            modifier = Modifier
                .size(72.dp)
                .clip(RoundedCornerShape(18.dp))
                .background(OceanBlueDark),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = Icons.Default.MedicalServices,
                contentDescription = null,
                tint = Color.White,
                modifier = Modifier.size(40.dp)
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = systemSettings.brandName,
            style = MaterialTheme.typography.headlineLarge,
            fontWeight = FontWeight.Bold,
            color = SlateTextPrimary
        )

        Text(
            text = "System CRM dla Przedstawicieli Medycznych",
            style = MaterialTheme.typography.bodyMedium,
            color = SlateTextSecondary
        )

        Spacer(modifier = Modifier.height(32.dp))

        // Quick User Selector
        Card(
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            shape = RoundedCornerShape(16.dp),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "Szybkie logowanie (Wybierz profil):",
                    style = MaterialTheme.typography.labelLarge,
                    fontWeight = FontWeight.SemiBold,
                    color = SlateTextPrimary
                )
                Spacer(modifier = Modifier.height(10.dp))

                users.forEach { user ->
                    Surface(
                        color = OceanBlueLight.copy(alpha = 0.5f),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 4.dp)
                            .clickable {
                                viewModel.setCurrentUser(user)
                                onLoginSuccess()
                            }
                            .testTag("quick_login_${user.id}")
                    ) {
                        Row(
                            modifier = Modifier.padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(CircleShape)
                                    .background(OceanBlue),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = when (user.role) {
                                        UserRole.ADMIN -> Icons.Default.Shield
                                        UserRole.MANAGER -> Icons.Default.SupervisorAccount
                                        UserRole.SALES_REP -> Icons.Default.Person
                                    },
                                    contentDescription = null,
                                    tint = Color.White,
                                    modifier = Modifier.size(18.dp)
                                )
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = user.name,
                                    fontWeight = FontWeight.Bold,
                                    style = MaterialTheme.typography.bodyMedium
                                )
                                Text(
                                    text = "${user.email} • ${user.role.label}",
                                    style = MaterialTheme.typography.labelSmall,
                                    color = SlateTextSecondary
                                )
                            }
                            Icon(Icons.Default.ArrowForward, contentDescription = null, tint = OceanBlueDark, modifier = Modifier.size(16.dp))
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Direct Login Form
        Card(
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            shape = RoundedCornerShape(16.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                OutlinedTextField(
                    value = emailInput,
                    onValueChange = { emailInput = it },
                    label = { Text("Adres e-mail") },
                    leadingIcon = { Icon(Icons.Default.Email, contentDescription = null) },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(modifier = Modifier.height(10.dp))
                OutlinedTextField(
                    value = passwordInput,
                    onValueChange = { passwordInput = it },
                    label = { Text("Hasło") },
                    leadingIcon = { Icon(Icons.Default.Lock, contentDescription = null) },
                    visualTransformation = PasswordVisualTransformation(),
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(modifier = Modifier.height(16.dp))
                Button(
                    onClick = {
                        val matched = users.find { it.email.equals(emailInput.trim(), ignoreCase = true) }
                        if (matched != null) {
                            viewModel.setCurrentUser(matched)
                        } else {
                            viewModel.setCurrentUser(
                                CrmUser(
                                    id = "usr_custom",
                                    name = emailInput.substringBefore("@"),
                                    email = emailInput.trim(),
                                    role = UserRole.SALES_REP,
                                    isActive = true
                                )
                            )
                        }
                        onLoginSuccess()
                    },
                    shape = RoundedCornerShape(10.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = OceanBlue),
                    modifier = Modifier.fillMaxWidth().testTag("login_submit_button")
                ) {
                    Text("Zaloguj się", fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}
