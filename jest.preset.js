const nxPreset = require('@nrwl/jest/preset');

module.exports = {
  ...nxPreset,
  setupFilesAfterEnv: [...(nxPreset.setupFilesAfterEnv ?? []), 'jest-extended/all'],
  moduleNameMapper: { ...(nxPreset.moduleNameMapper ?? {}), '^lodash-es$': 'lodash' },
  coverageReporters: [...(nxPreset.coverageReporters ?? []), 'lcov'],
};
