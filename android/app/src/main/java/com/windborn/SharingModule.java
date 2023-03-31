package com.windborn;

import static android.content.Context.CLIPBOARD_SERVICE;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.provider.MediaStore;
import android.util.Base64;
import android.app.Activity;
import android.webkit.MimeTypeMap;

import androidx.core.content.FileProvider;

import java.io.File;
import java.nio.file.Files;

public class SharingModule extends ReactContextBaseJavaModule {
  private ReactContext mReactContext;

  SharingModule(ReactApplicationContext context) {
    super(context);
    this.mReactContext = context;
  }

  @Override
  public String getName() {
   return "SharingModule";
  }


  @ReactMethod
  public void share(String filePath, String extension) {
    File file = new File(filePath);
    Uri uri = FileProvider.getUriForFile(mReactContext, "com.windborn.provider", file);
    String mimeType = MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension);

    Intent shareIntent = new Intent();
    shareIntent.setAction(Intent.ACTION_SEND);
    shareIntent.setType(mimeType);
    shareIntent.putExtra(Intent.EXTRA_STREAM, uri);

    Intent chooserIntent = Intent.createChooser(shareIntent, null);
    chooserIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

    mReactContext.startActivity(chooserIntent);
  }
}