import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DestinationGallery } from './components/DestinationGallery';
import { DynamicItineraryView } from './components/DynamicItineraryView';
import { AiChatWidget } from './components/AiChatWidget';
import { Footer } from './components/Footer';
import { DEFAULT_PENANG_ITINERARY } from './data/penangData';
import { Destination, Itinerary } from './types/travel';
import { Sparkles, Heart } from 'lucide-react';

export default function App() {
  const [itinerary, setItinerary] = useState<Itinerary>(DEFAULT_PENANG_ITINERARY);
  const [isLoadingItinerary, setIsLoadingItinerary] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatExternalPrompt, setChatExternalPrompt] = useState<string | undefined>(undefined);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [savedDestinations, setSavedDestinations] = useState<string[]>(['george-town-heritage', 'penang-hill-the-habitat']);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleSave = (id: string) => {
    setSavedDestinations(prev => {
      const isSaved = prev.includes(id);
      if (isSaved) {
        showToast('Removed from your Penang Haven board');
        return prev.filter(x => x !== id);
      } else {
        showToast('✦ Pinned to your Penang Haven board');
        return [...prev, id];
      }
    });
  };

  const handleGenerateItinerary = async (params: {
    prompt: string;
    destination: string;
    durationDays: number;
    travelStyle: string;
    budget: string;
    pace: string;
  }) => {
    setIsLoadingItinerary(true);
    showToast(`Curating Penang Haven journal for ${params.destination}...`);

    try {
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate itinerary: ${response.status}`);
      }

      const data = await response.json();
      if (data.itinerary) {
        setItinerary(data.itinerary);
        showToast(`✦ Beautifully curated your ${params.durationDays}-day journal!`);
        
        setTimeout(() => {
          document.getElementById('itinerary')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    } catch (error) {
      console.error('Error generating itinerary:', error);
      showToast('✦ Displaying curated Penang Haven journal.');
    } finally {
      setIsLoadingItinerary(false);
    }
  };

  const handleAskAboutDestination = (destinationName: string) => {
    setChatExternalPrompt(`Tell me the most photogenic spots, secret food stalls, and best visiting hours for ${destinationName} in Penang.`);
    setIsChatOpen(true);
  };

  const handleAddToPlan = (dest: Destination) => {
    const updatedItinerary = { ...itinerary };
    const targetDay = updatedItinerary.days[0];
    
    if (targetDay) {
      const newActivity = {
        id: `custom-${Date.now()}`,
        timeSlot: 'Afternoon' as const,
        time: '03:30 PM - 05:00 PM',
        title: dest.name,
        description: dest.description,
        category: dest.category === 'culture' ? ('culture' as const) : dest.category === 'food' ? ('food' as const) : ('nature' as const),
        location: dest.location,
        costEstimate: dest.priceLevel === 'Free' ? 'Free' : '$5 - $10',
        duration: dest.recommendedDuration,
        insiderTip: dest.insiderTip,
        coordinates: dest.coordinates,
      };

      targetDay.activities.push(newActivity);
      setItinerary(updatedItinerary);
      showToast(`✦ Pinned "${dest.name}" into Day 1 of your journal!`);
      
      document.getElementById('itinerary')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2] text-[#26211e] selection:bg-[#eddcd2] selection:text-[#8c4a32]">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-24 right-4 sm:right-8 z-50 animate-fadeIn">
          <div className="bg-[#26211e] text-[#faf7f2] text-xs font-medium px-4 py-3 rounded-full shadow-xl flex items-center gap-2 border border-[#3d312a]">
            <span className="text-[#e8cbb6] text-sm">✦</span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        onOpenPlanner={() => {
          document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenChat={() => setIsChatOpen(true)}
        onNavigateSection={handleNavigateSection}
        savedCount={savedDestinations.length}
      />

      <main className="flex-1">
        {/* AI Discovery Hero Section */}
        <HeroSection
          onGenerateItinerary={handleGenerateItinerary}
          isLoading={isLoadingItinerary}
        />

        {/* Destination Gallery (Pinterest Moodboard) */}
        <DestinationGallery
          onAskAboutDestination={handleAskAboutDestination}
          onAddToPlan={handleAddToPlan}
          savedDestinations={savedDestinations}
          onToggleSave={handleToggleSave}
        />

        {/* Dynamic Itinerary Timeline View with Interactive Map */}
        <DynamicItineraryView
          itinerary={itinerary}
          onRegenerate={() => {
            handleGenerateItinerary({
              prompt: `Remix and refresh a slow-travel 3-day Penang Haven aesthetic journey`,
              destination: itinerary.destination,
              durationDays: itinerary.durationDays,
              travelStyle: itinerary.travelStyle,
              budget: itinerary.budget,
              pace: itinerary.pace,
            });
          }}
          onAskAiToModify={(prompt) => {
            setChatExternalPrompt(prompt);
            setIsChatOpen(true);
          }}
        />
      </main>

      {/* Persistent Haven Concierge Chat Assistant */}
      <AiChatWidget
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
        externalPrompt={chatExternalPrompt}
        onClearExternalPrompt={() => setChatExternalPrompt(undefined)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
