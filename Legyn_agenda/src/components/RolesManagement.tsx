import React, { useState, useEffect } from 'react';
import { Plus, Users, Award, CheckCircle2, X, Save, Edit2, Trash2 } from 'lucide-react';

interface Role {
  id: string;
  title: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  currentHolders: number;
  maxHolders: number;
}

const STORAGE_KEY = 'legyn_roles_data';

const defaultRoles: Role[] = [
  {
    id: '1',
    title: 'Lurker',
    description: 'New Discord members who have just joined and not yet contributed anything of value to Legyn.',
    responsibilities: [
      'Observe and learn about Legyn',
      'Participate in Discord discussions',
      'Identify areas where you can contribute',
      'Build understanding of Legyn culture and values',
    ],
    requirements: [
      'Joined the Discord server',
      'Read and agree to community guidelines',
      'Introduce yourself in the welcome channel',
    ],
    currentHolders: 24,
    maxHolders: 999,
  },
  {
    id: '2',
    title: 'Member',
    description: 'Contributors invited to join Legyn based on Proof of Work. Heavily weighted towards those who have done work for Legyn, with exceptions for highly talented individuals who will add immediate value.',
    responsibilities: [
      'Actively contribute to Legyn initiatives',
      'Participate in governance discussions',
      'Complete assigned tasks and deliverables',
      'Mentor lurkers and help onboard new members',
      'Attend regular Legyn meetings',
    ],
    requirements: [
      'Demonstrated Proof of Work for Legyn',
      'OR exceptional skills/talent with clear immediate value',
      'Invitation and approval from existing Members',
      'Commitment to regular participation',
    ],
    currentHolders: 18,
    maxHolders: 50,
  },
  {
    id: '3',
    title: 'Core Contributor',
    description: 'Those who have contributed heavily to Legyn and continue to do so regularly. The backbone of Legyn\'s operations and decision-making.',
    responsibilities: [
      'Lead major Legyn initiatives and projects',
      'Make strategic decisions for Legyn',
      'Review and approve new Member applications',
      'Mentor Members and guide their contributions',
      'Represent Legyn in external partnerships',
      'Drive the long-term vision and direction',
    ],
    requirements: [
      'Consistent, high-quality contributions over extended period',
      'Proven commitment to Legyn success',
      'Strong understanding of Legyn operations',
      'Recognition from existing Core Contributors',
      'Available for regular strategic discussions',
    ],
    currentHolders: 7,
    maxHolders: 15,
  },
];

