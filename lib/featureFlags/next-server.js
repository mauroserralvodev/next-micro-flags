// /lib/featureFlags/next-server.js

import { evaluateAllFlagsForUser } from "./core.js";

const HEADER_NAME = "x-feature-flags";

function encodeFlags(flagsObject) {
  const json = JSON.stringify(flagsObject || {});
  return Buffer.from(json, "utf8").toString("base64");
}

function decodeFlags(encoded = "") {
  try {
    const json = Buffer.from(encoded, "base64").toString("utf8");
    return JSON.parse(json);
  } catch {
    return {};
  }
}

export function attachFlagsToResponseHeaders(req, res) {
  const userId =
    req.cookies?.get("userId")?.value ||
    req.headers.get("x-user-id") ||
    null;

  const flags = evaluateAllFlagsForUser({ userId });
  const encoded = encodeFlags(flags);

  res.headers.set(HEADER_NAME, encoded);
}

export function getFlagsFromHeaders(headers) {
  const encoded = headers.get(HEADER_NAME);
  if (!encoded) return {};
  return decodeFlags(encoded);
}

export const FEATURE_FLAGS_HEADER = HEADER_NAME;
