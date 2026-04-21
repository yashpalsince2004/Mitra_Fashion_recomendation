/**
 * Unsplash Image Retrieval Service
 * 
 * Fetches fashion-relevant images from the Unsplash Search Photos API
 * using search queries generated from the quiz builder.
 * 
 * Includes attribution data per Unsplash API guidelines.
 */

const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY || "";

// ─── Fallback images for demo safety ─────────────────────────────────────────
const FALLBACK_IMAGES = [
  {
    imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80&fit=crop",
    regularUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1080&q=80&fit=crop",
    photographer: "Tamara Bellis",
    profile: "https://unsplash.com/@tamarabellis",
    download: "#",
    blurHash: null,
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80&fit=crop",
    regularUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1080&q=80&fit=crop",
    photographer: "Dom Hill",
    profile: "https://unsplash.com/@domhillphoto",
    download: "#",
    blurHash: null,
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80&fit=crop",
    regularUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1080&q=80&fit=crop",
    photographer: "Priscilla Du Preez",
    profile: "https://unsplash.com/@priscilladupreez",
    download: "#",
    blurHash: null,
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80&fit=crop",
    regularUrl: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1080&q=80&fit=crop",
    photographer: "Wendy van Zyl",
    profile: "https://unsplash.com/@wendyvanzyl",
    download: "#",
    blurHash: null,
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80&fit=crop",
    regularUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1080&q=80&fit=crop",
    photographer: "Chalo Garcia",
    profile: "https://unsplash.com/@chalogarcia",
    download: "#",
    blurHash: null,
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80&fit=crop",
    regularUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1080&q=80&fit=crop",
    photographer: "Priscilla Du Preez",
    profile: "https://unsplash.com/@priscilladupreez",
    download: "#",
    blurHash: null,
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80&fit=crop",
    regularUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1080&q=80&fit=crop",
    photographer: "Nordwood Themes",
    profile: "https://unsplash.com/@nordwood",
    download: "#",
    blurHash: null,
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=600&q=80&fit=crop",
    regularUrl: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1080&q=80&fit=crop",
    photographer: "Candice Picard",
    profile: "https://unsplash.com/@candicepicard",
    download: "#",
    blurHash: null,
  },
];

/**
 * Fetch fashion images from the Unsplash API for a given search query.
 *
 * @param {string} query - The search query string (from quiz builder)
 * @param {number} [perPage=8] - Number of results (6–12 recommended)
 * @returns {Promise<Array<{imageUrl, regularUrl, photographer, profile, download, blurHash}>>}
 */
export async function fetchOutfitImages(query, perPage = 8) {
  // Clamp per_page to Unsplash limits
  const count = Math.max(1, Math.min(perPage, 30));

  // If no API key configured, use fallback images
  if (!ACCESS_KEY || ACCESS_KEY === "your_unsplash_access_key_here") {
    console.warn("⚠️ Unsplash API key not set — using fallback images.");
    return FALLBACK_IMAGES.slice(0, count);
  }

  try {
    const url = new URL("https://api.unsplash.com/search/photos");
    url.searchParams.set("query", query);
    url.searchParams.set("per_page", String(count));
    url.searchParams.set("orientation", "portrait"); // Fashion looks best in portrait
    url.searchParams.set("content_filter", "high");  // Safe content
    url.searchParams.set("client_id", ACCESS_KEY);

    console.log("🔍 Unsplash fetch:", url.toString().replace(ACCESS_KEY, "***"));

    const response = await fetch(url.toString());

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Unsplash API Error:", response.status, errorData);
      throw new Error(`Unsplash API returned ${response.status}`);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      console.warn("Unsplash returned 0 results for query:", query);
      return FALLBACK_IMAGES.slice(0, count);
    }

    console.log(`✅ Unsplash returned ${data.results.length} images for: "${query}"`);

    return data.results.map((img) => ({
      imageUrl: img.urls.small,             // ~400px wide — for thumbnails/cards
      regularUrl: img.urls.regular,          // ~1080px wide — for modals/detail views
      photographer: img.user.name,
      profile: `${img.user.links.html}?utm_source=ai_fashion_stylist&utm_medium=referral`,
      download: img.links.download_location,
      blurHash: img.blur_hash || null,
      altDescription: img.alt_description || img.description || "Fashion outfit",
      color: img.color || null,              // Dominant color — useful for loading states
    }));

  } catch (error) {
    console.error("❌ Unsplash fetch failed:", error.message);
    return FALLBACK_IMAGES.slice(0, count);
  }
}

