import React, { useState, useRef, useEffect, useCallback } from 'react';

// Utility to get a random integer between min and max
const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const ValentineCard: React.FC = () => {
  const [accepted, setAccepted] = useState(false);
  const [noBtnPosition, setNoBtnPosition] = useState<{ top: number; left: number } | null>(null);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const noBtnRef = useRef<HTMLButtonElement>(null);
  
  // Threshold distance (in pixels) to trigger the flee
  const FLEE_DISTANCE = 60; 

  const moveButton = useCallback(() => {
    if (!cardRef.current || !noBtnRef.current) return;

    const cardRect = cardRef.current.getBoundingClientRect();
    const btnRect = noBtnRef.current.getBoundingClientRect();

    // Calculate available space within the card
    // We add some padding so it doesn't touch the absolute edges
    const padding = 20;
    const maxLeft = cardRect.width - btnRect.width - padding;
    const maxTop = cardRect.height - btnRect.height - padding;

    // Generate new coordinates relative to the card
    const newLeft = getRandomInt(padding, maxLeft);
    const newTop = getRandomInt(padding, maxTop);

    setNoBtnPosition({ top: newTop, left: newLeft });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent | MouseEvent) => {
    // If already accepted, no need to calculate
    if (accepted) return;
    
    // Check refs 
    if (!noBtnRef.current || !cardRef.current) return;

    const btnRect = noBtnRef.current.getBoundingClientRect();
    const btnCenter = {
      x: btnRect.left + btnRect.width / 2,
      y: btnRect.top + btnRect.height / 2,
    };

    const dist = Math.sqrt(
      Math.pow(e.clientX - btnCenter.x, 2) + Math.pow(e.clientY - btnCenter.y, 2)
    );

    // If cursor is close to the button, move it
    if (dist < FLEE_DISTANCE) {
      moveButton();
    }
  }, [accepted, moveButton]);

  // Attach global mouse move when hovering card might be safer to catch fast movements,
  // but strictly the prompt asks for proximity. 
  // We attach it to the card container to scope it.
  
  // Handle touch start for mobile devices (tap near/on button moves it)
  const handleTouchStartNo = (e: React.TouchEvent) => {
    if (!accepted) {
      e.preventDefault(); // Prevent click
      moveButton();
    }
  };

  const handleYesClick = () => {
    setAccepted(true);
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="relative w-[92vw] max-w-[720px] aspect-[7/4] md:w-[70vw] lg:w-[640px] bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col transition-all duration-300"
    >
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://dinosaures.atelier-lumieres.com/_astro/hero-desktop-new_d5qnia_1KrnQS.webp" 
          alt="Romantic Background" 
          className="w-full h-full object-cover opacity-80"
        />
        {/* White overlay to ensure text readability and soft look */}
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full p-6 text-center">
        
        {/* Main Text */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-12 drop-shadow-sm select-none">
          {accepted ? (
            "Youpi <3"
          ) : (
            <>
              <span className="text-gray-800">
                Veux-tu <span className="line-through">être ma valentine</span>
              </span>
              <br />
              <span className="text-green-600">aller voir des dinosaures</span>
              <br />
              <span className="text-gray-800">avec moi ? 🦖</span>
            </>
          )}
        </h1>

        {/* Buttons Container */}
        {!accepted && (
          <div className="flex flex-row items-center gap-6">
            <button
              onClick={handleYesClick}
              className="bg-[#4CAF50] hover:bg-[#43a047] text-white px-8 py-3 rounded-full shadow-[0_6px_15px_rgba(0,0,0,0.15)] transform transition-transform duration-200 hover:scale-105 active:scale-95 font-semibold text-sm border-none cursor-pointer outline-none focus:ring-4 focus:ring-green-200"
              aria-label="Oui, accepter"
            >
              Oui
            </button>

            <button
              ref={noBtnRef}
              onTouchStart={handleTouchStartNo}
              onClick={() => {
                if (!accepted) {
                  moveButton();
                }
              }}
              onMouseEnter={moveButton} // Extra safeguard for desktop
              style={
                noBtnPosition
                  ? {
                      position: 'absolute',
                      top: `${noBtnPosition.top}px`,
                      left: `${noBtnPosition.left}px`,
                      transition: 'top 0.2s ease, left 0.2s ease', // Smooth transition as requested
                    }
                  : {
                      position: 'relative', // Initially relative to sit in the flex flow
                      transition: 'transform 0.2s ease',
                    }
              }
              className="bg-[#F44336] text-white px-8 py-3 rounded-full shadow-[0_6px_15px_rgba(0,0,0,0.15)] font-semibold text-sm border-none cursor-pointer outline-none z-50"
              aria-label="Non, refuser"
            >
              Non
            </button>
          </div>
        )}

        {/* Celebration Decor (Simple hearts when accepted) */}
        {accepted && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
             <div className="animate-bounce text-6xl text-red-500 opacity-80 mt-32">❤️</div>
          </div>
        )}

      </div>
    </div>
  );
};