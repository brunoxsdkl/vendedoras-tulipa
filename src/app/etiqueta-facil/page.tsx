"use client";

import { useCallback, useState } from "react";

const PAINEL_ARQUIVOS = "https://totalconecta.totalexpress.com.br/painel-encomendas/painel-arquivos";
const PAINEL_COLETAS = "https://totalconecta.totalexpress.com.br/painel-encomendas/painel-coletas";
const USUARIO = "brunofil65699";
const SENHA = "Total2026@@";

interface XmlItem {
  name: string;
  cliente: string;
}

function extrairCliente(texto: string): string {
  const doc = new DOMParser().parseFromString(texto, "text/xml");
  if (doc.querySelector("parsererror")) {
    const match = texto.match(/<(?:nfeProc:NFe|NFe|nfe:NFe|mdfe:MDFe|cte:CTe)[^>]*>[\s\S]*?(?:dest|xemi|emit)>[\s\S]*?(?:xNome)>\s*([^<]+?)\s*<\/xNome>/i);
    if (match) return match[1].trim();
    return "";
  }
  const dest = Array.from(doc.getElementsByTagName("dest"));
  const n = dest.length > 0 ? dest[0].getElementsByTagName("xNome") : undefined;
  if (n && n[0] && n[0].textContent) return n[0].textContent.trim();
  const nomes = Array.from(doc.getElementsByTagName("xNome")).map((e) => e.textContent?.trim() || "").filter(Boolean);
  return nomes[0] || "";
}

