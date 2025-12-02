const baseURL = import.meta.env.VITE_POKEMON_API_URL;

export default class ExternalPokemonServices {

  async getPokemonList(limit = 500) {
    const res = await fetch(`${baseURL}pokemon?limit=${limit}`);

    const data = await res.json();

    const details = await Promise.all(
      data.results.map(async (p) => {
        const r = await fetch(p.url);
        const d = await r.json();
        return {
          id: d.id,
          name: d.name,
          image: d.sprites.other["official-artwork"].front_default,
          types: d.types.map(t => t.type.name)
        };
      })
    );

    return details;
  }

  async findPokemonById(id) {
    const res = await fetch(`${baseURL}/pokemon/${id}`);
    const data = await res.json();

    return {
      id: data.id,
      name: data.name,
      image: data.sprites.other["official-artwork"].front_default,
      types: data.types.map((t) => t.type.name),
      abilities: data.abilities.map((a) => a.ability.name),
      stats: data.stats.map((s) => ({
        name: s.stat.name,
        value: s.base_stat,
      })),
    };
  }
}


