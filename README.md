# User Management Web Application

A professional Next.js application for user management that consumes a .NET Core API. Built with TypeScript, Tailwind CSS, shadcn/ui, and Zod for robust validation.

npm i -g npm bun @anthropic-ai/claude-code

git remote add origin https://gitea.arpce.fnstack.dev/fnstack/web-app.git

## Features

- **Modern UI**: Professional interface built with shadcn/ui components
- **Type Safety**: Full TypeScript implementation with Zod validation
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **CRUD Operations**: Complete user management (Create, Read, Update, Delete)
- **Error Handling**: Comprehensive error handling and validation
- **Docker Support**: Production-ready Docker configuration

## API Integration

This application integrates with the User API endpoints:

- `GET /api/Users` - Get all users
- `GET /api/Users/{id}` - Get user by ID
- `POST /api/Users` - Create new user
- `PUT /api/Users/{id}` - Update existing user
- `DELETE /api/Users/{id}` - Delete user

## Technology Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern React components
- **Zod** - TypeScript-first schema validation
- **Radix UI** - Low-level UI primitives
- **Lucide React** - Beautiful icons
- **Node.js 22** - JavaScript runtime

## Getting Started

### Prerequisites

- Node.js 22 or later
- npm or yarn
- The .NET API running on port 5000

### Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
   Update `NEXT_PUBLIC_API_URL` if your API runs on a different port.

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Docker Deployment

### Build and run with Docker:

```bash
# Build the image
docker build -t user-management-app .

# Run the container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://your-api-host:5000 \
  user-management-app
```

### Using Docker Compose:

```bash
docker-compose up --build
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── user-form.tsx     # User form dialog
│   └── users-table.tsx   # Users data table
├── lib/                  # Utility libraries
│   ├── api.ts           # API client
│   └── utils.ts         # Helper functions
└── types/                # TypeScript type definitions
    └── user.ts          # User types and schemas
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Configuration

### Environment Variables

- `NEXT_PUBLIC_API_URL` - Base URL for the API (default: http://localhost:5000)

### API Configuration

The application expects the API to be running and accessible. Make sure the .NET Core API is running on the specified port and CORS is configured to allow requests from the web application.

## License

This project is licensed under the ISC License.