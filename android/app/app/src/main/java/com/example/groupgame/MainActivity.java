package com.example.groupgame;

import android.annotation.SuppressLint;
import android.content.res.Configuration;
import android.os.Bundle;
import android.util.Log;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.webkit.WebSettingsCompat;
import androidx.webkit.WebViewFeature;

import java.util.Objects;

public class MainActivity extends AppCompatActivity {

    @SuppressLint({"SetJavaScriptEnabled", "AddJavascriptInterface"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // https://stackoverflow.com/a/44241858/11145447
        Objects.requireNonNull(getSupportActionBar()).hide();


        final WebView webView = findViewById(R.id.webView);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);

        // Change prefers-color-scheme based on system ui mode
        final boolean dark = (getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK)
                != Configuration.UI_MODE_NIGHT_NO;
        if (dark) {
            if (WebViewFeature.isFeatureSupported(WebViewFeature.FORCE_DARK)) {
                Log.d(getClass().getName(), "Set force dark");
                WebSettingsCompat.setForceDark(settings, WebSettingsCompat.FORCE_DARK_ON);
            } else {
                Log.d(getClass().getName(), "The device uses dark ui, but dark mode is not supported for this webView");
            }
            if (WebViewFeature.isFeatureSupported(WebViewFeature.FORCE_DARK_STRATEGY)) {
                WebSettingsCompat.setForceDarkStrategy(settings, WebSettingsCompat.DARK_STRATEGY_WEB_THEME_DARKENING_ONLY);
                Log.d(getClass().getName(), "Set force dark strategy to change web theme");
            } else {
                Log.d(getClass().getName(), "Force dark strategy not supported");
            }
        }

        // Log webView version
        Log.i(getClass().getName(),"Web view user agent: " + settings.getUserAgentString());

        webView.setWebChromeClient(new WebChromeClient());
        Log.d(getClass().getName(), "Hello?");
        webView.addJavascriptInterface(new JavascriptInterface(this), "Android");
        webView.loadData("", "text/html", null);
        webView.loadUrl("file:///android_asset/index.html");
    }
}