import { Meeting, Task } from '../types';

// Klucze pamięci podręcznej powiadomień
const NOTIFIED_MEETINGS_KEY = 'macscrm_notified_meetings';
const NOTIFIED_TASKS_KEY = 'macscrm_notified_tasks';

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermissionStatus(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) {
    alert('Twoja przeglądarka lub urządzenie nie wspiera powiadomień systemowych.');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      sendSystemNotification('Mac\'s CRM Powiadomienia', {
        body: 'Powiadomienia systemowe i przypomnienia o wizytach zostały włączone!',
        tag: 'welcome-notification'
      });
      return true;
    } else if (permission === 'denied') {
      alert('Powiadomienia zostały zablokowane w ustawieniach przeglądarki. Aby je włączyć, przejdź do ustawień witryny w telefonie/przeglądarce.');
      return false;
    }
  } catch (err) {
    console.error('Błąd podczas prośby o uprawnienia powiadomień:', err);
  }
  return false;
}

export function sendSystemNotification(title: string, options?: NotificationOptions) {
  if (!isNotificationSupported() || Notification.permission !== 'granted') return;

  try {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, {
          badge: '/pwa-192.png',
          icon: '/pwa-192.png',
          ...options
        });
      });
    } else {
      new Notification(title, {
        icon: '/pwa-192.png',
        ...options
      });
    }
  } catch (e) {
    console.warn('Nie udało się wyświetlić powiadomienia:', e);
  }
}

function getNotifiedIds(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function markAsNotified(key: string, id: string) {
  const current = getNotifiedIds(key);
  if (!current.includes(id)) {
    current.push(id);
    const trimmed = current.slice(-100);
    localStorage.setItem(key, JSON.stringify(trimmed));
  }
}

export function checkUpcomingReminders(
  meetings: Meeting[],
  tasks: Task[],
  reminderMinutesBefore: number = 15
) {
  if (!isNotificationSupported() || Notification.permission !== 'granted') return;

  const now = new Date();
  const notifiedMeetings = getNotifiedIds(NOTIFIED_MEETINGS_KEY);
  const notifiedTasks = getNotifiedIds(NOTIFIED_TASKS_KEY);

  meetings.forEach(meeting => {
    if (meeting.closed_at) return;
    if (notifiedMeetings.includes(meeting.id)) return;

    const meetingTime = new Date(meeting.meeting_date).getTime();
    const diffMinutes = (meetingTime - now.getTime()) / (1000 * 60);

    if (diffMinutes > 0 && diffMinutes <= reminderMinutesBefore) {
      const roundedMin = Math.round(diffMinutes);
      sendSystemNotification(`Zaplanowana Wizyta (${roundedMin} min)`, {
        body: `${meeting.title}\nCzas: ${new Date(meeting.meeting_date).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}`,
        tag: `meeting-${meeting.id}`
      });
      markAsNotified(NOTIFIED_MEETINGS_KEY, meeting.id);
    }
  });

  tasks.forEach(task => {
    if (task.is_done) return;
    if (notifiedTasks.includes(task.id)) return;

    if (task.due_date) {
      const taskDueDate = new Date(task.due_date);
      const isToday = taskDueDate.toDateString() === now.toDateString();
      const isOverdue = taskDueDate < now;

      if (isToday || isOverdue) {
        sendSystemNotification(isOverdue ? 'Zaległe Zadanie Follow-up' : 'Zadanie do wykonania dzisiaj', {
          body: `${task.description}${task.due_date ? ` (Termin: ${task.due_date})` : ''}`,
          tag: `task-${task.id}`
        });
        markAsNotified(NOTIFIED_TASKS_KEY, task.id);
      }
    }
  });
}
