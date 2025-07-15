package com.finaltest

import android.util.Log
import android.view.View
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
private var pendingPlacementId: String? = null

override fun getName(): String = "RNBannerVideoView"

override fun createViewInstance(ctx: ThemedReactContext): FrameLayout {
    Log.d(TAG, "createViewInstance() called")
    ctx.addLifecycleEventListener(this)
    val container = FrameLayout(ctx)
    // Delay ad loading until after layout
    container.addOnLayoutChangeListener(object : View.OnLayoutChangeListener {
        override fun onLayoutChange(
            v: View,
            left: Int, top: Int, right: Int, bottom: Int,
            oldLeft: Int, oldTop: Int, oldRight: Int, oldBottom: Int
        ) {
            v.removeOnLayoutChangeListener(this)
            pendingPlacementId?.let { pid ->
                loadBannerVideo(container, pid)
                pendingPlacementId = null
            }
        }
    })
    return container
}

/**
 * Called whenever the JS side sets or updates the placementId prop.
 * We either load immediately (if container already laid out) or defer.
 */
@ReactProp(name = "placementId")
fun setPlacementId(container: FrameLayout, pid: String) {
    Log.d(TAG, "setPlacementId() called with pid=$pid on viewId=${container.id}")
    pendingPlacementId = pid
    // If layout already happened, onLayoutChange was removed, so try load now
    if (container.width > 0 && container.height > 0) {
        loadBannerVideo(container, pid)
        pendingPlacementId = null
    }
}

/**
 * Pause/resume prop from JS
 */
@ReactProp(name = "paused", defaultBoolean = false)
fun setPaused(container: FrameLayout, paused: Boolean) {
    bannerVideoAd?.let {
        if (paused) {
            it.pause()
            Log.d(TAG, "onPaused() via prop")
        } else {
            it.resume()
            Log.d(TAG, "onResumed() via prop")
        }
    }
}

private fun loadBannerVideo(container: FrameLayout, pid: String) {
    Log.d(TAG, "loadBannerVideo() start for pid=$pid")
    val ctx = container.context as? ThemedReactContext ?: run {
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
                container.post {
                    val w = container.width
                    val h = container.height
                    Log.d(TAG, "Container size at load: w=$w, h=$h")

                    ad.view?.let { view ->
                        // Force measure/layout on the ad view
                        view.measure(
                            View.MeasureSpec.makeMeasureSpec(w, View.MeasureSpec.EXACTLY),
                            View.MeasureSpec.makeMeasureSpec(h, View.MeasureSpec.EXACTLY)
                        )
                        view.layout(0, 0, w, h)
                        Log.d(TAG, "Ad view measured: ${view.measuredWidth}x${view.measuredHeight}")

                        val lp = FrameLayout.LayoutParams(w, h)
                        container.addView(view, lp)
                        view.bringToFront()
                        Log.d(TAG, "Ad view added, childCount=${container.childCount}")

                        // Notify JS
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

override fun getExportedCustomDirectEventTypeConstants(): Map<String, Any> {
    return mapOf(
        "onAdLoaded"       to mapOf("registrationName" to "onAdLoaded"),
        "onAdFailedToLoad" to mapOf("registrationName" to "onAdFailedToLoad")
    )
}
}
