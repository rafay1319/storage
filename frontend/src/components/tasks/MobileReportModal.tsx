'use client';

import React, { useState } from 'react';
import { X, Camera, MapPin, Clock, DollarSign } from 'lucide-react';
import { Task } from '@/lib/types';

interface MobileReportModalProps {
  task: Task | null;
  onClose: () => void;
  onSubmitReport: (reportData: any) => void;
}

export const MobileReportModal: React.FC<MobileReportModalProps> = ({
  task,
  onClose,
  onSubmitReport
}) => {
  const [notes, setNotes] = useState('');
  const [completionTime, setCompletionTime] = useState('45');
  const [extraCosts, setExtraCosts] = useState('0');
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500'
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!task) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      onSubmitReport({
        taskId: task.id,
        notes,
        completionTimeMinutes: Number(completionTime),
        extraCosts: Number(extraCosts),
        photos,
        gpsLat: 30.2672,
        gpsLng: -97.7431
      });
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-3">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest block">Mobile Tech Inspection</span>
            <h3 className="font-bold text-sm text-slate-900">{task.title}</h3>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">{task.taskNumber} • {task.containerNumber || 'Yard General'}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-200/60 text-slate-400 hover:text-slate-700 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 max-h-[75vh] overflow-y-auto">
          {/* Notes */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Field Inspection Notes</label>
            <textarea
              required
              rows={2}
              placeholder="Describe work completed, door gasket condition..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 rounded-lg p-2.5 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Time & Extra Costs */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">Time Spent (Mins)</label>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900">
                <Clock className="w-3.5 h-3.5 text-blue-600 mr-2" />
                <input
                  type="number"
                  value={completionTime}
                  onChange={(e) => setCompletionTime(e.target.value)}
                  className="bg-transparent w-full focus:outline-none text-xs"
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">Extra Materials ($)</label>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600 mr-2" />
                <input
                  type="number"
                  value={extraCosts}
                  onChange={(e) => setExtraCosts(e.target.value)}
                  className="bg-transparent w-full focus:outline-none text-xs"
                />
              </div>
            </div>
          </div>

          {/* Photos Upload Mock */}
          <div>
            <label className="text-[11px] font-semibold text-slate-700 block mb-1">Inspection Photos</label>
            <div className="grid grid-cols-3 gap-2">
              {photos.map((ph, idx) => (
                <div key={idx} className="relative rounded-lg overflow-hidden border border-slate-200 h-16 shadow-2xs">
                  <img src={ph} alt="Upload" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 text-[8px] bg-black/70 text-white px-1 rounded font-mono">Photo {idx + 1}</span>
                </div>
              ))}
              <button
                type="button"
                className="h-16 rounded-lg border border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 flex flex-col items-center justify-center text-slate-500 hover:text-blue-600 transition-all text-xs"
              >
                <Camera className="w-4 h-4 mb-0.5" />
                <span className="text-[10px]">Add Photo</span>
              </button>
            </div>
          </div>

          {/* GPS Verification Badge */}
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-700 text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>GPS Stamp: <strong>30.2672° N, 97.7431° W</strong></span>
            </div>
            <span className="text-[9px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">Verified</span>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 rounded-lg shadow-xs shadow-blue-500/20 flex items-center justify-center gap-1.5 transition-all mt-2"
          >
            {isSubmitting ? 'Uploading Report...' : 'Submit Field Report'}
          </button>
        </form>
      </div>
    </div>
  );
};
