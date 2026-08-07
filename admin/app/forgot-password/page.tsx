"use client";

import { ArrowLeft, KeyRound, MailCheck, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApiError, requestPasswordReset, resetPassword } from "@/lib/api";
import { AuthShell } from "@/components/auth/AuthShell";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp" | "done">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setStep("otp");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Unable to reach the API. Is the backend running?");
      }
    } finally {
      setLoading(false);
    }
  };

  const submitReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email, otp, newPassword);
      setStep("done");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === "OTP_INVALID" || err.code === "OTP_EXPIRED") {
          setError("That code is invalid or expired. Request a new one.");
        } else {
          setError(err.message);
        }
      } else {
        setError("Unable to reach the API. Is the backend running?");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <div className="rise w-full max-w-sm">
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
          <h2 className="font-serif text-4xl font-medium text-ink">
            {step === "email" && "Reset your password"}
            {step === "otp" && "Enter the code"}
            {step === "done" && "Password updated"}
          </h2>
          <p className="mt-1.5 text-sm text-muted">
            {step === "email" && "Enter the admin email to receive a one-time reset code."}
            {step === "otp" &&
              `We emailed a 6-digit code to ${email}. Enter it below with your new password.`}
            {step === "done" && "You can now sign in with your new password."}
          </p>
        </div>

        {step === "email" ? (
          <form onSubmit={submitEmail} className="space-y-4">
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

            {error ? (
              <div className="rounded-lg border border-rose/30 bg-rose/10 px-3.5 py-2.5 text-sm text-rose">
                {error}
              </div>
            ) : null}

            <Button type="submit" size="lg" className="w-full" loading={loading}>
              {!loading ? "Send reset code" : "Sending…"}
            </Button>

            <div className="pt-2 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-ink"
              >
                <ArrowLeft className="size-3.5" />
                Back to sign in
              </Link>
            </div>
          </form>
        ) : null}

        {step === "otp" ? (
          <form onSubmit={submitReset} className="space-y-4">
            <Field label="Reset code" hint="6 digits" required>
              <div className="relative">
                <Input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="••••••"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="tracking-[0.3em]"
                  required
                />
                <KeyRound className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-faint" />
              </div>
            </Field>
            <Field label="New password" required>
              <PasswordInput
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Field>
            <Field label="Confirm new password" required>
              <PasswordInput
                autoComplete="new-password"
                placeholder="Repeat new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </Field>

            {error ? (
              <div className="rounded-lg border border-rose/30 bg-rose/10 px-3.5 py-2.5 text-sm text-rose">
                {error}
              </div>
            ) : null}

            <Button type="submit" size="lg" className="w-full" loading={loading}>
              {!loading ? "Reset password" : "Resetting…"}
            </Button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setStep("email")}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-ink"
              >
                <ArrowLeft className="size-3.5" />
                Wrong email? Start over
              </button>
            </div>
          </form>
        ) : null}

        {step === "done" ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-turquoise/30 bg-turquoise/10 px-4 py-3 text-sm text-turquoise-deep">
              <MailCheck className="size-5 shrink-0" />
              Your password has been reset.
            </div>
            <Button size="lg" className="w-full" onClick={() => router.replace("/login")}>
              Back to sign in
            </Button>
          </div>
        ) : null}
      </div>
    </AuthShell>
  );
}
