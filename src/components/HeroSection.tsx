import React, { useState } from 'react';
import { Sparkles, Search, Sliders, Calendar, DollarSign, Compass, Utensils, Loader2, ArrowRight, Camera, Film, Sun } from 'lucide-react';
import { QUICK_PROMPTS } from '../data/penangData';

interface HeroSectionProps {
  onGenerateItinerary: (params: {
    prompt: string;
    destination: string;
    durationDays: number;
    travelStyle: string;
    budget: string;
    pace: string;
  }) => Promise<void>;
  isLoading: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onGenerateItinerary,
  isLoading,
}) => {
  const [prompt, setPrompt] = useState('Plan a 3-day aesthetic food & heritage escape to Penang');
  const [destination, setDestination] = useState('Penang, Malaysia');
  const [durationDays, setDurationDays] = useState(3);
  const [travelStyle, setTravelStyle] = useState('Aesthetic & Culinary');
  const [budget, setBudget] = useState('Moderate');
  const [pace, setPace] = useState('Relaxed & Mindful');
  const [showFilters, setShowFilters] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onGenerateItinerary({
      prompt: prompt.trim(),
      destination,
      durationDays,
      travelStyle,
      budget,
      pace,
    });
  };

  const handleQuickPromptClick = (quickPromptText: string) => {
    setPrompt(quickPromptText);
    if (quickPromptText.includes('2-day')) setDurationDays(2);
    if (quickPromptText.includes('3-day')) setDurationDays(3);
    if (quickPromptText.includes('4-day')) setDurationDays(4);

    onGenerateItinerary({
      prompt: quickPromptText,
      destination,
      durationDays: quickPromptText.includes('2-day') ? 2 : quickPromptText.includes('4-day') ? 4 : 3,
      travelStyle,
      budget,
      pace,
    });
  };

  return (
    <section id="hero" className="relative pt-10 pb-16 md:pt-16 md:pb-24 overflow-hidden paper-texture">
      {/* Background warm aesthetic radial glows */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-tr from-[#eddcd2]/50 via-[#f5ebe0]/40 to-[#d6ccc2]/30 rounded-full blur-3xl opacity-70" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Subtitle Kicker */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#8c4a32] font-semibold">
            <span>Issue Nº 04</span>
            <span className="text-[#c7b299]">·</span>
            <span>Penang Haven</span>
            <span className="text-[#c7b299]">·</span>
            <span>Pearl of the Orient</span>
          </div>
        </div>

        {/* Hero Title & Pinterest Editorial Typography */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-serif font-normal text-[#26211e] leading-[1.08] tracking-tight">
            Where Vintage Shophouses, <br />
            <span className="italic font-serif text-[#8c4a32]">Hawker Aromas</span> & Golden Sunsets Meet
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-[#6b5f54] max-w-2xl mx-auto font-light leading-relaxed">
            Your aesthetic travel journal and intelligent AI concierge for Penang, Malaysia. Handcrafted day-by-day itineraries, secret alleyway cafes, and nostalgic culinary stories.
          </p>
        </div>

        {/* Natural Language Search Box - Aesthetic Journal Card */}
        <div className="mt-10 max-w-3xl mx-auto">
          <div className="bg-[#ffffff]/90 backdrop-blur-md rounded-3xl p-3 sm:p-5 shadow-[0_15px_35px_-10px_rgba(45,35,25,0.08)] border border-[#e8dfd5] transition-all hover:shadow-[0_20px_45px_-10px_rgba(45,35,25,0.12)]">
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Input Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div className="relative flex-1 flex items-center">
                  <Search className="w-4 h-4 text-[#a39485] absolute left-4 pointer-events-none" />
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder='e.g., "3 days in George Town for vintage cafes, street murals & sunset beach"'
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#faf7f2] hover:bg-[#f5efe6] focus:bg-white text-[#26211e] placeholder-[#a39485] text-xs sm:text-sm border border-[#e8dfd5] focus:border-[#8c4a32] focus:ring-1 focus:ring-[#8c4a32]/20 outline-none transition-all"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-4 py-3.5 rounded-2xl text-xs uppercase tracking-wider font-semibold border flex items-center gap-1.5 transition-all ${
                      showFilters
                        ? 'bg-[#f4eae0] border-[#d8beac] text-[#8c4a32]'
                        : 'bg-[#faf7f2] hover:bg-[#f5efe6] border-[#e8dfd5] text-[#5c5249]'
                    }`}
                    title="Customize Trip Aesthetics"
                  >
                    <Sliders className="w-3.5 h-3.5 text-[#8c4a32]" />
                    <span className="hidden sm:inline">Vibe & Pace</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    className="flex-1 sm:flex-initial px-6 py-3.5 rounded-2xl bg-[#26211e] hover:bg-[#8c4a32] text-[#faf7f2] font-medium text-xs sm:text-sm shadow-md disabled:opacity-60 transition-all flex items-center justify-center gap-2 whitespace-nowrap active:scale-98"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Curating Haven...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-[#eddcd2]" />
                        <span>Curate Journal</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Preferences Drawer */}
              {showFilters && (
                <div className="pt-3 border-t border-[#f0e8dc] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs animate-fadeIn">
                  <div className="space-y-1">
                    <label className="text-[#7a6f66] font-medium text-[11px] uppercase tracking-wider">Destination</label>
                    <select
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#faf7f2] border border-[#e8dfd5] text-[#26211e] text-xs outline-none focus:border-[#8c4a32]"
                    >
                      <option value="Penang, Malaysia">Penang, Malaysia</option>
                      <option value="George Town Heritage District">George Town UNESCO Core</option>
                      <option value="Batu Ferringhi Coastline">Batu Ferringhi Coastal</option>
                      <option value="Penang Hill & Air Itam">Penang Hill & Air Itam</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#7a6f66] font-medium text-[11px] uppercase tracking-wider">Duration</label>
                    <select
                      value={durationDays}
                      onChange={(e) => setDurationDays(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#faf7f2] border border-[#e8dfd5] text-[#26211e] text-xs outline-none focus:border-[#8c4a32]"
                    >
                      <option value={1}>1 Day (Golden Snapshot)</option>
                      <option value={2}>2 Days (Weekend Escape)</option>
                      <option value={3}>3 Days (The Classic Journal)</option>
                      <option value={4}>4 Days (Deep Discovery)</option>
                      <option value={5}>5 Days (Slow Travel Haven)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#7a6f66] font-medium text-[11px] uppercase tracking-wider">Aesthetic Mood</label>
                    <select
                      value={travelStyle}
                      onChange={(e) => setTravelStyle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#faf7f2] border border-[#e8dfd5] text-[#26211e] text-xs outline-none focus:border-[#8c4a32]"
                    >
                      <option value="Aesthetic & Culinary">Aesthetic & Culinary</option>
                      <option value="Vintage Shophouses & Art">Vintage Shophouses & Art</option>
                      <option value="Misty Rainforest & Canopy">Misty Rainforest & Canopy</option>
                      <option value="Sunset Beach & Golden Hour">Sunset Beach & Golden Hour</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#7a6f66] font-medium text-[11px] uppercase tracking-wider">Travel Pace</label>
                    <select
                      value={pace}
                      onChange={(e) => setPace(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#faf7f2] border border-[#e8dfd5] text-[#26211e] text-xs outline-none focus:border-[#8c4a32]"
                    >
                      <option value="Relaxed & Mindful">Relaxed & Mindful (Slow)</option>
                      <option value="Balanced Explorer">Balanced & Inspiring</option>
                      <option value="Comprehensive">Full Discovery Crawl</option>
                    </select>
                  </div>
                </div>
              )}
            </form>

            {/* Quick Inspiration Row - Zero Pill Clean Aesthetic */}
            <div className="mt-3 pt-3 border-t border-[#f0e8dc] flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
              <span className="text-[#8c4a32] text-[11px] font-serif italic flex-shrink-0">
                Curator's picks:
              </span>
              <div className="flex items-center gap-2 flex-nowrap">
                {QUICK_PROMPTS.map((quickPrompt, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleQuickPromptClick(quickPrompt)}
                    className="px-3 py-1 rounded-full bg-[#f5efe6] hover:bg-[#eddcd2] text-[#5c5249] hover:text-[#8c4a32] text-[11px] font-normal transition-colors whitespace-nowrap"
                  >
                    {quickPrompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pinterest Moodboard Strip / Polaroid Showcase */}
        <div className="mt-14 max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#7a6f66] font-medium">
              Aesthetic Moodboard · George Town & Beyond
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {/* Polaroid 1 */}
            <div className="polaroid-frame relative rotate-[-1.5deg]">
              <div className="washi-tape" />
              <div className="h-44 sm:h-52 w-full overflow-hidden rounded bg-[#f0e8dc]">
                <img
                  src="https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=600&q=80"
                  alt="George Town Street Art"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="pt-2.5 text-center">
                <span className="font-serif italic text-xs text-[#26211e]">Armenian Shophouses</span>
                <p className="text-[10px] text-[#7a6f66] uppercase tracking-wider">Golden Hour Murals</p>
              </div>
            </div>

            {/* Polaroid 2 */}
            <div className="polaroid-frame relative rotate-[1deg]">
              <div className="washi-tape" />
              <div className="h-44 sm:h-52 w-full overflow-hidden rounded bg-[#f0e8dc]">
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80"
                  alt="Siam Road Wok Hei"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="pt-2.5 text-center">
                <span className="font-serif italic text-xs text-[#26211e]">Charcoal Wok Hei</span>
                <p className="text-[10px] text-[#7a6f66] uppercase tracking-wider">Michelin Hawkers</p>
              </div>
            </div>

            {/* Polaroid 3 */}
            <div className="polaroid-frame relative rotate-[-2deg]">
              <div className="washi-tape" />
              <div className="h-44 sm:h-52 w-full overflow-hidden rounded bg-[#f0e8dc]">
                <img
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
                  alt="Penang Hill The Habitat"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="pt-2.5 text-center">
                <span className="font-serif italic text-xs text-[#26211e]">The Habitat 833m</span>
                <p className="text-[10px] text-[#7a6f66] uppercase tracking-wider">Virgin Canopy Walk</p>
              </div>
            </div>

            {/* Polaroid 4 */}
            <div className="polaroid-frame relative rotate-[1.5deg]">
              <div className="washi-tape" />
              <div className="h-44 sm:h-52 w-full overflow-hidden rounded bg-[#f0e8dc]">
                <img
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
                  alt="Batu Ferringhi Sunset"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="pt-2.5 text-center">
                <span className="font-serif italic text-xs text-[#26211e]">Batu Ferringhi Beach</span>
                <p className="text-[10px] text-[#7a6f66] uppercase tracking-wider">Andaman Sunsets</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
