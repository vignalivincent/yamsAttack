import { t } from 'i18next';
import React, { useState, useEffect, useRef } from 'react';
import Confetti from 'react-confetti';

interface YahtzeeAnimationProps {
  isActive: boolean;
  onComplete?: () => void;
  duration?: number;
}

const pulseKeyframes = `
  @keyframes yahtzee-pulse {
    0% {
      opacity: 0.8;
      transform: scale(1);
    }
    100% {
      opacity: 1;
      transform: scale(1.2);
    }
  }
`;

export const YahtzeeAnimation: React.FC<YahtzeeAnimationProps> = ({ isActive, onComplete, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Add the keyframes to the document when component mounts
  useEffect(() => {
    // Create a style element
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.appendChild(document.createTextNode(pulseKeyframes));

    // Add it to the head
    document.head.appendChild(styleElement);

    // Clean up on unmount
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  useEffect(() => {
    if (isActive) {
      setIsVisible(true);

      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete, duration]);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed z-50 pointer-events-none"
      style={{
        zIndex: 9999,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        height: '100vh',
      }}>
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        numberOfPieces={1000}
        recycle={false}
        gravity={0.5}
        colors={['#FFD700', '#FFA500', '#FFFFFF', '#FF4500']}
        confettiSource={{
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
          w: 200,
          h: 40,
        }}
        initialVelocityX={{ min: -10, max: 10 }}
        initialVelocityY={{ min: -15, max: 15 }}
        tweenDuration={100}
      />

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        <div
          className="text-4xl font-bold text-[#FFD700]"
          style={{
            textShadow: '0 0 10px rgba(255, 215, 0, 0.6), 0 0 20px rgba(255, 165, 0, 0.4)',
            animation: 'yahtzee-pulse 1s infinite alternate',
          }}>
          {t('animations.yahtzee')}
        </div>
      </div>
    </div>
  );
};
