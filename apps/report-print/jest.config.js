/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest/presets/default-esm', // Presets for ESM support
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    // Handle module aliases (if you have them in tsconfig.json)
    // e.g., '^@/(.*)$': '<rootDir>/src/$1'
    '^@/(.*)$': '<rootDir>/src/$1',
    // If you import CSS/LESS modules
    '\\.(css|less)$': 'identity-obj-proxy', // Mocks CSS/LESS imports
  },
  transform: {
    // '^.+\\.jsx?$': 'babel-jest', // if you have JS/JSX files to transform with Babel
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: 'tsconfig.json', // Path to your tsconfig.json
      },
    ],
  },
  // Indicates whether each individual test should be reported during the run
  verbose: true,
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,
  // A list of paths to modules that run some code to configure or set up the testing framework before each test file in the suite is executed.
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
}
