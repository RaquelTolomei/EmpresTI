import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

const serverEnvSchema = publicEnvSchema.extend({
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url(),
});

export function parsePublicEnv(source: Record<string, string | undefined>) {
  return publicEnvSchema.parse(source);
}

export function parseServerEnv(source: Record<string, string | undefined>) {
  return serverEnvSchema.parse(source);
}

export function getPublicEnv() {
  return parsePublicEnv({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
}

export function getServerEnv() {
  return parseServerEnv(process.env);
}
