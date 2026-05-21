"use client";

import { useState } from "react";

export default function EtiquetaPage() {
  const [nf, setNf] = useState("");
  const [cliente, setCliente] = useState("");

  return (
    <div>
      <div className="header no-print">
        <div className="container header-inner">
          <a href="/" className="back-btn">
            ← Voltar
          </a>
          <img src="/logo.jpg" alt="Tulipa" className="header-logo" />
          <div className="header-text">
            <h1>🏷️ Etiqueta para Caixa</h1>
            <p>Imprimir etiqueta A4 retrato com NF e nome do cliente</p>
          </div>
        </div>
      </div>
      <main
        className="container no-print"
        style={{ minHeight: "calc(100vh - 60px)" }}
      >
        <div
          style={{
            maxWidth: 500,
            margin: "0 auto",
            background: "#fff",
            borderRadius: 20,
            padding: 32,
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}
        >
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
          <button
            className="btn btn-primary"
            style={{ width: "100%" }}
            onClick={() => window.print()}
          >
            🖨️ Imprimir Etiqueta
          </button>
        </div>
      </main>

      {nf && cliente && (
        <div
          className="print-area"
          style={{
            width: "210mm",
            minHeight: "297mm",
            background: "#fff",
            margin: "0 auto",
            fontFamily: "Courier New, monospace",
            padding: 0,
            display: "none",
          }}
          id="printArea"
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              width: "210mm",
              height: "99mm",
              border: "1px dashed #d4d4d4",
              boxSizing: "border-box",
              padding: "10mm",
              background: "#fcfcfc",
            }}
          >
            <div
              style={{
                fontSize: 64,
                fontWeight: 900,
                letterSpacing: 4,
                color: "#000",
                lineHeight: 1.1,
                wordBreak: "break-all",
                maxWidth: "100%",
              }}
            >
              {nf}
            </div>
            <div
              style={{
                fontSize: 38,
                fontWeight: 800,
                color: "#000",
                marginTop: 6,
                lineHeight: 1.1,
                wordBreak: "break-word",
                maxWidth: "100%",
              }}
            >
              {cliente}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: #fff !important;
          }
          .print-area {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
