"use client";

import { useState } from "react";

type Produto = {
  id: string;
  nome: string;
  imagem: string;
  imagemFallback: string;
  categoria: string;
  descricao: string;
  ref?: string;
};

type ItemPedido = {
  produto: Produto;
  quantidade: number;
};

const BASE = "https://www.toq.ind.br";

const produtos: Produto[] = [
  // Vassouras
  { id: "1", nome: "Pluri", imagem: BASE + "/fotos/produtos/pluri-1.png", imagemFallback: BASE + "/img/produtos/pluri.svg", categoria: "Vassouras", descricao: "Vassoura multiuso sem capa", ref: "329" },
  { id: "2", nome: "Pluri Plus", imagem: BASE + "/fotos/produtos/pluri-plus-1.png", imagemFallback: BASE + "/img/produtos/pluri-plus.svg", categoria: "Vassouras", descricao: "Vassoura multiuso com capa", ref: "336" },
  { id: "3", nome: "Pluri Cantos", imagem: BASE + "/fotos/produtos/pluri-cantos-1.png", imagemFallback: BASE + "/img/produtos/pluri-cantos.svg", categoria: "Vassouras", descricao: "Vassoura multiuso angular com capa" },
  { id: "4", nome: "Pluri Max", imagem: BASE + "/fotos/produtos/pluri-max-1.png", imagemFallback: BASE + "/img/produtos/pluri-max.svg", categoria: "Vassouras", descricao: "Vassoura multiuso grande com capa" },
  { id: "5", nome: "Super Pluma", imagem: BASE + "/fotos/produtos/super-pluma-1.png", imagemFallback: BASE + "/img/produtos/super-pluma.svg", categoria: "Vassouras", descricao: "Vassoura para todos os tipos de pisos e sujeiras" },
  { id: "6", nome: "Plena Plus", imagem: BASE + "/fotos/produtos/plena-plus-1.png", imagemFallback: BASE + "/img/produtos/plena-plus.svg", categoria: "Vassouras", descricao: "Vassoura pêlo longo com capa" },
  { id: "7", nome: "Sutile", imagem: BASE + "/fotos/produtos/sutile-1.png", imagemFallback: BASE + "/img/produtos/sutile.svg", categoria: "Vassouras", descricao: "Vassoura de uso interno sem capa" },
  { id: "8", nome: "Sutile Plus", imagem: BASE + "/fotos/produtos/sutile-plus-1.png", imagemFallback: BASE + "/img/produtos/sutile-plus.svg", categoria: "Vassouras", descricao: "Vassoura de uso interno com capa" },
  { id: "9", nome: "Xterna", imagem: BASE + "/fotos/produtos/xterna-1.png", imagemFallback: BASE + "/img/produtos/xterna.svg", categoria: "Vassouras", descricao: "Vassoura de uso externo sem capa" },
  { id: "10", nome: "Xterna Plus", imagem: BASE + "/fotos/produtos/xterna-plus-1.png", imagemFallback: BASE + "/img/produtos/xterna-plus.svg", categoria: "Vassouras", descricao: "Vassoura de uso externo com capa" },
  { id: "11", nome: "Esfregão", imagem: BASE + "/fotos/produtos/esfreg-o-1.png", imagemFallback: BASE + "/img/produtos/esfreg-o.svg", categoria: "Vassouras", descricao: "Esfregão" },
  { id: "12", nome: "Forc 30 cm", imagem: BASE + "/fotos/produtos/forc-30-1.png", imagemFallback: BASE + "/img/produtos/forc-30.svg", categoria: "Vassouras", descricao: "Vassourão de uso externo" },
  { id: "13", nome: "Forc 40 cm", imagem: BASE + "/fotos/produtos/forc-40-1.png", imagemFallback: BASE + "/img/produtos/forc-40.svg", categoria: "Vassouras", descricao: "Vassourão de uso externo" },
  { id: "14", nome: "Flora", imagem: BASE + "/fotos/produtos/flora-1.png", imagemFallback: BASE + "/img/produtos/flora.svg", categoria: "Vassouras", descricao: "Vassoura para Jardim" },
  // Rodos
  { id: "15", nome: "Rod-o 30 cm", imagem: BASE + "/fotos/produtos/rod-o-30-1.png", imagemFallback: BASE + "/img/produtos/rod-o-30.svg", categoria: "Rodos", descricao: "Rodo duplo 30 cm" },
  { id: "16", nome: "Rod-o 40 cm", imagem: BASE + "/fotos/produtos/rod-o-40-1.png", imagemFallback: BASE + "/img/produtos/rod-o-40.svg", categoria: "Rodos", descricao: "Rodo duplo 40 cm" },
  { id: "17", nome: "Rod-o 60 cm", imagem: BASE + "/fotos/produtos/rod-o-60-1.png", imagemFallback: BASE + "/img/produtos/rod-o-60.svg", categoria: "Rodos", descricao: "Rodo duplo 60 cm" },
  { id: "18", nome: "Limpi", imagem: BASE + "/fotos/produtos/limpi-1.png", imagemFallback: BASE + "/img/produtos/limpi.svg", categoria: "Rodos", descricao: "Rodinho multiuso" },
  // Pás
  { id: "19", nome: "Junt", imagem: BASE + "/fotos/produtos/junt-1.png", imagemFallback: BASE + "/img/produtos/junt.svg", categoria: "Pás", descricao: "Pá para lixo" },
  { id: "20", nome: "Colet", imagem: BASE + "/fotos/produtos/colet-1.png", imagemFallback: BASE + "/img/produtos/colet.svg", categoria: "Pás", descricao: "Pá para lixo com cabo" },
  // Escovas
  { id: "21", nome: "Fricci", imagem: BASE + "/fotos/produtos/fricci-1.png", imagemFallback: BASE + "/img/produtos/fricci.svg", categoria: "Escovas", descricao: "Escova de madeira" },
  { id: "22", nome: "Fricci Plus", imagem: BASE + "/fotos/produtos/fricci-plus-1.png", imagemFallback: BASE + "/img/produtos/fricci-plus.svg", categoria: "Escovas", descricao: "Escova plástica" },
  { id: "23", nome: "Fricci Max", imagem: BASE + "/fotos/produtos/fricci-max-1.png", imagemFallback: BASE + "/img/produtos/fricci-max.svg", categoria: "Escovas", descricao: "Escova plástica grande" },
  { id: "24", nome: "Atrita", imagem: BASE + "/fotos/produtos/atrita-1.png", imagemFallback: BASE + "/img/produtos/atrita.svg", categoria: "Escovas", descricao: "Escova plástica com alça" },
  { id: "25", nome: "Sanit", imagem: BASE + "/fotos/produtos/sanit-1.png", imagemFallback: BASE + "/img/produtos/sanit.svg", categoria: "Escovas", descricao: "Escova sanitária" },
  { id: "26", nome: "Sanit Plus", imagem: BASE + "/fotos/produtos/sanit-plus-1.png", imagemFallback: BASE + "/img/produtos/sanit-plus.svg", categoria: "Escovas", descricao: "Escova sanitária com estojo" },
  { id: "27", nome: "Chuá", imagem: BASE + "/fotos/produtos/chua-1.png", imagemFallback: BASE + "/img/produtos/chua.svg", categoria: "Escovas", descricao: "Escova de banho" },
  // Utilidades
  { id: "28", nome: "Prendedura", imagem: BASE + "/fotos/produtos/prendedura-1.png", imagemFallback: BASE + "/img/produtos/prendedura.svg", categoria: "Utilidades", descricao: "Prendedores multiuso" },
  { id: "29", nome: "Pendur-e", imagem: BASE + "/fotos/produtos/pendur-e-1.png", imagemFallback: BASE + "/img/produtos/pendur-e.svg", categoria: "Utilidades", descricao: "Cabide" },
];

