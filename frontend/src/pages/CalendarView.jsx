import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useTaskStore } from '../store/useTaskStore';
import { Calendar as CalIcon } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import AppLayout from '../components/layout/AppLayout';
import Navbar from '../components/layout/Navbar';
import './CalendarView.css';

export default function CalendarView() {
  const { tasks, fetchTasks } = useTaskStore();
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const abort = new AbortController();
    fetchTasks(abort.signal);
    return () => abort.abort();
  }, [fetchTasks]);

  const tasksOnSelectedDay = tasks.filter((t) =>
    t.dueDate && isSameDay(new Date(t.dueDate), date)
  );

  const tileContent = ({ date: tileDate, view }) => {
    if (view === 'month') {
      const dayTasks = tasks.filter(
        (t) => t.dueDate && isSameDay(new Date(t.dueDate), tileDate)
      );
      if (dayTasks.length > 0) {
        return (
          <div className="calendar-dots">
            {dayTasks.slice(0, 3).map((t, i) => (
              <div
                key={i}
                className="calendar-dot"
                style={{
                  background:
                    t.priority === 'high'
                      ? 'var(--error)'
                      : t.priority === 'medium'
                      ? 'orange'
                      : 'var(--success)',
                }}
              />
            ))}
          </div>
        );
      }
    }
  };

  return (
    <AppLayout navbar={<Navbar />}>
      <div className="calendar-content">
        <div className="calendar-section glass">
          <Calendar
            onChange={setDate}
            value={date}
            tileContent={tileContent}
            className="custom-calendar"
          />
        </div>

        <div className="calendar-details">
          <div className="calendar-day-detail glass">
            <h3>{format(date, "dd 'de' MMMM")}</h3>
            <p className="day-task-count">
              {tasksOnSelectedDay.length} tarefa
              {tasksOnSelectedDay.length !== 1 ? 's' : ''} agendada{tasksOnSelectedDay.length !== 1 ? 's' : ''}
            </p>

            <div className="day-tasks">
              {tasksOnSelectedDay.length === 0 ? (
                <div className="empty-calendar-day">
                  <CalIcon size={32} />
                  <p>Nada agendado</p>
                </div>
              ) : (
                tasksOnSelectedDay.map((t) => (
                  <div
                    key={t.id}
                    className="day-task-item"
                    style={{
                      borderLeftColor:
                        t.priority === 'high'
                          ? 'var(--error)'
                          : 'orange',
                    }}
                  >
                    <h4>{t.title}</h4>
                    <div className="day-task-meta">
                      <span>{t.status}</span>
                      <span>&bull;</span>
                      <span>{t.timeSpent}h</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
