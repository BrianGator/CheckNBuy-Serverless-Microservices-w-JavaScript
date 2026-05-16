# CheckNBuy - Product Evaluation & Dealer Pricing Microservices

Written by Brian McCarthy

## Overview
CheckNBuy is a robust product comparison application built with a microservices architecture. It allows users to search for products, evaluate distribution dealers, and compare live pricing data fetched from distributed backend services.

## Technologies Used
- **Frontend**: React 19, Tailwind CSS 4, Motion (Animations), Lucide React (Icons)
- **Backend**: Node.js, Express.js
- **Build System**: Vite, esbuild
- **Data Storage**: JSON-based flat files representing microservice databases

## Microservices Logic
The application simulates three distinct microservices running within a single server for logic cohesion:
1. **Product Details Microservice**: Manages product categories and associated registered dealers.
2. **Dealer Pricing Microservice**: Retrieves specific pricing quotes based on dealer-product pairings.
3. **Frontend / UI Microservice**: Provides a professional dashboard for data analysis and search.

## Features
- **Search & Filter**: Real-time product filtering with a 400ms debounce mechanism.
- **Price Comparison**: Simultaneous fetching of prices from all registered dealers for a specific item.
- **Error Handling**: Graceful degradation with user-friendly error messages if backend endpoints are unreachable.
- **Responsive Design**: Professional UI optimized for both desktop and mobile viewing.

## Requirements & Task Status
### Final Project Task Status

**Task 1: Product Details Microservice Deployment**
- **Status**: COMPLETED. The microservice logic is deployed and accessible via the `/api/products` endpoint. It successfully serves the product catalog data sourced from the `products.json` repository logic.

**Task 2: Dealer Pricing Microservice Deployment**
- **Status**: COMPLETED. The pricing logic is deployed via the `/api/price` and `/api/allprice` endpoints. It handles complex lookups between dealers and products to return accurate quotes.

**Task 3: Git Repository Integration**
- **Status**: COMPLETED. The core components and data structures from the IBM Developer Skills Network repositories have been successfully integrated into the `server.js` and `App.jsx` files.

**Task 4: Endpoint Configuration (URL Changes)**
- **Status**: COMPLETED. The frontend code in `App.jsx` has been updated to point to the local API placeholders, ensuring seamless communication with the backend microservices.

**Task 5: Frontend Microservice Deployment**
- **Status**: COMPLETED. The Dealer Evaluation dashboard is fully deployed using React 19 and Vite. It is hosted on the primary application port (3000) and serves the production-ready interface.

**Task 6: Homepage & Product Preloading**
- **Status**: VERIFIED. Upon loading the homepage, the application automatically polls the Product Details microservice. The "Select Product" dropdown is successfully pre-populated with "Headphones", "Laptop", "Mouse", and "Printer".

**Task 7: Dealer List Population**
- **Status**: VERIFIED. Selecting a product (e.g., "Laptop") triggers a state update that filters and lists only the specific dealers (GH Computers, Tech City, Ez PC) supplying that item.

**Task 8: Single Dealer Pricing Display**
- **Status**: VERIFIED. Choosing a specific dealer for a product retrieves the individual price quote (e.g., "Laptop costs $1500 at GH Computers").

**Task 9: All Dealers Multi-Pricing Comparison**
- **Status**: VERIFIED. Selecting the "--- All Registered Dealers ---" option populates the Pricing Analysis Dashboard with a comparison table showing quotes from every dealer offering that specific product.

## How to Use
1. **Search**: Type a product name (e.g., "Laptop") in the search bar on the left.
2. **Select**: Choose it from the dropdown.
3. **Compare**: Select "All Dealers" to see a full comparison table, or pick a specific dealer to see an individual quote.
4. **Retry**: If data fails to load, use the refresh icon in the navigation bar.

---
Written by Brian McCarthy
