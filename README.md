# Set in Stone

A card creation and management application for designing custom game cards with aspects, stats, and visual styling. Built with React, TypeScript, and Express.

## Features

- **Card Editor**: Create and edit cards with customizable attributes

  - Card types: Creature, Enchantment, Device, Reaction, Fast, Slow, Gem
  - Aspect system with 11 unique aspects (Bloom, Callous, Grace, Law, Mythic, Relic, Tide, Weird, Xeno, Zeal, Fundamental)
  - Stats: Offence, Defence, Regeneration
  - Custom artwork and descriptions
  - Tagging system for organization
  - Accessories (Unique, Objective markers)

- **Card Browser**: Browse and filter cards

  - Pagination support
  - Advanced filtering by card type, aspects, and tags
  - Grid view for easy browsing
  - Search by UUID

- **Export Functionality**: Export cards as high-quality PNG images

- **User Authentication**: User registration and login system with session management

- **Visual Styling**: Beautiful card designs with custom textures (marble, paper, subtle noise)

## Tech Stack

### Client

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Export**: html2canvas-pro

### Server

- **Runtime**: Node.js with Express
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **Authentication**: bcrypt for password hashing, cookie-based sessions

## Project Structure

```
set-in-stone/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── aspects/        # Aspect definitions and icons
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Utility functions and services
│   │   ├── textures/       # SVG texture patterns
│   │   └── constants/      # App constants
│   └── public/
│       └── icons/          # Aspect icons
├── server/                 # Express backend
│   ├── src/
│   │   ├── middleware/     # Auth middleware
│   │   ├── services/       # Business logic services
│   │   └── types/          # Shared type definitions
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── scripts/            # Utility scripts
└── packages/
    └── shared/             # Shared types between client and server
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd set-in-stone
   ```

2. Install dependencies for both client and server:

   ```bash
   # Install client dependencies
   cd client
   npm install

   # Install server dependencies
   cd ../server
   npm install
   ```

3. Set up the database:
   ```bash
   cd server
   npm run db:generate
   npm run db:push
   ```

### Development

Run the development servers:

**Option 1: Using VS Code Tasks**

- Use the "Start Development" task from the command palette (Ctrl+Shift+P → "Tasks: Run Task")

**Option 2: Manual**

```bash
# Terminal 1 - Start the server
cd server
npm run dev

# Terminal 2 - Start the client
cd client
npm run dev
```

The client will be available at `http://localhost:5173` (default Vite port)
The server will run on `http://localhost:3000` (or configured port)

### Building for Production

```bash
# Build client
cd client
npm run build

# Build server
cd server
npm run build
```

## Database Management

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes to database
npm run db:push

# Open Prisma Studio (database GUI)
npm run db:studio
```

## Card Aspects

The game features 10 unique aspects:

- **Bloom**: Nature and growth
- **Callous**: Ruthlessness and cruelty
- **Grace**: Elegance and finesse
- **Law**: Order and justice
- **Mythic**: Ancient and legendary
- **Relic**: Artifacts and history
- **Tide**: Trade and travel
- **Weird**: Strange and uncanny
- **Xeno**: Alien and foreign
- **Zeal**: Passion and fervor

And one aspect for any concepts or ideas that don't fit anywhere else:

- **Fundamental**: Core and essential

Each aspect has a unique icon and color scheme applied to cards.

## License

ISC

## Author

Created by the Maple Toaster
