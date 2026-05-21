"use client";

import { useState } from "react";

type Modo = "caixa" | "produto";

const labelHeights: Record<number, number> = { 1: 280, 2: 140, 3: 93, 4: 70 };
const fontSizes = (qtd: number) => {
  if (qtd === 1) return { line1: 220, line2: 130 };
  if (qtd === 2) return { line1: 140, line2: 80 };
  if (qtd === 3) return { line1: 100, line2: 60 };
  return { line1: 76, line2: 46 };
};

export default function EtiquetaPage() {
  const [modo, setModo] = useState<Modo>("produto");
  const [nf, setNf] = useState("");
  const [cliente, setCliente] = useState("");
  const [produto, setProduto] = useState("");
  const [preco, setPreco] = useState("");
  const [quantidade, setQuantidade] = useState(1);

  const line1 = modo === "caixa" ? nf : produto;
  const line2 = modo === "caixa" ? cliente : preco;
  const setLine1 = modo === "caixa" ? setNf : setProduto;
  const setLine2 = modo === "caixa" ? setCliente : setPreco;
  const label1 = modo === "caixa" ? "Número da NF" : "Nome do Produto";
  const label2 = modo === "caixa" ? "Nome do Cliente" : "Preço";
  const placeholder1 = modo === "caixa" ? "Ex: 123456" : "Ex: CUBO 250ML";
  const placeholder2 = modo === "caixa" ? "Nome completo" : "Ex: R$ 19,80";

  const h = labelHeights[quantidade];
  const f = fontSizes(quantidade);

  return (
    <div>
      <div className="header no-print">
        <div className="container header-inner">
          <a href="/" className="back-btn">← Voltar</a>
          <img src="/logo.jpg" alt="Tulipa" className="header-logo" />
          <div className="header-text">
            <h1>🏷️ Etiqueta</h1>
            <p>Imprima etiquetas em A4 retrato</p>
          </div>
        </div>
      </div>

      <main className="container">
        <div className="layout">
          <div className="sidebar no-print">
            <div className="card">
              <div className="modo-selector">
                <button className={`modo-btn ${modo === "produto" ? "active" : ""}`} onClick={() => setModo("produto")}>
                  🏷️ Produto
                </button>
                <button className={`modo-btn ${modo === "caixa" ? "active" : ""}`} onClick={() => setModo("caixa")}>
                  📦 Caixa
                </button>
              </div>

              <div className="form-group">
                <label>{label1}</label>
                <input value={line1} onChange={e => setLine1(e.target.value)} placeholder={placeholder1} autoFocus />
              </div>
              <div className="form-group">
                <label>{label2}</label>
                <input value={line2} onChange={e => setLine2(e.target.value)} placeholder={placeholder2} />
              </div>
              <div className="form-group">
                <label>Quantidade por folha</label>
                <div className="qtd-opts">
                  {[1, 2, 3, 4].map(n => (
                    <button key={n} className={`qtd-btn ${quantidade === n ? "active" : ""}`} onClick={() => setQuantidade(n)}>{n}x</button>
                  ))}
                </div>
              </div>
              {line1 && line2 && (
                <button className="btn btn-primary" style={{ width: "100%", marginTop: 8 }} onClick={() => window.print()}>
                  🖨️ Imprimir / Salvar PDF
                </button>
              )}
            </div>
          </div>

          <div className="preview-area">
            {!line1 || !line2 ? (
              <div className="empty-state">
                <span style={{ fontSize: 56, opacity: 0.2 }}>🏷️</span>
                <p>Preencha os campos</p>
              </div>
            ) : (
              <div className="sheet">
                <div className="sheet-label">A4 Retrato · {quantidade}x</div>
                {Array.from({ length: quantidade }).map((_, i) => (
                  <div key={i} className="label-box" style={{
                    height: `${h}mm`,
                    borderBottom: i < quantidade - 1 ? "2px dashed #d4d4d4" : "none",
                  }}>
                    <div className="label-line1" style={{ fontSize: `${f.line1}px` }}>{line1}</div>
                    <div className="label-line2" style={{ fontSize: `${f.line2}px` }}>{line2}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <style jsx>{`
        .layout {
          display: flex;
          gap: 32px;
          align-items: flex-start;
          padding: 16px 0;
        }
        .sidebar {
          flex: 0 0 340px;
          position: sticky;
          top: 16px;
        }
        .card {
          background: #fff;
          border-radius: 20px;
          padding: 28px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
        }
        .modo-selector {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
        }
        .modo-btn {
          flex: 1;
          padding: 12px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          background: #fff;
          font-size: 0.95rem;
          font-weight: 600;
          font-family: Barlow, sans-serif;
          color: #64748b;
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: center;
        }
        .modo-btn:hover { border-color: #15814a; color: #15814a; }
        .modo-btn.active { border-color: #15814a; background: #15814a; color: #fff; }
        .preview-area { flex: 1; min-width: 0; }
        .empty-state {
          background: #fff;
          border-radius: 20px;
          padding: 80px 32px;
          text-align: center;
          color: #94a3b8;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
        }
        .empty-state p { margin-top: 12px; font-size: 1rem; }
        .sheet {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }
        .sheet-label {
          background: #f1f5f9;
          padding: 8px 16px;
          font-size: 0.82rem;
          color: #64748b;
          text-align: center;
          border-bottom: 1px solid #e2e8f0;
          font-weight: 600;
        }
        .label-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 4mm 8mm;
          box-sizing: border-box;
        }
        .label-line1 {
          font-weight: 900;
          letter-spacing: 4px;
          color: #000;
          line-height: 1;
          word-break: break-all;
          max-width: 100%;
          text-transform: uppercase;
          font-family: "Courier New", monospace;
        }
        .label-line2 {
          font-weight: 800;
          color: #000;
          margin-top: 8px;
          line-height: 1.1;
          word-break: break-word;
          max-width: 100%;
          font-family: "Courier New", monospace;
        }
        .qtd-opts { display: flex; gap: 8px; }
        .qtd-btn {
          flex: 1;
          padding: 12px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          background: #fff;
          font-size: 1rem;
          font-weight: 600;
          font-family: Barlow, sans-serif;
          color: #64748b;
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: center;
        }
        .qtd-btn:hover { border-color: #15814a; color: #15814a; }
        .qtd-btn.active { border-color: #15814a; background: #15814a; color: #fff; }

        @media print {
          .no-print { display: none !important; }
          body { background: #fff !important; }
          .layout { display: block !important; padding: 0 !important; }
          .preview-area { max-width: 100% !important; }
          .sheet { box-shadow: none !important; border: none !important; border-radius: 0 !important; }
          .sheet-label { display: none !important; }
          .label-box { page-break-inside: avoid; }
          @page { size: A4 portrait; margin: 3mm; }
        }

        @media (max-width: 800px) {
          .layout { flex-direction: column; }
          .sidebar { flex: none; width: 100%; position: static; }
        }
      `}</style>
    </div>
  );
}
