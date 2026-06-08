"use client";

import { useEffect, useState } from "react";

type Produto = {
  id: string;
  nome: string;
  imagem: string;
  categoria: string;
  fragrancias?: string[];
  tipos?: string[];
};

type ItemPedido = {
  produto: Produto;
  caixas: number;
  fragrancia: string;
  variacao: string;
};

function chaveItem(produtoId: string, fragrancia: string, variacao: string): string {
  return `${produtoId}||${fragrancia}||${variacao}`;
}

export default function SanyPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [itens, setItens] = useState<Record<string, ItemPedido>>({});
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [vendedor, setVendedor] = useState("");

  useEffect(() => {
    fetch("/api/sany-produtos")
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

  const updateItem = (produto: Produto, caixas: number, fragrancia: string, variacao: string) => {
    const key = chaveItem(produto.id, fragrancia, variacao);
    setItens((prev) => {
      const next = { ...prev };
      if (caixas <= 0) {
        delete next[key];
      } else {
        next[key] = { produto, caixas, fragrancia, variacao };
      }
      return next;
    });
  };

  const totalCaixas = Object.values(itens).reduce((s, i) => s + i.caixas, 0);
  const totalItens = Object.keys(itens).length;

  const gerarRomaneio = async () => {
    const sel = Object.values(itens);
    if (sel.length === 0) return;

    const paraImagem = async (url: string) => {
      try {
        const r = await fetch(`/api/image-proxy?url=${encodeURIComponent(url)}`);
        const d = await r.json();
        return d.dataUrl || url;
      } catch { return url; }
    };

    const rows = await Promise.all(sel.map(async (item) => {
      const imgData = await paraImagem(item.produto.imagem);
      const variacaoTexto = [item.fragrancia, item.variacao].filter(Boolean).join(" / ");
      return `
        <tr>
          <td class="img-cell"><img src="${imgData}" /></td>
          <td><strong>${item.produto.nome}</strong></td>
          <td>${variacaoTexto || "-"}</td>
          <td class="qtd-cell">${item.caixas}</td>
        </tr>
      `;
    }));

    const dataAtual = new Date().toLocaleDateString("pt-BR");
    const html = `
      <html>
      <head>
        <style>
          @page { size: A4; margin: 15mm; }
          * { margin: 0; padding: 0; box-sizing: border-box; font-family: Arial, Helvetica, sans-serif; }
          body { width: 210mm; min-height: 297mm; padding: 20mm 15mm; }
          .header-rom { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #0d5e35; }
          .header-rom h1 { font-size: 28px; color: #0d5e35; }
          .header-rom p { color: #666; font-size: 14px; margin-top: 6px; }
          .info { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 14px; color: #333; }
          .info strong { color: #0d5e35; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th { text-align: left; padding: 10px 8px; background: #0d5e35; color: #fff; font-size: 14px; }
          td { padding: 10px 8px; border-bottom: 1px solid #ddd; vertical-align: middle; }
          .img-cell { width: 80px; }
          .img-cell img { width: 60px; height: 60px; object-fit: contain; border-radius: 6px; border: 1px solid #eee; }
          .qtd-cell { text-align: center; font-weight: 900; font-size: 20px; color: #0d5e35; }
          .total-row { background: #e8f5ee; font-weight: 700; }
          .total-row td { padding: 12px 8px; border-top: 2px solid #0d5e35; }
          .footer-rom { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #999; font-size: 12px; }
        </style>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"><\/script>
      </head>
      <body>
        <div id="content">
          <div class="header-rom">
            <h1>Romaneio - Sany do Brasil</h1>
            <p>Pedido gerado em ${dataAtual}</p>
          </div>
          <div class="info">
            <div><strong>Vendedor(a):</strong> ${vendedor || "Não informado"}</div>
            <div><strong>Total de itens:</strong> ${totalItens}</div>
            <div><strong>Total caixas:</strong> ${totalCaixas}</div>
          </div>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Produto</th>
                <th>Variação</th>
                <th style="text-align:center;">Caixas</th>
              </tr>
            </thead>
            <tbody>
              ${rows.join("")}
              <tr class="total-row">
                <td></td>
                <td><strong>TOTAL</strong></td>
                <td></td>
                <td class="qtd-cell">${totalCaixas}</td>
              </tr>
            </tbody>
          </table>
          <div class="footer-rom">
            <p>VENDEDORAS - TULIPA © ${new Date().getFullYear()} · Documento gerado automaticamente</p>
          </div>
        </div>
        <script>
          (function() {
            var opt = {
              margin:        [15, 15, 15, 15],
              filename:      'romaneio-sany-${Date.now()}.pdf',
              image:         { type: 'jpeg', quality: 0.98 },
              html2canvas:   { scale: 2, useCORS: true, letterRendering: true, allowTaint: true },
              jsPDF:         { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            html2pdf().set(opt).from(document.getElementById('content')).save();
          })();
        <\/script>
      </body>
      </html>
    `;

    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-text">Carregando produtos do fornecedor...</div>
      </div>
    );
  }

  if (erro || produtos.length === 0) {
    return (
      <div className="page-wrap">
        <div className="header no-print">
          <div className="container header-inner">
            <a href="/pedidos-fornecedores" className="back-btn">← Voltar</a>
            <div className="header-text"><h1>Sany do Brasil</h1></div>
          </div>
        </div>
        <main className="main-center">
          <div className="empty-state">
            <div className="empty-icon">!</div>
            <h2>Produtos indisponíveis</h2>
            <p>Não foi possível carregar os produtos do site do fornecedor.</p>
            {erro && <p className="empty-erro">{erro}</p>}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <div className="header no-print">
        <div className="container header-inner">
          <a href="/pedidos-fornecedores" className="back-btn">← Voltar</a>
          <img src="/logo.jpg" alt="Tulipa" className="header-logo" />
          <div className="header-text">
            <h1>Sany do Brasil</h1>
            <p>Selecione os produtos, variações e quantidades</p>
          </div>
        </div>
      </div>

      <main className="main-content">
        <div className="container">
          <div className="toolbar no-print">
            <div className="toolbar-field">
              <label className="toolbar-label">Vendedor(a)</label>
              <input value={vendedor} onChange={(e) => setVendedor(e.target.value)} placeholder="Seu nome" className="toolbar-input" />
            </div>
            <div className="toolbar-stats">
              <div className="stat-box">
                <div className="stat-num">{totalItens}</div>
                <div className="stat-label">itens</div>
              </div>
              <div className="stat-box">
                <div className="stat-num">{totalCaixas}</div>
                <div className="stat-label">caixas</div>
              </div>
              <button onClick={gerarRomaneio} className="btn btn-primary" disabled={totalItens === 0}>
                Gerar Romaneio PDF
              </button>
            </div>
          </div>

          {categorias.map((cat) => {
            const catProdutos = produtos.filter((p) => p.categoria === cat);
            return (
              <section key={cat} className="cat-section">
                <h2 className="cat-title">{cat}</h2>
                <div className="prod-grid">
                  {catProdutos.map((prod) => (
                    <ProdutoCard
                      key={prod.id}
                      produto={prod}
                      itens={itens}
                      updateItem={updateItem}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <div className="no-print">
        <Footer />
      </div>

      <style>{`
        .page-wrap { display: flex; flex-direction: column; min-height: 100vh; }

        .loading-screen { display: flex; align-items: center; justify-content: center; min-height: 100vh; color: #64748b; flex-direction: column; }
        .loading-text { font-size: 1rem; }

        .main-center { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px 16px; }
        .empty-state { text-align: center; color: #64748b; }
        .empty-icon { font-size: 48px; margin-bottom: 12px; font-weight: 900; color: #94a3b8; }
        .empty-state h2 { color: #0d5e35; margin-bottom: 8px; font-size: 1.2rem; }
        .empty-erro { font-size: 0.85rem; margin-top: 8px; color: #ef4444; }

        .main-content { flex: 1; padding: 16px 0; }

        .toolbar { display: flex; gap: 12px; align-items: flex-end; margin-bottom: 20px; flex-wrap: wrap; }
        .toolbar-field { flex: 1; min-width: 180px; }
        .toolbar-label { display: block; font-weight: 600; font-size: 0.8rem; color: #64748b; margin-bottom: 4px; }
        .toolbar-input { width: 100%; padding: 10px 14px; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 1rem; font-family: inherit; }
        .toolbar-stats { display: flex; gap: 8px; align-items: flex-end; flex-wrap: wrap; }

        .stat-box { background: #e8f5ee; padding: 8px 14px; border-radius: 10px; text-align: center; white-space: nowrap; }
        .stat-num { font-size: 1.3rem; font-weight: 900; color: #0d5e35; line-height: 1.2; }
        .stat-label { font-size: 0.7rem; color: #64748b; }

        .cat-section { margin-bottom: 24px; }
        .cat-title { font-size: 1.2rem; font-weight: 800; color: #0d5e35; margin-bottom: 10px; }

        .prod-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 10px; }

        .prod-card { background: #fff; border-radius: 14px; border: 1px solid #e2e8f0; padding: 12px; transition: all 0.15s; }
        .prod-card.has-item { border: 2px solid #15814a; box-shadow: 0 4px 12px rgba(21,129,74,0.12); }
        .prod-card-inner { display: flex; gap: 10px; }
        .prod-img { width: 56px; height: 56px; object-fit: contain; border-radius: 8px; border: 1px solid #f0f0f0; flex-shrink: 0; align-self: flex-start; }
        .prod-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; }
        .prod-name { font-size: 0.9rem; font-weight: 700; line-height: 1.2; }

        .prod-select { width: 100%; padding: 6px 8px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.85rem; font-family: inherit; background: #fff; }
        .prod-input { width: 100%; padding: 6px 8px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.85rem; font-family: inherit; }

        .qtd-row { display: flex; align-items: center; gap: 6px; margin-top: 2px; flex-wrap: wrap; }
        .qtd-btn { width: 32px; height: 32px; border-radius: 8px; border: 1px solid #e2e8f0; background: #f8faf8; cursor: pointer; font-size: 18px; font-weight: 700; display: flex; align-items: center; justify-content: center; user-select: none; }
        .qtd-btn:active { background: #e2e8f0; }
        .qtd-input { width: 44px; text-align: center; padding: 4px 0; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 1rem; font-weight: 700; font-family: inherit; }
        .qtd-label { font-size: 0.7rem; color: #94a3b8; }

        .qtd-badge { display: inline-flex; align-items: center; gap: 4px; background: #15814a; color: #fff; font-size: 0.7rem; font-weight: 700; padding: 2px 8px; border-radius: 20px; white-space: nowrap; }

        @media (max-width: 600px) {
          .prod-grid { grid-template-columns: 1fr; }
          .prod-card { padding: 10px; }
          .prod-img { width: 48px; height: 48px; }
          .prod-name { font-size: 0.85rem; }
          .toolbar { flex-direction: column; align-items: stretch; }
          .toolbar-stats { justify-content: stretch; }
          .toolbar-stats .btn { flex: 1; text-align: center; }
          .stat-box { flex: 1; }
          .qtd-btn { width: 36px; height: 36px; }
          .qtd-input { width: 50px; font-size: 1.1rem; }
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
  updateItem: (produto: Produto, caixas: number, fragrancia: string, variacao: string) => void;
}) {
  const [selFragrancia, setSelFragrancia] = useState("");
  const [selVariacao, setSelVariacao] = useState("");
  const [selCustom, setSelCustom] = useState("");

  const temFragrancias = !!produto.fragrancias?.length;
  const temTipos = !!produto.tipos?.length;

  const chaveAtual = chaveItem(
    produto.id,
    temFragrancias ? selFragrancia : "",
    temTipos ? selVariacao : selCustom
  );
  const item = itens[chaveAtual];

  const fragranciaFinal = temFragrancias ? selFragrancia : "";
  const variacaoFinal = temTipos ? selVariacao : selCustom;

  const handleQtd = (novoValor: number) => {
    updateItem(produto, Math.max(0, novoValor), fragranciaFinal, variacaoFinal);
  };

  return (
    <div className={`prod-card ${item ? "has-item" : ""}`}>
      <div className="prod-card-inner">
        <img src={produto.imagem} alt={produto.nome} className="prod-img" />
        <div className="prod-body">
          <strong className="prod-name">{produto.nome}</strong>

          {temFragrancias && (
            <select className="prod-select" value={selFragrancia} onChange={(e) => setSelFragrancia(e.target.value)}>
              <option value="">Fragrância</option>
              {produto.fragrancias!.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          )}

          {temTipos && (
            <select className="prod-select" value={selVariacao} onChange={(e) => setSelVariacao(e.target.value)}>
              <option value="">Tamanho/Tipo</option>
              {produto.tipos!.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          )}

          {!temTipos && !temFragrancias && (
            <input className="prod-input" value={selCustom} onChange={(e) => setSelCustom(e.target.value)} placeholder="Variação (ex: 500ml, 1kg...)" />
          )}

          <div className="qtd-row">
            <button className="qtd-btn" onClick={() => handleQtd((item?.caixas || 0) - 1)} disabled={!item}>−</button>
            <input type="number" min="0" className="qtd-input" value={item?.caixas || 0}
              onChange={(e) => handleQtd(parseInt(e.target.value) || 0)} />
            <button className="qtd-btn" onClick={() => handleQtd((item?.caixas || 0) + 1)}>+</button>
            <span className="qtd-label">caixas</span>
            {item && <span className="qtd-badge">{selFragrancia || selVariacao || selCustom || "ok"}</span>}
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
