import { useEffect, useState } from "react";
import { RiUserSearchLine } from "react-icons/ri";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import ImageWithFallback from "../../components/ImageWithFallback";

export default function DesaparecidosPage({ data, meta }) {
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [estadoSelecionado, setEstadoSelecionado] = useState("");
  const [cidadeSelecionada, setCidadeSelecionada] = useState("");
  const [nome, setNome] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchEstados();
  }, []);

  useEffect(() => {
    if (estadoSelecionado) {
      fetchCidadesPorEstado(estadoSelecionado);
    } else {
      setCidades([]);
    }
  }, [estadoSelecionado]);

  const fetchEstados = async () => {
    const response = await fetch(
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome",
      {
        cache: "force-cache",
      }
    );
    const data = await response.json();
    setEstados(data);
  };

  const fetchCidadesPorEstado = async (estadoId) => {
    const response = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoId}/municipios?orderBy=nome`,
      {
        cache: "force-cache",
      }
    );
    const data = await response.json();
    console.log("fetchCidadesPorEstado", data);

    setCidades(data);
  };

  const handlePesquisa = (e) => {
    e.preventDefault();

    const query = {};
    if (nome) query.name = nome;
    if (estadoSelecionado) query.state = estadoSelecionado;
    if (cidadeSelecionada) query.city = cidadeSelecionada;

    // Redireciona para a página 1 com as queries
    router.push({
      pathname: "/desaparecidos/1",
      query,
    });
  };

  const { currentPage, totalPages } = meta;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-center">
        <form className="d-flex align-items-center" onSubmit={handlePesquisa}>
          <input
            className="form-control me-2"
            type="search"
            placeholder="Nome"
            aria-label="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <select
            className="form-select me-2"
            onChange={(e) => setEstadoSelecionado(e.target.value)}
            value={estadoSelecionado}
          >
            <option value="">Estado</option>
            {estados.map((estado) => (
              <option key={estado.id} value={estado.sigla}>
                {estado.nome}
              </option>
            ))}
          </select>
          <select
            className="form-select me-2"
            value={cidadeSelecionada}
            onChange={(e) => setCidadeSelecionada(e.target.value)}
            disabled={!estadoSelecionado}
          >
            <option value="">Cidade</option>
            {cidades.map((cidade) => (
              <option key={cidade.id} value={cidade.nome}>
                {cidade.nome}
              </option>
            ))}
          </select>
          <button
            className="btn btn-primary"
            type="submit"
            style={{ display: "inline-flex", alignItems: "center" }}
          >
            Pesquisar{" "}
            <RiUserSearchLine size={20} style={{ marginLeft: "5px" }} />
          </button>
        </form>
      </nav>
      <div className="container mt-5">
        <h1 className="mb-4 text-center">Lista de Desaparecidos</h1>
        <div className="row">
          {data.map((item) => (
            <div key={item.id} className="col-12 col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                {item.main_photo ? (
                  <ImageWithFallback
                    alt={item.name}
                    src={item.main_photo}
                    width={300}
                    height={200}
                    className="card-img-top img-fluid"
                    style={{
                      objectFit: "cover",
                      height: "300px",
                      width: "100%",
                    }}
                    fallbackSrc="/user.png"
                  />
                ) : (
                  <Image
                    src="/icons8-pessoa-do-sexo-masculino-100.png"
                    width={300}
                    height={200}
                    className="card-img-top img-fluid"
                    style={{
                      objectFit: "cover",
                      height: "300px",
                      width: "100%",
                    }}
                    alt={item.name}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text mb-1">
                    <strong>Data de Nascimento:</strong>{" "}
                    {new Date(item.birthday).toLocaleDateString()}
                  </p>
                  <p className="card-text mb-1">
                    <strong>Etnia:</strong> {item.nationality}
                  </p>
                  <p className="card-text mb-1">
                    <strong>Gênero:</strong>{" "}
                    {item.gender ? "Masculino" : "Feminino"}
                  </p>
                  {item.others && item.others.numeroBasePessoa && (
                    <p className="card-text mb-1">
                      <strong>Número Base Pessoa:</strong>{" "}
                      {item.others.numeroBasePessoa}
                    </p>
                  )}
                  {item.tattoo && item.tattoo !== "" && (
                    <p className="card-text mb-1">
                      <strong>Tatuagens:</strong> {item.tattoo}
                    </p>
                  )}

                  {item.location_history &&
                    item.location_history.length > 0 && (
                      <>
                        <h6 className="mt-3">Histórico de Localizações</h6>
                        <div className="table-responsive">
                          <table className="table table-sm">
                            <thead>
                              <tr>
                                <th>Data</th>
                                <th>Cidade</th>
                                <th>Bairro</th>
                                <th>UF</th>
                                <th>País</th>
                              </tr>
                            </thead>
                            <tbody>
                              {item.location_history.map((loc) => (
                                <tr key={loc.id}>
                                  <td>
                                    {new Date(
                                      loc.visited_at
                                    ).toLocaleDateString()}
                                  </td>
                                  <td>{loc.location.city}</td>
                                  <td>{loc.location.neighborhood || "-"}</td>
                                  <td>{loc.location.uf}</td>
                                  <td>{loc.location.country}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Paginação */}
        <nav aria-label="Page navigation" className="mt-4">
          <ul className="pagination justify-content-center">
            {/* Botão "Anterior" */}
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <Link
                className="page-link"
                href={{
                  pathname: `/desaparecidos/${currentPage - 1}`,
                  query: router.query,
                }}
                aria-label="Previous"
              >
                <span aria-hidden="true">&laquo;</span>
              </Link>
            </li>

            {/* Links para cada página */}
            {pages.map((page) => (
              <li
                key={page}
                className={`page-item ${page === currentPage ? "active" : ""}`}
              >
                <Link
                  className="page-link"
                  href={{
                    pathname: `/desaparecidos/${page}`,
                    query: router.query,
                  }}
                >
                  {page}
                </Link>
              </li>
            ))}

            {/* Botão "Próximo" */}
            <li className="page-item">
              <Link
                className="page-link"
                href={{
                  pathname: `/pessoas/${currentPage + 1}`,
                  query: router.query,
                }}
                aria-label="Next"
              >
                <span aria-hidden="true">&raquo;</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const page = Number(context.params.page) || 1;
  const { name, city, state } = context.query;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: "33",
  });

  if (name) queryParams.append("name", name);
  if (city) queryParams.append("city", city);
  if (state) queryParams.append("state", state);

  const res = await fetch(
    `http://${
      process.env.NEXT_PUBLIC_BASE_URL
        ? process.env.NEXT_PUBLIC_BASE_URL
        : "desapareicdos.vercel.app"
    }/api/desaparecidos?${queryParams.toString()}`
  );

  const json = await res.json();

  // Se a página não existe (ex: fora do range), redirecione
  if (!json.data || json.data.length === 0) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      data: json.data,
      meta: json.meta,
    },
  };
}
