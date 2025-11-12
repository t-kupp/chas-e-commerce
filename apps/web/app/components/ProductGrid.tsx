"use client";
import { useEffect, useState } from "react";
import { Pokemon, FilterState } from "../../../shared/types/pokemon";
import { useCart } from "../context/cart";
import ProductCard from "./ProductCard";
import SortDropdown from "./SortDropdown";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

type SortOption =
  | "date-newest"
  | "date-oldest"
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc";

const SORT_OPTIONS = [
  { value: "date-newest", label: "Date Added (Newest First)" },
  { value: "date-oldest", label: "Date Added (Oldest First)" },
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "price-asc", label: "Price (Low to High)" },
  { value: "price-desc", label: "Price (High to Low)" },
];

interface ProductGridProps {
  filters?: FilterState;
}

export default function ProductGrid({ filters }: ProductGridProps) {
  const [data, setData] = useState<Pokemon[] | null>(null);
  const [filteredData, setFilteredData] = useState<Pokemon[] | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("date-newest");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { addToCart } = useCart();

  // Fetch data on page load
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${STRAPI_URL}/api/pokemons?populate=*`);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setData(data.data);
        setFilteredData(data.data);
      } catch (e) {
        setErrorMessage("Failed to fetch data, please try again later.");
        console.error(e);
      }
    }
    fetchData();
  }, []);

  // Apply filters and sorting whenever they change
  useEffect(() => {
    if (!data) return;

    let filtered = [...data];

    // Only apply filters if they are provided
    if (filters) {
      // Apply name filter
      if (filters.name) {
        filtered = filtered.filter((pokemon) =>
          pokemon?.name?.toLowerCase().includes(filters.name.toLowerCase())
        );
      }

      // Apply price range filter
      if (filters.priceRange) {
        filtered = filtered.filter(
          (pokemon) =>
            pokemon?.price >= filters.priceRange.min &&
            pokemon?.price <= filters.priceRange.max
        );
      }

      // Apply type filter
      if (filters.types && filters.types.length > 0) {
        filtered = filtered.filter((pokemon) =>
          filters.types.includes(pokemon?.type?.title || "")
        );
      }

      // Apply rarity filter
      if (filters.rarities && filters.rarities.length > 0) {
        filtered = filtered.filter((pokemon) =>
          filters.rarities.includes(pokemon?.rarity?.title || "")
        );
      }

      // Apply condition filter
      if (filters.conditions && filters.conditions.length > 0) {
        filtered = filtered.filter((pokemon) =>
          filters.conditions.includes(pokemon?.condition?.title || "")
        );
      }

      // Apply stock filter
      if (filters.inStock !== null && filters.inStock !== undefined) {
        if (filters.inStock) {
          filtered = filtered.filter((pokemon) => (pokemon?.stock ?? 0) > 0);
        } else {
          filtered = filtered.filter((pokemon) => (pokemon?.stock ?? 0) === 0);
        }
      }
    }

    // Apply sorting
    const sorted = filtered.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return (a?.name || "").localeCompare(b?.name || "");
        case "name-desc":
          return (b?.name || "").localeCompare(a?.name || "");
        case "price-asc":
          return (a?.price || 0) - (b?.price || 0);
        case "price-desc":
          return (b?.price || 0) - (a?.price || 0);
        case "date-newest":
          return (
            new Date(b?.createdAt || 0).getTime() -
            new Date(a?.createdAt || 0).getTime()
          );
        case "date-oldest":
          return (
            new Date(a?.createdAt || 0).getTime() -
            new Date(b?.createdAt || 0).getTime()
          );
        default:
          return 0;
      }
    });

    setFilteredData(sorted);
  }, [sortBy, data, filters]);

  function handleAddToCart(card: Pokemon) {
    addToCart(card);
  }

  if (!filteredData)
    return <div>{errorMessage ? errorMessage : "Loading..."}</div>;

  return (
    <section
      id="products-section"
      className="w-full"
      aria-labelledby="products-heading"
      role="region"
    >
      <div className="mx-auto mb-6 mt-6 flex justify-between items-center">
        <p className="text-sm text-gray-600" role="status" aria-live="polite">
          {filteredData.length} products found
        </p>
        <SortDropdown
          value={sortBy}
          onChange={(value) => setSortBy(value as SortOption)}
          options={SORT_OPTIONS}
          ariaLabel="Sort products by"
        />
      </div>
      <div
        className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-6"
        role="list"
        aria-label="Product cards"
      >
        {filteredData.map((card) => (
          <div key={card.id} role="listitem">
            <ProductCard pokemon={card} onAddToCart={handleAddToCart} />
          </div>
        ))}
      </div>
      {filteredData.length === 0 && (
        <div className="text-center py-16" role="status" aria-live="polite">
          <p className="text-gray-500 text-lg">
            No products match your current filters.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Try adjusting your search criteria.
          </p>
        </div>
      )}
    </section>
  );
}
