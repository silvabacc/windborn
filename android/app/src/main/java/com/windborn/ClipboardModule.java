package com.windborn;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.provider.MediaStore;
import android.util.Base64;
import android.app.Activity;

public class ClipboardModule extends ReactContextBaseJavaModule {
  private ReactContext mReactContext;

  ClipboardModule(ReactApplicationContext context) {
    super(context);
    this.mReactContext = context;
  }

  @Override
  public String getName() {
   return "ClipboardModule";
  }

  @ReactMethod
  public void copyBase64(String base64) {
    byte[] decodedBytes = Base64.decode(base64, Base64.DEFAULT);
    Bitmap bitmap = BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.length);
    String bitmapPath = MediaStore.Images.Media.insertImage(mReactContext.getContentResolver(), bitmap, "Title", null);
    Uri bitmapUri = Uri.parse(bitmapPath);
    ClipData clipData = ClipData.newUri(mReactContext.getContentResolver(), "Image", bitmapUri);
    ClipboardManager clipboardManager = (ClipboardManager) mReactContext.getSystemService(Context.CLIPBOARD_SERVICE);
    clipboardManager.setPrimaryClip(clipData);
    Activity activity = mReactContext.getCurrentActivity();
    activity.finishAndRemoveTask();
  }
}