const axios = require("axios");
const cheerio = require("cheerio");

async function obtenerDescripcion(link) {

    const { data } = await axios.get(link);

    const $ = cheerio.load(data);

    const descripcion = $("#product-description")
         .text()
    .replace(/\s+/g, " ")
    .trim();
    return descripcion;
}

module.exports = obtenerDescripcion;