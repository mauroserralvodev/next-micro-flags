// /feature-flags.config.js

export const featureFlagsConfig = {
  newNavbar: {
    enabled: true,
    rollout: 100
  },
  betaDashboard: {
    enabled: true,
    rollout: 20
  },
  paymentsV2: {
    enabled: true,
    rollout: 100,
    onlyUsers: ["user1", "user2", "user3"]
  },
  blackFridayBanner: {
    enabled: true,
    rollout: 100,
    activeFrom: "2025-11-20T00:00:00Z",
    activeUntil: "2025-11-27T23:59:59Z"
  },
  devOnlyBanner: {
    enabled: true,
    rollout: 100,
    onlyInEnv: ["development"]
  }
};
