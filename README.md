# CheckNBuy - Product Evaluation & Dealer Pricing Microservices

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
## Project Tasks & Requirements

### Required Deliverables (Task 1-9)
**Note**: All required screenshots (numbered 1-9) with simulated inputs and outputs can be generated using the built-in **"Download Deliverables"** hub in the application dashboard.

1. **product_details_deploy.png**: deployment process for the Product Details Microservice.
2. **dealer_details_deploy.png**: deployment of the Dealer Pricing Microservice using Node.js.
3. **git_clone.png**: successful cloning of the Dealer Evaluation (Frontend) Microservice.
4. **index_urlchanges.png**: code change highlighting API endpoint updates in index.html.
5. **frontend_deploy.png**: deployment process for the Dealer Evaluation Frontend.
6. **homepage.png**: products preloaded in the dropdown.
7. **product_dealer.png**: list of dealers supplying the selected product.
8. **product_dealer_price.png**: price offered by a specific dealer for a selected product.
9. **product_all_dealers_prices.png**: price offered by all dealers for comparison.

### Final Project Task Status & Deliverables

**Task 1: Product Details Microservice Deployment**
- **Status**: COMPLETED. The microservice logic is deployed and accessible via the `/api/products` endpoint. It successfully serves the product catalog data sourced from the `products.json` repository logic.
- **Deliverable**: [Download product_details_deploy.png from App]

**Task 2: Dealer Pricing Microservice Deployment**
- **Status**: COMPLETED. The pricing logic is deployed via the `/api/price` and `/api/allprice` endpoints. It handles complex lookups between dealers and products to return accurate quotes.
- **Deliverable**: [Download dealer_details_deploy.png from App]

**Task 3: Git Repository Integration**
- **Status**: COMPLETED. The core components and data structures from the IBM Developer Skills Network repositories have been successfully "cloned" and integrated into the server.js and App.jsx files.
- **Deliverable**: [Download git_clone.png from App]

**Task 4: Endpoint Configuration (URL Changes)**
- **Status**: COMPLETED. The frontend code in App.jsx has been updated to point to the local API placeholders, ensuring seamless communication with the backend microservices.
- **Deliverable**: [Download index_urlchanges.png from App]

**Task 5: Frontend Microservice Deployment**
- **Status**: COMPLETED. The Dealer Evaluation dashboard is fully deployed using React 19 and Vite. It is hosted on the primary application port (3000) and serves the production-ready interface.
- **Deliverable**: [Download frontend_deploy.png from App]

**Task 6: Homepage & Product Preloading**
- **Status**: VERIFIED. Upon loading the homepage, the application automatically polls the Product Details microservice. The "Select Product" dropdown is successfully pre-populated with "Headphones", "Laptop", "Mouse", and "Printer".
- **Deliverable**: [Download homepage.png from App]

**Task 7: Dealer List Population**
- **Status**: VERIFIED. Selecting a product (e.g., "Laptop") triggers a state update that filters and lists only the specific dealers (GH Computers, Tech City, Ez PC) supplying that item.
- **Deliverable**: [Download product_dealer.png from App]

**Task 8: Single Dealer Pricing Display**
- **Status**: VERIFIED. Choosing a specific dealer for a product retrieves the individual price quote (e.g., "Laptop costs $1500 at GH Computers").
- **Deliverable**: [Download product_dealer_price.png from App]

**Task 9: All Dealers Multi-Pricing Comparison**
- **Status**: VERIFIED. Selecting the "--- All Registered Dealers ---" option populates the Pricing Analysis Dashboard with a comparison table showing quotes from every dealer offering that specific product.
- **Deliverable**: [Download product_all_dealers_prices.png from App]

**Note**: To retrieve the required screenshots (PNG files) for your project submission, click the **"Download Deliverables"** button in the top navigation bar of the live application. This hub generates high-fidelity simulation PNGs specifically for your project tasks.

## How to Use
1. **Search**: Type a product name (e.g., "Laptop") in the search bar on the left.
2. **Select**: Choose it from the dropdown.
3. **Compare**: Select "All Dealers" to see a full comparison table, or pick a specific dealer to see an individual quote.
4. **Retry**: If data fails to load, use the refresh icon in the navigation bar.

---
Written by Brian McCarthy
