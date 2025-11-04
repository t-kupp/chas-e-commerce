"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Heart, ShoppingCart, User, Search, Menu, X } from "lucide-react";

//====== ADD BACK LATER WHEN CART IS WORKING =====
// import { useCart } from "@/context/cart";

interface Pokemon {
  id: number;
  name: string;
  slug: string;
  image?: {
    url: string;
  };
}

interface Type {
  id: number;
  title: string;
  slug: string;
}

interface SearchSuggestions {
  pokemon: Pokemon[];
  types: Type[];
}

export default function Header() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestions>({
    pokemon: [],
    types: [],
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  //====== ADD BACK LATER WHEN CART IS WORKING =====
  // const { items } = useCart();
  // const cartCount =
  //   items?.reduce((sum, it) => sum + (it.quantity ?? 1), 0) ?? 0;

  // close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // fetch suggestions when query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions({ pokemon: [], types: [] });
        setShowSuggestions(false);
        return;
      }

      setIsLoading(true);
      try {
        // fetch pokemon and types in parallel
        const [pokemonRes, typesRes] = await Promise.all([
          fetch(
            `http://localhost:1337/api/pokemons?filters[name][$containsi]=${encodeURIComponent(query.trim())}&populate=image&pagination[limit]=5`
          ),
          fetch(
            `http://localhost:1337/api/types?filters[title][$containsi]=${encodeURIComponent(query.trim())}&pagination[limit]=3`
          ),
        ]);

        const [pokemonData, typesData] = await Promise.all([
          pokemonRes.json(),
          typesRes.json(),
        ]);

        setSuggestions({
          pokemon: pokemonData.data || [],
          types: typesData.data || [],
        });
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions({ pokemon: [], types: [] });
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    setShowSuggestions(false);
    router.push(`/products${q ? `?q=${encodeURIComponent(q)}` : ""}`);
    setMobileOpen(false);
  }

  function handleSuggestionClick(slug: string) {
    setShowSuggestions(false);
    setQuery("");
    setMobileOpen(false);
    router.push(`/products/${slug}`);
  }

  function handleTypeClick(slug: string) {
    setShowSuggestions(false);
    setQuery("");
    setMobileOpen(false);
    router.push(`/types/${slug}`);
  }

  return (
    <header className="w-full fixed top-0 z-50 bg-gray-800 text-white border-b-8 border-yellow-400">
      <div className="xl:mx-16 px-4 py-3 flex items-center justify-between h-16">
        {/* logo */}
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2 focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:rounded-lg"
            aria-label="Pokémon Store Home"
          >
            <span className="text-2xl font-extrabold text-yellow-400 tracking-wider">
              POKÉMON STORE
            </span>
          </Link>
        </div>

        {/* desktop nav and search - hidden on mobile */}
        <div className="hidden md:flex flex-1 px-4 max-w-3xs md:max-w-xs xl:max-w-2xl">
          <form onSubmit={onSubmit} className="relative w-full">
            <label htmlFor="site-search" className="sr-only">
              Search products
            </label>
            <div className="relative" ref={searchRef}>
              <span className="absolute inset-y-0 left-4 flex items-center text-gray-400 pointer-events-none">
                <Search size={18} aria-hidden="true" />
              </span>
              <input
                id="site-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() =>
                  query.trim().length >= 2 && setShowSuggestions(true)
                }
                placeholder="Search Pokemon"
                aria-autocomplete="list"
                aria-controls="search-suggestions"
                aria-expanded={showSuggestions}
                className="w-full h-12 rounded-md bg-gray-100 text-black py-2 pl-12 pr-4 text-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-yellow-400"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setShowSuggestions(false);
                  }}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} aria-hidden="true" />
                </button>
              )}

              {/* Suggestions dropdown */}
              {showSuggestions && (
                <div
                  id="search-suggestions"
                  role="listbox"
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50 p-2"
                >
                  {isLoading ? (
                    <div className="p-4 text-center text-gray-500">
                      Loading...
                    </div>
                  ) : suggestions.pokemon.length > 0 ||
                    suggestions.types.length > 0 ? (
                    <div>
                      {/* pokemon suggestions */}
                      {suggestions.pokemon.length > 0 && (
                        <div>
                          <div
                            className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase border-t border-yellow-400 mb-2"
                            role="presentation"
                          >
                            Pokemon Cards
                          </div>
                          <ul role="group" aria-label="Pokemon suggestions">
                            {suggestions.pokemon.map((pokemon) => {
                              const imageUrl = pokemon.image?.url
                                ? `http://localhost:1337${pokemon.image.url}`
                                : "/placeholder-card.png";
                              return (
                                <li key={`pokemon-${pokemon.id}`} role="option">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleSuggestionClick(pokemon.slug)
                                    }
                                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 focus:bg-gray-100 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-400 rounded"
                                  >
                                    <img
                                      src={imageUrl}
                                      alt=""
                                      className="w-12 h-12 object-cover rounded"
                                      aria-hidden="true"
                                    />
                                    <span className="text-gray-800 font-medium">
                                      {pokemon.name}
                                    </span>
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}

                      {/* type suggestions */}
                      {suggestions.types.length > 0 && (
                        <div>
                          <div
                            className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase border-t border-yellow-400 mb-2"
                            role="presentation"
                          >
                            Types
                          </div>
                          <ul role="group" aria-label="Type suggestions">
                            {suggestions.types.map((type) => (
                              <li key={`type-${type.id}`} role="option">
                                <button
                                  type="button"
                                  onClick={() => handleTypeClick(type.slug)}
                                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 focus:bg-gray-100 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-400 rounded"
                                >
                                  <div
                                    className="w-12 h-12 rounded bg-linear-to-br from-blue-800 to-yellow-400 flex items-center justify-center text-white font-bold"
                                    aria-hidden="true"
                                  >
                                    {type.title.charAt(0)}
                                  </div>
                                  <span className="text-gray-800 font-medium">
                                    {type.title}
                                  </span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No results found
                    </div>
                  )}
                </div>
              )}
            </div>
          </form>
        </div>
        <nav
          className="hidden md:flex items-center gap-6 ml-6"
          aria-label="Main navigation"
        >
          <Link
            href="/products"
            className="hover:text-yellow-400 hover:underline px-2 py-1"
          >
            Products
          </Link>
          <Link
            href="/types"
            className="hover:text-yellow-400 hover:underline px-2 py-1"
          >
            Types
          </Link>
          <Link
            href="/about"
            className="hover:text-yellow-400 hover:underline px-2 py-1"
          >
            About us
          </Link>
          <Link
            href="/contact"
            className="hover:text-yellow-400 hover:underline px-2 py-1"
          >
            Contact
          </Link>
        </nav>

        {/* desktop icons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/favorites"
            aria-label="Favorites"
            className="p-2 rounded hover:bg-yellow-400/20"
          >
            <Heart
              className="text-white hover:text-yellow-400"
              aria-hidden="true"
            />
          </Link>
          <Link
            href="/account"
            aria-label="Account"
            className="p-2 rounded hover:bg-yellow-400/20"
          >
            <User
              className="text-white hover:text-yellow-400"
              aria-hidden="true"
            />
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className="p-2 rounded hover:bg-yellow-400/20"
          >
            <ShoppingCart
              className="text-white hover:text-yellow-400"
              aria-hidden="true"
            />
            {/* ====== ADD BACK LATER WHEN CART IS WORKING ===== */}
            {/* {cartCount > 0 && (
              <span className="cartAmount absolute -right-3 -top-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold leading-none text-white bg-red-500 w-4 h-4 rounded-full">
                {cartCount}
              </span>
            )} */}
          </Link>
        </div>

        {/* mobile icons and menu button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/favorites"
            aria-label="Favorites"
            className="relative p-2 rounded hover:bg-yellow-400/20"
          >
            <Heart className="text-white" aria-hidden="true" />
          </Link>
          <Link
            href="/account"
            aria-label="Account"
            className="p-2 rounded hover:bg-yellow-400/20"
          >
            <User className="text-white" aria-hidden="true" />
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative p-2 rounded hover:bg-yellow-400/20"
          >
            <ShoppingCart className="text-white" size={20} aria-hidden="true" />
          </Link>

          {/* mobile menu button */}
          <button
            className="p-2 rounded hover:bg-yellow-400/20"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((s) => !s)}
          >
            {mobileOpen ? (
              <X className="text-white" size={24} aria-hidden="true" />
            ) : (
              <Menu className="text-white" size={24} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* mobile menu panel */}
      {mobileOpen && (
        <div id="mobile-menu" className="md:hidden bg-white shadow-lg">
          <div className="px-4 py-4 flex flex-col gap-4">
            {/* mobile Search */}
            <form onSubmit={onSubmit} className="relative">
              <label htmlFor="mobile-search" className="sr-only">
                Search pokemons
              </label>
              <div className="relative" ref={mobileSearchRef}>
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
                  <Search size={18} aria-hidden="true" />
                </span>
                <input
                  id="mobile-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() =>
                    query.trim().length >= 2 && setShowSuggestions(true)
                  }
                  placeholder="Search Pokemon or Types..."
                  aria-autocomplete="list"
                  aria-controls="mobile-search-suggestions"
                  aria-expanded={showSuggestions}
                  className="w-full h-11 rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-10 text-sm placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:border-transparent"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setShowSuggestions(false);
                    }}
                    aria-label="Clear search"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} aria-hidden="true" />
                  </button>
                )}

                {/* mobile suggestions dropdown */}
                {showSuggestions && (
                  <div
                    id="mobile-search-suggestions"
                    role="listbox"
                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-y-auto z-50"
                  >
                    {isLoading ? (
                      <div className="p-4 text-center text-gray-500">
                        Loading...
                      </div>
                    ) : suggestions.pokemon.length > 0 ||
                      suggestions.types.length > 0 ? (
                      <div>
                        {/* pokemon suggestions */}
                        {suggestions.pokemon.length > 0 && (
                          <div>
                            <div
                              className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase bg-gray-50"
                              role="presentation"
                            >
                              Pokemon Cards
                            </div>
                            <ul role="group" aria-label="Pokemon suggestions">
                              {suggestions.pokemon.map((pokemon) => {
                                const imageUrl = pokemon.image?.url
                                  ? `http://localhost:1337${pokemon.image.url}`
                                  : "/placeholder-card.png";
                                return (
                                  <li
                                    key={`mobile-pokemon-${pokemon.id}`}
                                    role="option"
                                  >
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleSuggestionClick(pokemon.slug)
                                      }
                                      className="w-full flex items-center gap-3 p-3 hover:bg-blue-50 focus:bg-blue-100 transition-colors text-left border-b border-gray-100 last:border-0 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-400"
                                    >
                                      <img
                                        src={imageUrl}
                                        alt=""
                                        className="w-10 h-10 object-cover rounded"
                                        aria-hidden="true"
                                      />
                                      <span className="text-gray-800 font-medium text-sm">
                                        {pokemon.name}
                                      </span>
                                    </button>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        )}

                        {/* yype suggestions */}
                        {suggestions.types.length > 0 && (
                          <div>
                            <div
                              className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase bg-gray-50 border-t"
                              role="presentation"
                            >
                              Types
                            </div>
                            <ul role="group" aria-label="Type suggestions">
                              {suggestions.types.map((type) => (
                                <li
                                  key={`mobile-type-${type.id}`}
                                  role="option"
                                >
                                  <button
                                    type="button"
                                    onClick={() => handleTypeClick(type.slug)}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-blue-50 focus:bg-blue-100 transition-colors text-left border-b border-gray-100 last:border-0 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-400"
                                  >
                                    <div
                                      className="w-10 h-10 rounded bg-linear-to-br from-gray-700 to-yellow-400 flex items-center justify-center text-white font-bold text-lg"
                                      aria-hidden="true"
                                    >
                                      {type.title.charAt(0)}
                                    </div>
                                    <span className="text-gray-800 font-medium text-sm">
                                      {type.title}
                                    </span>
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        No results found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </form>

            {/* mobile navigation Links */}
            <nav
              className="flex flex-col gap-1 border-t pt-3"
              aria-label="Mobile navigation"
            >
              <Link
                href="/products"
                onClick={() => setMobileOpen(false)}
                className="py-3 px-3 text-gray-700 hover:bg-gray-50 focus:bg-gray-100 rounded-md font-medium transition-colors"
              >
                Products
              </Link>
              <Link
                href="/types"
                onClick={() => setMobileOpen(false)}
                className="py-3 px-3 text-gray-700 hover:bg-gray-50 focus:bg-gray-100 rounded-md font-medium transition-colors"
              >
                Types
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileOpen(false)}
                className="py-3 px-3 text-gray-700 hover:bg-gray-50 focus:bg-gray-100 rounded-md font-medium transition-colors"
              >
                About us
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="py-3 px-3 text-gray-700 hover:bg-gray-50 focus:bg-gray-100 rounded-md font-medium transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
