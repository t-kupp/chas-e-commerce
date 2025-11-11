"use client";

import { useState, useEffect } from "react";
import { ChevronDownIcon, ChevronUpIcon, Filter, X } from "lucide-react";
import { FilterState, FilterOptions } from "../../../shared/types/pokemon";

interface FilterProps {
  onFiltersChange: (filters: FilterState) => void;
}

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const sectionId = `filter-${title.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left"
        aria-expanded={isOpen}
        aria-controls={sectionId}
        aria-label={`${isOpen ? "Collapse" : "Expand"} ${title} filter section`}
      >
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        {isOpen ? (
          <ChevronUpIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        ) : (
          <ChevronDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        )}
      </button>
      {isOpen && (
        <div
          id={sectionId}
          className="mt-4"
          role="region"
          aria-labelledby={sectionId}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default function ProductFilters({ onFiltersChange }: FilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: { min: 0, max: 2000 },
    types: [],
    rarities: [],
    conditions: [],
    inStock: null,
    name: "",
  });

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    types: [],
    rarities: [],
    conditions: [],
    priceRange: { min: 0, max: 2000 },
  });

  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Fetch filter options from Strapi
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const STRAPI_URL =
          process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

        // Fetch all filter options in parallel
        const [typesRes, raritiesRes, conditionsRes, pokemonsRes] =
          await Promise.all([
            fetch(`${STRAPI_URL}/api/types`),
            fetch(`${STRAPI_URL}/api/rarities`),
            fetch(`${STRAPI_URL}/api/conditions`),
            fetch(`${STRAPI_URL}/api/pokemons?fields[0]=price`),
          ]);

        const [typesData, raritiesData, conditionsData, pokemonsData] =
          await Promise.all([
            typesRes.json(),
            raritiesRes.json(),
            conditionsRes.json(),
            pokemonsRes.json(),
          ]);

        // Calculate price range from actual Pokemon data
        const prices = pokemonsData.data
          .map((pokemon: any) => pokemon.price)
          .filter(Boolean);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        setFilterOptions({
          types: typesData.data || [],
          rarities: raritiesData.data || [],
          conditions: conditionsData.data || [],
          priceRange: { min: minPrice, max: maxPrice },
        });

        // Update initial filters with actual price range from data
        setFilters((prev) => ({
          ...prev,
          priceRange: { min: minPrice, max: maxPrice },
        }));

        setLoading(false);
      } catch (error) {
        console.error("Error fetching filter options:", error);
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleCheckboxChange = (
    category: "types" | "rarities" | "conditions",
    value: string
  ) => {
    const currentValues = filters[category];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

    updateFilters({ [category]: newValues });
  };

  // Close mobile filter when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        isMobileFilterOpen &&
        !target.closest("#mobile-filter-drawer") &&
        !target.closest("#mobile-filter-button")
      ) {
        setIsMobileFilterOpen(false);
      }
    };

    if (isMobileFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden"; // Prevent scrolling when drawer is open
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isMobileFilterOpen]);

  const FilterContent = () => (
    <div className="mb-6">
      <h2
        id="filters-heading"
        className="text-lg font-semibold text-gray-900 mb-4"
      >
        Filters
      </h2>

      {/* Search by Name */}
      <FilterSection title="Search">
        <input
          type="search"
          placeholder="Search by name..."
          value={filters.name}
          onChange={(e) => updateFilters({ name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Search products by name"
        />
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price">
        <div className="space-y-4">
          {/* Price Input Fields */}
          <div
            className="flex items-center space-x-2"
            role="group"
            aria-labelledby="price-range-label"
          >
            <span id="price-range-label" className="sr-only">
              Price range
            </span>
            <input
              type="number"
              placeholder="Min price"
              value={filters.priceRange.min}
              onChange={(e) =>
                updateFilters({
                  priceRange: {
                    ...filters.priceRange,
                    min:
                      e.target.value === ""
                        ? 0
                        : Number(e.target.value) || filters.priceRange.min,
                  },
                })
              }
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Minimum price"
              min={filterOptions.priceRange.min}
              max={filterOptions.priceRange.max}
            />
            <span className="text-gray-500 text-sm" aria-hidden="true">
              to
            </span>
            <input
              type="number"
              placeholder="Max price"
              value={filters.priceRange.max}
              onChange={(e) =>
                updateFilters({
                  priceRange: {
                    ...filters.priceRange,
                    max:
                      e.target.value === ""
                        ? filterOptions.priceRange.max
                        : Number(e.target.value) || filters.priceRange.max,
                  },
                })
              }
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Maximum price"
              min={filterOptions.priceRange.min}
              max={filterOptions.priceRange.max}
            />
          </div>
        </div>
      </FilterSection>

      {/* Pokemon Type */}
      <FilterSection title="Pokemon Type">
        <fieldset className="space-y-2 max-h-40 overflow-y-auto">
          <legend className="sr-only">Filter by Pokemon type</legend>
          {filterOptions.types.map((type) => (
            <label key={type.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.types.includes(type.title)}
                onChange={() => handleCheckboxChange("types", type.title)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                aria-label={`Filter by ${type.title} type`}
              />
              <span className="text-sm text-gray-700">{type.title}</span>
            </label>
          ))}
        </fieldset>
      </FilterSection>

      {/* Rarity */}
      <FilterSection title="Rarity">
        <fieldset className="space-y-2 max-h-40 overflow-y-auto">
          <legend className="sr-only">Filter by rarity</legend>
          {filterOptions.rarities.map((rarity) => (
            <label key={rarity.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.rarities.includes(rarity.title)}
                onChange={() => handleCheckboxChange("rarities", rarity.title)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                aria-label={`Filter by ${rarity.title} rarity`}
              />
              <span className="text-sm text-gray-700">{rarity.title}</span>
            </label>
          ))}
        </fieldset>
      </FilterSection>

      {/* Condition */}
      <FilterSection title="Condition">
        <fieldset className="space-y-2">
          <legend className="sr-only">Filter by condition</legend>
          {filterOptions.conditions.map((condition) => (
            <label key={condition.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.conditions.includes(condition.title)}
                onChange={() =>
                  handleCheckboxChange("conditions", condition.title)
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                aria-label={`Filter by ${condition.title} condition`}
              />
              <span className="text-sm text-gray-700">{condition.title}</span>
            </label>
          ))}
        </fieldset>
      </FilterSection>

      {/* In Stock */}
      <FilterSection title="Availability">
        <fieldset className="space-y-2">
          <legend className="sr-only">Filter by availability</legend>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="stock"
              checked={filters.inStock === null}
              onChange={() => updateFilters({ inStock: null })}
              className="text-blue-600 focus:ring-blue-500"
              aria-label="Show all items"
            />
            <span className="text-sm text-gray-700">All items</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="stock"
              checked={filters.inStock === true}
              onChange={() => updateFilters({ inStock: true })}
              className="text-blue-600 focus:ring-blue-500"
              aria-label="Show only in stock items"
            />
            <span className="text-sm text-gray-700">In stock only</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="stock"
              checked={filters.inStock === false}
              onChange={() => updateFilters({ inStock: false })}
              className="text-blue-600 focus:ring-blue-500"
              aria-label="Show only out of stock items"
            />
            <span className="text-sm text-gray-700">Out of stock</span>
          </label>
        </fieldset>
      </FilterSection>

      {/* Clear Filters Button */}
      <div className="mt-6">
        <button
          onClick={() => {
            const resetFilters: FilterState = {
              priceRange: filterOptions.priceRange,
              types: [],
              rarities: [],
              conditions: [],
              inStock: null,
              name: "",
            };
            setFilters(resetFilters);
            onFiltersChange(resetFilters);
          }}
          className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Clear all applied filters"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <>
        {/* Mobile Filter Button */}
        <div className="md:hidden mb-4">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-md">
            <Filter className="h-4 w-4" />
            <span>Loading filters...</span>
          </button>
        </div>

        {/* Desktop Loading State */}
        <div className="hidden md:block w-64 bg-white p-6 border-r border-gray-200">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="md:hidden mb-4">
        <button
          id="mobile-filter-button"
          onClick={() => setIsMobileFilterOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Open filters menu"
          aria-expanded={isMobileFilterOpen}
          aria-controls="mobile-filter-drawer"
        >
          <Filter className="h-4 w-4" aria-hidden="true" />
          <span>Filters</span>
          {/* Show active filter count */}
          {(filters.types.length > 0 ||
            filters.rarities.length > 0 ||
            filters.conditions.length > 0 ||
            filters.name ||
            filters.inStock !== null ||
            filters.priceRange.min !== filterOptions.priceRange.min ||
            filters.priceRange.max !== filterOptions.priceRange.max) && (
            <span
              className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
              aria-label={`${
                filters.types.length +
                filters.rarities.length +
                filters.conditions.length +
                (filters.name ? 1 : 0) +
                (filters.inStock !== null ? 1 : 0) +
                (filters.priceRange.min !== filterOptions.priceRange.min ||
                filters.priceRange.max !== filterOptions.priceRange.max
                  ? 1
                  : 0)
              } active filters`}
            >
              {filters.types.length +
                filters.rarities.length +
                filters.conditions.length +
                (filters.name ? 1 : 0) +
                (filters.inStock !== null ? 1 : 0) +
                (filters.priceRange.min !== filterOptions.priceRange.min ||
                filters.priceRange.max !== filterOptions.priceRange.max
                  ? 1
                  : 0)}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Filter Drawer Overlay */}
      {isMobileFilterOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-filters-heading"
        >
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            aria-hidden="true"
          />
          <div
            id="mobile-filter-drawer"
            className="absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-lg transform transition-transform duration-300 ease-in-out overflow-y-auto"
          >
            <div className="p-6">
              {/* Mobile Header */}
              <div className="flex items-center justify-between mb-6">
                <h2
                  id="mobile-filters-heading"
                  className="text-lg font-semibold text-gray-900"
                >
                  Filters
                </h2>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Close filters menu"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <FilterContent />

              {/* Mobile Apply Button */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Apply filters and close menu"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Filter Sidebar */}
      <aside
        className="hidden md:block w-64 bg-white p-6 border-r border-gray-200"
        role="complementary"
        aria-labelledby="filters-heading"
      >
        <FilterContent />
      </aside>
    </>
  );
}
