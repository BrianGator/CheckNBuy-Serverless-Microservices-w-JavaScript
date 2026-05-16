// Written by Brian McCarthy
import express from "express";
import path from "path";
import fs from "fs";
import cors from "cors";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cors());

  // Data Loading
  const productsData = JSON.parse(fs.readFileSync(path.join(process.cwd(), "products.json"), "utf8"));
  let products = productsData.products;

  const dealersData = JSON.parse(fs.readFileSync(path.join(process.cwd(), "dealers.json"), "utf8"));
  let dealers = dealersData.dealers;

  // --- Product Details Microservice (/api/products) ---
  
  // Define the route for getting all products
  app.get("/api/products", (req, res) => {
    res.json(products);
  });

  // Define the route for getting a single product by name
  app.get("/api/products/:product_name", (req, res) => {
    const productName = req.params.product_name;
    const product = products.find((p) => p.product === productName);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  });

  // Define the route for adding a new product
  app.post("/api/products", (req, res) => {
    const newProduct = req.body;
    products.push(newProduct);
    res.status(201).json(newProduct);
  });

  // --- Dealer Pricing Microservice (/api/dealer) ---

  app.get("/api/price/:dealer/:product", (request, response) => {
    let req_dealer = request.params.dealer;
    let req_product = request.params.product;
    let resp = false;

    dealers.forEach((dealer) => {
      if (dealer.Dealer === req_dealer) {
        if (dealer.products[req_product]) {
          response.send({
            message: req_product + " costs " + dealer.products[req_product] + " at " + req_dealer,
          });
          resp = true;
        } else {
          response.send({
            message: req_product + " is not available with " + req_dealer,
          });
          resp = true;
        }
      }
    });

    if (!resp) {
      response.send({ message: "The product is not available with this dealer" });
    }
  });

  app.get("/api/allprice/:product", (request, response) => {
    let req_product = request.params.product;
    let priceslist = [];

    dealers.forEach((dealer) => {
      if (dealer.products[req_product]) {
        priceslist.push({ key: dealer.Dealer, value: dealer.products[req_product] });
      }
    });

    if (priceslist.length > 0) {
      response.send({ prices: priceslist });
    } else {
      response.send({ message: "The product is not available with any dealer for this product" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
