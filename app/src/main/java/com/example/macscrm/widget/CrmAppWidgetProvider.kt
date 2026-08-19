package com.example.macscrm.widget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews
import com.example.macscrm.MainActivity
import com.example.macscrm.R
import java.text.SimpleDateFormat
import java.util.*

class CrmAppWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    companion object {
        private var cachedDoctorName: String = "dr n. med. Adam Kałużny"
        private var cachedHospitalName: String = "Szpital MSWiA w Białymstoku • Kardiochirurgia"
        private var cachedMeetingTime: String = "11:30"
        private var cachedStats: String = "Plan: 2/4 wizyt"
        private var cachedTasksCount: Int = 3

        fun setWidgetData(
            doctorName: String,
            hospitalName: String,
            meetingTime: String,
            statsText: String,
            tasksCount: Int
        ) {
            cachedDoctorName = doctorName
            cachedHospitalName = hospitalName
            cachedMeetingTime = meetingTime
            cachedStats = statsText
            cachedTasksCount = tasksCount
        }

        fun updateAllWidgets(context: Context) {
            val appWidgetManager = AppWidgetManager.getInstance(context)
            val thisWidget = ComponentName(context, CrmAppWidgetProvider::class.java)
            val allWidgetIds = appWidgetManager.getAppWidgetIds(thisWidget)
            for (widgetId in allWidgetIds) {
                updateAppWidget(context, appWidgetManager, widgetId)
            }
        }

        fun updateAppWidget(
            context: Context,
            appWidgetManager: AppWidgetManager,
            appWidgetId: Int
        ) {
            val views = RemoteViews(context.packageName, R.layout.crm_app_widget)

            // Date format: np. "Śr, 19 Sie"
            val dateFormat = SimpleDateFormat("EEE, d MMM", Locale.forLanguageTag("pl-PL"))
            val todayStr = dateFormat.format(Date()).replaceFirstChar { it.uppercase() }

            views.setTextViewText(R.id.widget_date, todayStr)
            views.setTextViewText(R.id.widget_doctor_name, cachedDoctorName)
            views.setTextViewText(R.id.widget_hospital_name, cachedHospitalName)
            views.setTextViewText(R.id.widget_meeting_time, cachedMeetingTime)
            views.setTextViewText(R.id.widget_stats_summary, cachedStats)
            views.setTextViewText(
                R.id.widget_task_badge,
                if (cachedTasksCount > 0) "$cachedTasksCount zadań" else "Brak zadań"
            )

            // Click PendingIntent -> Opens MainActivity
            val intent = Intent(context, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
                putExtra("EXTRA_TARGET_SCREEN", "dashboard")
            }
            val pendingIntent = PendingIntent.getActivity(
                context,
                0,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.widget_root, pendingIntent)

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}
