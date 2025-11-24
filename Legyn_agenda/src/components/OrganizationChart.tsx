import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ChevronDown, ChevronRight, Trophy, Medal, Award, X, Save } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  role: string;
  level: number;
  score: number;
  children: Member[];
}

const STORAGE_KEY = 'legyn_leaderboard_data';

// Default data structure
const defaultMembers: Member[] = [
  {
    id: '1',
    name: 'Core Contributors',
    role: 'Heavy & Regular Contributors',
    level: 0,
    score: 0,
    children: [
      {
        id: '2',
        name: 'John Smith',
        role: 'Core Contributor',
        level: 1,
        score: 2850,
        children: [],
      },
      {
        id: '3',
        name: 'Sarah Chen',
        role: 'Core Contributor',
        level: 1,
        score: 2640,
        children: [],
      },
      {
        id: '4',
        name: 'Michael Rodriguez',
        role: 'Core Contributor',
        level: 1,
        score: 2420,
        children: [],
      },
    ],
  },
  {
    id: '5',
    name: 'Members',
    role: 'Proof of Work Contributors',
    level: 0,
    score: 0,
    children: [
      {
        id: '6',
        name: 'Emma Johnson',
        role: 'Member',
        level: 1,
        score: 1850,
        children: [],
      },
      {
        id: '7',
        name: 'David Kim',
        role: 'Member',
        level: 1,
        score: 1640,
        children: [],
      },
      {
        id: '8',
        name: 'Lisa Wang',
        role: 'Member',
        level: 1,
        score: 1520,
        children: [],
      },
      {
        id: '9',
        name: 'Alex Turner',
        role: 'Member',
        level: 1,
        score: 1380,
        children: [],
      },
    ],
  },
  {
    id: '10',
    name: 'Lurkers',
    role: 'New Discord Members',
    level: 0,
    score: 0,
    children: [
      {
        id: '11',
        name: 'New Member 1',
        role: 'Lurker',
        level: 1,
        score: 120,
        children: [],
      },
      {
        id: '12',
        name: 'New Member 2',
        role: 'Lurker',
        level: 1,
        score: 85,
        children: [],
      },
    ],
  },
];

