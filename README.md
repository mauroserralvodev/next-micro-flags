# next-micro-flags

`next-micro-flags` is a tiny feature-flag system designed specifically for Next.js (App Router).  
The goal is simple: give developers an easy way to enable or disable features per user, per rollout percentage or per environment, without adding external services or complicated setups.

The idea is very similar to what teams use internally in real products when they want to ship new features progressively, test things with specific users or keep unfinished work hidden until it's ready.

## Why this exists

Next.js apps often need to run A/B tests, progressive rollouts or show experimental features only to certain users. Most people end up hardcoding conditions or using environment variables, which doesn’t scale and usually doesn’t work on the client side.

This package solves that by evaluating all feature flags in a middleware (per request) and passing them through headers into your server and client components. From there, you just call a simple hook to decide what to render.

## How it works

You define your flags in a single `feature-flags.config.js` file.  
Each flag can be globally enabled, limited to a percentage of users or restricted to a list of specific user IDs. The middleware evaluates everything and exposes the results to your app.

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
  }
};
```
In the UI you can check a flag with:

```js
const showNewNavbar = useFeatureFlag("newNavbar");
```
If it's true, you show the new component. If not, you keep the old one. Nothing else to think about.

## What problems it solves

You can roll out a new feature to 10% of users without touching your code again.
You can give access to a beta dashboard only to a few internal users.
You can hide unfinished work behind a flag until you decide it's ready.
You can activate features only on development or staging if you want.
You no longer need to depend on environment variables for UI-related logic.

Everything stays predictable, minimal and fully under your control.

## Quick overview of the pieces

A small middleware evaluates the flags for each request.
The evaluated flags are encoded into a header.
The root layout reads that header on the server.
The <FlagsProvider> exposes the flags to the client through context.
You read the flag with a hook and render whatever you want.

Nothing more than that. No external API. No dashboard. No analytics. Just a lightweight mechanism that solves the basic needs of feature flagging inside Next.js.

## License

MIT