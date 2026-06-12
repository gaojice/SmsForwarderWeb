/**
 * Generate HMAC-SHA256 signature for SmsForwarder API
 * Follows the same algorithm as DingTalk robot sign generation:
 * 1. message = timestamp + "\n" + secret
 * 2. HMAC-SHA256(message, secret)
 * 3. Base64 encode
 * 4. URL encode
 */
export async function generateSign(secret: string, timestamp: number): Promise<string> {
  if (!secret) return "";

  const message = `${timestamp}\n${secret}`;
  const encoder = new TextEncoder();

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    encoder.encode(message)
  );

  const bytes = new Uint8Array(signature);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  const base64 = btoa(binary);
  return encodeURIComponent(base64);
}
