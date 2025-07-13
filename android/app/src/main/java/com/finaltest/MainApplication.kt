// File: android/app/src/main/java/com/finaltest/MainApplication.kt
package com.finaltest

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.soloader.SoLoader
import com.finaltest.AdsterPackage
import com.finaltest.BannerVideoPackage

class MainApplication : Application(), ReactApplication {

  override fun onCreate() {
    super.onCreate()
    // initialize SoLoader: takes (Context, Boolean)
    SoLoader.init(this, /* native exopackage */ false)
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      DefaultNewArchitectureEntryPoint.load()
    }
  }

  private val mReactNativeHost: ReactNativeHost = object : DefaultReactNativeHost(this) {
    override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

    override fun getPackages(): List<ReactPackage> {
      val packages = PackageList(this).packages.toMutableList()
      // add your custom package here
      packages.add(BannerVideoPackage())
      packages.add(AdsterPackage())
      return packages
    }

    override fun getJSMainModuleName(): String = "index"
  }

  override fun getReactNativeHost(): ReactNativeHost = mReactNativeHost
}
