# Investee Management

A comprehensive platform for managing investees, their associated deals, and key data efficiently. The app provides a detailed overview of companies, tracks associated deals, and enables quick updates with a sleek, user-friendly interface. Designed to handle large datasets with features like pagination, search, and real-time editing capabilities, it’s a robust solution for streamlining investment management workflows.



## Features

- Displays a list of companies with associated deals.
- Provides a seamless editing experience for companies and deals.
- Handles large datasets efficiently with pagination.
- Built-in API documentation for quick reference.


## Tech Stack

### **Frontend**  
- **Framework**: [Next.js](https://nextjs.org/)  

### **Backend**  
- **Framework**: [NestJS](https://nestjs.com/)  
- **Database**: PostgreSQL  

## Run Locally

### **Backend Setup**  
1. Navigate to the backend directory:  
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Configure the database:
    - Copy and paste the `.env.example` file as `.env`.
    - Set up the database connection details in `.env`.
4. Start the backend in development mode:
   ```bash
   pnpm start:dev
   ```
5. Seed the Database
To populate the database:

- Use POST /companies and POST /deals endpoints to add sample data.
- API documentation is available at
    http://localhost:8000/docs

### **Frontend Setup**  
1. Start the backend as mentioned above.
2. Navigate to the frontend directory:  
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Start the frontend in development mode:
   ```bash
   pnpm dev
   ```
5. Open the app in your browser:

    http://localhost:3000

## Database Model
- Companies Table:
    Stores company data.
- Deals Table:
    Stores deal information.
- Relationship:
    A company can have multiple deals (1:N relationship).
## Demo

### Features Demonstrated:
- List Companies: View all companies and associated deals with pagination.
- Edit Functionality: Easily update company or deal information with real-time API integration.


## Screenshots

![App Screenshot](https://via.placeholder.com/468x300?text=App+Screenshot+Here)

