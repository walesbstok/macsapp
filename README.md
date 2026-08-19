# Mac's CRM (Android)

CRM system for medical representatives to manage relations and visits with doctors, healthcare departments, and hospitals.

## Features
- **User Authentication & Role Switcher**: Full support for Sales Representative, Territory Manager, and Administrator views.
- **Dashboard & KPIs**: Daily agenda, visit completion metrics, sales target indicators, and urgent follow-up notifications.
- **Contacts Management**: Hospitals (with pipeline stages & tiers), departments, and specialized medical practitioners with preference logs.
- **Visits & Reports**: Scheduling visits, creating comprehensive visit reports (products discussed, samples distributed, doctor sentiment, follow-up flags), and manager approval workflows.
- **Interactive Calendar**: Scheduled visits and milestones by date.
- **Task Management**: Follow-up tasks with priority tags, status updates, and linked contact records.
- **Trip & Route Planner**: Multi-stop itinerary planning with sequence numbers, estimated drive time, and mileage calculations.
- **Manager Hub & Rep Tracking**: Team member oversight, activity metrics, and approval queues.
- **Admin & Data Management**: Local Room database management, seed data resets, and JSON backup/restore exports.

## Technology Stack
- **Language**: Kotlin
- **UI Framework**: Jetpack Compose (Material 3)
- **Architecture**: MVVM with Kotlin Coroutines & StateFlow
- **Data Persistence**: Android Room Database with Room KSP compiler
- **Navigation**: Jetpack Compose Navigation
