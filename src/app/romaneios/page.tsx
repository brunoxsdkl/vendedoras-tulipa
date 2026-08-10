"use client";

import { useRef, useState } from "react";

const grupos = [
  {
    titulo: "ROMANEIOS DE CONTROLE",
    descricao: "Modelos para controle de entrega da fábrica e dos pedidos da loja.",
    icone: "📊",
    arquivos: [
      { nome: "Fábrica", arquivo: "/romaneios/FABRICA.pdf", tipo: "PDF" },
      { nome: "Pedidos Loja", arquivo: "/romaneios/PEDIDOS LOJA.pdf", tipo: "PDF" },
    ],
  },
  {
    titulo: "ROMANEIOS DE PEDIDO",
    descricao: "Planilhas de romaneio para pedidos de matérias-primas e produtos acabados.",
    icone: "📋",
    arquivos: [
      { nome: "Matérias Primas", arquivo: "/romaneios/ROMANEIO MATERIAS PRIMAS.xlsx", tipo: "XLSX" },
      { nome: "Produtos Acabados (2, 4 e 5L)", arquivo: "/romaneios/ROMANEIO PRODUTOS ACABADOS 2 4 E 5L.xlsx", tipo: "XLSX" },
    ],
  },
];

function PreviewCard({ a }: { a: { nome: string; arquivo: string; tipo: string } }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [aberto, setAberto] = useState(false);

  const imprimir = () => {
    const f = iframeRef.current;
    if (f && f.contentWindow) {
      f.contentWindow.focus();
      f.contentWindow.print();
    } else {
      window.open(a.arquivo, "_blank");
    }
  };

  return (
    <div className="romaneio-item">
      <div className="romaneio-info">
        <span className={`romaneio-tipo ${a.tipo.toLowerCase()}`}>{a.tipo}</span>
        <span className="romaneio-nome">{a.nome}</span>
      </div>
      <div className="romaneio-actions">
        <a href={a.arquivo} download className="btn btn-secondary romaneio-btn">
          ⬇️ Baixar
        </a>
        {a.tipo === "PDF" && (
          <button className="btn btn-secondary romaneio-btn" onClick={imprimir}>
            🖨️ Imprimir
          </button>
        )}
        {a.tipo === "PDF" && (
          <button
            className="btn btn-secondary romaneio-btn"
            onClick={() => setAberto((v) => !v)}
          >
            {aberto ? "🙈 Ocultar" : "👁️ Pré-visualizar"}
          </button>
        )}
      </div>
      {aberto && a.tipo === "PDF" && (
        <div className="romaneio-preview">
          <iframe
            ref={iframeRef}
            src={a.arquivo}
            title={`Pré-visualização de ${a.nome}`}
            className="romaneio-iframe"
          />
        </div>
      )}
    </div>
  );
}

export default function Romaneios() {
  return (
    <>
      <Header />
      <main className="home-shell">
        <div className="container">
          <div className="page-head">
            <a href="/" className="back-btn">← Voltar</a>
            <div>
              <h1 className="page-title">Romaneios</h1>
              <p className="page-subtitle">
                Pré-visualize, imprima ou baixe os modelos de romaneio.
              </p>
            </div>
          </div>

          {grupos.map((g) => (
            <section key={g.titulo} className="info-section">
              <h2 className="info-section-title">{g.icone} {g.titulo}</h2>
              <p className="info-obs">{g.descricao}</p>
              <div className="romaneio-list">
                {g.arquivos.map((a) => (
                  <PreviewCard key={a.arquivo} a={a} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}

function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <img src="/logo.jpg" alt="Tulipa" className="header-logo" />
        <div className="header-text">
          <span>Sistema interno</span>
          <h1>VENDEDORAS - TULIPA</h1>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} VENDEDORAS - TULIPA · Feito para facilitar seu dia a dia 🌷</p>
    </footer>
  );
}
