describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp({
      packageName: 'com.reddit.frontpage',
    });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should copy content to clipboard', () => {});
});
