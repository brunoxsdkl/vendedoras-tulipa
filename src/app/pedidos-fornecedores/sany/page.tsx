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

  const updateItem = (produto: Produto, caixas: number, fragrancia?: string, variacao?: string) => {
    setItens((prev) => {
      const next = { ...prev };
      if (caixas <= 0) {
        delete next[produto.id];
      } else {
        next[produto.id] = {
          produto,
          caixas,
          fragrancia: fragrancia || "",
          variacao: variacao || "",
        };
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
            <h1>🧹 ROMANEIO - SANY DO BRASIL</h1>
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", color: "#64748b", flexDirection: "column" }}>
        <div style={{ fontSize: 24, marginBottom: 8 }}>🔄</div>
        <div>Carregando produtos do fornecedor...</div>
      </div>
    );
  }

  if (erro || produtos.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <div className="header">
          <div className="container header-inner">
            <a href="/pedidos-fornecedores" className="back-btn">← Voltar</a>
            <div className="header-text"><h1>🧹 Sany do Brasil</h1></div>
          </div>
        </div>
        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", color: "#64748b" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
            <h2 style={{ color: "#0d5e35", marginBottom: 8 }}>Produtos indisponíveis</h2>
            <p>Não foi possível carregar os produtos do site do fornecedor.</p>
            <p style={{ fontSize: "0.85rem", marginTop: 8 }}>{erro}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div className="header no-print">
        <div className="container header-inner">
          <a href="/pedidos-fornecedores" className="back-btn">← Voltar</a>
          <img src="/logo.jpg" alt="Tulipa" className="header-logo" />
          <div className="header-text">
            <h1>🧹 Sany do Brasil</h1>
            <p>Selecione os produtos, variações e quantidades</p>
          </div>
        </div>
      </div>

      <main style={{ flex: 1, padding: "20px 0" }}>
        <div className="container">
          <div className="no-print" style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 24, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", color: "#64748b", marginBottom: 4 }}>Vendedor(a)</label>
              <input value={vendedor} onChange={(e) => setVendedor(e.target.value)} placeholder="Seu nome" style={{ width: "100%", padding: "10px 14px", border: "2px solid #e2e8f0", borderRadius: 10, fontSize: "1rem", fontFamily: "Barlow, sans-serif" }} />
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end", paddingTop: 18 }}>
              <div style={{ background: "#e8f5ee", padding: "10px 18px", borderRadius: 10, textAlign: "center" }}>
                <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#0d5e35" }}>{totalItens}</div>
                <div style={{ fontSize: "0.75rem", color: "#64748b" }}>itens</div>
              </div>
              <div style={{ background: "#e8f5ee", padding: "10px 18px", borderRadius: 10, textAlign: "center" }}>
                <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#0d5e35" }}>{totalCaixas}</div>
                <div style={{ fontSize: "0.75rem", color: "#64748b" }}>caixas</div>
              </div>
              <button onClick={gerarRomaneio} className="btn btn-primary" disabled={totalItens === 0}
                style={{ opacity: totalItens === 0 ? 0.5 : 1, cursor: totalItens === 0 ? "not-allowed" : "pointer" }}>
                📄 Gerar Romaneio PDF
              </button>
            </div>
          </div>

          {categorias.map((cat) => {
            const catProdutos = produtos.filter((p) => p.categoria === cat);
            return (
              <section key={cat} style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0d5e35", marginBottom: 12, letterSpacing: "-0.3px" }}>{cat}</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
                  {catProdutos.map((prod) => {
                    const item = itens[prod.id];
                    return (
                      <div key={prod.id} style={{
                        background: "#fff", borderRadius: 16, border: item ? "2px solid #15814a" : "1px solid #e2e8f0",
                        padding: 16, display: "flex", gap: 12, transition: "all 0.15s",
                        boxShadow: item ? "0 4px 12px rgba(21,129,74,0.12)" : "none",
                      }}>
                        <img src={prod.imagem} alt={prod.nome} style={{ width: 64, height: 64, objectFit: "contain", borderRadius: 8, border: "1px solid #f0f0f0", flexShrink: 0, alignSelf: "center" }} />
                        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                          <strong style={{ fontSize: "0.95rem", lineHeight: 1.2 }}>{prod.nome}</strong>

                          {prod.tipos && (
                            <div>
                              <select value={item?.variacao || ""} onChange={(e) => {
                                const qtd = item?.caixas || 0;
                                if (qtd > 0) updateItem(prod, qtd, item?.fragrancia, e.target.value);
                              }} style={{ width: "100%", padding: "4px 6px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: "0.8rem", fontFamily: "Barlow, sans-serif", background: "#fff" }}>
                                <option value="">Tamanho/Tipo</option>
                                {prod.tipos.map((t) => <option key={t} value={t}>{t}</option>)}
                              </select>
                            </div>
                          )}

                          {prod.fragrancias && (
                            <div>
                              <select value={item?.fragrancia || ""} onChange={(e) => {
                                const qtd = item?.caixas || 0;
                                if (qtd > 0) updateItem(prod, qtd, e.target.value, item?.variacao);
                              }} style={{ width: "100%", padding: "4px 6px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: "0.8rem", fontFamily: "Barlow, sans-serif", background: "#fff" }}>
                                <option value="">Fragrância</option>
                                {prod.fragrancias.map((f) => <option key={f} value={f}>{f}</option>)}
                              </select>
                            </div>
                          )}

                          {(prod.tipos || prod.fragrancias) && (
                            <div>
                              <input value={(!prod.tipos && !prod.fragrancias) ? "" : (item?.variacao && !prod.tipos ? item.variacao : "") || (!prod.fragrancias ? "" : item?.fragrancia || "")} 
                                onChange={(e) => {
                                  const qtd = item?.caixas || 0;
                                  if (qtd > 0 && !prod.tipos && !prod.fragrancias) {
                                    updateItem(prod, qtd, "", e.target.value);
                                  }
                                }}
                                placeholder="Outra variação..." 
                                style={{ width: "100%", padding: "4px 6px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: "0.8rem", fontFamily: "Barlow, sans-serif" }} />
                            </div>
                          )}

                          {!prod.tipos && !prod.fragrancias && (
                            <div>
                              <input value={item?.variacao || ""} 
                                onChange={(e) => {
                                  const qtd = item?.caixas || 0;
                                  if (qtd > 0) updateItem(prod, qtd, "", e.target.value);
                                }}
                                placeholder="Variação (ex: 500ml, 1kg...)" 
                                style={{ width: "100%", padding: "4px 6px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: "0.8rem", fontFamily: "Barlow, sans-serif" }} />
                            </div>
                          )}

                          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                            <button onClick={() => {
                              const qtd = (item?.caixas || 0) - 1;
                              updateItem(prod, qtd, item?.fragrancia, item?.variacao);
                            }} style={{ width: 28, height: 28, borderRadius: 8, border: "1px solid #e2e8f0", background: "#f8faf8", cursor: "pointer", fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                            <input type="number" min="0" value={item?.caixas || 0} onChange={(e) => {
                              updateItem(prod, Math.max(0, parseInt(e.target.value) || 0), item?.fragrancia, item?.variacao);
                            }} style={{ width: 44, textAlign: "center", padding: "4px 0", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: "1rem", fontWeight: 700, fontFamily: "Barlow, sans-serif" }} />
                            <button onClick={() => {
                              const qtd = (item?.caixas || 0) + 1;
                              updateItem(prod, qtd, item?.fragrancia || "", item?.variacao || "");
                            }} style={{ width: 28, height: 28, borderRadius: 8, border: "1px solid #e2e8f0", background: "#f8faf8", cursor: "pointer", fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                            <span style={{ fontSize: "0.7rem", color: "#94a3b8", marginLeft: 2 }}>caixas</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <div className="no-print">
        <Footer />
      </div>
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
