"use client";

import { useState } from "react";

type Catalogo = {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  tipo: "pdf" | "lista";
  pdf?: string;
  itens?: string[];
};

const catalogos: Catalogo[] = [
  {
    id: "oleos-odorizantes",
    nome: "Óleos Odorizantes",
    descricao: "Fragrâncias para odorizantes e perfumaria em geral",
    icone: "🌿",
    tipo: "pdf",
    pdf: "/catalogos/oleos-odorizantes.pdf",
  },
  {
    id: "essencias-cosmeticas",
    nome: "Essências Cosméticas",
    descricao: "Essências para cosméticos e aromatizadores",
    icone: "🌸",
    tipo: "lista",
    pdf: "/catalogos/essencias-cosmeticas.pdf",
    itens: [
      "ABRAÇO", "AÇAÍ TULIPA", "ÁGUA DE LENÇÓIS LIPO", "ALECRIM LELIS BLANCY",
      "ALFAZEMA PLUS", "ALGAS", "ALGODÃO", "ALMÍSCAR", "ALOE VERA", "AMARULA",
      "ÂMBAR LELIS", "ÂMBAR MANHATTAN", "AMEIXA DOCE SPA", "AMORA", "ANTI TABACO",
      "ARRUDA", "AVEIA", "BAGUNÇA", "BAMBU MARTAN", "BANANA", "BAUNILHA",
      "BEM ESTAR", "BERGAMOTA", "BREU BRANCO", "BRILHO SUAVE", "BRISA DO MAR",
      "BROMÉLIA", "CACAU SHOW", "CAFÉ", "CAFÉ VERDE (INSPIRAÇÃO LOCCITANE)",
      "CALÊNDULA FRESH", "CAMOMILA", "CAPIM LIMÃO", "CARAMELITO", "CASCAS MOLHADAS",
      "CASCAS E FOLHAS", "CEREJA E AVELÃ", "CHÁ BRANCO E LICHIA", "CHAMPANHE ROSÉ",
      "CHEIRO DE NATAL", "CHOCOLATE", "CHOCOTONE", "COCO VERDE", "COCO PLUS",
      "COCONUT FASHION", "COCONUT VICTORIA", "CRAVO", "CRAVO E CANELA",
      "DAMASCO ESPECIARIA", "DAMASCO C/ PITANGA", "DASLUSENCE", "DE ODOR", "DOVE",
      "DOVE CEREJEIRA", "DUDALINIS", "EQUILÍBRIO", "ERVA CIDREIRA", "ERVA DOCE",
      "ESPECIARIAS", "FESTAS", "FIGO FIRENZE", "FLOR DA PELE", "FLOR DE AMEIXA",
      "FLOR DE CEREJEIRA", "FLOR DE GUARANÁ", "FLOR DE LARANJEIRA",
      "FLORAL AMADEIRADO", "FLORES VIBRANTES", "FRUTAS VERMELHAS", "GARDÊNIA LIPO",
      "GENGIBRE", "GIOVANA BABY", "GOIABA BERENISSE", "HERBAL HOMME",
      "HERBAL TULIPA", "HIDRA INTENSE", "HONEY LEMON", "JACADIS", "JADE", "JADORE",
      "JARDIM CÍTRICO", "JASMIM SOLÚVEL", "LADY GOLD", "LAVANDA", "LEITE DE CABRA",
      "LEITE E MACADÂMIA", "LEZALEZ", "LIMÃO LIPOSSOLÚVEL", "LIMÃO SICILIANO",
      "LIPOSSOLÚVEL PALO", "LYCHIA", "MAÇÃ MADURA", "MAÇÃ VERDE", "MAÇÃ E CANELA",
      "MACADÂMIA", "MADEIRA DO ORIENTE", "MADEIRA NOBRE", "MADEIRA SMELL",
      "MADEIRA MUSK", "MAGNÓLIA NEW", "MAMÃE BEBÊ", "MANDACARU BRASIL",
      "MANGA C/ BURITI", "MANGA ROSA", "MARACUJÁ", "MARINE", "MARSHMALLOW",
      "MELANCIA", "MELISSA", "MELISSA E SÁLVIA", "MELISSINHA", "MENTA", "MIRRA",
      "MIRRA CELESTIAL", "MORANGO", "MORANGO C/ CHAMPAGNE", "MY MIMOSA", "NARDO",
      "NUVEM", "OCEANO", "ORIENTAL ESPECIADO", "ORQUÍDEA BRANCA", "ORQUÍDEA FEMME",
      "OSK MADEIRA", "OZÔNIO", "PATCHOULY", "PERFUME DO REI",
      "PERFUME DAS FADAS", "PÊSSEGO", "PITANGA FRESCA", "PRINCESA (OXIGÊNIO)",
      "PROVENCE", "QUERIDINHO TULIPA", "ROMÃ E MAÇÃ", "ROMÃ C/ CHAMPAGNE",
      "ROMA E CANELA", "ROSA BRANCA", "ROSA DO MARROCOS", "ROSA ROSA AMARELA",
      "ROSAS VERMELHAS", "Sândalo", "SEMENTES DO BRASIL", "SENSUAL PRIVÊ",
      "SONINHO AZUL", "TALCO PP SOLÚVEL", "TALCO TULIPA", "TROUSSE", "TUTTI FRUTTI",
      "UVA", "VANILLA GREEN", "VELA BERRIES", "VERBENA", "VERBENA E LIMÃO SICILIANO",
      "VILA 53", "WHISKY", "WHITE CITRUS", "YLANG YLANG",
    ],
  },
];

