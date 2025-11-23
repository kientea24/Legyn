import React, { useState, useEffect } from 'react';
import { Plus, Clock, MapPin, Users, Calendar as CalendarIcon, X, Save, Edit2, Trash2 } from 'lucide-react';

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  type: 'board' | 'committee' | 'general' | 'special';
  status: 'upcoming' | 'completed' | 'cancelled';
}

const STORAGE_KEY = 'legyn_meetings_data';

const defaultMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Core Contributors Strategy Session',
    date: '2025-11-28',
    time: '18:00',
    location: 'Discord - Strategy Voice Channel',
    attendees: 7,
    type: 'board',
    status: 'upcoming',
  },
  {
    id: '2',
    title: 'Member Sync & Updates',
    date: '2025-11-25',
    time: '19:00',
    location: 'Discord - General Voice Channel',
    attendees: 18,
    type: 'committee',
    status: 'upcoming',
  },
  {
    id: '3',
    title: 'All Hands Legyn Meeting',
    date: '2025-12-05',
    time: '17:30',
    location: 'Discord - Town Hall Voice Channel',
    attendees: 45,
    type: 'general',
    status: 'upcoming',
  },
  {
    id: '4',
    title: 'New Member Onboarding',
    date: '2025-11-15',
    time: '18:00',
    location: 'Discord - Onboarding Voice Channel',
    attendees: 12,
    type: 'special',
    status: 'completed',
  },
];

export function MeetingScheduler() {
  const loadFromStorage = (): Meeting[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
    return defaultMeetings;
  };

  const [meetings, setMeetings] = useState(loadFromStorage);
  const [filter, setFilter] = useState('all' as 'all' | 'upcoming' | 'completed');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null as Meeting | null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    attendees: 0,
    type: 'general' as Meeting['type'],
    status: 'upcoming' as Meeting['status'],
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(meetings));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [meetings]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  const typeColors = {
    board: 'bg-purple-100 text-purple-700',
    committee: 'bg-blue-100 text-blue-700',
    general: 'bg-green-100 text-green-700',
    special: 'bg-amber-100 text-amber-700',
  };

  const statusColors = {
    upcoming: 'border-l-blue-500',
    completed: 'border-l-slate-400',
    cancelled: 'border-l-red-500',
  };

  const filteredMeetings = meetings.filter(meeting =>
    filter === 'all' ? true : meeting.status === filter
  );

  const handleAddMeeting = () => {
    setEditingMeeting(null);
    setFormData({
      title: '',
      date: '',
      time: '',
      location: '',
      attendees: 0,
      type: 'general',
      status: 'upcoming',
    });
    setIsModalOpen(true);
  };

  const handleEditMeeting = (meeting: Meeting) => {
    setEditingMeeting(meeting);
    setFormData({
      title: meeting.title,
      date: meeting.date,
      time: meeting.time,
      location: meeting.location,
      attendees: meeting.attendees,
      type: meeting.type,
      status: meeting.status,
    });
    setIsModalOpen(true);
  };

  const handleDeleteMeeting = (id: string) => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      setMeetings(meetings.filter(m => m.id !== id));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMeeting(null);
    setFormData({
      title: '',
      date: '',
      time: '',
      location: '',
      attendees: 0,
      type: 'general',
      status: 'upcoming',
    });
  };

  const handleSaveMeeting = () => {
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }

    if (editingMeeting) {
      setMeetings(meetings.map(m =>
        m.id === editingMeeting.id
          ? { ...m, ...formData }
          : m
      ));
    } else {
      const newMeeting: Meeting = {
        id: Date.now().toString(),
        ...formData,
      };
      setMeetings([...meetings, newMeeting]);
    }

    handleCloseModal();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-slate-900">Legyn Meeting Scheduler</h2>
          <p className="text-slate-600 text-sm mt-1">Plan and track Legyn meetings and sync sessions</p>
        </div>
        <button
          onClick={handleAddMeeting}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Schedule Meeting
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {(['all', 'upcoming', 'completed'] as const).map((filterOption) => (
          <button
            key={filterOption}
            onClick={() => setFilter(filterOption)}
            className={`px-4 py-2 rounded-lg capitalize transition-colors ${
              filter === filterOption
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {filterOption}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredMeetings.map((meeting) => (
          <div
            key={meeting.id}
            className={`bg-white border-l-4 ${statusColors[meeting.status]} rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-slate-900">{meeting.title}</h3>
                <span className={`inline-block mt-2 px-2 py-1 rounded text-xs ${typeColors[meeting.type]} capitalize`}>
                  {meeting.type} Meeting
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs capitalize ${
                  meeting.status === 'upcoming' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {meeting.status}
                </span>
                <button
                  onClick={() => handleEditMeeting(meeting)}
                  className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                  title="Edit meeting"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteMeeting(meeting.id)}
                  className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                  title="Delete meeting"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="flex items-center gap-2 text-slate-600 text-sm">
                <CalendarIcon className="w-4 h-4" />
                <span>{new Date(meeting.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 text-sm">
                <Clock className="w-4 h-4" />
                <span>{meeting.time}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 text-sm">
                <MapPin className="w-4 h-4" />
                <span>{meeting.location}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 text-sm">
                <Users className="w-4 h-4" />
                <span>{meeting.attendees} attendees</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Modal */}
      {isModalOpen && (
        <>
          <div
            onClick={handleCloseModal}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              zIndex: 9998,
            }}
            className="animate-fade-in"
          />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 9999,
              width: '100%',
              maxWidth: '32rem',
              padding: '0 1rem',
              boxSizing: 'border-box',
            }}
            className="animate-scale-in"
          >
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '1.5rem', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>
                  {editingMeeting ? 'Edit Meeting' : 'Schedule New Meeting'}
                </h3>
                <button onClick={handleCloseModal} style={{ padding: '0.5rem', borderRadius: '0.5rem', border: 'none', backgroundColor: 'transparent', color: '#94a3b8', cursor: 'pointer' }}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.5rem' }}>
                    Title <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '1rem', boxSizing: 'border-box' }}
                    placeholder="Meeting title"
                    autoFocus
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.5rem' }}>Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '1rem', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.5rem' }}>Time</label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '1rem', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.5rem' }}>Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '1rem', boxSizing: 'border-box' }}
                    placeholder="e.g., Discord - Voice Channel"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.5rem' }}>Expected Attendees</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={formData.attendees}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      setFormData({ ...formData, attendees: value === '' ? 0 : Number(value) });
                    }}
                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '1rem', boxSizing: 'border-box' }}
                    placeholder="0"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.5rem' }}>Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as Meeting['type'] })}
                      style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '1rem', backgroundColor: 'white', boxSizing: 'border-box' }}
                    >
                      <option value="board">Board</option>
                      <option value="committee">Committee</option>
                      <option value="general">General</option>
                      <option value="special">Special</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.5rem' }}>Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as Meeting['status'] })}
                      style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '1rem', backgroundColor: 'white', boxSizing: 'border-box' }}
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                <button
                  onClick={handleSaveMeeting}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem 1rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: 500, cursor: 'pointer' }}
                >
                  <Save className="w-4 h-4" />
                  {editingMeeting ? 'Save Changes' : 'Schedule Meeting'}
                </button>
                <button
                  onClick={handleCloseModal}
                  style={{ padding: '0.75rem 1.5rem', backgroundColor: 'white', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: 500, cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
