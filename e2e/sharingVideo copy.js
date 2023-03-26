const {remote} = require('webdriverio');
const assert = require('assert');

const capabilities = {
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': 'Android',
  // 'appium:appPackage': 'com.reddit.frontpage',
  // 'appium:appActivity': '.IntroductionActivity',
};

const wdOpts = {
  host: process || 'localhost',
  port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
  path: '/wd/hub',
  logLevel: 'info',
  capabilities,
};

/**
 * Begin test with Reddit app on the Home screen
 */
async function runTest() {
  const driver = await remote(wdOpts);
  try {
    /**
     * Sharing Video
     */
    const redditIcon = await driver.$('//*[@text="Reddit"]');
    await redditIcon.click();

    await driver.closeApp();

    const avatar = await driver.$(
      '//android.widget.FrameLayout[@content-desc="Logged in avatar"]/android.widget.ImageView',
    );
    await avatar.waitForExist({timeout: 10000});
    await avatar.click();

    const myProfile = await driver.$('//*[@text="My profile"]');
    await myProfile.waitForExist({timeout: 10000});
    await myProfile.click();

    const bleedPlayer = await driver.$(
      '//android.widget.ImageView[@content-desc="Open full bleed player"]',
    );
    await bleedPlayer.waitForExist({timeout: 20000});
    await bleedPlayer.click();

    const tapVideo = await driver.$(
      '//android.view.View[@content-desc="Show"]',
    );
    await tapVideo.waitForExist({timeout: 20000});
    await tapVideo.click();

    const share = await driver.$(
      '//android.widget.ImageView[@content-desc="Share"]',
    );
    await share.waitForExist({timeout: 10000});
    await share.click();

    const shareVia = await driver.$(
      '//android.view.View[@content-desc="Share Via…"]',
    );
    await shareVia.waitForExist({timeout: 10000});
    await shareVia.click();

    const Windborn = await driver.$('//*[@text="Windborn"]');
    await Windborn.waitForExist({timeout: 10000});
    await Windborn.click();

    //Check if disabled - future work
    // const copyTo = await driver.$('//*[@text="Windborn"]');
    // await copyTo.waitForExist({timeout: 10000});

    const shareTo = await driver.$('//*[@text="Share"]');
    await shareTo.waitForExist({timeout: 10000});
    await shareTo.click();

    const previewFileName = await driver.$(
      '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.ScrollView/android.widget.TabHost/android.widget.LinearLayout/android.widget.FrameLayout/com.android.internal.widget.ViewPager/android.widget.RelativeLayout/com.android.internal.widget.RecyclerView/android.widget.LinearLayout[1]/android.widget.LinearLayout[1]/android.widget.TextView',
    );
    await previewFileName.waitForExist({timeout: 10000});
    const text = previewFileName.getText();
    assert.ok((await text).includes('.mp4'));
  } finally {
    await driver.pause(1000);
    await driver.deleteSession();
  }
}

runTest().catch(console.error);
