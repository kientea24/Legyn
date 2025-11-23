import React, { useState } from 'react';
import { CheckCircle2, Circle, Clock, Plus, Edit2, Trash2, Calendar, Target } from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'planned';
  quarter: string;
  initiatives: string[];
}

export function Roadmap() {
  const [milestones, setMilestones] = useState([
    {
      id: '1',
      title: 'Foundation & Community Building',
      description: 'Establish core infrastructure and grow the initial community.',
      status: 'completed',
      quarter: 'Q4 2024',
      initiatives: [
        'Launch Discord server and channels',
        'Define hierarchy structure (Lurker, Member, Core Contributor)',
        'Onboard first 10 Core Contributors',
        'Establish governance framework',
      ],
    },
    {
      id: '2',
      title: 'Operational Systems & Processes',
      description: 'Implement systems for smooth operations and contribution tracking.',
      status: 'in-progress',
      quarter: 'Q1 2025',
      initiatives: [
        'Launch contribution tracking system',
        'Implement member progression framework',
        'Set up regular meeting cadence',
        'Create onboarding documentation',
        'Establish recognition and rewards system',
      ],
    },
    {
      id: '3',
      title: 'First Major Projects',
      description: 'Launch inaugural projects demonstrating Legyn capabilities.',
      status: 'in-progress',
      quarter: 'Q1-Q2 2025',
      initiatives: [
        'Complete Project Alpha (flagship initiative)',
        'Launch community-driven initiatives',
        'Establish external partnerships',
        'Grow to 50+ active Members',
      ],
    },
    {
      id: '4',
      title: 'Scale & Optimization',
      description: 'Optimize processes and scale operations for growth.',
      status: 'planned',
      quarter: 'Q2 2025',
      initiatives: [
        'Implement advanced governance tools',
        'Launch sub-committees for specialized areas',
        'Develop Member training programs',
        'Create public-facing resources',
        'Expand to 100+ Members',
      ],
    },
    {
      id: '5',
      title: 'Ecosystem Expansion',
      description: 'Expand Legyn ecosystem and external influence.',
      status: 'planned',
      quarter: 'Q3 2025',
      initiatives: [
        'Launch Legyn grants program',
        'Establish strategic partnerships',
        'Host first community conference/event',
        'Create educational content series',
        'Launch contributor incubator program',
      ],
    },
    {
      id: '6',
      title: 'Sustainable Growth & Impact',
      description: 'Achieve sustainable operations with measurable impact.',
      status: 'planned',
      quarter: 'Q4 2025',
      initiatives: [
        'Achieve self-sustaining revenue model',
        'Measure and publish impact metrics',
        'Expand to international presence',
        'Launch Legyn 2.0 strategic vision',
        'Establish long-term sustainability fund',
      ],
    },
  ]);

  const [editingId, setEditingId] = useState(null as string | null);

  const statusConfig = {
    completed: {
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-500',
      label: 'Completed',
    },
    'in-progress': {
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-500',
      label: 'In Progress',
    },
    planned: {
      icon: Circle,
      color: 'text-slate-500',
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-300',
      label: 'Planned',
    },
  };

  const deleteMilestone = (id: string) => {
    setMilestones(milestones.filter(m => m.id !== id));
  };

  const updateStatus = (id: string, newStatus: 'completed' | 'in-progress' | 'planned') => {
    setMilestones(milestones.map(m => m.id === id ? { ...m, status: newStatus } : m));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-slate-900">Legyn Roadmap Timeline</h2>
          <p className="text-slate-600 text-sm mt-1">Strategic milestones and initiatives for Legyn growth</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add Milestone
        </button>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Horizontal timeline line */}
        <div className="hidden md:block absolute top-14 left-0 right-0 h-1 bg-gradient-to-r from-green-200 via-blue-200 to-slate-200" />

        <div className="grid md:grid-cols-3 gap-6">
          {milestones.map((milestone, index) => {
            const config = statusConfig[milestone.status];
            const StatusIcon = config.icon;
            const position = index % 3;

            return (
              <div key={milestone.id} className="relative">
                {/* Timeline connector for desktop */}
                <div className="hidden md:block">
                  <div className="flex justify-center mb-2">
                    <div className={`w-12 h-12 rounded-full ${config.bgColor} border-4 ${config.borderColor} flex items-center justify-center shadow-lg z-10 bg-white`}>
                      <StatusIcon className={`w-6 h-6 ${config.color}`} />
                    </div>
                  </div>
                  <div className="h-4 flex justify-center">
                    <div className={`w-1 h-full ${config.borderColor} border-l-2`} />
                  </div>
                </div>

                {/* Card */}
                <div className={`bg-white border-2 ${config.borderColor} rounded-lg p-5 shadow-sm hover:shadow-lg transition-all relative`}>
                  {/* Mobile status icon */}
                  <div className="md:hidden absolute -left-3 top-5">
                    <div className={`w-8 h-8 rounded-full ${config.bgColor} border-2 ${config.borderColor} flex items-center justify-center`}>
                      <StatusIcon className={`w-4 h-4 ${config.color}`} />
                    </div>
                  </div>

                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600 text-sm">{milestone.quarter}</span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setEditingId(editingId === milestone.id ? null : milestone.id)}
                        className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteMilestone(milestone.id)}
                        className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-slate-900 mb-2">{milestone.title}</h3>
                  <p className="text-slate-600 text-sm mb-4">{milestone.description}</p>

                  {/* Status selector */}
                  <div className="flex gap-2 mb-4">
                    {(['completed', 'in-progress', 'planned'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => updateStatus(milestone.id, status)}
                        className={`flex-1 px-2 py-1 rounded text-xs transition-all ${
                          milestone.status === status
                            ? `${statusConfig[status].bgColor} ${statusConfig[status].color} border ${statusConfig[status].borderColor}`
                            : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {statusConfig[status].label}
                      </button>
                    ))}
                  </div>

                  {/* Initiatives */}
                  {editingId === milestone.id ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-700 text-sm">Initiatives:</span>
                      </div>
                      {milestone.initiatives.map((initiative, idx) => (
                        <input
                          key={idx}
                          type="text"
                          value={initiative}
                          className="w-full px-3 py-1 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onChange={(e) => {
                            const newMilestones = milestones.map(m => {
                              if (m.id === milestone.id) {
                                const newInitiatives = [...m.initiatives];
                                newInitiatives[idx] = e.target.value;
                                return { ...m, initiatives: newInitiatives };
                              }
                              return m;
                            });
                            setMilestones(newMilestones);
                          }}
                        />
                      ))}
                      <button className="w-full px-3 py-1 text-sm text-blue-600 border border-blue-200 rounded hover:bg-blue-50 transition-colors">
                        + Add Initiative
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-700 text-sm">Initiatives:</span>
                      </div>
                      <ul className="space-y-1.5">
                        {milestone.initiatives.map((initiative, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-slate-600 text-sm">
                            <span className="w-1 h-1 bg-slate-400 rounded-full mt-2 flex-shrink-0" />
                            <span>{initiative}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span className="text-green-900">Completed</span>
          </div>
          <p className="text-green-700 text-xl">
            {milestones.filter(m => m.status === 'completed').length}
          </p>
        </div>
        <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="text-blue-900">In Progress</span>
          </div>
          <p className="text-blue-700 text-xl">
            {milestones.filter(m => m.status === 'in-progress').length}
          </p>
        </div>
        <div className="bg-slate-50 border-2 border-slate-300 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Circle className="w-5 h-5 text-slate-500" />
            <span className="text-slate-900">Planned</span>
          </div>
          <p className="text-slate-700 text-xl">
            {milestones.filter(m => m.status === 'planned').length}
          </p>
        </div>
      </div>
    </div>
  );
}
