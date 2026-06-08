"use client";

import { useEffect, useState } from "react";

type Produto = {
  id: string;
  nome: string;
  imagem: string;
  categoria: string;
  subcategoria: string;
  ref: string;
};

type ItemPedido = {
  produto: Produto;
  caixas: number;
};

const LOGO_FLASH = "/flashlimp-logo.png";

export default function FlashLimpPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [itens, setItens] = useState<Record<string, ItemPedido>>({});
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [vendedor, setVendedor] = useState("");

  useEffect(() => {
    fetch("/api/flashlimp-produtos")
      .then((r) => r.json())
      .then((data) => {
        if (data.erro) throw new Error(data.erro);
        setProdutos(data.produtos || []);
        setCategorias(data.categorias || []);
        setLoading(false);
      })
      .catch((e) => {
        setErro(e.message);
        setLoading(false);
      });
  }, []);

  const updateItem = (produto: Produto, caixas: number) => {
    setItens((prev) => {
      const next = { ...prev };
      if (caixas <= 0) {
        delete next[produto.id];
      } else {
        next[produto.id] = { produto, caixas };
      }
      return next;
    });
  };

  const totalCaixas = Object.values(itens).reduce((s, i) => s + i.caixas, 0);
  const totalItens = Object.keys(itens).length;

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
      rows.push(`<tr style="background:#e8f0fe;"><td colspan="4" style="padding:8px 10px;font-weight:800;font-size:15px;color:#1565c0;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #1565c0;">${categoria}</td></tr>`);
      for (const item of items) {
        rows.push(`<tr><td style="width:70px;padding:8px;border-bottom:1px solid #ddd;vertical-align:middle;"><img src="${item.produto.imagem}" style="width:50px;height:50px;object-fit:contain;" /></td><td style="padding:8px;border-bottom:1px solid #ddd;vertical-align:middle;"><strong>${item.produto.nome}</strong></td><td style="padding:8px;border-bottom:1px solid #ddd;vertical-align:middle;color:#666;font-size:13px;">${item.produto.ref || "-"}</td><td style="padding:8px;border-bottom:1px solid #ddd;vertical-align:middle;text-align:center;font-weight:900;font-size:18px;color:#1565c0;">${item.caixas}</td></tr>`);
      }
    }

    const dataAtual = new Date().toLocaleDateString("pt-BR");
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      @page { size: A4; margin: 15mm; }
      * { margin: 0; padding: 0; box-sizing: border-box; font-family: Arial, sans-serif; }
      body { width: 210mm; min-height: 297mm; padding: 20mm 15mm; color: #333; }
      .h { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #1565c0; }
      .h h1 { font-size: 26px; color: #1565c0; }
      .h p { color: #666; font-size: 14px; margin-top: 6px; }
      .info { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 14px; }
      .info strong { color: #1565c0; }
      table { width: 100%; border-collapse: collapse; }
      th { background: #1565c0; color: #fff; padding: 8px 10px; text-align: left; font-size: 13px; }
      .total { background: #e8f0fe; font-weight: 700; }
      .total td { padding: 10px 8px; border-top: 2px solid #1565c0; }
      .foot { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #999; font-size: 11px; }
    </style></head><body>
      <div class="h"><h1>Romaneio - Flash Limp</h1><p>Pedido gerado em ${dataAtual}</p></div>
      <div class="info"><div><strong>Vendedor(a):</strong> ${vendedor || "Não informado"}</div><div><strong>Total itens:</strong> ${totalItens} | <strong>Caixas:</strong> ${totalCaixas}</div></div>
      <table><thead><tr><th></th><th>Produto</th><th>Ref</th><th style="text-align:center;">Qtd</th></tr></thead><tbody>
        ${rows.join("")}
        <tr class="total"><td></td><td><strong>TOTAL GERAL</strong></td><td></td><td style="text-align:center;font-weight:900;font-size:20px;color:#1565c0;">${totalCaixas}</td></tr>
      </tbody></table>
      <div class="foot">VENDEDORAS - TULIPA &copy; ${new Date().getFullYear()}</div>
    </body></html>`;

    const iframe = document.createElement("iframe");
    iframe.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;border:none;z-index:9999;";
    document.body.appendChild(iframe);
    const doc = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document);
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();
      iframe.contentWindow!.focus();
      iframe.contentWindow!.print();
      setTimeout(() => { try { document.body.removeChild(iframe); } catch {} }, 30000);
    } else {
      document.body.removeChild(iframe);
    }
  };

  if (loading) {
    return (
      <div className="page-wrap">
        <div className="loading-screen">
          <div className="loading-spinner" />
          <div className="loading-text">Carregando produtos Flash Limp...</div>
        </div>
      </div>
    );
  }

  if (erro || produtos.length === 0) {
    return (
      <div className="page-wrap">
        <div className="header no-print">
          <div className="container header-inner">
            <a href="/pedidos-fornecedores" className="back-btn">← Voltar</a>
            <div className="header-text"><h1>Flash Limp</h1></div>
          </div>
        </div>
        <main className="main-center">
          <div className="empty-state">
            <div className="empty-icon">!</div>
            <h2>Produtos indisponíveis</h2>
            <p>Não foi possível carregar os produtos.</p>
            {erro && <p className="empty-erro">{erro}</p>}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <div className="header no-print" style={{ background: "linear-gradient(135deg, #1565c0, #1976d2)" }}>
        <div className="container header-inner">
          <a href="/pedidos-fornecedores" className="back-btn">← Voltar</a>
          <div className="header-text">
            <h1>Flash Limp</h1>
            <p>Pedido de compra</p>
          </div>
        </div>
      </div>

      <main className="main-content">
        <div className="container">
          <div className="vendedor-bar no-print">
            <label className="vendedor-label">Vendedor(a)</label>
            <input value={vendedor} onChange={(e) => setVendedor(e.target.value)} placeholder="Seu nome" className="vendedor-input" />
          </div>

          <div className="resumo-bar no-print">
            <div className="resumo-item">
              <span className="resumo-num">{totalItens}</span>
              <span className="resumo-leg">itens</span>
            </div>
            <div className="resumo-item">
              <span className="resumo-num">{totalCaixas}</span>
              <span className="resumo-leg">caixas</span>
            </div>
            <button onClick={gerarRomaneio} className="btn-resumo" disabled={totalItens === 0}>
              Gerar PDF
            </button>
          </div>

          {categorias.map((cat) => {
            const catProdutos = produtos.filter((p) => p.categoria === cat);
            const subcats = [...new Set(catProdutos.map((p) => p.subcategoria))].filter(Boolean);
            return (
              <section key={cat} className="cat-section">
                <h2 className="cat-title">{cat}</h2>
                {subcats.length > 1 ? (
                  subcats.map((sub) => {
                    const subProds = catProdutos.filter((p) => p.subcategoria === sub);
                    return (
                      <div key={sub} style={{ marginBottom: 12 }}>
                        <h3 className="sub-title">{sub}</h3>
                        <div className="prod-grid">
                          {subProds.map((prod) => (
                            <ProdutoCard key={prod.id} produto={prod} itens={itens} updateItem={updateItem} />
                          ))}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="prod-grid">
                    {catProdutos.map((prod) => (
                      <ProdutoCard key={prod.id} produto={prod} itens={itens} updateItem={updateItem} />
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </main>

      <div className="no-print">
        <Footer />
      </div>

      <style>{`
        .page-wrap { display: flex; flex-direction: column; min-height: 100vh; background: #f5f7fa; }

        .loading-screen { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; gap: 16px; color: #64748b; padding: 40px; }
        .loading-spinner { width: 40px; height: 40px; border: 4px solid #e2e8f0; border-top-color: #1565c0; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .main-center { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px 16px; }
        .empty-state { text-align: center; color: #64748b; }
        .empty-icon { font-size: 48px; margin-bottom: 12px; font-weight: 900; color: #94a3b8; }
        .empty-state h2 { color: #1565c0; margin-bottom: 8px; font-size: 1.2rem; }
        .empty-erro { font-size: 0.85rem; margin-top: 8px; color: #ef4444; }

        .main-content { flex: 1; padding: 0; }

        .vendedor-bar { background: #fff; margin: 12px; padding: 12px 16px; border-radius: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); display: flex; flex-direction: column; gap: 6px; }
        .vendedor-label { font-weight: 700; font-size: 0.8rem; color: #64748b; letter-spacing: 0.3px; text-transform: uppercase; }
        .vendedor-input { width: 100%; padding: 14px 16px; border: 2px solid #e2e8f0; border-radius: 12px; font-size: 1.1rem; font-family: inherit; background: #fff; }
        .vendedor-input:focus { outline: none; border-color: #1565c0; box-shadow: 0 0 0 4px rgba(21,101,192,0.1); }

        .resumo-bar { background: #fff; margin: 0 12px 16px; padding: 12px 16px; border-radius: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); display: flex; align-items: center; gap: 12px; }
        .resumo-item { display: flex; flex-direction: column; align-items: center; background: #e8f0fe; padding: 8px 20px; border-radius: 12px; }
        .resumo-num { font-size: 1.4rem; font-weight: 900; color: #1565c0; line-height: 1.2; }
        .resumo-leg { font-size: 0.7rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
        .btn-resumo { margin-left: auto; padding: 14px 24px; border: none; border-radius: 14px; background: #1565c0; color: #fff; font-weight: 800; font-size: 1rem; font-family: inherit; white-space: nowrap; cursor: pointer; box-shadow: 0 6px 14px rgba(21,101,192,0.25); transition: all 0.15s; }
        .btn-resumo:active { transform: scale(0.97); }
        .btn-resumo:disabled { opacity: 0.4; }

        .cat-section { padding: 0 12px; margin-bottom: 24px; }
        .cat-title { font-size: 1.1rem; font-weight: 800; color: #1565c0; margin-bottom: 10px; padding: 0 4px; }
        .sub-title { font-size: 0.85rem; font-weight: 700; color: #64748b; margin: 0 4px 6px; text-transform: uppercase; letter-spacing: 0.5px; }

        .prod-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 8px; }

        .prod-card { background: #fff; border-radius: 14px; border: 1px solid #e2e8f0; padding: 10px; transition: all 0.15s; }
        .prod-card.has-item { border: 2px solid #1565c0; box-shadow: 0 4px 16px rgba(21,101,192,0.15); }
        .prod-card-inner { display: flex; gap: 10px; align-items: center; }
        .prod-img { width: 52px; height: 52px; object-fit: contain; border-radius: 8px; border: 1px solid #f0f0f0; flex-shrink: 0; }
        .prod-body { flex: 1; min-width: 0; }
        .prod-name { font-size: 0.85rem; font-weight: 700; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .prod-ref { font-size: 0.7rem; color: #94a3b8; margin-top: 2px; }

        .qtd-row { display: flex; align-items: center; gap: 6px; margin-top: 6px; }
        .qtd-btn { width: 34px; height: 34px; border-radius: 8px; border: 2px solid #e2e8f0; background: #fff; cursor: pointer; font-size: 18px; font-weight: 700; display: flex; align-items: center; justify-content: center; color: #1565c0; }
        .qtd-btn:active { background: #e8f0fe; border-color: #1565c0; }
        .qtd-btn:disabled { opacity: 0.3; }
        .qtd-input { width: 42px; text-align: center; padding: 4px 0; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 1rem; font-weight: 800; font-family: inherit; }

        @media (min-width: 768px) {
          .vendedor-bar { margin: 16px 24px; padding: 16px 24px; flex-direction: row; align-items: center; gap: 16px; }
          .vendedor-input { max-width: 300px; }
          .resumo-bar { margin: 0 24px 20px; }
          .cat-section { padding: 0 24px; margin-bottom: 28px; }
          .prod-grid { gap: 10px; }
        }

        @media (max-width: 600px) {
          .prod-grid { grid-template-columns: 1fr; }
          .prod-card { padding: 8px; }
          .prod-img { width: 44px; height: 44px; }
          .prod-name { font-size: 0.8rem; }
          .qtd-btn { width: 38px; height: 38px; }
          .qtd-input { width: 48px; }
          .cat-title { font-size: 1rem; }
          .vendedor-input { font-size: 1rem; padding: 12px 14px; }
        }
      `}</style>
    </div>
  );
}

function ProdutoCard({
  produto,
  itens,
  updateItem,
}: {
  produto: Produto;
  itens: Record<string, ItemPedido>;
  updateItem: (produto: Produto, caixas: number) => void;
}) {
  const item = itens[produto.id];

  const handleQtd = (v: number) => updateItem(produto, Math.max(0, v));

  return (
    <div className={`prod-card ${item ? "has-item" : ""}`}>
      <div className="prod-card-inner">
        <img src={produto.imagem} alt={produto.nome} className="prod-img" />
        <div className="prod-body">
          <strong className="prod-name">{produto.nome}</strong>
          {produto.ref && <div className="prod-ref">{produto.ref}</div>}
          <div className="qtd-row">
            <button className="qtd-btn" onClick={() => handleQtd((item?.caixas || 0) - 1)} disabled={!item}>−</button>
            <input type="number" min="0" className="qtd-input" value={item?.caixas || 0}
              onChange={(e) => handleQtd(parseInt(e.target.value) || 0)} />
            <button className="qtd-btn" onClick={() => handleQtd((item?.caixas || 0) + 1)}>+</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} VENDEDORAS - TULIPA</p>
      <style>{`.footer { text-align: center; padding: 20px; font-size: 0.8rem; color: #94a3b8; border-top: 1px solid #e2e8f0; background: white; }`}</style>
    </footer>
  );
}
