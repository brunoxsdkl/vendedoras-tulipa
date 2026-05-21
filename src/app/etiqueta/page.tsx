"use client";

import { useState } from "react";

export default function EtiquetaPage() {
  const [nf, setNf] = useState("");
  const [cliente, setCliente] = useState("");
  const [quantidade, setQuantidade] = useState(1);

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    let labels = "";
    for (let i = 0; i < quantidade; i++) {
      labels += `
        <div style="
          width: 100%;
          height: 99mm;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          border-bottom: 2px dashed #ccc;
          page-break-inside: avoid;
          box-sizing: border-box;
          padding: 5mm 10mm;
        ">
          <div style="
            font-size: 96px;
            font-weight: 900;
            letter-spacing: 6px;
            color: #000;
            line-height: 1;
            word-break: break-all;
            max-width: 100%;
            text-transform: uppercase;
            font-family: 'Courier New', monospace;
          ">${nf}</div>
          <div style="
            font-size: 56px;
            font-weight: 800;
            color: #000;
            margin-top: 12px;
            line-height: 1.1;
            word-break: break-word;
            max-width: 100%;
            font-family: 'Courier New', monospace;
          ">${cliente}</div>
        </div>
      `;
    }

    printWindow.document.write(`
      <html>
      <head>
        <style>
          @page { size: A4 portrait; margin: 3mm; }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { width: 210mm; margin: 0 auto; background: #fff; font-family: 'Courier New', monospace; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        ${labels}
        <script>window.print();window.close();<\/script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div>
      <div className="header no-print">
        <div className="container header-inner">
          <a href="/" className="back-btn">← Voltar</a>
          <img src="/logo.jpg" alt="Tulipa" className="header-logo" />
          <div className="header-text">
            <h1>🏷️ Etiqueta para Caixa</h1>
            <p>Imprima etiquetas com NF e nome do cliente em A4 retrato</p>
          </div>
        </div>
      </div>

      <main className="container no-print">
        <div className="etiqueta-layout">
          <div className="form-panel">
            <h2 style={{ fontSize: "1.3rem", marginBottom: 20, color: "#1a202c" }}>Dados da Etiqueta</h2>
            <div className="form-group">
              <label>Número da NF</label>
              <input
                value={nf}
                onChange={(e) => setNf(e.target.value)}
                placeholder="Ex: 123456"
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>Nome do Cliente</label>
              <input
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                placeholder="Nome completo"
              />
            </div>
            <div className="form-group">
              <label>Quantidade</label>
              <div className="qtd-selector">
                {[1, 2, 3, 4].map((n) => (
                  <button
                    key={n}
                    className={`qtd-btn ${quantidade === n ? "active" : ""}`}
                    onClick={() => setQuantidade(n)}
                  >
                    {n}x
                  </button>
                ))}
              </div>
            </div>
            <button
              className="btn btn-primary"
              style={{ width: "100%", marginTop: 8 }}
              onClick={handlePrint}
              disabled={!nf || !cliente}
            >
              🖨️ Imprimir Etiqueta{!nf || !cliente ? " (preencha)" : ""}
            </button>
          </div>

          <div className="preview-panel">
            <h2 style={{ fontSize: "1.3rem", marginBottom: 20, color: "#1a202c" }}>
              Pré-visualização
              {nf && cliente && <span style={{ fontSize: "0.9rem", color: "#94a3b8", fontWeight: 400 }}> ({quantidade}x)</span>}
            </h2>

            {!nf || !cliente ? (
              <div className="preview-empty">
                <span style={{ fontSize: 48, opacity: 0.3 }}>🏷️</span>
                <p>Preencha os campos ao lado</p>
              </div>
            ) : (
              <div className="preview-sheet">
                <div className="preview-header">A4 Retrato</div>
                {Array.from({ length: quantidade }).map((_, i) => (
                  <div
                    key={i}
                    className="preview-label"
                    style={{
                      borderBottom: i < quantidade - 1 ? "2px dashed #d4d4d4" : "none",
                      background: i % 2 === 0 ? "#fff" : "#fafafa",
                    }}
                  >
                    <div className="preview-nf">{nf}</div>
                    <div className="preview-cliente">{cliente}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <style jsx>{`
        .etiqueta-layout {
          display: flex;
          gap: 32px;
          align-items: flex-start;
          min-height: calc(100vh - 120px);
          padding: 24px 0;
        }
        .form-panel {
          flex: 0 0 380px;
          background: #fff;
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
          position: sticky;
          top: 24px;
        }
        .preview-panel {
          flex: 1;
          min-width: 0;
        }
        .preview-empty {
          background: #fff;
          border-radius: 20px;
          padding: 60px 32px;
          text-align: center;
          color: #94a3b8;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
        }
        .preview-empty p {
          margin-top: 12px;
          font-size: 1.05rem;
        }
        .preview-sheet {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }
        .preview-header {
          background: #f1f5f9;
          padding: 10px 16px;
          font-size: 0.85rem;
          color: #64748b;
          text-align: center;
          border-bottom: 1px solid #e2e8f0;
          font-weight: 600;
        }
        .preview-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 20px 24px;
          min-height: 140px;
        }
        .preview-nf {
          font-size: 2.6rem;
          font-weight: 900;
          letter-spacing: 3px;
          color: #000;
          line-height: 1.1;
          word-break: break-all;
          max-width: 100%;
          text-transform: uppercase;
          font-family: "Courier New", monospace;
        }
        .preview-cliente {
          font-size: 1.5rem;
          font-weight: 800;
          color: #000;
          margin-top: 6px;
          line-height: 1.2;
          word-break: break-word;
          max-width: 100%;
          font-family: "Courier New", monospace;
        }
        .qtd-selector {
          display: flex;
          gap: 8px;
        }
        .qtd-btn {
          flex: 1;
          padding: 14px;
          border: 2px solid #e2e8f0;
          border-radius: 14px;
          background: #fff;
          font-size: 1.05rem;
          font-weight: 600;
          font-family: Barlow, sans-serif;
          color: #64748b;
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: center;
        }
        .qtd-btn:hover {
          border-color: #15814a;
          color: #15814a;
        }
        .qtd-btn.active {
          border-color: #15814a;
          background: #15814a;
          color: #fff;
        }
        @media (max-width: 800px) {
          .etiqueta-layout {
            flex-direction: column;
          }
          .form-panel {
            flex: none;
            width: 100%;
            position: static;
          }
        }
      `}</style>
    </div>
  );
}
