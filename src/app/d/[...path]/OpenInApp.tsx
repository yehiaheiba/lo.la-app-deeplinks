"use client";

import { useMemo, useState } from "react";

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

  const open = () => {
    setAttempted(true);

    // Try to open the app. If it fails (app not installed), redirect to store after a short delay.
    // Note: there's no perfect detection on all browsers; this covers common cases reasonably well.
    const ua = navigator.userAgent.toLowerCase();
    const isAndroid = ua.includes("android");

    const start = Date.now();
    const timeoutMs = 1400;

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

  return (
    <div className="card">
      <h1>Open in app</h1>
      <p className="muted">
        This page can open the installed app directly. If the app isn’t
        installed, we’ll send you to the store.
      </p>

      <div className="row" style={{ marginTop: 14 }}>
        <button className="btn btnPrimary" onClick={open}>
          Open in app
        </button>
        <a className="btn" href={`/d/${props.path}${props.queryString || ""}`}>
          Continue on web
        </a>
      </div>

      <div style={{ marginTop: 14 }}>
        <div className="muted">Debug</div>
        <div className="mono" style={{ marginTop: 6, wordBreak: "break-all" }}>
          Scheme URL: {schemeUrl}
          <br />
          Android intent: {intentUrl}
          <br />
          Attempted: {attempted ? "yes" : "no"}
        </div>
      </div>
    </div>
  );
}
