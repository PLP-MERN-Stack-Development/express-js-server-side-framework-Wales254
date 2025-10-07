import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";
import { NotFoundError, ValidationError } from "./utils/errors.js";
import catchAsync from "./utils/catchAsync.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// ✅ Custom Logger Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ✅ Authentication Middleware
const authenticate = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (apiKey !== "12345") {
    return res.status(401).json({ message: "Unauthorized: Invalid API key" });
  }
  next();
};
if (apiKey !== process.env.API_KEY) {
  return res.status(401).json({ message: "Unauthorized: Invalid API key" });
}


// ✅ Validation Middleware
const validateProduct = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;
  if (!name || !description || !price || !category || inStock === undefined) {
    return next(new ValidationError("All product fields are required"));
  }
  next();
};

// In-memory products array
let products = [];

// Routes
app.get("/", (req, res) => {
  res.send("Hello World from Express API");
});

// ✅ Get all products with filtering, search, and pagination
app.get("/api/products", catchAsync(async (req, res, next) => {
  let filteredProducts = [...products];

  // Filter by category
  if (req.query.category) {
    filteredProducts = filteredProducts.filter(
      (p) => p.category.toLowerCase() === req.query.category.toLowerCase()
    );
  }

  // Search by name
  if (req.query.search) {
    const searchTerm = req.query.search.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (p) => p.name.toLowerCase().includes(searchTerm)
    );
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  res.json({
    status: "success",
    results: paginatedProducts.length,
    total: filteredProducts.length,
    page,
    limit,
    data: paginatedProducts,
  });
}));

// Get a product by ID
app.get("/api/products/:id", catchAsync(async (req, res, next) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return next(new NotFoundError("Product not found"));
  res.json(product);
}));

// Create a new product (✅ Protected + Validated)
app.post("/api/products", authenticate, validateProduct, catchAsync(async (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;
  const newProduct = {
    id: uuidv4(),
    name,
    description,
    price,
    category,
    inStock,
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
}));

// Update a product (✅ Protected + Validated)
app.put("/api/products/:id", authenticate, validateProduct, catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const product = products.find((p) => p.id === id);
  if (!product) return next(new NotFoundError("Product not found"));

  const { name, description, price, category, inStock } = req.body;
  product.name = name ?? product.name;
  product.description = description ?? product.description;
  product.price = price ?? product.price;
  product.category = category ?? product.category;
  product.inStock = inStock ?? product.inStock;

  res.json(product);
}));

// Delete a product (✅ Protected)
app.delete("/api/products/:id", authenticate, catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return next(new NotFoundError("Product not found"));
  products.splice(index, 1);
  res.json({ message: "Product deleted successfully" });
}));

// ✅ Product statistics: count by category
app.get("/api/products/stats", catchAsync(async (req, res, next) => {
  const stats = {};
  products.forEach((p) => {
    const category = p.category || "Uncategorized";
    stats[category] = (stats[category] || 0) + 1;
  });
  res.json({
    status: "success",
    totalCategories: Object.keys(stats).length,
    data: stats
  });
}));

// ✅ Handle unhandled routes
app.all(/.*/, (req, res, next) => {
  next(new NotFoundError(`Cannot find ${req.originalUrl} on this server`));
});



// ✅ Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    message: err.message || "Internal Server Error",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
