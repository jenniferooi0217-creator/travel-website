import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Layers, ExternalLink, Info, ZoomIn, ZoomOut } from 'lucide-react';
import { Activity } from '../types/travel';

interface InteractiveMapProps {
  activities: Activity[];
  selectedActivityId?: string;
  onSelectActivity: (id: string) => void;
  destinationName: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  activities,
  selectedActivityId,
  onSelectActivity,
  destinationName,
}) => {
  const [activePopup, setActivePopup] = useState<Activity | null>(null);
  const [mapStyle, setMapStyle] = useState<'vintage' | 'minimal'>('vintage');

  const activeActivity = activities.find(a => a.id === selectedActivityId) || activePopup;

  return (
    <div className="bg-white rounded-3xl border border-[#e8dfd5] shadow-[0_15px_30px_-10px_rgba(45,35,25,0.08)] overflow-hidden flex flex-col h-[520px] lg:h-[620px] sticky top-24">
      {/* Map Header Toolbar */}
      <div className="p-3.5 bg-[#26211e] text-[#faf7f2] flex items-center justify-between border-b border-[#3d312a]">
        <div className="flex items-center gap-2">
          <span className="font-serif italic text-sm tracking-wide">
            Haven Route Radar · {destinationName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-[#a39485] hidden sm:inline">
            {activities.length} Stops Today
          </span>
          <div className="flex items-center bg-[#3d312a] rounded-full p-0.5 text-[10px]">
            <button
              onClick={() => setMapStyle('vintage')}
              className={`px-2.5 py-0.5 rounded-full transition-all ${
                mapStyle === 'vintage' ? 'bg-[#8c4a32] text-white font-medium' : 'text-[#d6ccc2] hover:text-white'
              }`}
            >
              Terracotta
            </button>
            <button
              onClick={() => setMapStyle('minimal')}
              className={`px-2.5 py-0.5 rounded-full transition-all ${
                mapStyle === 'minimal' ? 'bg-[#8c4a32] text-white font-medium' : 'text-[#d6ccc2] hover:text-white'
              }`}
            >
              Sand
            </button>
          </div>
        </div>
      </div>

      {/* Map View Canvas */}
      <div className="relative flex-1 bg-[#faf7f2] overflow-hidden select-none">
        <div className={`absolute inset-0 transition-colors duration-500 ${
          mapStyle === 'vintage' ? 'bg-[#f5efe6]' : 'bg-[#fcfbf9]'
        }`}>
          {/* Subtle Dot Grid */}
          <div 
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#bfae9b 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* SVG Penang Island */}
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="islandFill" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#f7f2ea" />
              </linearGradient>
            </defs>

            {/* Penang Island */}
            <path
              d="M 22 24 C 28 20, 45 18, 55 22 C 65 25, 78 30, 80 42 C 82 50, 78 62, 75 75 C 70 88, 55 92, 45 88 C 30 84, 20 75, 18 60 C 16 45, 18 30, 22 24 Z"
              fill="url(#islandFill)"
              stroke="#d8cdbe"
              strokeWidth="0.75"
              filter="drop-shadow(0px 3px 5px rgba(60,40,20,0.05))"
            />

            {/* Hill Contour */}
            <ellipse
              cx="50"
              cy="50"
              rx="14"
              ry="18"
              fill="#ebdccb"
              stroke="#c7b299"
              strokeWidth="0.5"
              strokeDasharray="1,1"
              opacity="0.7"
            />

            {/* Penang Bridge paths */}
            <line x1="75" y1="62" x2="98" y2="60" stroke="#8c4a32" strokeWidth="0.6" strokeDasharray="1.5,1" opacity="0.6" />
            <line x1="72" y1="78" x2="98" y2="82" stroke="#8c4a32" strokeWidth="0.6" strokeDasharray="1.5,1" opacity="0.6" />

            {/* Connecting Route Line */}
            {activities.length > 1 && (
              <polyline
                points={activities.map(a => `${a.coordinates.x},${a.coordinates.y}`).join(' ')}
                fill="none"
                stroke="#8c4a32"
                strokeWidth="1"
                strokeDasharray="2,1.5"
                className="animate-pulse"
              />
            )}
          </svg>

          {/* Regional Labels */}
          <div className="absolute top-[20%] left-[28%] text-[9px] font-medium tracking-widest uppercase text-[#7a6f66] pointer-events-none">
            Batu Ferringhi
          </div>
          <div className="absolute top-[38%] left-[70%] text-[10px] font-serif italic text-[#8c4a32] pointer-events-none">
            George Town
          </div>
          <div className="absolute top-[52%] left-[44%] text-[9px] font-medium tracking-widest uppercase text-[#4a6b53] pointer-events-none">
            Penang Hill 833m
          </div>
          <div className="absolute bottom-[24%] left-[25%] text-[9px] font-medium tracking-widest uppercase text-[#7a6f66] pointer-events-none">
            Balik Pulau
          </div>
        </div>

        {/* Dynamic Plotted Activity Markers */}
        {activities.map((activity, index) => {
          const isSelected = activity.id === selectedActivityId || activePopup?.id === activity.id;
          return (
            <div
              key={activity.id}
              style={{
                left: `${activity.coordinates.x}%`,
                top: `${activity.coordinates.y}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-300"
            >
              <button
                type="button"
                onClick={() => {
                  onSelectActivity(activity.id);
                  setActivePopup(activity);
                }}
                className={`group relative flex items-center justify-center transition-all ${
                  isSelected ? 'scale-125 z-30' : 'hover:scale-115'
                }`}
                title={`${activity.timeSlot}: ${activity.title}`}
              >
                {isSelected && (
                  <span className="absolute -inset-2 rounded-full bg-[#8c4a32]/30 animate-ping" />
                )}

                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-serif font-medium text-xs shadow-md border-2 transition-all ${
                  isSelected
                    ? 'bg-[#8c4a32] text-white border-white ring-2 ring-[#8c4a32]'
                    : 'bg-[#26211e] text-white border-white hover:bg-[#8c4a32]'
                }`}>
                  {index + 1}
                </div>

                <span className="hidden group-hover:block absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-[#26211e] text-[#faf7f2] text-[10px] font-medium px-2 py-0.5 rounded shadow whitespace-nowrap pointer-events-none z-40">
                  {activity.title}
                </span>
              </button>
            </div>
          );
        })}

        {/* Selected Activity Floating Card */}
        {activeActivity && (
          <div className="absolute bottom-3 left-3 right-3 z-30 bg-[#ffffff]/95 backdrop-blur-md rounded-2xl p-3.5 border border-[#e8dfd5] shadow-lg animate-fadeIn">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5 flex-1">
                <div className="flex items-center gap-1.5 text-[11px] text-[#8c4a32] font-medium">
                  <span className="uppercase tracking-wider">{activeActivity.timeSlot}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#5c5249]">{activeActivity.time}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#4a6b53] font-semibold">{activeActivity.costEstimate}</span>
                </div>

                <h4 className="font-serif text-[#26211e] text-sm sm:text-base font-normal line-clamp-1">
                  {activeActivity.title}
                </h4>

                <div className="flex items-center gap-1 text-[11px] text-[#7a6f66]">
                  <MapPin className="w-3 h-3 text-[#8c4a32] flex-shrink-0" />
                  <span className="line-clamp-1">{activeActivity.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${activeActivity.title} ${activeActivity.location} Penang`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-full bg-[#26211e] hover:bg-[#8c4a32] text-white text-xs font-medium transition-all flex items-center gap-1 shadow-sm"
                  title="Open live navigation in Google Maps"
                >
                  <Navigation className="w-3 h-3 text-[#eddcd2]" />
                  <span>Navigate</span>
                </a>
              </div>
            </div>

            {activeActivity.insiderTip && (
              <p className="mt-2 pt-2 border-t border-[#f0e8dc] text-[11px] text-[#5c3020] italic font-serif line-clamp-1">
                💡 Tip: "{activeActivity.insiderTip}"
              </p>
            )}
          </div>
        )}
      </div>

      {/* Map Footer Bar */}
      <div className="p-3 bg-[#faf7f2] border-t border-[#e8dfd5] text-[#5c5249] text-[11px] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="font-serif italic text-[#8c4a32]">Map Palette:</span>
          <span>● Shophouses & Culture</span>
          <span>● Virgin Rainforest</span>
          <span>● Sunset Coast</span>
        </div>
        <div className="text-[#7a6f66] text-[10px]">
          Click pin to preview waypoint
        </div>
      </div>
    </div>
  );
};
