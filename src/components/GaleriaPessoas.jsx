import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Image, Pagination } from 'react-bootstrap';

function GaleriaPessoas() {
    const [pessoas, setPessoas] = useState([]);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const pessoasPorPagina = 16;
    const indiceUltimaPessoa = paginaAtual * pessoasPorPagina;
    const indicePrimeiraPessoa = indiceUltimaPessoa - pessoasPorPagina;
    const pessoasAtuais = pessoas.slice(indicePrimeiraPessoa, indiceUltimaPessoa);
    const totalPaginas = Math.ceil(pessoas.length / pessoasPorPagina);

    useEffect(() => {
        const fetchPessoas = async () => {
            const response = await fetch('/pessoas_fakes.json');
            const data = await response.json();
            const pessoasOrdenadas = data.pessoas.sort((a, b) => new Date(b.create_time) - new Date(a.create_time));
            setPessoas(pessoasOrdenadas);
        };

        fetchPessoas();
    }, []);

    let items = [];
    for (let number = 1; number <= totalPaginas; number++) {
        items.push(
            <Pagination.Item key={number} active={number === paginaAtual} onClick={() => setPaginaAtual(number)}>
                {number}
            </Pagination.Item>,
        );
    }

    return (
        <Container style={{ padding: '20px' }}>
            <h2 className="text-center mb-4">Pessoas desaparecidas recentemente</h2>
            <Row xs={1} md={4} className="g-4">
                {pessoasAtuais.map((pessoa) => (
                    <Col key={pessoa.id}>
                        <Card>
                            <Card.Body className="text-center">
                                <Image src="path/to/image" roundedCircle style={{ width: '100px', height: '100px', backgroundColor: '#f0f0f0' }} />
                                <Card.Title>{pessoa.name}</Card.Title>
                                <Card.Text>
                                    Altura: {pessoa.height}cm<br />
                                    Cabelo: {pessoa.hair}<br />
                                    Nacionalidade: {pessoa.nation}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <Pagination className="justify-content-center mt-4">{items}</Pagination>
        </Container>
    );
}

export default GaleriaPessoas;
