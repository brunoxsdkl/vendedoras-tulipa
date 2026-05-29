"use client";

import { useState } from "react";

const TOTAL = 3;

export default function EtiquetaPage() {
  const [nf, setNf] = useState("");
  const [cliente, setCliente] = useState("");

  const preenchido = nf.trim() && cliente.trim();

  const gerarHTML = () => {
    let labels = "";
    for (let i = 0; i < TOTAL; i++) {
      labels += `
        <div class="etiqueta">
          <div class="etiqueta-nf">NF: ${nf}</div>
          <div class="etiqueta-cliente">${cliente}</div>
        </div>
      `;
    }
    return `
      <html>
      <head>
        <style>
          @page { size: A4 portrait; margin: 0; }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { width: 210mm; height: 297mm; font-family: Arial, Helvetica, sans-serif; display: flex; flex-direction: column; }
          .etiqueta { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; border-bottom: 2px dashed #ccc; padding: 10mm; text-align: center; }
          .etiqueta:last-child { border-bottom: none; }
          .etiqueta-nf { font-size: 28pt; font-weight: 900; color: #000; letter-spacing: 2px; margin-bottom: 8mm; }
          .etiqueta-cliente { font-size: 24pt; font-weight: 700; color: #000; }
        </style>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"><\/script>
      </head>
      <body>
        <div id="content">${labels}</div>
        <script>
          (function() {
            var opt = {
              margin: 0,
              filename: 'etiqueta-caixa-${nf.replace(/[^a-z0-9]/gi, "_").substring(0, 20)}.pdf',
              image: { type: 'jpeg', quality: 1 },
              html2canvas: { scale: 3, useCORS: true, letterRendering: true },
              jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            html2pdf().set(opt).from(document.getElementById('content')).save().then(function() { window.close(); });
          })();
        <\/script>
      </body>
      </html>
    `;
  };

  const handleDownload = () => {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(gerarHTML());
    win.document.close();
  };

  return (
    <div>
      <div className="header no-print">
        <div className="container header-inner">
          <a href="/" className="back-btn">← Voltar</a>
          <img src="/logo.jpg" alt="Tulipa" className="header-logo" />
          <div className="header-text">
            <h1>🏷️ Etiqueta para Caixa</h1>
            <p>Etiqueta A4 retrato — 3 por folha</p>
          </div>
        </div>
      </div>

      <main className="container">
        <div className="layout">
          <div className="sidebar no-print">
            <div className="card">
              <div className="form-group">
                <label>Número da NF</label>
                <input value={nf} onChange={(e) => setNf(e.target.value)} placeholder="Ex: 123456" autoFocus />
              </div>
              <div className="form-group">
                <label>Nome do Cliente</label>
                <input value={cliente} onChange={(e) => setCliente(e.target.value)} placeholder="Nome completo" />
              </div>
              {preenchido && (
                <>
                  <button className="btn btn-primary" style={{ width: "100%", marginTop: 8 }} onClick={handleDownload}>
                    📄 Baixar PDF
                  </button>
                  <button className="btn btn-secondary" style={{ width: "100%", marginTop: 8 }} onClick={() => window.print()}>
                    🖨️ Imprimir
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="preview-area">
            {!preenchido ? (
              <div className="empty-state">
                <span style={{ fontSize: 56, opacity: 0.2 }}>🏷️</span>
                <p>Preencha a NF e o cliente</p>
              </div>
            ) : (
              <div className="sheet-wrapper">
                <div className="sheet-label">A4 Retrato • 3 etiquetas</div>
                <div className="sheet">
                  {Array.from({ length: TOTAL }).map((_, i) => (
                    <div key={i} className="etiqueta-preview">
                      <div className="preview-nf">NF: {nf}</div>
                      <div className="preview-cliente">{cliente}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        .layout { display: flex; gap: 32px; align-items: flex-start; padding: 16px 0; }
        .sidebar { flex: 0 0 340px; position: sticky; top: 16px; }
        .card { background: #fff; border-radius: 20px; padding: 28px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
        .preview-area { flex: 1; min-width: 0; }
        .empty-state { background: #fff; border-radius: 20px; padding: 80px 32px; text-align: center; color: #94a3b8; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
        .empty-state p { margin-top: 12px; font-size: 1rem; }
        .sheet-wrapper { background: #fff; border-radius: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); overflow: hidden; border: 1px solid #e2e8f0; }
        .sheet-label { background: #f1f5f9; padding: 10px 16px; font-size: 0.85rem; color: #64748b; text-align: center; border-bottom: 1px solid #e2e8f0; font-weight: 600; }
        .sheet { display: flex; flex-direction: column; transform: scale(0.55); transform-origin: top left; width: 210mm; }
        .etiqueta-preview { height: 99mm; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; border-bottom: 2px dashed #cbd5e1; padding: 8mm; }
        .etiqueta-preview:last-child { border-bottom: none; }
        .preview-nf { font-size: 28pt; font-weight: 900; color: #000; letter-spacing: 2px; margin-bottom: 6mm; font-family: Arial, Helvetica, sans-serif; }
        .preview-cliente { font-size: 22pt; font-weight: 700; color: #000; font-family: Arial, Helvetica, sans-serif; word-break: break-word; max-width: 100%; }

        @media print {
          .no-print { display: none !important; }
          body { background: #fff !important; }
          .layout { display: block !important; padding: 0 !important; }
          .preview-area { max-width: 100% !important; }
          .sheet-wrapper { box-shadow: none !important; border: none !important; border-radius: 0 !important; }
          .sheet-label { display: none !important; }
          .sheet { transform: none !important; }
          .etiqueta-preview { border-bottom: 2px dashed #ccc; }
          .etiqueta-preview:last-child { border-bottom: none; }
          .preview-nf { font-size: 28pt !important; }
          .preview-cliente { font-size: 22pt !important; }
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
