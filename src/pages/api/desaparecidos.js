import got from "got";
import * as cheerio from "cheerio";
import { parse } from "date-fns";

//import KeyvSqlite from "@keyv/sqlite";

import prisma from "@/lib/prismadb";

export default async function handler(req, res) {
  let { page=1, limit=6, name="", city="", state="" } = req.query;

  // Convertendo os parâmetros para inteiros
  page = parseInt(page, 10);
  limit = parseInt(limit, 10);

  // Validação dos parâmetros
  if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
    return res.status(400).json({
      error:
        "Os parâmetros 'page' e 'limit' devem ser números inteiros maiores ou iguais a 1.",
    });
  }

  try {
    res
      .status(200)
      .json(await getPaginatedPersons(page, limit, name.toUpperCase(), city.toUpperCase(), state.toUpperCase()));
  } catch (error) {
    console.error("Erro ao processar a solicitação:", error);
    res.status(500).json({ error: error.message });
  }
}

async function createNewPersons(page, limit) {
  let persons = [];
  const response_rs = await got(
    "https://www.pc.rs.gov.br/_service/desaparecidos/listhtml",
    {
      searchParams: { pagina: page, size: parseInt(limit / 2, 10) },
      responseType: "text",
    }
  );

  const response_sc = await got(
    "https://devs.pc.sc.gov.br/servicos/desaparecidos/dados",
    {
      searchParams: { pagina: page - 1, size: parseInt(limit / 2, 10) },
      responseType: "json",
    }
  );

  // Verifica se a resposta contém dados
  if (!response_rs || !response_rs.body) {
    console.log("response_rs inválida ou vazia.");
  } else {
    persons = await save_date(await parse_pc_rs(response_rs.body));
  }

  // Verifica se a resposta contém dados
  if (!response_sc || !response_sc.body) {
    console.log("response_sc inválida ou vazia.");
  } else {
    persons = [
      persons,
      ...(await save_date(await parse_pc_sc(response_sc.body))),
    ];
  }

  return persons;
}

async function getPaginatedPersons(
  page,
  limit,
  nameFilter,
  cityFilter,
  stateFilter
) {
  // Cria um objeto 'where' dinâmico
  const whereConditions = {};

  // Filtro por nome (se fornecido)
  if (nameFilter != "") {
    whereConditions.name = {
      contains: nameFilter,
      mode: "insensitive",
    };
  }

  // Filtro por localização:
  const locationFilters = [];
  if (stateFilter != "") {
    locationFilters.push({
      location_history: {
        some: {
          location: {
            uf: {
              equals: stateFilter,
              mode: "insensitive",
            },
          },
        },
      },
    });

    if (cityFilter != "") {
      locationFilters.push({
        location_history: {
          some: {
            location: {
              city: {
                equals: cityFilter,
                mode: "insensitive",
              },
            },
          },
        },
      });
    }
  }

  // Se houver filtros de localização, adicionamos ao where principal
  if (locationFilters.length > 0) {
    whereConditions.AND = locationFilters;
  }

  let persons = await prisma.person.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      create_time: "desc",
    },
    where: whereConditions,
    include: {
      location_history: {
        include: {
          location: true,
        },
      },
    },
  });

  // Conta o total de registros (aplicando também o filtro, se existir)
  const totalRecords = await prisma.person.count({
    where: whereConditions,
  });
  const totalPages = Math.ceil(totalRecords / limit);

  // Caso exista qualquer filtro, não chamaremos createNewPersons.
  const hasFilters =
    !!nameFilter || !!stateFilter || !!(stateFilter && cityFilter);

  if (
    !hasFilters &&
    ((persons.length < limit && page - 1 <= totalPages) || persons.length == 0)
  ) {
    console.log("Final dos registros alcançado. Criando novos...");
    persons = await createNewPersons(page, limit); // Certifique-se de implementar esta função, se necessário
  }

  return {
    data: persons,
    meta: {
      currentPage: page,
      totalPages: totalPages,
      totalRecords,
    },
  };
}

async function agify(name, country_id) {
  let data = {
    age: Number(),
  };

  try {
    const response = await got(
      `https://api.agify.io?name=${name}&country_id=${country_id}`,
      {
        responseType: "json",
      }
    );

    data["age"] = Number(response.body["age"]);

    return data;
  } catch (error) {
    if (error.response) {
      const { statusCode, body } = error.response;

      // Mapeamento de erros
      const errors = {
        401: "API key inválido",
        402: "Assinatura não ativa",
        422:
          body.error === "Missing 'name' parameter"
            ? "Parâmetro 'name' ausente"
            : "Parâmetro 'name' inválido",
        429:
          body.error === "Request limit reached"
            ? "Limite de requisições atingido"
            : "Limite de requisições baixo demais",
      };

      console.error(errors[statusCode] || `Erro desconhecido: ${body.error}`);
    } else {
      console.error("Erro ao configurar a requisição:", error.message);
    }
  }
}

