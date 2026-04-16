import { NextResponse } from "next/server";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function fail(code: string, message: string, status = 400, details?: string) {
  return NextResponse.json(
    {
      error: { code, message, details },
    },
    { status }
  );
}
