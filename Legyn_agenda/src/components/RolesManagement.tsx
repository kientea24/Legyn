import React, { useState } from 'react';
import { Plus, Users, Award, CheckCircle2 } from 'lucide-react';

interface Role {
  id: string;
  title: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  currentHolders: number;
  maxHolders: number;
}

export function RolesManagement() {
  const [roles] = useState([
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
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-slate-900">Legyn Roles & Contribution Levels</h2>
          <p className="text-slate-600 text-sm mt-1">Define progression from Lurker to Core Contributor</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add Role
        </button>
      </div>

      <div className="grid gap-6">
        {roles.map((role) => (
          <div key={role.id} className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-slate-900">{role.title}</h3>
                <p className="text-slate-600 text-sm mt-2">{role.description}</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg">
                <Users className="w-4 h-4 text-slate-600" />
                <span className="text-slate-700 text-sm">
                  {role.currentHolders}/{role.maxHolders}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <h4 className="text-slate-900">Responsibilities</h4>
                </div>
                <ul className="space-y-2">
                  {role.responsibilities.map((resp, index) => (
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
                  {role.requirements.map((req, index) => (
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
    </div>
  );
}