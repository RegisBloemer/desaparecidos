# Desaparecidos

## Backend

- Cria e gerencia um esquema de banco de dados relacional para armazenar informações de pessoas desaparecidas (incluindo onde foram vistas, imagens, etc.).
- Fornece um endpoint que:
  - Filtra e pagina resultados existentes no banco com base em parâmetros da requisição.
  - Caso os dados locais se esgotem, busca novos registros em serviços externos (do RS e SC).
  - Parseia e processa esses dados externos, enriquecendo-os com previsões de nacionalidade e gênero.
  - Armazena as novas informações no banco se não forem duplicadas.
  - Retorna os dados no formato JSON ao cliente.

## Frontend

- **Busca dinâmica de dados**:
  - Estados e cidades são carregados dinamicamente usando a API pública do IBGE.
- **Filtros de pesquisa**:
  - Nome, estado e cidade são usados para refinar os resultados.
- **Paginação**:
  - Os resultados são divididos em páginas e o usuário pode navegar entre elas.
- **Integração com API**:
  - Dados de desaparecidos são buscados de uma API personalizada.
- **Renderização condicional**:
  - Informações como histórico de localizações são exibidas apenas se estiverem disponíveis.
- **Fallbacks de imagem**:
  - Usa um fallback para imagens ausentes ou que falhem ao carregar.

## Pesquisa

1. **Diagnóstico do Problema:**

   - Identificação da gravidade do problema de desaparecimento no Brasil, com mais de 100 mil casos anuais.
   - Análise das causas e fatores relacionados, como conflitos familiares, questões criminais, saúde mental, entre outros.

2. **Pesquisa Preliminar:**

   - Coleta de dados iniciais sobre detetives e suas ferramentas de trabalho.
   - Levantamento de fontes de dados públicas e governamentais sobre desaparecidos.

3. **Tarefas e Recursos:**

   - Planejamento de tarefas específicas para auxiliar na solução do problema, como:
     - Busca de históricos de casos resolvidos para análise.
     - Desenvolvimento de formulários de cadastro de desaparecidos.
     - Integração de sistemas RSS para notificações automatizadas.
   - Disponibilização de links e fontes úteis, como bancos de dados e modelos de autorização.

4. **Estruturação de Dados:**

   - **Causas do desaparecimento:** Classificação detalhada com estatísticas por ano.
   - **Perfil demográfico:** Dados como faixas etárias, estaturas, pesos e preferências psicossociais.
   - **Perguntas-chave:** Lista de perguntas relevantes para investigações sobre desaparecidos, cobrindo aspectos físicos, sociais e psicológicos.

5. **Soluções e Funcionalidades Propostas:**

   - Ferramentas tecnológicas, como reconhecimento facial e simulação de envelhecimento.
   - Recursos para detetives, como plataformas de trabalho e sistemas de colaboração.
   - Soluções para aumentar a visibilidade de casos, como fóruns e integração com redes sociais.

6. **Fontes de Financiamento:**
   - Modelos de financiamento, como anúncios, doações e assinaturas para profissionais.
   - Engajamento de comunidades religiosas e sociais para apoio.

---

## Análise de casos de pessoas desaparecidas

### 1. **Estruturação de Dados**

- As informações foram organizadas em forma de tabela.
- Cada linha representar uma característica ou variável associada à pessoa desaparecida.
- Cada coluna representar uma pessoa desaparecida.

### 2. **Atributos Analisados**

- A tabela cobre uma ampla gama de aspectos:
  - **Características físicas**: IMC, altura, peso, idade.
  - **Comportamentais**: Se a pessoa fugiu, usava transporte público, estava empregada, entre outros.
  - **Circunstanciais**: Relacionamentos, viagens, posse de documentos, intenção de retornar, etc.
  - **Aspectos sociais e emocionais**: Felicidade, satisfação com a vida, esperança.
  - **Fatores ligados ao desaparecimento**: Se foi sequestrada, conflitos de guarda, ou relações familiares.

### 3. **Representação Numérica**

- Muitas variáveis foram codificadas numericamente:
  - **Binárias**: Sim/Não (1 ou -1, 0 ou -1).
  - **Escala parcial**: Por exemplo, 0,5, -0,5 para indicar um grau de incerteza.
  - **Contínuas**: Para dados como idade, IMC, TMB, e gordura corporal.

### 4. **Possíveis Objetivos**

- **Classificação ou Predição**:
  - Prever se uma pessoa foi encontrada, viveu ou não, ou quanto tempo levou para ser localizada.
  - Identificar padrões em casos de desaparecimento.
- **Análise Descritiva**:
  - Explorar características comuns ou fatores associados ao desaparecimento.
- **Identificação de Riscos**:
  - Compreender fatores de risco baseados nas características descritas.
- **Machine Learning/Modelos Estatísticos**:
  - Os dados poderiam ser usados em algoritmos para treinar modelos que identificam ou agrupam padrões similares em casos de desaparecimento.

---

Implementado um pipeline de **ETL (Extração, Transformação e Carregamento)** para coletar dados sobre pessoas desaparecidas do sistema **NamUs** e armazená-los em um banco de dados **DuckDB**.

1. **Extrair** dados sobre pessoas desaparecidas da API do NamUs, utilizando requisições paginadas para obter todos os registros disponíveis.
2. **Transformar** os dados, realizando requisições detalhadas para cada caso e tratando campos opcionais e complexos.
3. **Carregar** os dados transformados em um banco de dados DuckDB local, facilitando análises futuras e garantindo persistência dos dados coletados.
