import { useState, useCallback } from 'react';

export function useYahtzeeAnimation(duration = 3000) {
  const [isAnimationActive, setIsAnimationActive] = useState(false);

  const playAnimation = useCallback(() => {
    setIsAnimationActive(true);
  }, []);

  const handleAnimationComplete = useCallback(() => {
    setIsAnimationActive(false);
  }, []);

  return {
    isAnimationActive,
    playAnimation,
    handleAnimationComplete,
    animationDuration: duration,
  };
}
