# Task Manager API

A simple REST API for managing tasks, built with ASP.NET Core Web API,
Entity Framework Core and SQLite.

## Features
- CRUD operations for tasks
- Filter tasks by status
- Input validation with clear error messages
- Proper HTTP status codes (200, 201, 204, 400, 404)
- Swagger/OpenAPI documentation

## Requirements
- .NET 8 SDK (or the version you used)
- Visual Studio 2022 or VS Code
- (Optional) Postman or Bruno

## Setup
1. Clone the repository:
```
   git clone <your-repo-url>
   cd TaskManagerApi
```
2. Create your environment file:
```
   copy .env.example .env
```
   (on macOS/Linux: `cp .env.example .env`)
3. Restore packages:
```
   dotnet restore
```
4. Create the database (the app also applies migrations on startup):
```
   dotnet ef database update
```

## Run
```
dotnet run
```
Then open Swagger UI at: `https://localhost:<port>/swagger`
(the port is shown in the console output).

## Endpoints
| Method | URL | Description |
|---|---|---|
| GET | /tasks | Get all tasks |
| GET | /tasks?status=Done | Filter by status (Todo, InProgress, Done) |
| GET | /tasks/{id} | Get one task |
| POST | /tasks | Create a task |
| PUT | /tasks/{id} | Update a task |
| DELETE | /tasks/{id} | Delete a task |

## Task model
| Field | Type | Notes |
|---|---|---|
| id | int | generated |
| title | string | required, 3-100 chars |
| description | string | optional, max 500 chars |
| status | enum | Todo, InProgress, Done |
| assignee | string | required |
| createdAt | datetime | set by server |
| dueDate | datetime | required, not in the past |

## Error handling
Validation errors return `400 Bad Request` with details. A missing task
returns `404 Not Found` with a ProblemDetails message.

## API collection
Postman collection: `docs/TaskManagerApi.postman_collection.json`

## Environment variables
See `.env.example`. The real `.env` file is not committed.
