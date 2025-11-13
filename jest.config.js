const { createDefaultPreset } = require('ts-jest');

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  // ============================================================================
  // Jest Configuration - Best Practices
  // ============================================================================

  // 1. Test Environment
  testEnvironment: 'node',

  // 2. TypeScript Support
  preset: 'ts-jest',
  transform: {
    ...tsJestTransformCfg,
  },

  // 3. Setup and Configuration
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // 4. Test Discovery
  testMatch: ['<rootDir>/src/**/*.test.ts', '<rootDir>/tests/**/*.test.ts', '<rootDir>/tests/**/*.spec.ts'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/', '<rootDir>/build/', '<rootDir>/.git/'],

  // 5. Coverage Configuration
  collectCoverage: false, // Enable with --coverage flag
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
    '!src/index.ts', // Entry point
    '!src/app.ts', // App configuration
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 70,
      lines: 85,
      statements: 85,
    },
  },

  // 6. Mock Management
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,

  // 7. Performance and Parallelization
  maxWorkers: '50%', // Use half of available CPU cores
  workerIdleMemoryLimit: '512MB',

  // 8. Verbose Output and Reporting
  verbose: false, // Enable with --verbose flag
  silent: false,

  // 9. Module Resolution
  moduleNameMapper: {
    // Path aliases for clean imports
    '@container/(.*)': '<rootDir>/src/container/$1',
    '@use-cases/(.*)': '<rootDir>/src/use-cases/$1',
    '@repositories/(.*)': '<rootDir>/src/respositories/$1',
    '@utils/(.*)': '<rootDir>/src/utils/$1',
    '@dtos/(.*)': '<rootDir>/src/dtos/$1',
    '@controllers/(.*)': '<rootDir>/src/controllers/$1',
    '@exceptions/(.*)': '<rootDir>/src/exceptions/$1',
    '@middleware/(.*)': '<rootDir>/src/middlewares/$1',
    '@validators/(.*)': '<rootDir>/src/validators/$1',
    '@tests/(.*)': '<rootDir>/tests/$1',
    '@lib/(.*)': '<rootDir>/src/lib/$1',
  },

  // 10. Module File Extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // 11. Transform Configuration
  transformIgnorePatterns: ['node_modules/(?!(.*\\.mjs$|@babel/runtime|@prisma/client))'],

  // 12. Global Setup/Teardown
  globalSetup: undefined, // Add if needed for database setup
  globalTeardown: undefined, // Add if needed for cleanup

  // 13. Error Handling
  errorOnDeprecated: true,

  // 14. Test Timeout (can be overridden in jest.setup.ts)
  testTimeout: 10000,

  // 15. Bail Configuration
  bail: false, // Set to true to stop on first failure

  // 17. Watch Mode Configuration
  watchPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/build/',
    '<rootDir>/.git/',
    '<rootDir>/coverage/',
  ],

  // 18. Notify Configuration
  notify: false,
  notifyMode: 'failure-change',
};
