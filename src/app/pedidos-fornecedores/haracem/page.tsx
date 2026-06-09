"use client";

import { useState } from "react";

type Produto = {
  id: string;
  nome: string;
  imagem: string;
  categoria: string;
  descricao: string;
};

type ItemPedido = {
  produto: Produto;
  quantidade: number;
};

const LOGO_HARACEM = "https://haracemvassouras.com.br/wp-content/uploads/2024/01/logo-haracem.png";

const BASE_URL = "https://haracemvassouras.com.br/";

const produtos: Produto[] = [
  { id: "1", nome: "Vassoura Canto Luxo", imagem: BASE_URL + "assets/img/portfolio/vassoura1.jpg", categoria: "Vassouras", descricao: "Vassoura para cantos com cabo" },
  { id: "2", nome: "Vassoura Varre Canto", imagem: BASE_URL + "assets/img/portfolio/vassoura2.jpg", categoria: "Vassouras", descricao: "Vassoura para varrer cantos" },
  { id: "3", nome: "Vassoura Capa Big", imagem: BASE_URL + "assets/img/portfolio/vassoura3.jpg", categoria: "Vassouras", descricao: "Vassoura com capa grande" },
  { id: "4", nome: "Vassoura Capa Dura", imagem: BASE_URL + "assets/img/portfolio/vassoura4.jpg", categoria: "Vassouras", descricao: "Vassoura com capa resistente" },
  { id: "5", nome: "Vassoura Pop Luxo", imagem: BASE_URL + "assets/img/portfolio/vassoura5.jpg", categoria: "Vassouras", descricao: "Vassoura pop com acabamento luxo" },
  { id: "6", nome: "Vassoura Romana Luxo", imagem: BASE_URL + "assets/img/portfolio/vassoura6.jpg", categoria: "Vassouras", descricao: "Vassoura romana com acabamento luxo" },
  { id: "7", nome: "Vassoura Romana", imagem: BASE_URL + "assets/img/portfolio/vassoura7.jpg", categoria: "Vassouras", descricao: "Vassoura romana com cabo" },
  { id: "8", nome: "Vassoura Só Pelo Gari Madeira", imagem: BASE_URL + "assets/img/portfolio/vassoura8.jpg", categoria: "Vassouras", descricao: "Vassoura gari com cabo de madeira" },
  { id: "9", nome: "Vassoura Piaçava", imagem: BASE_URL + "assets/img/portfolio/vassoura9.jpg", categoria: "Vassouras", descricao: "Vassoura de piaçava para áreas externas" },
  { id: "10", nome: "Rodo Borracha", imagem: BASE_URL + "assets/img/portfolio/rodo1.jpg", categoria: "Rodos", descricao: "Rodo com lâmina de borracha" },
  { id: "11", nome: "Rodo Plástico", imagem: BASE_URL + "assets/img/portfolio/rodo2.jpg", categoria: "Rodos", descricao: "Rodo plástico resistente" },
  { id: "12", nome: "Rodo Espuma", imagem: BASE_URL + "assets/img/portfolio/rodo3.jpg", categoria: "Rodos", descricao: "Rodo com espuma para vidros" },
];

