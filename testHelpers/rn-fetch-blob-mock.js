export const mockFetch = jest
  .fn()
  .mockImplementation(() => ({path: jest.fn()}));
export const mockConfig = jest.fn();

const rnFBMock = {
  fetch: mockFetch,
  fs: {
    dirs: 'directory',
  },
  session: () => ({dispose: jest.fn()}),
  config: values => {
    mockConfig(values);
    return {fetch: mockFetch};
  },
};

export default rnFBMock;
