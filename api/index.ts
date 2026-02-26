import express from "express";
import cors from "cors";
import pg from "pg";

const { Pool } = pg;

// Configuração do Banco de Dados (Supabase)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Middleware de Log
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// --- ROTAS DE AUTENTICAÇÃO ---
app.post("/api/auth/signup", async (req, res) => {
  const { email, password, profile } = req.body;
  try {
    const check = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (check.rows.length > 0) {
      return res.status(400).json({ error: "Este e-mail já está cadastrado." });
    }
    const result = await pool.query(
      'INSERT INTO users (email, password, profile) VALUES ($1, $2, $3) RETURNING *',
      [email, password, profile]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao cadastrar usuário." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password, profile } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND password = $2 AND profile = $3',
      [email, password, profile]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(401).json({ error: "E-mail ou senha incorretos." });
    }
  } catch (err) {
    res.status(500).json({ error: "Erro ao realizar login." });
  }
});

// --- ROTAS DE ESTOQUE ---
app.get("/api/estoque", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, descricao, unidade_medida as "unidadeMedida", 
             quantidade_atual as "quantidadeAtual", 
             quantidade_minima as "quantidadeMinima", 
             localizacao FROM estoque ORDER BY descricao
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar estoque." });
  }
});

app.post("/api/estoque", async (req, res) => {
  const item = req.body;
  try {
    await pool.query(
      `INSERT INTO estoque (id, descricao, unidade_medida, quantidade_atual, quantidade_minima, localizacao) 
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO UPDATE SET 
       descricao = EXCLUDED.descricao, unidade_medida = EXCLUDED.unidade_medida,
       quantidade_atual = EXCLUDED.quantidade_atual, quantidade_minima = EXCLUDED.quantidade_minima,
       localizacao = EXCLUDED.localizacao`,
      [item.id, item.descricao, item.unidadeMedida, item.quantidadeAtual, item.quantidadeMinima, item.localizacao]
    );
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Erro ao salvar item no estoque." });
  }
});

// --- ROTAS DE SOLICITAÇÕES ---
app.get("/api/solicitacoes", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.id, s.solicitante_nome as "solicitanteNome", 
             s.data_solicitacao as "dataSolicitacao", s.status,
             COALESCE(json_agg(json_build_object('itemId', i.item_id, 'quantidadeSolicitada', i.quantidade_solicitada)) 
             FILTER (WHERE i.item_id IS NOT NULL), '[]') as itens
      FROM solicitacoes s
      LEFT JOIN itens_solicitados i ON s.id = i.solicitacao_id
      GROUP BY s.id ORDER BY s.data_solicitacao DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar solicitações." });
  }
});

// Exportação para Vercel (Importante!)
export default app;

// Inicialização local
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Backend rodando em http://localhost:${PORT}`);
  });
}