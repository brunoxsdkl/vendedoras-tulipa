"use client";

import { useState } from "react";

type Modo = "caixa" | "produto";

const LABEL_W = 50; // mm
const LABEL_H = 20; // mm
const COLS = 4;
const ROWS = 14;
const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 5;

const startX = (PAGE_W - COLS * LABEL_W) / 2;
const startY = MARGIN;

export default function EtiquetaPage() {
  const [modo, setModo] = useState<Modo>("produto");
  const [nf, setNf] = useState("");
  const [cliente, setCliente] = useState("");
  const [produto, setProduto] = useState("");
  const [preco, setPreco] = useState("");

  const line1 = modo === "caixa" ? nf : produto;
  const line2 = modo === "caixa" ? cliente : preco;
  const setLine1 = modo === "caixa" ? setNf : setProduto;
  const setLine2 = modo === "caixa" ? setCliente : setPreco;
  const label1 = modo === "caixa" ? "Número da NF" : "Nome do Produto";
  const label2 = modo === "caixa" ? "Nome do Cliente" : "Preço";
  const placeholder1 = modo === "caixa" ? "Ex: 123456" : "Ex: CUBO 250ML";
  const placeholder2 = modo === "caixa" ? "Nome completo" : "Ex: R$ 19,80";

  const totalLabels = COLS * ROWS;
  const scale = 0.55;

  return (
    <div>
      <div className="header no-print">
        <div className="container header-inner">
          <a href="/" className="back-btn">← Voltar</a>
          <img src="/logo.jpg" alt="Tulipa" className="header-logo" />
          <div className="header-text">
            <h1>🏷️ Etiqueta Pequena</h1>
            <p>Etiquetas de 5cm × 2cm — {totalLabels} por folha A4</p>
          </div>
        </div>
      </div>

      <main className="container">
        <div className="layout">
          <div className="sidebar no-print">
            <div className="card">
              <div className="modo-selector">
                <button className={`modo-btn ${modo === "produto" ? "active" : ""}`} onClick={() => setModo("produto")}>🏷️ Produto</button>
                <button className={`modo-btn ${modo === "caixa" ? "active" : ""}`} onClick={() => setModo("caixa")}>📦 Caixa</button>
              </div>
              <div className="form-group">
                <label>{label1}</label>
                <input value={line1} onChange={e => setLine1(e.target.value)} placeholder={placeholder1} autoFocus />
              </div>
              <div className="form-group">
                <label>{label2}</label>
                <input value={line2} onChange={e => setLine2(e.target.value)} placeholder={placeholder2} />
              </div>
              {line1 && line2 && (
                <button className="btn btn-primary" style={{ width: "100%", marginTop: 8 }} onClick={() => window.print()}>
                  🖨️ Imprimir / Salvar PDF
                </button>
              )}
            </div>
            <div className="info-card">
              <strong>{totalLabels} etiquetas</strong> por folha A4<br />
              Cada etiqueta: <strong>5cm × 2cm</strong>
            </div>
          </div>

          <div className="preview-area">
            {!line1 || !line2 ? (
              <div className="empty-state">
                <span style={{ fontSize: 56, opacity: 0.2 }}>🏷️</span>
                <p>Preencha os campos</p>
              </div>
            ) : (
              <div className="sheet-wrapper">
                <div className="sheet-label">A4 Retrato • {totalLabels}x etiquetas de 5×2cm</div>
                <div className="sheet" style={{ width: `${PAGE_W}mm`, height: `${PAGE_H}mm` }}>
                  {Array.from({ length: totalLabels }).map((_, i) => {
                    const col = i % COLS;
                    const row = Math.floor(i / COLS);
                    return (
                      <div
                        key={i}
                        className="label"
                        style={{
                          left: `${startX + col * LABEL_W}mm`,
                          top: `${startY + row * LABEL_H}mm`,
                          width: `${LABEL_W}mm`,
                          height: `${LABEL_H}mm`,
                        }}
                      >
                        <div className="label-nome">{line1}</div>
                        <div className="label-preco">{line2}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <style jsx>{`
        .layout { display: flex; gap: 32px; align-items: flex-start; padding: 16px 0; }
        .sidebar { flex: 0 0 340px; position: sticky; top: 16px; }
        .card { background: #fff; border-radius: 20px; padding: 28px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
        .info-card { background: #f0f7f3; border-radius: 14px; padding: 16px 20px; margin-top: 12px; font-size: 0.9rem; color: #0d5e35; line-height: 1.5; }
        .modo-selector { display: flex; gap: 8px; margin-bottom: 24px; }
        .modo-btn { flex: 1; padding: 12px; border: 2px solid #e2e8f0; border-radius: 12px; background: #fff; font-size: 0.95rem; font-weight: 600; font-family: Barlow, sans-serif; color: #64748b; cursor: pointer; transition: all 0.15s ease; text-align: center; }
        .modo-btn:hover { border-color: #15814a; color: #15814a; }
        .modo-btn.active { border-color: #15814a; background: #15814a; color: #fff; }
        .preview-area { flex: 1; min-width: 0; }
        .empty-state { background: #fff; border-radius: 20px; padding: 80px 32px; text-align: center; color: #94a3b8; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
        .empty-state p { margin-top: 12px; font-size: 1rem; }
        .sheet-wrapper { background: #fff; border-radius: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); overflow: hidden; border: 1px solid #e2e8f0; }
        .sheet-label { background: #f1f5f9; padding: 10px 16px; font-size: 0.85rem; color: #64748b; text-align: center; border-bottom: 1px solid #e2e8f0; font-weight: 600; }
        .sheet { position: relative; margin: 0 auto; background: #fff; transform: scale(${scale}); transform-origin: top left; }
        .label {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          border: 0.5px dashed #e2e8f0;
          box-sizing: border-box;
          padding: 1mm;
          overflow: hidden;
        }
        .label-nome {
          font-size: 7px;
          font-weight: 800;
          color: #000;
          line-height: 1.1;
          word-break: break-word;
          max-width: 100%;
          text-transform: uppercase;
          font-family: "Courier New", monospace;
        }
        .label-preco {
          font-size: 9px;
          font-weight: 900;
          color: #000;
          margin-top: 1px;
          line-height: 1;
          word-break: break-word;
          max-width: 100%;
          font-family: "Courier New", monospace;
        }

        @media print {
          .no-print { display: none !important; }
          body { background: #fff !important; }
          .layout { display: block !important; padding: 0 !important; }
          .preview-area { max-width: 100% !important; }
          .sheet-wrapper { box-shadow: none !important; border: none !important; border-radius: 0 !important; }
          .sheet-label { display: none !important; }
          .sheet { transform: none !important; }
          .label { border: 0.5px dashed #ccc; }
          @page { size: A4 portrait; margin: 0; }
        }

        @media (max-width: 800px) {
          .layout { flex-direction: column; }
          .sidebar { flex: none; width: 100%; position: static; }
        }
      `}</style>
    </div>
  );
}
