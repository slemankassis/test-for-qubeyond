# JokeHub - A TypeScript-Powered Joke API Explorer

This project consists of:

1. A TypeScript-converted Joke API (backend)
2. A React TypeScript frontend for exploring and rating jokes

## Backend: TypeScript-Converted Joke API

- Full TypeScript type definitions
- Improved code organization
- Better error handling
- PostgreSQL database integration option

### API Endpoints

- `GET /random_joke` - Get a random joke
- `GET /random_ten` - Get 10 random jokes
- `GET /jokes/random/:num` - Get a specified number of random jokes
- `GET /jokes/:type/random` - Get a random joke of specific type
- `GET /jokes/:id` - Get a joke by ID
- `GET /types` - Get all joke types

## Frontend: React Joke Explorer

Features:

- Dark/light mode toggle
- Pagination for browsing jokes
- Filtering by joke type
- Sorting by setup text, type, or rating
- Rating system for jokes
- Interactive UI with reveal/hide punchline

## Running the Project

1. Start the backend:

   ```bash
   cd official_joke_api-master
   npm install
   npm run build
   npm start
   ```

2. Start the frontend:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. Access the application at http://localhost:3000
