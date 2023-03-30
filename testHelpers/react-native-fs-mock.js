export const mockReadFile = jest.fn();
export const mockCopyFile = jest.fn();

const rnFsMock = {
  readFile: mockReadFile,
  copyFile: mockCopyFile,
  unlink: jest.fn(),
};

export default rnFsMock;
