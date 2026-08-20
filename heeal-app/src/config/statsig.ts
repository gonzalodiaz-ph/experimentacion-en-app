// Reemplaza con tu Client SDK Key de Statsig
// Obtenerla en: console.statsig.com → Settings → Keys & Environments → Client SDK Keys
export const STATSIG_CLIENT_KEY = 'client-TU-API-KEY-AQUI';

export const STATSIG_DEFAULTS = {
  gates: {
    onboarding_express_duel: false,
    premium_social_proof: false,
    new_workout_prominent: false,
  },
  configs: {
    onboarding_config: {
      type: 'classic',
      steps: 2,
      show_duel: false,
      xp_reward: 0,
    },
    duel_config: {
      time_limit: 30,
      remaining_duels: 2,
      xp_reward: 50,
      cta_text: '🎮 Duel now!',
    },
    premium_modal_config: {
      title: 'Únete a 12.847 usuarios premium',
      cta_text: 'Comenzar prueba gratis →',
      show_social_proof: true,
      show_urgency: true,
      show_comparison: true,
    },
  },
};
