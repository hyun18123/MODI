# MODI

MODI is a Discord-inspired community chat interface built with React and Vite.

## Features

- Discord-style server rail, channel sidebar, chat area, and member list
- Switch between sample servers and text or voice channels
- Create servers and channels in the browser
- Send messages and search within the selected channel
- Toggle the member panel and voice connection state
- Save created channels and messages in localStorage
- Responsive layout for mobile screens

## Run locally

Requirements: Node.js 18 or newer.

```bash
npm install
npm run dev
```

Create a production build:

```bash
npm run build
npm run preview
```

## Current scope

This first version is a front-end prototype. Messages and created channels are stored only in the current browser using localStorage. Accounts, shared real-time messaging, invitations, file uploads, permissions, and real voice/video calls require a backend and are not implemented yet.

## Stack

- React
- Vite
- lucide-react
- CSS
