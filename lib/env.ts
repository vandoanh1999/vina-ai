/**
 * Environment Variables Validation
 * Validates all required environment variables at startup
 */

// Required environment variables
const requiredEnvVars = {
  AUTH_SECRET: process.env.AUTH_SECRET,
  POSTGRES_URL: process.env.POSTGRES_URL,
  GROQ_API_KEY: process.env.GROQ_API_KEY,
} as const;

// Optional environment variables (with defaults or fallbacks)
const optionalEnvVars = {
  NODE_ENV: process.env.NODE_ENV || "development",
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
  REDIS_URL: process.env.REDIS_URL,
  AI_GATEWAY_API_KEY: process.env.AI_GATEWAY_API_KEY,
} as const;

/**
 * Validate environment variables
 * @throws Error if required variables are missing
 */
export function validateEnv() {
  const missing: string[] = [];

  // Check required variables
  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value || value.trim() === "") {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    const error = `
╔════════════════════════════════════════════════════════════════╗
║  ❌ MISSING REQUIRED ENVIRONMENT VARIABLES                     ║
╚════════════════════════════════════════════════════════════════╝

The following environment variables are required but not set:

${missing.map((key) => `  • ${key}`).join("\n")}

Please set these variables in your:
  - Local: .env.local file
  - Production: Vercel Dashboard → Settings → Environment Variables

Example .env.local:
${missing.map((key) => `  ${key}=your_value_here`).join("\n")}

See .env.example for more details.
    `.trim();

    throw new Error(error);
  }

  return {
    ...requiredEnvVars,
    ...optionalEnvVars,
  };
}

// Validate on import (only in Node.js environment)
if (typeof window === "undefined") {
  try {
    validateEnv();
    console.log("✅ All required environment variables are set");
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Export validated environment variables (safe after validation)
export const env = {
  AUTH_SECRET: requiredEnvVars.AUTH_SECRET as string,
  POSTGRES_URL: requiredEnvVars.POSTGRES_URL as string,
  GROQ_API_KEY: requiredEnvVars.GROQ_API_KEY as string,
  NODE_ENV: optionalEnvVars.NODE_ENV,
  NEXTAUTH_URL: optionalEnvVars.NEXTAUTH_URL,
  BLOB_READ_WRITE_TOKEN: optionalEnvVars.BLOB_READ_WRITE_TOKEN,
  REDIS_URL: optionalEnvVars.REDIS_URL,
  AI_GATEWAY_API_KEY: optionalEnvVars.AI_GATEWAY_API_KEY,
} as const;
