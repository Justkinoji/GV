import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    globalSetup: '<rootDir>/config/jest.mongo.setup.ts',
    globalTeardown: '<rootDir>/config/jest.mongo.teardown.ts',
    testMatch: ['<rootDir>/src/**/tests/*.{test.ts,test.tsx}'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
}

export default config;