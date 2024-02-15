import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

var prisma;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

var client = new PrismaClient();
client.$extends(withAccelerate());

async function connect() {
  client = prisma || new PrismaClient();
  client.$extends(withAccelerate());
  let attempts = 0;
  while (true) {
    try {
      await client.$connect();
      if (process.env.NODE_ENV !== "production") prisma = client;
      break; // Se a conexão for bem-sucedida, saia do loop
    } catch (err) {
      console.log("Erro ao conectar. Tentativa:", attempts, err);
      attempts++;
      if (attempts >= 5) {
        // Limite para número de tentativas
        console.log(
          "Número máximo de tentativas atingido. Encerrando tentativas."
        );
        break;
      }
      await sleep(1000); // Espera por 1000ms antes de tentar novamente
    }
  }
}

connect();

export default client;
