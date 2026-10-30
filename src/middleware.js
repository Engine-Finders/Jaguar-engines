import { NextResponse } from "next/server";

/**
 * Cross-brand path leaks (BMW / Mercedes / etc.) on jaguarengines.uk → 410 Gone
 * so Googlebot drops them from the crawl index instead of soft-404ing.
 */
const CROSS_BRAND_PREFIXES = [
  "1-series",
  "2-series",
  "3-series",
  "4-series",
  "5-series",
  "6-series",
  "7-series",
  "8-series",
  "x1",
  "x2",
  "x3",
  "x4",
  "x5",
  "x6",
  "x7",
  "z4",
  "i3",
  "i4",
  "i5",
  "i7",
  "i8",
  "ix",
  "m2",
  "m3",
  "m4",
  "m5",
  "mini",
  "a-class",
  "b-class",
  "c-class",
  "e-class",
  "s-class",
  "cla",
  "cls",
  "gla",
  "glb",
  "glc",
  "gle",
  "gls",
  "g-class",
  "amg",
  "bmw",
  "mercedes",
  "mercedes-benz",
];

export function middleware(request) {
  const first = request.nextUrl.pathname.split("/").filter(Boolean)[0]?.toLowerCase() || "";
  if (CROSS_BRAND_PREFIXES.includes(first)) {
    return new NextResponse("Gone", {
      status: 410,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
