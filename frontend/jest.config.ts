import type { Config } from 'jest';

const config: Config = {
   verbose: true,
   preset: 'ts-jest/presets/default',
   testEnvironment: 'jsdom',
};

export default config;
