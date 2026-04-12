export const SEARCH_KEYWORDS_TO_IMAGES = [
  { keyword: "formal suit navy", url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop" },
  { keyword: "minimalist white blouse", url: "https://images.unsplash.com/photo-1434389678232-06910ce2ab22?q=80&w=800&auto=format&fit=crop" },
  { keyword: "streetwear oversized", url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop" },
  { keyword: "traditional", url: "https://images.unsplash.com/photo-1605785055132-84180ebd05d7?q=80&w=800&auto=format&fit=crop" },
  { keyword: "default fashion", url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop" }
];

export function getFallbackImage(tags) {
  const lowercaseTags = tags.map(t => t.toLowerCase());
  for(let map of SEARCH_KEYWORDS_TO_IMAGES) {
      if(lowercaseTags.some(tag => map.keyword.includes(tag))) {
          return map.url;
      }
  }
  return SEARCH_KEYWORDS_TO_IMAGES[SEARCH_KEYWORDS_TO_IMAGES.length - 1].url;
}