export default function EtiquetaFacilPage() {
  const [xmls, setXmls] = useState<XmlItem[]>([]);
  const [status, setStatus] = useState("");
  const [semSuporte, setSemSuporte] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [copiado, setCopiado] = useState("");

  const copiar = useCallback((texto: string, chave: string) => {
    navigator.clipboard?.writeText(texto);
    setCopiado(chave);
    setTimeout(() => setCopiado(""), 2000);
  }, []);

  const procurarXml = useCallback(async () => {
    const w = window as any;
    if (!w.showDirectoryPicker) {
      setSemSuporte(true);
      return;
    }
    setSemSuporte(false);
    setStatus("Abrindo a pasta Downloads...");
    try {
      let dir = null;
      try {
        dir = await w.showDirectoryPicker({ mode: "read" });
      } catch {
        dir = null;
      }
      if (!dir) {
        setStatus("Pasta não selecionada.");
        return;
      }
      setStatus("Procurando arquivos XML na pasta...");
      const arquivos: XmlItem[] = [];
      for await (const entry of dir.values()) {
        if (entry.kind !== "file") continue;
        if (!/\.xml$/i.test(entry.name)) continue;
        const file: File = await entry.getFile();
        const text = await file.text();
        arquivos.push({ name: file.name, cliente: extrairCliente(text) });
      }
      arquivos.sort((a, b) => a.name.localeCompare(b.name));
      setXmls(arquivos);
      setStatus(arquivos.length === 0 ? "Nenhum arquivo XML encontrado na pasta." : `${arquivos.length} XML encontrado(s).`);
    } catch (e: any) {
      const msg =
        e?.name === "NotAllowedError"
          ? "Permissão negada. Tente novamente e permita o acesso à pasta."
          : String(e?.message || e);
      setStatus("Não foi possível ler a pasta: " + msg);
    }
  }, []);

  return (
    <div>
      <Header />
      <main className="home-shell">
        <div className="container">
          <div className="page-head">
            <a href="/" className="back-btn">← Voltar</a>
            <div>
              <h1 className="page-title">TOTAL EXPRESS · ETIQUETA FÁCIL</h1>
              <p className="page-subtitle">
                Acesso rápido ao painel da Total Express, pré-login e localização da XML do cliente.
              </p>
            </div>
          </div>

          <section className="info-section">
            <div className="te-hero">
              <img src="/logo-total-express.png" alt="Total Express" className="te-logo" />
              <div className="te-hero-text">
                <h2 className="te-titulo">Total Express</h2>
                <p className="te-desc">Envie a XML do pedido e imprima as etiquetas de coleta em poucos cliques.</p>
              </div>
            </div>
          </section>

          <section className="info-section">
            <h2 className="info-section-title">🔗 Acesso rápido</h2>
            <div className="te-botoes">
              <a href={PAINEL_ARQUIVOS} target="_blank" rel="noopener noreferrer" className="te-btn te-btn-xml">
                <span className="te-btn-titulo">📦 Enviar XML</span>
                <span className="te-btn-sub">Painel de Arquivos</span>
              </a>
              <a href={PAINEL_COLETAS} target="_blank" rel="noopener noreferrer" className="te-btn te-btn-coleta">
                <span className="te-btn-titulo">🏷️ Imprimir Etiquetas</span>
                <span className="te-btn-sub">Painel de Coletas</span>
              </a>
            </div>
          </section>

          <section className="info-section">
            <h2 className="info-section-title">🔑 Pré-login</h2>
            <div className="te-login">
              <div className="te-login-linha">
                <span className="te-login-label">Usuário</span>
                <code className="te-login-valor">{USUARIO}</code>
                <button className="btn-icon" onClick={() => copiar(USUARIO, "user")} aria-label="Copiar usuário">
                  {copiado === "user" ? "✓" : "📋"}
                </button>
              </div>
              <div className="te-login-linha">
                <span className="te-login-label">Senha</span>
                <code className="te-login-valor">{showPass ? SENHA : "•".repeat(SENHA.length)}</code>
                <button className="btn-icon" onClick={() => setShowPass(!showPass)} aria-label="Mostrar senha">
                  {showPass ? "🙈" : "👁️"}
                </button>
                <button className="btn-icon" onClick={() => copiar(SENHA, "senha")} aria-label="Copiar senha">
                  {copiado === "senha" ? "✓" : "📋"}
                </button>
              </div>
              <p className="info-obs" style={{ marginTop: 12 }}>
                Quem já acessou o painel antes neste navegador entra direto pelos botões de acesso rápido.
                Se pedir login, use os botões <strong>📋</strong> para copiar usuário e senha.
              </p>
            </div>
          </section>

          <section className="info-section">
            <h2 className="info-section-title">🔎 Encontrar XML do cliente</h2>
            <p className="info-obs">
              Abra a pasta Downloads, selecione a pasta onde ficam as XMLs e veja o nome do cliente de cada arquivo.
            </p>
            <button className="btn btn-primary" onClick={procurarXml}>
              📂 Procurar XML na pasta Downloads
            </button>
            {semSuporte && (
              <p className="te-aviso">
                Seu navegador não suporta abrir a pasta Downloads. Use o Google Chrome ou o Edge no computador (não funciona no celular).
              </p>
            )}
            {status && <p className="te-status">{status}</p>}
            {xmls.length > 0 && (
              <div className="te-lista">
                <div className="te-lista-head">
                  <span>Cliente</span>
                  <span>Arquivo XML</span>
                  <span>Ações</span>
                </div>
                {xmls.map((x) => (
                  <div className="te-lista-linha" key={x.name}>
                    <strong className="te-cliente">{x.cliente || "—"}</strong>
                    <span className="te-arquivo">{x.name}</span>
                    <span className="te-acoes">
                      {x.cliente && (
                        <button className="btn-icon" onClick={() => copiar(x.cliente, x.name)} aria-label="Copiar cliente">
                          {copiado === x.name ? "✓" : "📋"}
                        </button>
                      )}
                      <a className="btn-icon" href={PAINEL_ARQUIVOS} target="_blank" rel="noopener noreferrer" aria-label="Enviar no painel">
                        🚀
                      </a>
                    </span>
                  </div>
                ))}
              </div>
            )}
            <p className="info-obs" style={{ marginTop: 12 }}>
              No painel de arquivos, clique em <strong>novo arquivo</strong>, escolha a configuração XML e envie o arquivo do cliente.
            </p>
          </section>
        </div>
      </main>
      <Footer />

      <style>{`
        .te-hero {
          display: flex;
          align-items: center;
          gap: 20px;
          background: linear-gradient(135deg, #003087 0%, #0050b3 100%);
          color: #fff;
          border-radius: var(--radius-xl);
          padding: 28px;
          box-shadow: var(--shadow-lg);
        }
        .te-logo {
          width: 96px;
          height: 96px;
          object-fit: contain;
          background: #fff;
          border-radius: var(--radius-md);
          padding: 10px;
          flex-shrink: 0;
        }
        .te-hero-text h2 {
          margin: 0;
          font-size: 1.6rem;
          font-weight: 900;
          letter-spacing: -0.02em;
        }
        .te-hero-text p {
          margin: 6px 0 0;
          opacity: 0.85;
          line-height: 1.5;
        }
        .te-botoes {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 14px;
        }
        .te-btn {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 22px;
          border-radius: var(--radius-lg);
          color: #fff;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: var(--shadow-md);
        }
        .te-btn:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }
        .te-btn-xml {
          background: linear-gradient(135deg, #ff6a00, #ff8c33);
        }
        .te-btn-coleta {
          background: linear-gradient(135deg, #00a2ff, #33bbff);
        }
        .te-btn-titulo {
          font-size: 1.15rem;
          font-weight: 800;
        }
        .te-btn-sub {
          font-size: 0.88rem;
          opacity: 0.9;
        }
        .te-login {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 20px;
        }
        .te-login-linha {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid var(--border-light);
          flex-wrap: wrap;
        }
        .te-login-linha:last-of-type {
          border-bottom: none;
        }
        .te-login-label {
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--muted);
          min-width: 64px;
        }
        .te-login-valor {
          font-family: monospace;
          font-size: 1.05rem;
          background: var(--green-50);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 4px 10px;
          color: var(--text);
          word-break: break-all;
        }
        .te-aviso {
          margin-top: 14px;
          padding: 12px 16px;
          border-radius: var(--radius-sm);
          background: #fff7e6;
          border: 1px solid #ffd591;
          color: #ad4e00;
          font-weight: 600;
        }
        .te-status {
          margin-top: 14px;
          font-weight: 700;
          color: var(--green-800);
        }
        .te-lista {
          margin-top: 16px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        .te-lista-head,
        .te-lista-linha {
          display: grid;
          grid-template-columns: 1fr 1.4fr auto;
          gap: 12px;
          align-items: center;
          padding: 12px 16px;
        }
        .te-lista-head {
          background: var(--green-50);
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--muted);
          border-bottom: 1px solid var(--border);
        }
        .te-lista-linha {
          border-bottom: 1px solid var(--border-light);
          font-size: 0.92rem;
        }
        .te-lista-linha:last-child {
          border-bottom: none;
        }
        .te-cliente {
          color: var(--green-900);
          word-break: break-word;
        }
        .te-arquivo {
          color: var(--text-secondary);
          word-break: break-all;
        }
        .te-acoes {
          display: flex;
          gap: 6px;
          flex-shrink: 0;
        }
        @media (max-width: 640px) {
          .te-hero {
            flex-direction: column;
            text-align: center;
            padding: 20px;
          }
          .te-lista-head,
          .te-lista-linha {
            grid-template-columns: 1fr;
            gap: 4px;
          }
          .te-lista-head {
            display: none;
          }
          .te-acoes {
            justify-content: flex-start;
          }
        }
      `}</style>
    </div>
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
