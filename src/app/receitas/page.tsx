"use client";

import { useState } from "react";

type Receita = {
  nome: string;
  rendimento: string;
  ingredientes: string[];
  obs?: string;
  modo: string;
};

const receitas: Receita[] = [
  {
    nome: "Desinfetante de Pinho ou Mil Flores",
    rendimento: "40 litros",
    ingredientes: [
      "1 litro de concentrado de Pinho ou Mil Flores",
      "100ml de Fongrabac",
      "800ml de Cloreto de Benzalcônio",
      "500ml de detergente neutro",
      "20 gotas de corante verde ou roxo",
      "39 litros de água",
      "1 barrica de 50 litros",
    ],
    modo: "Coloque no recipiente todos os produtos em ordem e misture bem. Acrescente a água e misture novamente.",
  },
  {
    nome: "Desinfetante de Eucalipto",
    rendimento: "40 litros",
    ingredientes: [
      "1 litro de concentrado de Eucalipto",
      "100ml de Fongrabac",
      "800ml de Cloreto de Benzalcônio",
      "500ml de Brancol",
      "500ml de detergente neutro",
      "38 litros de água",
      "1 barrica de 50 litros",
    ],
    modo: "Coloque no recipiente todos os produtos em ordem e misture bem. Acrescente a água e misture novamente.",
  },
  {
    nome: "Alvejante sem Cloro",
    rendimento: "18 litros",
    ingredientes: [
      "1,800kg de Peróxido de Hidrogênio",
      "15,9 litros de água",
      "200ml de Laurel Líquido",
      "120ml de essência (Alve Fresh, Vonélia Fresh ou Vanish)",
      "Corante à base d'água (opcional, a gosto)",
      "Balde graduado de 20 litros",
      "Funil e espátula",
    ],
    modo: "Dissolva o peróxido de hidrogênio na água. Homogeneize. Adicione o laurel líquido e homogeneize. Adicione o corante (opcional) e a essência de sua preferência. Homogeneize novamente.",
  },
  {
    nome: "Água Sanitária (Alvejante)",
    rendimento: "10 / 50 / 200 litros",
    ingredientes: [
      "10L: 1kg Hipoclorito de Sódio 10/12% + 9L água + 100g Barrilha Leve",
      "50L: 5kg Hipoclorito de Sódio 10/12% + 45L água + 200g Barrilha Leve",
      "200L: 20kg Hipoclorito de Sódio 10/12% + 180L água + 1kg Barrilha Leve",
    ],
    modo: "Primeiro dissolva a barrilha na água. Depois coloque o hipoclorito e misture bem. Armazene em recipiente limpo.",
    obs: "Para fazer água sanitária perfumada, acrescente essência própria para a mesma.",
  },
  {
    nome: "Detergente com Amida",
    rendimento: "20 litros",
    ingredientes: [
      "17,460 litros de água",
      "800g de Ácido Sulfônico",
      "140g de Soda Líquida",
      "600g de Amida 60",
      "800ml de Laurel",
      "80ml de essência",
      "100g de Cloreto de Sódio",
      "Corante para detergente (a gosto)",
      "Balde graduado, bécker 1L, fita de pH, funil",
    ],
    modo: "Coloque a água no balde e verta o ácido sulfônico. Homogeneize. Adicione a amida 60 e homogeneize. Adicione a soda líquida e homogeneize. Meça o pH e corrija para 6,0 a 7,0. Adicione o laurel, a essência e o corante. Homogeneize. Adicione o cloreto de sódio aos poucos sob agitação lenta até obter a viscosidade desejada.",
    obs: "Para detergente neutro, exclua a essência e aumente 100ml de água.",
  },
  {
    nome: "Multi Uso",
    rendimento: "20 litros",
    ingredientes: [
      "18,7 litros de água",
      "200g de Ácido Sulfônico",
      "50ml de Soda Líquida",
      "600ml de Álcool Etílico",
      "400g de Butil Glicol",
      "50ml de essência",
      "Corante (a gosto)",
      "Balde graduado, bécker 1L, fita de pH, funil",
    ],
    modo: "Coloque a água no balde e adicione o ácido sulfônico. Homogeneize. Adicione a soda líquida e homogeneize. Meça o pH e corrija para 5,5 a 6,5. Adicione o álcool etílico e o butil glicol. Homogeneize. Adicione a essência e o corante. Homogeneize.",
  },
  {
    nome: "Limpeza Pesada",
    rendimento: "20 litros",
    ingredientes: [
      "11,4 litros de água",
      "8 litros de Detergente Neutro Tulipa",
      "100ml de Amoníaco",
      "200g de Cloreto de Sódio",
      "200g de Barrilha Leve",
      "Corante (a gosto)",
      "Balde graduado, bécker 1L, funil",
    ],
    modo: "Coloque a água no balde. Adicione o detergente e homogeneize. Adicione o amoníaco e o corante. Homogeneize. Adicione a barrilha leve aos poucos sob agitação. Adicione o cloreto de sódio até obter a viscosidade desejada.",
  },
  {
    nome: "Limpa Vidros",
    rendimento: "20 litros",
    ingredientes: [
      "16,6 litros de água",
      "1,6 litros de Álcool Etílico 96%",
      "80ml de Amoníaco",
      "200g de Renex 95",
      "1,4 litros de Detergente Neutro Tulipa",
      "80ml de essência Marine",
      "Corante (a gosto)",
      "Balde graduado, bécker 1L, funil",
    ],
    modo: "Coloque a água no balde. Adicione o álcool etílico, o amoníaco e o corante. Homogeneize. Dissolva a essência no Renex 95. Junte à fase anterior. Adicione o detergente sob agitação constante.",
  },
  {
    nome: "Amaciante de Roupas",
    rendimento: "40 litros",
    ingredientes: [
      "1kg de Base para Amaciante",
      "40 litros de água",
      "200ml de essência (fragrância de sua preferência)",
      "10 gotas de corante (opcional: azul, rosa ou amarelo)",
      "1 barrica de 50 litros",
    ],
    modo: "Coloque aproximadamente 5 litros de água na barrica. Adicione a base para amaciante e deixe descansar por 1 dia. No dia seguinte, bata e coloque o restante da água. Homogeneize. Acrescente o corante e a essência.",
    obs: "Deixe descansar para baixar a espuma.",
  },
];

