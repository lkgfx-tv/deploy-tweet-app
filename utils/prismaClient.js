import { PrismaClient } from "@prisma/client";

// Crear una única instancia de Prisma
const prisma = new PrismaClient();

module.exports = prisma;
