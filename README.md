# next-micro-flags

NPM: https://www.npmjs.com/package/next-micro-flags  
GITHUB: https://github.com/mauroserralvodev/next-micro-flags

`next-micro-flags` is a lightweight feature flag utility designed for Next.js applications using the App Router.

It provides a structured way to evaluate feature flags per request and make the results available consistently across middleware, server components and client components. The library focuses on predictable behavior, minimal configuration and zero external dependencies.

## Purpose

Feature flags are commonly required in production Next.js applications to control feature availability, reduce rollout risk and manage experimental or temporary functionality.

Typical use cases include:
- gradual rollouts of new features
- restricting features to internal or test users
- enabling features only in specific environments
- activating features for a limited time window
- keeping incomplete functionality deployed but inactive

Many implementations rely on ad-hoc conditionals or environment variables, which tend to become difficult to maintain and are not well suited for client-side rendering.

`next-micro-flags` addresses this by evaluating all feature flags once per request in middleware, performing basic configuration validation during development, and exposing the evaluated results to both server and client layers in a consistent way.

## How it works

Feature flags are defined in a single `feature-flags.config.js` file.

Each flag supports a combination of the following rules:
- global enable or disable
- percentage-based rollout
- deterministic rollouts (the same user receives the same result)
- restriction to a list of specific users
- restriction to specific environments
- activation within a defined time range

The middleware evaluates all flags for the current request and forwards the resolved values to the application. Components then consume these values as simple booleans.

Example configuration:

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

In the UI, a flag is checked using a simple hook:

```js
const showNewNavbar = useFeatureFlag("newNavbar");
```
Rendering logic remains explicit and local to the component.


## Behavior and guarantees

Flag evaluation is performed once per request.
Rollouts are deterministic when a stable identifier is available.
Misconfigured flags produce warnings in development but do not break execution.
No runtime network calls are required.
No client-side configuration parsing is performed.
This keeps behavior predictable and avoids hidden side effects.

## Internal flow overview

Middleware evaluates all feature flags for the incoming request.
The evaluated flag set is serialized into a request header.
The root layout reads the evaluated flags on the server.
The <FlagsProvider> exposes them to the client through React context.
Client components read flag values using hooks and render accordingly.


## License

MIT