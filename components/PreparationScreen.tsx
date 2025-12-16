import React, { useState, useEffect, useRef } from 'react';
import { Recipe } from '../types';

interface PreparationScreenProps {
  recipe: Recipe;
  onExit: () => void;
  onComplete: () => void;
}

interface Message {
  id: number;
  type: 'app' | 'user';
  text: string;
  isTip?: boolean;
}

export const PreparationScreen: React.FC<PreparationScreenProps> = ({ recipe, onExit, onComplete }) => {
  const [stepIndex, setStepIndex] = useState(-1); // -1 = Start, 0...N = Steps, N+1 = Finish
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initial greeting
  useEffect(() => {
    if (stepIndex === -1) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages([{ id: 0, type: 'app', text: "Pronti? Iniziamo! 🌿" }]);
        setIsTyping(false);
        // Start first step automatically after greeting
        setTimeout(() => {
            advanceStep(0);
        }, 1000);
      }, 800);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const advanceStep = (nextIndex: number) => {
    setStepIndex(nextIndex);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      
      if (nextIndex < recipe.steps.length) {
        // Normal Step
        const step = recipe.steps[nextIndex];
        const newMsgs: Message[] = [
           { id: Date.now(), type: 'app', text: step.instruction }
        ];
        if (step.tip) {
           newMsgs.push({ id: Date.now() + 1, type: 'app', text: step.tip, isTip: true });
        }
        setMessages(prev => [...prev, ...newMsgs]);
      } else {
        // Finish
        setMessages(prev => [
            ...prev,
            { id: Date.now(), type: 'app', text: "Perfetto! Il tuo rimedio è pronto! 🎉" },
            { id: Date.now() + 100, type: 'app', text: "Goditi il tuo momento di benessere naturale." }
        ]);
      }
    }, 1500); // Simulate "thinking/typing" time
  };

  const handleUserDone = () => {
    // Add user confirmation bubble
    setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: "Fatto! ✓" }]);
    // Advance
    advanceStep(stepIndex + 1);
  };

  const isFinished = stepIndex >= recipe.steps.length;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-stone-900 text-stone-800">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {recipe.imageUrl && (
            <img src={recipe.imageUrl} alt="" className="w-full h-full object-cover" />
        )}
        {/* Dark overlay to ensure text is readable even with transparency */}
        <div className="absolute inset-0 bg-stone-900/40"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-4 flex items-center justify-between text-white drop-shadow-md">
        <button onClick={() => setShowExitConfirm(true)} className="p-2 -ml-2 rounded-full hover:bg-white/20 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="font-medium text-sm bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
           {isFinished ? 'Completato' : `Passaggio ${Math.max(1, stepIndex + 1)} di ${recipe.steps.length}`}
        </div>
        <div className="w-8"></div> {/* Spacer for centering */}
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 relative z-10 space-y-6 no-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.type === 'user' ? 'justify-end' : 'justify-center'}`}
          >
            <div
              className={`px-6 py-5 rounded-2xl text-[15px] leading-relaxed shadow-lg backdrop-blur-md ${
                msg.type === 'user'
                  ? 'bg-nature-600/80 text-white max-w-[80%] rounded-br-sm'
                  : msg.isTip
                    ? 'bg-yellow-50/80 text-stone-800 max-w-[95%] w-full border-l-4 border-yellow-400 font-medium'
                    : 'bg-white/80 text-stone-900 max-w-[95%] w-full'
              }`}
            >
              {msg.isTip && <span className="font-bold text-yellow-700 block mb-1 uppercase text-xs tracking-wider">💡 Il Consiglio</span>}
              {msg.text}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-center w-full">
            <div className="bg-white/80 px-6 py-4 rounded-2xl backdrop-blur-md max-w-[95%] w-full">
              <div className="flex space-x-2 justify-center">
                <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Interaction Area */}
      <div className="relative z-10 p-6 pt-4 bg-gradient-to-t from-stone-900/90 via-stone-900/60 to-transparent">
        {!isFinished ? (
            <button
            onClick={handleUserDone}
            disabled={isTyping}
            className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl backdrop-blur-sm transition-all transform active:scale-95 ${
                isTyping 
                ? 'bg-stone-600/60 text-stone-300 cursor-not-allowed border border-stone-500/30' 
                : 'bg-nature-600/90 hover:bg-nature-500/90 text-white border border-nature-400/30'
            }`}
            >
            Fatto! ✓
            </button>
        ) : (
            <div className="flex flex-col gap-3">
                <button
                    onClick={onComplete}
                    className="w-full py-4 rounded-2xl bg-white/90 text-stone-800 font-bold text-lg shadow-lg hover:bg-white transition-all active:scale-95 backdrop-blur-md"
                >
                    Nuovo rimedio
                </button>
                <button disabled className="w-full py-3 rounded-2xl bg-black/40 text-white/50 text-sm font-medium border border-white/10 cursor-not-allowed backdrop-blur-sm">
                    Salva ricetta (Presto disponibile)
                </button>
            </div>
        )}
      </div>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-bold text-stone-800 mb-2">Vuoi uscire?</h3>
            <p className="text-stone-600 mb-6">Perderai i progressi della preparazione attuale.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-3 rounded-xl bg-stone-100 text-stone-700 font-medium hover:bg-stone-200"
              >
                Annulla
              </button>
              <button
                onClick={onExit}
                className="flex-1 py-3 rounded-xl bg-red-50 text-red-600 font-medium hover:bg-red-100"
              >
                Esci
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};