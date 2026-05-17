const ALLOWED_ORIGINS = [
  "https://ethantwu.com",
  "https://www.ethantwu.com",
  "http://localhost",
  "http://127.0.0.1",
];

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.some((o) => origin && origin.startsWith(o))
    ? origin
    : "*";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "public, max-age=86400",
  };
}

function extractShortcode(url) {
  const m = url.match(/instagram\.com\/(?:reel|reels|p|tv)\/([^\/?#]+)/);
  return m ? m[1] : null;
}

function extractCounts(html) {
  const m = html.match(/og:description["'][^>]+content=["']([^"']+)["']/i);
  if (!m) return { likes: null, comments: null };
  const desc = m[1];
  const likes = desc.match(/([\d,]+)\s+likes?/i);
  const comments = desc.match(/([\d,]+)\s+comments?/i);
  return {
    likes: likes ? parseInt(likes[1].replace(/,/g, ""), 10) : null,
    comments: comments ? parseInt(comments[1].replace(/,/g, ""), 10) : null,
  };
}

function extractOgImage(html) {
  const patterns = [
    /"thumbnail_src":"([^"]+)"/,
    /"display_url":"([^"]+)"/,
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m) {
      return m[1]
        .replace(/\\u0026/g, "&")
        .replace(/\\\//g, "/")
        .replace(/&amp;/g, "&")
        .replace(/&#x2F;/g, "/")
        .replace(/&quot;/g, '"');
    }
  }
  return null;
}

export default {
  async fetch(request) {
    const origin = request.headers.get("Origin") || "";
    const headers = corsHeaders(origin);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    const url = new URL(request.url);
    const imdbUrl = url.searchParams.get("imdb");
    if (imdbUrl) {
      const m = imdbUrl.match(/imdb\.com\/title\/(tt\d+)/);
      if (!m) {
        return new Response(JSON.stringify({ error: "not an imdb title url" }), {
          status: 400,
          headers: { ...headers, "Content-Type": "application/json" },
        });
      }
      const canonical = `https://www.imdb.com/title/${m[1]}/`;
      try {
        const res = await fetch(canonical, {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; facebookexternalhit/1.1; +http://www.facebook.com/externalhit_uatext.php)",
            "Accept-Language": "en-US,en;q=0.9",
          },
          cf: { cacheTtl: 86400, cacheEverything: true },
        });
        const html = await res.text();
        const titleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i);
        if (!titleMatch) {
          return new Response(JSON.stringify({ error: "title not found" }), {
            status: 502,
            headers: { ...headers, "Content-Type": "application/json" },
          });
        }
        const title = titleMatch[1]
          .replace(/\s*\((?:Short\s+)?\d{4}\).*$/i, "")
          .replace(/\s*\|.*$/, "")
          .replace(/&amp;/g, "&")
          .replace(/&#x27;/g, "'")
          .replace(/&quot;/g, '"');
        return new Response(JSON.stringify({ title }), {
          headers: { ...headers, "Content-Type": "application/json" },
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: "fetch failed", detail: String(e) }), {
          status: 502,
          headers: { ...headers, "Content-Type": "application/json" },
        });
      }
    }

    const reelUrl = url.searchParams.get("url");
    if (!reelUrl) {
      return new Response(JSON.stringify({ error: "missing url param" }), {
        status: 400,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    const shortcode = extractShortcode(reelUrl);
    if (!shortcode) {
      return new Response(JSON.stringify({ error: "not an instagram url" }), {
        status: 400,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    const canonical = `https://www.instagram.com/reel/${shortcode}/`;
    try {
      const res = await fetch(canonical, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; facebookexternalhit/1.1; +http://www.facebook.com/externalhit_uatext.php)",
          "Accept-Language": "en-US,en;q=0.9",
        },
        cf: { cacheTtl: 86400, cacheEverything: true },
      });
      const html = await res.text();
      const image = extractOgImage(html);
      if (!image) {
        return new Response(
          JSON.stringify({ error: "thumbnail not found", shortcode }),
          {
            status: 502,
            headers: { ...headers, "Content-Type": "application/json" },
          }
        );
      }
      const { likes, comments } = extractCounts(html);
      return new Response(JSON.stringify({ shortcode, image, likes, comments }), {
        headers: { ...headers, "Content-Type": "application/json" },
      });
    } catch (e) {
      return new Response(
        JSON.stringify({ error: "fetch failed", detail: String(e) }),
        {
          status: 502,
          headers: { ...headers, "Content-Type": "application/json" },
        }
      );
    }
  },
};
