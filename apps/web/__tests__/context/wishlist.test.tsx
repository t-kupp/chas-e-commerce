import { renderHook, act, waitFor } from "@testing-library/react";
import { WishlistProvider, useWishlist } from "../../app/context/wishlist";
import type { Pokemon } from "@shared/types/pokemon";

const mockPokemon: Pokemon = {
  id: 1,
  documentId: "pikachu-doc-1",
  name: "Pikachu",
  price: 25.99,
  slug: "pikachu",
  stock: 10,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  publishedAt: "2024-01-01T00:00:00.000Z",
  image: {
    id: 1,
    documentId: "img-1",
    name: "pikachu.jpg",
    alternativeText: null,
    caption: null,
    width: 500,
    height: 500,
    formats: {
      thumbnail: {
        name: "thumbnail_pikachu.jpg",
        hash: "hash123",
        ext: ".jpg",
        mime: "image/jpeg",
        path: null,
        width: 156,
        height: 156,
        size: 10,
        sizeInBytes: 10240,
        url: "/pikachu-thumb.jpg",
      },
    },
    hash: "hash123",
    ext: ".jpg",
    mime: "image/jpeg",
    size: 50,
    url: "/pikachu.jpg",
    previewUrl: null,
    provider: "local",
    provider_metadata: null,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    publishedAt: "2024-01-01T00:00:00.000Z",
  },
  type: {
    id: 1,
    documentId: "electric-type",
    title: "Electric",
    slug: "electric",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    publishedAt: "2024-01-01T00:00:00.000Z",
  },
  condition: {
    id: 1,
    documentId: "mint-condition",
    title: "Mint",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    publishedAt: "2024-01-01T00:00:00.000Z",
  },
  rarity: {
    id: 1,
    documentId: "rare-rarity",
    title: "Rare",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    publishedAt: "2024-01-01T00:00:00.000Z",
  },
};

describe("WishlistContext", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe("useWishlist hook", () => {
    it("should throw error when used outside WishlistProvider", () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      expect(() => {
        renderHook(() => useWishlist());
      }).toThrow("useWishlist must be used within WishlistProvider");

      consoleSpy.mockRestore();
    });

    it("should provide initial empty wishlist", () => {
      const { result } = renderHook(() => useWishlist(), {
        wrapper: WishlistProvider,
      });

      expect(result.current.wishlistItems).toEqual([]);
      expect(result.current.wishlistCount).toBe(0);
    });
  });

  describe("addToWishlist", () => {
    it("should add a new item to wishlist", async () => {
      const { result } = renderHook(() => useWishlist(), {
        wrapper: WishlistProvider,
      });

      await act(async () => {
        result.current.addToWishlist(mockPokemon);
      });

      await waitFor(() => {
        expect(result.current.wishlistItems).toHaveLength(1);
        expect(result.current.wishlistItems[0]).toEqual(mockPokemon);
      });
    });

    it("should not add duplicate items", async () => {
      const { result } = renderHook(() => useWishlist(), {
        wrapper: WishlistProvider,
      });

      await act(async () => {
        result.current.addToWishlist(mockPokemon);
        result.current.addToWishlist(mockPokemon);
      });

      await waitFor(() => {
        expect(result.current.wishlistItems).toHaveLength(1);
      });
    });

    it("should persist wishlist to localStorage", async () => {
      const { result } = renderHook(() => useWishlist(), {
        wrapper: WishlistProvider,
      });

      await act(async () => {
        result.current.addToWishlist(mockPokemon);
      });

      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith(
          "pokemon-wishlist",
          expect.any(String)
        );
      });
    });
  });

  describe("removeFromWishlist", () => {
    it("should remove item from wishlist", async () => {
      const { result } = renderHook(() => useWishlist(), {
        wrapper: WishlistProvider,
      });

      await act(async () => {
        result.current.addToWishlist(mockPokemon);
      });

      await waitFor(() => {
        expect(result.current.wishlistItems).toHaveLength(1);
      });

      await act(async () => {
        result.current.removeFromWishlist(mockPokemon.id);
      });

      await waitFor(() => {
        expect(result.current.wishlistItems).toHaveLength(0);
      });
    });
  });

  describe("isInWishlist", () => {
    it("should return true if item is in wishlist", async () => {
      const { result } = renderHook(() => useWishlist(), {
        wrapper: WishlistProvider,
      });

      await act(async () => {
        result.current.addToWishlist(mockPokemon);
      });

      await waitFor(() => {
        expect(result.current.isInWishlist(mockPokemon.id)).toBe(true);
      });
    });

    it("should return false if item is not in wishlist", () => {
      const { result } = renderHook(() => useWishlist(), {
        wrapper: WishlistProvider,
      });

      expect(result.current.isInWishlist(999)).toBe(false);
    });
  });

  describe("clearWishlist", () => {
    it("should empty the wishlist", async () => {
      const { result } = renderHook(() => useWishlist(), {
        wrapper: WishlistProvider,
      });

      await act(async () => {
        result.current.addToWishlist(mockPokemon);
      });

      await waitFor(() => {
        expect(result.current.wishlistItems).toHaveLength(1);
      });

      await act(async () => {
        result.current.clearWishlist();
      });

      await waitFor(() => {
        expect(result.current.wishlistItems).toHaveLength(0);
      });
    });
  });

  describe("wishlistCount", () => {
    it("should count wishlist items correctly", async () => {
      const { result } = renderHook(() => useWishlist(), {
        wrapper: WishlistProvider,
      });

      const mockPokemon2: Pokemon = {
        ...mockPokemon,
        id: 2,
        name: "Charizard",
      };

      await act(async () => {
        result.current.addToWishlist(mockPokemon);
        result.current.addToWishlist(mockPokemon2);
      });

      await waitFor(() => {
        expect(result.current.wishlistCount).toBe(2);
      });
    });
  });

  describe("localStorage persistence", () => {
    it("should load wishlist from localStorage on mount", async () => {
      const savedWishlist = [mockPokemon];

      (localStorage.getItem as jest.Mock).mockReturnValue(
        JSON.stringify(savedWishlist)
      );

      const { result } = renderHook(() => useWishlist(), {
        wrapper: WishlistProvider,
      });

      await waitFor(() => {
        expect(result.current.wishlistItems).toEqual(savedWishlist);
      });
    });

    it("should handle corrupted localStorage data gracefully", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      (localStorage.getItem as jest.Mock).mockReturnValue("invalid json");

      const { result } = renderHook(() => useWishlist(), {
        wrapper: WishlistProvider,
      });

      await waitFor(() => {
        expect(result.current.wishlistItems).toEqual([]);
      });

      consoleSpy.mockRestore();
    });
  });
});