/**
 * Trigger a download event for Unsplash attribution tracking.
 * Per Unsplash API guidelines — call this when a user "downloads" an image.
 *
 * @param {string} downloadLocation - The download_location URL from the API
 */
export async function trackDownload(downloadLocation) {
  if (!ACCESS_KEY || downloadLocation === "#") return;
  
  try {
    await fetch(`${downloadLocation}?client_id=${ACCESS_KEY}`);
  } catch {
    // Silent fail — tracking is non-critical
  }
}

/**
 * Returns fallback images (safe for demo environments without API key).
 * @param {number} [count=8]
 */
export function getFallbackImages(count = 8) {
  return FALLBACK_IMAGES.slice(0, count);
}

// ─── PREMIUM EDITORIAL ENGINE ───────────────────────────────────────────────

const EDITORIAL_QUERIES = [
  "men classic outfit fashion editorial",
  "women elegant outfit luxury fashion",
  "minimalist neutral outfit fashion",
  "street style premium fashion",
  "high fashion editorial model outfit",
  "formal luxury outfit men women",
  "modern minimalist outfit beige tones",
];

function getRandomQuery() {
  return EDITORIAL_QUERIES[Math.floor(Math.random() * EDITORIAL_QUERIES.length)];
}

function getRandomPage() {
  return Math.floor(Math.random() * 10) + 1; // pages 1–10
}

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

const seenImages = new Set();
function filterUnique(images) {
  return images.filter(img => {
    if (seenImages.has(img.id)) return false;
    seenImages.add(img.id);
    return true;
  });
}

function isPremium(img) {
  // Relaxed constraints for demo purposes, filtering for high res and moderately liked
  return (img.likes >= 10 || img.width >= 800);
}

/**
 * Fetch premium editorial fashion images leveraging query rotation and shuffling.
 * Guarantees fresh results across sessions using deduplication.
 *
 * @param {number} [count=12] - Number of results to fetch
 * @returns {Promise<Array<object>>}
 */
export async function fetchPremiumGalleryImages(count = 12) {
  if (!ACCESS_KEY || ACCESS_KEY === "your_unsplash_access_key_here") {
    return shuffleArray(getFallbackImages(count));
  }

  const query = getRandomQuery();
  const page = getRandomPage();

  try {
    const url = new URL("https://api.unsplash.com/search/photos");
    url.searchParams.set("query", query);
    url.searchParams.set("page", String(page));
    url.searchParams.set("per_page", "30"); // Fetch more to filter down
    url.searchParams.set("orientation", "portrait");
    url.searchParams.set("content_filter", "high");
    url.searchParams.set("client_id", ACCESS_KEY);

    console.log(`💎 Editorial Fetch: "${query}" (Page: ${page})`);

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error("Unsplash API Error");

    const data = await response.json();
    
    // Apply Filters (Unique + Premium) -> Shuffle -> Map Structure -> Slice
    let rawResults = filterUnique(data.results || []).filter(isPremium);
    rawResults = shuffleArray(rawResults).slice(0, count);
    
    if (rawResults.length === 0) {
        return getFallbackImages(count); // Safe fallback if filtering was too aggressive
    }

    return rawResults.map((img) => ({
      id: img.id,
      imageUrl: img.urls.small,
      regularUrl: img.urls.regular,
      photographer: img.user.name,
      profile: `${img.user.links.html}?utm_source=ai_fashion_stylist&utm_medium=referral`,
      download: img.links.download_location,
      blurHash: img.blur_hash || null,
      altDescription: img.alt_description || img.description || "Fashion outfit",
      color: img.color || null,
    }));
  } catch (error) {
    console.error("❌ Editorial fetch failed:", error.message);
    return shuffleArray(getFallbackImages(count));
  }
}
