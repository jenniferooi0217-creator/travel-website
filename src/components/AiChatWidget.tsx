import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Send, Sparkles, Bot, User, Trash2, 
  Maximize2, Minimize2, Loader2, Heart, Camera
} from 'lucide-react';
import { ChatMessage } from '../types/travel';

const HAVEN_SUGGESTIONS = [
  'Most photogenic shophouses in George Town?',
  'What should I pack for an aesthetic Penang trip?',
  'Best sunset viewpoints along Batu Ferringhi?',
  'Hidden back-alley coffee roasters & kaya toast',
  'Legendary Michelin hawkers to not miss',
];

interface AiChatWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  externalPrompt?: string;
  onClearExternalPrompt?: () => void;
}

export const AiChatWidget: React.FC<AiChatWidgetProps> = ({
  isOpen,
  onToggle,
  externalPrompt,
  onClearExternalPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: "✦ Hello, welcome to **Penang Haven**.\n\nI am your **Haven Concierge** — your aesthetic travel stylist for Penang.\n\nWhether you are looking for **golden hour photo spots**, **nostalgic back-alley char kway teow**, or a **breezy linen packing list**, I am delighted to assist.",
      timestamp: 'Just now',
      suggestions: HAVEN_SUGGESTIONS.slice(0, 3),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (externalPrompt) {
      handleSendMessage(externalPrompt);
      if (onClearExternalPrompt) onClearExternalPrompt();
    }
  }, [externalPrompt]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = (queryText || inputValue).trim();
    if (!textToSend || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: textToSend,
          destination: 'Penang, Malaysia',
          messages: messages.map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            content: m.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Here is what I curated for you in Penang Haven.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isFallback: data.isFallback,
        suggestions: HAVEN_SUGGESTIONS.filter(s => s !== textToSend).slice(0, 2),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: `### ✦ Penang Haven Travel Note\n\nPenang is an enchanting meeting of Peranakan heritage and world-class street cuisine.\n\n- **Aesthetic Spots:** Armenian Street shophouses, Cheong Fatt Tze Blue Mansion, and Hin Bus Depot art gardens.\n- **Golden Hour:** 6:45 PM along Batu Ferringhi or Chew Jetty.\n- **Hawker Classics:** Siam Road charcoal Char Kway Teow, Air Itam Assam Laksa, and Toh Soon charcoal toast.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: HAVEN_SUGGESTIONS.slice(0, 2),
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: 'assistant',
        text: "✦ Your Penang Haven conversation has been refreshed. Where shall we wander next?",
        timestamp: 'Just now',
        suggestions: HAVEN_SUGGESTIONS.slice(0, 3),
      },
    ]);
  };

  const renderFormattedMessage = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="font-serif italic text-[#8c4a32] text-sm mt-2 mb-1">
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h3 key={idx} className="font-serif text-[#26211e] text-base mt-2 mb-1">
            {line.replace('## ', '')}
          </h3>
        );
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const bulletText = line.replace(/^[-*]\s+/, '');
        return (
          <li key={idx} className="ml-3 text-xs leading-relaxed list-disc text-[#5c5249]">
            {formatBold(bulletText)}
          </li>
        );
      }
      if (/^\d+\.\s+/.test(line)) {
        return (
          <li key={idx} className="ml-3 text-xs leading-relaxed list-decimal text-[#5c5249]">
            {formatBold(line.replace(/^\d+\.\s+/, ''))}
          </li>
        );
      }
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p key={idx} className="text-xs leading-relaxed my-0.5 text-[#5c5249]">
          {formatBold(line)}
        </p>
      );
    });
  };

  const formatBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-medium text-[#26211e]">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <>
      {/* Persistent Floating Trigger Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={onToggle}
            className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#26211e] hover:bg-[#8c4a32] text-[#faf7f2] shadow-[0_12px_30px_rgba(40,30,20,0.25)] hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 border border-[#e8dfd5]/30"
            aria-label="Open Penang Haven Concierge"
          >
            <span className="w-2 h-2 rounded-full bg-[#e8cbb6] animate-pulse" />
            <span className="font-serif italic text-sm tracking-wide">
              Haven Concierge
            </span>
          </button>
        </div>
      )}

      {/* Floating Chat UI Drawer */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 shadow-2xl border border-[#e8dfd5] rounded-3xl bg-[#faf7f2] flex flex-col overflow-hidden ${
            isExpanded
              ? 'inset-4 sm:inset-10 max-w-4xl mx-auto'
              : 'bottom-5 right-5 sm:bottom-6 sm:right-6 w-[calc(100vw-40px)] sm:w-[410px] h-[580px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-[#26211e] text-[#faf7f2] p-4 flex items-center justify-between border-b border-[#3d312a]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#8c4a32] text-[#faf7f2] flex items-center justify-center font-serif italic text-sm">
                ✦
              </div>
              <div>
                <h3 className="font-serif italic text-sm tracking-wide">
                  Haven Concierge
                </h3>
                <p className="text-[10px] uppercase tracking-wider text-[#a39485]">
                  Penang Haven Travel Stylist
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[#a39485]">
              <button
                onClick={handleClearHistory}
                className="p-1.5 hover:text-white rounded-lg transition-colors"
                title="Clear conversation"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 hover:text-white rounded-lg transition-colors hidden sm:block"
                title={isExpanded ? 'Restore size' : 'Expand window'}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={onToggle}
                className="p-1.5 hover:text-white rounded-lg transition-colors"
                title="Minimize assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Suggestion Chips */}
          <div className="p-2.5 bg-[#f4eae0] border-b border-[#e8dfd5] flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
            <span className="text-[#8c4a32] font-serif italic flex-shrink-0 text-[10px]">
              Suggestions:
            </span>
            {HAVEN_SUGGESTIONS.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(sug)}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-[#eddcd2] text-[#5c5249] hover:text-[#8c4a32] border border-[#e8dfd5] transition-colors whitespace-nowrap text-[10px] flex-shrink-0"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#faf7f2]/80">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-serif italic ${
                    isUser ? 'bg-[#8c4a32] text-white' : 'bg-[#26211e] text-[#eddcd2]'
                  }`}>
                    {isUser ? 'You' : '✦'}
                  </div>

                  <div className={`max-w-[82%] rounded-2xl p-3.5 space-y-1 shadow-sm ${
                    isUser
                      ? 'bg-[#8c4a32] text-white rounded-tr-none'
                      : 'bg-white text-[#26211e] border border-[#e8dfd5] rounded-tl-none'
                  }`}>
                    <div className="text-xs">
                      {isUser ? msg.text : renderFormattedMessage(msg.text)}
                    </div>

                    <div className={`text-[9px] pt-1 flex items-center justify-end gap-1 ${
                      isUser ? 'text-[#eddcd2]' : 'text-[#a39485]'
                    }`}>
                      {msg.timestamp}
                    </div>

                    {!isUser && msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-[#f0e8dc] space-y-1">
                        <div className="flex flex-wrap gap-1">
                          {msg.suggestions.map((sug, i) => (
                            <button
                              key={i}
                              onClick={() => handleSendMessage(sug)}
                              className="text-[10px] text-[#8c4a32] bg-[#faf7f2] hover:bg-[#f4eae0] px-2 py-0.5 rounded-full border border-[#e8dfd5] transition-colors"
                            >
                              ↳ {sug}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#26211e] text-[#eddcd2] flex items-center justify-center text-xs font-serif italic flex-shrink-0">
                  ✦
                </div>
                <div className="bg-white border border-[#e8dfd5] rounded-2xl rounded-tl-none p-3 shadow-sm flex items-center gap-2 text-[#7a6f66] text-xs">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#8c4a32]" />
                  <span>Curating Haven travel notes...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-white border-t border-[#e8dfd5]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about photo spots, cafes, packing..."
                className="flex-1 px-3.5 py-2.5 rounded-2xl bg-[#faf7f2] text-[#26211e] placeholder-[#a39485] text-xs border border-[#e8dfd5] focus:bg-white focus:border-[#8c4a32] outline-none transition-all"
                disabled={isLoading}
              />

              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="p-2.5 rounded-2xl bg-[#8c4a32] hover:bg-[#6e3926] disabled:opacity-50 text-white shadow-sm transition-all flex items-center justify-center active:scale-95"
                title="Send inquiry"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
