package com.pixeltv;

import android.app.Application;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.PackageList;                   // ← import this
import com.facebook.react.bridge.JavaScriptExecutorFactory;
import com.facebook.react.jscexecutor.JSCExecutorFactory;
import com.facebook.react.modules.systeminfo.AndroidInfoHelpers;
import com.facebook.soloader.SoLoader;

import java.util.List;

public class MainApplication extends Application implements ReactApplication {
    private final ReactNativeHost mReactNativeHost =
            new ReactNativeHost(this) {
                @Override
                public boolean getUseDeveloperSupport() {
                    return BuildConfig.DEBUG;
                }

                // ← completely replace your old getPackages() with this:
                @Override
                protected List<ReactPackage> getPackages() {
                    return new PackageList(this).getPackages();
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

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }
}
