export default {
  displayName: 'environment',

  setupFilesAfterEnv: ['<rootDir>/test-setup.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json'
    }
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../docs/environment/coverage/lcov-report',
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: 'docs/environment/coverage',
        filename: 'index.html',
        pageTitle: 'Environment Tests',
        expand: true,
        hideIcon: true
      }
    ]
  ],
  preset: '../../jest.preset.js'
};
