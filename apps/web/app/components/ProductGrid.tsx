"use client";
import { useEffect, useState } from "react";
import { Pokemon } from "../../../shared/types/pokemon";
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

export default function ProductGrid() {
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
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "date-oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        default:
          return 0;
      }
    });

    setFilteredData(sorted);
  }, [sortBy, data]);

  function handleAddToCart(card: Pokemon) {
    addToCart(card);
  }

  if (!filteredData) return <div>{errorMessage ? errorMessage : "Loading..."}</div>;

  return (
    <section id="products-section" className="max-w-7xl mx-auto px-4 mb-12">
      <div className="mb-6 mt-6 flex justify-end">
        <SortDropdown
          value={sortBy}
          onChange={(value) => setSortBy(value as SortOption)}
          options={SORT_OPTIONS}
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6">
        {filteredData.map((card) => (
          <ProductCard key={card.id} pokemon={card} onAddToCart={handleAddToCart} />
        ))}
      </div>
    </section>
  );
}
