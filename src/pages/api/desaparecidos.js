import axios from "axios";
import * as cheerio from "cheerio";
import { parse } from "date-fns";


export default async function handler(req, res) {
  const { page = 1, per_page = 3 } = req.query;

  try {
    const response_rs = await axios.get(
      "https://www.pc.rs.gov.br/_service/desaparecidos/listhtml",
      {
        params: { pagina: page+1 },
      }
    );

    const response_sc = await axios.get(
      "https://devs.pc.sc.gov.br/servicos/desaparecidos/dados",
      {
        params: { pagina: page, size: 3 },
      }
    );

    let dados = {rs: null, sc: null, pessoas: []}

    // Verifica se a resposta contém dados
    if (!response_rs || !response_rs.data) {
      console.log("response_rs inválida ou vazia.");
    } else {
      dados.rs = parsePcRSData(response_rs.data)
    }

    // Verifica se a resposta contém dados
    if (!response_sc || !response_sc.data) {
      console.log("response_sc inválida ou vazia.");
    } else {
      dados.sc = parsePcSCData(response_sc.data)
    }

    res.status(200).json(dados);
  } catch (error) {
    console.error("Erro ao processar a solicitação:", error);
    res.status(500).json({ error: error.message });
  }
}

async function predict_name(name) {
  const genderize_apikey = process.env.GENDERIZE_APIKEY; // Variável de ambiente do servidor

  axios.request({
    method: 'get',
    url: `https://api.genderize.io?name=${name}&country_id=BR&apikey=${genderize_apikey}`
  })
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });

}

function parsePcRSData(html) {
  const $ = cheerio.load(html);
  const desaparecidos = [];

  $(".card-desaparecido").each((index, element) => {
    const nome = $(element).find(".card-desaparecido-nome").text().trim();
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
    const local = $(element)
      .find(".card-desaparecido-info p strong")
      .eq(1)
      .text()
      .trim();
    const foto_url = $(element).find(".card-desaparecido-imagem").attr("src");
    const link = $(element).find(".card-desaparecido-link").attr("href");

    let birthday = parse(nascimento, "dd/MM/yyyy", new Date());
    let last_appearance = parse(desaparecimento, "dd/MM/yyyy", new Date());

    let pc_rs = {
      nome,
      birthday: birthday.toISOString(),
      last_appearance: last_appearance.toISOString(),
      local,
      foto_url,
      sexo: null,
      id1: null,
      id2: null,
    };

    let imgs = [];
    if (
      !foto_url.startsWith(
        "/themes/modelo-noticias2/images/outros/silhuetas_desaparecidos"
      )
    ) {
      const matches = foto_url.match(/(\d+)\/(\d+)\.JPG/);
      if (matches) {
        pc_rs["id1"] = Number(matches[1]);
        pc_rs["id2"] = Number(matches[2]);
        imgs.push(
          `https://www.delegaciaonline.rs.gov.br/dol/api/desaparecidos/consultaFoto/${pc_rs["id1"]}/${pc_rs["id1"]}.JPG`
        );
      }
    }

    desaparecidos.push({
      pc_rs,
      imgs,
    });
  });

  return desaparecidos;
}

function parsePcSCData(jsonData) {
  const desaparecidos = [];

  jsonData.forEach((pessoa) => {
    const nome = pessoa.nomePessoa;
    const idade = pessoa.idadeDesaparecimento;
    const desaparecimento = pessoa.dataFato; // já vem em formato ISO, então podemos usar diretamente
    const municipio = pessoa.municipio;
    const bairro = pessoa.bairro;
    const sexo = pessoa.sexo;
    const foto_url = `https://devs.pc.sc.gov.br/servicos/desaparecidos/images/${pessoa.numeroBasePessoa}/${pessoa.fotoPrincipal}.jpg`;
    const tatuagem = pessoa.tatuagem || "Nenhuma";

    let last_appearance = parse(desaparecimento, "yyyy-MM-dd'T'HH:mm:ss.SSSX", new Date());

    // Cria um novo objeto Date para a data atual
    let birthday = new Date();

    // Subtrai 10 anos da data atual
    birthday.setFullYear(birthday.getFullYear() - Number(idade));

    let pc_sc = {
      nome,
      birthday: birthday.toISOString(),
      last_appearance: last_appearance.toISOString(),
      municipio,
      bairro,
      sexo,
      tatuagem,
      foto_url,
      id1: pessoa.numeroBasePessoa,
      id2: pessoa.fotoPrincipal,
    };

    desaparecidos.push({
      pc_sc,
      imgs: [foto_url], // Usamos o URL da foto principal diretamente
    });
  });

  return desaparecidos;
}
