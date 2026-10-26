# Nestro

Nestro is a full-stack furniture and interior-product showcase with a public storefront and an administrative dashboard for managing catalog content.

The project is split into two independently runnable applications:

- **Frontend** — Next.js 16 and React 19 application for the storefront and admin dashboard.
- **Backend** — Express 5 API backed by MongoDB, with Cloudinary image storage and Brevo email support.

## Features

### Public storefront

- Home page with featured categories and rooms
- Product catalog and product detail pages
- About and contact pages
- Newsletter subscription
- Site content loaded from the API

### Admin dashboard

- Dashboard summary
- Category management, including image upload and active/inactive status
- Product management, including a primary image and additional gallery images
- Room management, including image upload and status
- Color management
- Site settings management

## Technology

| Area | Technologies |
| --- | --- |
| Frontend | Next.js 16, React 19, Tailwind CSS 4, Axios, Sonner |
| Backend | Node.js, Express 5, Mongoose 9, Multer |
| Data and services | MongoDB, Cloudinary, Brevo |
| Code style | JavaScript/JSX with ESLint |

## Project structure

```text
Nestro/
├── backend/
│   ├── src/
│   │   ├── config/          # Database and Cloudinary configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Mongoose models
│   │   ├── routers/         # Express route definitions
│   │   ├── utils/           # Uploads, email, and response helpers
│   │   └── index.js         # API entry point
│   └── .env.example
├── frontend/
│   ├── src/app/
│   │   ├── (website-pages)/  # Public storefront routes
│   │   ├── (admin-pages)/    # Admin dashboard routes
│   │   └── components/       # Shared website and admin components
│   └── package.json
└── README.md
```

## Requirements

- Node.js 20 or newer
- npm
- MongoDB (local or hosted)
- Cloudinary account for image uploads
- Brevo account and API key for email features

## Getting started

### 1. Install dependencies

From the repository root:

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure the backend

Create `backend/.env` from the supplied example:

```bash
cd backend
cp .env.example .env
```

On Windows PowerShell, use:

```powershell
Copy-Item .env.example .env
```

Set the values in `backend/.env`:

```dotenv
DB_URL=mongodb://localhost:27017/nestro
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
BREVO_API_KEY=
BREVO_SENDER_EMAIL=
BREVO_SENDER_NAME=
PORT=5000
```

`DB_URL` is required. Cloudinary credentials are required for image uploads, and Brevo credentials are required for newsletter/email functionality.

### 3. Configure the frontend

The frontend defaults to `http://localhost:5000/api`. To use another API host, create `frontend/.env.local` and set:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Run both applications

Open two terminals.

**Terminal 1 — backend**

```bash
cd backend
npm run dev
```

The API starts on [http://localhost:5000](http://localhost:5000) by default.

**Terminal 2 — frontend**

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser.

## Available scripts

### Backend

Run these commands from `backend/`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the API with Nodemon |
| `npm start` | Start the API with Node |
| `npm test` | Placeholder test command; no automated backend tests are configured yet |

### Frontend

Run these commands from `frontend/`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint |

## Routes

### Frontend pages

| Path | Purpose |
| --- | --- |
| `/` | Storefront home |
| `/about` | About page |
| `/contact` | Contact page |
| `/store` | Product catalog |
| `/store/[id]` | Product details |
| `/admin` | Dashboard |
| `/admin/category` | Category management |
| `/admin/colors` | Color management |
| `/admin/products` | Product management |
| `/admin/rooms` | Room management |
| `/admin/settings` | Site settings |

### API resources

The backend mounts these resources under `/api`:

| Base path | Purpose |
| --- | --- |
| `/category` | Create, list, update, toggle, and delete categories |
| `/product` | Create, list, update, delete, and manage product images |
| `/subscribe` | Subscribe an email address |
| `/rooms` | Create, list, update, toggle, and delete rooms |
| `/colors` | Create, list, update, toggle, and delete colors |
| `/dashboard` | Dashboard summary data |
| `/settings` | Read and update site settings |

Most create/update endpoints that accept images use `multipart/form-data`. Product gallery images are uploaded through the product image endpoints.

## Development notes

- Start MongoDB before starting the backend.
- The backend enables CORS for local frontend development.
- Do not commit `.env` or `.env.local` files. Keep credentials in environment variables.
- Use Cloudinary URLs returned by the API for catalog and room images.
- Some existing frontend screens use the local API fallback directly; keep the API available at port `5000` during local development or update those calls when changing environments.

## Validation

Before opening a pull request, run:

```bash
cd frontend
npm run lint
npm run build
```

The backend currently has no automated test suite configured. Verify API changes manually against a running MongoDB instance and the relevant dashboard/storefront flow.

## License

No project license has been specified yet.
