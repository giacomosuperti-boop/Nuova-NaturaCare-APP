import React, { useState, useEffect } from 'react';

const LOADING_MESSAGES = [
  "Stiamo preparando la tua ricetta...",
  "Mescolando gli ingredienti...",
  "Consultando gli antichi manuali...",
  "Dosando le erbe...",
  "Quasi pronto..."
];

export const LoadingScreen: React.FC = () => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-6 animate-fade-in">
      
      {/* Witch Cauldron Animation */}
      <div className="relative w-48 h-48 mb-8">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Bubbles */}
          <g className="animate-pulse">
             <circle cx="80" cy="70" r="5" fill="#4ade80" opacity="0.6">
               <animate attributeName="cy" values="70;40" dur="2s" repeatCount="indefinite" />
               <animate attributeName="opacity" values="0.6;0" dur="2s" repeatCount="indefinite" />
             </circle>
             <circle cx="120" cy="60" r="8" fill="#4ade80" opacity="0.6">
               <animate attributeName="cy" values="60;30" dur="2.5s" repeatCount="indefinite" />
               <animate attributeName="opacity" values="0.6;0" dur="2.5s" repeatCount="indefinite" />
             </circle>
             <circle cx="100" cy="80" r="4" fill="#4ade80" opacity="0.6">
               <animate attributeName="cy" values="80;50" dur="1.5s" repeatCount="indefinite" />
               <animate attributeName="opacity" values="0.6;0" dur="1.5s" repeatCount="indefinite" />
             </circle>
          </g>

          {/* Spoon/Ladle Handle */}
          <path d="M 140 40 L 100 100" stroke="#78350f" strokeWidth="8" strokeLinecap="round">
            <animateTransform 
              attributeName="transform" 
              type="rotate" 
              from="0 100 100" 
              to="360 100 100" 
              dur="3s" 
              repeatCount="indefinite" 
            />
          </path>

          {/* Cauldron Back */}
          <path d="M 40 100 Q 100 180 160 100" fill="#1c1917" />
          
          {/* Liquid */}
          <path d="M 45 100 Q 100 170 155 100" fill="#22c55e" opacity="0.8" />
          <ellipse cx="100" cy="100" rx="57" ry="10" fill="#4ade80" />

          {/* Cauldron Rim */}
          <ellipse cx="100" cy="100" rx="60" ry="12" fill="none" stroke="#44403c" strokeWidth="4" />
          
          {/* Witch Hat (Floating) */}
          <g transform="translate(10, -20)">
            <path d="M 40 50 L 10 50 L 25 10 Z" fill="#7e22ce" stroke="#581c87" strokeWidth="2">
                <animateTransform 
                  attributeName="transform" 
                  type="translate" 
                  values="0,0; 0,-5; 0,0" 
                  dur="2s" 
                  repeatCount="indefinite" 
                />
            </path>
            <ellipse cx="25" cy="50" rx="20" ry="5" fill="#7e22ce" stroke="#581c87" strokeWidth="2">
                 <animateTransform 
                  attributeName="transform" 
                  type="translate" 
                  values="0,0; 0,-5; 0,0" 
                  dur="2s" 
                  repeatCount="indefinite" 
                />
            </ellipse>
          </g>
        </svg>
      </div>

      <h2 className="text-xl font-bold text-stone-800 text-center mb-2">
        {LOADING_MESSAGES[msgIndex]}
      </h2>
      <p className="text-stone-500 text-sm text-center max-w-xs">
        L'intelligenza artificiale sta combinando i tuoi ingredienti per creare il rimedio perfetto.
      </p>
    </div>
  );
};