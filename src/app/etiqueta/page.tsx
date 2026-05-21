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

      {!nf || !cliente ? (
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
          </div>
        </main>
      ) : (
        <div className="container etiqueta-box">
          <div style={{ textAlign: "center", marginBottom: 20 }} className="no-print">
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                className="btn btn-primary"
                onClick={() => window.print()}
              >
                🖨️ Imprimir
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setNf("");
                  setCliente("");
                }}
              >
                🔄 Nova Etiqueta
              </button>
            </div>
          </div>

          <div className="etiqueta-label">
            <div className="nf-number">{nf}</div>
            <div className="cliente-name">{cliente}</div>
          </div>
        </div>
      )}
    </div>
  );
}
