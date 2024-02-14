// pages/api/pessoas/search.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { query } = req.query;
        try {
            const pessoas = await prisma.pessoas.findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        // Adicione outras condições de pesquisa aqui, se necessário
                    ],
                },
            });
            if (pessoas.length > 0) {
                res.status(200).json(pessoas);
            } else {
                res.status(404).json({ message: 'Nenhuma pessoa encontrada.' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Falha ao buscar pessoas' });
        }
    } else {
        // Handle any other HTTP method
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