export default function HaracemPage() {
  const [itens, setItens] = useState<Record<string, ItemPedido>>({});
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");
  const [busca, setBusca] = useState("");
  const [vendedor, setVendedor] = useState("");

  const categorias = ["Todas", ...new Set(produtos.map((p) => p.categoria))];

  const produtosFiltrados = produtos.filter((produto) => {
    const matchCategoria = filtroCategoria === "Todas" || produto.categoria === filtroCategoria;
    const matchBusca = produto.nome.toLowerCase().includes(busca.toLowerCase()) ||
      produto.descricao.toLowerCase().includes(busca.toLowerCase());
    return matchCategoria && matchBusca;
  });

  const updateItem = (produto: Produto, quantidade: number) => {
    setItens((prev) => {
      const next = { ...prev };
      if (quantidade <= 0) {
        delete next[produto.id];
      } else {
        next[produto.id] = { produto, quantidade };
      }
      return next;
    });
  };

  const totalItens = Object.values(itens).reduce((s, i) => s + i.quantidade, 0);

  const gerarRomaneio = () => {
    const sel = Object.values(itens);
    if (sel.length === 0) return;

    const grupos: Record<string, typeof sel> = {};
    for (const item of sel) {
      const cat = item.produto.categoria;
      if (!grupos[cat]) grupos[cat] = [];
      grupos[cat].push(item);
    }

    const rows: string[] = [];
    for (const [categoria, items] of Object.entries(grupos)) {
      rows.push(`<tr style="background:#fef2f2;"><td colspan="3" style="padding:8px 10px;font-weight:800;font-size:15px;color:#dc2626;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #dc2626;">${categoria}</td></tr>`);
      for (const item of items) {
        rows.push(`<tr><td style="width:70px;padding:8px;border-bottom:1px solid #ddd;vertical-align:middle;"><img src="${item.produto.imagem}" style="width:50px;height:50px;object-fit:contain;" /></td><td style="padding:8px;border-bottom:1px solid #ddd;vertical-align:middle;"><strong>${item.produto.nome}</strong><br/><small style="color:#666;">${item.produto.descricao}</small></td><td style="padding:8px;border-bottom:1px solid #ddd;vertical-align:middle;text-align:center;font-weight:900;font-size:18px;color:#dc2626;">${item.quantidade}</td></tr>`);
      }
    }

    const dataAtual = new Date().toLocaleDateString("pt-BR");
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      @page { size: A4; margin: 15mm; }
      * { margin: 0; padding: 0; box-sizing: border-box; font-family: Arial, sans-serif; }
      body { width: 210mm; min-height: 297mm; padding: 20mm 15mm; color: #333; }
      .h { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #dc2626; }
      .h h1 { font-size: 26px; color: #dc2626; }
      .h p { color: #666; font-size: 14px; margin-top: 6px; }
      .info { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 14px; }
      .info strong { color: #dc2626; }
      table { width: 100%; border-collapse: collapse; }
      th { background: #dc2626; color: #fff; padding: 8px 10px; text-align: left; font-size: 13px; }
      .total { background: #fef2f2; font-weight: 700; }
      .total td { padding: 10px 8px; border-top: 2px solid #dc2626; }
      .foot { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #999; font-size: 11px; }
    </style></head><body>
      <div class="h"><h1>🪥 HARACEM</h1><p>Pedido de Vassouras e Acessórios</p></div>
      <div class="info"><span><strong>Data:</strong> ${dataAtual}</span><span><strong>Vendedor(a):</strong> ${vendedor || "_______________"}</span></div>
      <table><thead><tr><th style="width:70px;">Foto</th><th>Produto</th><th style="width:80px;text-align:center;">Qtd</th></tr></thead><tbody>
      ${rows.join("")}
      <tr class="total"><td colspan="2" style="text-align:right;">TOTAL DE ITENS</td><td style="text-align:center;font-size:20px;">${totalItens}</td></tr>
      </tbody></table>
      <div class="foot">Pedido gerado automaticamente · Vendedoras Tulipa</div>
    </body></html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if (win) {
      win.onload = () => {
        win.print();
      };
    }
  };

  const gerarWhatsApp = () => {
    const sel = Object.values(itens);
    if (sel.length === 0) return;

    const linhas = sel.map((item) => `${item.quantidade}x ${item.produto.nome}`);
    const msg = `Olá! Gostaria de fazer um pedido da Haracem:\n\n${linhas.join("\n")}\n\nTotal: ${totalItens} itens`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div className="header">
        <div className="container header-inner">
          <a href="/pedidos-fornecedores" className="back-btn">← Voltar</a>
          <img src={LOGO_HARACEM} alt="Haracem" className="header-logo" onError={(e) => { (e.target as HTMLImageElement).src = "/logo.jpg"; }} />
          <div className="header-text">
            <h1>🪥 Haracem</h1>
            <p>Vassouras, rodos e acessórios</p>
          </div>
        </div>
      </div>
      <main style={{ flex: 1 }}>
        <div className="container" style={{ paddingTop: 20 }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Buscar produto..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={{ flex: 1, minWidth: 200, padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: "0.95rem" }}
            />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {categorias.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFiltroCategoria(cat)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                    background: filtroCategoria === cat ? "#dc2626" : "white",
                    color: filtroCategoria === cat ? "white" : "#333",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
            {produtosFiltrados.map((produto) => {
              const item = itens[produto.id];
              const qtd = item?.quantidade || 0;
              return (
                <div key={produto.id} style={{ background: "white", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", transition: "all 0.2s" }}>
                  <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", background: "#fef2f2", padding: 8 }}>
                    <img
                      src={produto.imagem}
                      alt={produto.nome}
                      style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='%23dc2626' stroke-width='1.5'%3E%3Cpath d='M12 2v20'/%3E%3Cpath d='m17 5-5-3-5 3'/%3E%3Cpath d='m17 19-5 3-5-3'/%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  <div style={{ padding: 12 }}>
                    <span style={{ display: "inline-block", padding: "2px 6px", background: "#fee2e2", color: "#991b1b", borderRadius: 4, fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>
                      {produto.categoria}
                    </span>
                    <h3 style={{ margin: "0 0 4px 0", fontSize: "0.95rem", color: "#000", textTransform: "uppercase", fontWeight: 700 }}>{produto.nome}</h3>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>{produto.descricao}</p>
                  </div>
                  <div style={{ padding: "8px 12px 12px", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
                    <button
                      onClick={() => updateItem(produto, qtd - 1)}
                      disabled={qtd === 0}
                      style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #e2e8f0", background: "white", cursor: qtd === 0 ? "not-allowed" : "pointer", fontSize: "1.1rem", opacity: qtd === 0 ? 0.5 : 1 }}
                    >
                      -
                    </button>
                    <span style={{ fontSize: "1rem", fontWeight: 600, minWidth: 24, textAlign: "center" }}>{qtd}</span>
                    <button
                      onClick={() => updateItem(produto, qtd + 1)}
                      style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #e2e8f0", background: "white", cursor: "pointer", fontSize: "1.1rem" }}
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {totalItens > 0 && (
            <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "white", borderTop: "1px solid #e2e8f0", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 -2px 8px rgba(0,0,0,0.1)" }}>
              <div>
                <strong style={{ fontSize: "1.1rem" }}>{totalItens} itens selecionados</strong>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <input
                  type="text"
                  placeholder="Nome do vendedor(a)"
                  value={vendedor}
                  onChange={(e) => setVendedor(e.target.value)}
                  style={{ padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: "0.95rem", width: 200 }}
                />
                <button onClick={gerarRomaneio} style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "#dc2626", color: "white", cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                  📄 Gerar Romaneio
                </button>
                <button onClick={gerarWhatsApp} style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "#25d366", color: "white", cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                  📲 WhatsApp
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <div style={{ height: totalItens > 0 ? 80 : 0 }} />
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
