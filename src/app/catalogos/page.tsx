"use client";

import { useState } from "react";

type Catalogo = {
  id: string;
  nome: string;
  descricao: string;
  pdf: string;
};

const catalogos: Catalogo[] = [
  {
    id: "oleos-odorizantes",
    nome: "Óleos Odorizantes",
    descricao: "Catálogo de fragrâncias para odorizantes e perfumaria",
    pdf: "/catalogos/oleos-odorizantes.pdf",
  },
];

export default function CatalogosPage() {
  const [selected, setSelected] = useState<Catalogo>(catalogos[0]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div className="header no-print" style={{ flexShrink: 0 }}>
        <div className="container header-inner">
          <a href="/" className="back-btn">← Voltar</a>
          <img src="/logo.jpg" alt="Tulipa" className="header-logo" />
          <div className="header-text">
            <h1>📖 Catálogos</h1>
            <p>Selecione um catálogo para visualizar</p>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 12, gap: 12, minHeight: 0 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {catalogos.map((c) => (
            <button key={c.id}
              onClick={() => setSelected(c)}
              style={{
                padding: "10px 20px", borderRadius: 12, border: selected.id === c.id ? "2px solid #15814a" : "2px solid #e2e8f0",
                background: selected.id === c.id ? "#f0f7f3" : "#fff", cursor: "pointer", fontWeight: selected.id === c.id ? 700 : 500,
                color: "#2d3748", fontSize: "0.9rem", fontFamily: "Barlow, sans-serif",
              }}
            >{c.nome}</button>
          ))}
        </div>

        <div style={{
          flex: 1, background: "#fff", borderRadius: 20, overflow: "hidden",
          border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}>
          <iframe
            src={selected.pdf + "#zoom=100"}
            style={{ width: "100%", height: "100%", border: "none" }}
            title={selected.nome}
          />
        </div>
      </div>
    </div>
  );
}
