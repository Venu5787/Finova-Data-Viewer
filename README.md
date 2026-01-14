# 📊 Finova Data Viewer

Finova Data Viewer is a frontend web application built using **Vite + Vanilla JavaScript**.  
It fetches **live stock market** and **cryptocurrency data**, updates the UI dynamically using **DOM manipulation**, and visualizes price history using **Chart.js**.

---

## 🔧 Tech Stack

- Vite  
- Vanilla JavaScript  
- HTML & CSS (reused from Task 1)  
- Chart.js (used only for charts)  
- Git & GitHub  
- Vercel (deployment)

---

## 🎯 Project Objectives

- Fetch live stock and cryptocurrency data
- Update UI dynamically without page reload
- Show price history using charts
- Handle errors inside the UI
- Deploy the project using Vercel

---

## 🧠 DOM Manipulation in This Project

DOM manipulation is used to update the UI dynamically based on user actions and API responses.

- User input is read without reloading the page
- JavaScript fetches data from APIs
- Stock and crypto prices are injected into the DOM
- Price changes are styled dynamically:
  - Green for positive change
  - Red for negative change
- Charts are updated dynamically using Chart.js
- Errors are displayed inside the UI (no alerts used)

---

## 🔄 Data Flow: User Input → API → UI Update

1. User enters a stock symbol or cryptocurrency name
2. JavaScript reads the input
3. API request is sent using `fetch()`
4. API responds with market data
5. JavaScript processes the data
6. DOM updates price values and charts

### Simple Flow Diagram
User Input → JavaScript → External API → DOM Update → Chart Update


---

## 🏗️ Application Architecture

Client (Browser)
↓
Frontend (HTML + CSS + JavaScript)
↓
External APIs (Stock / Crypto)
↓
UI Update (DOM + Chart.js)


---

## 📸 Screenshots

### Application UI
![Application UI](screenshots/1.png)

### Cryptocurrency Chart
![Cryptocurrency Chart](screenshots/2.png)

### Stock Chart
![Stock Chart](screenshots/3.png)


---

# 📘 Task 2.2: Payment Gateway Architecture Report
---

## 1️⃣ What is a Payment Gateway?

A **payment gateway** is a service that enables online applications to securely process payments by transferring payment information between the customer, merchant, and bank.

### Why Payment Gateways Are Required
- Secure handling of sensitive payment data
- Authorization and verification of transactions
- Fraud prevention
- Compliance with banking standards

### Real-World Example
**Razorpay** – widely used in India for online payments.

---

## 2️⃣ Components Involved

### User / Customer
Initiates the payment by clicking the “Pay Now” button.

### Frontend (Website / Application)
Collects payment details and sends requests to the backend.

### Backend (Server)
Processes payment requests securely and communicates with the payment gateway.

### Payment Gateway
Encrypts and forwards payment information to the bank or card network.

### Bank / Card Network
Approves or rejects the transaction.

---

## 3️⃣ Payment Flow 

1. User clicks “Pay Now”
2. Frontend sends payment request to backend
3. Backend sends request to payment gateway
4. Payment gateway communicates with the bank
5. Bank approves or rejects the payment
6. Payment status is returned to the frontend
7. UI displays success or failure message

---

## 4️⃣ Payment Gateway Architecture

### Why Frontend Alone Cannot Handle Payments
- Frontend code is visible to users
- Exposes sensitive payment details
- Not secure for handling transactions

### Why a Backend Server is Mandatory
- Protects secret API keys
- Handles validation and verification
- Ensures secure payment processing

### Role of APIs
APIs enable secure communication between frontend, backend, payment gateway, and bank.

---

## 5️⃣ Payment Gateway Architecture Diagram
User
↓
Frontend Application
↓
Backend Server
↓
Payment Gateway
↓
Bank / Card Network
↑
Payment Status Response

---

## 6️⃣ Security Concepts

- Payment data must be secured to prevent fraud
- Sensitive information must never be stored on the frontend
- Insecure payment handling can lead to data theft and financial loss

---

## 7️⃣ Relation to This Project

### API Usage in Finova Data Viewer
- Uses APIs to fetch live stock and cryptocurrency data

### API Usage in Payment Gateways
- Uses APIs to securely process payments

### Similarity
Both market data APIs and payment gateway APIs:
- Use request–response communication
- Provide real-time data
- Require secure handling of information

---

## ✅ Conclusion

This project demonstrates the use of **DOM manipulation**, **API integration**, and **data visualization** in a frontend application.  
The payment gateway section provides a conceptual understanding of how secure online payment systems work.

---

## 🚀 Deployment

- Framework Preset: **Vite**
- Build Command: `npm run build`
- Output Directory: `dist`
- Deployed using **Vercel**

---


