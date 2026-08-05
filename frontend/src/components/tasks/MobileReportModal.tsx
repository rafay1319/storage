'use client';

import React, { useState } from 'react';
import { X, Camera, MapPin, CheckCircle2, Clock, DollarSign, Upload, ShieldCheck } from 'lucide-react';
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
  const [gpsLogged, setGpsLogged] = useState(true);
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
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block">Mobile Tech Inspection</span>
            <h3 className="font-bold text-base text-white">{task.title}</h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{task.taskNumber} • {task.containerNumber || 'Yard General'}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Notes */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Field Inspection Notes</label>
            <textarea
              required
              rows={3}
              placeholder="Describe work completed, door gasket condition, flooring integrity..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Time & Extra Costs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Time Spent (Minutes)</label>
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white">
                <Clock className="w-4 h-4 text-cyan-400 mr-2" />
                <input
                  type="number"
                  value={completionTime}
                  onChange={(e) => setCompletionTime(e.target.value)}
                  className="bg-transparent w-full focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Extra Materials Cost ($)</label>
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white">
                <DollarSign className="w-4 h-4 text-emerald-400 mr-2" />
                <input
                  type="number"
                  value={extraCosts}
                  onChange={(e) => setExtraCosts(e.target.value)}
                  className="bg-transparent w-full focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Photos Upload Mock */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Inspection Photos (Before / After)</label>
            <div className="grid grid-cols-3 gap-2">
              {photos.map((ph, idx) => (
                <div key={idx} className="relative rounded-xl overflow-hidden border border-slate-800 h-20">
                  <img src={ph} alt="Upload" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 text-[9px] bg-black/60 text-white px-1 rounded font-mono">Photo {idx + 1}</span>
                </div>
              ))}
              <button
                type="button"
                className="h-20 rounded-xl border-2 border-dashed border-slate-800 hover:border-blue-500 bg-slate-950/40 flex flex-col items-center justify-center text-slate-400 hover:text-blue-400 transition-all text-xs"
              >
                <Camera className="w-5 h-5 mb-1" />
                <span>Snap Photo</span>
              </button>
            </div>
          </div>

          {/* GPS Verification Badge */}
          <div className="bg-slate-950/50 p-3 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <MapPin className="w-4 h-4 text-rose-400" />
              <span>GPS Location Stamp: <strong>30.2672° N, 97.7431° W</strong></span>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">Verified</span>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3 rounded-xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all mt-4"
          >
            {isSubmitting ? 'Uploading Report...' : 'Submit Mobile Field Report'}
          </button>
        </form>
      </div>
    </div>
  );
};
