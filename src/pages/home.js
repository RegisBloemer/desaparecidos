import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [dados, setDados] = useState({ rs: [], sc: [] });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const ITEMS_PER_PAGE = 3; // Definir o número de itens por página

  // Função para buscar os dados da API
  const fetchData = async (page) => {
    try {
      const response = await axios.get(`/api/desaparecidos?page=${page}`);
      setDados(response.data);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Erro ao buscar os dados', error);
    } finally {
      setLoading(false);
    }
  };

  // Chama a API ao carregar a página ou quando a página mudar
  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  if (loading) {
    return <div className="text-center">Carregando...</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Desaparecidos</h1>

      {/* Exibindo dados de RS */}
      <h2>Rio Grande do Sul</h2>
      <div className="row">
        {dados.rs.map((pessoa, index) => (
          <div key={index} className="col-md-4 mb-4">
            <div className="card">
              <img
                src={pessoa.pc_rs.foto_url}
                className="card-img-top"
                alt={pessoa.pc_rs.nome}
              />
              <div className="card-body">
                <h5 className="card-title">{pessoa.pc_rs.nome}</h5>
                <p className="card-text">
                  <strong>Data de Nascimento:</strong> {new Date(pessoa.pc_rs.birthday).toLocaleDateString()}
                  <br />
                  <strong>Última Aparição:</strong> {new Date(pessoa.pc_rs.last_appearance).toLocaleDateString()}
                  <br />
                  <strong>Local:</strong> {pessoa.pc_rs.local}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Exibindo dados de SC */}
      <h2 className="mt-5">Santa Catarina</h2>
      <div className="row">
        {dados.sc.map((pessoa, index) => (
          <div key={index} className="col-md-4 mb-4">
            <div className="card">
              <img
                src={pessoa.pc_sc.foto_url}
                className="card-img-top"
                alt={pessoa.pc_sc.nome}
              />
              <div className="card-body">
                <h5 className="card-title">{pessoa.pc_sc.nome}</h5>
                <p className="card-text">
                  <strong>Idade:</strong> {pessoa.pc_sc.idade} anos
                  <br />
                  <strong>Data do Desaparecimento:</strong> {new Date(pessoa.pc_sc.desaparecimento).toLocaleDateString()}
                  <br />
                  <strong>Município:</strong> {pessoa.pc_sc.municipio}
                  <br />
                  <strong>Bairro:</strong> {pessoa.pc_sc.bairro || 'Não informado'}
                  <br />
                  <strong>Sexo:</strong> {pessoa.pc_sc.sexo}
                  <br />
                  <strong>Tatuagens:</strong> {pessoa.pc_sc.tatuagem}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controles de Paginação */}
      <div className="d-flex justify-content-between mt-4">
        <button
          className="btn btn-primary"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage <= 0}
        >
          Página Anterior
        </button>
        <button
          className="btn btn-primary"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
        >
          Próxima Página
        </button>
      </div>
    </div>
  );
}
