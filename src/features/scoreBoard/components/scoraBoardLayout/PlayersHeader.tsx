import { FC } from 'react';
import { Crown, LucideBadgeInfo } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useScrollDetection } from '@/hooks/useScrollDetection';
import { calculateTotal } from '@/store/utils';
import { useLeaderBoard, usePlayerList } from '@/store/selectors';

interface PlayersHeaderProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const PlayersHeader: FC<PlayersHeaderProps> = ({ isExpanded, onToggleExpand }) => {
  const playList = usePlayerList();
  const leaderboard = useLeaderBoard();
  const leadingPlayerId = leaderboard[0].id;
  const hasScrolled = useScrollDetection();
  const truncateName = (name: string): string => {
    if (playList.length >= 5) {
      return name.length > 6 ? `${name.slice(0, 6)}.` : name;
    } else if (playList.length === 4) {
      return name.length > 7 ? `${name.slice(0, 7)}.` : name;
    }
    return name;
  };

  return (
    <div
      className={cn('grid justify-center gap-x-2 bg-blend-soft-light', !isExpanded && 'sticky top-1 z-40')}
      style={{ gridTemplateColumns: '44px minmax(0, 1fr)' }}>
      <button
        onClick={onToggleExpand}
        className={cn(
          'm-auto h-11 w-11 flex items-center justify-center rounded-full transition-all duration-200 overflow-hidden ',
          'bg-transparent border bg-scroll',
          isExpanded ? 'bg-purple-500/90 text-white' : 'text-purple-400 ',
          hasScrolled && !isExpanded ? 'opacity-0' : 'opacity-100'
        )}
        title={isExpanded ? 'Masquer les détails' : 'Afficher les détails'}>
        <div>
          <LucideBadgeInfo className="w-8 h-8 stroke-[3] " />
        </div>
      </button>
      <div
        className="grid w-full backdrop-contrast-125 backdrop-blur-lg rounded-xl border pt-[0.75rem] pb-2 border-purple-500"
        style={{ gridTemplateColumns: `repeat(${playList.length}, 1fr)` }}>
        {playList.map((player) => {
          const isLeading = player.id === leadingPlayerId;

          return (
            <div key={player.id} className="relative min-w-0">
              <div
                className="
                bg-white/5 rounded-lg px-0.5 flex flex-col items-center justify-center h-12">
                {isLeading && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-white  rounded-full flex items-center justify-center ">
                    <Crown className="w-4 h-4 text-yellow-400 stroke-[3]" />
                  </div>
                )}
                <div className="font-semibold text-center w-full px-1 leading-tight text-xs mt-5 text-purple-700">{truncateName(player.name)}</div>
                <div className="font-n mt-0.5 w-full text-center px-1 text-xs text-purple-600">{calculateTotal(player)} pts</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
