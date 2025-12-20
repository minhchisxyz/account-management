# Next.js Backend API

This is the backend API server for the Account Management application, specifically designed to work with the Flutter Mobile application.

## Features

*   **AI Transaction Extraction:** Uses Google Gemini models to extract transaction details from text.
*   **Currency Exchange Rates:** Provides exchange rate data.
*   **Transactions Management:** API for managing transactions.

## Setup

1.  **Navigate to the directory:**
    ```bash
    cd next-backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root of the `next-backend` directory with the following content:

    ```dotenv
    VCB_URL="https://www.vietcombank.com.vn/api/exchangerates?date="
    DATABASE_URL="postgres://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
    GEMINI_API_KEY="your_gemini_api_key"
    USER_NAME="your_username"
    PASSWORD="your_password"
    ```

4.  **Run the server:**
    ```bash
    npm run dev
    ```
    The server will start on `http://localhost:3000`.

## API Endpoints

*   `POST /api/ai`: Extract transaction from text.
*   `GET /api/rates`: Get exchange rates.
*   `GET /api/transactions`: Get transactions.

## Relation to Flutter App

This backend serves as the API for the `flutter_mobile` application. Ensure this server is running and accessible (e.g., via local network IP if testing on a physical device) for the mobile app to function correctly.

