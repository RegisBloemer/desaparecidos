import React, { useEffect, useState } from 'react';

function GaleriaPessoas() {
const [pessoas, setPessoas] = useState([]);

useEffect(() => {
const fetchPessoas = async () => {
    const response = await fetch('/pessoas_fakes.json');
    const data = await response.json();
    const pessoasOrdenadas = data.pessoas.sort((a, b) => new Date(b.create_time) - new Date(a.create_time));
    setPessoas(pessoasOrdenadas);
};

fetchPessoas();
}, []);

return (
<div className="galeria-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', padding: '20px' }}>
    {pessoas.map((pessoa) => (
    <div key={pessoa.id} className="pessoa-card" style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="pessoa-foto" style={{ width: '100px', height: '100px', backgroundColor: '#f0f0f0', borderRadius: '50%', marginBottom: '10px' }}></div>
        <div className="pessoa-info">
        <h4>{pessoa.name}</h4>
        <p>Altura: {pessoa.height}cm</p>
        <p>Cabelo: {pessoa.hair}</p>
        <p>Nacionalidade: {pessoa.nation}</p>
        </div>
    </div>
    ))}
</div>
);
}

export default GaleriaPessoas;
