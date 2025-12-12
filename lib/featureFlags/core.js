// /lib/featureFlags/core.js

import { featureFlagsConfig } from "../../feature-flags.config.js";

function hashToPercent(str = "") {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  const positive = Math.abs(hash);
  return positive % 100;
}

function isWithinActiveDates(def, now = new Date()) {
  if (!def) return false;

  const hasFrom = typeof def.activeFrom === "string";
  const hasUntil = typeof def.activeUntil === "string";

  if (!hasFrom && !hasUntil) return true;

  const nowTime = now.getTime();

  if (hasFrom) {
    const fromTime = new Date(def.activeFrom).getTime();
    if (!Number.isNaN(fromTime) && nowTime < fromTime) {
      return false;
    }
  }

  if (hasUntil) {
    const untilTime = new Date(def.activeUntil).getTime();
    if (!Number.isNaN(untilTime) && nowTime > untilTime) {
      return false;
    }
  }

  return true;
}

export function evaluateFlag(
  flagName,
  { userId, env = process.env.NODE_ENV } = {}
) {
  const def = featureFlagsConfig[flagName];
  if (!def) return false;

  if (def.enabled === false) return false;

  if (!isWithinActiveDates(def)) return false;

  if (Array.isArray(def.onlyUsers) && def.onlyUsers.length > 0) {
    if (!userId) return false;
    if (!def.onlyUsers.includes(userId)) return false;
    return true;
  }

  const rollout = typeof def.rollout === "number" ? def.rollout : 100;
  if (rollout >= 100 || !userId) {
    return def.enabled !== false;
  }

  const p = hashToPercent(userId);
  return p < rollout;
}

export function evaluateAllFlagsForUser({
  userId,
  env = process.env.NODE_ENV
} = {}) {
  const result = {};
  for (const flagName of Object.keys(featureFlagsConfig)) {
    result[flagName] = evaluateFlag(flagName, { userId, env });
  }
  return result;
}
