const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemp");

// Server
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(`${__dirname}/templates/card.html`, "utf-8");
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true); // Corrected to "pathname"

  // Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%", cardsHtml);

    res.end(output);

    // Product page
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    // API
  } else if (pathname === "/api") {
    // SHORT WAY TO GET
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
    // LONG WAY TO GET
    // fs.readFile(`${__dirname}/data/data.json`, "utf-8", (err, data) => {
    //   const productData = JSON.parse(data);
    //   res.writeHead(200, {
    //     "Content-type": "application/json",
    //   });
    //   res.end(data);
    // });

    // Not Found Page
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("404 Page not found");
  }
});

server.listen(3000, "127.0.0.1", () => {
  console.log("Server is running on port 3000");
});