export function RolesManagement() {
  const loadFromStorage = (): Role[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
    return defaultRoles;
  };

  const [roles, setRoles] = useState(loadFromStorage);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null as Role | null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    responsibilities: [''],
    requirements: [''],
    currentHolders: 0,
    maxHolders: 0,
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(roles));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [roles]);

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

  const handleAddRole = () => {
    setEditingRole(null);
    setFormData({
      title: '',
      description: '',
      responsibilities: [''],
      requirements: [''],
      currentHolders: 0,
      maxHolders: 0,
    });
    setIsModalOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setFormData({
      title: role.title,
      description: role.description,
      responsibilities: role.responsibilities.length > 0 ? [...role.responsibilities] : [''],
      requirements: role.requirements.length > 0 ? [...role.requirements] : [''],
      currentHolders: role.currentHolders,
      maxHolders: role.maxHolders,
    });
    setIsModalOpen(true);
  };

  const handleDeleteRole = (id: string) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      setRoles(roles.filter((r: Role) => r.id !== id));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRole(null);
    setFormData({
      title: '',
      description: '',
      responsibilities: [''],
      requirements: [''],
      currentHolders: 0,
      maxHolders: 0,
    });
  };

  const handleSaveRole = () => {
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }

    const cleanedResponsibilities = formData.responsibilities.filter(r => r.trim() !== '');
    const cleanedRequirements = formData.requirements.filter(r => r.trim() !== '');

    if (editingRole) {
      setRoles(roles.map((r: Role) =>
        r.id === editingRole.id
          ? { ...r, ...formData, responsibilities: cleanedResponsibilities, requirements: cleanedRequirements }
          : r
      ));
    } else {
      const newRole: Role = {
        id: Date.now().toString(),
        ...formData,
        responsibilities: cleanedResponsibilities,
        requirements: cleanedRequirements,
      };
      setRoles([...roles, newRole]);
    }

    handleCloseModal();
  };

  const addArrayItem = (field: 'responsibilities' | 'requirements') => {
    setFormData({
      ...formData,
      [field]: [...formData[field], ''],
    });
  };

  const removeArrayItem = (field: 'responsibilities' | 'requirements', index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [field]: newArray.length > 0 ? newArray : [''],
    });
  };

  const updateArrayItem = (field: 'responsibilities' | 'requirements', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({
      ...formData,
      [field]: newArray,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-slate-900">Legyn Roles & Levels</h2>
          <p className="text-slate-600 text-sm mt-1">Define progression of members</p>
        </div>
        <button
          onClick={handleAddRole}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Role
        </button>
      </div>

      <div className="grid gap-6">
        {roles.map((role: Role) => (
          <div key={role.id} className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-slate-900">{role.title}</h3>
                <p className="text-slate-600 text-sm mt-2">{role.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg">
                  <Users className="w-4 h-4 text-slate-600" />
                  <span className="text-slate-700 text-sm">
                    {role.currentHolders}/{role.maxHolders}
                  </span>
                </div>
                <button
                  onClick={() => handleEditRole(role)}
                  className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                  title="Edit role"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteRole(role.id)}
                  className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                  title="Delete role"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <h4 className="text-slate-900">Responsibilities</h4>
                </div>
                <ul className="space-y-2">
                  {role.responsibilities.map((resp: string, index: number) => (
                    <li key={index} className="text-slate-600 text-sm pl-6 relative">
                      <span className="absolute left-0 top-2 w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-4 h-4 text-amber-600" />
                  <h4 className="text-slate-900">Requirements</h4>
                </div>
                <ul className="space-y-2">
                  {role.requirements.map((req: string, index: number) => (
                    <li key={index} className="text-slate-600 text-sm pl-6 relative">
                      <span className="absolute left-0 top-2 w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                      {req}
                    </li>
                  ))}
                </ul>
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
              maxWidth: '40rem',
              padding: '0 1rem',
              boxSizing: 'border-box',
            }}
            className="animate-scale-in"
          >
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '1.5rem', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>
                  {editingRole ? 'Edit Role' : 'Add New Role'}
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
                    placeholder="Role title"
                    autoFocus
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.5rem' }}>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '1rem', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }}
                    placeholder="Role description"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.5rem' }}>Current Holders</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={formData.currentHolders}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        setFormData({ ...formData, currentHolders: value === '' ? 0 : Number(value) });
                      }}
                      style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '1rem', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.5rem' }}>Max Holders</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={formData.maxHolders}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        setFormData({ ...formData, maxHolders: value === '' ? 0 : Number(value) });
                      }}
                      style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '1rem', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.5rem' }}>Responsibilities</label>
                  {formData.responsibilities.map((resp, index) => (
                    <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <input
                        type="text"
                        value={resp}
                        onChange={(e) => updateArrayItem('responsibilities', index, e.target.value)}
                        style={{ flex: 1, padding: '0.5rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.875rem', boxSizing: 'border-box' }}
                        placeholder="Enter responsibility"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem('responsibilities', index)}
                        style={{ padding: '0.5rem', border: '1px solid #fca5a5', borderRadius: '0.5rem', backgroundColor: '#fef2f2', color: '#dc2626', cursor: 'pointer' }}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('responsibilities')}
                    style={{ padding: '0.5rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', backgroundColor: '#f8fafc', color: '#334155', cursor: 'pointer', fontSize: '0.875rem' }}
                  >
                    + Add Responsibility
                  </button>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.5rem' }}>Requirements</label>
                  {formData.requirements.map((req, index) => (
                    <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <input
                        type="text"
                        value={req}
                        onChange={(e) => updateArrayItem('requirements', index, e.target.value)}
                        style={{ flex: 1, padding: '0.5rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.875rem', boxSizing: 'border-box' }}
                        placeholder="Enter requirement"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem('requirements', index)}
                        style={{ padding: '0.5rem', border: '1px solid #fca5a5', borderRadius: '0.5rem', backgroundColor: '#fef2f2', color: '#dc2626', cursor: 'pointer' }}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('requirements')}
                    style={{ padding: '0.5rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', backgroundColor: '#f8fafc', color: '#334155', cursor: 'pointer', fontSize: '0.875rem' }}
                  >
                    + Add Requirement
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                <button
                  onClick={handleSaveRole}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem 1rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: 500, cursor: 'pointer' }}
                >
                  <Save className="w-4 h-4" />
                  {editingRole ? 'Save Changes' : 'Add Role'}
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
