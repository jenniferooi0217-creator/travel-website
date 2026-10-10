import React from 'react';
import { Compass, Sparkles, Heart, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#26211e] text-[#d6ccc2] pt-16 pb-12 border-t border-[#3d312a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#3d312a]">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#8c4a32] text-white flex items-center justify-center font-serif italic text-base">
                P
              </div>
              <div>
                <span className="font-serif text-2xl font-normal text-white">
                  Penang <span className="italic text-[#eddcd2]">Haven</span>
                </span>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#a39485]">
                  Aesthetic Travel Journal & Moodboard
                </p>
              </div>
            </div>

            <p className="text-[#a39485] text-xs leading-relaxed max-w-sm font-light">
              An editorial scrapbook and intelligent travel stylist celebrating the enduring romance, shophouse heritage, and gastronomic poetry of Penang, Malaysia.
            </p>

            <div className="flex items-center gap-3 text-xs text-[#eddcd2] pt-1 font-light">
              <span>✦ Powered by Gemini 3.8</span>
              <span>·</span>
              <span>✦ Vercel & GitHub Ready</span>
            </div>
          </div>

          {/* Chapters */}
          <div className="space-y-3">
            <h4 className="font-serif italic text-white text-sm">
              Featured Havens
            </h4>
            <ul className="space-y-2 text-xs text-[#a39485] font-light">
              <li><a href="#destinations" className="hover:text-[#eddcd2] transition-colors">George Town Shophouses</a></li>
              <li><a href="#destinations" className="hover:text-[#eddcd2] transition-colors">The Habitat Rainforest 833m</a></li>
              <li><a href="#destinations" className="hover:text-[#eddcd2] transition-colors">Chew Jetty Stilt Village</a></li>
              <li><a href="#destinations" className="hover:text-[#eddcd2] transition-colors">Kek Lok Si Temple</a></li>
              <li><a href="#destinations" className="hover:text-[#eddcd2] transition-colors">Batu Ferringhi Sunsets</a></li>
            </ul>
          </div>

          {/* Hawker Secrets */}
          <div className="space-y-3">
            <h4 className="font-serif italic text-white text-sm">
              Culinary Institutions
            </h4>
            <ul className="space-y-2 text-xs text-[#a39485] font-light">
              <li><span>Siam Road Charcoal CKT</span></li>
              <li><span>Air Itam Sister Curry Mee</span></li>
              <li><span>Toh Soon Back-Alley Toast</span></li>
              <li><span>Gurney Drive Night Hawkers</span></li>
              <li><span>Hameediyah Nasi Kandar (1907)</span></li>
            </ul>
          </div>

          {/* Editorial Notes */}
          <div className="space-y-3">
            <h4 className="font-serif italic text-white text-sm">
              The Haven Philosophy
            </h4>
            <p className="text-xs text-[#a39485] leading-relaxed font-light">
              Travel slowly. Wake early to wander quiet five-foot ways before the tropical sun climbs, and seek the aroma of charcoal smoke at twilight.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7a6f66]">
          <p>© {new Date().getFullYear()} Penang Haven. Curated with love for wanderers and food lovers.</p>
          <div className="flex items-center gap-4">
            <span className="font-serif italic text-[#eddcd2]">
              "Where heritage lingers and flavors whisper."
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
