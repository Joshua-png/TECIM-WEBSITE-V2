"use client";

import { ArrowRight, Feather, KeyRound, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApiError, login } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { ThemeToggle } from "@/components/theme-toggle";

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
    <main className="relative flex min-h-screen bg-canvas">
      <div className="absolute right-5 top-5 z-20">
        <ThemeToggle />
      </div>
      <div className="relative hidden flex-1 overflow-hidden lg:flex">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1600&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/80 to-canvas/40" />
        <div className="absolute inset-0 opacity-40 mix-blend-color bg-gradient-to-br from-turquoise-deep via-canvas to-gold-deep" />
        <div className="relative z-10 flex flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl border border-line-strong bg-overlay-strong backdrop-blur">
              <Feather className="size-5 text-gold" />
            </span>
            <span className="font-serif text-xl font-semibold tracking-wide text-ink">
              TECIM<span className="text-gold">.</span>
            </span>
          </div>
          <div>
            <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-gold">
              The Eagle Centre for International Ministries
            </p>
            <h1 className="font-serif text-5xl font-medium leading-[1.05] text-ink">
              Forged for
              <br />
              purpose<span className="text-turquoise">.</span>
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">
              Watch the process. Content is data, design is code — this portal lets you shape
              the words, images and story of the site without ever touching the design.
            </p>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center px-6 py-16 lg:max-w-xl lg:px-16">
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
              <div className="relative">
                <Input
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <KeyRound className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-faint" />
              </div>
            </Field>
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
      </div>
    </main>
  );
}
