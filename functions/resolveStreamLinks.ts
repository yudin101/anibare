import { USER_AGENT } from "../constants.js";

interface StreamLink {
  resolution: string | undefined;
  url: string | undefined;
}

export async function resolveStreamLinks(
  decodedUrl: string,
): Promise<StreamLink[]> {
  console.log("Before replace: ", decodedUrl);
  const fetchUrl = decodedUrl.replace(
    "/apivtwo/clock?",
    "/apivtwo/clock.json?",
  );
  console.log("After replace: ", fetchUrl);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(fetchUrl, {
      signal: controller.signal,
      headers: {
        Referer: "https://youtu-chan.com",
        Origin: "https://youtu-chan.com",
        "User-Agent": USER_AGENT,
      },
    });

    console.log("Fetching:", fetchUrl);

    if (!response.ok) {
      console.log(`Clock endpoint returned ${response.status} for ${fetchUrl}`);
      return [];
    }

    const text = await response.text();

    console.log("Status: ", response.status);
    console.log("Raw response: ", text);

    // Parse out link + resolutionStr pairs
    // The response is something like:
    // {
    //  "links": [
    //    {
    //      "link": "https://...","resolutionStr":"1080"
    //    },
    //    {
    //      "hls": true,
    //      "url":"...",
    //      "hardsub_lang":"en-US"
    //    },
    //    ...
    //  ]
    // }

    const links: StreamLink[] = [];

    // Match link+resolutionStr objects
    const linkRegex =
      /"link"\s*:\s*"([^"]+)"[^}]*"resolutionStr"\s*:\s*"([^"]+)"/g;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      links.push({ url: match[1], resolution: match[2] });
    }

    // Also match HLS streams with hardsub
    const hlsRegex =
      /"hls"\s*:\s*true[^}]*"url"\s*:\s*"([^"]+)"[^}]*"hardsub_lang"\s*:\s*"en-US"/g;

    while ((match = hlsRegex.exec(text)) !== null) {
      links.push({ url: match[1], resolution: "hls-hardsub" });
    }

    // Unescape forward slashes (JSON sometimes encodes as \u002F)
    return links.map((l) => ({ ...l, url: l.url?.replace(/\\u002F/g, "/") }));
  } finally {
    clearTimeout(timeout);
  }
}
