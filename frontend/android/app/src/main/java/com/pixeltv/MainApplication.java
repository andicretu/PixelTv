package com.pixeltv;

import android.app.Application;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;               // ← core package
import com.reactnativecommunity.webview.RNCWebViewPackage;     // ← WebView
import com.facebook.react.bridge.JavaScriptExecutorFactory;
import com.facebook.react.jscexecutor.JSCExecutorFactory;
import com.facebook.react.modules.systeminfo.AndroidInfoHelpers;
import com.facebook.soloader.SoLoader;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;
import org.jetbrains.annotations.Nullable;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new RNCWebViewPackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }

        @Override
        protected JavaScriptExecutorFactory getJavaScriptExecutorFactory() {
            return new JSCExecutorFactory(
                    getApplicationContext().getPackageName(),
                    AndroidInfoHelpers.getFriendlyDeviceName()
            );
        }
    };

    @Override public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public Intent registerReceiver(@Nullable BroadcastReceiver receiver, IntentFilter filter) {
        if (Build.VERSION.SDK_INT >= 34
                && getApplicationInfo().targetSdkVersion >= 34) {
            // explicitly declare exported for Android 14+
            return super.registerReceiver(receiver, filter, Context.RECEIVER_EXPORTED);
        } else {
            return super.registerReceiver(receiver, filter);
        }
    }

    @Override public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }
}
