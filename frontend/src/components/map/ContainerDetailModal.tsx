'use client';

import React from 'react';
import { 
  X, 
  User, 
  DollarSign, 
  ShieldCheck, 
  Camera, 
  FileText, 
  QrCode,
  Wrench
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
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-end p-3">
      <div className="bg-white border border-slate-200 w-full max-w-md h-full max-h-[94vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-mono font-bold text-sm shadow-xs">
              {container.containerNumber.slice(-4)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-900 font-mono">{container.containerNumber}</h3>
                <span className={`text-[9px] font-bold px-2 py-0.2 rounded-full border ${
                  container.status === 'Occupied' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                  container.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {container.status}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">{container.facilityName} • Row {container.posY + 1}, Col {container.posX + 1}</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-200/60 text-slate-400 hover:text-slate-700 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Quick Specs Cards */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
              <span className="text-[9px] text-slate-400 uppercase font-semibold block">Size</span>
              <span className="text-xs font-bold text-slate-900 mt-0.5 block">{container.size}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
              <span className="text-[9px] text-slate-400 uppercase font-semibold block">Type</span>
              <span className="text-xs font-bold text-blue-700 mt-0.5 block truncate">{container.type}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
              <span className="text-[9px] text-slate-400 uppercase font-semibold block">Monthly</span>
              <span className="text-xs font-bold text-emerald-700 mt-0.5 block">${container.rentalPrice}</span>
            </div>
          </div>

          {/* Customer & Lease Info */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
            <h4 className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-600" />
              Active Tenant Profile
            </h4>
            {container.currentCustomerCompany ? (
              <div className="space-y-0.5 text-xs">
                <p className="font-semibold text-slate-900">{container.currentCustomerCompany}</p>
                <p className="text-[11px] text-slate-500">Contact: {container.currentCustomerName}</p>
                <div className="flex items-center gap-3 text-[10px] text-slate-500 pt-1.5 border-t border-slate-200">
                  <span className="flex items-center gap-1 text-emerald-700 font-medium">
                    <ShieldCheck className="w-3 h-3" /> Lease Verified
                  </span>
                  <span>Auto-Renew: Active</span>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 italic">No active tenant. Unit ready for deployment.</p>
            )}
          </div>

          {/* QR Code & Barcode */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <h4 className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5 text-indigo-600" /> Asset Tag Codes
              </h4>
              <p className="text-[11px] font-mono text-blue-700 mt-0.5">{container.qrCode}</p>
              <p className="text-[9px] font-mono text-slate-500">{container.barcode}</p>
            </div>
            <div className="w-12 h-12 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-center">
              <div className="w-full h-full border border-slate-900 grid grid-cols-3 gap-0.5 p-0.5">
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
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
            <h4 className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Valuation & Ledger
            </h4>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-[9px] text-slate-400 block">Purchase</span>
                <span className="font-semibold text-slate-700 text-[11px]">${container.purchaseCost.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 block">Book Value</span>
                <span className="font-semibold text-slate-700 text-[11px]">${container.currentValue.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 block">Insured</span>
                <span className="font-semibold text-blue-700 text-[11px]">${container.insuranceValue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Photos Vault */}
          <div>
            <h4 className="text-[11px] font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-rose-500" /> Inspection Photos
            </h4>
            {container.photos && container.photos.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {container.photos.map((ph, idx) => (
                  <img key={idx} src={ph} alt="Inspection photo" className="w-full h-24 object-cover rounded-lg border border-slate-200 shadow-2xs" />
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center text-xs text-slate-400">
                No recent inspection photos attached.
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center gap-2">
          <button 
            onClick={() => onNewTaskRequest && onNewTaskRequest(container)}
            className="flex-1 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold py-2 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-center gap-1.5 transition-all"
          >
            <Wrench className="w-3.5 h-3.5 text-amber-600" />
            <span>Create Task</span>
          </button>
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 rounded-lg shadow-xs shadow-blue-500/20 flex items-center justify-center gap-1.5 transition-all">
            <FileText className="w-3.5 h-3.5" />
            <span>Lease Contract</span>
          </button>
        </div>
      </div>
    </div>
  );
};
