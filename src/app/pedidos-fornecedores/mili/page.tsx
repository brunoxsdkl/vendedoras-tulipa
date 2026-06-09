"use client";

import { useState } from "react";

type Produto = {
  id: string;
  nome: string;
  imagem: string;
  categoria: string;
  descricao: string;
  ref: string;
};

type ItemPedido = {
  produto: Produto;
  quantidade: number;
};

const produtos: Produto[] = [
  // Papéis Higiênicos
  { id: "1", nome: "Papel Higiênico Folha Dupla Sensitive Care 30m 16 Rolos", imagem: "https://www.miliprofessional.com.br/wp-content/uploads/2025/12/819-PAPEL-HIGIENICO-30M-FOLHA-DUPLA-COMPACTO-MILI-S.jpeg", categoria: "Papéis Higiênicos", descricao: "30m · 16 Rolos · Fardo c/ 4 pacotes de 16 rolos", ref: "MILI0819" },
  { id: "2", nome: "Papel Higiênico Folha Dupla Sensitive Care 30m 4 Rolos", imagem: "https://www.miliprofessional.com.br/wp-content/uploads/2025/12/896-PAPEL-HIGIENICO-30M-FOLHA-DUPLA-MILI-S.jpeg", categoria: "Papéis Higiênicos", descricao: "30m · 4 Rolos · Fardo c/ 24 pacotes de 4 rolos", ref: "MILI0896" },
  { id: "3", nome: "Papel Higiênico Folha Dupla Sensitive Care 30m 12 Rolos", imagem: "https://www.miliprofessional.com.br/wp-content/uploads/2025/12/588-PAPEL-HIGIENICO-30-METROS-FOLHA-DUPLA-MILI-S.jpeg", categoria: "Papéis Higiênicos", descricao: "30m · 12 Rolos · Fardo c/ 8 pacotes de 12 rolos", ref: "MILI0588" },
  { id: "4", nome: "Papel Higiênico Folha Dupla Atualle 20m", imagem: "https://www.miliprofessional.com.br/wp-content/uploads/2025/12/1318-PAPEL-HIGIENICO-ATUALLE-20M-FOLHA-DUPLA-MILI-S.jpeg", categoria: "Papéis Higiênicos", descricao: "20m · 12 Rolos · Fardo c/ 8 pacotes de 12 rolos", ref: "MILI1318" },
  { id: "5", nome: "Papel Higiênico Folha Dupla Bianco 30m", imagem: "https://www.miliprofessional.com.br/wp-content/uploads/2025/12/1291-BIANCO-FD-12ROLOS-FRENTE-scaled.png", categoria: "Papéis Higiênicos", descricao: "30m · 12 Rolos · Fardo c/ 8 pacotes de 12 rolos", ref: "MILI1291" },
  { id: "6", nome: "Papel Higiênico Folha Simples Bianco 30m 4 Rolos", imagem: "https://www.miliprofessional.com.br/wp-content/uploads/2025/12/0243-30M-4-ROLOS-7896104998434-scaled.png", categoria: "Papéis Higiênicos", descricao: "30m · 4 Rolos · Fardo c/ 24 pacotes de 4 rolos", ref: "MILI0243" },
  { id: "7", nome: "Papel Higiênico Folha Simples Bianco 60m 4 Rolos", imagem: "https://www.miliprofessional.com.br/wp-content/uploads/2025/12/0951-PAPEL-HIGIENICO-60M-BIANCO-MILI-S.jpeg", categoria: "Papéis Higiênicos", descricao: "60m · 4 Rolos · Fardo c/ 24 pacotes de 4 rolos", ref: "MILI0951" },
  { id: "8", nome: "Papel Higiênico Folha Simples Bianco 60m 12 Rolos", imagem: "https://www.miliprofessional.com.br/wp-content/uploads/2025/12/0576-60M-12-ROLOS-FRENTE-scaled.png", categoria: "Papéis Higiênicos", descricao: "60m · 12 Rolos · Fardo c/ 8 pacotes de 12 rolos", ref: "MILI0576" },
  // Guardanapos
  { id: "9", nome: "Guardanapo de Papel Folha Simples 21x22cm", imagem: "https://www.miliprofessional.com.br/wp-content/uploads/2025/12/0012-GUARDANAPO-FOLHA-SIMPLES-21X2-MILI-S.jpeg", categoria: "Guardanapos", descricao: "21cm x 22cm · 50 unidades · Caixa c/ 72 pacotes", ref: "MILI0012" },
  { id: "10", nome: "Guardanapo de Papel Folha Simples 30x29,5cm", imagem: "https://www.miliprofessional.com.br/wp-content/uploads/2025/12/1312-GUARDANAPO-DE-PAPEL-FOLHA-SIMPLES-30X29.5-MILI-S.jpeg", categoria: "Guardanapos", descricao: "30cm x 29,5cm · 50 unidades · Caixa c/ 36 pacotes", ref: "MILI1312" },
  { id: "11", nome: "Guardanapo de Papel Bistrô Folha Dupla 23x22,5cm", imagem: "https://www.miliprofessional.com.br/wp-content/uploads/2025/12/1313-GUARDANAPO-FOLHA-DUPLA-BISTRO-23X22.5-MILI-S.jpeg", categoria: "Guardanapos", descricao: "23cm x 22,5cm · 50 unidades · Caixa c/ 36 pacotes", ref: "MILI1313" },
  { id: "12", nome: "Guardanapo de Papel Bistrô Folha Dupla 30x29,5cm", imagem: "https://www.miliprofessional.com.br/wp-content/uploads/2025/12/1309-GUADANAPO-FOLHA-DUPLA-BISTRO-23X22.5-MILI-S.jpeg", categoria: "Guardanapos", descricao: "30cm x 29,5cm · 50 unidades · Caixa c/ 24 pacotes", ref: "MILI1309" },
  // Toalhas de Papel
  { id: "13", nome: "Toalha de Papel Bianco Multiuso 100 toalhas", imagem: "https://www.miliprofessional.com.br/wp-content/uploads/2025/12/image-30-1.png", categoria: "Toalhas de Papel", descricao: "100 toalhas · Fardo c/ 12 pacotes de 2 unidades", ref: "MILI1294" },
  { id: "14", nome: "Toalha de Papel Gran Chef 200 toalhas", imagem: "https://www.miliprofessional.com.br/wp-content/uploads/2025/12/image-34.png", categoria: "Toalhas de Papel", descricao: "200 toalhas · Fardo c/ 12 pacotes de 1 unidade", ref: "MILI1273" },
  { id: "15", nome: "Toalha de Papel Multiuso 100 toalhas", imagem: "https://www.miliprofessional.com.br/wp-content/uploads/2025/12/image-35.png", categoria: "Toalhas de Papel", descricao: "100 toalhas · Fardo c/ 12 pacotes de 2 unidades", ref: "MILI0202" },
  { id: "16", nome: "Toalha de Papel Multiuso 600 toalhas", imagem: "https://www.miliprofessional.com.br/wp-content/uploads/2025/12/1214-PAPEL-TOALHA-FAMILIA-600-FOLHAS-1.png", categoria: "Toalhas de Papel", descricao: "600 toalhas · Fardo c/ 4 pacotes de 3 unidades", ref: "MILI1214" },
];

