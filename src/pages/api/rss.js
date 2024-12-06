import { Feed } from "feed";

const url = `http://${
  process.env.NEXT_PUBLIC_BASE_URL
    ? process.env.NEXT_PUBLIC_BASE_URL
    : "desapareicdos.vercel.app"
}`;

export default async function handler(req, res) {
  try {
    // Busca dados da API
    const response = await fetch(`${url}/api/desaparecidos?page=1&limit=6`);
    let data = await response.json();
    data = data.data || [];

    // Crie o feed
    const feed = new Feed({
      title: "Desaparecidos",
      description: "Lista de pessoas desaparecidas",
      id: url,
      link: url,
      language: "pt-BR",
      copyright: "CC BY-SA",
      updated: new Date(),
      generator: "Next.js + feed",
    });

    // Adicione itens ao feed
    data.forEach((item) => {
      const location = item.location_history?.[0]?.location || {};
      const city = location.city || "Cidade não informada";
      const neighborhood = location.neighborhood || "Bairro não informado";
      const nationality = item.nationality || "Nacionalidade não informada";
      const birthday = item.birthday
        ? new Date(item.birthday).toLocaleDateString("pt-BR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "Data de nascimento não informada";

      feed.addItem({
        title: item.name,
        id: item.id,
        link: `${url}/desaparecidos/1?name=${item.name}`,
        description: `Nome: ${item.name}. Nascimento: ${birthday}. Nacionalidade: ${nationality}. Última localização conhecida: ${city}${
          neighborhood !== "Bairro não informado" ? `, bairro ${neighborhood}` : ""
        }.`,
        date: new Date(item.birthday || Date.now()), // Garante que exista uma data válida
        image: item.main_photo || `${url}/images/placeholder.png`, // Placeholder se imagem não existir
      });
    });

    // Determine o formato do feed baseado no cabeçalho Accept
    const acceptHeader = req.headers.accept;

    if (acceptHeader.includes("application/atom+xml")) {
      res.setHeader("Content-Type", "application/atom+xml; charset=utf-8");
      res.write(feed.atom1());
    } else if (acceptHeader.includes("application/json")) {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.write(feed.json1());
    } else {
      // Padrão: RSS
      res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
      res.write(feed.rss2());
    }

    res.end();
  } catch (error) {
    console.error("Erro ao gerar o feed:", error);
    res.status(500).json({ message: "Erro ao gerar o feed", error: error.message });
  }
}
