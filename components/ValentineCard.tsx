import React, { useState, useRef, useEffect, useCallback } from 'react';

// Utility to get a random integer between min and max
const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const ValentineCard: React.FC = () => {
  const [step, setStep] = useState<'question' | 'form' | 'success'>('question');
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
    // Only allow fleeing in the initial question step
    if (step !== 'question') return;
    
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
  }, [step, moveButton]);

  // Attach global mouse move when hovering card might be safer to catch fast movements,
  // but strictly the prompt asks for proximity. 
  // We attach it to the card container to scope it.
  
  // Handle touch start for mobile devices (tap near/on button moves it)
  const handleTouchStartNo = (e: React.TouchEvent) => {
    if (step === 'question') {
      e.preventDefault(); // Prevent click
      moveButton();
    }
  };

  const handleYesClick = () => {
    setStep('form');
  };

  const handleFormOk = () => {
    setStep('success');
  };

  const mailSubject = encodeURIComponent("J'accepte avec plaisir l'invitation 🦖");
  const mailBody = encodeURIComponent(
    "Coucou !\n\nJ'accepte avec plaisir l'invitation et je suis disponible jour et nuit (littéralement) pour toi.\n\nDis-moi quand tu veux, je suis partante ! 🦖💚"
  );
  const mailtoHref = `mailto:eliott.bourrigan@gmail.com?subject=${mailSubject}&body=${mailBody}`;

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="relative w-[92vw] max-w-[720px] aspect-[3/4] sm:aspect-[7/4] md:w-[70vw] lg:w-[640px] bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col transition-all duration-300"
    >
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://dinosaures.atelier-lumieres.com/_astro/hero-desktop-new_d5qnia_1KrnQS.webp" 
          alt="Romantic Background" 
          className="w-full h-full object-cover opacity-80 scale-110 sm:scale-100"
        />
        {/* White overlay to ensure text readability and soft look */}
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full p-6 text-center">
        
        {/* Main Text */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-12 drop-shadow-sm select-none">
          {step === 'success' ? (
            "Youpi :)"
          ) : step === 'form' ? (
            "Quand es-tu disponible ?"
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
        {step === 'question' && (
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
                if (step === 'question') {
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

        {step === 'form' && (
          <div className="w-full max-w-[420px] bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 shadow-[0_10px_25px_rgba(0,0,0,0.08)] p-5 sm:p-6 text-left">
            <div className="text-sm font-semibold text-gray-700 mb-3">Quand es-tu disponible ?</div>
            <label className="flex items-center gap-3 p-4 rounded-xl bg-white/80 border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
              <input
                type="radio"
                name="availability"
                checked
                readOnly
                className="h-4 w-4 accent-green-600"
                aria-label="Absolument tous les jours pour toi"
              />
              <span className="text-sm sm:text-base text-gray-800">
                Absolument tous les jours pour toi &lt;3
              </span>
            </label>
            <a
              href={mailtoHref}
              onClick={handleFormOk}
              className="mt-5 w-full inline-flex items-center justify-center bg-[#4CAF50] hover:bg-[#43a047] text-white px-6 py-3 rounded-full shadow-[0_6px_15px_rgba(0,0,0,0.15)] transform transition-transform duration-200 hover:scale-[1.02] active:scale-95 font-semibold text-sm border-none cursor-pointer outline-none focus:ring-4 focus:ring-green-200"
              aria-label="Valider la disponibilité"
            >
              OK
            </a>
          </div>
        )}

        {/* Celebration Decor (Simple hearts when accepted) */}
        {step === 'success' && (
          <>
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="animate-bounce text-6xl text-green-600 opacity-80 mt-32">🦖</div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};