export function OrganizationChart() {
  // Load data from localStorage on mount
  const loadFromStorage = (): Member[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
    return defaultMembers;
  };

  const [members, setMembers] = useState(loadFromStorage);
  const [expandedNodes, setExpandedNodes] = useState(new Set(['1', '5', '10']));
  
  // Modal state for members
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null as Member | null);
  const [editingParentId, setEditingParentId] = useState(null as string | null);
  
  // Modal state for categories
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null as Member | null);
  
  // Form state for members
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    score: 0,
    parentId: loadFromStorage().length > 0 ? loadFromStorage()[0].id : '1',
  });
  
  // Update formData.parentId if current category is deleted
  useEffect(() => {
    const categoryExists = members.some(cat => cat.id === formData.parentId);
    if (!categoryExists && members.length > 0) {
      setFormData(prev => ({ ...prev, parentId: members[0].id }));
    }
  }, [members]);
  
  // Form state for categories
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    role: '',
    level: 0,
  });

  // Save to localStorage whenever members change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [members]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen || isCategoryModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen, isCategoryModalOpen]);

  // Sort children by score (descending) whenever members change
  useEffect(() => {
    setMembers(prevMembers => {
      return prevMembers.map(category => ({
        ...category,
        children: [...category.children].sort((a, b) => b.score - a.score)
      }));
    });
  }, []); // Only run once on mount

  // Sort function to be called after any modification
  const sortChildren = (membersToSort: Member[]): Member[] => {
    return membersToSort.map(category => ({
      ...category,
      children: [...category.children].sort((a, b) => b.score - a.score)
    }));
  };

  const toggleNode = (id: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedNodes(newExpanded);
  };

  const getScoreIcon = (score: number) => {
    if (score >= 2000) return <Trophy className="w-4 h-4 text-yellow-500" />;
    if (score >= 1000) return <Medal className="w-4 h-4 text-slate-500" />;
    return <Award className="w-4 h-4 text-amber-600" />;
  };

  // Open modal for adding new member
  const handleAddMember = () => {
    setEditingMember(null);
    setEditingParentId(null);
    const defaultParentId = members.length > 0 ? members[0].id : '1';
    setFormData({
      name: '',
      role: 'Member',
      score: 0,
      parentId: defaultParentId,
    });
    setIsModalOpen(true);
  };

  // Open modal for editing existing member
  const handleEditMember = (member: Member, parentId: string) => {
    setEditingMember(member);
    setEditingParentId(parentId);
    setFormData({
      name: member.name,
      role: member.role,
      score: member.score,
      parentId: parentId,
    });
    setIsModalOpen(true);
  };

  // Delete member with confirmation
  const handleDeleteMember = (memberId: string, parentId: string) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      setMembers(prevMembers => {
        const updated = prevMembers.map(category => {
          if (category.id === parentId) {
            return {
              ...category,
              children: category.children.filter(child => child.id !== memberId)
            };
          }
          return category;
        });
        return sortChildren(updated);
      });
    }
  };

  // Save member (add or update)
  const handleSaveMember = () => {
    if (!formData.name.trim()) {
      alert('Please enter a name');
      return;
    }

    if (editingMember) {
      // Update existing member - handle category change if parentId changed
      setMembers(prevMembers => {
        const categoryChanged = editingParentId !== formData.parentId;
        
        if (categoryChanged) {
          // Member is moving to a different category
          const updatedMember = {
            ...editingMember,
            name: formData.name,
            role: formData.role,
            score: Number(formData.score),
          };
          
          // Remove from old category and add to new category
          const updated = prevMembers.map(category => {
            if (category.id === editingParentId) {
              // Remove from old category
              return {
                ...category,
                children: category.children.filter(child => child.id !== editingMember.id)
              };
            } else if (category.id === formData.parentId) {
              // Add to new category
              return {
                ...category,
                children: [...category.children, updatedMember]
              };
            }
            return category;
          });
          return sortChildren(updated);
        } else {
          // Member stays in same category, just update its properties
          const updated = prevMembers.map(category => {
            if (category.id === editingParentId) {
              return {
                ...category,
                children: category.children.map(child =>
                  child.id === editingMember.id
                    ? {
                        ...child,
                        name: formData.name,
                        role: formData.role,
                        score: Number(formData.score),
                      }
                    : child
                )
              };
            }
            return category;
          });
          return sortChildren(updated);
        }
      });
    } else {
      // Add new member
      const newMember: Member = {
        id: Date.now().toString(), // Simple ID generation
        name: formData.name,
        role: formData.role,
        level: 1,
        score: Number(formData.score),
        children: [],
      };

      setMembers(prevMembers => {
        const updated = prevMembers.map(category => {
          if (category.id === formData.parentId) {
            return {
              ...category,
              children: [...category.children, newMember]
            };
          }
          return category;
        });
        return sortChildren(updated);
      });
    }

    setIsModalOpen(false);
    setEditingMember(null);
    setEditingParentId(null);
  };

  // Close modal handler
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
    setEditingParentId(null);
    setFormData({
      name: '',
      role: '',
      score: 0,
      parentId: members.length > 0 ? members[0].id : '1',
    });
  };

  // Category handlers
  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryFormData({
      name: '',
      role: '',
      level: 0,
    });
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (category: Member) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      role: category.role,
      level: category.level,
    });
    setIsCategoryModalOpen(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    const category = members.find(cat => cat.id === categoryId);
    const memberCount = category?.children.length || 0;
    
    const message = memberCount > 0
      ? `This category has ${memberCount} member(s). Deleting it will also delete all members in this category. Are you sure?`
      : 'Are you sure you want to delete this category?';
    
    if (window.confirm(message)) {
      setMembers(prevMembers => {
        const updated = prevMembers.filter(cat => cat.id !== categoryId);
        // Update default parentId if the deleted category was selected
        if (formData.parentId === categoryId && updated.length > 0) {
          setFormData(prev => ({ ...prev, parentId: updated[0].id }));
        }
        return sortChildren(updated);
      });
      // Update expanded nodes
      setExpandedNodes(prev => {
        const updated = new Set(prev);
        updated.delete(categoryId);
        return updated;
      });
    }
  };

  const handleSaveCategory = () => {
    if (!categoryFormData.name.trim()) {
      alert('Please enter a category name');
      return;
    }

    if (editingCategory) {
      // Update existing category
      const newLevel = Number(categoryFormData.level);
      setMembers(prevMembers => {
        const updated = prevMembers.map(category =>
          category.id === editingCategory.id
            ? {
                ...category,
                name: categoryFormData.name,
                role: categoryFormData.role,
                level: newLevel,
              }
            : category
        );
        return sortChildren(updated);
      });
    } else {
      // Add new category
      const newCategory: Member = {
        id: Date.now().toString(),
        name: categoryFormData.name,
        role: categoryFormData.role,
        level: Number(categoryFormData.level),
        score: 0,
        children: [],
      };

      setMembers(prevMembers => {
        const updated = [...prevMembers, newCategory];
        // Set new category as default parentId if it's the first one
        if (prevMembers.length === 0) {
          setFormData(prev => ({ ...prev, parentId: newCategory.id }));
        }
        return sortChildren(updated);
      });
      
      // Expand the new category
      setExpandedNodes(prev => new Set([...prev, newCategory.id]));
    }

    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  const handleCloseCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
    setCategoryFormData({
      name: '',
      role: '',
      level: 0,
    });
  };

  const renderMember = (member: Member, parentId: string) => {
    const hasChildren = member.children.length > 0;
    const isExpanded = expandedNodes.has(member.id);
    
    // Check if this is a top-level category (has children and is in the members array)
    const isCategory = members.some(cat => cat.id === member.id);
    
    // For categories, use their own level
    // For members, get the parent category's level
    const displayLevel = isCategory
      ? member.level 
      : (members.find(cat => cat.id === parentId)?.level ?? member.level);

    return (
      <div key={member.id} className="mb-3">
        <div className="flex items-start gap-2">
          {hasChildren && (
            <button
              onClick={() => toggleNode(member.id)}
              className="mt-3 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          )}
          {!hasChildren && <div className="w-4 mt-3" />}
          
          <div className="flex-1 bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-slate-900">{member.name}</h3>
                  {member.level === 1 && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 rounded">
                      {getScoreIcon(member.score)}
                      <span className="text-blue-700 text-sm">{member.score}</span>
                    </div>
                  )}
                </div>
                <p className="text-slate-600 text-sm mt-1">{member.role}</p>
                <span className="inline-block mt-2 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                  Level {displayLevel}
                </span>
              </div>
              <div className="flex gap-2">
                {isCategory ? (
                  // Category edit/delete buttons
                  <>
                    <button
                      onClick={() => handleEditCategory(member)}
                      className="text-slate-400 hover:text-blue-600 transition-colors p-1"
                      title="Edit category"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(member.id)}
                      className="text-slate-400 hover:text-red-600 transition-colors p-1"
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  // Member edit/delete buttons
                  <>
                    <button
                      onClick={() => handleEditMember(member, parentId)}
                      className="text-slate-400 hover:text-blue-600 transition-colors p-1"
                      title="Edit member"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMember(member.id, parentId)}
                      className="text-slate-400 hover:text-red-600 transition-colors p-1"
                      title="Delete member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-8 mt-2 pl-4 border-l-2 border-slate-200">
            {member.children.map(child => renderMember(child, member.id))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-slate-900">Legyn Leaderboard</h2>
          <p className="text-slate-600 text-sm mt-1">Track contribution scores and member rankings</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddCategory}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
            type="button"
            style={{ color: 'white' }}
          >
            <Plus className="w-4 h-4" style={{ color: 'white' }} />
            <span style={{ color: 'white' }}>Create Category</span>
          </button>
          <button
            onClick={handleAddMember}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
            type="button"
            style={{ color: 'white' }}
          >
            <Plus className="w-4 h-4" style={{ color: 'white' }} />
            <span style={{ color: 'white' }}>Add Member</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-6">
        {members.map(member => renderMember(member, member.id))}
      </div>

      {/* Add/Edit Member Modal - Floating Overlay */}
      {isModalOpen && (
        <>
          {/* Dark overlay backdrop - covers entire viewport */}
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

          {/* Modal container - centered and floating */}
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 9999,
              width: '100%',
              maxWidth: '28rem',
              padding: '0 1rem',
              boxSizing: 'border-box',
            }}
            className="animate-scale-in"
          >
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '0.75rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                padding: '1.5rem',
              }}
            >
              {/* Modal Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>
                  {editingMember ? 'Edit Member' : 'Add New Member'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.5rem' }}>
                    Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    placeholder="Enter member name"
                    autoFocus
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.5rem' }}>
                    Role
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    placeholder="Enter role (e.g., Core Contributor, Member, Lurker)"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.5rem' }}>
                    Score/Points
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={formData.score}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      setFormData({ ...formData, score: value === '' ? 0 : Number(value) });
                    }}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    placeholder="0"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.5rem' }}>
                    Category
                  </label>
                  <select
                    value={formData.parentId}
                    onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      boxSizing: 'border-box',
                    }}
                  >
                    {members.map((category: Member) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                <button
                  onClick={handleSaveMember}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  <Save className="w-4 h-4" />
                  {editingMember ? 'Save Changes' : 'Add Member'}
                </button>
                <button
                  onClick={handleCloseModal}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: 'white',
                    color: '#334155',
                    border: '1px solid #cbd5e1',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add/Edit Category Modal - Floating Overlay */}
      {isCategoryModalOpen && (
        <>
          {/* Dark overlay backdrop - covers entire viewport */}
          <div
            onClick={handleCloseCategoryModal}
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

          {/* Modal container - centered and floating */}
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 9999,
              width: '100%',
              maxWidth: '28rem',
              padding: '0 1rem',
              boxSizing: 'border-box',
            }}
            className="animate-scale-in"
          >
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '0.75rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                padding: '1.5rem',
              }}
            >
              {/* Modal Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h3>
                <button
                  onClick={handleCloseCategoryModal}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.5rem' }}>
                    Category Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={categoryFormData.name}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    placeholder="Enter category name"
                    autoFocus
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.5rem' }}>
                    Category Description
                  </label>
                  <input
                    type="text"
                    value={categoryFormData.role}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, role: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    placeholder="Enter category description"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.5rem' }}>
                    Level
                  </label>
                  <input
                    type="number"
                    value={categoryFormData.level}
                    onChange={(e) => {
                      const value = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                      setCategoryFormData({ ...categoryFormData, level: isNaN(value) ? 0 : value });
                    }}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    placeholder="Enter level (e.g., 0, 1, 2)"
                    min="0"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                <button
                  onClick={handleSaveCategory}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#16a34a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  <Save className="w-4 h-4" />
                  {editingCategory ? 'Save Changes' : 'Add Category'}
                </button>
                <button
                  onClick={handleCloseCategoryModal}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: 'white',
                    color: '#334155',
                    border: '1px solid #cbd5e1',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
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
