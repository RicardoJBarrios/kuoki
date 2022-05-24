export default {
  displayName: 'race-condition',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json'
    }
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../docs/race-condition/coverage/lcov-report',
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: 'docs/race-condition/coverage',
        filename: 'index.html',
        pageTitle: 'Race Condition Tests',
        expand: true,
        hideIcon: true
      }
    ]
  ],
  preset: '../../jest.preset.js'
};
