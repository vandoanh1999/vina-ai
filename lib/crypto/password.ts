/**
 * Password hashing and verification using Web Crypto API
 * Compatible with Edge Runtime and Vercel deployments
 */

const PBKDF2_ITERATIONS = 100_000;
const SALT_LENGTH = 16;
const KEY_LENGTH = 32;
const HASH_ALGORITHM = "SHA-256";

/**
 * Convert ArrayBuffer to Base64 string
 */
function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Convert Base64 string to ArrayBuffer
 */
function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Generate a cryptographically secure random salt
 */
function generateSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
}

/**
 * Hash a password using PBKDF2 with Web Crypto API
 * @param password - The password to hash
 * @returns Promise<string> - The hashed password in format: salt.hash (both base64 encoded)
 */
export async function hashPassword(password: string): Promise<string> {
  // Generate random salt
  const salt = generateSalt();

  // Convert password to buffer
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  // Import password as key material
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  // Derive key using PBKDF2
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt as BufferSource,
      iterations: PBKDF2_ITERATIONS,
      hash: HASH_ALGORITHM,
    },
    keyMaterial,
    KEY_LENGTH * 8
  );

  // Encode salt and hash as base64
  const saltBase64 = bufferToBase64(salt.buffer as ArrayBuffer);
  const hashBase64 = bufferToBase64(derivedBits);

  // Return combined format: salt.hash
  return `${saltBase64}.${hashBase64}`;
}

/**
 * Verify a password against a hash
 * @param password - The password to verify
 * @param storedHash - The stored hash in format: salt.hash (both base64 encoded)
 * @returns Promise<boolean> - True if password matches, false otherwise
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  try {
    // Parse stored hash
    const [saltBase64, hashBase64] = storedHash.split(".");
    if (!saltBase64 || !hashBase64) {
      return false;
    }

    // Decode salt and hash
    const salt = new Uint8Array(base64ToBuffer(saltBase64));
    const storedHashBuffer = base64ToBuffer(hashBase64);

    // Convert password to buffer
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);

    // Import password as key material
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      passwordBuffer,
      { name: "PBKDF2" },
      false,
      ["deriveBits"]
    );

    // Derive key using PBKDF2 with same salt
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: salt as BufferSource,
        iterations: PBKDF2_ITERATIONS,
        hash: HASH_ALGORITHM,
      },
      keyMaterial,
      KEY_LENGTH * 8
    );

    // Compare hashes using timing-safe comparison
    const derivedArray = new Uint8Array(derivedBits);
    const storedArray = new Uint8Array(storedHashBuffer);

    if (derivedArray.length !== storedArray.length) {
      return false;
    }

    // Timing-safe comparison
    let mismatch = 0;
    for (let i = 0; i < derivedArray.length; i++) {
      mismatch |= derivedArray[i] ^ storedArray[i];
    }

    return mismatch === 0;
  } catch (error) {
    console.error("Password verification error:", error);
    return false;
  }
}
