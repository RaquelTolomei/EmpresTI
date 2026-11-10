import { describe, expect, it } from "vitest";
import { parseServerEnv } from "../src/lib/env";

describe("server environment", () => {
  it("rejects missing or invalid configuration", () => {
    expect(() => parseServerEnv({})).toThrow();
    expect(() =>
      parseServerEnv({
        DATABASE_URL: "not-a-url",
        DIRECT_URL: "postgresql://localhost/app",
        NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "test-key",
      }),
    ).toThrow();
  });

  it("accepts valid database and Supabase configuration", () => {
    expect(
      parseServerEnv({
        DATABASE_URL: "postgresql://localhost/app",
        DIRECT_URL: "postgresql://localhost/app",
        NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "test-key",
      }),
    ).toMatchObject({
      DATABASE_URL: "postgresql://localhost/app",
      DIRECT_URL: "postgresql://localhost/app",
    });
  });
});
