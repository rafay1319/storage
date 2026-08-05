'use client';

import React from 'react';
import { 
  X, 
  Box, 
  User, 
  Calendar, 
  DollarSign, 
  ShieldCheck, 
  ClipboardCheck, 
  Camera, 
  FileText, 
  QrCode,
  Wrench,
  ExternalLink
} from 'lucide-react';
import { Container } from '@/lib/types';

interface ContainerDetailModalProps {
  container: Container | null;
  onClose: () => void;
  onNewTaskRequest?: (container: Container) => void;
}

export const ContainerDetailModal: React.FC<ContainerDetailModalProps> = ({
  container,
  onClose,
  onNewTaskRequest
}) => {
  if (!container) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-end p-4">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-xl h-full max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-mono font-black text-lg shadow-lg">
              {container.containerNumber.slice(-4)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white font-mono">{container.containerNumber}</h3>
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                  container.status === 'Occupied' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                  container.status === 'Available' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {container.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{container.facilityName} • Grid Pos (Row {container.posY + 1}, Col {container.posX + 1})</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Specs Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Size</span>
              <span className="text-sm font-extrabold text-white mt-1 block">{container.size}</span>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Unit Type</span>
              <span className="text-xs font-extrabold text-cyan-400 mt-1 block truncate">{container.type}</span>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Monthly Rate</span>
              <span className="text-sm font-extrabold text-emerald-400 mt-1 block">${container.rentalPrice}</span>
            </div>
          </div>

          {/* Customer & Lease Info */}
          <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-400" />
              Active Tenant Profile
            </h4>
            {container.currentCustomerCompany ? (
              <div className="space-y-1 text-xs">
                <p className="font-bold text-white text-sm">{container.currentCustomerCompany}</p>
                <p className="text-slate-400">Contact: {container.currentCustomerName}</p>
                <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" /> Lease Verified
                  </span>
                  <span>Auto-Renew: Active</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No active customer assigned. Container is ready for deployment.</p>
            )}
          </div>

          {/* QR Code & Barcode Simulator */}
          <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <QrCode className="w-4 h-4 text-indigo-400" /> Asset Tag Codes
              </h4>
              <p className="text-xs font-mono text-cyan-400 mt-1">{container.qrCode}</p>
              <p className="text-[10px] font-mono text-slate-500 mt-0.5">{container.barcode}</p>
            </div>
            <div className="w-16 h-16 bg-white p-1 rounded-xl shadow-inner flex items-center justify-center">
              {/* QR visual placeholder */}
              <div className="w-full h-full border-2 border-slate-900 grid grid-cols-3 gap-0.5 p-0.5">
                <div className="bg-slate-900"></div>
                <div className="bg-transparent"></div>
                <div className="bg-slate-900"></div>
                <div className="bg-transparent"></div>
                <div className="bg-slate-900"></div>
                <div className="bg-transparent"></div>
                <div className="bg-slate-900"></div>
                <div className="bg-slate-900"></div>
                <div className="bg-slate-900"></div>
              </div>
            </div>
          </div>

          {/* Asset Valuation */}
          <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" /> Financial Valuation
            </h4>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block">Purchase Cost</span>
                <span className="font-semibold text-slate-300">${container.purchaseCost.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Book Value</span>
                <span className="font-semibold text-slate-300">${container.currentValue.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Insured Value</span>
                <span className="font-semibold text-cyan-400">${container.insuranceValue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Photos Vault */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-2">
              <Camera className="w-4 h-4 text-rose-400" /> Container Photos Vault
            </h4>
            {container.photos && container.photos.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {container.photos.map((ph, idx) => (
                  <img key={idx} src={ph} alt="Inspection photo" className="w-full h-28 object-cover rounded-xl border border-slate-800" />
                ))}
              </div>
            ) : (
              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/60 text-center text-xs text-slate-500">
                No recent inspection photos attached.
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
          <button 
            onClick={() => onNewTaskRequest && onNewTaskRequest(container)}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold py-2.5 rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-all"
          >
            <Wrench className="w-4 h-4 text-amber-400" />
            <span>Create Maintenance Task</span>
          </button>
          <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2.5 rounded-xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-1.5 transition-all">
            <FileText className="w-4 h-4" />
            <span>Lease Agreement</span>
          </button>
        </div>
      </div>
    </div>
  );
};
