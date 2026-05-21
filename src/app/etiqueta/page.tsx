"use client";

import { useState, useRef } from "react";

export default function EtiquetaPage() {
  const [nf, setNf] = useState("");
  const [cliente, setCliente] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const printRef = useRef<HTMLDivElement>(null);

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
          padding: 8mm;
          ${i > 0 ? 'margin-top: 0;' : ''}
        ">
          <div style="
            font-size: 52px;
            font-weight: 900;
            letter-spacing: 3px;
            color: #000;
            line-height: 1.1;
            word-break: break-all;
            max-width: 100%;
            text-transform: uppercase;
            font-family: 'Courier New', monospace;
          ">${nf || "NF"}</div>
          <div style="
            font-size: 36px;
            font-weight: 800;
            color: #000;
            margin-top: 8px;
            line-height: 1.2;
            word-break: break-word;
            max-width: 100%;
            font-family: 'Courier New', monospace;
          ">${cliente || "Cliente"}</div>
        </div>
      `;
    }

    printWindow.document.write(`
      <html>
      <head>
        <style>
          @page {
            size: A4 portrait;
            margin: 5mm;
          }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            width: 210mm; 
            margin: 0 auto; 
            background: #fff;
            font-family: 'Courier New', monospace;
          }
          @media print {
            body { margin: 0; }
          }
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
            <p>Gerar etiqueta A4 retrato com NF e nome do cliente</p>
          </div>
        </div>
      </div>

      <main className="container no-print" style={{ minHeight: "calc(100vh - 60px)" }}>
        <div className="form-card">
          <div className="form-group">
            <label>Número da NF</label>
            <input
              value={nf}
              onChange={(e) => setNf(e.target.value)}
              placeholder="Ex: 123456"
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
            <label>Quantidade de etiquetas por folha</label>
            <select
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
            >
              <option value={1}>1 etiqueta</option>
              <option value={2}>2 etiquetas</option>
              <option value={3}>3 etiquetas</option>
              <option value={4}>4 etiquetas</option>
            </select>
          </div>
          <button
            className="btn btn-primary"
            style={{ width: "100%", fontSize: "1rem", padding: "14px 24px" }}
            onClick={handlePrint}
            disabled={!nf || !cliente}
          >
            🖨️ Gerar e Imprimir Etiqueta{nf && cliente ? "" : " (preencha os campos)"}
          </button>
        </div>

        {nf && cliente && (
          <div ref={printRef} style={{ marginTop: 32 }}>
            <h3 className="page-title" style={{ fontSize: "1.2rem", marginBottom: 16 }}>
              Pré-visualização ({quantidade}x)
            </h3>
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 16,
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                border: "1px solid #e2e8f0",
                width: "210mm",
                margin: "0 auto",
                transform: "scale(0.7)",
                transformOrigin: "top left",
              }}
            >
              {Array.from({ length: quantidade }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: "100%",
                    height: "99mm",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    borderBottom: i < quantidade - 1 ? "2px dashed #e2e8f0" : "none",
                    pageBreakInside: "avoid",
                    boxSizing: "border-box",
                    padding: "8mm",
                    background: i % 2 === 0 ? "#fcfcfc" : "#fff",
                  }}
                >
                  <div
                    style={{
                      fontSize: "52px",
                      fontWeight: 900,
                      letterSpacing: "3px",
                      color: "#000",
                      lineHeight: 1.1,
                      wordBreak: "break-all",
                      maxWidth: "100%",
                      textTransform: "uppercase",
                      fontFamily: "'Courier New', monospace",
                    }}
                  >
                    {nf}
                  </div>
                  <div
                    style={{
                      fontSize: "36px",
                      fontWeight: 800,
                      color: "#000",
                      marginTop: 8,
                      lineHeight: 1.2,
                      wordBreak: "break-word",
                      maxWidth: "100%",
                      fontFamily: "'Courier New', monospace",
                    }}
                  >
                    {cliente}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
                O preview está reduzido. A impressão será em tamanho real A4.
              </p>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        .form-card {
          max-width: 500px;
          margin: 0 auto;
          background: #fff;
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
        }
        .form-card select {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 0.95rem;
          background: #fff;
          font-family: Barlow, sans-serif;
          color: #2d3748;
          appearance: none;
          transition: all 0.2s ease;
        }
        .form-card select:focus {
          outline: none;
          border-color: #15814a;
          box-shadow: 0 0 0 4px rgba(21, 129, 74, 0.1);
        }
      `}</style>
    </div>
  );
}
