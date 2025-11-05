"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Layers } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { TypeCard } from "../components/TypeCard";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

type SortOption = "name-asc" | "name-desc" | "cards-most" | "cards-least";

function EmptyState() {
  return (
    <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Layers className="text-yellow-600" size={40} />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        No Types Available
      </h2>
      <p className="text-gray-600 mb-6">
        We don&apos;t have any types available right now.
      </p>
      <Link
        href="/products"
        className="inline-block bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-8 py-3 rounded-lg shadow-md transition-colors"
      >
        Browse All Cards
      </Link>
    </div>
  );
}

export default function TypesPage() {
  const [types, setTypes] = useState<any[]>([]);
  const [filteredTypes, setFilteredTypes] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("cards-most");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTypes() {
      try {
        const res = await fetch(
          `${STRAPI_URL}/api/types?populate[pokemon][populate]=*`,
          { cache: "no-store" }
        );
        const data = await res.json();
        setTypes(data.data || []);
        setFilteredTypes(data.data || []);
      } catch (error) {
        console.error("Error fetching types:", error);
        setTypes([]);
        setFilteredTypes([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTypes();
  }, []);

  useEffect(() => {
    if (!types.length) return;

    const sorted = [...types].sort((a, b) => {
      const aCount = a.pokemon?.length || 0;
      const bCount = b.pokemon?.length || 0;
      const aTitle = a.title || "";
      const bTitle = b.title || "";

      switch (sortBy) {
        case "name-asc":
          return aTitle.localeCompare(bTitle);
        case "name-desc":
          return bTitle.localeCompare(aTitle);
        case "cards-most":
          return bCount - aCount;
        case "cards-least":
          return aCount - bCount;
        default:
          return 0;
      }
    });

    setFilteredTypes(sorted);
  }, [sortBy, types]);

  function handleSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSortBy(e.target.value as SortOption);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader
          title="Browse by Elemental Type"
          description="Discover Pokemon cards organized by their elemental alignment to build a powerful deck."
          backLink={{
            href: "/products",
            label: "Back to All Cards",
          }}
        />
        <main className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
          <div className="text-center py-16">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Browse by Elemental Type"
        description="Discover Pokemon cards organized by their elemental alignment to build a powerful deck."
        backLink={{
          href: "/products",
          label: "Back to All Cards",
        }}
      />

      <main className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        {filteredTypes.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* sort dropdown */}
            <div className="mb-8 flex justify-end">
              <div className="flex items-center gap-3">
                <label htmlFor="sort" className="text-sm font-medium">
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={handleSortChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="cards-most">Most Cards</option>
                  <option value="cards-least">Least Cards</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                </select>
              </div>
            </div>

            {/* types grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredTypes.map((type: any) => (
                <TypeCard key={type.id} type={type} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
