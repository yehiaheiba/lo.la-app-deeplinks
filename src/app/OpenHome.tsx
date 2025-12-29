"use client";

import { useMemo, useState } from "react";

type Props = {
  appScheme: string;
  androidPackage: string;
  iosAppStoreUrl: string;
  androidPlayStoreUrl: string;
};

function buildHomeSchemeUrl(appScheme: string) {
  // Open the app root (your app should handle this scheme).
  return `${appScheme}://`;
}

function buildHomeAndroidIntentUrl(appScheme: string, androidPackage: string) {
  // intent://#Intent;scheme=lola;package=com.example.app;end
  return `intent://#Intent;scheme=${encodeURIComponent(
    appScheme
  )};package=${encodeURIComponent(androidPackage)};end`;
}

export function OpenHome(props: Props) {
  const [attempted, setAttempted] = useState(false);

  const { schemeUrl, intentUrl } = useMemo(() => {
    return {
      schemeUrl: buildHomeSchemeUrl(props.appScheme),
      intentUrl: buildHomeAndroidIntentUrl(
        props.appScheme,
        props.androidPackage
      ),
    };
  }, [props.androidPackage, props.appScheme]);

  const open = () => {
    setAttempted(true);

    const ua = navigator.userAgent.toLowerCase();
    const isAndroid = ua.includes("android");

    const start = Date.now();
    const timeoutMs = isAndroid ? 1200 : 1700;

    window.location.href = isAndroid ? intentUrl : schemeUrl;

    window.setTimeout(() => {
      if (Date.now() - start >= timeoutMs - 50) {
        window.location.href = isAndroid
          ? props.androidPlayStoreUrl
          : props.iosAppStoreUrl;
      }
    }, timeoutMs);
  };

  return (
    <div className="fullscreen center">
      <div style={{ textAlign: "center" }}>
        <img
          src="/@lola-logo.jpg"
          alt="Lola"
          width={220}
          height={220}
          style={{ display: "block", margin: "0 auto 22px auto" }}
        />

        {attempted && (
          <img
            src="/loading.gif"
            alt="Loading"
            width={160}
            height={160}
            style={{ display: "block", margin: "0 auto 12px auto" }}
          />
        )}

        <button className="btn btnPrimary btnBrand" onClick={open}>
          {attempted ? "" : "Open in app"}
        </button>
      </div>
    </div>
  );
}
