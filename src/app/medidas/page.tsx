const caixas = [
  {
    nome: "TULIMIX",
    dimensoes: "40x30x30 cm",
    volume: "36.000 cm³",
    cor: "#15814a",
  },
  {
    nome: "ÁLCOOL ARAUCÁRIA",
    dimensoes: "35x25x20 cm",
    volume: "17.500 cm³",
    cor: "#0d5e35",
  },
  {
    nome: "SITE MÉDIA",
    dimensoes: "30x20x15 cm",
    volume: "9.000 cm³",
    cor: "#1a9a5a",
  },
  {
    nome: "MINI SITE",
    dimensoes: "20x15x10 cm",
    volume: "3.000 cm³",
    cor: "#bb8e3d",
  },
];

export default function MedidasPage() {
  return (
    <div>
      <div className="header no-print">
        <div className="container header-inner">
          <a href="/" className="back-btn">
            ← Voltar
          </a>
          <img src="/logo.jpg" alt="Tulipa" className="header-logo" />
          <div className="header-text">
            <h1>📦 Medidas das Caixas</h1>
            <p>Dimensões e visualização 3D de todas as caixas</p>
          </div>
        </div>
      </div>
      <main style={{ minHeight: "calc(100vh - 60px)" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            {caixas.map((caixa) => (
              <div
                key={caixa.nome}
                className="menu-card"
                style={{ cursor: "default" }}
              >
                <h3>{caixa.nome}</h3>
                <div
                  style={{
                    marginTop: 16,
                    padding: 20,
                    background: "linear-gradient(135deg, #f0f7f3, #e8f5ee)",
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 120,
                  }}
                >
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      background: `linear-gradient(135deg, ${caixa.cor}, #15814a)`,
                      borderRadius: 8,
                      opacity: 0.7,
                      transform: "rotate(10deg) skewX(-5deg)",
                      boxShadow: "4px 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                </div>
                <div style={{ marginTop: 16, fontSize: "0.9rem" }}>
                  <p>
                    <strong>Dimensões:</strong> {caixa.dimensoes}
                  </p>
                  <p>
                    <strong>Volume:</strong> {caixa.volume}
                  </p>
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
