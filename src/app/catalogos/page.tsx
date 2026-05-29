"use client";

import { useState } from "react";

type Catalogo = {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  pdf: string;
};

const catalogos: Catalogo[] = [
  {
    id: "oleos-odorizantes",
    nome: "Óleos Odorizantes",
    descricao: "Fragrâncias para odorizantes e perfumaria em geral",
    icone: "🌿",
    pdf: "/catalogos/oleos-odorizantes.pdf",
  },
];

function shareWhatsApp(url: string, nome: string) {
  const msg = encodeURIComponent(`📖 Catálogo Tulipa - ${nome}\n\n${url}`);
  window.open(`https://wa.me/?text=${msg}`, "_blank");
}

export default function CatalogosPage() {
  const [view, setView] = useState<"list" | "viewer">("list");
  const [selected, setSelected] = useState<Catalogo | null>(null);

  const fullPdfUrl = typeof window !== "undefined"
    ? `${window.location.origin}${selected?.pdf}`
    : "";

  if (view === "viewer" && selected) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <div className="header no-print" style={{ flexShrink: 0 }}>
          <div className="container header-inner">
            <button className="back-btn" onClick={() => setView("list")}>← Voltar</button>
            <img src="/logo.jpg" alt="Tulipa" className="header-logo" />
            <div className="header-text">
              <h1>{selected.icone} {selected.nome}</h1>
            </div>
            <button onClick={() => shareWhatsApp(fullPdfUrl, selected.nome)}
              style={{
                background: "#25d366", color: "#fff", border: "none",
                padding: "10px 18px", borderRadius: 12, fontWeight: 700, fontSize: "0.9rem",
                cursor: "pointer", fontFamily: "Barlow, sans-serif",
                display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap",
              }}
            >
              <span style={{ fontSize: 18 }}>📱</span> Compartilhar
            </button>
          </div>
        </div>
        <div style={{
          flex: 1, background: "#fff", borderRadius: 0, overflow: "hidden",
        }}>
          <iframe
            src={selected.pdf + "#zoom=100"}
            style={{ width: "100%", height: "100%", border: "none" }}
            title={selected.nome}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div className="header no-print">
        <div className="container header-inner">
          <a href="/" className="back-btn">← Voltar</a>
          <img src="/logo.jpg" alt="Tulipa" className="header-logo" />
          <div className="header-text">
            <h1>📖 Catálogos</h1>
            <p>Escolha um catálogo para visualizar</p>
          </div>
        </div>
      </div>
      <main style={{ flex: 1 }}>
        <div className="container" style={{ paddingTop: 20 }}>
          <div className="menu-grid">
            {catalogos.map((c) => (
              <div key={c.id} className="menu-card" style={{ cursor: "default" }}>
                <div style={{ padding: 24, paddingBottom: 16 }}>
                  <div className="icon" style={{ marginBottom: 8 }}>{c.icone}</div>
                  <h3>{c.nome}</h3>
                  <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: 1.4 }}>{c.descricao}</p>
                </div>
                <div style={{ display: "flex", gap: 8, padding: "0 24px 20px" }}>
                  <button
                    onClick={() => { setSelected(c); setView("viewer"); }}
                    style={{
                      flex: 1, padding: "10px 0", borderRadius: 10, border: "none",
                      background: "#15814a", color: "#fff", fontWeight: 700, fontSize: "0.9rem",
                      cursor: "pointer", fontFamily: "Barlow, sans-serif",
                    }}
                  >📄 Abrir</button>
                  <button
                    onClick={() => shareWhatsApp(`${window.location.origin}${c.pdf}`, c.nome)}
                    style={{
                      padding: "10px 16px", borderRadius: 10, border: "none",
                      background: "#25d366", color: "#fff", fontWeight: 700, fontSize: "0.9rem",
                      cursor: "pointer", fontFamily: "Barlow, sans-serif",
                      display: "flex", alignItems: "center", gap: 4,
                    }}
                  >📱 WhatsApp</button>
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
    <footer style={{ textAlign: "center", padding: "20px", fontSize: "0.8rem", color: "#94a3b8", borderTop: "1px solid #e2e8f0", background: "white" }}>
      <p>© {new Date().getFullYear()} VENDEDORAS - TULIPA 🌷</p>
    </footer>
  );
}
