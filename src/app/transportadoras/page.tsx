"use client";

import { useState } from "react";

const transportadoras = [
  {
    nome: "Transportadora A",
    iniciais: "TA",
    cidade: "Curitiba, PR",
    fretes: ["SP: R$ 80", "RJ: R$ 120", "MG: R$ 100"],
  },
  {
    nome: "Transportadora B",
    iniciais: "TB",
    cidade: "São José dos Pinhais, PR",
    fretes: ["SP: R$ 75", "RJ: R$ 110", "MG: R$ 95"],
  },
  {
    nome: "Transportadora C",
    iniciais: "TC",
    cidade: "Curitiba, PR",
    fretes: ["SP: R$ 90", "RJ: R$ 130", "MG: R$ 110"],
  },
  {
    nome: "Transportadora D",
    iniciais: "TD",
    cidade: "Colombo, PR",
    fretes: ["SP: R$ 85", "RJ: R$ 125", "MG: R$ 105"],
  },
];

export default function TransportadorasPage() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div>
      <div className="header no-print">
        <div className="container header-inner">
          <a href="/" className="back-btn">
            ← Voltar
          </a>
          <img src="/logo.jpg" alt="Tulipa" className="header-logo" />
          <div className="header-text">
            <h1>🚚 Transportadoras</h1>
            <p>Transportadoras próximas a Curitiba que atendem todo o Brasil</p>
          </div>
        </div>
      </div>
      <main style={{ minHeight: "calc(100vh - 60px)" }}>
        <div className="container">
          {transportadoras.map((t, idx) => (
            <div
              key={t.nome}
              className="transportadora-card"
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "18px 20px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 12,
                cursor: "pointer",
                transition: "all 0.3s",
                border:
                  selected === idx
                    ? "1.5px solid rgba(21,129,74,0.2)"
                    : "1.5px solid transparent",
              }}
              onClick={() => setSelected(selected === idx ? null : idx)}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: "linear-gradient(135deg,#15814a,#1a9a5a)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  flexShrink: 0,
                }}
              >
                {t.iniciais}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: "1rem", marginBottom: 2 }}>
                  {t.nome}
                </h4>
                <p style={{ fontSize: "0.8rem", color: "#64748b" }}>
                  {t.cidade}
                </p>
                {selected === idx && (
                  <div style={{ marginTop: 10 }}>
                    {t.fretes.map((frete) => (
                      <p
                        key={frete}
                        style={{
                          fontSize: "0.85rem",
                          color: "#15814a",
                          fontWeight: 600,
                        }}
                      >
                        {frete}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
                {selected === idx ? "▲" : "▼"}
              </div>
            </div>
          ))}
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
