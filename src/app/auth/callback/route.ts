import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseConfig } from "@/lib/env";

/**
 * Exchanges the OAuth `code` for a session and sets auth cookies, then redirects to `next` (default /dashboard).
 * Add this URL to Supabase Auth → URL Configuration → Redirect URLs:
 *   https://testlift.dev/auth/callback
 *   http://localhost:3000/auth/callback
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next") ?? "/dashboard";
  const next = nextParam.startsWith("/") ? nextParam : `/${nextParam}`;

  if (!code) {
    return NextResponse.redirect(`${origin}/auth?error=missing_code`);
  }

  let url: string;
  let anonKey: string;
  try {
    const config = getSupabaseConfig();
    url = config.url;
    anonKey = config.anonKey;
  } catch {
    return NextResponse.redirect(`${origin}/auth?error=config`);
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(
        cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>
      ) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options as never);
        });
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(
      `${origin}/auth?error=${encodeURIComponent(error.message)}`
    );
  }

  return NextResponse.redirect(`${origin}${next}`);
}
