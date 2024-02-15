import React, { useEffect, useState } from 'react';

export default function Home() {
  const [pessoas, setPessoas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchLatest() {
      const response = await fetch('/api/pessoas/latest');
      const data = await response.json();
      setPessoas(data);
    }
    fetchLatest();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault(); // Previne o recarregamento da página
    const response = await fetch(`/api/pessoas/search?query=${searchTerm}`);
    if (response.ok) {
      const data = await response.json();
      setSearchResults(data);
      setMessage('');
    } else {
      const error = await response.json();
      setMessage(error.message);
      setSearchResults([]);
    }
  };

  // Certifique-se de que searchResults e pessoas são sempre arrays
  const list = searchResults.length > 0 ? searchResults : pessoas;
  const listToRender = Array.isArray(list) ? list : [];

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand col-3 text-center" href="#">Buscar Pessoas Desaparecidas</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavDropdown">

          <form className="form-inline my-2 my-lg-0 col" onSubmit={handleSearch}>
            <div className="row">
              <div className="col-4 mb-2">
                <input className="form-control" type="search" placeholder="Nome" aria-label="Nome" onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <div className="col-3 mb-2">
                <select className="form-control" aria-label="Pais">
                  <option selected>País</option>
                  {/* Substitua pelos países */}
                  <option value="1">Brasil</option>
                  <option value="2">Argentina</option>
                </select>
              </div>
              <div className="col-3 mb-2 ml">
                <select className="form-control" aria-label="Estado">
                  <option selected>Estado</option>
                  {/* Substitua pelos estados */}
                  <option value="1">São Paulo</option>
                  <option value="2">Rio de Janeiro</option>
                </select>
              </div>
              <div className="col-4 mb-2">
                <select className="form-control" aria-label="Cidade">
                  <option selected>Cidade</option>
                  {/* Substitua pelas cidades */}
                  <option value="1">São Paulo</option>
                  <option value="2">Rio de Janeiro</option>
                </select>
              </div>
              <div className="col mb-2">
                <button className="btn btn-outline-success " type="submit">Pesquisar</button>
              </div>
            </div>
        </form>
        </div>
      </nav>
      <div className="container mt-5">
        {message && <p>{message}</p>}
        <h2>{listToRender.length > 0 ? 'Resultados da Pesquisa' : 'Últimas Pessoas Adicionadas'}</h2>
        <div className="list-group">
          {listToRender.map((pessoa) => (
            <a href="#" className="list-group-item list-group-item-action" key={pessoa.id}>
              <h5 className="mb-1">{pessoa.name}</h5>
              {/* Inclua mais detalhes que você deseja mostrar */}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
