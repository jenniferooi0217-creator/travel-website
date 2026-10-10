import React, { useState } from 'react';
import { Star, MapPin, Clock, ExternalLink, Sparkles, X, Compass, Utensils, Heart, Info, CheckCircle2, Bookmark } from 'lucide-react';
import { Destination, CategoryType } from '../types/travel';
import { PENANG_DESTINATIONS } from '../data/penangData';

interface DestinationGalleryProps {
  onAskAboutDestination: (destinationName: string) => void;
  onAddToPlan: (destination: Destination) => void;
  savedDestinations?: string[];
  onToggleSave?: (id: string) => void;
}

export const DestinationGallery: React.FC<DestinationGalleryProps> = ({
  onAskAboutDestination,
  onAddToPlan,
  savedDestinations = [],
  onToggleSave,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [localSaved, setLocalSaved] = useState<string[]>(savedDestinations);

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleSave) {
      onToggleSave(id);
    }
    setLocalSaved(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredDestinations = PENANG_DESTINATIONS.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      item.name.toLowerCase().includes(query) ||
      item.subtitle.toLowerCase().includes(query) ||
      item.tags.some(t => t.toLowerCase().includes(query)) ||
      item.mustTryFood.some(f => f.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="destinations" className="py-20 md:py-28 bg-[#faf7f2] border-t border-[#e8dfd5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-[#8c4a32] font-semibold">
              Curated Moodboard · Penang Haven
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-normal text-[#26211e] tracking-tight">
              Aesthetic Spots & Hidden Sanctuaries
            </h2>
            <p className="text-[#6b5f54] text-xs sm:text-sm max-w-xl font-light leading-relaxed">
              Pin your favorites to your custom Penang Haven board. From pastel heritage five-foot ways to misty tree-canopy walks and seaside supper tables.
            </p>
          </div>

          {/* Aesthetic Search Filter */}
          <div className="w-full md:w-72">
            <input
              type="text"
              placeholder="Search spots, food, mood..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-white text-[#26211e] placeholder-[#a39485] text-xs border border-[#e8dfd5] shadow-sm focus:border-[#8c4a32] outline-none transition-all"
            />
          </div>
        </div>

        {/* Category Tabs Styled with Editorial Clean Segments */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-medium transition-all whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-[#26211e] text-[#faf7f2] shadow-sm'
                : 'bg-white hover:bg-[#f2ece2] text-[#5c5249] border border-[#e8dfd5]'
            }`}
          >
            All Pins ({PENANG_DESTINATIONS.length})
          </button>
          <button
            onClick={() => setSelectedCategory('culture')}
            className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-medium transition-all whitespace-nowrap ${
              selectedCategory === 'culture'
                ? 'bg-[#8c4a32] text-white shadow-sm'
                : 'bg-white hover:bg-[#f2ece2] text-[#5c5249] border border-[#e8dfd5]'
            }`}
          >
            Shophouses & Heritage
          </button>
          <button
            onClick={() => setSelectedCategory('food')}
            className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-medium transition-all whitespace-nowrap ${
              selectedCategory === 'food'
                ? 'bg-[#8c4a32] text-white shadow-sm'
                : 'bg-white hover:bg-[#f2ece2] text-[#5c5249] border border-[#e8dfd5]'
            }`}
          >
            Hawkers & Cafes
          </button>
          <button
            onClick={() => setSelectedCategory('nature')}
            className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-medium transition-all whitespace-nowrap ${
              selectedCategory === 'nature'
                ? 'bg-[#4a6b53] text-white shadow-sm'
                : 'bg-white hover:bg-[#f2ece2] text-[#5c5249] border border-[#e8dfd5]'
            }`}
          >
            Rainforest & Hills
          </button>
          <button
            onClick={() => setSelectedCategory('coastal')}
            className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-medium transition-all whitespace-nowrap ${
              selectedCategory === 'coastal'
                ? 'bg-[#3b677a] text-white shadow-sm'
                : 'bg-white hover:bg-[#f2ece2] text-[#5c5249] border border-[#e8dfd5]'
            }`}
          >
            Sunset Coasts
          </button>
        </div>

        {/* Pinterest-Style Grid with Polaroid Aesthetic */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
          {filteredDestinations.map((dest, idx) => {
            const isFav = localSaved.includes(dest.id);
            return (
              <div
                key={dest.id}
                onClick={() => setSelectedDestination(dest)}
                className="group polaroid-frame rounded-2xl flex flex-col justify-between cursor-pointer"
              >
                {/* Photo Area */}
                <div>
                  <div className="relative h-60 w-full overflow-hidden rounded-xl bg-[#e8dfd5]">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />

                    {/* Pinterest Save Heart Button */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleFavorite(dest.id, e)}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-md ${
                        isFav 
                          ? 'bg-[#8c4a32] text-white' 
                          : 'bg-white/80 text-[#26211e] hover:bg-white hover:text-[#8c4a32]'
                      }`}
                      title={isFav ? 'Pinned to Haven Board' : 'Pin to Board'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Content Area with Zero-Pill Typographic Elegance */}
                  <div className="pt-3.5 pb-2">
                    {/* Unboxed Metadata with Typographic Separator */}
                    <div className="flex items-center gap-1.5 text-[11px] text-[#8c4a32] font-medium tracking-wide">
                      <span className="capitalize">{dest.category}</span>
                      <span aria-hidden="true" className="text-[#c7b299]">·</span>
                      <span className="flex items-center gap-0.5 text-[#26211e]">
                        <Star className="w-3 h-3 text-[#c4823f] fill-[#c4823f]" />
                        <span>{dest.rating}</span>
                      </span>
                      <span aria-hidden="true" className="text-[#c7b299]">·</span>
                      <span className="text-[#7a6f66]">{dest.priceLevel}</span>
                    </div>

                    <h3 className="font-serif text-lg font-medium text-[#26211e] group-hover:text-[#8c4a32] transition-colors mt-1 line-clamp-1">
                      {dest.name}
                    </h3>
                    
                    <p className="font-serif italic text-xs text-[#7a6f66] line-clamp-1">
                      {dest.subtitle}
                    </p>

                    <p className="text-xs text-[#6b5f54] font-light line-clamp-2 mt-2 leading-relaxed">
                      {dest.description}
                    </p>
                  </div>
                </div>

                {/* Card Bottom Actions */}
                <div className="pt-3 border-t border-[#f0e8dc] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#7a6f66] line-clamp-1">
                    {dest.recommendedDuration}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAskAboutDestination(dest.name);
                    }}
                    className="text-[11px] font-semibold text-[#8c4a32] hover:text-[#5c3020] flex items-center gap-1 transition-colors"
                  >
                    <Sparkles className="w-3 h-3 text-[#8c4a32]" />
                    <span>Ask Haven</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scrapbook Detail Modal */}
      {selectedDestination && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div 
            className="bg-[#faf7f2] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#e8dfd5] animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Header */}
            <div className="relative h-64 sm:h-72 w-full overflow-hidden">
              <img
                src={selectedDestination.image}
                alt={selectedDestination.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#26211e] via-[#26211e]/40 to-transparent" />

              <button
                onClick={() => setSelectedDestination(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-white hover:text-stone-900 transition-all"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-5 left-6 right-6 text-white">
                <div className="flex items-center gap-2 mb-1 text-xs text-[#eddcd2] tracking-wider uppercase font-medium">
                  <span>{selectedDestination.category}</span>
                  <span>·</span>
                  <span>{selectedDestination.rating} ★ ({selectedDestination.reviewsCount} reviews)</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-normal text-white">
                  {selectedDestination.name}
                </h3>
                <p className="font-serif italic text-[#eddcd2] text-xs sm:text-sm">
                  {selectedDestination.subtitle}
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              <p className="text-[#5c5249] text-xs sm:text-sm leading-relaxed font-light">
                {selectedDestination.description}
              </p>

              {/* Unboxed Metadata Strip */}
              <div className="grid grid-cols-2 gap-3 py-3 border-y border-[#e8dfd5] text-xs text-[#5c5249]">
                <div>
                  <span className="text-[#8c4a32] font-semibold text-[11px] uppercase tracking-wider block">Location</span>
                  <span>{selectedDestination.location}</span>
                </div>
                <div>
                  <span className="text-[#8c4a32] font-semibold text-[11px] uppercase tracking-wider block">Best Visiting Hour</span>
                  <span>{selectedDestination.bestTime}</span>
                </div>
              </div>

              {/* Highlights */}
              <div className="space-y-2">
                <h4 className="font-serif text-[#26211e] text-base">
                  What Makes It Magical
                </h4>
                <ul className="space-y-1.5 text-xs text-[#5c5249] font-light">
                  {selectedDestination.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#8c4a32] font-serif">✦</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Secret Tip Card - Scrapbook Journal Note */}
              <div className="p-4 rounded-2xl bg-[#f4eae0] border border-[#d8beac] space-y-1">
                <span className="text-[11px] font-semibold text-[#8c4a32] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Haven Curator Secret
                </span>
                <p className="text-xs sm:text-sm text-[#5c3020] italic font-serif leading-relaxed">
                  "{selectedDestination.insiderTip}"
                </p>
              </div>

              {/* Must Try Dishes */}
              <div className="space-y-2">
                <h4 className="font-serif text-[#26211e] text-base">
                  Culinary Notes Nearby
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedDestination.mustTryFood.map((food, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-white border border-[#e8dfd5] text-[#5c5249] text-xs"
                    >
                      🍜 {food}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-[#e8dfd5] flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => {
                    onAskAboutDestination(selectedDestination.name);
                    setSelectedDestination(null);
                  }}
                  className="w-full sm:flex-1 py-3 px-4 rounded-full bg-[#8c4a32] hover:bg-[#6e3926] text-white text-xs uppercase tracking-wider font-semibold transition-all shadow-sm"
                >
                  Ask Haven Concierge About This Spot
                </button>

                <button
                  onClick={() => {
                    onAddToPlan(selectedDestination);
                    setSelectedDestination(null);
                  }}
                  className="w-full sm:w-auto py-3 px-5 rounded-full bg-white hover:bg-[#f2ece2] text-[#26211e] text-xs uppercase tracking-wider font-semibold border border-[#e8dfd5] transition-colors"
                >
                  Pin to Journey
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
