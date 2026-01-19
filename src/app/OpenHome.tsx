"use client";

import { useMemo, useState } from "react";
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
         
          <span>{attempted ? "Opening..." : "Go to App"}</span>
          
        </button>
      </div>
    </div>
  );
}
