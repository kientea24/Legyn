import React, { useState } from 'react';
import { BookOpen, Users, Calendar, MessageSquare, Settings, FileText, ChevronDown, ChevronRight } from 'lucide-react';

interface Section {
  id: string;
  title: string;
  icon: any;
  content: string[];
  subsections?: { title: string; content: string[] }[];
}

export function StructureDocumentation() {
  const [expandedSections, setExpandedSections] = useState(new Set(['1']));

  const sections: Section[] = [
    {
      id: '1',
      title: 'DAO Hierarchy & Progression',
      icon: Users,
      content: [
        'The DAO operates with a merit-based hierarchy: Lurker → Member → Core Contributor.',
        'Lurkers are new Discord members who observe and learn before contributing.',
        'Members are invited based on Proof of Work or exceptional talent that adds immediate value.',
        'Core Contributors are the backbone of the DAO, having proven consistent heavy contributions.',
      ],
      subsections: [
        {
          title: 'Progression Path',
          content: [
            'Join Discord as a Lurker and learn about the DAO',
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
      icon: Calendar,
      content: [
        'Core Contributors meet weekly for strategic discussions.',
        'Member syncs occur bi-weekly for updates and coordination.',
        'All Hands meetings are held monthly with the entire DAO.',
        'All meetings are conducted via Discord voice channels.',
      ],
      subsections: [
        {
          title: 'Meeting Types',
          content: [
            'Core Contributors Strategy: Weekly, decision-making',
            'Member Syncs: Bi-weekly, coordination and updates',
            'All Hands: Monthly, full DAO participation',
            'Onboarding Sessions: As needed for new Members',
          ],
        },
      ],
    },
    {
      id: '3',
      title: 'Communication Channels',
      icon: MessageSquare,
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
            '#governance: DAO decisions and proposals',
            'Project channels: Specific initiative coordination',
            'Voice channels: Meetings and real-time collaboration',
          ],
        },
      ],
    },
    {
      id: '4',
      title: 'Decision-Making Process',
      icon: Settings,
      content: [
        'Core Contributors make strategic decisions for the DAO.',
        'Members have input on operational matters.',
        'Major decisions use proposal and voting system.',
        'Emergency decisions can be made by 3+ Core Contributors.',
      ],
    },
    {
      id: '5',
      title: 'Proof of Work & Contributions',
      icon: BookOpen,
      content: [
        'Contributions are tracked and recognized publicly.',
        'Quality and consistency matter more than quantity.',
        'Both DAO-specific work and relevant external work count.',
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
      icon: FileText,
      content: [
        'All Members have voice in DAO discussions.',
        'Core Contributors have final say on strategic direction.',
        'Lurkers can observe but not vote on decisions.',
        'Inactive Members may be moved back to Lurker status.',
      ],
      subsections: [
        {
          title: 'Member Expectations',
          content: [
            'Active participation in Discord discussions',
            'Regular contributions aligned with DAO goals',
            'Respect for community culture and values',
            'Help onboard and mentor newer members',
          ],
        },
        {
          title: 'Core Contributor Expectations',
          content: [
            'Weekly participation in strategy sessions',
            'Lead and oversee major DAO initiatives',
            'Review and approve new Member applications',
            'Long-term commitment to DAO success',
          ],
        },
      ],
    },
  ];

  const toggleSection = (id: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-slate-900">Legyn Structure Documentation</h2>
        <p className="text-slate-600 text-sm mt-1">Comprehensive guide to Legyn operations, progression, and policies</p>
      </div>

      <div className="space-y-3">
        {sections.map((section) => {
          const isExpanded = expandedSections.has(section.id);
          const Icon = section.icon;

          return (
            <div key={section.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-slate-900">{section.title}</h3>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                )}
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 border-t border-slate-100">
                  <div className="mt-4 space-y-3">
                    {section.content.map((item, index) => (
                      <p key={index} className="text-slate-600 text-sm pl-4 border-l-2 border-blue-200">
                        {item}
                      </p>
                    ))}
                  </div>

                  {section.subsections && (
                    <div className="mt-6 space-y-4">
                      {section.subsections.map((subsection, subIndex) => (
                        <div key={subIndex} className="bg-slate-50 rounded-lg p-4">
                          <h4 className="text-slate-900 mb-3">{subsection.title}</h4>
                          <ul className="space-y-2">
                            {subsection.content.map((item, itemIndex) => (
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
    </div>
  );
}