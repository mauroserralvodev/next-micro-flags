# next-micro-flags
NPM: https://www.npmjs.com/package/next-micro-flags
GITHUB: https://github.com/mauroserralvodev/next-micro-flags

`next-micro-flags` is a tiny feature-flag system designed specifically for Next.js (App Router).

The goal is simple: give developers an easy and predictable way to enable or disable features per user, per rollout percentage, per environment or within a specific time window, without external services or complex setups.

This follows the same patterns real teams use to ship features progressively, test things safely and keep unfinished work hidden until it’s ready.

## Why this exists

Sooner or later, every Next.js app needs feature flags.

New features need to be rolled out gradually.  
Some features should only be visible to internal users.  
Others should only run in development or staging.  
Temporary features (like promotions or banners) should turn on and off automatically.

Most projects end up hardcoding conditions or abusing environment variables, which quickly becomes messy and doesn’t work well on the client side.

This package solves that by evaluating feature flags once per request (in middleware) and making the result available everywhere: server components, client components and the UI.

## How it works

You define your flags in a single `feature-flags.config.js` file.

Each flag can:
- be globally enabled or disabled
- roll out to a percentage of users
- be restricted to a list of specific users
- be active only in certain environments
- be active only within a specific date range

The middleware evaluates all flags for the current request and exposes the results to your app. From there, you just read a boolean and render accordingly.

Example config:

```js
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
    onlyUsers: ["user1", "user2"]
  },
  devOnlyBanner: {
    enabled: true,
    rollout: 100,
    onlyInEnv: ["development"]
  },
  blackFridayBanner: {
    enabled: true,
    rollout: 100,
    activeFrom: "2025-11-20T00:00:00Z",
    activeUntil: "2025-11-27T23:59:59Z"
  }
};
```
In the UI you check a flag like this:

```js
const showNewNavbar = useFeatureFlag("newNavbar");
```
If it’s true, you render the new component. If not, you keep the old one. Nothing else to think about.

## What problems it solves

You can roll out a new feature to 10% of users and increase it gradually without redeploying.
You can expose experimental features only to internal users.
You can keep unfinished work in production without anyone seeing it.
You can safely restrict features to development or staging environments.
You can activate features automatically for a limited period of time.
You avoid spreading environment checks and conditional logic across your UI.

Everything stays predictable, minimal and fully under your control.

## Quick overview of the pieces

A small middleware evaluates all feature flags per request.
The evaluated flags are encoded into a request header.
The root layout reads those flags on the server.
The <FlagsProvider> exposes them to the client through context.
Client components read flags using a simple hook and render accordingly.

No external API. No dashboard. No analytics. Just a lightweight mechanism that covers the most common feature-flag use cases in Next.js.

## License

MIT