
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
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">Pessoas Desaparecidas</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <a className="nav-link" href="#">Início <span className="sr-only">(current)</span></a>
            </li>
            {/* Outros itens do menu, se necessário */}
          </ul>
          <form className="form-inline my-2 my-lg-0" onSubmit={handleSearch}>
            <input className="form-control mr-sm-2" type="search" placeholder="Nome" aria-label="Nome" onChange={(e) => setSearchTerm(e.target.value)} />
            <select className="form-control mr-sm-2" aria-label="Pais">
              <option selected>Pais</option>
              {/* Substitua pelos estados */}
              <option value="1">Brasil</option>
              <option value="2">Argentina</option>
            </select>
            <select className="form-control mr-sm-2" aria-label="Estado">
              <option selected>Estado</option>
              {/* Substitua pelos estados */}
              <option value="1">São Paulo</option>
              <option value="2">Rio de Janeiro</option>
            </select>
            <select className="form-control mr-sm-2" aria-label="Cidade">
              <option selected>Cidade</option>
              {/* Substitua pelas cidades */}
              <option value="1">São Paulo</option>
              <option value="2">Rio de Janeiro</option>
            </select>
            <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Pesquisar</button>
          </form>
        </div>
      </nav>
      <div className="container mt-5">
        {message && <p>{message}</p>}
        <h2>{searchResults.length > 0 ? 'Resultados da Pesquisa' : 'Últimas Pessoas Adicionadas'}</h2>
        <div className="list-group">
          {(searchResults.length > 0 ? searchResults : pessoas).map((pessoa) => (
            <a href="#" className="list-group-item list-group-item-action" key={pessoa.id}>
              <h5 className="mb-1">{pessoa.name}</h5>
              {/* Inclua mais detalhes que você deseja mostrar */}
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

