"use client";

import { useState, useCallback } from "react";

const ramais = [
  { ramal: "2000", descricao: "Financeiro" },
  { ramal: "2001", descricao: "Balcão Loja Matriz" },
  { ramal: "2002", descricao: "Bruno (Sala E-commerce)" },
  { ramal: "2003", descricao: "Franciele" },
  { ramal: "2005", descricao: "Sr. Oscar" },
  { ramal: "2010", descricao: "Loja Centro" },
  { ramal: "2020", descricao: "Fábrica" },
];

const faturamento = [
  "Faturamento dos últimos 12 meses assinado pelo contador",
  "Referências bancárias",
  "Referências comerciais",
  "Cópia do contrato social e última alteração",
];

const empresa = {
  nome: "CUNHA AZEVEDO FO. LTDA",
  cnpj: "07.373.413/0001-60",
  endereco: "Rua Shirlei Boeira Souto, 305",
  bairro: "Mauá",
  cidade: "Colombo - PR",
  cep: "83413-740",
};

function CopiarBtn({ texto }: { texto: string }) {
  const [copiado, setCopiado] = useState(false);

  const copiar = useCallback(() => {
    navigator.clipboard.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }, [texto]);

  return (
    <button className="btn-icon" onClick={copiar} aria-label="Copiar">
      {copiado ? "✓" : "📋"}
    </button>
  );
}

function WppBtn({ texto }: { texto: string }) {
  const encoded = encodeURIComponent(texto);
  return (
    <a
      className="btn-icon wpp"
      href={`https://wa.me/?text=${encoded}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Enviar no WhatsApp"
    >
      💬
    </a>
  );
}

export default function InformacoesUteis() {
  return (
    <>
      <Header />
      <main className="home-shell">
        <div className="container">
          <div className="page-head">
            <a href="/" className="back-btn">← Voltar</a>
            <div>
              <h1 className="page-title">Informações Úteis</h1>
              <p className="page-subtitle">
                Ramais, documentos e dados da empresa sempre à mão.
              </p>
            </div>
          </div>

          <section className="info-section">
            <h2 className="info-section-title">📞 Ramais</h2>
            <p className="info-obs">
              Para qualquer ligação digitar <strong>041 + DDD + Número</strong> (mesmo sendo local).
            </p>
            <div className="ramal-list">
              {ramais.map((r) => {
                const texto = `Ramal ${r.descricao}: ${r.ramal}`;
                return (
                  <div key={r.ramal} className="ramal-item">
                    <div className="ramal-info">
                      <span className="ramal-num">{r.ramal}</span>
                      <span className="ramal-desc">{r.descricao}</span>
                    </div>
                    <div className="ramal-actions">
                      <WppBtn texto={texto} />
                      <CopiarBtn texto={texto} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="info-section">
            <h2 className="info-section-title">📄 Para Faturamento</h2>
            <p className="info-obs">
              Exigências para compor cadastro (compra no boleto):
            </p>
            <div className="doc-bloco">
              <div className="doc-bloco-texto">
                {faturamento.map((doc, i) => (
                  <span key={i}>{i + 1}. {doc}</span>
                ))}
              </div>
              <div className="doc-bloco-actions">
                <WppBtn texto={`*EXIGÊNCIAS PARA CADASTRO (COMPRA NO BOLETO)*\n\n1. ${faturamento[0]}\n2. ${faturamento[1]}\n3. ${faturamento[2]}\n4. ${faturamento[3]}`} />
                <CopiarBtn texto={`EXIGÊNCIAS PARA CADASTRO (COMPRA NO BOLETO)\n\n1. ${faturamento[0]}\n2. ${faturamento[1]}\n3. ${faturamento[2]}\n4. ${faturamento[3]}`} />
              </div>
            </div>
          </section>

          <section className="info-section">
            <h2 className="info-section-title">🏢 CNPJ da Empresa</h2>
            <div className="cnpj-card">
              <div className="cnpj-linha">
                <span className="cnpj-label">Razão Social</span>
                <div className="cnpj-val">
                  <span>{empresa.nome}</span>
                  <div className="ramal-actions">
                    <WppBtn texto={empresa.nome} />
                    <CopiarBtn texto={empresa.nome} />
                  </div>
                </div>
              </div>
              <div className="cnpj-linha">
                <span className="cnpj-label">CNPJ</span>
                <div className="cnpj-val">
                  <span>{empresa.cnpj}</span>
                  <div className="ramal-actions">
                    <WppBtn texto={empresa.cnpj} />
                    <CopiarBtn texto={empresa.cnpj} />
                  </div>
                </div>
              </div>
              <div className="cnpj-linha">
                <span className="cnpj-label">Endereço</span>
                <div className="cnpj-val">
                  <span>{empresa.endereco}, {empresa.bairro} - {empresa.cidade} — CEP: {empresa.cep}</span>
                  <div className="ramal-actions">
                    <WppBtn texto={`${empresa.endereco}, ${empresa.bairro} - ${empresa.cidade} — CEP: ${empresa.cep}`} />
                    <CopiarBtn texto={`${empresa.endereco}, ${empresa.bairro} - ${empresa.cidade} — CEP: ${empresa.cep}`} />
                  </div>
                </div>
              </div>
            </div>
          </section>
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
