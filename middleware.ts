import { NextRequest, NextResponse } from "next/server";

// Lightweight gate for the admin UI: if the admin cookie is missing,
// redirect to the login page. The real cryptographic validation happens
// in the API routes (isAdminRequest), which run in the Node runtime.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const cookie = req.cookies.get("pp_admin")?.value;
    if (!cookie) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
