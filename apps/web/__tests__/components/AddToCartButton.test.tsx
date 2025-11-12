import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddToCartButton from "../../app/components/AddToCartButton";
import CartProvider from "../../app/context/cart";
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

describe("AddToCartButton", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("should render with default text", () => {
    render(
      <CartProvider>
        <AddToCartButton pokemon={mockPokemon} />
      </CartProvider>
    );

    expect(screen.getByText("Add to cart")).toBeInTheDocument();
  });

  it("should show 'Out of Stock' when disabled", () => {
    render(
      <CartProvider>
        <AddToCartButton pokemon={mockPokemon} disabled={true} />
      </CartProvider>
    );

    expect(screen.getByText("Out of Stock")).toBeInTheDocument();
  });

  it("should be disabled when disabled prop is true", () => {
    render(
      <CartProvider>
        <AddToCartButton pokemon={mockPokemon} disabled={true} />
      </CartProvider>
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("should add item to cart when clicked", async () => {
    const user = userEvent.setup({ delay: null });

    render(
      <CartProvider>
        <AddToCartButton pokemon={mockPokemon} />
      </CartProvider>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(screen.getByText("Added to Cart!")).toBeInTheDocument();
  });

  it("should add specified quantity to cart", async () => {
    const user = userEvent.setup({ delay: null });

    render(
      <CartProvider>
        <AddToCartButton pokemon={mockPokemon} quantity={3} />
      </CartProvider>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(screen.getByText("3 items added!")).toBeInTheDocument();
  });

  it("should show success message and then revert", async () => {
    const user = userEvent.setup({ delay: null });

    render(
      <CartProvider>
        <AddToCartButton pokemon={mockPokemon} />
      </CartProvider>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    // Should show success message
    expect(screen.getByText("Added to Cart!")).toBeInTheDocument();

    // Fast forward time
    jest.advanceTimersByTime(2000);

    // Should revert to original text
    await waitFor(() => {
      expect(screen.getByText("Add to cart")).toBeInTheDocument();
    });
  });

  it("should apply custom className", () => {
    render(
      <CartProvider>
        <AddToCartButton pokemon={mockPokemon} className="custom-test-class" />
      </CartProvider>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-test-class");
  });

  it("should have correct styling when disabled", () => {
    render(
      <CartProvider>
        <AddToCartButton pokemon={mockPokemon} disabled={true} />
      </CartProvider>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-gray-400", "cursor-not-allowed");
  });
});