async function checkIfPersonExists(personData) {
  //CREATE EXTENSION pg_trgm;
  try {
    const existingPerson = await prisma.$queryRaw`
    WITH similaridades AS (
        SELECT
            p.id,
            p.name,
            l.uf,
            similarity(p.name, ${personData.name}) AS similaridade_nome,
            CASE
                WHEN l.city = ${personData.location_history[0].city} THEN 1
                ELSE 0
            END AS similaridade_cidade,
            CASE
                WHEN l.uf = ${personData.location_history[0].uf} THEN 1
                ELSE 0
            END AS similaridade_uf,
            1 / (1 + ABS(EXTRACT(YEAR FROM AGE(p.birthday)) - EXTRACT(YEAR FROM AGE(${personData.birthday}::date)))) AS similaridade_data_nascimento
        FROM
            "person" p
        LEFT JOIN "location_history" lh ON lh.person_id = p.id
        LEFT JOIN "location" l ON l.id = lh.location_id
    )
    SELECT
        id,
        "name",
        uf,
        similaridade_nome,
        similaridade_cidade,
        similaridade_uf,
        similaridade_data_nascimento,
        -- Soma ponderada das similaridades
        (similaridade_nome * 0.4 + 
        similaridade_cidade * 0.1 + 
        similaridade_uf * 0.2 + 
        similaridade_data_nascimento * 0.3) AS similaridade_total
    FROM
        similaridades
    ORDER BY similaridade_total DESC
    LIMIT 1
    `;

    // Check if the query result is not empty or undefined
    if (Array.isArray(existingPerson) && existingPerson.length > 0) {
      const similarityScore = existingPerson[0].similaridade_total;
      if (similarityScore > 0.9) {
        // Return the person if similarity score is high
        return existingPerson[0];
      }
    }

    // Return false if no person was found or similarity is too low
    return false;
  } catch (error) {
    console.log("Error in checkIfPersonExists:", error);
    return false;
  }
}

async function save_date(peopleData) {
  let result = [];
  for (const personData of peopleData) {
    // Verificar se a pessoa já existe
    const existingPerson = await checkIfPersonExists(personData);

    if (!existingPerson) {
      result.push(
        await prisma.person.create({
          data: {
            name: personData.name,
            birthday: personData.birthday,
            gender: personData.gender == 1 ? true : false,
            nationality: personData.nationality,
            main_photo: personData.main_photo,
            tattoo: personData.tattoo,
            others: personData.others,
            location_history: {
              create: personData.location_history.map((location) => ({
                visited_at: location.visited_at,
                location: {
                  create: {
                    city: location.city,
                    uf: location.uf,
                    country: location.country,
                    neighborhood: location.neighborhood,
                  },
                },
              })),
            },
            imgs: {
              create:
                personData.imgs?.map((img) => ({
                  url: img,
                })) || [],
            },
          },
        })
      );
    }
  }
  return result;
}

async function nationalize(name) {
  let data = {
    country_id: String(),
    country: [],
  };

  try {
    const response = await got(`https://api.nationalize.io?name=${name}`, {
      responseType: "json",
    });

    data["country_id"] = String(response.body["country"][0]["country_id"]);
    data["country"] = response.body.country;

    return data;
  } catch (error) {
    if (error.response) {
      const { statusCode, body } = error.response;

      // Mapeamento de erros da Nationalize
      const errors = {
        401: "API key inválido",
        402: "Assinatura não ativa",
        422:
          body.error === "Missing 'name' parameter"
            ? "Parâmetro 'name' ausente"
            : "Parâmetro 'name' inválido",
        429:
          body.error === "Request limit reached"
            ? "Limite de requisições atingido"
            : "Limite de requisições baixo demais",
      };

      console.error(errors[statusCode] || `Erro desconhecido: ${body.error}`);
    } else {
      console.error("Erro ao configurar a requisição:", error.message);
    }
  }
}

async function genderize(name, country_id) {
  let data = {
    gender: String(),
    probability: Number(),
  };

  try {
    const response = await got(
      `https://api.genderize.io?name=${name}&country_id=${country_id}`,
      {
        responseType: "json",
      }
    );

    data["gender"] = String(response.body["gender"]);
    data["probability"] = Number(response.body["probability"]);
    return response.body;
  } catch (error) {
    if (error.response) {
      const { statusCode, body } = error.response;

      // Mapeamento de erros
      const errors = {
        401: "API key inválido",
        402: "Assinatura não ativa",
        422:
          body.error === "Missing 'name' parameter"
            ? "Parâmetro 'name' ausente"
            : "Parâmetro 'name' inválido",
        429:
          body.error === "Request limit reached"
            ? "Limite de requisições atingido"
            : "Limite de requisições baixo demais",
      };

      console.error(errors[statusCode] || `Erro desconhecido: ${body.error}`);
    } else {
      console.error("Erro ao configurar a requisição:", error.message);
    }
  }
}

