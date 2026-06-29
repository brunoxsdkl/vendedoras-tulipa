"use client";

import { useState, useMemo } from "react";
import produtos from "@/data/oleos-essenciais.json";

function formatPreco(valor: number | null) {
  if (valor === null) return null;
  return `R$ ${valor.toFixed(2).replace(".", ",")}`;
}

export default function OleosEssenciaisPage() {
  const [selected, setSelected] = useState<number | null>(null);

  const produto = useMemo(
    () => (selected !== null ? produtos.find((p) => p.id === selected) : null),
    [selected]
  );

  function shareWhatsApp(nome: string) {
    const msg = encodeURIComponent(
      `🫧 Óleo Essencial - ${nome}\n\nConfira o catálogo completo: ${window.location.origin}/catalogos`
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  }

  if (selected !== null && produto) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#000" }}>
        <div className="header no-print" style={{ flexShrink: 0 }}>
          <div className="container header-inner">
            <button className="back-btn" onClick={() => setSelected(null)}>← Voltar</button>
            <img src="/logo.jpg" alt="Tulipa" className="header-logo" />
            <div className="header-text">
              <h1>{produto.nome}</h1>
              <p>Óleo Essencial 10ml</p>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {produto.preco && (
                <span style={{
                  background: "rgba(255,255,255,0.15)", padding: "6px 14px",
                  borderRadius: 8, fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.02em"
                }}>
                  {formatPreco(produto.preco)}
                </span>
              )}
              <button onClick={() => shareWhatsApp(produto.nome)}
                style={{
                  background: "#25d366", color: "#fff", border: "none",
                  padding: "8px 16px", borderRadius: 10, fontWeight: 700, fontSize: "0.9rem",
                  cursor: "pointer", fontFamily: "Barlow, sans-serif",
                }}
              >📱 Compartilhar</button>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <img
                    src={`/catalogos/oleos-essenciais/${produto.arquivo}.png`}
            alt={produto.nome}
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: 12 }}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div className="header no-print">
        <div className="container header-inner">
          <a href="/catalogos" className="back-btn">← Voltar</a>
          <img src="/logo.jpg" alt="Tulipa" className="header-logo" />
          <div className="header-text">
            <h1>💧 Óleos Essenciais</h1>
            <p>Toque em um card para ver a imagem completa</p>
          </div>
        </div>
      </div>

      <main style={{ flex: 1 }}>
        <div className="container" style={{ paddingTop: 24 }}>
          <div className="oleo-grid">
            {produtos.map((p) => (
              <div
                key={p.id}
                className="oleo-card"
                onClick={() => setSelected(p.id)}
              >
                <div className="oleo-card-img">
                  <img
                    src={`/catalogos/oleos-essenciais/${p.arquivo}.png`}
                    alt={p.nome}
                    loading="lazy"
                  />
                </div>
                <div className="oleo-card-body">
                  <h3 className="oleo-card-nome">{p.nome}</h3>
                  <span className="oleo-card-sub">Óleo Essencial 10ml</span>
                  <div className="oleo-card-bottom">
                    {p.preco ? (
                      <span className="oleo-card-preco">{formatPreco(p.preco)}</span>
                    ) : (
                      <span className="oleo-card-consulte">Sob consulta</span>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); shareWhatsApp(p.nome); }}
                      className="oleo-card-wpp"
                      title="Compartilhar no WhatsApp"
                    >📱</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer style={{ textAlign: "center", padding: "20px", fontSize: "0.8rem", color: "#94a3b8", borderTop: "1px solid #e2e8f0", background: "white" }}>
        <p>© {new Date().getFullYear()} VENDEDORAS - TULIPA 🌷</p>
      </footer>
    </div>
  );
}
