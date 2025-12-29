import { getPublicConfig } from "@/lib/publicConfig";
import { OpenHome } from "./OpenHome";

export default function HomePage() {
  const cfg = getPublicConfig();
  return (
    <main className="fullscreen">
      <OpenHome
        appScheme={cfg.appScheme}
        androidPackage={cfg.androidPackage}
        iosAppStoreUrl={cfg.iosAppStoreUrl}
        androidPlayStoreUrl={cfg.androidPlayStoreUrl}
      />
    </main>
  );
}
