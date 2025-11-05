import {useEffect, useState} from "react";
import type {Pokemon} from "../../shared/types/pokemon";

export function usePokemon(slug?: string) {
  const STRAPI_URL = process.env.EXPO_PUBLIC_STRAPI_URL;
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadPokemon() {
    if (!slug) return;
    const res = await fetch(`${STRAPI_URL}/api/pokemons/${slug}?populate=*`);
    const json = await res.json();
    setPokemon(json.data);
    setLoading(false);
  }

  useEffect(() => {
    if (slug) loadPokemon();
  }, [slug]);

  return {pokemon, loading};
}
