"use client";

import { useState } from "react";

const totalImages = 34;

function shareWhatsApp(nome: string) {
  const msg = encodeURIComponent(`🫧 Óleo Essencial - ${nome}\n\nConfira o catálogo completo: ${window.location.origin}/catalogos`);
  window.open(`https://wa.me/?text=${msg}`, "_blank");
}

export default function OleosEssenciaisCardsPage() {
  const [selected, setSelected] = useState<number | null>(null);

  if (selected !== null) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#000" }}>
        <div className="header no-print" style={{ flexShrink: 0 }}>
          <div className="container header-inner">
            <button className="back-btn" onClick={() => setSelected(null)}>← Voltar</button>
            <img src="/logo.jpg" alt="Tulipa" className="header-logo" />
            <div className="header-text">
              <h1>💧 Óleo Essencial {selected}</h1>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <img
            src={`/catalogos/oleos-essenciais/${selected}.png`}
            alt={`Óleo Essencial ${selected}`}
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
            <p>Toque em um óleo para visualizar em tela cheia</p>
          </div>
        </div>
      </div>
      <main style={{ flex: 1 }}>
        <div className="container" style={{ paddingTop: 20 }}>
          <div className="oil-grid">
            {Array.from({ length: totalImages }, (_, i) => i + 1).map((num) => (
              <div
                key={num}
                className="oil-card"
                onClick={() => setSelected(num)}
              >
                <div className="oil-card-img">
                  <img
                    src={`/catalogos/oleos-essenciais/${num}.png`}
                    alt={`Óleo Essencial ${num}`}
                    loading="lazy"
                  />
                </div>
                <div className="oil-card-footer">
                  <span>#{num.toString().padStart(2, "0")}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); shareWhatsApp(`#${num}`); }}
                    className="oil-wpp-btn"
                    title="Compartilhar no WhatsApp"
                  >📱</button>
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
