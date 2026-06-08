"use client";

const fornecedores = [
  { id: "sany", nome: "Sany do Brasil", icone: "🧹", desc: "Produtos de limpeza e higiene", cor: "#0d5e35" },
  { id: "flashlimp", nome: "Flash Limp", icone: "✨", desc: "Mops, panos, esponjas e acessórios", cor: "#1565c0" },
  { id: "visbella", nome: "Vis Bella Brasil", icone: "🛡️", desc: "Silicones, epóxis, adesivos e limpeza automotiva", cor: "#e65100" },
];

export default function PedidosFornecedoresPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div className="header">
        <div className="container header-inner">
          <a href="/" className="back-btn">← Voltar</a>
          <img src="/logo.jpg" alt="Tulipa" className="header-logo" />
          <div className="header-text">
            <h1>📋 Pedidos Fornecedores</h1>
            <p>Selecione o fornecedor para fazer o pedido</p>
          </div>
        </div>
      </div>
      <main style={{ flex: 1 }}>
        <div className="container" style={{ paddingTop: 20 }}>
          <div className="menu-grid">
            {fornecedores.map((f) => (
              <a key={f.id} href={`/pedidos-fornecedores/${f.id}`} className="menu-card" style={{ textDecoration: "none" }}>
                <div>
                  <div className="icon" style={{ marginBottom: 8 }}>{f.icone}</div>
                  <h3>{f.nome}</h3>
                  <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: 1.4 }}>{f.desc}</p>
                </div>
                <strong className="card-link">Fazer pedido →</strong>
              </a>
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
