const axios = require("axios");
const cheerio = require("cheerio");

async function main() {

    const productos = [];

    for (let page = 1 ; ; page++) {

        console.log(`Página ${page}`);

        const { data } = await axios.get(
            `https://www.rubricomayorista.com.ar/productos/page/${page}/?results_only=true&limit=12&theme=amazonas`
        );

//console.log(typeof data);era un objeto, no html, ademas tiene has _next :true/false.//console.log(data);
        const $ = cheerio.load(data.html);
const cantidad = $(".js-item-product").length;

if (cantidad === 0) {
    break;
}
        $(".js-item-product").each((i, el) => {

const variantes = JSON.parse(
    $(el).find("[data-variants]").attr("data-variants")
);



console.log($(el).find("[data-variants]").attr("data-variants"));
console.dir(variantes[0])

const img = $(el).find("img");

const imagenes =
    img.attr("data-srcset") ||
    img.attr("srcset") ||
    img.attr("data-src") ||
    img.attr("src");

const imagen = imagenes
    ? imagenes.split(",").pop().trim().split(" ")[0]
    : null;
const variante = variantes[0];

const precio = variante.price_number;
const stock = variante.stock;
const disponible = variante.available;

const transferencia = Number(
    variante.price_with_payment_discount_short
        .replace("$", "")
        .replace(/\./g, "")
        .replace(",", ".")
);

     productos.push({

    nombre: $(el).find(".item-link").attr("title"),

    link: $(el).find(".item-link").attr("href"),

    imagen,

    precioCosto: precio,

    miCostoReal: transferencia,

    precioVenta: precio * 1.5,

    stock,

    disponible

});

        });

    }

    console.log(productos);
    
}

main();