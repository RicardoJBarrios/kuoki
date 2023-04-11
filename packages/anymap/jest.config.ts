/* eslint-disable */
export default {
  displayName: 'anymap',

  setupFilesAfterEnv: ['<rootDir>/test-setup.ts'],
  globals: {},
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json'
      }
    ]
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../docs/anymap/coverage/lcov-report',
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: 'docs/anymap/coverage',
        filename: 'index.html',
        pageTitle: 'Anymap Tests',
        expand: true,
        hideIcon: true
      }
    ]
  ],
  preset: '../../jest.preset.js'
};
