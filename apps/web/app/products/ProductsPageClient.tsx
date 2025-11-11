"use client";
import { useState } from "react";
import ProductGrid from "../components/ProductGrid";
import ProductFilters from "../components/FilterTable";
import { FilterState } from "../../../shared/types/pokemon";

export default function ProductsPageClient() {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: { min: 0, max: 2000 },
    types: [],
    rarities: [],
    conditions: [],
    inStock: null,
    name: "",
  });

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="md:flex gap-8">
        {/* Filters Sidebar */}
        <ProductFilters onFiltersChange={handleFiltersChange} />

        {/* Products Grid */}
        <div className="flex-1">
          <ProductGrid filters={filters} />
        </div>
      </div>
    </div>
  );
}
