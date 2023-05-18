module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/**/*.test.ts'],
  forceExit: true,
  setupFilesAfterEnv: ['<rootDir>/src/utils/setupFile.ts'],
}
