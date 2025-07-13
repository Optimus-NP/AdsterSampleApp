package com.finaltest

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.UIManagerModule

@ReactModule(name = BannerVideoModule.NAME)
class BannerVideoModule(
  private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

  companion object {
    const val NAME = "BannerVideoModule"
  }

  override fun getName(): String = NAME

  /**
   * Updates the placementId prop on an existing RNBannerVideoView,
   * triggering the native view manager to reload the ad.
   */
  @ReactMethod
  fun setPlacementId(viewTag: Int, placementId: String) {
    val props = Arguments.createMap().apply {
      putString("placementId", placementId)
    }
    // Safe‑call in case UIManagerModule isn't available
    reactContext
      .getNativeModule(UIManagerModule::class.java)
      ?.updateView(
        viewTag,
        "RNBannerVideoView",
        props
      )
  }

  /**
   * Example of other controls you could add:
   *
   * @ReactMethod
   * fun pause(viewTag: Int) {
   *   reactContext
   *     .getNativeModule(UIManagerModule::class.java)
   *     ?.dispatchViewManagerCommand(
   *       viewTag,
   *       "pause",
   *       null
   *     )
   * }
   */
}
