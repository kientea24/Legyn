import React, { useState, useEffect } from 'react';
import { BookOpen, Users, Calendar, MessageSquare, Settings, FileText, ChevronDown, ChevronRight, Plus, X, Save, Edit2, Trash2 } from 'lucide-react';

interface Subsection {
  title: string;
  content: string[];
}

interface Section {
  id: string;
  title: string;
  iconName: string;
  content: string[];
  subsections: Subsection[];
}

const STORAGE_KEY = 'legyn_structure_data';

const iconMap: { [key: string]: any } = {
  Users,
  Calendar,
  MessageSquare,
  Settings,
  BookOpen,
  FileText,
};

const iconOptions = [
  { value: 'Users', label: 'Users' },
  { value: 'Calendar', label: 'Calendar' },
  { value: 'MessageSquare', label: 'Message' },
  { value: 'Settings', label: 'Settings' },
  { value: 'BookOpen', label: 'Book' },
  { value: 'FileText', label: 'Document' },
];

const defaultSections: Section[] = [
  {
    id: '1',
    title: 'Legyn Hierarchy & Progression',
    iconName: 'Users',
    content: [
      'Legyn operates with a merit-based hierarchy: Lurker -> Member -> Core Contributor.',
      'Lurkers are new Discord members who observe and learn before contributing.',
      'Members are invited based on Proof of Work or exceptional talent that adds immediate value.',
      'Core Contributors are the backbone of Legyn, having proven consistent heavy contributions.',
    ],
    subsections: [
      {
        title: 'Progression Path',
        content: [
          'Join Discord as a Lurker and learn about Legyn',
          'Contribute meaningful work to demonstrate value',
          'Get invited to Member status by existing Members/Core Contributors',
          'Continue regular high-quality contributions to become Core Contributor',
        ],
      },
    ],
  },
  {
    id: '2',
    title: 'Meeting Protocols',
    iconName: 'Calendar',
    content: [
      'Core Contributors meet weekly for strategic discussions.',
      'Member syncs occur bi-weekly for updates and coordination.',
      'All Hands meetings are held monthly with the entire Legyn.',
      'All meetings are conducted via Discord voice channels.',
    ],
    subsections: [
      {
        title: 'Meeting Types',
        content: [
          'Core Contributors Strategy: Weekly, decision-making',
          'Member Syncs: Bi-weekly, coordination and updates',
          'All Hands: Monthly, full Legyn participation',
          'Onboarding Sessions: As needed for new Members',
        ],
      },
    ],
  },
  {
    id: '3',
    title: 'Communication Channels',
    iconName: 'MessageSquare',
    content: [
      'Primary communication happens in Discord channels.',
      'Important announcements posted in #announcements channel.',
      'Work coordination in project-specific channels.',
      'Governance discussions in #governance channel.',
    ],
    subsections: [
      {
        title: 'Discord Channel Structure',
        content: [
          '#general: General discussion and community chat',
          '#introductions: New member welcomes',
          '#governance: Legyn decisions and proposals',
          'Project channels: Specific initiative coordination',
          'Voice channels: Meetings and real-time collaboration',
        ],
      },
    ],
  },
  {
    id: '4',
    title: 'Decision-Making Process',
    iconName: 'Settings',
    content: [
      'Core Contributors make strategic decisions for Legyn.',
      'Members have input on operational matters.',
      'Major decisions use proposal and voting system.',
      'Emergency decisions can be made by 3+ Core Contributors.',
    ],
    subsections: [],
  },
  {
    id: '5',
    title: 'Proof of Work & Contributions',
    iconName: 'BookOpen',
    content: [
      'Contributions are tracked and recognized publicly.',
      'Quality and consistency matter more than quantity.',
      'Both Legyn-specific work and relevant external work count.',
      'Exceptions made for exceptional talent with clear value-add.',
    ],
    subsections: [
      {
        title: 'Types of Valuable Contributions',
        content: [
          'Development work: Code, smart contracts, infrastructure',
          'Creative work: Design, content, marketing materials',
          'Community building: Moderation, onboarding, engagement',
          'Strategy & governance: Proposals, research, planning',
        ],
      },
      {
        title: 'Recognition System',
        content: [
          'Contributions logged in #contributions channel',
          'Monthly highlights of exceptional work',
          'Progression to Member/Core Contributor based on body of work',
          'Token rewards for significant contributions (if applicable)',
        ],
      },
    ],
  },
  {
    id: '6',
    title: 'Member Rights & Expectations',
    iconName: 'FileText',
    content: [
      'All Members have voice in Legyn discussions.',
      'Core Contributors have final say on strategic direction.',
      'Lurkers can observe but not vote on decisions.',
      'Inactive Members may be moved back to Lurker status.',
    ],
    subsections: [
      {
        title: 'Member Expectations',
        content: [
          'Active participation in Discord discussions',
          'Regular contributions aligned with Legyn goals',
          'Respect for community culture and values',
          'Help onboard and mentor newer members',
        ],
      },
      {
        title: 'Core Contributor Expectations',
        content: [
          'Weekly participation in strategy sessions',
          'Lead and oversee major Legyn initiatives',
          'Review and approve new Member applications',
          'Long-term commitment to Legyn success',
        ],
      },
    ],
  },
];