function shareWhatsApp(url: string, nome: string) {
  const msg = encodeURIComponent(`📖 Catálogo Tulipa - ${nome}\n\n${url}`);
  window.open(`https://wa.me/?text=${msg}`, "_blank");
}

function CatalogListView({ catalogo }: { catalogo: Catalogo }) {
  const [search, setSearch] = useState("");

  const filtered = catalogo.itens!.filter((i) =>
    i.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div className="header no-print" style={{ flexShrink: 0 }}>
        <div className="container header-inner">
          <a href="/catalogos" className="back-btn">← Catálogos</a>
          <img src="/logo.jpg" alt="Tulipa" className="header-logo" />
          <div className="header-text">
            <h1>{catalogo.icone} {catalogo.nome}</h1>
            <p>{catalogo.itens!.length} essências</p>
          </div>
          <button onClick={() => shareWhatsApp(
            `${window.location.origin}/catalogos`,
            catalogo.nome
          )} style={{
            background: "#25d366", color: "#fff", border: "none",
            padding: "10px 18px", borderRadius: 12, fontWeight: 700, fontSize: "0.9rem",
            cursor: "pointer", fontFamily: "Barlow, sans-serif", whiteSpace: "nowrap",
          }}>
            📱 Compartilhar
          </button>
        </div>
      </div>

      <div style={{ padding: "12px 20px", background: "#fff", borderBottom: "1px solid #e2e8f0" }}>
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar essência..."
          style={{
            width: "100%", padding: "12px 18px", borderRadius: 12, border: "2px solid #e2e8f0",
            fontSize: "1rem", fontFamily: "Barlow, sans-serif", outline: "none",
            transition: "border-color 0.15s",
          }}
          onFocus={(e) => e.target.style.borderColor = "#15814a"}
          onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
          autoFocus
        />
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "12px 20px 20px", background: "#f8fafc" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8 }}>
          {filtered.map((item) => (
            <div key={item} style={{
              background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0",
              padding: "10px 14px", fontSize: "0.9rem", fontWeight: 500, color: "#2d3748",
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
            }}>
              {item}
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <p style={{ textAlign: "center", color: "#94a3b8", marginTop: 40, fontSize: "0.95rem" }}>
            Nenhuma essência encontrada para "{search}"
          </p>
        )}
      </div>
    </div>
  );
}

export default function CatalogosPage() {
  const [view, setView] = useState<"list" | "viewer">("list");
  const [selected, setSelected] = useState<Catalogo | null>(null);

  const fullPdfUrl = typeof window !== "undefined"
    ? `${window.location.origin}${selected?.pdf}`
    : "";

  if (view === "viewer" && selected) {
    if (selected.tipo === "lista") {
      return <CatalogListView catalogo={selected} />;
    }

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
        <div style={{ flex: 1, background: "#fff", overflow: "hidden" }}>
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
                  <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: 1.4 }}>
                    {c.descricao}
                    {c.itens && <><br /><span style={{ color: "#15814a", fontWeight: 600 }}>{c.itens.length} itens</span></>}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 8, padding: "0 24px 20px" }}>
                  <button onClick={() => { setSelected(c); setView("viewer"); }}
                    style={{
                      flex: 1, padding: "10px 0", borderRadius: 10, border: "none",
                      background: "#15814a", color: "#fff", fontWeight: 700, fontSize: "0.9rem",
                      cursor: "pointer", fontFamily: "Barlow, sans-serif",
                    }}
                  >📄 Abrir</button>
                  <button onClick={() => shareWhatsApp(`${window.location.origin}/catalogos`, c.nome)}
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
