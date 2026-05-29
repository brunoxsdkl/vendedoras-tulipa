"use client";

import { useState, useMemo } from "react";

type Ingrediente = {
  nome: string;
  quantidade: number;
  unidade: string;
};

type ReceitaCalc = {
  nome: string;
  rendimentoL: number;
  ingredientes: Ingrediente[];
  obs?: string;
};

const receitas: ReceitaCalc[] = [
  {
    nome: "Desinfetante de Pinho ou Mil Flores",
    rendimentoL: 40,
    ingredientes: [
      { nome: "Concentrado de Pinho ou Mil Flores", quantidade: 1, unidade: "L" },
      { nome: "Fongrabac", quantidade: 100, unidade: "ml" },
      { nome: "Cloreto de Benzalcônio", quantidade: 800, unidade: "ml" },
      { nome: "Detergente neutro", quantidade: 500, unidade: "ml" },
      { nome: "Corante verde ou roxo", quantidade: 20, unidade: "gotas" },
      { nome: "Água", quantidade: 39, unidade: "L" },
    ],
  },
  {
    nome: "Desinfetante de Eucalipto",
    rendimentoL: 40,
    ingredientes: [
      { nome: "Concentrado de Eucalipto", quantidade: 1, unidade: "L" },
      { nome: "Fongrabac", quantidade: 100, unidade: "ml" },
      { nome: "Cloreto de Benzalcônio", quantidade: 800, unidade: "ml" },
      { nome: "Brancol", quantidade: 500, unidade: "ml" },
      { nome: "Detergente neutro", quantidade: 500, unidade: "ml" },
      { nome: "Água", quantidade: 38, unidade: "L" },
    ],
  },
  {
    nome: "Alvejante sem Cloro",
    rendimentoL: 18,
    ingredientes: [
      { nome: "Peróxido de Hidrogênio", quantidade: 1.8, unidade: "kg" },
      { nome: "Água", quantidade: 15.9, unidade: "L" },
      { nome: "Laurel Líquido", quantidade: 200, unidade: "ml" },
      { nome: "Essência (Alve Fresh, Vonélia Fresh ou Vanish)", quantidade: 120, unidade: "ml" },
    ],
  },
  {
    nome: "Água Sanitária",
    rendimentoL: 10,
    ingredientes: [
      { nome: "Hipoclorito de Sódio 10/12%", quantidade: 1, unidade: "kg" },
      { nome: "Água", quantidade: 9, unidade: "L" },
      { nome: "Barrilha Leve", quantidade: 100, unidade: "g" },
    ],
    obs: "Para 50L: 5kg hipoclorito + 45L água + 200g barrilha | Para 200L: 20kg + 180L + 1kg",
  },
  {
    nome: "Detergente com Amida",
    rendimentoL: 20,
    ingredientes: [
      { nome: "Água", quantidade: 17.46, unidade: "L" },
      { nome: "Ácido Sulfônico", quantidade: 800, unidade: "g" },
      { nome: "Soda Líquida", quantidade: 140, unidade: "ml" },
      { nome: "Amida 60", quantidade: 600, unidade: "g" },
      { nome: "Laurel", quantidade: 800, unidade: "ml" },
      { nome: "Essência", quantidade: 80, unidade: "ml" },
      { nome: "Cloreto de Sódio", quantidade: 100, unidade: "g" },
    ],
    obs: "Para detergente neutro, exclua essência e +100ml água",
  },
  {
    nome: "Multi Uso",
    rendimentoL: 20,
    ingredientes: [
      { nome: "Água", quantidade: 18.7, unidade: "L" },
      { nome: "Ácido Sulfônico", quantidade: 200, unidade: "g" },
      { nome: "Soda Líquida", quantidade: 50, unidade: "ml" },
      { nome: "Álcool Etílico", quantidade: 600, unidade: "ml" },
      { nome: "Butil Glicol", quantidade: 400, unidade: "g" },
      { nome: "Essência", quantidade: 50, unidade: "ml" },
    ],
  },
  {
    nome: "Limpeza Pesada",
    rendimentoL: 20,
    ingredientes: [
      { nome: "Água", quantidade: 11.4, unidade: "L" },
      { nome: "Detergente Neutro Tulipa", quantidade: 8, unidade: "L" },
      { nome: "Amoníaco", quantidade: 100, unidade: "ml" },
      { nome: "Cloreto de Sódio", quantidade: 200, unidade: "g" },
      { nome: "Barrilha Leve", quantidade: 200, unidade: "g" },
    ],
  },
  {
    nome: "Limpa Vidros",
    rendimentoL: 20,
    ingredientes: [
      { nome: "Água", quantidade: 16.6, unidade: "L" },
      { nome: "Álcool Etílico 96%", quantidade: 1.6, unidade: "L" },
      { nome: "Amoníaco", quantidade: 80, unidade: "ml" },
      { nome: "Renex 95", quantidade: 200, unidade: "g" },
      { nome: "Detergente Neutro Tulipa", quantidade: 1.4, unidade: "L" },
      { nome: "Essência Marine", quantidade: 80, unidade: "ml" },
    ],
  },
  {
    nome: "Amaciante de Roupas",
    rendimentoL: 40,
    ingredientes: [
      { nome: "Base para Amaciante", quantidade: 1, unidade: "kg" },
      { nome: "Água", quantidade: 40, unidade: "L" },
      { nome: "Essência (fragrância preferida)", quantidade: 200, unidade: "ml" },
      { nome: "Corante (azul, rosa ou amarelo)", quantidade: 10, unidade: "gotas" },
    ],
    obs: "Deixe descansar para baixar a espuma",
  },
];

