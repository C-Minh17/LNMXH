const extractUsernameFromUrl = (url: string): string | null => {
  if (!url || typeof url !== "string") return null;
  try {
    const cleanUrl = url.trim();

    // TikTok: tiktok.com/@username
    const ttMatch = cleanUrl.match(/tiktok\.com\/@([a-zA-Z0-9_\.]+)/i);
    if (ttMatch?.[1]) return `@${ttMatch[1]}`;

    // Threads: threads.com/@username or threads.net/@username
    const thMatch = cleanUrl.match(/threads\.(?:com|net)\/@([a-zA-Z0-9_\.]+)/i);
    if (thMatch?.[1]) return `@${thMatch[1]}`;

    // Instagram: instagram.com/username (ignoring /p/, /reel/, /reels/, /stories/)
    const igMatch = cleanUrl.match(/instagram\.com\/([a-zA-Z0-9_\.]+)/i);
    if (igMatch?.[1]) {
      const seg = igMatch[1].toLowerCase();
      if (!["p", "reel", "reels", "stories", "tv", "explore", "direct"].includes(seg)) {
        return igMatch[1];
      }
    }

    // Facebook: facebook.com/pagename
    const fbMatch = cleanUrl.match(/facebook\.com\/([a-zA-Z0-9_\.]+)/i);
    if (fbMatch?.[1]) {
      const seg = fbMatch[1].toLowerCase();
      if (!["posts", "watch", "reels", "reel", "groups", "pages", "profile.php", "story.php", "photo.php"].includes(seg)) {
        return fbMatch[1];
      }
    }
  } catch (e) {
    // ignore
  }
  return null;
};

const extractFromObj = (obj: any): string | null => {
  if (!obj || typeof obj !== "object") return null;
  const username = obj.username || obj.user_name || obj.userUsername || obj.owner_username || obj.ownerUsername || obj.account || obj.unique_id || obj.handle;
  const displayName = obj.full_name || obj.profile_name || obj.name || obj.nickname || obj.author_name;

  if (username && displayName && String(username).trim() !== String(displayName).trim()) {
    return `${String(username).trim()} (${String(displayName).trim()})`;
  }
  if (username) return String(username).trim();
  if (displayName) return String(displayName).trim();
  return null;
};

export const getSourceName = (record: any): string => {
  if (!record) return "-";
  if (record.source_name) return record.source_name;
  if (record.source?.name) return record.source.name;
  if (record.source?.title) return record.source.title;

  const raw = record.raw_data;
  if (!raw) {
    const urlUser = extractUsernameFromUrl(record.record_url);
    return urlUser || "-";
  }

  // 1. Try extracting from nested objects: owner, user, author, profile, channel, page
  const fromOwner = extractFromObj(raw.owner);
  if (fromOwner) return fromOwner;

  const fromUser = extractFromObj(raw.user);
  if (fromUser) return fromUser;

  const fromAuthor = extractFromObj(raw.author);
  if (fromAuthor) return fromAuthor;

  const fromProfile = extractFromObj(raw.profile);
  if (fromProfile) return fromProfile;

  const fromChannel = extractFromObj(raw.channel);
  if (fromChannel) return fromChannel;

  const fromPage = extractFromObj(raw.page);
  if (fromPage) return fromPage;

  // 2. Try account + display name combo on raw
  if (typeof raw.account === "string" && raw.account.trim()) {
    const acc = raw.account.trim();
    const displayName = (raw.profile_name || raw.full_name || "").trim();
    if (displayName && displayName !== acc) {
      return `${acc} (${displayName})`;
    }
    return acc;
  }

  // 3. Try direct string properties on raw
  const strProps = [
    raw.owner_username,
    raw.ownerUsername,
    raw.owner_name,
    raw.ownerName,
    raw.user_name,
    raw.username,
    raw.userUsername,
    raw.author_name,
    raw.author_username,
    raw.authorUsername,
    raw.profile_name,
    raw.full_name,
    raw.source_name,
    raw.page_name,
    raw.channel_name,
    raw.name,
  ];

  for (const prop of strProps) {
    if (typeof prop === "string" && prop.trim()) {
      return prop.trim();
    }
  }

  // 4. Try input object
  if (raw.input) {
    const fromInputObj = extractFromObj(raw.input);
    if (fromInputObj) return fromInputObj;
    const inputUrlUser = extractUsernameFromUrl(raw.input.url || raw.input.profile_url);
    if (inputUrlUser) return inputUrlUser;
  }

  // 5. Try extracting username from URLs in raw or record
  const urlsToTest = [record.record_url, raw.profile_url, raw.url, raw.input?.url, raw.input?.profile_url];
  for (const u of urlsToTest) {
    const extracted = extractUsernameFromUrl(u);
    if (extracted) return extracted;
  }

  return "-";
};

export const getPostContent = (record: any): string => {
  if (!record) return "-";
  if (record.content) return record.content;
  if (record.post_content) return record.post_content;
  if (record.text) return record.text;
  if (record.script) return record.script;

  const raw = record.raw_data;
  if (!raw) return "-";

  // 1. Direct text fields on raw
  const textProps = [
    raw.post_content,
    raw.post_content_formatted,
    raw.caption,
    raw.content,
    raw.text,
    raw.post_text,
    raw.message,
    raw.description,
    raw.title,
    raw.summary,
    raw.about_formatted,
    raw.biography,
  ];

  for (const prop of textProps) {
    if (typeof prop === "string" && prop.trim()) {
      return prop.trim();
    }
  }

  // 2. If raw has posts array (e.g. Instagram/TikTok profile crawl with list of posts)
  if (Array.isArray(raw.posts) && raw.posts.length > 0) {
    const captions = raw.posts
      .map((p: any) => p?.caption || p?.text || p?.content || p?.description)
      .filter((c: any) => typeof c === "string" && c.trim());
    if (captions.length > 0) {
      return captions[0].trim();
    }
  }

  // 3. If raw has threads array (e.g. Threads profile crawl response)
  if (Array.isArray(raw.threads) && raw.threads.length > 0) {
    const threadTexts = raw.threads
      .map((t: any) => t?.post_content_formatted || t?.post_content || t?.caption || t?.text)
      .filter((c: any) => typeof c === "string" && c.trim());
    if (threadTexts.length > 0) {
      return threadTexts[0].trim();
    }
  }

  return "-";
};

export const getRecordUrl = (record: any): string => {
  if (!record) return "-";
  if (record.record_url) return record.record_url;
  const raw = record.raw_data;
  if (!raw) return "-";
  return raw.profile_url || raw.url || raw.input?.url || (Array.isArray(raw.posts) && raw.posts[0]?.url) || (Array.isArray(raw.threads) && raw.threads[0]?.url) || "-";
};
