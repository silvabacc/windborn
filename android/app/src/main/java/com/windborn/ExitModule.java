package com.windborn;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Map;
import java.util.HashMap;
import android.app.Activity;

public class ExitModule extends ReactContextBaseJavaModule {
  private ReactContext mReactContext;

  ExitModule(ReactApplicationContext context) {
    super(context);
    this.mReactContext = context;
  }

  @Override
  public String getName() {
   return "ExitModule";
  }

  @ReactMethod
  public void exitApp() {
    Activity activity = mReactContext.getCurrentActivity();
    activity.finishAndRemoveTask();
  }
}