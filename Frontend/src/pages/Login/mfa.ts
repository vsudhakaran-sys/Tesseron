// Helpers for the MFA demo flow: a persisted base32 secret + otpauth URI used
// to render the enrollment QR code. This is front-end only; a real deployment
// would receive the secret/URI from the backend during enrollment.

const STORAGE_KEY = "TESSERON_mfa_secret";
const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function generateSecret(length = 32): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let secret = "";
  for (let i = 0; i < length; i++) {
    secret += BASE32_ALPHABET[bytes[i] % BASE32_ALPHABET.length];
  }
  return secret;
}

// Reuse the same secret across the setup/verify screens within a session.
export function getMfaSecret(): string {
  let secret = localStorage.getItem(STORAGE_KEY);
  if (!secret) {
    secret = generateSecret();
    localStorage.setItem(STORAGE_KEY, secret);
  }
  return secret;
}

export function getAccountEmail(): string {
  try {
    const raw = localStorage.getItem("TESSERON_user");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.email) return parsed.email as string;
    }
  } catch {
    /* fall through to default */
  }
  return "admin@TESSERON.com";
}

// Group the secret into 4-char blocks for readable manual entry.
export function formatSecret(secret: string): string {
  return secret.replace(/(.{4})/g, "$1 ").trim();
}

export function buildOtpAuthUri(secret: string, account: string, issuer = "TESSERON"): string {
  const label = encodeURIComponent(`${issuer}:${account}`);
  const params = new URLSearchParams({
    secret,
    issuer,
    algorithm: "SHA1",
    digits: "6",
    period: "30",
  });
  return `otpauth://totp/${label}?${params.toString()}`;
}


