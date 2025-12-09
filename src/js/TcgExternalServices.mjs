const baseURL = import.meta.env.VITE_TCG_API_URL;

async function convertToJson(res) {
  const jsonResponse = await res.json();

  if (res.ok) {
    return jsonResponse
  } else {
    throw { name: "servicesError", message: jsonResponse };
  }
}

function processData(data) {
  const processed = data
    .filter(card => card.name !== "Unown") // Skip those with Unown as the name
    .filter(card => card.image && card.image !== "") // Also skip those with no image.
    .map(card => ({
      id: card.id,
      name: card.name,
      // image: card.image ? `${card.image}/low.webp` : "/images/basic/no-image.png", // If they don't have an image, get the image from the basic images
    }));

  return processed;
}

export default class ExternalTCGServices {

  async getCardsList() {

    const url = `${baseURL}`;

    const response = await fetch(url);

    const data = await convertToJson(response);
    // console.log(data)
    const processed = processData(data);
    // console.log(processed)

    return processed;
  }


  async findCardById(id) {

    const response = await fetch(`${baseURL}/${id}`);
    const data = await convertToJson(response);
    // console.log(data);+


    const details = {
      id: data.id,
      name: data.name,

      image: data.image ? `${data.image}/low.webp` : "/images/basic/no-image.png", // If they don't have an image, get the image from the basic images

      rarity: data.rarity || "Not available yet",

      variants: data.variants_detailed.map((v) => v.type),
      hp: data.hp || "Not available yet",

      types: (data.types?.length
        ? data.types.map((t) => t)
        : ["Not available yet"]
      ),

      weaknesses: (data.weaknesses?.length
        ? data.weaknesses.map((w) => w.type)
        : ["Not available yet"]),
      
      attacks: (data.attacks?.length
        ? data.attacks.map((at) => ({
          cost: at.cost ? getCost(at.cost) : "Not available yet",
          name: at.name || "Not available yet",
          effect: at.effect || "Not available yet",
        }))
        : [{
          cost: "Not available yet",
          name: "Not available yet",
          effect: "Not available yet",
        }]
      ),

      category: data.category || "Not available yet",
    };
    console.log(details)

    return details;
  }

  async findCurrentPriceEU(id) {
    const response = await fetch(`${baseURL}/${id}`);
    const results = await convertToJson(response);
    // console.log(results.Result);

    const data = results.Result

    const details = {
      price: data.pricing.cardmarket.avg,
      date: formatDate(data.pricing.cardmarket.updated),
    };
    // console.log(details)

    return details;
  }

}

function formatDate(dateString) {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");

  const months = [
    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DIC"
  ];

  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function getCost(cost) {
  const costCount = {};  // Declarar aquí

  cost.forEach((c) => {
    costCount[c] = (costCount[c] || 0) + 1;
  });

  return costCount;
}