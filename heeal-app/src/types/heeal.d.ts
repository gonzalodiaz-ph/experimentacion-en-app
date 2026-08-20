declare module '*.png';
declare module '*.jpg';

interface User {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  streak: number;
  duelsWon: number;
  ranking: number;
}

interface Duel {
  id: string;
  opponent: User;
  playerScore: number;
  opponentScore: number;
  status: 'pending' | 'active' | 'completed';
  xpReward: number;
}

interface PremiumConfig {
  title: string;
  ctaText: string;
  showSocialProof: boolean;
  showUrgency: boolean;
  showComparison: boolean;
  price: number;
  trialDays: number;
}

interface OnboardingConfig {
  type: 'classic' | 'express_duel';
  steps: number;
  showDuel: boolean;
  xpReward: number;
}
