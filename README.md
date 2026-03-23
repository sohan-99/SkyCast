# SkyCast - Full Stack Weather Forecast App

Production-oriented weather forecast application built as a pure Next.js project using App Router pages and Next.js route handlers.

## Stack

- Frontend + Backend: Next.js 14 (App Router + Route Handlers) + TypeScript
- Database: MongoDB + Mongoose
- Auth: JWT + HttpOnly cookies + bcrypt password hashing
- Styling: TailwindCSS + reusable shadcn-style UI components
- Forms/Validation: React Hook Form + Zod
- State Management: Zustand + React Context
- Weather API: Open-Meteo + Nominatim reverse geocoding

## Project Structure

```text
/app
/components
/lib
/hooks
/context
/services
/styles
/store
/app/api
/lib/server
```


## Implemented Features

- User registration and login
- JWT authentication and protected dashboard routes
- Logout functionality
- Search current weather by city
- 5-day weather forecast
- Weather cards with temperature, humidity, wind, condition, icon
- Favorite cities (save/list/remove)
- Search history storage per user
- Geolocation weather detection
- Loading and error UI states
- Toast notifications
- Dark/light mode toggle
- Smooth UI animations with Framer Motion
- Validation, protected API routes, and same-origin cookie auth

## API Endpoints


- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/weather/current/:city`
- `GET /api/weather/forecast/:city`
- `POST /api/user/favorites`
- `GET /api/user/favorites`
- `DELETE /api/user/favorites`
- `GET /api/user/history`

## Environment Variables

Copy `.env.example` to `.env` and fill values:

```env
NEXT_PUBLIC_APP_NAME=SkyCast
MONGODB_URI=https:/+";";;"+$;$;hshshgskljkvhjgchfxgjhkvjlk
JWT_SECRET=bxbxbxkxbzksvshmsuavMab
JWT_EXPIRES_IN=7d
COOKIE_SECURE=false
```

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Start the app:

```bash
npm run dev
```

- App and API both run on `http://localhost:3000`

## Build and Run

```bash
npm run build
npm start
```

## Deployment

### App (Vercel)

- Deploy this repo as a Next.js project.
- Add server environment variables from `.env.example`.

### Database (MongoDB Atlas)

- Create cluster and user.
- Set `MONGODB_URI` in deployment environment.

## Notes

- Weather icons reuse OpenWeatherMap icon codes for presentation only.
- Dashboard pages are protected both client-side and via Next middleware cookie checks.
- API validation is enforced with Zod inside route handlers.
