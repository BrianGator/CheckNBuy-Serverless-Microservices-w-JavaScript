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

## How to Use
1. **Search**: Type a product name (e.g., "Laptop") in the search bar on the left.
2. **Select**: Choose it from the dropdown.
3. **Compare**: Select "All Dealers" to see a full comparison table, or pick a specific dealer to see an individual quote.
4. **Retry**: If data fails to load, use the refresh icon in the navigation bar.

---
Written by Brian McCarthy
