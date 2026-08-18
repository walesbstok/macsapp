import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Building2, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Trash2,
  Layers
} from 'lucide-react';
import { Hospital, Department, Doctor, Meeting, UserRole } from '../types';
import { getMeetingStatus } from '../db';

interface CalendarViewProps {
  key?: React.Key;
  meetings: Meeting[];
  hospitals: Hospital[];
  departments?: Department[];
  doctors: Doctor[];
  onNavigateToMeeting: (meetingId: string) => void;
  onDeleteMeeting?: (id: string) => void;
  currentRole: UserRole;
}

export default function CalendarView({
  meetings,
  hospitals,
  departments = [],
  doctors,
  onNavigateToMeeting,
  onDeleteMeeting,
  currentRole
}: CalendarViewProps) {

  const now = new Date();
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(now.getMonth()); // 0-11
  const [selectedDay, setSelectedDay] = useState<number | null>(now.getDate());

  // Nazwy miesięcy i dni tygodnia po angielsku
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  // Przechodzenie do poprzedniego / następnego miesiąca
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDay(null); // Odznacz dzień po zmianie miesiąca
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDay(null);
  };

  // Kalkulacja liczby dni w wybranym miesiącu
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Kalkulacja pierwszego dnia tygodnia (0 - niedziela, 1 - poniedziałek, itd.)
  // Chcemy przekształcić, aby poniedziałek był 0, a niedziela 6.
  const firstDayIndexRaw = new Date(currentYear, currentMonth, 1).getDay();
  const firstDayIndex = firstDayIndexRaw === 0 ? 6 : firstDayIndexRaw - 1;

  // Tworzymy tablicę kafelków kalendarza
  const calendarCells: (number | null)[] = [];
  
  // Puste kafelki z poprzedniego miesiąca
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(null);
  }
  
  // Kafelki dni wybranego miesiąca
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push(i);
  }

  // Pobranie spotkań dla danego dnia (posortowane od najwcześniejszej godziny)
  const getMeetingsForDate = (dayNum: number) => {
    return meetings
      .filter(meet => {
        const d = new Date(meet.meeting_date);
        return (
          d.getFullYear() === currentYear &&
          d.getMonth() === currentMonth &&
          d.getDate() === dayNum
        );
      })
      .sort((a, b) => new Date(a.meeting_date).getTime() - new Date(b.meeting_date).getTime());
  };

  // Pobranie statusu kolorystycznego dla kropki na kalendarzu
  const getDayIndicatorColors = (dayNum: number) => {
    const dayMeetings = getMeetingsForDate(dayNum);
    const indicators = {
      scheduled: false,
      toCloseOrOverdue: false,
      closed: false
    };

    dayMeetings.forEach(m => {
      const status = getMeetingStatus(m);
      if (status === 'scheduled') indicators.scheduled = true;
      if (status === 'to_close' || status === 'overdue') indicators.toCloseOrOverdue = true;
      if (status === 'closed') indicators.closed = true;
    });

    return indicators;
  };

  // Wybrane spotkania w wybranym dniu
  const selectedDayMeetings = selectedDay ? getMeetingsForDate(selectedDay) : [];

  const getHospitalName = (id: string) => hospitals.find(h => h.id === id)?.name || 'Nieznany szpital';
  const getDepartmentName = (meet: Meeting) => {
    if (meet.department_id) {
      const dept = departments.find(d => d.id === meet.department_id);
      if (dept) return dept.name;
    }
    const docId = meet.doctor_id || (meet.doctor_ids && meet.doctor_ids[0]);
    if (docId) {
      const doc = doctors.find(d => d.id === docId);
      if (doc?.department_id) {
        const dept = departments.find(d => d.id === doc.department_id);
        if (dept) return dept.name;
      }
    }
    return null;
  };
  const getDoctorLabel = (id: string | null) => {
    if (!id) return 'No doctor';
    const doc = doctors.find(d => d.id === id);
    return doc ? `${doc.title} ${doc.first_name} ${doc.last_name}` : 'Unknown doctor';
  };

  const getStatusLabelText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Scheduled';
      case 'to_close': return 'To close';
      case 'overdue': return 'Overdue';
      case 'closed': return 'Closed';
      default: return '';
    }
  };

  return (
    <div className="animate-fade-in p-6 space-y-6">
      
      {/* NAGŁÓWEK */}
      <div>
        <h2 className="font-display font-bold text-3xl text-slate-900 tracking-tight">Meetings Calendar</h2>
        <p className="text-slate-500 mt-1">Browse the meeting schedule in a monthly view and monitor your plan.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEWA STRONA: KALENDARZ (Col: 7) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          
          {/* Kontrolki zmiany miesiąca */}
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-xl text-slate-900 tracking-tight flex items-center gap-2">
              <Calendar size={20} className="text-blue-600 animate-pulse" />
              {monthNames[currentMonth]} {currentYear}
            </h3>
            
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/55">
              <button
                id="btn-prev-month"
                onClick={handlePrevMonth}
                className="p-2 hover:bg-white hover:text-slate-900 text-slate-500 rounded-lg transition-all"
                title="Previous month"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                id="btn-next-month"
                onClick={handleNextMonth}
                className="p-2 hover:bg-white hover:text-slate-900 text-slate-500 rounded-lg transition-all"
                title="Next month"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Siatka kalendarza */}
          <div className="space-y-2">
            
            {/* Nazwy dni */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 uppercase tracking-wider py-2">
              {dayNames.map(day => (
                <div key={day}>{day}</div>
              ))}
            </div>

            {/* Dni miesiąca */}
            <div className="grid grid-cols-7 gap-1.5">
              {calendarCells.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="aspect-square bg-slate-50/40 rounded-xl" />;
                }

                const isSelected = selectedDay === day;
                const isToday = 
                  now.getFullYear() === currentYear &&
                  now.getMonth() === currentMonth &&
                  now.getDate() === day;
                
                const indicators = getDayIndicatorColors(day);
                const dayMeetingsCount = getMeetingsForDate(day).length;

                return (
                  <button
                    id={`calendar-day-${day}`}
                    key={`day-${day}`}
                    onClick={() => setSelectedDay(day)}
                    className={`aspect-square rounded-xl p-1.5 flex flex-col justify-between transition-all relative border ${
                      isSelected 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/10 scale-[1.03] z-10' 
                        : isToday
                          ? 'bg-blue-50 text-blue-900 border-blue-200 font-bold'
                          : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200/40 text-slate-800 hover:border-slate-300'
                    }`}
                  >
                    {/* Numer dnia */}
                    <span className="text-xs font-semibold leading-none">{day}</span>

                    {/* Sygnalizatory statusu spotkań */}
                    {dayMeetingsCount > 0 && (
                      <div className="flex items-center justify-center gap-1 w-full mt-auto pb-0.5">
                        {indicators.toCloseOrOverdue && (
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" title="Overdue meeting / requires attention" />
                        )}
                        {indicators.scheduled && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Scheduled meeting" />
                        )}
                        {indicators.closed && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Closed meeting" />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legenda */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-4 text-xs font-medium text-slate-500 justify-center">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Scheduled</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Overdue / To close</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Closed</span>
          </div>

        </div>

        {/* PRAWA STRONA: LISTA WIZYT W WYBRANYM DNIU (Col: 5) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-display font-bold text-lg text-slate-900">
              {selectedDay 
                ? `Plan for: ${selectedDay.toString().padStart(2, '0')}-${(currentMonth+1).toString().padStart(2, '0')}-${currentYear}` 
                : 'Select a day from the calendar'}
            </h3>
            <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-wider">Meetings on this day ({selectedDayMeetings.length})</p>
          </div>

          <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
            {!selectedDay ? (
              <p className="text-xs text-slate-400 italic text-center py-12">Select a day on the calendar grid to display the schedule.</p>
            ) : selectedDayMeetings.length === 0 ? (
              <div className="text-center py-16 space-y-2">
                <span className="text-2xl">🍃</span>
                <p className="text-xs font-bold text-slate-800">No meetings scheduled</p>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">A free day or no field visits scheduled for this date.</p>
              </div>
            ) : (
              selectedDayMeetings.map(meet => {
                const status = getMeetingStatus(meet);
                const isClosed = status === 'closed';
                const isOverdue = status === 'overdue' || status === 'to_close';
                return (
                  <div
                    key={meet.id}
                    onClick={() => onNavigateToMeeting(meet.id)}
                    className={`p-4 border rounded-xl hover:shadow-md cursor-pointer transition-all space-y-3 ${
                      isClosed 
                        ? 'border-emerald-100 bg-emerald-50/10' 
                        : isOverdue 
                          ? 'border-red-200 bg-red-50/10 hover:border-red-300' 
                          : 'border-slate-100 bg-slate-50/40 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <span className={`text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border font-bold ${
                        isClosed ? 'text-emerald-700 border-emerald-200' : isOverdue ? 'text-red-700 border-red-200' : 'text-amber-700 border-amber-200'
                      }`}>
                        {new Date(meet.meeting_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </span>

                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isClosed ? 'bg-emerald-100 text-emerald-800' : isOverdue ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {getStatusLabelText(status)}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-sm break-words whitespace-normal leading-snug">{meet.title}</h4>
                      
                      <div className="space-y-1 mt-2 text-[11px] text-slate-500 font-medium">
                        <p className="flex items-start gap-1.5 min-w-0">
                          <Building2 size={12} className="text-slate-400 shrink-0 mt-0.5" />
                          <span className="break-words whitespace-normal leading-tight">{getHospitalName(meet.hospital_id)}</span>
                        </p>
                        {getDepartmentName(meet) && (
                          <p className="flex items-start gap-1.5 min-w-0">
                            <Layers size={12} className="text-slate-400 shrink-0 mt-0.5" />
                            <span className="break-words whitespace-normal leading-tight text-slate-700 font-medium">Oddział: {getDepartmentName(meet)}</span>
                          </p>
                        )}
                        <p className="flex items-start gap-1.5 min-w-0">
                          <Users size={12} className="text-slate-400 shrink-0 mt-0.5" />
                          <span className="break-words whitespace-normal leading-tight">{getDoctorLabel(meet.doctor_id)}</span>
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100/60 flex items-center justify-between text-[10px] font-semibold">
                      <span className="text-blue-600 hover:underline">Szczegóły wizyty →</span>
                      {onDeleteMeeting && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Czy na pewno chcesz usunąć wizytę: "${meet.title}"?`)) {
                              onDeleteMeeting(meet.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Usuń wizytę"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
