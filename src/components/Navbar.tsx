import React, { useState } from 'react';
import { Sparkles, MapPin, Calendar, MessageSquare, Menu, X, ArrowRight, Heart } from 'lucide-react';

interface NavbarProps {
  onOpenPlanner: () => void;
  onOpenChat: () => void;
  onNavigateSection: (sectionId: string) => void;
  savedCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenPlanner,
  onOpenChat,
  onNavigateSection,
  savedCount = 0,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    onNavigateSection(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#faf7f2]/90 backdrop-blur-md border-b border-[#e8dfd5] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Editorial Title */}
        <div 
          onClick={() => handleNavClick('hero')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full bg-[#3d312a] text-[#faf7f2] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <span className="font-serif italic text-lg font-medium">P</span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-2xl sm:text-[26px] font-semibold tracking-tight text-[#26211e]">
                Penang <span className="italic font-normal text-[#8c4a32]">Haven</span>
              </span>
            </div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#7a6f66] font-medium">
              Curated Travel Journal & Concierge
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links - Clean Typography without Pill Slop */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <button
            onClick={() => handleNavClick('destinations')}
            className="text-xs uppercase tracking-widest font-medium text-[#5c5249] hover:text-[#8c4a32] transition-colors relative py-1 hover:border-b hover:border-[#8c4a32]"
          >
            Aesthetic Spots
          </button>
          <button
            onClick={() => handleNavClick('itinerary')}
            className="text-xs uppercase tracking-widest font-medium text-[#5c5249] hover:text-[#8c4a32] transition-colors relative py-1 hover:border-b hover:border-[#8c4a32]"
          >
            Daily Journal
          </button>
          <button
            onClick={onOpenChat}
            className="text-xs uppercase tracking-widest font-medium text-[#5c5249] hover:text-[#8c4a32] transition-colors relative py-1 hover:border-b hover:border-[#8c4a32]"
          >
            Haven Concierge
          </button>
        </nav>

        {/* Right Actions */}
        <div className="hidden sm:flex items-center gap-4">
          <button
            onClick={() => handleNavClick('destinations')}
            className="flex items-center gap-1.5 text-xs text-[#5c5249] hover:text-[#8c4a32] font-medium transition-colors"
            title="Saved Inspiration"
          >
            <Heart className={`w-4 h-4 ${savedCount > 0 ? 'fill-[#8c4a32] text-[#8c4a32]' : 'text-[#7a6f66]'}`} />
            <span>Saved ({savedCount})</span>
          </button>

          <button
            onClick={onOpenPlanner}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#26211e] hover:bg-[#8c4a32] text-[#faf7f2] text-xs uppercase tracking-wider font-semibold shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#e8cbb6]" />
            <span>Curate Itinerary</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenPlanner}
            className="p-2 rounded-full bg-[#8c4a32] text-white text-xs"
            title="Curate Itinerary"
          >
            <Sparkles className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#3d312a] hover:bg-[#f2ece2]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#e8dfd5] bg-[#faf7f2]/98 px-5 pt-3 pb-6 space-y-3 animate-fadeIn">
          <button
            onClick={() => handleNavClick('destinations')}
            className="w-full text-left py-2 text-sm font-medium text-[#26211e] hover:text-[#8c4a32]"
          >
            Aesthetic Spots & Moodboard
          </button>
          <button
            onClick={() => handleNavClick('itinerary')}
            className="w-full text-left py-2 text-sm font-medium text-[#26211e] hover:text-[#8c4a32]"
          >
            Daily Travel Journal
          </button>
          <button
            onClick={() => {
              onOpenChat();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 text-sm font-medium text-[#26211e] hover:text-[#8c4a32]"
          >
            Haven Concierge (AI)
          </button>

          <div className="pt-2">
            <button
              onClick={() => {
                onOpenPlanner();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#26211e] text-[#faf7f2] font-semibold text-xs uppercase tracking-wider shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              Curate Custom Itinerary
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
