'use client';

import { Bus, Route } from '@/lib/data/types';
import { Map as MapIcon, Check, Flag, Gauge, X } from 'lucide-react';
import Link from 'next/link';
import { clsx } from 'clsx';

interface BusInfoSheetProps {
  bus: Bus | null;
  route: Route | null;
  onClose: () => void;
}

export function BusInfoSheet({ bus, route, onClose }: BusInfoSheetProps) {
  const isOpen = !!bus;

  if (!bus) return null;

  return (
    <div
      className={clsx(
        "fixed bottom-0 w-full z-40 bg-surface rounded-t-2xl shadow-[0_-8px_24px_rgba(16,42,67,0.14)] border border-outline-variant border-b-0 bottom-sheet flex flex-col transition-transform duration-300 ease-out pb-[calc(72px+env(safe-area-inset-bottom))]",
        isOpen ? "translate-y-0" : "translate-y-full"
      )}
    >
      {/* Drag Handle Area (Click to close for demo) */}
      <div className="w-full pt-3 pb-2 flex items-center justify-center">
        <div className="w-10 h-1 bg-surface-variant rounded-full drag-handle" />
        <button type="button" aria-label="Close bus details" onClick={onClose} className="absolute right-4 top-3 w-11 h-11 rounded-full text-on-surface-variant hover:bg-surface-container-low flex items-center justify-center">
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      <div className="px-page-padding-mobile pb-6 overflow-y-auto flex-1 flex flex-col gap-6 max-h-[60vh]">
        {/* Header & Primary Meta */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-[10px] font-label-caps uppercase tracking-wider">Live now</span>
                <span className="text-on-surface-variant font-label-caps text-label-caps">{bus.id}</span>
              </div>
              <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
                {route?.name || bus.current_route?.name || 'Unknown Route'}
              </h1>
            </div>
            {/* Speed / Status Badge */}
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1 text-primary">
                <Gauge className="w-5 h-5" />
                <span className="font-label-data text-label-data">{Math.round(bus.current_speed || 0)} km/h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Stop Highlight Card */}
        <div className="bg-surface-bright border border-outline-variant rounded-xl p-4 flex justify-between items-center shadow-sm">
          <div className="flex flex-col">
            <span className="text-on-surface-variant font-body-md text-body-md mb-0.5">Next Stop</span>
            <span className="font-headline-sm text-headline-sm text-on-surface">
              {route?.stops?.[1]?.name || 'Library'}
            </span>
          </div>
          <div className="flex flex-col items-end text-right">
            <span className="font-headline-md text-headline-md text-primary tracking-tight">
              12 <span className="text-lg font-normal">min</span>
            </span>
            <span className="text-on-surface-variant font-body-md text-body-md text-xs mt-1">via GPS</span>
          </div>
        </div>

        {/* Route Timeline */}
        <div className="flex flex-col mt-2 relative pl-2">
          <h3 className="font-label-data text-label-data text-on-surface-variant mb-4 uppercase tracking-wider">Route Progress</h3>

          {/* Vertical Line Background */}
          <div className="absolute left-6 top-10 bottom-4 w-[2px] bg-surface-variant z-0"></div>
          {/* Vertical Line Active Progress (simulated) */}
          <div className="absolute left-6 top-10 h-16 w-[2px] bg-primary z-0"></div>

          <div className="flex flex-col gap-6 relative z-10">
            {/* Past Stop */}
            <div className="flex items-start gap-4 opacity-60">
              <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center shrink-0 border-2 border-surface">
                <Check className="w-4 h-4 text-on-surface-variant" />
              </div>
              <div className="flex flex-col pt-1">
                <span className="font-label-data text-label-data text-on-surface line-through decoration-outline-variant">
                  {route?.stops?.[0]?.name || 'Campus Gate'}
                </span>
                <span className="font-body-md text-body-md text-on-surface-variant text-xs">Passed</span>
              </div>
            </div>

            {/* Next/Current Stop */}
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 border-2 border-surface relative">
                <div className="absolute -inset-1 rounded-full border-2 border-primary animate-ping opacity-50"></div>
                <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
              </div>
              <div className="flex flex-col pt-1">
                <span className="font-label-data text-label-data text-on-surface">
                  {route?.stops?.[1]?.name || 'Library'}
                </span>
                <span className="font-body-md text-body-md text-primary text-xs font-medium">Arriving in 12 min</span>
              </div>
            </div>

            {/* Terminal Stop */}
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-surface border-2 border-outline-variant flex items-center justify-center shrink-0">
                <Flag className="w-4 h-4 text-outline-variant" />
              </div>
              <div className="flex flex-col pt-1">
                <span className="font-label-data text-label-data text-on-surface">
                  {route?.stops?.[route.stops.length - 1]?.name || 'Terminal'}
                </span>
                <span className="font-body-md text-body-md text-on-surface-variant text-xs">Est. later</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-surface-variant">
          <Link
            href={`/route/${route?.id || bus.current_route_id}`}
            className="w-full bg-primary-container text-on-primary h-14 rounded-xl font-label-data text-label-data flex items-center justify-center gap-2 hover:bg-primary transition-colors shadow-sm"
          >
            <MapIcon className="w-5 h-5 fill-current" />
            View Full Route
          </Link>
        </div>
      </div>
    </div>
  );
}
