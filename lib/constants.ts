export const isProductionEnvironment = process.env.NODE_ENV === "production";
export const isDevelopmentEnvironment = process.env.NODE_ENV === "development";
export const isTestEnvironment = Boolean(
  process.env.PLAYWRIGHT_TEST_BASE_URL ||
    process.env.PLAYWRIGHT ||
    process.env.CI_PLAYWRIGHT
);

export const guestRegex = /^guest-\d+$/;

/**
 * Pre-computed dummy password hash for timing attack protection
 * This is a valid PBKDF2 hash of a random string, used to ensure
 * consistent timing when checking invalid credentials
 */
export const DUMMY_PASSWORD =
  "Rrq4wZ8pN3yGxKvL2mQtVhDfJcPnBxYz.XmK9wL5pQ8tN3vR6yH4cF7jG2nM9xZ5bV8pT1wK4mQ7hD3cY6vN5rL8tJ2fG9x";
