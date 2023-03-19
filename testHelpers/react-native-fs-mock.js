export const mockReadFile = jest.fn();

const rnFsMock = {
  readFile: mockReadFile,
};

export default rnFsMock;
