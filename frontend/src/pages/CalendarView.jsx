import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useTaskStore } from '../store/useTaskStore';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, LogOut, Calendar as CalIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, isSameDay } from 'date-fns';

export default function CalendarView() {
  const { tasks, fetchTasks } = useTaskStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    fetchTasks();
  }, []);

  const tasksOnSelectedDay = tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), date));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Custom styling for calendar markers
  const tileContent = ({ date: tileDate, view }) => {
    if (view === 'month') {
      const dayTasks = tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), tileDate));
      if (dayTasks.length > 0) {
        return (
          <div style={{ display: 'flex', gap: '2px', justifyContent: 'center', marginTop: '4px' }}>
            {dayTasks.slice(0, 3).map((t, i) => (
              <div key={i} style={{ 
                width: '6px', 
                height: '6px', 
                borderRadius: '50%', 
                background: t.priority === 'high' ? 'var(--error)' : t.priority === 'medium' ? 'orange' : 'var(--success)' 
              }} />
            ))}
          </div>
        );
      }
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', background: 'var(--bg-primary)' }}>
      {/* Top Nav */}
      <nav className="glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', borderBottom: '1px solid var(--border-primary)', zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
             Tasky Calendar
          </h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => navigate('/')} style={{ background: 'transparent', border: 'none', fontWeight: '600', color: 'var(--text-secondary)' }}>Board</button>
            <button style={{ background: 'transparent', border: 'none', fontWeight: '600', color: 'var(--accent-primary)' }}>Calendar</button>
            <button onClick={() => navigate('/teams')} style={{ background: 'transparent', border: 'none', fontWeight: '600', color: 'var(--text-secondary)' }}>Teams</button>
            {user?.role === 'admin' && <button onClick={() => navigate('/admin')} style={{ background: 'transparent', border: 'none', fontWeight: '600', color: 'var(--text-secondary)' }}>Analytics</button>}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <img src={user?.avatar} alt={user?.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
          <button onClick={handleLogout} style={{ background: 'transparent', border: 'none' }}><LogOut size={20} color="var(--text-secondary)" /></button>
        </div>
      </nav>

      <main style={{ flex: 1, padding: '2.5rem', overflowY: 'auto', display: 'flex', gap: '2.5rem' }}>
        {/* Calendar Section */}
        <div className="glass" style={{ flex: 2, padding: '2rem', borderRadius: 'var(--radius-lg)', position: 'relative' }}>
          <Calendar
            onChange={setDate}
            value={date}
            tileContent={tileContent}
            className="custom-calendar"
          />
          
          <style>{`
            .custom-calendar {
              width: 100% !important;
              background: transparent !important;
              border: none !important;
              color: white !important;
              font-family: inherit !important;
            }
            .react-calendar__tile {
              height: 100px !important;
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
              justify-content: center !important;
              border-radius: 8px !important;
              transition: background 0.2s !important;
              color: white !important;
            }
            .react-calendar__tile:hover {
              background: rgba(255,255,255,0.05) !important;
            }
            .react-calendar__tile--now {
              background: rgba(56, 189, 248, 0.1) !important;
              color: var(--accent-primary) !important;
              font-weight: 800 !important;
            }
            .react-calendar__tile--active {
              background: var(--accent-primary) !important;
              color: black !important;
            }
            .react-calendar__month-view__days__day--neighboringMonth {
              opacity: 0.2 !important;
            }
            .react-calendar__navigation button {
              color: white !important;
              font-size: 1.25rem !important;
              font-weight: 700 !important;
            }
            .react-calendar__navigation button:enabled:hover, 
            .react-calendar__navigation button:enabled:focus {
              background-color: rgba(255,255,255,0.05) !important;
            }
          `}</style>
        </div>

        {/* Selected Date Details */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>{format(date, 'MMMM do')}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{tasksOnSelectedDay.length} tasks scheduled for this day</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {tasksOnSelectedDay.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', border: '1px dashed var(--border-primary)', borderRadius: '12px' }}>
                  <CalIcon size={32} style={{ opacity: 0.1, marginBottom: '0.5rem' }} />
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Nothing scheduled</p>
                </div>
              ) : tasksOnSelectedDay.map(t => (
                <div key={t.id} className="glass" style={{ padding: '1rem', borderLeft: `4px solid ${t.priority === 'high' ? 'var(--error)' : 'orange'}`, borderRadius: '4px' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '4px' }}>{t.title}</h4>
                  <div style={{ display: 'flex', gap: '10px', fontSize: '0.75rem', opacity: 0.7 }}>
                    <span>{t.status}</span>
                    <span>•</span>
                    <span>{t.timeSpent}h</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
