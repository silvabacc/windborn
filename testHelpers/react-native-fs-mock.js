let RNFetchBlob = jest.mock('react-native-fs');

RNFetchBlob.fetch = jest.fn();
RNFetchBlob.wrap = jest.fn();

export default {RNFetchBlob};
