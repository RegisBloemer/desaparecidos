import axios from "axios";
import * as cheerio from "cheerio";
import { parse } from "date-fns";

export default async function handler(req, res) {
  const { page = 1, per_page = 3 } = req.query;

  try {
    const response_rs = await axios.get(
      "https://www.pc.rs.gov.br/_service/desaparecidos/listhtml",
      {
        params: { pagina: page + 1 },
      }
    );

    const response_sc = await axios.get(
      "https://devs.pc.sc.gov.br/servicos/desaparecidos/dados",
      {
        params: { pagina: page, size: 3 },
      }
    );

    let dados = { rs: null, sc: null, pessoas: [] };

    // Verifica se a resposta contém dados
    if (!response_rs || !response_rs.data) {
      console.log("response_rs inválida ou vazia.");
    } else {
      dados.rs = await parse_pc_rs(response_rs.data);
    }

    // Verifica se a resposta contém dados
    if (!response_sc || !response_sc.data) {
      console.log("response_sc inválida ou vazia.");
    } else {
      dados.sc = await parse_pc_sc(response_sc.data);
    }

    res.status(200).json(dados);
  } catch (error) {
    console.error("Erro ao processar a solicitação:", error);
    res.status(500).json({ error: error.message });
  }
}

async function predict_name(name, country_id) {}

async function agify(name, country_id) {
  let data = {
    age: Number(),
  };

  try {
    const response = await axios.get(
      `https://api.agify.io?name=${name}&country_id=${country_id}`
    );

    data["age"] = Number(response.data["age"]);

    return data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;

      // Mapeamento de erros
      const errors = {
        401: "API key inválido",
        402: "Assinatura não ativa",
        422:
          data.error === "Missing 'name' parameter"
            ? "Parâmetro 'name' ausente"
            : "Parâmetro 'name' inválido",
        429:
          data.error === "Request limit reached"
            ? "Limite de requisições atingido"
            : "Limite de requisições baixo demais",
      };

      console.error(errors[status] || `Erro desconhecido: ${data.error}`);
    } else if (error.request) {
      console.error("Nenhuma resposta da API:", error.request);
    } else {
      console.error("Erro ao configurar a requisição:", error.message);
    }
  }
}

async function nationalize(name) {
  let data = {
    country_id: String(),
    country: [],
  };

  try {
    const response = await axios.get(`https://api.nationalize.io?name=${name}`);

    data["country_id"] = String(response.data["country"][0]["country_id"]);
    data["country"] = response.data.country;

    return data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;

      // Mapeamento de erros da Nationalize
      const errors = {
        401: "API key inválido",
        402: "Assinatura não ativa",
        422:
          data.error === "Missing 'name' parameter"
            ? "Parâmetro 'name' ausente"
            : "Parâmetro 'name' inválido",
        429:
          data.error === "Request limit reached"
            ? "Limite de requisições atingido"
            : "Limite de requisições baixo demais",
      };

      console.error(errors[status] || `Erro desconhecido: ${data.error}`);
    } else if (error.request) {
      console.error("Nenhuma resposta da API:", error.request);
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
    const response = await axios.get(
      `https://api.genderize.io?name=${name}&country_id=${country_id}`
    );

    data["gender"] = String(response.data["gender"]);
    data["probability"] = Number(response.data["probability"]);

    console.log("gen",response.data)
    return response.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;

      // Mapeamento de erros
      const errors = {
        401: "API key inválido",
        402: "Assinatura não ativa",
        422:
          data.error === "Missing 'name' parameter"
            ? "Parâmetro 'name' ausente"
            : "Parâmetro 'name' inválido",
        429:
          data.error === "Request limit reached"
            ? "Limite de requisições atingido"
            : "Limite de requisições baixo demais",
      };

      console.error(errors[status] || `Erro desconhecido: ${data.error}`);
    } else if (error.request) {
      console.error("Nenhuma resposta da API:", error.request);
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
      const { name, nascimento, desaparecimento, city, photo, link } =
        pessoa;
      let birthday = parse(nascimento, "dd/MM/yyyy", new Date());
      let last_appearance = parse(desaparecimento, "dd/MM/yyyy", new Date());

      let others = { };

      let imgs = [];
      let main_photo = photo
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
        main_photo = ""
      }

      let gender
      try {
        const genderize_data = await genderize(name, "BR");
        gender = genderize_data.gender == "male" ? 1 : 0;
        others = { ...others, gender_probability: genderize_data.probability };
      } catch (error) {
        console.log("catch genderize")
        gender = null
      }

      let nationality
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
          //neighborhood: "",
          city: city,
          uf: "RS",
          country: "BR",
        },
      ];

      return {
        name,
        birthday: birthday.toISOString(),
        last_appearance: last_appearance.toISOString(),
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
      const name = pessoa.nomePessoa
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

      let nationality
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
        `https://devs.pc.sc.gov.br/servicos/desaparecidos/images/${pessoa.numeroBasePessoa}/${e}.jpg`;
      });

      return {
        name,
        birthday: birthday.toISOString(),
        last_appearance: last_appearance.toISOString(),
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
