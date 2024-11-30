//https://www.pc.rs.gov.br/_service/desaparecidos/listhtml?nome=&amdDesaparecimentoInicial=&amdDesaparecimentoFinal=&sexo=&idade=&municipioId=&municipio=&pagina=0

import { PrismaClient } from "@prisma/client";

const https = require("https"); // Para URLs HTTPS

const agent = new http.Agent({
  keepAlive: true,
  maxSockets: 1, // Número máximo de sockets a serem usados. Ajuste conforme necessário.
});

async function cep() {
  const req = http.request(
    {
      hostname: "https://www.pc.rs.gov.br",
      port: 443, // Use 443 para HTTPS
      path: "/_service/desaparecidos/listhtml?nome=&amdDesaparecimentoInicial=&amdDesaparecimentoFinal=&sexo=&idade=&municipioId=&municipio=&pagina=5",
      method: "GET",
      agent: agent,
      headers: {
        "Content-Type": "text/plain",
      },
    },
    (res) => {
      let data = "";

      console.log("Status Code:", res.statusCode);

      // Recebe os dados em chunks
      res.on("data", (chunk) => {
        data += chunk;
      });

      // Ao finalizar a recepção dos dados
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          console.log("Resposta JSON:", json);
        } catch (e) {
          console.error("Erro ao parsear JSON:", e);
        }
      });
    }
  );

  // Manipula erros na requisição
  req.on("error", (err) => {
    console.error("Erro na requisição:", err);
  });

  // Finaliza a requisição
  req.end();
}

const MAX_CEP = 99999999;
const BATCH_SIZE = 1000;
const prisma = new PrismaClient();

async function fetchCepInfo(requestedCep) {
  const cepWithLeftPad = requestedCep.toString().padStart(8, "0");
  try {
    await cep(cepWithLeftPad);
    return true;
  } catch (error) {
    if (error.name == "CepPromiseError") {
      //console.log("error", error);
    }

    if (error.type == "validation_error") {
      //console.error("error", error);
    }
    return false;
  }
}

async function processCEP(requestedCep) {
  try {
    const isValid = await fetchCepInfo(requestedCep);
    if (isValid) {
      try {
        await prisma.ceps.create({
          data: { cep: requestedCep },
        });
        console.log("W", requestedCep);
      } catch (error) {
        if (error.code !== "P2002") {
          console.error("Prisma error: ", error);
        }
      }
    }
  } catch (error) {
    console.error("Error: ", error);
  }
}

process.on("SIGINT", function () {
  console.log("\nSalvando...");
  prisma.$disconnect().finally(() => {
    process.exit();
  });
});

async function processCEPs() {
  const currentCep = 7437496;
  try {
    for (let i = currentCep; i <= MAX_CEP; i += BATCH_SIZE - 1) {
      const promises = Array.from({ length: BATCH_SIZE }, (_, j) =>
        processCEP(i + j)
      );
      await Promise.all(promises);
      console.log("cep", i);
    }
  } catch (error) {
    console.error("Error processing CEPs: ", error);
  } finally {
    await prisma.$disconnect();
    process.exit();
  }
}

processCEPs();

https://www.pc.rs.gov.br/desaparecidos?nome=MAIKELLY%20DA%20ROSA%20VEGA&dtNascimento=12/10/2008&dataDesaparecimento=25/11/2024&nomeMunicipio=Santa%20Maria&urlFoto=https://www.delegaciaonline.rs.gov.br/dol/api/desaparecidos/consultaFoto/72120003/26715.JPG&detalhes=1&key=91fbb029d9162bbedbfde9a8d189a90b