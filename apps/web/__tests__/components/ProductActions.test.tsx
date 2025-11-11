import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductActions from "../../app/components/ProductActions";
import CartProvider from "../../app/context/cart";
import { WishlistProvider } from "../../app/context/wishlist";
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

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>
    <WishlistProvider>{children}</WishlistProvider>
  </CartProvider>
);

describe("ProductActions", () => {
  it("should render quantity selector when in stock", () => {
    render(
      <Wrapper>
        <ProductActions pokemon={mockPokemon} />
      </Wrapper>
    );

    // Check for quantity input by role instead of text
    expect(screen.getByRole("spinbutton")).toBeInTheDocument();
  });

  it("should not render quantity selector when out of stock", () => {
    const outOfStockPokemon = { ...mockPokemon, stock: 0 };

    render(
      <Wrapper>
        <ProductActions pokemon={outOfStockPokemon} />
      </Wrapper>
    );

    expect(screen.queryByText("Quantity")).not.toBeInTheDocument();
  });

  it("should render add to cart button", () => {
    render(
      <Wrapper>
        <ProductActions pokemon={mockPokemon} />
      </Wrapper>
    );

    expect(screen.getByText("Add to cart")).toBeInTheDocument();
  });

  it("should render wishlist button", () => {
    render(
      <Wrapper>
        <ProductActions pokemon={mockPokemon} />
      </Wrapper>
    );

    expect(
      screen.getByRole("button", { name: /add to wishlist/i })
    ).toBeInTheDocument();
  });

  it("should disable add to cart button when out of stock", () => {
    const outOfStockPokemon = { ...mockPokemon, stock: 0 };

    render(
      <Wrapper>
        <ProductActions pokemon={outOfStockPokemon} />
      </Wrapper>
    );

    const addToCartButton = screen.getByText("Out of Stock").closest("button");
    expect(addToCartButton).toBeDisabled();
  });

  it("should allow changing quantity", async () => {
    const user = userEvent.setup();

    render(
      <Wrapper>
        <ProductActions pokemon={mockPokemon} />
      </Wrapper>
    );

    const increaseButton = screen.getByRole("button", { name: /increase/i });

    await user.click(increaseButton);
    await user.click(increaseButton);

    const quantityInput = screen.getByRole("spinbutton");
    expect(quantityInput).toHaveValue(3);
  });

  it("should add correct quantity to cart", async () => {
    const user = userEvent.setup();

    render(
      <Wrapper>
        <ProductActions pokemon={mockPokemon} />
      </Wrapper>
    );

    // Increase quantity
    const increaseButton = screen.getByRole("button", { name: /increase/i });
    await user.click(increaseButton);
    await user.click(increaseButton);

    // Add to cart
    const addToCartButton = screen.getByText("Add to cart").closest("button");
    await user.click(addToCartButton!);

    expect(screen.getByText("3 items added!")).toBeInTheDocument();
  });

  it("should respect max stock limit", async () => {
    const user = userEvent.setup();
    const lowStockPokemon = { ...mockPokemon, stock: 3 };

    render(
      <Wrapper>
        <ProductActions pokemon={lowStockPokemon} />
      </Wrapper>
    );

    const increaseButton = screen.getByRole("button", { name: /increase/i });
    const quantityInput = screen.getByRole("spinbutton");

    // Try to increase beyond max stock
    await user.click(increaseButton);
    await user.click(increaseButton);
    await user.click(increaseButton);
    await user.click(increaseButton); // This should not work

    expect(quantityInput).toHaveValue(3); // Should stay at max
  });
});
