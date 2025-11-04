/**
 * Business Directory API
 * Production-ready Express.js API with authentication, validation, and CRUD operations
 */

import dotenv from 'dotenv';
import { createApp } from './app';
import PrismaService from './utils/prisma';

// Load environment variables
dotenv.config();

const app = createApp();

const port = process.env.BACKEND_PORT || 3333;
const server = app.listen(port, () => {
  console.log(`API Endpoints: http://localhost:${port}/api/v1`);
  console.log(`Health Endpoint: http://localhost:${port}/api/v1/health`);
});

server.on('error', (error) => {
  console.error('Server error:', error);
});

// Disconnect Prisma on shutdown
process.on('SIGTERM', async () => {
  await PrismaService.disconnect();
});

process.on('SIGINT', async () => {
  await PrismaService.disconnect();
});
