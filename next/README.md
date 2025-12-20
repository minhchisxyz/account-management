# Next.js Fullstack Version

This folder contains the standalone full-stack implementation of the Account Management application using Next.js.

## Setup

1.  **Navigate to the directory:**
    ```bash
    cd next
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root of the `next` directory with the following content:

    ```dotenv
    DATABASE_URL="postgres://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
    VCB_URL="https://www.vietcombank.com.vn/api/exchangerates?date="
    ```

4.  **Database Setup:**
    Generate the Prisma client:
    ```bash
    npx prisma generate
    ```
    (This should run automatically after `npm install` due to the `postinstall` script).

## Running the Application

### Development

To run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Production

To build and start for production:

```bash
npm run build
npm start
```

## Features

*   Real-time currency exchange rates (EUR/VND)
*   Transaction management (Add, View, Edit, Remove)
*   Full-stack architecture with Next.js App Router
*   Prisma ORM with PostgreSQL

