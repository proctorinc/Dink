import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { env } from "~/env.mjs";

// More on how NextAuth.js middleware works: https://next-auth.js.org/configuration/nextjs#middleware
export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req, secret: env.NEXTAUTH_SECRET });
    const isAuthenticated = !!token;
    console.log("YOOOOO", token);

    const isAuthPage = !req.nextUrl.pathname.startsWith("/login");

    console.log(req.url);
    console.log("auth page?", isAuthPage);
    console.log("is authed?", isAuthenticated);

    if (isAuthPage) {
      if (isAuthenticated) {
        console.log("Result: redirect to:", req.url);
        return NextResponse.redirect(new URL("/", req.url));
      }
      console.log("Result: return null");

      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }
      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
      );
    }

    console.log("result: nothing");
    return NextResponse.redirect(new URL(`/`, req.url));
    if (!isAuthenticated) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      console.log("Result: navigate to login");
      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        console.log(token);
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/",
    "/login",
    "/transactions/:path*",
    "/budget/:path*",
    "/funds/:path*",
    "/profile/:path*",
  ],
};
