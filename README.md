## Core API – NestJS + PostgreSQL (TypeORM)

A small REST backend built with NestJS, PostgreSQL, and TypeORM.
The focus is practicing **relational modeling**, **repository-based data access**, **QueryBuilder**, and **transactions**.

## Tech Stack

- NestJS (Node.js framework)
- TypeScript
- PostgreSQL
- TypeORM
- REST API

## What this project practices

### SQL vs NoSQL (why SQL here)

This project uses SQL (PostgreSQL) because the data is naturally relational (users → projects → tasks).

### Entities & relations (TypeORM)

Database models are defined using TypeORM entities:

- User
- Project
- Task

Relationships:

- One User → Many Projects
- One Project → Many Tasks

### Repositories + `@InjectRepository()`

Services use `@InjectRepository()` so database operations live behind repositories, keeping controllers thin and logic testable.

### Query handling (Repository + QueryBuilder)

Uses TypeORM repository methods:

- `find`
- `findOne`
- `save`
- `update`
- `delete`

For simple reads, repository methods are used; for richer reads (joins + ordering), QueryBuilder is used (see `GET /projects`).

### Transactions (atomic writes)

Implements database transactions to ensure data consistency.

Example:

- Create a project and its first task together
- If any step fails, the whole operation rolls back

### Dependency Injection

Uses NestJS Dependency Injection with:

- `InjectRepository`
- `DataSource`

This keeps the code clean and testable.

## Features (current code)

- Create User
- Update User
- Create Project
- Create Task
- Update Task
- Create Project with first Task (Transaction)
- Get all Projects with relations (QueryBuilder)
- Get single Project
- Update Project
- Delete Project

## Setup

```bash
npm install
```

## Environment Variables

Copy `.env.example` to `.env` and update values if needed:

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=nestjs_typeorm
DB_SYNC=true
DB_LOGGING=false
```

## Run locally

```bash
# dev
npm run start:dev
```

## Quick test (Postman)

1. Create a user: `POST /users`
2. Create a project: `POST /projects` (use the returned `user.id` as `ownerId`)
3. Create a task: `POST /tasks` (use `project.id`)
4. Transaction demo: `POST /projects/with-first-task` (creates both rows or none)

## API Endpoints (Current Code)

### Users

- `POST /users`
- `GET /users`
- `GET /users/:id`
- `PATCH /users/:id`

### Projects

- `POST /projects`
- `POST /projects/with-first-task`
- `GET /projects`
- `GET /projects/:id`
- `PATCH /projects/:id`
- `DELETE /projects/:id`

### Tasks

- `POST /tasks`
- `GET /tasks`
- `PATCH /tasks/:id`

## Architecture notes

- Controller: handles HTTP requests
- Service: business logic
- Repository: database access layer

## Learning outcomes

This project demonstrates:

- Replacing in-memory data with a real database
- Working with relational data
- Using repositories and dependency injection (`InjectRepository`)
- Using QueryBuilder for relational queries
- Using transactions for data safety
- Building scalable NestJS architecture
- Applying TypeORM in real-world apps

## Project Structure

```text
src/
  main.ts
  app.module.ts
  app.controller.ts
  app.service.ts

  config/
    database.config.ts

  modules/
    users/
      dto/
      entities/
      users.controller.ts
      users.service.ts
      users.module.ts

    projects/
      dto/
      entities/
      projects.controller.ts
      projects.service.ts
      projects.module.ts

    tasks/
      dto/
      entities/
      tasks.controller.ts
      tasks.service.ts
      tasks.module.ts
```
