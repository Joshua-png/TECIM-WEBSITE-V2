import { createHash, randomInt } from "node:crypto";
import { ApiError } from "./ApiError.js";
import { getStore } from "./store.js";

const OTP_TTL_SECONDS = 5 * 60;
const MAX_ATTEMPTS = 5;

function keyFor(email: string): string {
  return `otp:${email.toLowerCase()}`;
}

function attemptsKeyFor(email: string): string {
  return `otp:attempts:${email.toLowerCase()}`;
}

function hashOtp(otp: string): string {
  return createHash("sha256").update(otp).digest("hex");
}

export function generateOtp(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

export async function storeOtp(email: string, otp: string): Promise<void> {
  const store = getStore();
  await store.set(keyFor(email), hashOtp(otp), OTP_TTL_SECONDS);
  await store.del(attemptsKeyFor(email));
}

export async function verifyStoredOtp(email: string, otp: string): Promise<void> {
  const store = getStore();
  const storedHash = await store.get(keyFor(email));
  if (storedHash === null) {
    throw new ApiError(400, "OTP_EXPIRED", "OTP is expired or was never issued");
  }
  if (storedHash !== hashOtp(otp)) {
    const attempts = await store.incr(attemptsKeyFor(email), OTP_TTL_SECONDS);
    if (attempts >= MAX_ATTEMPTS) {
      await store.del(keyFor(email));
      await store.del(attemptsKeyFor(email));
    }
    throw new ApiError(400, "OTP_INVALID", "Invalid OTP");
  }
  await store.del(keyFor(email));
  await store.del(attemptsKeyFor(email));
}
