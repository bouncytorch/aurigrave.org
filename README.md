# aurigrave.org Source

This repository contains the source code for https://aurigrave.org.

<img width="843" height="919" alt="screencapture-aurigrave-org-2026-02-24-21_16_18" src="https://github.com/user-attachments/assets/3268fee3-695a-4102-a02e-762da11c64ac" />


## Features

*   **Next.js**: Modern React framework for building performant web applications.
*   **PostgreSQL**: Robust relational database for data storage.
*   **Docker & Docker Compose**: Containerization for consistent development and deployment environments.
*   **Sequelize**: ORM for simplified database interaction.

## Running

### Prerequisites

*   [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
*   A `.env` file in the project root (see below)

### Environment Variables

Create a `.env` file in the project root:

```env
DB_NAME=aurigraveorg
DB_USER=aurigrave
DB_PASSWORD=your_password
PORT=3000
```

### Development

Clone the repo and start all services locally with hot-reload:

```bash
git clone https://github.com/bouncytorch/aurigrave.org
cd aurigrave.org
docker compose up --build
```

The app will be available at `http://localhost:3000`.

> The `migrate` service will automatically run pending database migrations before the app starts.

### Production

Uses pre-built images from Docker Hub. Pull and start with:

```bash
docker compose -f docker-compose.prod.yml up -d
```

## Project Structure

*   `db/`: Database migrations and configuration.
*   `public/`: Static assets.
*   `src/`: Application source code, including Next.js pages, components, and utility functions.
    *   `src/app/`: Next.js application routes and pages.
    *   `src/components/`: Reusable React components.
    *   `src/lib/`: Utility functions and database connection logic.
    *   `src/models/`: Sequelize models defining database schemas.

## Available Scripts

In the project directory, you can run:

*   `pnpm dev`: Runs the app in development mode.
*   `pnpm build`: Builds the application for production.
*   `pnpm start`: Starts the production-built application.
*   `pnpm lint`: Runs ESLint for code quality analysis.
*   `pnpm migrate:create`: Creates a new database migration.
*   `pnpm migrate:up`: Applies pending database migrations.
*   `pnpm migrate:down`: Reverts the last database migration.
*   `pnpm migrate:status`: Shows the status of database migrations.
