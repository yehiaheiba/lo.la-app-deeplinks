"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";

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
  const { schemeUrl, intentUrl } = useMemo(() => {
    return {
      schemeUrl: buildHomeSchemeUrl(props.appScheme),
      intentUrl: buildHomeAndroidIntentUrl(
        props.appScheme,
        props.androidPackage
      ),
    };
  }, [props.androidPackage, props.appScheme]);

  useEffect(() => {
    // Auto-open the app as soon as the landing page loads.
    const ua = navigator.userAgent.toLowerCase();
    const isAndroid = ua.includes("android");

    const start = Date.now();
    const timeoutMs = isAndroid ? 1200 : 1700;

    window.location.href = isAndroid ? intentUrl : schemeUrl;

    const timeoutId = window.setTimeout(() => {
      if (Date.now() - start >= timeoutMs - 50) {
        window.location.href = isAndroid
          ? props.androidPlayStoreUrl
          : props.iosAppStoreUrl;
      }
    }, timeoutMs);
    return () => window.clearTimeout(timeoutId);
  }, [intentUrl, schemeUrl, props.androidPlayStoreUrl, props.iosAppStoreUrl]);

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
    </div>
  );
}
