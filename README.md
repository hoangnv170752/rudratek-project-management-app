# Project Tracker Mobile App

A React Native (Expo) mobile application for tracking and managing projects - assignment from Rudratek.

## Project Structure

```
├── client/                 # Expo React Native app
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── navigation/     # React Navigation setup
│   │   ├── screens/        # Screen components
│   │   ├── services/       # API service layer
│   │   └── types/          # TypeScript type definitions
│   ├── App.tsx             # App entry point
│   └── package.json
│
└── server/                 # Mock API server (JSON Server)
    ├── db.json             # Mock data
    └── package.json
```

## Setup Instructions

### Prerequisites

- Node.js >= 18
- Yarn or npm
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator

### Client Setup

```bash
cd client
yarn install
yarn start
```

Then press `i` for iOS simulator or `a` for Android emulator.

### Server Setup (Local Development)

```bash
cd server
yarn install
yarn dev
```

The API will be available at `http://localhost:3001`.

### Server Deployment (Render)

The server is configured for Render deployment:

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the root directory to `server`
4. Build command: `yarn install`
5. Start command: `yarn start`

The server will use Render's `PORT` environment variable automatically.

### Connecting Client to Deployed Server

Update the `API_BASE_URL` in `client/src/services/api.ts`:

```typescript
const API_BASE_URL = 'https://your-render-app.onrender.com';
```

## API Endpoints

| Method | Endpoint          | Description             |
| ------ | ----------------- | ----------------------- |
| GET    | `/projects`     | Get all projects        |
| GET    | `/projects/:id` | Get project by ID       |
| PATCH  | `/projects/:id` | Update project (status) |

## Features

- **Project List Screen**: View all projects with pull-to-refresh
- **Search**: Filter by project name or client name
- **Status Filter**: Filter by Active, On Hold, or Completed
- **Project Detail Screen**: View full project details
- **Status Update**: Change project status with immediate UI update
- **Error Handling**: Loading, error, and empty states

## API/Mocking Approach

This app uses **JSON Server** as a mock REST API. The mock data in `server/db.json` contains 8 sample projects with various statuses. JSON Server provides full CRUD operations out of the box.

## Assumptions and Trade-offs

1. **No authentication**: Simplified for demo purposes
2. **Local state management**: Using React hooks instead of Redux/Zustand for simplicity given the app scope
3. **Minimal UI libraries**: Only using React Navigation as required; no heavy UI kits
4. **TypeScript**: Strict mode enabled for type safety

## AI Usage Disclosure

- **Tools used**: AI assistant for code generation
- **Parts assisted**: Initial project structure, component boilerplate, TypeScript types
- **Changes made**: Reviewed and adjusted all generated code for correctness
- **Understanding**: Full understanding of React Native, React Navigation, hooks, and API integration patterns

## Tech Stack

- React Native (Expo)
- TypeScript
- React Navigation (Native Stack)
- Axios for HTTP requests
- JSON Server for mock API