function fmt(v: number, uni: string): string {
  const rounded = uni === "gotas" ? Math.round(v) : v < 1 ? v.toFixed(2) : v < 10 ? v.toFixed(1) : Math.round(v).toString();
  return `${rounded} ${uni}`;
}

export default function CalculadoraPage() {
  const [selected, setSelected] = useState<ReceitaCalc | null>(null);
  const [desejado, setDesejado] = useState("");

  const proporcao = useMemo(() => {
    if (!selected || !desejado) return null;
    const vol = parseFloat(desejado.replace(",", "."));
    if (isNaN(vol) || vol <= 0) return null;
    return vol / selected.rendimentoL;
  }, [selected, desejado]);

  return (
    <div>
      <div className="header no-print">
        <div className="container header-inner">
          <a href="/" className="back-btn">← Voltar</a>
          <img src="/logo.jpg" alt="Tulipa" className="header-logo" />
          <div className="header-text">
            <h1>🧮 Calculadora de Diluição</h1>
            <p>Calcule as quantidades proporcionais das receitas</p>
          </div>
        </div>
      </div>
      <main style={{ minHeight: "calc(100vh - 60px)" }}>
        <div className="container" style={{ maxWidth: 800, margin: "0 auto", padding: "24px 20px" }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: 24, marginBottom: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" }}>
            <p style={{ fontWeight: 700, fontSize: "1rem", color: "#0d5e35", marginBottom: 16 }}>1. Selecione a receita</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {receitas.map((r) => (
                <button key={r.nome}
                  onClick={() => { setSelected(r); setDesejado(""); }}
                  style={{
                    textAlign: "left", padding: "14px 18px", borderRadius: 14, border: selected?.nome === r.nome ? "2px solid #15814a" : "2px solid #e2e8f0",
                    background: selected?.nome === r.nome ? "#f0f7f3" : "#fff", cursor: "pointer",
                    fontWeight: selected?.nome === r.nome ? 700 : 500, fontSize: "0.95rem", color: "#2d3748",
                    fontFamily: "Barlow, sans-serif", transition: "all 0.15s",
                  }}
                >
                  {r.nome} <span style={{ color: "#64748b", fontWeight: 400, fontSize: "0.85rem" }}>— {r.rendimentoL}L</span>
                </button>
              ))}
            </div>
          </div>

          {selected && (
            <div style={{ background: "#fff", borderRadius: 20, padding: 24, marginBottom: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" }}>
              <p style={{ fontWeight: 700, fontSize: "1rem", color: "#0d5e35", marginBottom: 4 }}>
                2. Desejo fazer
              </p>
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <input type="text" inputMode="decimal" value={desejado} placeholder="Ex: 5"
                  onChange={(e) => setDesejado(e.target.value)}
                  style={{ width: 120, padding: "14px 18px", border: "2px solid #e2e8f0", borderRadius: 14, fontSize: "1rem", fontFamily: "Barlow, sans-serif", textAlign: "center" }}
                />
                <span style={{ fontWeight: 600, color: "#2d3748", fontSize: "1rem" }}>litros</span>
                <span style={{ color: "#64748b", fontSize: "0.85rem" }}>(receita original: {selected.rendimentoL}L)</span>
              </div>
            </div>
          )}

          {selected && proporcao && proporcao > 0 && (
            <div style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
                <h2 style={{ fontSize: "1.1rem", color: "#0d5e35", fontWeight: 700 }}>
                  📋 {selected.nome}
                </h2>
                <span style={{ background: "#e8f5ee", color: "#0d5e35", padding: "4px 12px", borderRadius: 20, fontWeight: 600, fontSize: "0.85rem" }}>
                  Para {desejado}L <span style={{ opacity: 0.6 }}>({Math.round(proporcao * 100)}%)</span>
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {selected.ingredientes.map((ing) => (
                  <div key={ing.nome}
                    style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "12px 16px", borderRadius: 12, background: "#f8fafc", border: "1px solid #e2e8f0",
                    }}
                  >
                    <span style={{ fontWeight: 500, fontSize: "0.9rem", color: "#2d3748" }}>{ing.nome}</span>
                    <span style={{ fontWeight: 700, fontSize: "1rem", color: "#15814a" }}>
                      {fmt(ing.quantidade * proporcao, ing.unidade)}
                    </span>
                  </div>
                ))}
              </div>

              {selected.obs && (
                <p style={{ marginTop: 14, fontSize: "0.82rem", color: "#b8860b", background: "#fffbe6", padding: "10px 14px", borderRadius: 10, lineHeight: 1.4 }}>
                  ⚠️ {selected.obs}
                </p>
              )}

              <button className="btn btn-secondary" style={{ width: "100%", marginTop: 16 }}
                onClick={() => { setSelected(null); setDesejado(""); }}>
                🔄 Nova consulta
              </button>
            </div>
          )}

          {selected && desejado && !proporcao && (
            <p style={{ color: "#e74c3c", fontSize: "0.85rem", fontWeight: 600 }}>Digite um volume válido</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer style={{ textAlign: "center", padding: "20px", fontSize: "0.8rem", color: "#94a3b8", borderTop: "1px solid #e2e8f0", background: "white" }}>
      <p>© {new Date().getFullYear()} VENDEDORAS - TULIPA · Feito para facilitar seu dia a dia 🌷</p>
    </footer>
  );
}
