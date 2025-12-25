function requiredPublic(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

function optionalPublic(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim().length ? v : undefined;
}

function normalizeScheme(input: string): string {
  // Accept "lola", "lola:", or "lola://"
  let v = input.trim();
  v = v.replace(/:\/\//g, "");
  v = v.replace(/:$/g, "");
  return v;
}

export function getPublicConfig() {
  return {
    appScheme: normalizeScheme(requiredPublic("NEXT_PUBLIC_APP_SCHEME")),
    androidPackage: requiredPublic("NEXT_PUBLIC_ANDROID_PACKAGE"),
    iosAppStoreUrl: requiredPublic("NEXT_PUBLIC_IOS_APP_STORE_URL"),
    androidPlayStoreUrl: requiredPublic("NEXT_PUBLIC_ANDROID_PLAY_STORE_URL"),
    iosAppStoreId: optionalPublic("NEXT_PUBLIC_IOS_APP_STORE_ID"),
  };
}
