import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { MobileReportModal } from '@/components/tasks/MobileReportModal';
import { INITIAL_FACILITIES, INITIAL_CONTAINERS, INITIAL_CUSTOMERS, INITIAL_TASKS } from '@/lib/mockData';
import { Task } from '@/lib/types';
import { ClipboardCheck, Plus, Smartphone } from 'lucide-react';

export function TasksPage() {
  const [currentRole, setCurrentRole] = useState('OWNER_ADMIN');
  const [selectedFacilityId, setSelectedFacilityId] = useState('ALL');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [activeTaskForMobileReport, setActiveTaskForMobileReport] = useState<Task | null>(null);

  const handleReportSubmitted = (reportData: any) => {
    setTasks(prev => prev.map(t => t.id === reportData.taskId ? { ...t, status: 'Completed' } : t));
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar currentRole={currentRole} onRoleChange={setCurrentRole} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          facilities={INITIAL_FACILITIES}
          selectedFacilityId={selectedFacilityId}
          onSelectFacility={setSelectedFacilityId}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />

        <main className="p-8 space-y-6 overflow-y-auto">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-white flex items-center gap-2">
                <ClipboardCheck className="w-6 h-6 text-indigo-400" /> Employee Task & Inspection Hub
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Dispatch yard maintenance, container pressure washing, door seal repairs, and mobile field reporting.
              </p>
            </div>

            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all">
              <Plus className="w-4 h-4" />
              <span>Create Task Dispatch</span>
            </button>
          </div>

          {/* Kanban / Task Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Pending', 'In Progress', 'Completed'].map((colStatus) => {
              const colTasks = tasks.filter(t => t.status === colStatus);

              return (
                <div key={colStatus} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        colStatus === 'Completed' ? 'bg-emerald-400' :
                        colStatus === 'In Progress' ? 'bg-cyan-400' : 'bg-amber-400'
                      }`}></span>
                      {colStatus} ({colTasks.length})
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {colTasks.map((t) => (
                      <div key={t.id} className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3 hover:border-slate-700 transition-all">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] text-cyan-400 font-bold">{t.taskNumber}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            t.priority === 'High' ? 'bg-rose-500/20 text-rose-300' : 'bg-blue-500/20 text-blue-300'
                          }`}>
                            {t.priority} Priority
                          </span>
                        </div>

                        <h4 className="font-bold text-xs text-white leading-snug">{t.title}</h4>
                        <p className="text-[11px] text-slate-400">{t.description}</p>

                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-800/80">
                          <span>Tech: <strong className="text-slate-300">{t.assignedToName}</strong></span>
                          <span>Due: {t.dueDate}</span>
                        </div>

                        {colStatus !== 'Completed' && (
                          <button
                            onClick={() => setActiveTaskForMobileReport(t)}
                            className="w-full bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 text-xs font-semibold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all mt-2"
                          >
                            <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Mobile Field Inspector</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        facilities={INITIAL_FACILITIES}
        containers={INITIAL_CONTAINERS}
        customers={INITIAL_CUSTOMERS}
        tasks={tasks}
      />

      <MobileReportModal
        task={activeTaskForMobileReport}
        onClose={() => setActiveTaskForMobileReport(null)}
        onSubmitReport={handleReportSubmitted}
      />
    </div>
  );
}
