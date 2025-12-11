// /app/layout.jsx

import "./globals.css";
import { headers } from "next/headers";
import { getFlagsFromHeaders } from "../lib/featureFlags/next-server.js";
import { FlagsProvider } from "../lib/featureFlags/next-client.jsx";

export const metadata = {
  title: "Ejemplo next-micro-flags",
  description: "Feature flags minimalistas para Next.js",
};

export default function RootLayout({ children }) {
  const h = headers();
  const flags = getFlagsFromHeaders(h);

  return (
    <html lang="en">
      <body>
        <FlagsProvider initialFlags={flags}>
          {children}
        </FlagsProvider>
      </body>
    </html>
  );
}
