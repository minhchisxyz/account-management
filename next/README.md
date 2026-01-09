# Next.js Fullstack Application

This is the main Next.js fullstack application for Account Management. It provides a web interface for managing transactions and currency exchange rates, and also serves as the backend API for the Flutter Mobile application.

## Features

*   **Web Interface:** Complete UI for adding, viewing, editing, and removing transactions.
*   **AI Transaction Extraction:** Uses Google Gemini models to extract transaction details from text.
*   **Currency Exchange Rates:** Real-time exchange rate tracking between EUR and VND.
*   **Mobile API:** backend services for the paired Flutter mobile app.

## Setup

1.  **Navigate to the directory:**
    ```bash
    cd next-backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root of the `next-backend` directory and add the following entries:

    ```env
    VCB_URL="https://www.vietcombank.com.vn/api/exchangerates?date="
    DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
    GEMINI_API_KEY="your_gemini_api_key_here"
    USER_NAME="your_username"
    PASSWORD="your_password"
    ```

4.  **Start the server:**
    ```bash
    npm run dev
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

