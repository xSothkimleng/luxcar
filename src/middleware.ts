// middleware.ts or middleware.js
import { NextResponse } from 'next/server';

export function middleware() {
  // Simply pass through all requests without auth checks
  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};
