package com.example.macscrm.util

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import com.example.macscrm.MainActivity
import com.example.macscrm.R

object CrmNotificationManager {

    const val CHANNEL_MEETINGS_ID = "crm_meetings_channel"
    const val CHANNEL_TASKS_ID = "crm_tasks_channel"
    const val CHANNEL_DAILY_ID = "crm_daily_channel"

    private const val NOTIFICATION_ID_MEETING = 1001
    private const val NOTIFICATION_ID_TASK = 1002
    private const val NOTIFICATION_ID_DAILY = 1003
    private const val NOTIFICATION_ID_TEST = 1004

    fun createNotificationChannels(context: Context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

            val meetingChannel = NotificationChannel(
                CHANNEL_MEETINGS_ID,
                "Przypomnienia o wizytach handlowych",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Powiadomienia o zbliżających się spotkaniach z lekarzami i ordynatorami"
                enableVibration(true)
                setShowBadge(true)
            }

            val taskChannel = NotificationChannel(
                CHANNEL_TASKS_ID,
                "Zadania i Follow-up",
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                description = "Powiadomienia o upływających terminach zadań i pilnych sprawach"
            }

            val dailyChannel = NotificationChannel(
                CHANNEL_DAILY_ID,
                "Poranny briefing przedstawiciela",
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                description = "Podsumowanie zaplanowanych wizyt na bieżący dzień"
            }

            notificationManager.createNotificationChannels(listOf(meetingChannel, taskChannel, dailyChannel))
        }
    }

    private fun getPendingIntent(context: Context, targetScreen: String = "dashboard"): PendingIntent {
        val intent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            putExtra("EXTRA_TARGET_SCREEN", targetScreen)
        }
        return PendingIntent.getActivity(
            context,
            (System.currentTimeMillis() % 10000).toInt(),
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
    }

    fun sendMeetingReminderNotification(
        context: Context,
        meetingTitle: String,
        doctorName: String,
        hospitalName: String,
        timeStr: String
    ) {
        try {
            createNotificationChannels(context)
            val pendingIntent = getPendingIntent(context, "meetings")

            val builder = NotificationCompat.Builder(context, CHANNEL_MEETINGS_ID)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle("Zbliżająca się wizyta: $timeStr")
                .setContentText("$doctorName ($hospitalName)")
                .setStyle(
                    NotificationCompat.BigTextStyle()
                        .bigText("Wizyta u: $doctorName\nSzpital: $hospitalName\nTemat: $meetingTitle\nGodzina: $timeStr")
                )
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setAutoCancel(true)
                .setContentIntent(pendingIntent)

            NotificationManagerCompat.from(context).notify(NOTIFICATION_ID_MEETING, builder.build())
        } catch (e: SecurityException) {
            // Notification permission might not be granted yet
        }
    }

    fun sendUrgentTaskNotification(
        context: Context,
        taskDescription: String,
        dueDate: String?
    ) {
        try {
            createNotificationChannels(context)
            val pendingIntent = getPendingIntent(context, "tasks")

            val builder = NotificationCompat.Builder(context, CHANNEL_TASKS_ID)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle("Pilne zadanie CRM")
                .setContentText(taskDescription)
                .setStyle(
                    NotificationCompat.BigTextStyle()
                        .bigText("Zadanie do wykonania: $taskDescription\nTermin: ${dueDate ?: "Bieżący tydzień"}")
                )
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .setAutoCancel(true)
                .setContentIntent(pendingIntent)

            NotificationManagerCompat.from(context).notify(NOTIFICATION_ID_TASK, builder.build())
        } catch (e: SecurityException) {
            // Notification permission might not be granted yet
        }
    }

    fun sendDailyBriefingNotification(
        context: Context,
        scheduledMeetingsCount: Int,
        pendingTasksCount: Int
    ) {
        try {
            createNotificationChannels(context)
            val pendingIntent = getPendingIntent(context, "dashboard")

            val builder = NotificationCompat.Builder(context, CHANNEL_DAILY_ID)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle("Plan Dnia Przedstawiciela MACS")
                .setContentText("Masz dzisiaj $scheduledMeetingsCount wizyt oraz $pendingTasksCount zadań.")
                .setStyle(
                    NotificationCompat.BigTextStyle()
                        .bigText("Dzień dobry! Twój plan na dziś:\n• Wizyty handlowe: $scheduledMeetingsCount\n• Oczekujące zadania: $pendingTasksCount\n\nKliknij, aby otworzyć agendę.")
                )
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .setAutoCancel(true)
                .setContentIntent(pendingIntent)

            NotificationManagerCompat.from(context).notify(NOTIFICATION_ID_DAILY, builder.build())
        } catch (e: SecurityException) {
            // Ignore if no permission
        }
    }

    fun sendTestNotification(context: Context, title: String, message: String) {
        try {
            createNotificationChannels(context)
            val pendingIntent = getPendingIntent(context, "dashboard")

            val builder = NotificationCompat.Builder(context, CHANNEL_MEETINGS_ID)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle(title)
                .setContentText(message)
                .setStyle(NotificationCompat.BigTextStyle().bigText(message))
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setAutoCancel(true)
                .setContentIntent(pendingIntent)

            NotificationManagerCompat.from(context).notify(NOTIFICATION_ID_TEST, builder.build())
        } catch (e: SecurityException) {
            // Ignore
        }
    }
}