function formatReceitaTexto(r: Receita) {
  let texto = `*${r.nome}*\n`;
  texto += `Rendimento: ${r.rendimento}\n\n`;
  texto += `*Ingredientes:*\n`;
  r.ingredientes.forEach((i) => (texto += `• ${i}\n`));
  if (r.obs) texto += `\n⚠️ ${r.obs}\n`;
  texto += `\n*Modo de preparo:*\n${r.modo}\n`;
  texto += `\n— Tulipa Essências 🌷`;
  return texto;
}

export default function ReceitasPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copiar = (r: Receita) => {
    navigator.clipboard.writeText(formatReceitaTexto(r)).then(() => {
      setCopiedId(r.nome);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const compartilharWhats = (r: Receita) => {
    const texto = encodeURIComponent(formatReceitaTexto(r));
    window.open(`https://wa.me/?text=${texto}`, "_blank");
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
            <p>Receitas de produtos de limpeza — Tulipa Essências</p>
          </div>
        </div>
      </div>
      <main style={{ minHeight: "calc(100vh - 60px)" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: 24,
            }}
          >
            {receitas.map((receita) => (
              <div
                key={receita.nome}
                className="receita-card"
                style={{
                  background: "hsla(0,0%,100%,0.85)",
                  borderRadius: 20,
                  padding: 28,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  border: "1px solid hsla(0,0%,100%,0.7)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <h3
                    style={{
                      fontSize: "1.15rem",
                      color: "#0d5e35",
                      fontWeight: 700,
                    }}
                  >
                    {receita.nome}
                  </h3>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      background: "#e8f5ee",
                      color: "#0d5e35",
                      padding: "4px 10px",
                      borderRadius: 20,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {receita.rendimento}
                  </span>
                </div>

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
                <ul style={{ paddingLeft: 20, marginBottom: 12, flex: 1 }}>
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

                {receita.obs && (
                  <p
                    style={{
                      fontSize: "0.82rem",
                      color: "#b8860b",
                      background: "#fffbe6",
                      padding: "8px 12px",
                      borderRadius: 8,
                      marginBottom: 12,
                      lineHeight: 1.4,
                    }}
                  >
                    ⚠️ {receita.obs}
                  </p>
                )}

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

                {copiedId === receita.nome && (
                  <div
                    style={{
                      background: "#15814a",
                      color: "#fff",
                      padding: "8px 16px",
                      borderRadius: 10,
                      marginBottom: 10,
                      textAlign: "center",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                    }}
                  >
                    ✅ Receita copiada!
                  </div>
                )}

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                    onClick={() => copiar(receita)}
                  >
                    📋 Copiar
                  </button>
                  <button
                    className="btn"
                    style={{
                      flex: 1,
                      background: "#25D366",
                      color: "#fff",
                    }}
                    onClick={() => compartilharWhats(receita)}
                  >
                    📱 WhatsApp
                  </button>
                </div>
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
