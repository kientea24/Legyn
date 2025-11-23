import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Clock, Plus, X, Save, Calendar, Target } from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'planned';
  quarter: string;
  initiatives: string[];
}

const STORAGE_KEY = 'legyn_roadmap_data';

const defaultMilestones: Milestone[] = [
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
];

export function Roadmap() {
  const loadFromStorage = (): Milestone[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
    return defaultMilestones;
  };

  const [milestones, setMilestones] = useState(loadFromStorage);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null as Milestone | null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'planned' as Milestone['status'],
    quarter: '',
    initiatives: [''],
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(milestones));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [milestones]);

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

  const handleAddMilestone = () => {
    setEditingMilestone(null);
    setFormData({
      title: '',
      description: '',
      status: 'planned',
      quarter: '',
      initiatives: [''],
    });
    setIsModalOpen(true);
  };

  const handleEditMilestone = (milestone: Milestone) => {
    setEditingMilestone(milestone);
    setFormData({
      title: milestone.title,
      description: milestone.description,
      status: milestone.status,
      quarter: milestone.quarter,
      initiatives: milestone.initiatives.length > 0 ? [...milestone.initiatives] : [''],
    });
    setIsModalOpen(true);
  };

  const handleDeleteMilestone = (id: string) => {
    if (window.confirm('Are you sure you want to delete this milestone?')) {
      setMilestones(milestones.filter((m: Milestone) => m.id !== id));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMilestone(null);
    setFormData({
      title: '',
      description: '',
      status: 'planned',
      quarter: '',
      initiatives: [''],
    });
  };

  const handleSaveMilestone = () => {
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }

    const cleanedInitiatives = formData.initiatives.filter(i => i.trim() !== '');

    if (editingMilestone) {
      setMilestones(milestones.map((m: Milestone) =>
        m.id === editingMilestone.id
          ? { ...m, ...formData, initiatives: cleanedInitiatives }
          : m
      ));
    } else {
      const newMilestone: Milestone = {
        id: Date.now().toString(),
        ...formData,
        initiatives: cleanedInitiatives,
      };
      setMilestones([...milestones, newMilestone]);
    }

    handleCloseModal();
  };

  const updateStatus = (id: string, newStatus: Milestone['status']) => {
    setMilestones(milestones.map((m: Milestone) =>
      m.id === id ? { ...m, status: newStatus } : m
    ));
  };

  const addInitiative = () => {
    setFormData({ ...formData, initiatives: [...formData.initiatives, ''] });
  };

  const removeInitiative = (index: number) => {
    const newInitiatives = formData.initiatives.filter((_, i) => i !== index);
    setFormData({ ...formData, initiatives: newInitiatives.length > 0 ? newInitiatives : [''] });
  };

  const updateInitiative = (index: number, value: string) => {
    const newInitiatives = [...formData.initiatives];
    newInitiatives[index] = value;
    setFormData({ ...formData, initiatives: newInitiatives });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-slate-900">Legyn Roadmap Timeline</h2>
          <p className="text-slate-600 text-sm mt-1">Strategic milestones and initiatives for Legyn growth</p>
        </div>
        <button
          onClick={handleAddMilestone}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Milestone
        </button>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="hidden md:block absolute top-14 left-0 right-0 h-1 bg-gradient-to-r from-green-200 via-blue-200 to-slate-200" />

        <div className="grid md:grid-cols-3 gap-6">
          {milestones.map((milestone: Milestone) => {
            const config = statusConfig[milestone.status];
            const StatusIcon = config.icon;

            return (
              <div key={milestone.id} className="relative">
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

                <div className={`bg-white border-2 ${config.borderColor} rounded-lg p-5 shadow-sm hover:shadow-lg transition-all relative`}>
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
                    <button
                      onClick={() => handleEditMilestone(milestone)}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      Edit
                    </button>
                  </div>

                  <h3 className="text-slate-900 mb-2">{milestone.title}</h3>
                  <p className="text-slate-600 text-sm mb-4">{milestone.description}</p>

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

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-700 text-sm">Initiatives:</span>
                    </div>
                    <ul className="space-y-1.5">
                      {milestone.initiatives.map((initiative: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-600 text-sm">
                          <span className="w-1 h-1 bg-slate-400 rounded-full mt-2 flex-shrink-0" />
                          <span>{initiative}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleDeleteMilestone(milestone.id)}
                    className="mt-4 text-xs text-red-500 hover:text-red-600"
                  >
                    Delete
                  </button>
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
            {milestones.filter((m: Milestone) => m.status === 'completed').length}
          </p>
        </div>
        <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="text-blue-900">In Progress</span>
          </div>
          <p className="text-blue-700 text-xl">
            {milestones.filter((m: Milestone) => m.status === 'in-progress').length}
          </p>
        </div>
        <div className="bg-slate-50 border-2 border-slate-300 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Circle className="w-5 h-5 text-slate-500" />
            <span className="text-slate-900">Planned</span>
          </div>
          <p className="text-slate-700 text-xl">
            {milestones.filter((m: Milestone) => m.status === 'planned').length}
          </p>
        </div>
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
                  {editingMilestone ? 'Edit Milestone' : 'Add New Milestone'}
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
                    placeholder="Milestone title"
                    autoFocus
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.5rem' }}>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '1rem', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }}
                    placeholder="Milestone description"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.5rem' }}>Quarter</label>
                    <input
                      type="text"
                      value={formData.quarter}
                      onChange={(e) => setFormData({ ...formData, quarter: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '1rem', boxSizing: 'border-box' }}
                      placeholder="e.g., Q1 2025"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.5rem' }}>Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as Milestone['status'] })}
                      style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '1rem', backgroundColor: 'white', boxSizing: 'border-box' }}
                    >
                      <option value="planned">Planned</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.5rem' }}>Initiatives</label>
                  {formData.initiatives.map((initiative, index) => (
                    <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <input
                        type="text"
                        value={initiative}
                        onChange={(e) => updateInitiative(index, e.target.value)}
                        style={{ flex: 1, padding: '0.5rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.875rem', boxSizing: 'border-box' }}
                        placeholder="Enter initiative"
                      />
                      <button
                        type="button"
                        onClick={() => removeInitiative(index)}
                        style={{ padding: '0.5rem', border: '1px solid #fca5a5', borderRadius: '0.5rem', backgroundColor: '#fef2f2', color: '#dc2626', cursor: 'pointer' }}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addInitiative}
                    style={{ padding: '0.5rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', backgroundColor: '#f8fafc', color: '#334155', cursor: 'pointer', fontSize: '0.875rem' }}
                  >
                    + Add Initiative
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                <button
                  onClick={handleSaveMilestone}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem 1rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: 500, cursor: 'pointer' }}
                >
                  <Save className="w-4 h-4" />
                  {editingMilestone ? 'Save Changes' : 'Add Milestone'}
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
