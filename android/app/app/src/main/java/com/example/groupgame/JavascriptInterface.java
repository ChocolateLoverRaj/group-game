package com.example.groupgame;

import android.app.AlertDialog;
import android.content.Context;
import android.util.Log;

public class JavascriptInterface {
    private final Context context;

    public JavascriptInterface (Context context) {
        this.context = context;
    }

    @android.webkit.JavascriptInterface
    public void dialog () {
        new AlertDialog.Builder(context)
                .setTitle("Hello")
                .setPositiveButton(android.R.string.ok, (dialogInterface, i) -> Log.d(getClass().getName(), "Dialog okayed"))
                .show();
    }
}
