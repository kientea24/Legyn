import React, { useState } from 'react';
import { Plus, Clock, MapPin, Users, Calendar as CalendarIcon } from 'lucide-react';

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

export function MeetingScheduler() {
  const [meetings, setMeetings] = useState([
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
  ]);

  const [filter, setFilter] = useState('all' as 'all' | 'upcoming' | 'completed');

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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-slate-900">Legyn Meeting Scheduler</h2>
          <p className="text-slate-600 text-sm mt-1">Plan and track Legyn meetings and sync sessions</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Schedule Meeting
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {['all', 'upcoming', 'completed'].map((filterOption) => (
          <button
            key={filterOption}
            onClick={() => setFilter(filterOption as typeof filter)}
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
              <span className={`px-3 py-1 rounded-full text-xs capitalize ${
                meeting.status === 'upcoming' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
              }`}>
                {meeting.status}
              </span>
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
    </div>
  );
}