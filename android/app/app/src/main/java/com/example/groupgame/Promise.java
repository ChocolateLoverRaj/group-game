package com.example.groupgame;

import android.util.Log;

import androidx.annotation.Nullable;

import java.util.HashSet;
import java.util.Set;

/**
 * The same as a [JavaScript Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
 *
 * @param <T>
 */
public class Promise<T> {
    public interface ThenCallback<T, R> {
        R run(T value);
    }

    public interface CatchCallback<T> {
        T run(Exception reason);
    }

    public interface VoidThenCallback<T> {
        void run(T value);
    }

    public interface VoidCatchCallback {
        void run(Exception reason);
    }

    private boolean pending = true;
    @Nullable
    private Set<VoidThenCallback<T>> thenCallbacks = new HashSet<>();
    @Nullable
    private Set<VoidCatchCallback> catchCallbacks = new HashSet<>();
    @Nullable
    private T result;
    @Nullable
    private Exception reason;

    public interface Resolve<T> {
        void run(T value);
    }

    public interface Reject {
        void run(Exception reason);
    }

    public interface Callback<T> {
        void run(Resolve<T> resolve, Reject reject);
    }

    public Promise(Callback<T> callback) {
        callback.run(
                value -> {
                    pending = false;
                    assert thenCallbacks != null;
                    for (VoidThenCallback<T> thenCallback : thenCallbacks) {
                        thenCallback.run(value);
                    }
                    this.result = value;
                    this.thenCallbacks = null;
                    this.catchCallbacks = null;
                },
                reason -> {
                    pending = false;
                    assert catchCallbacks != null;
                    for (VoidCatchCallback catchCallback : catchCallbacks) {
                        catchCallback.run(reason);
                    }
                    this.reason = reason;
                    this.thenCallbacks = null;
                    this.catchCallbacks = null;
                });
    }

    public Promise<Object> then(VoidThenCallback<T> callback) {
        return new Promise<>((resolve, reject) -> {
            if (pending) {
                assert thenCallbacks != null;
                thenCallbacks.add(value -> {
                    callback.run(value);
                    resolve.run(null);
                });
                assert catchCallbacks != null;
                catchCallbacks.add(reject::run);
            } else if (reason != null) reject.run(reason);
            else {
                callback.run(result);
                resolve.run(null);
            }
        });
    }

    public <TReturn> Promise<TReturn> then(ThenCallback<T, TReturn> callback) {
        return new Promise<>((resolve, reject) -> {
            if (result != null) resolve.run(callback.run(result));
            else if (reason != null) reject.run(reason);
            else {
                assert thenCallbacks != null;
                thenCallbacks.add(value -> resolve.run(callback.run(value)));
                assert catchCallbacks != null;
                catchCallbacks.add(reject::run);
            }
        });
    }


    public <TReturn> Promise<Object> _catch(CatchCallback<TReturn> callback) {
        return new Promise<>((resolve, reject) -> {
            if (reason != null) resolve.run(callback.run(reason));
            else if (result != null) resolve.run(result);
            else {
                assert thenCallbacks != null;
                thenCallbacks.add(resolve::run);
                assert catchCallbacks != null;
                catchCallbacks.add(reason -> resolve.run(callback.run(reason)));
            }
        });
    }

    public Promise<Object> _catch(VoidCatchCallback callback) {
        return new Promise<>((resolve, reject) -> {
            if (reason != null) {
                callback.run(reason);
                resolve.run(null);
            }
            else if (result != null) resolve.run(result);
            else {
                assert thenCallbacks != null;
                thenCallbacks.add(resolve::run);
                assert catchCallbacks != null;
                catchCallbacks.add(reason -> {
                    callback.run(reason);
                    resolve.run(null);
                });
            }
        });
    }

    public Promise<Object> then (VoidThenCallback<T> thenCallback, VoidCatchCallback catchCallback) {
        then(thenCallback);
        return _catch(catchCallback);
    }

    public <TReturn> Promise<TReturn> then (ThenCallback<T, TReturn> thenCallback, CatchCallback<TReturn> catchCallback) {
        return new Promise<>((resolve, reject) -> {
            if (pending) {
                assert thenCallbacks != null;
                thenCallbacks.add(value -> resolve.run(thenCallback.run(value)));
                assert catchCallbacks != null;
                catchCallbacks.add(reason -> resolve.run(catchCallback.run(reason)));
            }
            else if (reason != null) resolve.run(catchCallback.run(reason));
            else resolve.run(thenCallback.run(result));
        });
    }
}
