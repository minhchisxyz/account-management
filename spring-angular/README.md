# Spring Angular Version

This version uses Spring Boot for the backend and Angular for the frontend.

## Setup

### Backend (Spring Boot)

1. Navigate to `konto-verwaltung` folder.
2. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```
   Or open the project in your IDE and run the main application class.

### Frontend (Angular)

1. Navigate to `konto-verwaltung-ui` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
   Navigate to `http://localhost:4200/`.

## API URLs

The backend typically runs on `http://localhost:8080`.
- `/api/transactions`: Manage transactions
- `/api/rates`: Get exchange rates

