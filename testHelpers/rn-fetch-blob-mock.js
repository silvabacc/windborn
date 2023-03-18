let RNFetchBlob = jest.mock('rn-fetch-blob');

RNFetchBlob.readFile = jest.fn();

export default {RNFetchBlob};
