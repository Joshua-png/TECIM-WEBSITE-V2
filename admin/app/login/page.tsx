"use client";

import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApiError, login } from "@/lib/api";
import { AuthShell } from "@/components/auth/AuthShell";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      router.replace("/pages");
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.code === "UNAUTHORIZED" ? "Incorrect email or password." : err.message);
      } else {
        setError("Unable to reach the API. Is the backend running?");
      }
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <form onSubmit={handleSubmit} className="rise w-full max-w-sm">
        <div className="mb-8 lg:hidden">
          <span className="font-serif text-2xl font-semibold text-ink">
            TECIM<span className="text-gold">.</span> Admin
          </span>
        </div>

        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-turquoise">
            <ShieldCheck className="size-4.5" />
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.2em]">
              Restricted area
            </span>
          </div>
          <h2 className="font-serif text-4xl font-medium text-ink">Welcome back</h2>
          <p className="mt-1.5 text-sm text-muted">Sign in to manage the site.</p>
        </div>

        <div className="space-y-4">
          <Field label="Email" required>
            <Input
              type="email"
              autoComplete="email"
              placeholder="admin@tecim.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>
          <Field label="Password" required>
            <PasswordInput
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Field>
        </div>

        <div className="mt-2 text-right">
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-turquoise hover:text-turquoise-deep hover:underline"
          >
            Forgot your password?
          </Link>
        </div>

        {error ? (
          <div className="mt-4 rounded-lg border border-rose/30 bg-rose/10 px-3.5 py-2.5 text-sm text-rose">
            {error}
          </div>
        ) : null}

        <Button type="submit" size="lg" className="mt-6 w-full" loading={loading}>
          {!loading ? "Enter the studio" : "Signing in…"}
          {!loading ? <ArrowRight className="size-4" /> : null}
        </Button>

        <p className="mt-6 text-center text-xs leading-relaxed text-faint">
          Password resets are sent to your registered email via a one-time code.
        </p>
      </form>
    </AuthShell>
  );
}
