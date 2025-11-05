"use client";
import { useEffect, useState } from "react";
import { Pokemon } from "../../../shared/types/pokemon";
import ProductCard from "./ProductCard";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

type SortOption =
  | "date-newest"
  | "date-oldest"
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc";

export default function ProductGrid() {
  const [data, setData] = useState<Pokemon[] | null>(null);
  const [filteredData, setFilteredData] = useState<Pokemon[] | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("date-newest");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  // Apply sorting whenever sortBy or data changes
  useEffect(() => {
    if (!data) return;

    const sorted = [...data].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "date-newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "date-oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        default:
          return 0;
      }
    });

    setFilteredData(sorted);
  }, [sortBy, data]);

  function handleSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSortBy(e.target.value as SortOption);
  }

  function handleAddToCart(card: Pokemon) {
    console.log("Added to cart: " + card.name);
  }

  if (!filteredData)
    return <div>{errorMessage ? errorMessage : "Loading..."}</div>;

  return (
    <section id="products-section" className="max-w-7xl mx-auto px-4 mb-12">
      <div className="mb-6 mt-6 flex justify-end">
        <div className="flex items-center gap-3">
          <label htmlFor="sort" className="text-sm font-medium">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={handleSortChange}
            className="px-4 py-2 border border-foreground/10 rounded  text-sm"
          >
            <option value="date-newest">Date Added (Newest First)</option>
            <option value="date-oldest">Date Added (Oldest First)</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6">
        {filteredData.map((card) => (
          <ProductCard
            key={card.id}
            pokemon={card}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </section>
  );
}
