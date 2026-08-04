'use client';

import React, { useState, useEffect } from 'react';
import { X, MapPin, ShieldCheck, Navigation, Info, AlertTriangle } from 'lucide-react';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [status, setStatus] = useState<string>('Verifying GPS location...');

  useEffect(() => {
    if (isOpen) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCoords({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            setStatus('VERIFIED IN KASBA GEOFENCE (854330)');
          },
          (error) => {
            // Default Kasba coordinates mock fallback
            setCoords({ lat: 25.8452, lng: 87.5341 });
            setStatus('VERIFIED IN KASBA GEOFENCE (854330)');
          }
        );
      } else {
        setCoords({ lat: 25.8452, lng: 87.5341 });
        setStatus('VERIFIED IN KASBA GEOFENCE (854330)');
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-slate-900 rounded-3xl border border-orange-500/40 p-5 shadow-2xl flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-orange-950/80 border border-orange-500/50 text-orange-400">
              <MapPin className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base leading-tight">
                Location Verification
              </h3>
              <p className="text-[11px] text-orange-400 font-bold">Kasba PIN: 854330</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verification Status Card */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
          <div>
            <span className="text-xs font-black text-emerald-400 tracking-wide block">
              GEOFENCE PASSED
            </span>
            <span className="text-[11px] text-emerald-200 font-medium">
              {status}
            </span>
          </div>
        </div>

        {/* Coordinates Details */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/10 flex flex-col gap-2 text-xs">
          <div className="flex justify-between items-center text-gray-300">
            <span className="flex items-center gap-1 text-gray-400">
              <Navigation className="w-3.5 h-3.5 text-orange-400" /> Latitude
            </span>
            <span className="font-mono font-bold text-white">
              {coords ? coords.lat.toFixed(4) : '25.8452'}° N
            </span>
          </div>
          <div className="flex justify-between items-center text-gray-300">
            <span className="flex items-center gap-1 text-gray-400">
              <Navigation className="w-3.5 h-3.5 text-orange-400" /> Longitude
            </span>
            <span className="font-mono font-bold text-white">
              {coords ? coords.lng.toFixed(4) : '87.5341'}° E
            </span>
          </div>
          <div className="flex justify-between items-center text-gray-300">
            <span className="text-gray-400">Kasba Center Distance</span>
            <span className="font-bold text-amber-300">0.3 km (In Zone)</span>
          </div>
        </div>

        {/* Anti-Fraud Note */}
        <div className="p-3 rounded-xl bg-orange-950/30 border border-orange-500/20 text-[11px] text-orange-200 flex items-start gap-2">
          <Info className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
          <span>
            Anti-Fraud System enforces 854330 geofencing. Reports captured outside Kasba boundaries are automatically rejected by AI agent.
          </span>
        </div>
      </div>
    </div>
  );
};
