import { NextResponse, type NextRequest } from "next/server";

export function proxy(_request: NextRequest) {
  // Middleware role teacher/siswa sementara dimatikan.
  // Nanti bisa aktif lagi kalau alur auth dan role sudah final.
  /*
  const { pathname } = _request.nextUrl;
  const isProtected = ["/student", "/teacher"].some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  const session = getAuthSession(_request);

  if ((pathname === "/login" || pathname === "/register") && session) {
    return NextResponse.redirect(new URL(getDashboardPath(session.role), _request.url));
  }

  if (!isProtected) {
    return NextResponse.next();
  }

  if (!session) {
    const loginUrl = new URL("/login", _request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/teacher") && session.role !== AppRole.GURU) {
    return NextResponse.redirect(new URL(getDashboardPath(session.role), _request.url));
  }

  if (pathname.startsWith("/student") && session.role !== AppRole.SISWA) {
    return NextResponse.redirect(new URL(getDashboardPath(session.role), _request.url));
  }
  */
  return NextResponse.next();
}

export const config = {
  // Middleware role teacher/siswa sementara dimatikan.
  // Untuk mengaktifkan lagi, kembalikan matcher di bawah.
  // matcher: ["/login", "/register", "/student/:path*", "/teacher/:path*"],
  matcher: [],
};
