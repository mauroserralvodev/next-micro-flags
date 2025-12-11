// /middleware.js

import { NextResponse } from "next/server";
import { attachFlagsToResponseHeaders } from "./lib/featureFlags/next-server.js";

export function middleware(req) {
  const res = NextResponse.next();
  attachFlagsToResponseHeaders(req, res);
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
