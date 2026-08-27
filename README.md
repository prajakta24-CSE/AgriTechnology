# 🌾 Agri-Tech: Smart Farming & Precision Agricultural Management Platform

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-green.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20v8.3-brightgreen.svg)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Backend-Express.js%204.21-lightgrey.svg)](https://expressjs.com/)
[![React.js](https://img.shields.io/badge/Frontend-React%2018.3-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Runtime-Node.js%20v24.19-green.svg)](https://nodejs.org/)
[![Bootstrap](https://img.shields.io/badge/UI-Bootstrap%205.3-purple.svg)](https://getbootstrap.com/)
[![Multilingual](https://img.shields.io/badge/Languages-5%20Supported-orange.svg)](#multilingual-support)

---

## 👨‍🏫 Academic & Mentor Information
- **Project Mentor:** Syed Abul Arshad
- **Mentor Email:** `arshad+mentor@thesmartbridge.com`
- **Total Epics:** 6 Epics
- **Total Subtasks:** 19 Tasks

---

## 🌟 Overview & Key Features

Agri-Tech is a smart, scalable, full-stack precision farming ecosystem built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). It bridges the gap between traditional agricultural practices and modern data-driven farming.

### Core Modules:
1. **🌱 Farm & Land Profiling:** Multi-plot acreage management, soil classification, geolocation coordinates, and irrigation tracking.
2. **🌾 Crop Lifecycle Intelligence:** Real-time growth stage stepper (`Sowing` ➔ `Germination` ➔ `Vegetative` ➔ `Flowering` ➔ `Harvesting`), harvest yield forecasting, and activity logging.
3. **🧪 Soil Health & NPK Analyzer:** Interactive N-P-K & pH slider simulator, Soil Quality Index (0-100), Chart.js Radar visualization, and tailored fertilizer & crop suitability recommendations.
4. **⛅ Weather Forecasting & Pest Early Warning:** Live Open-Meteo meteorological radar, 7-day agricultural weather forecast, foliar spraying suitability index, and pest outbreak remedies (Pink Bollworm, Fall Armyworm, Rice Blast).
5. **🛒 Certified Agri-Marketplace & Orders:** Catalog of certified seeds, organic compost, bio-pesticides, and IoT sensors with cart management, multi-payment checkout, and step-by-step order delivery tracking.
6. **💬 Expert Consultation & Community Forums:** Ask agricultural scientists questions with symptoms, receive verified expert solutions, and upvote peer farmer solutions.
7. **🛡️ Role-Based Security & Admin Control Center:** JWT & bcrypt authentication, 1-click evaluation demo logins, user oversight, inventory control, and emergency alert broadcasting.
8. **🌐 Multilingual Support:** Native language switching between **English**, **Hindi (हिन्दी)**, **Telugu (తెలుగు)**, **Tamil (தமிழ்)**, and **Marathi (मराठी)**.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v16+) & **npm**
- **MongoDB** running locally on `mongodb://127.0.0.1:27017/agritech` or MongoDB Atlas URI

### 2. Backend Setup
```bash
cd backend
npm install
npm run seed     # Seeds database with demo users, farms, crops, soil tests, and products
npm start        # Starts Express server on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start        # Starts React frontend on http://localhost:3000
```

---

## 🔑 Demo Credentials (1-Click Login Available)

| Role | Email | Password | Features Accessible |
| :--- | :--- | :--- | :--- |
| **🌾 Farmer (Demo)** | `farmer@agritech.com` | `password123` | Farm Dashboard, Crop Tracker, Soil Lab, Weather Radar, Marketplace, Orders, Forum |
| **🛡️ Admin (Demo)** | `admin@agritech.com` | `password123` | System Analytics, User Administration, Inventory Manager, Pest Alert Broadcaster |
| **🔬 Expert (Demo)** | `expert@agritech.com` | `password123` | Verified Expert Forum Answers, Agronomic Pest Advisories |

---

## 📁 Repository Structure
```
AgriTech/
├── backend/
│   ├── config/          # MongoDB database connection
│   ├── controllers/     # Express API business logic controllers
│   ├── middleware/      # JWT auth guard & centralized error handler
│   ├── models/          # Mongoose data schemas (User, Farm, Crop, Soil, etc.)
│   ├── routes/          # REST API endpoints
│   ├── seeders/         # Comprehensive initial data population script
│   ├── .env             # Environment variables
│   ├── package.json
│   └── server.js        # Express server entry point
├── frontend/
│   ├── public/          # HTML5 entry & agricultural meta assets
│   ├── src/
│   │   ├── components/  # Navbar, Footer, SoilRadarChart, ProtectedRoute
│   │   ├── context/     # AuthContext, LanguageContext, CartContext
│   │   ├── i18n/        # en.json, hi.json, te.json, ta.json, mr.json
│   │   ├── pages/       # Home, Dashboard, Farms, Crops, SoilHealth, etc.
│   │   ├── services/    # Axios API client
│   │   ├── App.js       # React Router layout
│   │   ├── index.css    # Modern agricultural design system
│   │   └── index.js
│   └── package.json
└── README.md
```
