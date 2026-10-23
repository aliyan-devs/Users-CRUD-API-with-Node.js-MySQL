# Users CRUD API

A REST API built with Node.js, Express, and MySQL.

## Requirements

- Node.js 20 or newer
- MySQL 8 or newer

## Setup

1. Create the database and `users` table by running `database.sql` in MySQL Workbench or the MySQL CLI:

   ```powershell
   mysql -u root -p < database.sql
   ```

2. Install dependencies:

   ```powershell
   npm install
   ```

3. Copy `.env.example` to `.env` and set your MySQL credentials.
4. Start the API:

   ```powershell
   npm start
   ```

The server listens on `http://localhost:3000` by default. It checks its MySQL connection before starting.

## Endpoints

All successful responses (except `DELETE`) use a JSON `{ "data": ... }` envelope. Errors use `{ "error": "..." }`.

| Method | Path | Behavior |
| --- | --- | --- |
| `POST` | `/api/users` | Create a user; requires `name` and `email`, accepts optional `age`. Returns `201`. |
| `GET` | `/api/users` | Return all users ordered by ID. |
| `GET` | `/api/users/:id` | Return one user, or `404` if it does not exist. |
| `PUT` | `/api/users/:id` | Update one or more of `name`, `email`, and `age`; unknown fields and empty updates are rejected. |
| `DELETE` | `/api/users/:id` | Delete a user; returns `204`, or `404` if it does not exist. |

`name` must be a non-empty string of at most 100 characters. `email` must be valid and unique. `age` may be omitted, `null`, or an integer from 0 to 150. Duplicate emails return `409`; invalid input returns `400`.

Example create request:

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "age": 36
}
```

## Test

Run the local validation tests:

```powershell
npm test
```

To exercise the live API in Postman, import [`postman/Users CRUD API.postman_collection.json`](./postman/Users%20CRUD%20API.postman_collection.json), start the server, and run the collection. The requests are ordered to create a user, read the list and user, update, delete, check the deleted user returns `404`, and verify invalid input and IDs return `400`.

## GitHub

Repository: https://github.com/aliyankk/aliyan
