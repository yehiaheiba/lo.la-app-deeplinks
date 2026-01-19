"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

type Props = {
  path: string;
  queryString: string;
  appScheme: string;
  androidPackage: string;
  iosAppStoreUrl: string;
  androidPlayStoreUrl: string;
};

function buildCustomSchemeUrl(
  appScheme: string,
  path: string,
  queryString: string
) {
  const qs = queryString
    ? queryString.startsWith("?")
      ? queryString
      : `?${queryString}`
    : "";
  // Your RN app should handle `lola://d/<path>?...`
  return `${appScheme}://d/${path}${qs}`;
}

function buildAndroidIntentUrl(
  appScheme: string,
  androidPackage: string,
  path: string,
  queryString: string
) {
  const qs = queryString
    ? queryString.startsWith("?")
      ? queryString
      : `?${queryString}`
    : "";
  // intent://d/<path>?...#Intent;scheme=lola;package=com.example.app;end
  return `intent://d/${path}${qs}#Intent;scheme=${encodeURIComponent(
    appScheme
  )};package=${encodeURIComponent(androidPackage)};end`;
}

export function OpenInApp(props: Props) {
  const [attempted, setAttempted] = useState(false);

  const { schemeUrl, intentUrl } = useMemo(() => {
    return {
      schemeUrl: buildCustomSchemeUrl(
        props.appScheme,
        props.path,
        props.queryString
      ),
      intentUrl: buildAndroidIntentUrl(
        props.appScheme,
        props.androidPackage,
        props.path,
        props.queryString
      ),
    };
  }, [props.androidPackage, props.appScheme, props.path, props.queryString]);

  const canAutoOpen = () => {
    // Allow disabling auto-open via query param (handy for QA / support)
    const sp = new URLSearchParams(window.location.search);
    if (sp.get("noapp") === "1" || sp.get("noapp") === "true") return false;

    // Avoid loops on refresh/back navigation: try only once per URL per browser session.
    const key = `deeplink:autoopen:v1:${window.location.pathname}${window.location.search}`;
    try {
      if (sessionStorage.getItem(key) === "1") return false;
      sessionStorage.setItem(key, "1");
    } catch {
      // If storage is blocked, proceed without the guard.
    }

    return true;
  };

  const open = () => {
    setAttempted(true);

    // Try to open the app. If it fails (app not installed), redirect to store after a short delay.
    // Note: there's no perfect detection on all browsers; this covers common cases reasonably well.
    const ua = navigator.userAgent.toLowerCase();
    const isAndroid = ua.includes("android");

    const start = Date.now();
    const timeoutMs = isAndroid ? 1200 : 1700;

    window.location.href = isAndroid ? intentUrl : schemeUrl;

    window.setTimeout(() => {
      // If the user actually switched apps, the page will often be backgrounded quickly.
      // If we're still here after ~1.4s, assume failure and go to the store.
      if (Date.now() - start >= timeoutMs - 50) {
        window.location.href = isAndroid
          ? props.androidPlayStoreUrl
          : props.iosAppStoreUrl;
      }
    }, timeoutMs);
  };

  useEffect(() => {
    if (!canAutoOpen()) return;
    const t = window.setTimeout(() => open(), 50);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      <div className="middle-section">
        <Image
          src="/app-image.jpg"
          alt="App Screenshot"
          className="app-screenshot"
          width={600}
          height={1000}
          priority
        />
      </div>

      <div className="bottom-section">
        <button className="btnBrand" onClick={open}>
          {attempted && <div className="loading-spinner" />}
          <span>{attempted ? "Opening..." : "Go to App"}</span>
          {!attempted && (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
