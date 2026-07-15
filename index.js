const axios = require("axios");
const cheerio = require("cheerio");
const obtenerDescripcion = require("./detalleProducto");


function esperar(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function main() {

    const productos = [];


    for (let page = 1 ; ; page++) {


        console.log(`Página ${page}`);


        const { data } = await axios.get(
            `https://www.rubricomayorista.com.ar/productos/page/${page}/?results_only=true&limit=12&theme=amazonas`
        );


        const $ = cheerio.load(data.html);


        const cantidad = $(".js-item-product").length;


        if (cantidad === 0) {
            break;
        }



        const items = $(".js-item-product");



        for (let i = 0; i < items.length; i++) {


            const el = items[i];


            const variantes = JSON.parse(
                $(el).find("[data-variants]").attr("data-variants")
            );


            const variante = variantes[0];


            const link = $(el)
                .find(".item-link")
                .attr("href");



            const descripcion = await obtenerDescripcion(link);


            await esperar(1500);



            // IMAGEN

            const img = $(el).find("img");


            const imagenes =
                img.attr("data-srcset") ||
                img.attr("srcset") ||
                img.attr("data-src") ||
                img.attr("src");



            const imagen = imagenes
                ? imagenes.split(",").pop().trim().split(" ")[0]
                : null;



            // PRECIOS

            const costoPublicado = variante.price_number;


            const costoTransferencia = Number(
                variante.price_with_payment_discount_short
                    .replace("$", "")
                    .replace(/\./g, "")
                    .replace(",", ".")
            );
const margen = 1.35;

const precioVenta =
    Math.ceil(costoTransferencia * margen / 100) * 100;


            // PRODUCTO FINAL

            productos.push({

                nombre: $(el)
                    .find(".item-link")
                    .attr("title"),

                link,

                imagen,


                costoPublicado,

                costoTransferencia,


                precioVenta: precioVenta,


                stock: variante.stock,


                disponible: variante.available,


                descripcion

            });


        }


    }


    console.log(productos);

}


main();