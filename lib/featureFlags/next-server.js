// /lib/featureFlags/next-server.js

import { evaluateAllFlagsForUser } from "./core.js";

const HEADER_NAME = "x-feature-flags";

// Base64 helpers that work in both Node and Edge runtimes.
// We also use base64url to keep header values safe.
function toBase64Url(str) {
  let b64;

  // Edge / browser
  if (typeof btoa === "function") {
    b64 = btoa(unescape(encodeURIComponent(str)));
  } else {
    // Node
    b64 = Buffer.from(str, "utf8").toString("base64");
  }

  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(b64url) {
  if (!b64url || typeof b64url !== "string") return "";

  let b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4;
  if (pad) b64 += "=".repeat(4 - pad);

  // Edge / browser
  if (typeof atob === "function") {
    return decodeURIComponent(escape(atob(b64)));
  }

  // Node
  return Buffer.from(b64, "base64").toString("utf8");
}

function encodeFlags(flagsObject) {
  const json = JSON.stringify(flagsObject || {});
  return toBase64Url(json);
}

function decodeFlags(encoded = "") {
  try {
    const json = fromBase64Url(encoded);
    return JSON.parse(json);
  } catch {
    return {};
  }
}

function randomVisitorId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();

  return `nmf_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

const VISITOR_COOKIE = "nmf_vid";
const VISITOR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function attachFlagsToResponseHeaders(req, res) {
  const userId =
    req.cookies?.get("userId")?.value ||
    req.headers.get("x-user-id") ||
    null;

  let visitorId = req.cookies?.get(VISITOR_COOKIE)?.value || null;

  if (!userId && !visitorId) {
    visitorId = randomVisitorId();

    res.cookies?.set?.(VISITOR_COOKIE, visitorId, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: VISITOR_COOKIE_MAX_AGE
    });
  }

  const rolloutKey = userId || visitorId || null;

  const flags = evaluateAllFlagsForUser({ userId, rolloutKey });
  const encoded = encodeFlags(flags);

  res.headers.set(HEADER_NAME, encoded);
}

export function getFlagsFromHeaders(headers) {
  const encoded = headers.get(HEADER_NAME);
  if (!encoded) return {};
  return decodeFlags(encoded);
}

export function getAllFlagsFromHeaders(headers) {
  return getFlagsFromHeaders(headers);
}

export const FEATURE_FLAGS_HEADER = HEADER_NAME;
