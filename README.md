# [Windborn](http://silvabacc.github.io/windborn/)
<img alt="banner" src="https://user-images.githubusercontent.com/47926269/224542662-ab3568e0-8179-4978-bd55-9e8938dbe501.png">

Allows you to copy images from Reddit posts to your clipboard. The offical Reddit mobile application does not support copying images to clipboard, instead, if users want to share a image from a post, they would have to download the image to their device's gallery. 

Once the image is saved to your clipboard, you can paste the image wherever you like

# Demo
<img src="https://user-images.githubusercontent.com/47926269/224524727-aaf76974-5f68-4c7d-bcea-e93e98052dd0.gif" width="30%">

Once the image is saved, you can paste it just like any other image/text. For example, we can see here that I have the option to paste this image on WhatsApp

<img src="https://user-images.githubusercontent.com/47926269/224524928-618a2590-c25a-4fe5-8a22-c7f14af7c9f5.png" width="30%">

# Running the App

Windborn is a mobile app built with React Native. It requires an Android emulator or physical device to run. This guide will show you how to set up an emulator and run the app on your computer.

Prerequisites

Before you can run the app, you'll need to install the following software:

* `Node.js`
* `Yarn`

You'll also need to set up an Android emulator or connect a physical device to your computer.

## Setting up the emulator

To set up an Android emulator, follow these steps:

* Install [Android Studio](https://developer.android.com/studio).
* Open Android Studio and select `AVD Manager` from the `Configure` menu.
* Click `Create Virtual Device` and follow the prompts to create a new emulator.
* Once the emulator is created, select it in the `AVD Manager` and click `Start`.

## Setting up on a physical Android device

If you don't want to run your application on an emulator, you can always use a physical device. 
To run the app on a physical Android device, follow these steps:

* Connect your device to your computer via USB cable.
* Enable `USB Debugging` on your device by going to `Settings` > `Developer options` > `USB debugging`. (You will need to find a way to enable developer options for your specific android device. Ususally it's tapping the `Build Number` in `About Phone` section 10 times)
* Make sure your device is detected by running the command adb devices in your terminal.

### Troubleshoot
You may also need to set `Default USB Configuration` to `File Transfer` if you've set up your physical Android advice and the application is still not being launched/installed

## Running the app

To run the app, follow these steps:

* Clone this repository to your local machine.
* Navigate to the project directory in your terminal.
* Run `yarn install` to install the project dependencies.
* Run `yarn start` to start the development server.
* Run `yarn android` to build and run the app on your emulator or device.

That's it! Your app should now be running on your emulator or device. If you encounter any issues or errors, refer to the React Native documentation or seek help from the community.

#Contribution

Contributions are always welcome! If you'd like to contribute to this project, please follow these steps:

* Fork this repository to your own account.
* Create a new branch with a descriptive name (git checkout -b my-new-feature).
* Make changes to the code, documentation, or other project files.
* Commit your changes with a descriptive commit message (git commit -m 'Add some feature').
* Push your changes to your forked repository (git push origin my-new-feature).
* Submit a pull request to this repository with your changes.
* Please make sure to follow the existing code style and conventions, and include unit tests for any new features or bug fixes.

If you have any questions or issues, please don't hesitate to open an issue or reach out to the project maintainers for help. Thank you for your contributions!
