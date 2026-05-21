"use client";

import { useState } from "react";

const receitasPadrao = [
  {
    nome: "Desinfetante Lavanda",
    ingredientes: [
      "500ml de água",
      "100ml de álcool",
      "50ml de essência de lavanda",
      "30ml de limpador neutro",
    ],
    modo: "Misture todos os ingredientes em um recipiente. Agite bem e armazene em local fresco.",
  },
  {
    nome: "Limpa Vidros",
    ingredientes: [
      "500ml de água",
      "200ml de vinagre branco",
      "50ml de álcool",
    ],
    modo: "Misture os ingredientes em um borrifador. Agite antes de usar.",
  },
];

export default function ReceitasPage() {
  const [copied, setCopied] = useState(false);

  const compartilhar = (receita: (typeof receitasPadrao)[0]) => {
    const texto = `*${receita.nome}*\n\nIngredientes:\n${receita.ingredientes.map((i) => `• ${i}`).join("\n")}\n\nModo de preparo:\n${receita.modo}`;
    navigator.clipboard.writeText(texto).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div>
      <div className="header no-print">
        <div className="container header-inner">
          <a href="/" className="back-btn">
            ← Voltar
          </a>
          <img src="/logo.jpg" alt="Tulipa" className="header-logo" />
          <div className="header-text">
            <h1>🧪 Receitas</h1>
            <p>Receitas de produtos de limpeza</p>
          </div>
        </div>
      </div>
      <main style={{ minHeight: "calc(100vh - 60px)" }}>
        <div className="container">
          {copied && (
            <div
              style={{
                background: "#15814a",
                color: "#fff",
                padding: "12px 20px",
                borderRadius: 12,
                marginBottom: 16,
                textAlign: "center",
                fontWeight: 600,
              }}
            >
              ✅ Receita copiada!
            </div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 24,
            }}
          >
            {receitasPadrao.map((receita) => (
              <div
                key={receita.nome}
                style={{
                  background: "hsla(0,0%,100%,0.85)",
                  borderRadius: 20,
                  padding: 28,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  border: "1px solid hsla(0,0%,100%,0.7)",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.15rem",
                    color: "#0d5e35",
                    fontWeight: 700,
                    marginBottom: 16,
                  }}
                >
                  {receita.nome}
                </h3>

                <p
                  style={{
                    fontWeight: 600,
                    fontSize: "0.88rem",
                    color: "#2d3748",
                    marginBottom: 8,
                  }}
                >
                  Ingredientes:
                </p>
                <ul style={{ paddingLeft: 20, marginBottom: 16 }}>
                  {receita.ingredientes.map((ing) => (
                    <li
                      key={ing}
                      style={{
                        fontSize: "0.85rem",
                        color: "#64748b",
                        marginBottom: 4,
                      }}
                    >
                      {ing}
                    </li>
                  ))}
                </ul>

                <p
                  style={{
                    fontWeight: 600,
                    fontSize: "0.88rem",
                    color: "#2d3748",
                    marginBottom: 8,
                  }}
                >
                  Modo de preparo:
                </p>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "#64748b",
                    lineHeight: 1.5,
                    marginBottom: 20,
                  }}
                >
                  {receita.modo}
                </p>

                <button
                  className="btn btn-primary"
                  style={{ width: "100%" }}
                  onClick={() => compartilhar(receita)}
                >
                  📋 Copiar receita
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer
      style={{
        textAlign: "center",
        padding: "20px",
        fontSize: "0.8rem",
        color: "#94a3b8",
        borderTop: "1px solid #e2e8f0",
        background: "white",
      }}
    >
      <p>
        © {new Date().getFullYear()} VENDEDORAS - TULIPA · Feito para facilitar
        seu dia a dia 🌷
      </p>
    </footer>
  );
}
