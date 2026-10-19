import { PrismaClient } from '@prisma/client';
import { campusStore } from './store.js';

let prismaInstance: PrismaClient | null = null;
let isPrismaAvailable = false;

export async function initDatabase(): Promise<boolean> {
  const isDemoExplicit = process.env.DEMO_MODE === 'true';

  if (isDemoExplicit && !process.env.FORCE_DB) {
    console.log('ℹ️ Running in Demo Mode with built-in in-memory stateful store.');
    isPrismaAvailable = false;
    return false;
  }

  try {
    prismaInstance = new PrismaClient({
      log: ['error'],
    });
    // Quick test query to see if database connection is alive
    await prismaInstance.$connect();
    isPrismaAvailable = true;
    console.log('✅ Connected to PostgreSQL database via Prisma ORM.');
    return true;
  } catch (err: any) {
    console.warn('⚠️ PostgreSQL connection failed or database not reachable. Gracefully activating Campus Connect Demo Mode Store.');
    console.warn(`Reason: ${err?.message || err}`);
    isPrismaAvailable = false;
    return false;
  }
}

export function getPrisma(): PrismaClient | null {
  return isPrismaAvailable ? prismaInstance : null;
}

export function isDbActive(): boolean {
  return isPrismaAvailable;
}
