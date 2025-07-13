package com.finaltest

import android.util.Log
import android.view.ViewGroup
import android.widget.FrameLayout
import com.adster.sdk.mediation.AdError
import com.adster.sdk.mediation.AdRequestConfiguration
import com.adster.sdk.mediation.MediationAdListener
import com.adster.sdk.mediation.MediationBannerVideoAd
import com.adster.sdk.mediation.AdSterAdLoader
import com.adster.sdk.mediation.BannerVideoAdEventsListener
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.uimanager.events.RCTEventEmitter

class BannerVideoViewManager : SimpleViewManager<FrameLayout>(), LifecycleEventListener {

    companion object {
        private const val TAG = "RNBannerVideoView"
    }

    private var bannerVideoAd: MediationBannerVideoAd? = null

    override fun getName(): String = "RNBannerVideoView"

    override fun createViewInstance(ctx: ThemedReactContext): FrameLayout {
        Log.d(TAG, "createViewInstance() called")
        ctx.addLifecycleEventListener(this)
        // No hard‑coded layoutParams here: RN will apply your JS style.
        return FrameLayout(ctx)
    }

    @ReactProp(name = "placementId")
    fun setPlacementId(container: FrameLayout, pid: String) {
        Log.d(TAG, "setPlacementId() called with pid=$pid on viewId=${container.id}")
        loadBannerVideo(container, pid)
    }

    private fun loadBannerVideo(container: FrameLayout, pid: String) {
        Log.d(TAG, "loadBannerVideo() start for pid=$pid")
        val ctx = container.context as? ThemedReactContext
            ?: run {
                Log.e(TAG, "Invalid context, aborting loadBannerVideo")
                return
            }

        if (pid.isBlank()) {
            Log.e(TAG, "Blank placementId, aborting loadBannerVideo")
            return
        }

        val config = AdRequestConfiguration.builder(ctx, pid).build()
        AdSterAdLoader.builder()
            .withAdsListener(object : MediationAdListener() {
                override fun onBannerVideoAdLoaded(ad: MediationBannerVideoAd) {
                    Log.d(TAG, "onBannerVideoAdLoaded() invoked")
                    bannerVideoAd = ad
                    container.removeAllViews()

                    // Wait a moment so RN has measured the container
                    container.post {
                        // Grab whatever RN-sized width/height it ended up with
                        val w = container.width.takeIf { it > 0 }
                            ?: container.context.resources.displayMetrics.widthPixels
                        val h = container.height.takeIf { it > 0 }
                            ?: (w * 9 / 16)

                        Log.d(TAG, "Container size: w=$w, h=$h")

                        ad.view?.let { view ->
                            Log.d(TAG, "Adding ad view to container")
                            val lp = FrameLayout.LayoutParams(w, h)
                            container.addView(view, lp)
                            Log.d(TAG, "Ad view added, childCount=${container.childCount}")
                            container.requestLayout()

                            // 1) notify JS that load succeeded
                            ctx.getJSModule(RCTEventEmitter::class.java)
                                .receiveEvent(container.id, "onAdLoaded", Arguments.createMap())
                        } ?: Log.w(TAG, "Ad view was null in onBannerVideoAdLoaded")
                    }
                }

                override fun onFailure(adError: AdError) {
                    Log.e(TAG, "onFailure code=${adError.errorCode}, msg=${adError.errorMessage}")
                    val payload = Arguments.createMap().apply {
                        putString("error", "${adError.errorCode}: ${adError.errorMessage}")
                    }
                    ctx.getJSModule(RCTEventEmitter::class.java)
                        .receiveEvent(container.id, "onAdFailedToLoad", payload)
                }
            })
            .withBannerVideoAdEventsListener(object : BannerVideoAdEventsListener() {
                override fun onAdPaused()               { bannerVideoAd?.pause(); Log.d(TAG, "onAdPaused()") }
                override fun onAdPlayed()               { Log.d(TAG, "onAdPlayed()") }
                override fun onAdResumed()              { bannerVideoAd?.resume(); Log.d(TAG, "onAdResumed()") }
                override fun onAdStopped()              { bannerVideoAd?.pause(); Log.d(TAG, "onAdStopped()") }
                override fun onAdSkipped()              { bannerVideoAd?.pause(); Log.d(TAG, "onAdSkipped()") }
                override fun onVolumeChanged(v: Int)    { Log.d(TAG, "onVolumeChanged($v)") }
                override fun onAllAdCompleted()         { bannerVideoAd?.destroy(); Log.d(TAG, "onAllAdCompleted()") }
                override fun onContentPauseRequested()  { bannerVideoAd?.pause(); Log.d(TAG, "onContentPauseRequested()") }
                override fun onContentResumeRequested() { bannerVideoAd?.resume(); Log.d(TAG, "onContentResumeRequested()") }
                override fun onAdClicked()              { Log.d(TAG, "onAdClicked()") }
                override fun onAdLoadFailure(adError: AdError) {
                    Log.d(TAG, "onAdLoadFailure(): ${adError.errorMessage}")
                }
                override fun onAdTapped()               { Log.d(TAG, "onAdTapped()") }
                override fun onSkippableStateChanged()  { Log.d(TAG, "onSkippableStateChanged()") }
            })
            .build()
            .loadAd(config)
    }

    // React‑Native host lifecycle
    override fun onHostPause()   { bannerVideoAd?.pause();   Log.d(TAG, "onHostPause()") }
    override fun onHostResume()  { bannerVideoAd?.resume();  Log.d(TAG, "onHostResume()") }
    override fun onHostDestroy() { bannerVideoAd?.destroy(); Log.d(TAG, "onHostDestroy()") }

    // **Declare all three as direct events** so RN recognizes them:
    override fun getExportedCustomDirectEventTypeConstants(): Map<String, Any> {
      return mapOf(
        "onAdLoaded"       to mapOf("registrationName" to "onAdLoaded"),
        "onAdFailedToLoad" to mapOf("registrationName" to "onAdFailedToLoad")
      )
    }
}