import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return  new PrismaClient({
    errorFormat: 'pretty',
    log: ['query', 'info', 'warn', 'error'],
  });
};

if (typeof globalThis.prismaGlobal === 'undefined') {
  globalThis.prismaGlobal = prismaClientSingleton()
}

const prisma = globalThis.prismaGlobal || prismaClientSingleton()

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

export default prisma