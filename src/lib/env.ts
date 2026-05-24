export type ServerEnv = {
  appUrl: string;
  resendApiKey?: string;
  resendFromEmail?: string;
  supabaseServiceRoleKey?: string;
  supabaseUrl?: string;
};

export function getServerEnv(): ServerEnv {
  return {
    appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    resendApiKey: process.env.RESEND_API_KEY,
    resendFromEmail: process.env.RESEND_FROM_EMAIL,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    supabaseUrl: process.env.SUPABASE_URL,
  };
}

export function isSupabaseConfigured(env = getServerEnv()): boolean {
  return Boolean(env.supabaseUrl && env.supabaseServiceRoleKey);
}

export function isResendConfigured(env = getServerEnv()): boolean {
  return Boolean(env.resendApiKey && env.resendFromEmail);
}
