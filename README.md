# React Native Deep Links (Next.js server)

This Next.js app serves:

- **Deep-link landing pages** at `/d/...` (shows an **Open in app** button with store fallback)
- iOS **Universal Links** association file at `/.well-known/apple-app-site-association`
- Android **App Links** association file at `/.well-known/assetlinks.json`

## What you need to provide (from your side)

- **A domain** (e.g. `links.yourdomain.com`) hosting this Next.js app over **HTTPS**
- **iOS**
  - **Apple Team ID** + **iOS bundle id** → combined as `IOS_APP_ID=TEAMID.bundleId`
  - Enable **Associated Domains** in Xcode and add:
    - `applinks:links.yourdomain.com`
  - Decide which paths should open the app (default: `/d/*`) via `IOS_UNIVERSAL_LINK_PATHS`
- **Android**
  - Your **applicationId / package name** (e.g. `com.company.app`)
  - Your app signing **SHA-256 cert fingerprint(s)** (Play/App Signing or debug/release as needed)
  - Add an **intent-filter** for HTTPS links to your domain in `AndroidManifest.xml`

## Configure env

This environment blocks creating dot-env files via tooling, so:

1. Copy `env.example` to `.env.local`
2. Fill in values

Minimum required vars:

- `NEXT_PUBLIC_APP_SCHEME`
- `NEXT_PUBLIC_ANDROID_PACKAGE`
- `NEXT_PUBLIC_IOS_APP_STORE_URL`
- `NEXT_PUBLIC_ANDROID_PLAY_STORE_URL`
- `IOS_APP_ID`
- `IOS_UNIVERSAL_LINK_PATHS` (optional; defaults to `/d/*`)
- `ANDROID_SHA256_CERT_FINGERPRINTS` (required for Android App Links verification)

## Run locally

```bash
npm install
npm run dev
```

Then open:

- `http://localhost:3000/d/product/123?ref=web`
- `http://localhost:3000/.well-known/apple-app-site-association`
- `http://localhost:3000/.well-known/assetlinks.json`

## Notes

- **Universal Links / App Links**: If the association files are correct and the app is installed, opening a matching HTTPS URL can open the app directly.
- The `/d/...` page also tries a **custom scheme** (`lola://...`) + Android **intent://** as a fallback, then redirects to the store if the app isn’t installed.


