"use client";

import { useState } from "react";

type Style = React.CSSProperties;

const statusCores: Record<number, string> = {
  0: "#15814a",
  97: "#f1c40f",
  83: "#f1c40f",
  68: "#3498db",
  101: "#3498db",
  78: "#e67e22",
  102: "#e67e22",
  34: "#e74c3c",
  35: "#e74c3c",
};

function statusDescricao(status: number): string {
  const mapa: Record<number, string> = {
    0: "Arquivo recebido",
    97: "Início de coleta",
    83: "Coleta realizada",
    68: "Coleta recebida no CD",
    101: "Recebida e processada no CD",
    78: "Embarcado",
    102: "Transferência",
    34: "Entrega efetuada",
    35: "Entrega realizada",
  };
  return mapa[status] || "Status " + status;
}

function formatData(dataStr: string): string {
  const d = new Date(dataStr);
  return d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export default function TransportadorasPage() {
  const [numeroNF, setNumeroNF] = useState("");
  const [rastreio, setRastreio] = useState<any>(null);
  const [rastreioLoading, setRastreioLoading] = useState(false);
  const [rastreioErro, setRastreioErro] = useState<string | null>(null);

  const rastrearNF = async () => {
    const nf = numeroNF.replace(/\D/g, "");
    if (!nf) return;
    setRastreioLoading(true);
    setRastreioErro(null);
    setRastreio(null);
    try {
      const resp = await fetch("/api/totalexpress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notasFiscais: [nf] }),
      });
      const json = await resp.json();
      if (!resp.ok) {
        setRastreioErro(json?.error || "Erro " + resp.status);
        return;
      }
      setRastreio(json);
    } catch (err: any) {
      setRastreioErro(err?.message || "Erro ao consultar rastreio");
    } finally {
      setRastreioLoading(false);
    }
  };

  const headerStyle: Style = { background: "#0d5e35", padding: "24px 20px", textAlign: "center" };
  const imgStyle: Style = { height: 40, marginBottom: 10, display: "block", margin: "0 auto 10px auto" };
  const h1Style: Style = { color: "#fff", fontSize: "1.5rem", margin: 0, fontWeight: 800, letterSpacing: "1px" };
  const pSubStyle: Style = { color: "#cfeade", fontSize: "0.9rem", margin: "4px 0 0" };
  const mainStyle: Style = { maxWidth: 900, margin: "0 auto", padding: "30px 20px" };
  const cardStyle: Style = { background: "#fff", borderRadius: 20, padding: 26, boxShadow: "0 4px 12px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0", marginBottom: 24 };
  const labelStyle: Style = { fontSize: "0.8rem", color: "#0d5e35", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 700, marginBottom: 8 };
  const inputStyle: Style = { flex: 1, minWidth: 220, padding: "14px 18px", border: "2px solid #e2e8f0", borderRadius: 14, fontSize: "1rem", fontFamily: "inherit", background: "#fff", outline: "none" };
  const btnStyle: Style = { minWidth: 150, padding: "14px 24px", color: "#fff", border: "none", borderRadius: 14, fontSize: "1rem", fontWeight: 700, fontFamily: "inherit", cursor: "pointer" };
  const btnClearStyle: Style = { padding: "14px 24px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: 14, fontSize: "1rem", fontWeight: 600, fontFamily: "inherit", cursor: "pointer" };
  const erroStyle: Style = { marginTop: 12, color: "#dc2626", fontSize: "0.85rem", fontWeight: 700 };
  const resultadoCardStyle: Style = { background: "#fff", borderRadius: 20, padding: 26, boxShadow: "0 4px 12px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" };
  const headerInfoStyle: Style = { display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 22 };
  const colStyle: Style = { flex: 1, minWidth: 200 };
  const previsaoCardStyle: Style = { background: "#e8f5ee", borderRadius: 16, padding: "16px 22px", minWidth: 180, textAlign: "center" };
  const labelCardStyle: Style = { fontSize: "0.75rem", color: "#0d5e35", textTransform: "uppercase", fontWeight: 800, marginBottom: 6 };
  const valorCardStyle: Style = { fontSize: "1.4rem", fontWeight: 800, color: "#15814a", margin: 0 };
  const awbStyle: Style = { fontSize: "1.75rem", fontWeight: 800, color: "#0d5e35", margin: 0, letterSpacing: "1px", wordBreak: "break-all" };
  const gridStyle: Style = { display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 26 };
  const gridColStyle: Style = { flex: 1, minWidth: 160, background: "#f8fafc", borderRadius: 14, padding: 16, border: "1px solid #e2e8f0" };
  const gridLabelStyle: Style = { fontSize: "0.7rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8, fontWeight: 700 };
  const gridValorStyle: Style = { fontSize: "1.1rem", fontWeight: 700, color: "#1e293b", margin: 0 };
  const historicoTitleStyle: Style = { fontSize: "0.8rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 14, fontWeight: 700 };
  const historicoListStyle: Style = { display: "flex", flexDirection: "column", gap: 12 };
  const itemRowStyle: Style = { display: "flex", gap: 16, alignItems: "flex-start", paddingBottom: 8, borderBottom: "1px solid #f1f5f9" };
  const itemDotStyle: Style = { flex: "0 0 12px", height: 12, borderRadius: "50%", marginTop: 4 };
  const itemInfoStyle: Style = { flex: 1 };
  const itemTopStyle: Style = { display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#64748b", marginBottom: 2 };
  const itemDataStyle: Style = { margin: 0, fontSize: "0.9rem", color: "#1e293b", fontWeight: 600 };
  const recebedorStyle: Style = { marginTop: 22, background: "#f0f7ff", borderRadius: 16, padding: 18, border: "1px solid #dbeafe" };
  const recebedorTitleStyle: Style = { fontSize: "0.8rem", color: "#1e40af", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10, fontWeight: 700 };
  const recebedorGridStyle: Style = { display: "flex", gap: 20, flexWrap: "wrap" };
  const recebedorItemStyle: Style = { fontSize: "0.85rem", color: "#1e293b" };
  const recebedorNomeStyle: Style = { fontSize: "0.7rem", color: "#64748b", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 };
  const recebedorDocStyle: Style = { fontWeight: 600, marginBottom: 4 };
  const footerStyle: Style = { textAlign: "center", padding: "24px", fontSize: "0.75rem", color: "#94a3b8", borderTop: "1px solid #e2e8f0", background: "#fff" };

  if (rastreio && rastreio.data && rastreio.data[0]) {
    const data = rastreio.data[0];
    const tracking = Array.isArray(data.tracking) ? data.tracking : [];
    const previsao = data.previsaoEntregaAtualizada || data.previsaoEntrega;

    return (
      <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "Barlow, sans-serif" }}>
        <header style={headerStyle}>
          <img src="/total-express.png" alt="Total Express" style={imgStyle} />
          <h1 style={h1Style}>TOTAL-EXPRESS</h1>
          <p style={pSubStyle}>Rastreamento de Encomendas</p>
        </header>

        <main style={mainStyle}>
          <div style={cardStyle}>
            <p style={labelStyle}>🔍 Buscar por Nota Fiscal</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <input type="text" placeholder="Digite o número da NF" value={numeroNF}
                onChange={(e) => setNumeroNF(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && rastrearNF()}
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#0d5e35"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; }} />
              <button onClick={rastrearNF} disabled={rastreioLoading}
                style={{ ...btnStyle, background: rastreioLoading ? "#94a3b8" : "#0d5e35" }}>
                {rastreioLoading ? "Consultando..." : "Rastrear NF"}
              </button>
              {rastreio && (
                <button onClick={() => { setRastreio(null); setRastreioErro(null); setNumeroNF(""); }}
                  style={btnClearStyle}>
                  Limpar
                </button>
              )}
            </div>
            {rastreioErro && (
              <p style={erroStyle}>{rastreioErro}</p>
            )}
          </div>

          <div style={resultadoCardStyle}>
            <div style={headerInfoStyle}>
              <div style={colStyle}>
                <p style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700, marginBottom: 4 }}>Código de rastreio</p>
                <p style={awbStyle}>{data.awb}</p>
              </div>
              <div style={previsaoCardStyle}>
                <p style={labelCardStyle}>Previsão de entrega</p>
                <p style={valorCardStyle}>{previsao}</p>
              </div>
            </div>

            <div style={gridStyle}>
              <div style={gridColStyle}>
                <p style={gridLabelStyle}>Pedido</p>
                <p style={gridValorStyle}>{data.pedido}</p>
              </div>
              <div style={gridColStyle}>
                <p style={gridLabelStyle}>Nota fiscal</p>
                <p style={gridValorStyle}>{data.notaFiscal} / Série {data.notaFiscalSerie}</p>
              </div>
              <div style={gridColStyle}>
                <p style={gridLabelStyle}>Rota</p>
                <p style={{ ...gridValorStyle, wordBreak: "break-all" }}>{data.rota}</p>
              </div>
            </div>

            <div>
              <p style={historicoTitleStyle}>📋 Histórico de rastreamento</p>
              <div style={historicoListStyle}>
                {tracking.map((item: any, idx: number) => {
                  const cor = statusCores[item.status] ?? "#94a3b8";
                  return (
                    <div key={idx} style={{ ...itemRowStyle, borderBottom: idx < tracking.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                      <div style={{ ...itemDotStyle, background: cor, boxShadow: "0 0 0 4px " + cor + "33" }} />
                      <div style={itemInfoStyle}>
                        <div style={itemTopStyle}>
                          <span style={{ fontWeight: 700, color: cor }}>{statusDescricao(item.status)}</span>
                          <span>{item.cidade} - {item.uf}</span>
                        </div>
                        <p style={itemDataStyle}>{formatData(item.data)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {data.dadosRecebedor && data.dadosRecebedor.length > 0 && (
              <div style={recebedorStyle}>
                <p style={recebedorTitleStyle}>📦 Dados do recebedor</p>
                <div style={recebedorGridStyle}>
                  {data.dadosRecebedor.map((d: any, i: number) => (
                    <div key={i} style={recebedorItemStyle}>
                      <div style={recebedorNomeStyle}>{d.nome || "Recebedor"}</div>
                      <div style={recebedorDocStyle}>{d.documento || ""}</div>
                      <div>{d.cidade} - {d.uf}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>

        <footer style={footerStyle}>
          <p>© {new Date().getFullYear()} VENDEDORAS - TULIPA · Total Express Rastreamento 🌷</p>
        </footer>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "Barlow, sans-serif" }}>
      <header style={headerStyle}>
        <img src="/total-express.png" alt="Total Express" style={imgStyle} />
        <h1 style={h1Style}>TOTAL-EXPRESS</h1>
        <p style={pSubStyle}>Rastreamento de Encomendas</p>
      </header>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "60px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <div style={cardStyle}>
          <p style={labelStyle}>🔍 Buscar por Nota Fiscal</p>
          <p style={{ color: "#64748b", marginBottom: 18 }}>Digite o número da nota fiscal para consultar o status da entrega da Total Express.</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input type="text" placeholder="Digite o número da NF" value={numeroNF}
              onChange={(e) => setNumeroNF(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && rastrearNF()}
              style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#0d5e35"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; }} />
            <button onClick={rastrearNF} disabled={rastreioLoading}
              style={{ ...btnStyle, background: rastreioLoading ? "#94a3b8" : "#0d5e35" }}>
              {rastreioLoading ? "Consultando..." : "Rastrear NF"}
            </button>
          </div>
          {rastreioErro && (
            <p style={erroStyle}>{rastreioErro}</p>
          )}
        </div>
        <div style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: 12 }}>
          Exemplo de NF: 114
        </div>
      </main>

      <footer style={footerStyle}>
        <p>© {new Date().getFullYear()} VENDEDORAS - TULIPA · Total Express Rastreamento 🌷</p>
      </footer>
    </div>
  );
}
