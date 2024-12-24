module.exports = {
  testEnvironment: "node", // Use Node.js environment for backend tests
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"], // Setup script path
  testMatch: ["**/tests/**/*.test.js"], // Match test files
  collectCoverage: true, // Enable code coverage
  collectCoverageFrom: [
    "controllers/**/*.js",
    "models/**/*.js",
    "middleware/**/*.js",
    "!**/node_modules/**",
  ],
  coverageDirectory: "coverage", // Output directory for coverage reports
};
