import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductCard from "../../app/components/ProductCard";
import CartProvider from "../../app/context/cart";
import { WishlistProvider } from "../../app/context/wishlist";
import type { Pokemon } from "@shared/types/pokemon";

// Mock Next.js Image and Link components
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || ""} />;
  },
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

const mockPokemon: Pokemon = {
  id: 1,
  documentId: "pikachu-doc-1",
  name: "Pikachu",
  price: 25.99,
  slug: "pikachu",
  stock: 10,
  description: "A cute electric-type Pokemon that can generate electricity.",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  publishedAt: "2024-01-01T00:00:00.000Z",
  image: {
    id: 1,
    documentId: "img-1",
    name: "pikachu.jpg",
    alternativeText: "Pikachu card",
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

describe("ProductCard", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("should render product name", () => {
    render(
      <Wrapper>
        <ProductCard pokemon={mockPokemon} />
      </Wrapper>
    );

    expect(screen.getByText("Pikachu")).toBeInTheDocument();
  });

  it("should render product price", () => {
    render(
      <Wrapper>
        <ProductCard pokemon={mockPokemon} />
      </Wrapper>
    );

    expect(screen.getByText("$25.99")).toBeInTheDocument();
  });

  it("should render product description", () => {
    render(
      <Wrapper>
        <ProductCard pokemon={mockPokemon} />
      </Wrapper>
    );

    expect(
      screen.getByText(/A cute electric-type Pokemon/i)
    ).toBeInTheDocument();
  });

  it("should render product image", () => {
    render(
      <Wrapper>
        <ProductCard pokemon={mockPokemon} />
      </Wrapper>
    );

    const image = screen.getByAltText("Pikachu");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      "src",
      expect.stringContaining("/pikachu.jpg")
    );
  });

  it("should display stock information when in stock", () => {
    render(
      <Wrapper>
        <ProductCard pokemon={mockPokemon} />
      </Wrapper>
    );

    expect(screen.getByText("10 in stock")).toBeInTheDocument();
  });

  it("should display out of stock message when stock is 0", () => {
    const outOfStockPokemon = { ...mockPokemon, stock: 0 };

    render(
      <Wrapper>
        <ProductCard pokemon={outOfStockPokemon} />
      </Wrapper>
    );

    expect(screen.getByText("Out of stock")).toBeInTheDocument();
  });

  it("should render type badge", () => {
    render(
      <Wrapper>
        <ProductCard pokemon={mockPokemon} />
      </Wrapper>
    );

    expect(screen.getByText("Electric")).toBeInTheDocument();
  });

  it("should render rarity badge", () => {
    render(
      <Wrapper>
        <ProductCard pokemon={mockPokemon} />
      </Wrapper>
    );

    expect(screen.getByText("Rare")).toBeInTheDocument();
  });

  it("should render condition badge", () => {
    render(
      <Wrapper>
        <ProductCard pokemon={mockPokemon} />
      </Wrapper>
    );

    expect(screen.getByText("Mint")).toBeInTheDocument();
  });

  it("should have link to product detail page", () => {
    render(
      <Wrapper>
        <ProductCard pokemon={mockPokemon} />
      </Wrapper>
    );

    const links = screen.getAllByRole("link");
    const productLink = links.find((link) =>
      link.getAttribute("href")?.includes("/products/pikachu")
    );

    expect(productLink).toBeInTheDocument();
  });

  it("should toggle wishlist when heart button is clicked", async () => {
    const user = userEvent.setup({ delay: null });

    render(
      <Wrapper>
        <ProductCard pokemon={mockPokemon} />
      </Wrapper>
    );

    const wishlistButton = screen.getByRole("button", {
      name: /add to wishlist/i,
    });

    // Initially not in wishlist
    expect(wishlistButton.querySelector("svg")).not.toHaveClass("fill-red-500");

    // Click to add to wishlist
    await user.click(wishlistButton);

    // Should be in wishlist now
    expect(wishlistButton.querySelector("svg")).toHaveClass("fill-red-500");

    // Click again to remove from wishlist
    await user.click(wishlistButton);

    // Should not be in wishlist
    expect(wishlistButton.querySelector("svg")).not.toHaveClass("fill-red-500");
  });

  it("should call onAddToCart when add to cart button is clicked", async () => {
    const user = userEvent.setup({ delay: null });
    const mockAddToCart = jest.fn();

    render(
      <Wrapper>
        <ProductCard pokemon={mockPokemon} onAddToCart={mockAddToCart} />
      </Wrapper>
    );

    const addToCartButtons = screen.getAllByRole("button");
    const addButton = addToCartButtons.find((btn) =>
      btn.textContent?.includes("Add to Cart")
    );

    await user.click(addButton!);

    expect(mockAddToCart).toHaveBeenCalledWith(mockPokemon);
  });

  it("should show success message after adding to cart", async () => {
    const user = userEvent.setup({ delay: null });
    const mockAddToCart = jest.fn();

    render(
      <Wrapper>
        <ProductCard pokemon={mockPokemon} onAddToCart={mockAddToCart} />
      </Wrapper>
    );

    const addToCartButtons = screen.getAllByRole("button");
    const addButton = addToCartButtons.find((btn) =>
      btn.textContent?.includes("Add to Cart")
    );

    await user.click(addButton!);

    expect(screen.getByText("Added!")).toBeInTheDocument();

    // Fast forward time
    jest.advanceTimersByTime(2000);

    // Should revert back
    await waitFor(() => {
      expect(screen.queryByText("Added!")).not.toBeInTheDocument();
    });
  });

  it("should disable add to cart button when out of stock", () => {
    const outOfStockPokemon = { ...mockPokemon, stock: 0 };

    render(
      <Wrapper>
        <ProductCard pokemon={outOfStockPokemon} />
      </Wrapper>
    );

    const addToCartButtons = screen.getAllByRole("button");
    const addButton = addToCartButtons.find((btn) =>
      btn.textContent?.includes("Add to Cart")
    );

    expect(addButton).toBeDisabled();
  });

  it("should render without description if not provided", () => {
    const pokemonWithoutDescription = { ...mockPokemon, description: null };

    render(
      <Wrapper>
        <ProductCard pokemon={pokemonWithoutDescription} />
      </Wrapper>
    );

    expect(screen.getByText("Pikachu")).toBeInTheDocument();
    expect(
      screen.queryByText(/A cute electric-type Pokemon/i)
    ).not.toBeInTheDocument();
  });
});
