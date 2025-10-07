Week 2 – Express.js Server-Side Framework Assignment

Author: Sydney Wesonga Walusala

📘 Overview

This project demonstrates how to build a simple RESTful API using Express.js, implementing CRUD (Create, Read, Update, Delete) operations for managing products.
It also includes filtering, searching, pagination, and category statistics to enhance data access.
Proper routing, middleware setup, and global error handling have been implemented.

⚙️ Setup Instructions
1️⃣ Clone the Repository
git clone https://github.com/PLP-MERN-Stack-Development/express-js-server-side-framework-Wales254.git
cd express-js-server-side-framework-Wales254

2️⃣ Initialize and Install Dependencies
npm init -y
npm install express body-parser uuid dotenv

3️⃣ Start the Server
npm start


The API will run on:
👉 http://localhost:3000

🚀 API Endpoints
1️⃣ GET /

Returns a welcome message.
Example:

GET http://localhost:3000/

2️⃣ GET /api/products

Returns all available products, with support for:

Filtering by category
Searching by product name
Pagination

Example:

GET http://localhost:3000/api/products?category=Electronics&search=laptop&page=1&limit=5


Response Example:

{
  "status": "success",
  "results": 5,
  "total": 20,
  "page": 1,
  "limit": 5,
  "data": [
    {
      "id": "auto-generated-uuid",
      "name": "Laptop",
      "description": "High-performance laptop for professionals",
      "price": 1200,
      "category": "Electronics",
      "inStock": true
    }
  ]
}

3️⃣ POST /api/products

Adds a new product to the list.
Example:

POST http://localhost:3000/api/products


Request Body (JSON):

{
  "name": "Laptop",
  "description": "High-performance laptop for professionals",
  "price": 1200,
  "category": "Electronics",
  "inStock": true
}


Response:

{
  "id": "auto-generated-uuid",
  "name": "Laptop",
  "description": "High-performance laptop for professionals",
  "price": 1200,
  "category": "Electronics",
  "inStock": true
}

4️⃣ PUT /api/products/:id

Updates an existing product by ID.
Example:

PUT http://localhost:3000/api/products/<id>


Request Body (JSON):

{
  "price": 950,
  "inStock": false
}

5️⃣ DELETE /api/products/:id

Deletes a product by ID.
Example:

DELETE http://localhost:3000/api/products/<id>


Response:

{ "message": "Product deleted successfully" }

6️⃣ GET /api/products/stats

Displays product statistics grouped by category.
Example:

GET http://localhost:3000/api/products/stats


Response Example:

{
  "Electronics": 5,
  "Furniture": 3,
  "Clothing": 7
}

🧩 Features Implemented

✅ Express.js routing
✅ Body-parser middleware
✅ Unique ID generation using UUID
✅ In-memory product storage
✅ Full CRUD functionality
✅ Filtering, searching, and pagination
✅ Product statistics per category
✅ Authentication using x-api-key
✅ Centralized error handling

⚙️ Environment Variables

Create a .env file in your project root and add:

PORT=3000
API_SECRET_KEY=12345


Then run:

npm start