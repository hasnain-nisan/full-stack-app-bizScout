import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  collectCoverage: true,
  coverageDirectory: "coverage", // Directory for the reports
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}", // Specify which files to include
    "!src/**/*.d.ts",          // Exclude type declaration files
    "!src/**/index.{js,ts}",    // Exclude index files
  ],
  coverageReporters: ["text", "lcov", "html"], // Formats: text, HTML, LCOV, etc.
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};

export default config;
