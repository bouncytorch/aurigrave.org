# aurigrave.org Source

This repository contains the source code for https://aurigrave.org. Complete design sheet is available on [Figma](https://www.figma.com/design/zej4allpxdHrBxxoTMTWPk/aurigrave.org?node-id=0-1&t=4ncy2H8NvaLWn3pd-1).

<img width="843" height="919" alt="screencapture-aurigrave-org-2026-02-24-21_16_18" src="https://github.com/user-attachments/assets/3268fee3-695a-4102-a02e-762da11c64ac" />

## Technical Info

### Stack: 
- Next.js (`app`)
- PostgreSQL (`db`)
- Docker (`container`)
- Sequelize (`migrations`)
- GitHub Actions (`ci/cd`)

### Features:
- Copyparty fileserver interactions for media content (audio and images)
- Aesthetically consistent and adaptive design
- Complete audio portfolio system - individual linktrees, previews, featured videos
- A markdown-based blog system with an in-app editor and an OG image generator

### Structure: 
* `db/`: Database migrations and configuration
* `public/`: Static assets
* `src/`: Application source code, including Next.js pages, components, and utility functions
   * `src/app/`: Next.js application routes and pages
   * `src/components/`: Reusable React components
   * `src/lib/`: Utility functions and database connection logic
   * `src/models/`: Sequelize models defining database schemas

## Running

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- An `.env` file in the project root (see below)

### Development

1. Clone the repo and install the required node modules:
```bash
git clone https://github.com/bouncytorch/aurigrave.org
cd aurigrave.org
pnpm install
```

2. Create an environment config using `.example.env`:
```env
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=

DB_HOST=localhost
DB_PORT=5432
DB_NAME=
DB_USER=
DB_PASSWORD=

NODE_ENV=development
PORT=3000
HOSTNAME=0.0.0.0
```

3. Start the postgres DB:
```bash
docker compose up -d db
```

3. Run migrations on the newly created DB:
```bash
pnpm migrate:up
```

4. And finally, start the development server:
```bash
pnpm dev
```

The app will be available at `http://localhost:3000`.

### Production

Uses pre-built images from Docker Hub. Use the included `docker-compose.prod.yml`:

```bash
docker compose -f docker-compose.prod.yml up -d
```

### Available Scripts

In the project directory, you can run:

*   `pnpm dev`: Runs the app in development mode
*   `pnpm build`: Builds the application for production
*   `pnpm start`: Starts the production-built application
*   `pnpm lint`: Runs ESLint to check for stylisting and formatting errors
*   `pnpm migrate:create --name=<namehere>`: Creates a new database migration. Filename is `timestamp-name.js`
*   `pnpm migrate:up`: Applies pending database migrations
*   `pnpm migrate:down`: Reverts the last database migration
*   `pnpm migrate:status`: Shows the status of database migrations
