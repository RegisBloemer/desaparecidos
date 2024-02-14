// pages/api/pessoas/latest.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            // Buscar as últimas pessoas adicionadas ordenadas por create_time em ordem decrescente
            const latestPessoas = await prisma.pessoas.findMany({
                orderBy: {
                    create_time: 'desc',
                },
                take: 10, // Limita o número de resultados, ajuste conforme necessário
                include: {
                    location: true, // Inclui informações de localização se necessário
                    comments: true, // Inclui comentários se necessário
                },
            });
            res.status(200).json(latestPessoas);
        } catch (error) {
            res.status(500).json({ error: "Falha ao buscar as últimas pessoas adicionadas." });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
