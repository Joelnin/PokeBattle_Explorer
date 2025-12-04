const baseURL = import.meta.env.VITE_POKEMON_API_URL;

async function convertToJson(res) {

  const jsonResponse = await res.json();

  if (res.ok) {
    return jsonResponse
  } else {
    throw { name: "servicesError", message: jsonResponse };
  }
}

export default class PokemonExternalServices {

  async getPokemonList(limit = 500) {
    const response = await fetch(`${baseURL}pokemon?limit=${limit}`);

    const data = await convertToJson(response);

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

    const data = await convertToJson(res);

    const details = {
      id: data.id,
      name: data.name,
      image: data.sprites.other["official-artwork"].front_default,
      types: data.types.map((t) => t.type.name),
      abilities: data.abilities.map((a) => a.ability.name),
      stats: data.stats.map((s) => ({
        name: s.stat.name,
        value: s.base_stat,
      })),
      moves: data.moves.map((m) => m.move.name).slice(0, 5),
      weight: (data.weight / 10).toFixed(1), // Convert to kg
      height: (data.height / 10).toFixed(1), // Convert to m
    };

    // console.log(details)

    return details;
  }
}