async function parse_pc_rs(html) {
  const $ = cheerio.load(html);
  let data = [];

  $(".card-desaparecido").each((index, element) => {
    const name = $(element).find(".card-desaparecido-nome").text().trim();
    const nascimento = $(element)
      .find(".card-desaparecido-info p")
      .eq(0)
      .text()
      .replace("Nascimento: ", "")
      .trim();
    const desaparecimento = $(element)
      .find(".card-desaparecido-info p strong")
      .eq(0)
      .text()
      .trim();
    const city = $(element)
      .find(".card-desaparecido-info p strong")
      .eq(1)
      .text()
      .trim();

    const photo = $(element).find(".card-desaparecido-imagem").attr("src");
    const link = $(element).find(".card-desaparecido-link").attr("href");

    data.push({
      name,
      nascimento,
      desaparecimento,
      city,
      photo,
      link,
    });
  });

  const desaparecidos = await Promise.all(
    data.map(async (pessoa) => {
      const { name, nascimento, desaparecimento, city, photo, link } = pessoa;
      let birthday = parse(nascimento, "dd/MM/yyyy", new Date());

      let others = {};

      let imgs = [];
      let main_photo = photo;
      if (
        !photo.startsWith(
          "/themes/modelo-noticias2/images/outros/silhuetas_desaparecidos"
        )
      ) {
        const matches = photo.toLowerCase().match(/(\d+)\/(\d+)\.jpg/);
        if (matches) {
          others["id1"] = Number(matches[1]);
          others["id2"] = Number(matches[2]);
        }
      } else {
        main_photo = "";
      }

      let gender;
      try {
        const genderize_data = await genderize(name, "BR");
        gender = genderize_data.gender == "male" ? 1 : 0;
        others = { ...others, gender_probability: genderize_data.probability };
      } catch (error) {
        gender = null;
      }

      let nationality;
      try {
        const nationalize_data = await nationalize(name);

        nationality = nationalize_data.country_id;
        if (nationalize_data.country[1] == "BR") {
          nationality = "BR";
        }

        others = { ...others, nationalize_data: nationalize_data.country };
      } catch (error) {
        nationality = "BR";
      }

      let location_history = [
        {
          visited_at: parse(
            desaparecimento,
            "dd/MM/yyyy",
            new Date()
          ).toISOString(),
          //neighborhood: "",
          city: city,
          uf: "RS",
          country: "BR",
        },
      ];

      return {
        name: name.toUpperCase(),
        birthday: birthday.toISOString(),
        gender,
        location_history,
        nationality,
        tattoo: "",
        main_photo,
        imgs,
        others: others,
      };
    })
  );

  return desaparecidos;
}

async function parse_pc_sc(jsonData) {
  const desaparecidos = await Promise.all(
    jsonData.map(async (pessoa) => {
      const name = pessoa.nomePessoa;
      const main_photo = `https://devs.pc.sc.gov.br/servicos/desaparecidos/images/${pessoa.numeroBasePessoa}/${pessoa.fotoPrincipal}.jpg`;

      let last_appearance = parse(
        pessoa.dataFato,
        "yyyy-MM-dd'T'HH:mm:ss.SSSX",
        new Date()
      );

      let birthday = last_appearance; // Calculando data nacimento
      birthday.setFullYear(
        birthday.getFullYear() - Number(pessoa.idadeDesaparecimento)
      );

      let gender = pessoa.sexo == "Masculino" ? 1 : 0;

      let nationality;
      try {
        const nationalize_data = await nationalize(name);

        nationality = nationalize_data.country_id;
        if (nationalize_data.country[1] == "BR") {
          nationality = "BR";
        }
      } catch (error) {
        nationality = "BR";
      }

      let location_history = [
        {
          visited_at: last_appearance.toISOString(),
          neighborhood: pessoa.bairro,
          city: pessoa.municipio,
          uf: "SC",
          country: "BR",
        },
      ];

      let imgs = pessoa.pics.map((e) => {
        return `https://devs.pc.sc.gov.br/servicos/desaparecidos/images/${pessoa.numeroBasePessoa}/${e}.jpg`;
      });

      return {
        name: name.toUpperCase(),
        birthday: birthday.toISOString(),
        gender,
        location_history,
        nationality,
        tattoo: pessoa.tatuagem,
        main_photo,
        imgs,
        others: { numeroBasePessoa: pessoa.numeroBasePessoa },
      };
    })
  );

  return desaparecidos;
}
