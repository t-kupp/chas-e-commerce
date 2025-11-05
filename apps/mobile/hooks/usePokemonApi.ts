import {useEffect, useState} from "react";
import type {Pokemon} from "../../shared/types/pokemon";

export function usePokemons() {
  const STRAPI_URL = process.env.EXPO_PUBLIC_STRAPI_URL;
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadPokemons() {
    const res = await fetch(`${STRAPI_URL}/api/pokemons?populate=*`);
    const json = await res.json();
    setPokemons(json.data);
    setLoading(false);
  }

  useEffect(() => {
    loadPokemons();
  }, []);

  return {pokemons, loading};
}
