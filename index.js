const axios= require('axios');
const cheerio = require("cheerio");

async function main(){
    console.log("Iniciando escraping de productos...");
    try{
        const response = await axios.get('https://www.rubricomayorista.com.ar/productos');
        console.log(response.status);
        //  console.log(typeof response);
//console.log(Object.keys(response));
//console.dir(response, { depth: 1 });
//console.log(response.data.substring(0,500));

//console.log(response.data.includes("Cargar más"));
//console.log(response.data.includes("load"));
//console.log(response.data.includes("pagination"));
//console.log(response.data.includes("page"));


      const $ = cheerio.load(response.data);
console.log("Cantidad de productos:", $(".item-description").length);

$(".item-description").each((i, el) => {
    console.log(
        i + 1,
        $(el).find(".item-link").attr("title")
    );
});
        console.log("HTML cargado correctamente");
 console.log($(".item-description").length);
    }catch(error){
        console.error('Error:', error.message);
    }
}

main();