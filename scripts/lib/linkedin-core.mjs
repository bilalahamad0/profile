// Pure, dependency-free helpers for the Blog → LinkedIn cross-publish pipeline.
// No network or filesystem access lives here so every function is trivially
// unit-testable (see linkedin-core.test.mjs). The I/O lives in linkedin-api.mjs.

/** LinkedIn commentary hard limit (characters). */
export const COMMENTARY_MAX = 3000;

/**
 * Turn a post title into a URL/file-safe slug containing only [a-z0-9-].
 * Mirrors the slug sanitisation in src/lib/blog.ts so the MDX filename, the
 * route param, and any stored reference all agree.
 */
export function slugify(title) {
  return String(title)
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "") // strip diacritics (combining marks)
    .toLowerCase()
    .replace(/['"’]/g, "") // drop quotes/apostrophes entirely (don't hyphenate)
    .replace(/[^a-z0-9]+/g, "-") // any other non-alphanumeric run → single hyphen
    .replace(/^-+|-+$/g, "") // trim leading/trailing hyphens
    .slice(0, 80)
    .replace(/-+$/g, ""); // re-trim in case the slice landed on a hyphen
}

/** Normalise a tag to "#lowercasenospaces". Accepts "#AI", "AI Testing", "ai". */
export function normalizeTag(tag) {
  const t = String(tag)
    .trim()
    .replace(/^#+/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
  return t ? `#${t}` : "";
}

/** Build the canonical public URL for a share/ugcPost URN. */
export function urnToPublicUrl(urn) {
  if (!/^urn:li:(share|ugcPost):.+/.test(String(urn))) {
    throw new Error(`Not a LinkedIn share/ugcPost URN: ${urn}`);
  }
  return `https://www.linkedin.com/feed/update/${urn}/`;
}

/**
 * Read the created post URN from LinkedIn's response headers (x-restli-id),
 * case-insensitively. Accepts a fetch `Headers` object or a plain object.
 */
export function extractRestliId(headers) {
  let id;
  if (headers && typeof headers.get === "function") {
    id = headers.get("x-restli-id");
  } else if (headers) {
    const key = Object.keys(headers).find((k) => k.toLowerCase() === "x-restli-id");
    id = key ? headers[key] : undefined;
  }
  if (!id) throw new Error("No x-restli-id header on LinkedIn response");
  return id;
}

/**
 * Compose the LinkedIn post commentary from a body, optional blog link, and tags.
 * Throws if the result exceeds LinkedIn's 3000-character limit.
 */
export function composeCommentary({ body, tags = [], blogUrl, includeLink = true } = {}) {
  const trimmed = String(body || "").trim();
  if (!trimmed) throw new Error("composeCommentary: body is required");

  const parts = [trimmed];
  if (includeLink && blogUrl) parts.push(`\nRead the full post: ${blogUrl}`);

  const tagLine = tags.map(normalizeTag).filter(Boolean).join(" ");
  if (tagLine) parts.push(`\n${tagLine}`);

  const text = parts.join("\n").trim();
  if (text.length > COMMENTARY_MAX) {
    throw new Error(`Commentary too long (${text.length} > ${COMMENTARY_MAX} chars)`);
  }
  return text;
}

/** Build the /v2/assets?action=registerUpload request body for a feed image. */
export function buildRegisterUploadPayload(authorUrn) {
  if (!/^urn:li:person:.+/.test(String(authorUrn))) {
    throw new Error(`buildRegisterUploadPayload: expected a person URN, got: ${authorUrn}`);
  }
  return {
    registerUploadRequest: {
      recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
      owner: authorUrn,
      serviceRelationships: [
        { relationshipType: "OWNER", identifier: "urn:li:userGeneratedContent" },
      ],
    },
  };
}

/**
 * Build the /v2/ugcPosts request body.
 *  - assetUrn  → IMAGE share (uploaded image is the media)
 *  - articleUrl (and no assetUrn) → ARTICLE share (link-preview card)
 *  - neither   → text-only (NONE)
 * Note: LinkedIn permits only ONE media category per share, so an image and an
 * article link-preview are mutually exclusive in a single post.
 */
export function buildUgcPayload({
  authorUrn,
  text,
  assetUrn,
  articleUrl,
  mediaTitle,
  mediaDescription,
  visibility = "PUBLIC",
} = {}) {
  if (!authorUrn) throw new Error("buildUgcPayload: authorUrn is required");
  if (!text) throw new Error("buildUgcPayload: text is required");
  if (visibility !== "PUBLIC" && visibility !== "CONNECTIONS") {
    throw new Error(`buildUgcPayload: invalid visibility "${visibility}"`);
  }

  let shareMediaCategory = "NONE";
  let media;
  if (assetUrn) {
    shareMediaCategory = "IMAGE";
    media = [
      {
        status: "READY",
        media: assetUrn,
        ...(mediaTitle ? { title: { text: mediaTitle } } : {}),
        ...(mediaDescription ? { description: { text: mediaDescription } } : {}),
      },
    ];
  } else if (articleUrl) {
    shareMediaCategory = "ARTICLE";
    media = [
      {
        status: "READY",
        originalUrl: articleUrl,
        ...(mediaTitle ? { title: { text: mediaTitle } } : {}),
        ...(mediaDescription ? { description: { text: mediaDescription } } : {}),
      },
    ];
  }

  const shareContent = { shareCommentary: { text }, shareMediaCategory };
  if (media) shareContent.media = media;

  return {
    author: authorUrn,
    lifecycleState: "PUBLISHED",
    specificContent: { "com.linkedin.ugc.ShareContent": shareContent },
    visibility: { "com.linkedin.ugc.MemberNetworkVisibility": visibility },
  };
}
