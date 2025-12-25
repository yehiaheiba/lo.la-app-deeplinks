import { NextResponse } from "next/server";

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

function parsePaths(csv: string): string[] {
  return csv
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function GET() {
  const appID = required("IOS_APP_ID"); // TEAMID.bundleId
  const paths = parsePaths(process.env.IOS_UNIVERSAL_LINK_PATHS ?? "/d/*");

  const body = {
    applinks: {
      apps: [],
      details: [
        {
          appID,
          paths,
        },
      ],
    },
  };

  return new NextResponse(JSON.stringify(body), {
    status: 200,
    headers: {
      "content-type": "application/json",
      // Don't let CDNs serve stale association files for too long while iterating
      "cache-control": "public, max-age=300",
    },
  });
}


