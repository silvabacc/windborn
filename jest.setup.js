jest.mock('rn-fetch-blob', () =>
  require('./testHelpers/rn-fetch-blob-mock.js'),
);

jest.mock('react-native-fs', () =>
  require('./testHelpers/react-native-fs-mock.js'),
);

jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock'),
);

require('react-native-gesture-handler/jestSetup');
