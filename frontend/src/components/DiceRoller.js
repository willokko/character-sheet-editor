import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

const DiceRoller = ({ quantidade, onRollComplete }) => {
  const diceContainerRef = useRef(null);
  const [result, setResult] = useState(null);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onRollComplete();
    }
  };

  useEffect(() => {
    // Se quantidade for 0, não rola dados
    if (quantidade === 0) {
      setResult({ rolls: [], highest: 0 });
      return;
    }

    const rolls = [];
    for (let i = 0; i < quantidade; i++) {
      const roll = Math.floor(Math.random() * 6) + 1;
      rolls.push(roll);
    }

    // Encontrar o maior valor
    const highestRoll = Math.max(...rolls);

    // Animação dos dados
    gsap.fromTo(
      diceContainerRef.current.children,
      {
        scale: 0,
        opacity: 0,
        y: -50,
      },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.7)",
        onComplete: () => {
          setResult({ rolls, highest: highestRoll });
        }
      }
    );
  }, [quantidade]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-dark-lighter p-6 rounded-lg shadow-lg">
        {quantidade === 0 ? (
          <div className="text-center text-2xl font-bold text-red-600">
            Atributo é 0
          </div>
        ) : (
          <>
            <div ref={diceContainerRef} className="flex gap-2 mb-4 flex-wrap justify-center">
              {result ? (
                result.rolls.map((roll, i) => (
                  <div
                    key={i}
                    className={`w-12 h-12 text-white rounded-lg flex items-center justify-center text-xl font-bold
                      ${roll === result.highest ? 'bg-purple-700 border-4 border-primary' : 'bg-purple-600'}`}
                  >
                    {roll}
                  </div>
                ))
              ) : (
                Array(quantidade).fill(null).map((_, i) => (
                  <div
                    key={i}
                    className="w-12 h-12 bg-purple-600 text-white rounded-lg flex items-center justify-center text-xl font-bold"
                  >
                    ?
                  </div>
                ))
              )}
            </div>
            <div className="text-center text-2xl font-bold text-white">
              Maior Valor: {result ? result.highest : '?'}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DiceRoller;
