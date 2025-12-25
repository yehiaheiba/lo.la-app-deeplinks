import type { Metadata } from "next";
import { headers } from "next/headers";
import { joinPathSegments } from "@/lib/deeplink";
import { getPublicConfig } from "@/lib/publicConfig";
import { OpenInApp } from "./OpenInApp";

type Props = {
  params: { path: string[] };
  searchParams: Record<string, string | string[] | undefined>;
};

function toQueryString(searchParams: Props["searchParams"]): string {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(searchParams)) {
    if (typeof v === "undefined") continue;
    if (Array.isArray(v)) v.forEach((vv) => usp.append(k, vv));
    else usp.set(k, v);
  }
  const qs = usp.toString();
  return qs ? `?${qs}` : "";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const path = joinPathSegments(params.path ?? []);
  return {
    title: `Open ${path || "content"} in app`,
    description: "Open this content in the app, or continue on the web.",
  };
}

export default function DeepLinkLandingPage({ params, searchParams }: Props) {
  const cfg = getPublicConfig();
  const path = joinPathSegments(params.path ?? []);
  const queryString = toQueryString(searchParams);

  // Helpful for debugging (e.g. when behind a proxy/CDN)
  const h = headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "";
  const proto = h.get("x-forwarded-proto") ?? "https";
  const webUrl = host
    ? `${proto}://${host}/d/${path}${queryString}`
    : `/d/${path}${queryString}`;

  return (
    <main className="container">
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="muted">Deep link landing</div>
        <div className="mono" style={{ marginTop: 8, wordBreak: "break-all" }}>
          Web URL: {webUrl}
          <br />
          Path: /d/{path}
        </div>
      </div>

      <OpenInApp
        path={path}
        queryString={queryString}
        appScheme={cfg.appScheme}
        androidPackage={cfg.androidPackage}
        iosAppStoreUrl={cfg.iosAppStoreUrl}
        androidPlayStoreUrl={cfg.androidPlayStoreUrl}
      />
    </main>
  );
}
