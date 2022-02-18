module.exports = {
  bail: 0,
  testMatch: ["**/*.test.js"],
  transformIgnorePatterns: ["\\\\node_modules\\\\"],
  testTimeout: 200000,
  dependencies: {
    jest: "^27.5.0",
    playwright: "^1.18.1",
  },
};