export function StructureDocumentation() {
  const loadFromStorage = (): Section[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
    return defaultSections;
  };

  const [sections, setSections] = useState(loadFromStorage);
  const [expandedSections, setExpandedSections] = useState(new Set(['1']));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null as Section | null);
  const [formData, setFormData] = useState({
    title: '',
    iconName: 'Users',
    content: [''],
    subsections: [] as Subsection[],
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sections));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [sections]);

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

  const toggleSection = (id: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSections(newExpanded);
  };

  const handleAddSection = () => {
    setEditingSection(null);
    setFormData({
      title: '',
      iconName: 'Users',
      content: [''],
      subsections: [],
    });
    setIsModalOpen(true);
  };

  const handleEditSection = (section: Section) => {
    setEditingSection(section);
    setFormData({
      title: section.title,
      iconName: section.iconName,
      content: section.content.length > 0 ? [...section.content] : [''],
      subsections: section.subsections.map(s => ({ ...s, content: [...s.content] })),
    });
    setIsModalOpen(true);
  };

  const handleDeleteSection = (id: string) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      setSections(sections.filter((s: Section) => s.id !== id));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSection(null);
    setFormData({
      title: '',
      iconName: 'Users',
      content: [''],
      subsections: [],
    });
  };

  const handleSaveSection = () => {
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }

    const cleanedContent = formData.content.filter(c => c.trim() !== '');
    const cleanedSubsections = formData.subsections
      .filter(s => s.title.trim() !== '')
      .map(s => ({ ...s, content: s.content.filter(c => c.trim() !== '') }));

    if (editingSection) {
      setSections(sections.map((s: Section) =>
        s.id === editingSection.id
          ? { ...s, ...formData, content: cleanedContent, subsections: cleanedSubsections }
          : s
      ));
    } else {
      const newSection: Section = {
        id: Date.now().toString(),
        ...formData,
        content: cleanedContent,
        subsections: cleanedSubsections,
      };
      setSections([...sections, newSection]);
    }

    handleCloseModal();
  };

  const addContentItem = () => {
    setFormData({ ...formData, content: [...formData.content, ''] });
  };

  const removeContentItem = (index: number) => {
    const newContent = formData.content.filter((_, i) => i !== index);
    setFormData({ ...formData, content: newContent.length > 0 ? newContent : [''] });
  };

  const updateContentItem = (index: number, value: string) => {
    const newContent = [...formData.content];
    newContent[index] = value;
    setFormData({ ...formData, content: newContent });
  };

  const addSubsection = () => {
    setFormData({
      ...formData,
      subsections: [...formData.subsections, { title: '', content: [''] }],
    });
  };

  const removeSubsection = (index: number) => {
    setFormData({
      ...formData,
      subsections: formData.subsections.filter((_, i) => i !== index),
    });
  };

  const updateSubsectionTitle = (index: number, value: string) => {
    const newSubsections = [...formData.subsections];
    newSubsections[index] = { ...newSubsections[index], title: value };
    setFormData({ ...formData, subsections: newSubsections });
  };

  const addSubsectionContent = (subIndex: number) => {
    const newSubsections = [...formData.subsections];
    newSubsections[subIndex] = {
      ...newSubsections[subIndex],
      content: [...newSubsections[subIndex].content, ''],
    };
    setFormData({ ...formData, subsections: newSubsections });
  };

  const removeSubsectionContent = (subIndex: number, contentIndex: number) => {
    const newSubsections = [...formData.subsections];
    const newContent = newSubsections[subIndex].content.filter((_, i) => i !== contentIndex);
    newSubsections[subIndex] = {
      ...newSubsections[subIndex],
      content: newContent.length > 0 ? newContent : [''],
    };
    setFormData({ ...formData, subsections: newSubsections });
  };

  const updateSubsectionContent = (subIndex: number, contentIndex: number, value: string) => {
    const newSubsections = [...formData.subsections];
    const newContent = [...newSubsections[subIndex].content];
    newContent[contentIndex] = value;
    newSubsections[subIndex] = { ...newSubsections[subIndex], content: newContent };
    setFormData({ ...formData, subsections: newSubsections });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-slate-900">Legyn Structure Documentation</h2>
          <p className="text-slate-600 text-sm mt-1">Comprehensive guide to Legyn operations, progression, and policies</p>
        </div>
        <button
          onClick={handleAddSection}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Section
        </button>
      </div>

      <div className="space-y-3">
        {sections.map((section: Section) => {
          const isExpanded = expandedSections.has(section.id);
          const Icon = iconMap[section.iconName] || FileText;

          return (
            <div key={section.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
              <div 
                onClick={() => toggleSection(section.id)}
                className="flex items-center hover:bg-slate-50 transition-colors min-h-[72px] cursor-pointer"
              >
                <div className="flex-1 flex items-center gap-3 p-5">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-slate-900">{section.title}</h3>
                </div>
                <div className="flex items-center gap-2 pr-5 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditSection(section);
                    }}
                    className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                    title="Edit section"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSection(section.id);
                    }}
                    className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                    title="Delete section"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="px-5 pb-5 border-t border-slate-100">
                  <div className="mt-4 space-y-3">
                    {section.content.map((item: string, index: number) => (
                      <p key={index} className="text-slate-600 text-sm pl-4 border-l-2 border-blue-200">
                        {item}
                      </p>
                    ))}
                  </div>

                  {section.subsections && section.subsections.length > 0 && (
                    <div className="mt-6 space-y-4">
                      {section.subsections.map((subsection: Subsection, subIndex: number) => (
                        <div key={subIndex} className="bg-slate-50 rounded-lg p-4">
                          <h4 className="text-slate-900 mb-3">{subsection.title}</h4>
                          <ul className="space-y-2">
                            {subsection.content.map((item: string, itemIndex: number) => (
                              <li key={itemIndex} className="text-slate-600 text-sm pl-6 relative">
                                <span className="absolute left-0 top-2 w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
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
              maxWidth: '40rem',
              padding: '0 1rem',
              boxSizing: 'border-box',
            }}
            className="animate-scale-in"
          >
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '1.5rem', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>
                  {editingSection ? 'Edit Section' : 'Add New Section'}
                </h3>
                <button onClick={handleCloseModal} style={{ padding: '0.5rem', borderRadius: '0.5rem', border: 'none', backgroundColor: 'transparent', color: '#94a3b8', cursor: 'pointer' }}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.5rem' }}>
                      Title <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '1rem', boxSizing: 'border-box' }}
                      placeholder="Section title"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.5rem' }}>Icon</label>
                    <select
                      value={formData.iconName}
                      onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '1rem', backgroundColor: 'white', boxSizing: 'border-box' }}
                    >
                      {iconOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.5rem' }}>Content Points</label>
                  {formData.content.map((item, index) => (
                    <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateContentItem(index, e.target.value)}
                        style={{ flex: 1, padding: '0.5rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.875rem', boxSizing: 'border-box' }}
                        placeholder="Enter content point"
                      />
                      <button
                        type="button"
                        onClick={() => removeContentItem(index)}
                        style={{ padding: '0.5rem', border: '1px solid #fca5a5', borderRadius: '0.5rem', backgroundColor: '#fef2f2', color: '#dc2626', cursor: 'pointer' }}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addContentItem}
                    style={{ padding: '0.5rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', backgroundColor: '#f8fafc', color: '#334155', cursor: 'pointer', fontSize: '0.875rem' }}
                  >
                    + Add Content Point
                  </button>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155' }}>Subsections</label>
                    <button
                      type="button"
                      onClick={addSubsection}
                      style={{ padding: '0.25rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', backgroundColor: '#f8fafc', color: '#334155', cursor: 'pointer', fontSize: '0.75rem' }}
                    >
                      + Add Subsection
                    </button>
                  </div>
                  {formData.subsections.map((sub, subIndex) => (
                    <div key={subIndex} style={{ backgroundColor: '#f8fafc', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <input
                          type="text"
                          value={sub.title}
                          onChange={(e) => updateSubsectionTitle(subIndex, e.target.value)}
                          style={{ flex: 1, padding: '0.5rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.875rem', boxSizing: 'border-box' }}
                          placeholder="Subsection title"
                        />
                        <button
                          type="button"
                          onClick={() => removeSubsection(subIndex)}
                          style={{ padding: '0.5rem', border: '1px solid #fca5a5', borderRadius: '0.5rem', backgroundColor: '#fef2f2', color: '#dc2626', cursor: 'pointer' }}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      {sub.content.map((item, contentIndex) => (
                        <div key={contentIndex} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem', marginLeft: '1rem' }}>
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => updateSubsectionContent(subIndex, contentIndex, e.target.value)}
                            style={{ flex: 1, padding: '0.375rem 0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.75rem', boxSizing: 'border-box' }}
                            placeholder="Content item"
                          />
                          <button
                            type="button"
                            onClick={() => removeSubsectionContent(subIndex, contentIndex)}
                            style={{ padding: '0.25rem', border: '1px solid #fca5a5', borderRadius: '0.375rem', backgroundColor: '#fef2f2', color: '#dc2626', cursor: 'pointer' }}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addSubsectionContent(subIndex)}
                        style={{ marginLeft: '1rem', marginTop: '0.25rem', padding: '0.25rem 0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem', backgroundColor: 'white', color: '#64748b', cursor: 'pointer', fontSize: '0.75rem' }}
                      >
                        + Add Item
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                <button
                  onClick={handleSaveSection}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem 1rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: 500, cursor: 'pointer' }}
                >
                  <Save className="w-4 h-4" />
                  {editingSection ? 'Save Changes' : 'Add Section'}
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
