/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts", "**/*.test.js"],
  collectCoverageFrom: [
    "source/**/*.ts",
    "!source/index.ts",
    "!**/node_modules/**",
    "!**/dist/**",
  ],
  coverageDirectory: "coverage",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        isolatedModules: true,
      },
    ],
  },
  globals: {
    "ts-jest": {
      isolatedModules: true,
      tsconfig: "tsconfig.json",
    },
  },
};
