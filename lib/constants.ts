export const isProductionEnvironment = process.env.NODE_ENV === "production";
export const isDevelopmentEnvironment = process.env.NODE_ENV === "development";
export const isTestEnvironment = Boolean(
  process.env.PLAYWRIGHT_TEST_BASE_URL ||
    process.env.PLAYWRIGHT ||
    process.env.CI_PLAYWRIGHT ||
    process.env.NODE_ENV === "test"
);

export const guestRegex = /^guest-\d+$/;

// Generate dummy password dynamically when needed
export const DUMMY_PASSWORD = "dummy-hashed-password-placeholder";
