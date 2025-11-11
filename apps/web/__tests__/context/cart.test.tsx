import { renderHook, act } from "@testing-library/react";
import CartProvider, { useCart } from "../../app/context/cart";
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

describe("CartContext", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe("useCart hook", () => {
    it("should throw error when used outside CartProvider", () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      expect(() => {
        renderHook(() => useCart());
      }).toThrow("useCart must be used within a CartProvider");

      consoleSpy.mockRestore();
    });

    it("should provide initial empty cart", () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      expect(result.current.cart).toEqual([]);
      expect(result.current.getTotalItems()).toBe(0);
      expect(result.current.getTotalPrice()).toBe(0);
    });
  });

  describe("addToCart", () => {
    it("should add a new item to cart", () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addToCart(mockPokemon);
      });

      expect(result.current.cart).toHaveLength(1);
      expect(result.current.cart[0]).toMatchObject({
        pokemonId: mockPokemon.id,
        name: mockPokemon.name,
        price: mockPokemon.price,
        quantity: 1,
      });
    });

    it("should increase quantity if item already exists", () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addToCart(mockPokemon);
      });

      act(() => {
        result.current.addToCart(mockPokemon);
      });

      expect(result.current.cart).toHaveLength(1);
      expect(result.current.cart[0]?.quantity).toBe(2);
    });

    it("should persist cart to localStorage", () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addToCart(mockPokemon);
      });

      expect(localStorage.setItem).toHaveBeenCalledWith(
        "pokemon-cart",
        expect.any(String)
      );
    });
  });

  describe("removeFromCart", () => {
    it("should remove item from cart", () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addToCart(mockPokemon);
      });

      expect(result.current.cart).toHaveLength(1);

      act(() => {
        result.current.removeFromCart(mockPokemon.id);
      });

      expect(result.current.cart).toHaveLength(0);
    });
  });

  describe("updateQuantity", () => {
    it("should update item quantity", () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addToCart(mockPokemon);
      });

      act(() => {
        result.current.updateQuantity(mockPokemon.id, 5);
      });

      expect(result.current.cart[0]?.quantity).toBe(5);
    });

    it("should not update if quantity is 0 or less", () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addToCart(mockPokemon);
      });

      act(() => {
        result.current.updateQuantity(mockPokemon.id, 0);
      });

      expect(result.current.cart[0]?.quantity).toBe(1);
    });
  });

  describe("getTotalItems", () => {
    it("should calculate total items correctly", () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      const mockPokemon2: Pokemon = {
        ...mockPokemon,
        id: 2,
        name: "Charizard",
      };

      act(() => {
        result.current.addToCart(mockPokemon);
      });

      act(() => {
        result.current.addToCart(mockPokemon);
      });

      act(() => {
        result.current.addToCart(mockPokemon2);
      });

      expect(result.current.getTotalItems()).toBe(3); // 2 pikachu + 1 charizard
    });
  });

  describe("getTotalPrice", () => {
    it("should calculate total price correctly", () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addToCart(mockPokemon); // 25.99
      });

      act(() => {
        result.current.addToCart(mockPokemon); // 25.99
      });

      expect(result.current.getTotalPrice()).toBe(51.98);
    });
  });

  describe("clearCart", () => {
    it("should empty the cart", () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addToCart(mockPokemon);
        result.current.addToCart(mockPokemon);
      });

      expect(result.current.cart).toHaveLength(1);

      act(() => {
        result.current.clearCart();
      });

      expect(result.current.cart).toHaveLength(0);
    });
  });

  describe("localStorage persistence", () => {
    it("should load cart from localStorage on mount", () => {
      const savedCart = [
        {
          pokemonId: 1,
          name: "Pikachu",
          price: 25.99,
          quantity: 2,
          imageUrl: "/pikachu.jpg",
        },
      ];

      (localStorage.getItem as jest.Mock).mockReturnValue(
        JSON.stringify(savedCart)
      );

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      expect(result.current.cart).toEqual(savedCart);
    });
  });
});