export default function MiliPage() {
  const [itens, setItens] = useState<Record<string, ItemPedido>>({});
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");
  const [busca, setBusca] = useState("");
  const [vendedor, setVendedor] = useState("");

  const categorias = ["Todas", ...new Set(produtos.map((p) => p.categoria))];

  const produtosFiltrados = produtos.filter((produto) => {
    const matchCategoria = filtroCategoria === "Todas" || produto.categoria === filtroCategoria;
    const matchBusca = produto.nome.toLowerCase().includes(busca.toLowerCase()) ||
      produto.descricao.toLowerCase().includes(busca.toLowerCase()) ||
      produto.ref.toLowerCase().includes(busca.toLowerCase());
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
      rows.push(`<tr style="background:#e6f0ff;"><td colspan="3" style="padding:8px 10px;font-weight:800;font-size:15px;color:#0066cc;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #0066cc;">${categoria}</td></tr>`);
      for (const item of items) {
        rows.push(`<tr><td style="width:70px;padding:8px;border-bottom:1px solid #ddd;vertical-align:middle;"><img src="${item.produto.imagem}" style="width:50px;height:50px;object-fit:contain;" /></td><td style="padding:8px;border-bottom:1px solid #ddd;vertical-align:middle;"><strong>${item.produto.nome}</strong><br/><small style="color:#666;">${item.produto.descricao}</small><br/><small style="color:#999;">Ref: ${item.produto.ref}</small></td><td style="padding:8px;border-bottom:1px solid #ddd;vertical-align:middle;text-align:center;font-weight:900;font-size:18px;color:#0066cc;">${item.quantidade}</td></tr>`);
      }
    }

    const dataAtual = new Date().toLocaleDateString("pt-BR");
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      @page { size: A4; margin: 15mm; }
      * { margin: 0; padding: 0; box-sizing: border-box; font-family: Arial, sans-serif; }
      body { width: 210mm; min-height: 297mm; padding: 20mm 15mm; color: #333; }
      .h { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #0066cc; }
      .h h1 { font-size: 26px; color: #0066cc; }
      .h p { color: #666; font-size: 14px; margin-top: 6px; }
      .info { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 14px; }
      .info strong { color: #0066cc; }
      table { width: 100%; border-collapse: collapse; }
      th { background: #0066cc; color: #fff; padding: 8px 10px; text-align: left; font-size: 13px; }
      .total { background: #e6f0ff; font-weight: 700; }
      .total td { padding: 10px 8px; border-top: 2px solid #0066cc; }
      .foot { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #999; font-size: 11px; }
    </style></head><body>
      <div class="h"><h1>🧻 MILI PROFESSIONAL</h1><p>Papel Higiênico, Guardanapos e Toalhas</p></div>
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

    const linhas = sel.map((item) => `${item.quantidade}x ${item.produto.nome} (${item.produto.ref})`);
    const msg = `Olá! Gostaria de fazer um pedido da Mili Professional:\n\n${linhas.join("\n")}\n\nTotal: ${totalItens} itens`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div className="header">
        <div className="container header-inner">
          <a href="/pedidos-fornecedores" className="back-btn">← Voltar</a>
          <img src="/logo.jpg" alt="Tulipa" className="header-logo" />
          <div className="header-text">
            <h1>🧻 Mili Professional</h1>
            <p>Papel higiênico, guardanapos e toalhas</p>
          </div>
        </div>
      </div>
      <main style={{ flex: 1 }}>
        <div className="container" style={{ paddingTop: 20 }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Buscar produto ou referência..."
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
                    background: filtroCategoria === cat ? "#0066cc" : "white",
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
                  <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f6ff", padding: 8 }}>
                    <img
                      src={produto.imagem}
                      alt={produto.nome}
                      style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                  <div style={{ padding: 12 }}>
                    <span style={{ display: "inline-block", padding: "2px 6px", background: "#e6f0ff", color: "#0066cc", borderRadius: 4, fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>
                      {produto.categoria}
                    </span>
                    <h3 style={{ margin: "0 0 4px 0", fontSize: "0.9rem", color: "#000", textTransform: "uppercase", fontWeight: 700 }}>{produto.nome}</h3>
                    <p style={{ margin: 0, fontSize: "0.7rem", color: "#94a3b8" }}>Ref: {produto.ref}</p>
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
                <button onClick={gerarRomaneio} style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "#0066cc", color: "white", cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
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
