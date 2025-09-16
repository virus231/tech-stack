import { PrismaClient } from '@prisma/client';
import { config } from './config';

// Global variable to store Prisma instance
declare global {
  var __prisma: PrismaClient | undefined;
}

// Create Prisma client instance
export const prisma = global.__prisma || new PrismaClient({
  log: config.nodeEnv === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// In development, store the instance globally to prevent multiple instances
if (config.nodeEnv === 'development') {
  global.__prisma = prisma;
}