import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

/** @type {import('ts-jest').JestConfigWithTsJest} */
const customJestConfig = {
  preset: "ts-jest",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.mjs"],
  testEnvironment: "jsdom",
  transform: {},
};

export default createJestConfig(customJestConfig);
