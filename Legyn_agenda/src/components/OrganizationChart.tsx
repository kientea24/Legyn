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
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null as Member | null);
  const [editingParentId, setEditingParentId] = useState(null as string | null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    score: 0,
    parentId: '1', // Default to Core Contributors
  });

  // Save to localStorage whenever members change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [members]);

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
    setFormData({
      name: '',
      role: 'Member',
      score: 0,
      parentId: '1',
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
      // Update existing member
      setMembers(prevMembers => {
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

  const renderMember = (member: Member, parentId: string) => {
    const hasChildren = member.children.length > 0;
    const isExpanded = expandedNodes.has(member.id);

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
                  Level {member.level}
                </span>
              </div>
              {member.level === 1 && (
                <div className="flex gap-2">
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
                </div>
              )}
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
        <button
          onClick={handleAddMember}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      <div className="bg-slate-50 rounded-lg p-6">
        {members.map(member => renderMember(member, member.id))}
      </div>

      {/* Add/Edit Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                {editingMember ? 'Edit Member' : 'Add New Member'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter member name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Core Contributor">Core Contributor</option>
                  <option value="Member">Member</option>
                  <option value="Lurker">Lurker</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Score/Points
                </label>
                <input
                  type="number"
                  value={formData.score}
                  onChange={(e) => setFormData({ ...formData, score: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.parentId}
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!!editingMember} // Can't change category when editing
                >
                  {members.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {editingMember && (
                  <p className="text-xs text-slate-500 mt-1">Category cannot be changed when editing</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveMember}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                {editingMember ? 'Save Changes' : 'Add Member'}
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
