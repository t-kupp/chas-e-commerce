"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Pokemon } from "../../../shared/types/pokemon";
import Link from "next/link";

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
    <section id="products-section" className="max-w-7xl mx-auto px-4">
      <div className="mb-6 mt-6 flex justify-end">
        <div className="flex items-center gap-3">
          <label htmlFor="sort" className="text-sm font-medium">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={handleSortChange}
            className="px-4 py-2 border border-foreground/10 rounded  text-sm">
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
        {filteredData.map((card) => {
          return (
            <div
              key={card.id}
              className="w-full h-full px-4 py-6 bg-foreground/5 flex flex-col gap-4 rounded items-center text-center">
              <Link
                href={`/products/${card.slug}`}
                className="flex flex-col gap-2 justify-center items-center">
                <div className="w-2/3 ">
                  <Image
                    width={1024}
                    height={1024}
                    src={`${STRAPI_URL}${card.image.url}`}
                    alt={`Card of ${card.name}`}
                    className="w-full h-full rounded-lg flex flex-col justify-center mx-auto"
                  />
                </div>
                <p>{card.name}</p>
                <p className="font-semibold text-2xl">
                  ${card.price.toFixed(2)}
                </p>
              </Link>
              <div className="px-3 w-full">
                <button
                  onClick={() => handleAddToCart(card)}
                  className="bg-foreground text-background w-full rounded py-3 text-sm hover:opacity-80 active:opacity-70">
                  Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
