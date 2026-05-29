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

function parseDims(s: string) {
  const [w, h, d] = s.replace("cm", "").split("x").map((n) => parseInt(n.trim()));
  return { w, h, d };
}

function Box3D({ dims, cor }: { dims: string; cor: string }) {
  const { w, h, d } = parseDims(dims);
  const s = 2.5;
  const pw = w * s;
  const ph = h * s;
  const pd = d * s;
  const ha = (n: number) => `${n}px`;

  return (
    <div
      style={{
        perspective: "1200px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 220,
      }}
    >
      <div
        style={{
          transformStyle: "preserve-3d",
          animation: "spinBox 14s linear infinite",
          width: 0,
          height: 0,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: -pw / 2,
            top: -ph / 2,
            width: pw,
            height: ph,
            transform: `translateZ(${ha(pd / 2)})`,
            background: `linear-gradient(135deg, ${cor}, ${cor}dd)`,
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 2,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -pw / 2,
            top: -ph / 2,
            width: pw,
            height: ph,
            transform: `translateZ(${ha(-pd / 2)}) rotateY(180deg)`,
            background: `linear-gradient(135deg, ${cor}aa, ${cor}88)`,
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 2,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -pw / 2,
            top: -pd / 2,
            width: pw,
            height: pd,
            transform: `rotateX(90deg) translateY(${ha(-ph / 2)})`,
            background: `linear-gradient(135deg, ${cor}dd, ${cor}bb)`,
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 2,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -pw / 2,
            top: -pd / 2,
            width: pw,
            height: pd,
            transform: `rotateX(-90deg) translateY(${ha(ph / 2)})`,
            background: `linear-gradient(135deg, ${cor}88, ${cor}66)`,
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 2,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -pd / 2,
            top: -ph / 2,
            width: pd,
            height: ph,
            transform: `rotateY(90deg) translateX(${ha(pw / 2)})`,
            background: `linear-gradient(135deg, ${cor}cc, ${cor}99)`,
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 2,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -pd / 2,
            top: -ph / 2,
            width: pd,
            height: ph,
            transform: `rotateY(-90deg) translateX(${ha(-pw / 2)})`,
            background: `linear-gradient(135deg, ${cor}99, ${cor}77)`,
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 2,
          }}
        />
      </div>
    </div>
  );
}

export default function MedidasPage() {
  return (
    <div>
      <style>{`
        @keyframes spinBox {
          0% { transform: rotateX(-20deg) rotateY(0deg); }
          100% { transform: rotateX(-20deg) rotateY(360deg); }
        }
      `}</style>
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
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 24,
            }}
          >
            {caixas.map((caixa) => (
              <div
                key={caixa.nome}
                className="menu-card"
                style={{ cursor: "default", padding: "28px 24px 24px" }}
              >
                <h3 style={{ fontSize: "1.2rem" }}>{caixa.nome}</h3>
                <Box3D dims={caixa.dimensoes} cor={caixa.cor} />
                <div
                  style={{
                    marginTop: 8,
                    textAlign: "center",
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
                  }}
                >
                  <p>
                    <strong>Dimensões:</strong> {caixa.dimensoes}
                  </p>
                  <p>
                    <strong>Volume:</strong> {caixa.volume}
                  </p>
                </div>
              </div>
            ))}
            <div
              className="menu-card"
              style={{ cursor: "default", padding: "28px 24px 24px" }}
            >
              <h3 style={{ fontSize: "1.2rem" }}>BARRICA 50L</h3>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 220,
                }}
              >
                <img
                  src="/barrica.jpg"
                  alt="Barrica 50L"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    borderRadius: 12,
                  }}
                />
              </div>
              <div
                style={{
                  marginTop: 8,
                  textAlign: "center",
                  fontSize: "0.95rem",
                  lineHeight: 1.6,
                }}
              >
                <p>
                  <strong>Dimensões:</strong> 76 cm (altura) x 36 cm (diâmetro)
                </p>
                <p>
                  <strong>Capacidade:</strong> 50 litros
                </p>
                <p>
                  <strong>Uso:</strong> Armazenamento e preparo de produtos
                </p>
              </div>
            </div>
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
