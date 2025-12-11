// /feature-flags.config.js
// Definición declarativa de tus feature flags

export const featureFlagsConfig = {
  newNavbar: {
    enabled: true,
    rollout: 100,
  },
  betaDashboard: {
    enabled: true,
    rollout: 20,
  },
  paymentsV2: {
    enabled: true,
    rollout: 100,
    onlyUsers: ["user1", "user2", "user3"], 
  },
};