export default function ToqPage() {
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
      rows.push(`<tr style="background:#f3e8ff;"><td colspan="3" style="padding:8px 10px;font-weight:800;font-size:15px;color:#54268C;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #54268C;">${categoria}</td></tr>`);
      for (const item of items) {
        rows.push(`<tr><td style="width:70px;padding:8px;border-bottom:1px solid #ddd;vertical-align:middle;"><img src="${item.produto.imagem}" style="width:50px;height:50px;object-fit:contain;" /></td><td style="padding:8px;border-bottom:1px solid #ddd;vertical-align:middle;"><strong>${item.produto.nome}</strong><br/><small style="color:#666;">${item.produto.descricao}</small></td><td style="padding:8px;border-bottom:1px solid #ddd;vertical-align:middle;text-align:center;font-weight:900;font-size:18px;color:#54268C;">${item.quantidade}</td></tr>`);
      }
    }

    const dataAtual = new Date().toLocaleDateString("pt-BR");
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      @page { size: A4; margin: 15mm; }
      * { margin: 0; padding: 0; box-sizing: border-box; font-family: Arial, sans-serif; }
      body { width: 210mm; min-height: 297mm; padding: 20mm 15mm; color: #333; }
      .h { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #54268C; }
      .h h1 { font-size: 26px; color: #54268C; }
      .h p { color: #666; font-size: 14px; margin-top: 6px; }
      .info { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 14px; }
      .info strong { color: #54268C; }
      table { width: 100%; border-collapse: collapse; }
      th { background: #54268C; color: #fff; padding: 8px 10px; text-align: left; font-size: 13px; }
      .total { background: #f3e8ff; font-weight: 700; }
      .total td { padding: 10px 8px; border-top: 2px solid #54268C; }
      .foot { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #999; font-size: 11px; }
    </style></head><body>
      <div class="h"><h1>🧹 toQ</h1><p>Pedido de Produtos de Limpeza</p></div>
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
    const msg = `Olá! Gostaria de fazer um pedido da toQ:\n\n${linhas.join("\n")}\n\nTotal: ${totalItens} itens`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div className="header">
        <div className="container header-inner">
          <a href="/pedidos-fornecedores" className="back-btn">← Voltar</a>
          <img src="/logo.jpg" alt="Tulipa" className="header-logo" />
          <div className="header-text">
            <h1>🧹 toQ</h1>
            <p>Vassouras, rodos, pás, escovas e utilidades</p>
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
                    background: filtroCategoria === cat ? "#54268C" : "white",
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
                  <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", background: "#f3e8ff", padding: 8 }}>
                    <img
                      src={produto.imagem}
                      alt={produto.nome}
                      style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = produto.imagemFallback;
                      }}
                    />
                  </div>
                  <div style={{ padding: 12 }}>
                    <span style={{ display: "inline-block", padding: "2px 6px", background: "#f3e8ff", color: "#54268C", borderRadius: 4, fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>
                      {produto.categoria}
                    </span>
                    <h3 style={{ margin: "0 0 4px 0", fontSize: "0.95rem", color: "#000", textTransform: "uppercase", fontWeight: 700 }}>{produto.nome}</h3>
                    {produto.ref && <p style={{ margin: 0, fontSize: "0.7rem", color: "#94a3b8" }}>Ref: {produto.ref}</p>}
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
                <button onClick={gerarRomaneio} style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "#54268C", color: "white", cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
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
