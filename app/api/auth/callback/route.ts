import { createServerSupabaseClient } from "@/shared/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { writeAuditLog, AuditEvents, extractRequestMeta } from "@/shared/utils/audit-logger";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`);
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.session) {
    console.error("[Auth Callback] Error:", error?.message);
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  // Audit log the login event
  const meta = extractRequestMeta(request);
  await writeAuditLog({
    userId: data.session.user.id,
    event: AuditEvents.USER_LOGIN,
    metadata: {
      provider: "google",
      email: data.session.user.email,
    },
    ...meta,
  });

  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";

  if (isLocalEnv) {
    return NextResponse.redirect(`${origin}${next}`);
  } else if (forwardedHost) {
    return NextResponse.redirect(`https://${forwardedHost}${next}`);
  } else {
    return NextResponse.redirect(`${origin}${next}`);
  }
}
