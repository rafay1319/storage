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
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500/20 selection:text-blue-900">
      <Sidebar currentRole={currentRole} onRoleChange={setCurrentRole} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          facilities={INITIAL_FACILITIES}
          selectedFacilityId={selectedFacilityId}
          onSelectFacility={setSelectedFacilityId}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />

        <main className="p-6 space-y-5 overflow-y-auto">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Field Maintenance & Task Dispatch
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Work orders, mobile field inspections, door seal repairs, and equipment servicing.
              </p>
            </div>

            <button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs shadow-blue-500/20 transition-all">
              <Plus className="w-3.5 h-3.5" />
              <span>Create Task</span>
            </button>
          </div>

          {/* Kanban / Task Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Pending', 'In Progress', 'Completed'].map((colStatus) => {
              const colTasks = tasks.filter(t => t.status === colStatus);

              return (
                <div key={colStatus} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <h3 className="font-semibold text-xs text-slate-700 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        colStatus === 'Completed' ? 'bg-emerald-500' :
                        colStatus === 'In Progress' ? 'bg-blue-500' : 'bg-amber-500'
                      }`}></span>
                      {colStatus}
                    </h3>
                    <span className="text-[10px] font-mono font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {colTasks.length}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {colTasks.map((t) => (
                      <div key={t.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 space-y-2 hover:border-slate-300 transition-all shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] text-blue-700 font-semibold">{t.taskNumber}</span>
                          <span className={`text-[9px] font-semibold px-2 py-0.5 rounded border ${
                            t.priority === 'High' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}>
                            {t.priority}
                          </span>
                        </div>

                        <h4 className="font-semibold text-xs text-slate-900 leading-snug">{t.title}</h4>
                        <p className="text-[11px] text-slate-600 leading-snug">{t.description}</p>

                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1.5 border-t border-slate-200/60">
                          <span>Tech: <strong className="text-slate-800">{t.assignedToName}</strong></span>
                          <span>Due: {t.dueDate}</span>
                        </div>

                        {colStatus !== 'Completed' && (
                          <button
                            onClick={() => setActiveTaskForMobileReport(t)}
                            className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all mt-1"
                          >
                            <Smartphone className="w-3 h-3 text-indigo-600" />
                            <span>Mobile Inspector</span>
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
