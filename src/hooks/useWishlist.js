import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "ai_fashion_wishlist";

export function useWishlist() {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  const isWishlisted = useCallback(
    (outfitId) => wishlist.some((o) => o.id === outfitId),
    [wishlist]
  );

  const toggleWishlist = useCallback((outfit) => {
    setWishlist((prev) => {
      const exists = prev.some((o) => o.id === outfit.id);
      return exists ? prev.filter((o) => o.id !== outfit.id) : [...prev, outfit];
    });
  }, []);

  const clearWishlist = useCallback(() => setWishlist([]), []);

  return { wishlist, toggleWishlist, isWishlisted, clearWishlist };
}
