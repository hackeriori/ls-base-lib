import type {Config} from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  coverageProvider: "v8",
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom'
};

export default config;
