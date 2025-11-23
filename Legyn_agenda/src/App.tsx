import { useState } from "react";
import { OrganizationChart } from "./components/OrganizationChart";
import { MeetingScheduler } from "./components/MeetingScheduler";
import { RolesManagement } from "./components/RolesManagement";
import { StructureDocumentation } from "./components/StructureDocumentation";
import { Roadmap } from "./components/Roadmap";
import {
  Users,
  Calendar,
  Shield,
  FileText,
  Map,
} from "lucide-react";

type TabType =
  | "hierarchy"
  | "meetings"
  | "roles"
  | "structure"
  | "roadmap";

export default function App() {
  const [activeTab, setActiveTab] =
    useState<TabType>("hierarchy");

  const tabs = [
    {
      id: "hierarchy" as TabType,
      label: "Leaderboard",
      icon: Users,
    },
    {
      id: "meetings" as TabType,
      label: "Meetings",
      icon: Calendar,
    },
    { id: "roles" as TabType, label: "Roles", icon: Shield },
    {
      id: "structure" as TabType,
      label: "Structure",
      icon: FileText,
    },
    { id: "roadmap" as TabType, label: "Roadmap", icon: Map },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-slate-900 mb-2">
            Legyn Organization Framework
          </h1>
          <p className="text-slate-600">
            Manage your Legyn's structure, hierarchy, and
            operations
          </p>
        </header>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50">
            <nav className="flex">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600 bg-white"
                        : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "hierarchy" && <OrganizationChart />}
            {activeTab === "meetings" && <MeetingScheduler />}
            {activeTab === "roles" && <RolesManagement />}
            {activeTab === "structure" && (
              <StructureDocumentation />
            )}
            {activeTab === "roadmap" && <Roadmap />}
          </div>
        </div>
      </div>
    </div>
  );
}