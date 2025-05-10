# Official Joke API (TypeScript Edition)

A TypeScript-converted and enhanced version of the Official Joke API with PostgreSQL database integration, improved error handling, and comprehensive type definitions.

## API Endpoints

### Get a random joke
- `GET /random_joke`
- `GET /jokes/random`

### Get joke types
- `GET /types`

### Get ten random jokes
- `GET /random_ten`
- `GET /jokes/ten`

### Get any number of random jokes
- `GET /jokes/random/:num`

Example:
* `/jokes/random/5` - Get 5 random jokes
* `/jokes/random/25` - Get 25 random jokes
* `/jokes/random/250` - Get 250 random jokes

### Get jokes by type
- `GET /jokes/:type/random` - Get a random joke of specific type
- `GET /jokes/:type/ten` - Get 10 random jokes of specific type

Example:
* `/jokes/programming/random` - Get a random programming joke
* `/jokes/programming/ten` - Get 10 programming jokes

### Get joke by ID
- `GET /jokes/:id` - Get a joke by ID

### Add a new joke
- `POST /jokes` - Add a new joke

### Update a joke
- `PUT /jokes/:id` - Update a joke by ID

### Rate a joke
- `POST /jokes/:id/rate` - Rate a joke (payload: `{ value: number }`)

## API Tester

A standalone HTML-based API testing tool is included at `frontend/test-api.html`. This tool allows you to:
- Test all API endpoints directly
- Fetch random jokes individually or in batches
- Create, update, and rate jokes with a simple interface
- Useful for quick API testing without setting up the full React app

## Database Setup

⚠️ **IMPORTANT**: Please review the `scripts/setup-db.sh` script before running it.

This script will:
- Uninstall any existing PostgreSQL installation
- Install PostgreSQL 14
- Remove existing data directories at `/opt/homebrew/var/postgresql@14`
- Create a fresh database with jokes schema
- **WARNING**: This will delete any existing PostgreSQL databases on your system

To run the setup script:
```bash
chmod +x ./scripts/setup-db.sh
./scripts/setup-db.sh
```

## VSCode Development Environment

This project includes preconfigured VSCode settings in `.vscode/settings.json` that provide:
- Custom workspace color theme
- [Restore Terminals](https://marketplace.visualstudio.com/items?itemName=EthanSK.restore-terminals) extension settings
- Automatically opens terminal instances for:
  1. Backend development server
  2. Frontend development server
  3. Backend tests in watch mode
  4. Frontend tests in watch mode
  5. Database setup script

To use these settings:
1. Install the Restore Terminals extension in VSCode
2. Open the project in VSCode
3. Use the command palette (Ctrl+Shift+P) and select "Restore Terminals: Restore"

## Key Improvements

The following improvements have been made to the original API:

1. **TypeScript Conversion**:
   - Full TypeScript type definitions for better developer experience
   - Type-safe request and response handling

2. **PostgreSQL Integration**:
   - Added database support with proper connection pooling
   - Maintained backward compatibility with file-based storage

3. **Caching Layer**:
   - Implemented efficient in-memory caching to reduce database load
   - Configurable cache expiration for optimal performance

4. **Error Handling**:
   - Comprehensive error handling with detailed error responses
   - Proper HTTP status codes for different error scenarios

5. **Modular Architecture**:
   - Reorganized code into logical modules (routes, db, config)
   - Better separation of concerns for improved maintainability

## Running the Project

### Development mode

```bash
yarn install
yarn dev
```

The server will be available at `http://localhost:3007`.

### Production build

```bash
yarn install
yarn build
yarn start
```

### Running tests

```bash
yarn test
# Or in watch mode
yarn test:watch
```

## Contributing New Jokes

Submit a Pull Request with your joke added to the `jokes/index.json` file in this format:

```javascript
{
  "type": "programming",
  "setup": "What's the best thing about a Boolean?",
  "punchline": "Even if you're wrong, you're only off by a bit."
}
```

## TODO List

Future improvements planned for this API:

1. **Testing**:
   - [ ] Add comprehensive integration tests for all endpoints
   - [ ] Implement database mock for faster test execution
   - [ ] Add performance benchmarking tests

2. **API Documentation**:
   - [ ] Generate OpenAPI/Swagger documentation
   - [ ] Add API versioning support
   - [ ] Create interactive API documentation page

3. **Infrastructure**:
   - [ ] Containerize application with Docker
   - [ ] Add CI/CD pipeline configuration
   - [ ] Implement monitoring and alerting

4. **Features**:
   - [ ] Add GraphQL API support
   - [ ] Implement user authentication for joke submission
   - [ ] Add rate limiting and API key management

## Performance Optimizations

The following performance improvements have been implemented:

- Database connection pooling for efficient resource usage
- In-memory caching with smart invalidation
- Optimized database queries with proper indexing
- Response compression for reduced bandwidth usage
- Asynchronous logging that doesn't block the request handler
- Parameterized queries to prevent SQL injection and improve performance
