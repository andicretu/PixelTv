import {PrismaClient} from '@prisma/client';

// Instantiate a single PrismaClient for the entire app
// and export it for reuse in other modules.
export const prisma = new PrismaClient();
