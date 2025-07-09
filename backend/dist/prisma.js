"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
// Instantiate a single PrismaClient for the entire app
// and export it for reuse in other modules.
exports.prisma = new client_1.PrismaClient();
