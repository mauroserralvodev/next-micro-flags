// /app/page.jsx

"use client";

import { useFeatureFlag } from "../lib/featureFlags/next-client.jsx";

export default function HomePage() {
  const newNavbar = useFeatureFlag("newNavbar");
  const betaDashboard = useFeatureFlag("betaDashboard");
  const paymentsV2 = useFeatureFlag("paymentsV2");

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>next-micro-flags demo</h1>

      <section style={{ marginTop: 24 }}>
        <h2>Feature Flags</h2>
        <ul>
          <li>newNavbar: {String(newNavbar)}</li>
          <li>betaDashboard: {String(betaDashboard)}</li>
          <li>paymentsV2: {String(paymentsV2)}</li>
        </ul>
      </section>

      <section style={{ marginTop: 24 }}>
        {newNavbar ? (
          <div>Nueva navbar activada</div>
        ) : (
          <div>Navbar clásica</div>
        )}

        {betaDashboard && (
          <div style={{ marginTop: 12 }}>
            Estás viendo el dashboard BETA
          </div>
        )}
      </section>
    </main>
  );
}
