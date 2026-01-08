// /lib/featureFlags/next-client.jsx

"use client";

import React, { createContext, useContext, useMemo } from "react";

const FlagsContext = createContext({});

export function FlagsProvider({ initialFlags, children }) {
  const value = useMemo(() => initialFlags || {}, [initialFlags]);
  return (
    <FlagsContext.Provider value={value}>
      {children}
    </FlagsContext.Provider>
  );
}

export function useFeatureFlags() {
  return useContext(FlagsContext);
}

export function useFeatureFlag(name) {
  const flags = useFeatureFlags();
  return !!flags[name];
}

export function getFeatureFlags() {
  return useFeatureFlags();
}