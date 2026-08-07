"use client";

import { KeyRound, Save } from "lucide-react";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { useToast } from "@/components/ui/toast";

export function ChangePasswordCard() {
  const toast = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setError(null);
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirm) {
      setError("New passwords do not match.");
      return;
    }
    setSaving(true);
    try {
      await apiFetch("/auth/change-password", {
        method: "POST",
        body: { currentPassword, newPassword },
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirm("");
      toast.push("success", "Password changed", "Your new password is active.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Password change failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-4">
        <div>
          <h3 className="flex items-center gap-2 font-serif text-lg text-ink">
            <KeyRound className="size-4.5 text-turquoise" />
            Change password
          </h3>
          <p className="text-xs text-muted">
            Update the password used to sign in to this portal.
          </p>
        </div>
        <Button onClick={() => void save()} loading={saving} size="sm">
          <Save className="size-4" />
          Update
        </Button>
      </div>

      <div className="grid gap-4 p-6 sm:grid-cols-2">
        <Field label="Current password" required>
          <PasswordInput
            autoComplete="current-password"
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </Field>
        <Field label="New password" required>
          <PasswordInput
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </Field>
        <Field label="Confirm new password" required className="sm:col-span-2">
          <PasswordInput
            autoComplete="new-password"
            placeholder="Repeat new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </Field>

        {error ? (
          <div className="sm:col-span-2 rounded-lg border border-rose/30 bg-rose/10 px-3.5 py-2.5 text-sm text-rose">
            {error}
          </div>
        ) : null}
      </div>
    </Card>
  );
}
