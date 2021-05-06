import * as d3 from "d3";
import municipios from "./municipalities_pop.geojson";

// 01 viewport
const w = 1300;
const h = 600;

// 02 creación de SVG dentro del div id=map
const svg = d3
  .select("div#map")
  .append("svg")
  .attr("width", w)
  .attr("height", h)

// 03 proyección

const projection = d3
  .geoMercator()
  .scale(7800)
  .center([-4.64447021484375, 37.21720611325497])
  .translate([w / 2, h / 2]);

// 04 geopath usando la proyección
const geopath = d3.geoPath(projection);

// 05 geojon a constiable
const muni = d3.json(municipios);
// const provinces_topo = d3.json(provincias_topo);

// 07 escalas

// Usaremos el método de rupturas naturales creado por el cartógrafo George F. Jenks.
// En esta clasificación las clases se crean de manera que los valores
// similares se agrupan mejor y se maximizan las diferencias entre las clases.
// Las rupturas marcan diferencias considerables entre los valores de los datos.

const color_threshold = d3
  .scaleThreshold()
  .domain([10000, 25000, 50000, 100000, 150000, 300000, 700000])
  .range(d3.schemeBlues[7]);

// 06 carga de datos con promesa

muni.then((data) => {
  svg
    .append("g")
    .attr("class", "map_group")
    .selectAll("path")
    .data(data.features)
    .join("path")
    .attr("d", geopath)
    .attr("fill", (d) => color_threshold(d.properties.padron))
    // 08 Estilo en CSS
    .attr("class", "municipality")
    //09 Título
    .append("title")
    .text((d) => {
      let name = d.properties.municipio;
      let pop = d.properties.padron;
      return `${name} ${pop} hab.`;
    });
});

// 09 leyenda

// Posición y tamaño.
const legend_x = 100;
const legend_y = 145;
const size_rec = 15;

// 10 Título de leyenda
svg
  .append("text")
  .attr("x", legend_x)
  .attr("y", legend_y)
  .text("Habitantes")
  .style("alignment-baseline", "middle")
  .attr("class", "legend_text");

// Items de leyenda
const lengend_keys = [
  "<10M",
  "10M -25M",
  "25M - 50M",
  "50M - 100M",
  "100M - 150M",
  "150M - 300M",
  ">300M",
];
// Escala ordinal para colores según valores
const color_legend = d3
  .scaleOrdinal()
  .domain(lengend_keys)
  .range(d3.schemeBlues[7]);

// 11 Rectángulos
svg
  .append("g")
  .selectAll("legend_items")
  .data(lengend_keys)
  .enter()
  .append("rect")
  .attr("x", legend_x)
  .attr("y", function (d, i) {
    return legend_y + 20 + i * (size_rec + 5);
  })
  .attr("width", size_rec)
  .attr("height", size_rec)
  .style("fill", function (d) {
    return color_legend(d);
  });

// 12 textos items
svg
  .selectAll("labels")
  .data(lengend_keys)
  .enter()
  .append("text")
  .attr("class", "legend_text")
  .attr("x", legend_x + size_rec * 1.5)
  .attr("y", function (d, i) {
    return legend_y + 20 + i * (size_rec + 5) + size_rec / 2;
  })
  .text(function (d) {
    return d;
  })
  .style("alignment-baseline", "middle");
