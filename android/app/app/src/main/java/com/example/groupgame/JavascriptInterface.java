package com.example.groupgame;

import android.app.Activity;
import android.os.Build;
import android.util.Log;
import android.webkit.WebView;

import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;

import java.net.Socket;
import java.util.Arrays;

public class JavascriptInterface {
    private final WebView webView;
    private final Activity activity;
    @Nullable
    private Socket socket;

    public JavascriptInterface(WebView webView, Activity activity) {
        this.webView = webView;
        this.activity = activity;
    }

    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    private <T> void sendPromiseResult (double thenId, double catchId, Promise<T> promise) {
        promise.then(value -> "androidCallbacks.get(" + thenId + ").emit(" + value + ")"
                , e -> "androidCallbacks.get(" + catchId + ").emit('" + e.getMessage() + "')")
                .then(js -> {
                    activity.runOnUiThread(() -> webView.evaluateJavascript(js, null));
                });
    }

    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    @android.webkit.JavascriptInterface
    public void joinTcp(double thenId, double catchId, String host, int port) {
        sendPromiseResult(thenId, catchId, new Promise<>((resolve, reject) -> new Thread() {
            @Override
            public void run() {
                try {
                    socket = new Socket(host, port);
                    resolve.run(null);
                } catch (Exception e) {
                    reject.run(e);
                }
            }
        }.start()));
    }

    @android.webkit.JavascriptInterface
    public boolean canJoinTcp() {
        return Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT;
    }

    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    @android.webkit.JavascriptInterface
    public void socketWrite (double thenId, double catchId, byte[] data) {
        sendPromiseResult(thenId, catchId, new Promise<>((resolve, reject) -> new Thread() {
            @Override
            public void run() {
                try {
                    assert socket != null;
                    Log.d(getClass().getName(), "Writing to socket: "+ Arrays.toString(data));
                    socket.getOutputStream().write(data);
                    Log.d(getClass().getName(), "Wrote to socket");
                    resolve.run(null);
                } catch (Exception e) {
                    reject.run(e);
                }
            }
        }.start()));
    }

    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    @android.webkit.JavascriptInterface
    public void socketRead (double thenId, double catchId) {
        sendPromiseResult(thenId, catchId, new Promise<Integer>(((resolve, reject) -> new Thread(){
            @Override
            public void run() {
                try {
                    assert socket != null;
                    Log.d(getClass().getName(), "Reading socket");
                    resolve.run(socket.getInputStream().read());
                    Log.d(getClass().getName(), "Read socket");
                } catch (Exception e) {
                    reject.run(e);
                }
            }
        }.start())));
    }

    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    @android.webkit.JavascriptInterface
    public void socketClose (double thenId, double catchId) {
        sendPromiseResult(thenId, catchId, new Promise<>(((resolve, reject) -> new Thread(){
            @Override
            public void run() {
                try {
                    assert socket != null;
                    socket.close();
                    socket = null;
                    resolve.run(null);
                } catch (Exception e) {
                    reject.run(e);
                }
            }
        }.start())));
    }
}

