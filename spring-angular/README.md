# Spring Boot & Angular Version

This folder contains the implementation of the Account Management application using Spring Boot for the backend and Angular for the frontend.

## Project Structure

*   `konto-verwaltung`: Spring Boot Backend Application
*   `konto-verwaltung-ui`: Angular Frontend Application

## Setup & Running

### Backend (Spring Boot)

1.  Navigate to the backend directory:
    ```bash
    cd konto-verwaltung
    ```
2.  Run the application using the Maven wrapper:
    ```bash
    ./mvnw spring-boot:run
    ```
    (On Windows Command Prompt, use `mvnw spring-boot:run`)

The backend server will start on `http://localhost:8080`.

### Frontend (Angular)

1.  Navigate to the frontend directory:
    ```bash
    cd konto-verwaltung-ui
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the application:
    ```bash
    npm start
    ```
    This will start the development server and open the application in your browser at `http://localhost:4200`.

## API Endpoints

The backend exposes the following API endpoints (prefixed with `http://localhost:8080`):

*   **Transactions:** `/app/AccountManagement/api/v1/transactions`
    *   `GET /`: Get all year totals
    *   `POST /`: Create a new transaction
    *   `GET /transactions/{id}`: Get transaction by ID
    *   `PUT /transactions/{id}`: Update transaction
*   **Currency:** `/app/AccountManagement/api/v1/currency`
    *   `GET /today?bank={bank}`: Get today's exchange rate for a specific bank
    *   `GET /`: Get all rates

### API Documentation

Swagger UI documentation should be available at:
`http://localhost:8080/swagger-ui/index.html` (or `/swagger-ui.html`)

## API URLs

*   **Backend API:** `http://localhost:8080/api` (Default Spring Boot port)
*   **Frontend Application:** `http://localhost:4200`
