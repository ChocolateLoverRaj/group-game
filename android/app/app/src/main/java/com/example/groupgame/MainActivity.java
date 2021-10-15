package com.example.groupgame;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.util.Log;
import android.webkit.WebChromeClient;
import android.webkit.WebView;

import androidx.appcompat.app.AppCompatActivity;

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
        webView.getSettings().setJavaScriptEnabled(true);
        webView.setWebChromeClient(new WebChromeClient());
        Log.d(getClass().getName(), "Hello?");
        webView.addJavascriptInterface(new JavascriptInterface(this), "Android");
        webView.loadData("", "text/html", null);
        webView.loadUrl("file:///android_asset/index.html");
    }
}