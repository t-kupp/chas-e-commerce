import Hero from "./components/Hero";
import ProductGrid from "./components/ProductGrid";
import { FilterState } from "../../shared/types/pokemon";

// Default filters for home page - show all products
const defaultFilters: FilterState = {
  priceRange: { min: 0, max: Number.MAX_SAFE_INTEGER },
  types: [],
  rarities: [],
  conditions: [],
  inStock: null,
  name: "",
};

export default function Home() {
  return (
    <main className="min-h-screen mx-auto">
      <Hero />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <ProductGrid filters={defaultFilters} />
      </div>
    </main>
  );
}
