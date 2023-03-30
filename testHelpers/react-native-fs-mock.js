export const mockReadFile = jest.fn();

const rnFsMock = {
  readFile: mockReadFile,
  unlink: jest.fn(),
};

export default rnFsMock;
