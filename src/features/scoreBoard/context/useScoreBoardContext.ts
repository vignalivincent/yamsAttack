import { useContext } from 'react';
import { ScoreBoardContext } from './scoreBoardContext';

export const useScoreBoardContext = () => {
  const context = useContext(ScoreBoardContext);
  if (context === undefined) {
    throw new Error('useScoreBoardContext must be used within a ScoreBoardProvider');
  }
  return context;
};
