async function fetchPokemons() {
  const res = await fetch("http://localhost:1337/api/pokemons");
  if (!res.ok) throw new Error("Failed to fetch pokemons");
  const data = await res.json();
  return Array.isArray(data.data) ? data.data : [];
}

export default fetchPokemons;
