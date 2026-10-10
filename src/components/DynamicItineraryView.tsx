import React, { useState } from 'react';
import { 
  Calendar, Clock, MapPin, Sparkles, Share2, Printer, 
  ArrowRight, SunMedium, Briefcase, Check, 
  Utensils, Landmark, TreePine, Coffee, Compass
} from 'lucide-react';
import { Itinerary, Activity, ActivityCategory } from '../types/travel';
import { InteractiveMap } from './InteractiveMap';

interface DynamicItineraryViewProps {
  itinerary: Itinerary;
  onRegenerate: () => void;
  onAskAiToModify: (prompt: string) => void;
}

export const DynamicItineraryView: React.FC<DynamicItineraryViewProps> = ({
  itinerary,
  onRegenerate,
  onAskAiToModify,
}) => {
  const [selectedDayNumber, setSelectedDayNumber] = useState(1);
  const [selectedActivityId, setSelectedActivityId] = useState<string | undefined>(undefined);
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const [showPackingModal, setShowPackingModal] = useState(false);

  const currentDay = itinerary.days.find(d => d.dayNumber === selectedDayNumber) || itinerary.days[0];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShareLink(true);
      setTimeout(() => setCopiedShareLink(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getCategoryIcon = (category: ActivityCategory) => {
    switch (category) {
      case 'food':
        return <Utensils className="w-3.5 h-3.5 text-[#8c4a32]" />;
      case 'culture':
        return <Landmark className="w-3.5 h-3.5 text-[#8c4a32]" />;
      case 'nature':
        return <TreePine className="w-3.5 h-3.5 text-[#4a6b53]" />;
      case 'relaxation':
        return <Coffee className="w-3.5 h-3.5 text-[#3b677a]" />;
      case 'coastal':
        return <TreePine className="w-3.5 h-3.5 text-[#3b677a]" />;
      default:
        return <Compass className="w-3.5 h-3.5 text-[#5c5249]" />;
    }
  };

  return (
    <section id="itinerary" className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Journal Cover Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#e8dfd5] shadow-[0_15px_35px_-10px_rgba(45,35,25,0.06)] mb-12 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#f0e8dc]">
          <div className="space-y-2">
            {/* Zero-Pill Unboxed Header Metadata */}
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#8c4a32] font-semibold">
              <span>Penang Haven Journal</span>
              <span aria-hidden="true" className="text-[#c7b299]">·</span>
              <span>{itinerary.durationDays} Days</span>
              <span aria-hidden="true" className="text-[#c7b299]">·</span>
              <span>{itinerary.travelStyle}</span>
              <span aria-hidden="true" className="text-[#c7b299]">·</span>
              <span className="text-[#4a6b53]">Est. {itinerary.estimatedBudgetUSD}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-serif font-normal text-[#26211e] tracking-tight">
              {itinerary.title}
            </h2>

            <p className="text-xs sm:text-sm text-[#6b5f54] max-w-3xl leading-relaxed font-light">
              {itinerary.summary}
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
            <button
              onClick={handleShare}
              className="px-4 py-2 rounded-full bg-[#faf7f2] hover:bg-[#f2ece2] text-[#26211e] text-xs font-medium border border-[#e8dfd5] transition-all flex items-center gap-1.5"
            >
              {copiedShareLink ? <Check className="w-3.5 h-3.5 text-[#4a6b53]" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedShareLink ? 'Link Copied!' : 'Share Journal'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-full bg-[#faf7f2] hover:bg-[#f2ece2] text-[#26211e] text-xs font-medium border border-[#e8dfd5] transition-all flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Scrapbook</span>
            </button>

            <button
              onClick={() => setShowPackingModal(true)}
              className="px-4 py-2 rounded-full bg-[#f4eae0] hover:bg-[#eddcd2] text-[#8c4a32] text-xs font-medium border border-[#d8beac] transition-all flex items-center gap-1.5"
            >
              <Briefcase className="w-3.5 h-3.5 text-[#8c4a32]" />
              <span>Weather & Linen</span>
            </button>
          </div>
        </div>

        {/* Highlight Grid Styled as Editorial Notes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#faf7f2] border border-[#f0e8dc] space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-[#8c4a32] font-semibold flex items-center gap-1">
              <SunMedium className="w-3.5 h-3.5 text-[#8c4a32]" /> Climate Note
            </span>
            <p className="text-[#5c5249] font-light leading-relaxed">
              {itinerary.weatherSummary}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#faf7f2] border border-[#f0e8dc] space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-[#8c4a32] font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#8c4a32]" /> Key Chapters
            </span>
            <p className="text-[#5c5249] font-light leading-relaxed">
              {itinerary.highlights.slice(0, 2).join(' · ')}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#faf7f2] border border-[#f0e8dc] space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-[#4a6b53] font-semibold flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-[#4a6b53]" /> Linen & Essentials
            </span>
            <p className="text-[#5c5249] font-light leading-relaxed">
              {itinerary.packingEssentials.slice(0, 2).join(' · ')}
            </p>
          </div>
        </div>
      </div>

      {/* Day Selector Tabs - Scrapbook Tab Bookmarks */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {itinerary.days.map((day) => {
          const isActive = day.dayNumber === selectedDayNumber;
          return (
            <button
              key={day.dayNumber}
              onClick={() => {
                setSelectedDayNumber(day.dayNumber);
                setSelectedActivityId(undefined);
              }}
              className={`px-5 py-3 rounded-2xl text-left transition-all flex-shrink-0 border ${
                isActive
                  ? 'bg-[#8c4a32] text-white border-[#8c4a32] shadow-md shadow-[#8c4a32]/20'
                  : 'bg-white hover:bg-[#faf7f2] text-[#26211e] border-[#e8dfd5]'
              }`}
            >
              <div className="text-[10px] uppercase tracking-widest font-semibold opacity-85">
                Day {day.dayNumber}
              </div>
              <div className="font-serif italic text-sm mt-0.5 max-w-[210px] truncate">
                {day.theme.replace(/^Day \d+:\s*/, '')}
              </div>
            </button>
          );
        })}
      </div>

      {/* Two Column Layout: Journal Timeline & Route Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Timeline Entries */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-baseline justify-between pb-2">
            <div>
              <h3 className="font-serif text-2xl text-[#26211e]">
                {currentDay.theme}
              </h3>
              <p className="text-xs text-[#7a6f66] mt-0.5">
                {currentDay.activities.length} hand-curated experiences today
              </p>
            </div>

            <button
              onClick={() => onAskAiToModify(`I would like to tailor Day ${selectedDayNumber} of the Penang Haven journal. Could you suggest aesthetic hidden alternatives?`)}
              className="text-xs font-serif italic text-[#8c4a32] hover:text-[#5c3020] transition-colors"
            >
              ✦ Tailor Day {selectedDayNumber} with Haven
            </button>
          </div>

          {/* Timeline Nodes */}
          <div className="relative pl-6 sm:pl-8 border-l border-[#d8cdbe] space-y-7 my-4">
            {currentDay.activities.map((activity, index) => {
              const isSelected = activity.id === selectedActivityId;

              return (
                <div
                  key={activity.id}
                  onClick={() => setSelectedActivityId(activity.id)}
                  className={`group relative bg-white rounded-2xl p-5 border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'border-[#8c4a32] shadow-[0_10px_25px_-5px_rgba(140,74,50,0.12)] ring-1 ring-[#8c4a32]/30 translate-x-1'
                      : 'border-[#e8dfd5] shadow-sm hover:shadow hover:border-[#c7b299]'
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[31px] sm:-left-[39px] top-6 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-serif text-xs border transition-all ${
                    isSelected
                      ? 'bg-[#8c4a32] text-white border-white ring-2 ring-[#eddcd2]'
                      : 'bg-[#26211e] text-[#faf7f2] border-white group-hover:bg-[#8c4a32]'
                  }`}>
                    {index + 1}
                  </div>

                  {/* Header Row: Zero Pill unboxed metadata */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5 text-xs">
                    <div className="flex items-center gap-1.5 text-[#8c4a32] font-medium">
                      {getCategoryIcon(activity.category)}
                      <span className="uppercase tracking-wider text-[11px]">{activity.timeSlot}</span>
                      <span aria-hidden="true" className="text-[#c7b299]">·</span>
                      <span className="text-[#5c5249]">{activity.time}</span>
                    </div>

                    <div className="text-[11px] text-[#4a6b53] font-medium">
                      Est. {activity.costEstimate}
                    </div>
                  </div>

                  {/* Title & Location */}
                  <h4 className="font-serif text-lg text-[#26211e] group-hover:text-[#8c4a32] transition-colors">
                    {activity.title}
                  </h4>

                  <div className="flex items-center gap-1 text-xs text-[#7a6f66] mt-0.5">
                    <MapPin className="w-3 h-3 text-[#8c4a32] flex-shrink-0" />
                    <span className="line-clamp-1">{activity.location}</span>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[#5c5249] mt-2 font-light leading-relaxed">
                    {activity.description}
                  </p>

                  {/* Secret Tip Box */}
                  {activity.insiderTip && (
                    <div className="mt-3 p-3 rounded-xl bg-[#faf7f2] border border-[#f0e8dc] text-xs text-[#5c3020] space-y-0.5">
                      <span className="font-serif italic text-[#8c4a32] text-[11px] block">
                        ✦ Curator's Secret
                      </span>
                      <p className="italic font-light">"{activity.insiderTip}"</p>
                    </div>
                  )}

                  {/* Transport */}
                  {activity.transportToNext && (
                    <div className="mt-3 pt-3 border-t border-[#f0e8dc] flex items-center justify-between text-xs text-[#7a6f66]">
                      <span className="font-serif italic text-[#8c4a32]">Next stroll:</span>
                      <span className="text-[11px] text-[#5c5249] font-light">
                        {activity.transportToNext}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Route Radar Map */}
        <div className="lg:col-span-5">
          <InteractiveMap
            activities={currentDay.activities}
            selectedActivityId={selectedActivityId}
            onSelectActivity={(id) => setSelectedActivityId(id)}
            destinationName={itinerary.destination}
          />
        </div>
      </div>

      {/* Climate & Packing Modal */}
      {showPackingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#faf7f2] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#e8dfd5] space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-[#e8dfd5]">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#8c4a32]" />
                <h3 className="font-serif text-xl text-[#26211e]">
                  Penang Haven Packing Brief
                </h3>
              </div>
              <button
                onClick={() => setShowPackingModal(false)}
                className="text-[#7a6f66] hover:text-[#26211e] text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-[#f4eae0] border border-[#d8beac]">
                <div className="font-serif italic text-[#8c4a32] mb-1">
                  ✦ Climate & Sun Rhythm
                </div>
                <p className="text-[#5c3020] font-light leading-relaxed">
                  {itinerary.weatherSummary}
                </p>
              </div>

              <div>
                <h4 className="font-serif text-[#26211e] mb-2">
                  Linen, Footwear & Essentials Checklist
                </h4>
                <ul className="space-y-2">
                  {itinerary.packingEssentials.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[#5c5249] bg-white p-2.5 rounded-xl border border-[#e8dfd5]">
                      <Check className="w-3.5 h-3.5 text-[#4a6b53] mt-0.5 flex-shrink-0" />
                      <span className="font-light">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={() => setShowPackingModal(false)}
              className="w-full py-3 rounded-full bg-[#26211e] text-[#faf7f2] font-semibold text-xs uppercase tracking-wider hover:bg-[#8c4a32] transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
