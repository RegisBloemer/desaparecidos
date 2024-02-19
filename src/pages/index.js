import React, { useEffect, useState } from 'react';
import { RiUserSearchLine } from "react-icons/ri";

function LocalizacaoNavBar() {
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [estadoSelecionado, setEstadoSelecionado] = useState('');
  const [cidadeSelecionada, setCidadeSelecionada] = useState('');
  const [nome, setNome] = useState('');

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
    const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
    const data = await response.json();
    setEstados(data);
  };

  const fetchCidadesPorEstado = async (estadoId) => {
    const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoId}/municipios?orderBy=nome`);
    const data = await response.json();
    setCidades(data);
  };

  const handlePesquisa = (e) => {
    e.preventDefault();
    // Implemente a lógica de pesquisa aqui
    console.log("Pesquisar:", { nome, estadoSelecionado });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-center">
      <form className="d-flex align-items-center" onSubmit={handlePesquisa}>
        <input className="form-control me-2" type="search" placeholder="Nome" aria-label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        <select className="form-select me-2" onChange={(e) => setEstadoSelecionado(e.target.value)} value={estadoSelecionado}>
          <option value="">Estado</option>
          {estados.map((estado) => (
            <option key={estado.id} value={estado.id}>{estado.nome}</option>
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
            <option key={cidade.id} value={cidade.id}>{cidade.nome}</option>
          ))}
        </select>
        <button className="btn btn-primary" type="submit" style={{ display: 'inline-flex', alignItems: 'center' }}>
          Pesquisar <RiUserSearchLine size={20} style={{ marginLeft: '5px' }} />
        </button>
      </form>
    </nav>
  );
}

export default LocalizacaoNavBar;
