export const TOAST_MESSAGES = {
  gameEnded: {
    variant: 'destructive',
    title: 'toast.ended.title',
    description: 'toast.ended.description',
  },
  maxScore: {
    variant: 'success',
    title: 'toast.maxScore.title',
    description: 'toast.maxScore.description',
  },
  unlockBonus: {
    variant: 'success',
    title: 'toast.unlockBonus.title',
    description: 'toast.unlockBonus.description',
  },
  zeroScore: {
    variant: 'destructive',
    title: 'toast.zeroScore.title',
    description: 'toast.zeroScore.description',
  },
  yahtzee: {
    variant: 'gold',
    description: 'toast.yahtzee.description',
    duration: 4000,
  },
  gameStarted: {
    variant: 'primary',
    description: 'toast.gameStarted.description',
  },
  playerExists: {
    variant: 'destructive',
    title: 'toast.playerExists.title',
    description: 'toast.playerExists.description',
  },
  playerAdded: {
    variant: 'default',
    title: 'toast.playerAdded.title',
    description: 'toast.playerAdded.description',
  },
  maxPlayers: {
    variant: 'warning',
    title: 'toast.maxPlayers.title',
    description: 'toast.maxPlayers.description',
  },
  liveShareStarted: {
    variant: 'success',
    title: 'toast.liveShareStarted.title',
    description: 'toast.liveShareStarted.description',
  },
  liveShareAlreadyUp: {
    variant: 'warning',
    title: 'toast.liveShareAlreadyUp.title',
    description: 'toast.liveShareAlreadyUp.description',
  },
  liveShareEnded: {
    variant: 'destructive',
    title: 'toast.liveShareEnded.title',
    description: 'toast.liveShareEnded.description',
  },
  liveShareAlreadyDown: {
    variant: 'warning',
    title: 'toast.liveShareAlreadyDown.title',
    description: 'toast.liveShareAlreadyDown.description',
  },
  copied: {
    variant: 'success',
    title: 'toast.copied.title',
    description: 'toast.copied.description',
  },
} as const;
