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
      .filter(card => card.name !== "Unown")       // Skip those with Unown as the name
      .map(card => ({
        id: card.id,
        name: card.name,
        image: card.image ? `${card.image}/low.webp` : "/images/basic/no-image.png" // If they don't have an image, get the image from the basic images
      }));

    return processed;
  }

export default class ExternalTCGServices {

  async getData(name) {

    const safeName = encodeURIComponent(name);

    const url = `${baseURL}?name=${safeName}`;

    const response = await fetch(url);

    const data = await convertToJson(response);

    const processed = processData(data);

    console.log(processed)

    return processed;
  }

  async getStartData() {

    const url = `${baseURL}`;

    const response = await fetch(url);

    const data = await convertToJson(response);

    const processed = processData(data);

    console.log(processed)

    return processed;
  }

  async 


  // Obtener carta por ID
  async findCardById(id) {
    const response = await fetch(`${baseURL}/${id}`);
    const data = await convertToJson(response);
    console.log(data.Result);
    return data.Result;
  }
}
