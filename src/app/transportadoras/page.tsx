"use client";

import { useState, useMemo } from "react";

type Transportadora = {
  nome: string;
  telefone: string;
  contato?: string;
  estados: string[];
};

const transportadoras: Transportadora[] = [
  { nome: "Braspress",       telefone: "(41) 3018-6051", estados: ["SP","RJ","MG","ES","BA","SE","AL","PE","PB","RN","CE","PI","MA","PA","TO","GO","DF","MT","MS"] },
  { nome: "Jadlog",          telefone: "(41) 3026-5050", estados: ["SP","RJ","MG","ES","PR","SC","RS","BA","PE","CE","GO","DF"] },
  { nome: "Total Express",   telefone: "(41) 3342-1010", estados: ["SP","RJ","MG","ES","PR","SC","RS","BA","PE","AL","PB","RN","CE","GO","DF"] },
  { nome: "Rodonaves",       telefone: "(41) 3087-7000", estados: ["SP","RJ","MG","ES","PR","SC","RS","GO","DF","MT","MS"] },
  { nome: "Translovato",     telefone: "(41) 3276-4000", estados: ["SP","MG","PR","SC","RS"] },
  { nome: "Sao Francisco",   telefone: "(41) 99921-0392", estados: ["PR","SC","RS","SP","RJ","MG"] },
  { nome: "Gol Log",         telefone: "(41) 3212-5000", estados: ["SP","RJ","MG","BA","PE","CE","PA","AM","DF","GO","MT"] },
  { nome: "Correios (PAC)",  telefone: "0800-725-0100", estados: ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"] },
  { nome: "Transportadora A", telefone: "(41) 3012-3456", estados: ["SP","RJ","MG","ES"] },
  { nome: "Transportadora B", telefone: "(41) 3022-3344", estados: ["PR","SC","RS"] },
  { nome: "Transportadora C", telefone: "(41) 3033-4455", estados: ["BA","SE","AL","PE","PB","RN","CE","PI","MA"] },
  { nome: "Transportadora D", telefone: "(41) 3044-5566", estados: ["PA","TO","AM","AC","RO","RR","AP"] },
  { nome: "Transportadora E", telefone: "(41) 3055-6677", estados: ["GO","DF","MT","MS"] },
];

type EstadoInfo = {
  uf: string;
  nome: string;
  regiao: string;
};

const estados: EstadoInfo[] = [
  { uf: "AC", nome: "Acre", regiao: "Norte" },
  { uf: "AP", nome: "Amapá", regiao: "Norte" },
  { uf: "AM", nome: "Amazonas", regiao: "Norte" },
  { uf: "PA", nome: "Pará", regiao: "Norte" },
  { uf: "RO", nome: "Rondônia", regiao: "Norte" },
  { uf: "RR", nome: "Roraima", regiao: "Norte" },
  { uf: "TO", nome: "Tocantins", regiao: "Norte" },
  { uf: "AL", nome: "Alagoas", regiao: "Nordeste" },
  { uf: "BA", nome: "Bahia", regiao: "Nordeste" },
  { uf: "CE", nome: "Ceará", regiao: "Nordeste" },
  { uf: "MA", nome: "Maranhão", regiao: "Nordeste" },
  { uf: "PB", nome: "Paraíba", regiao: "Nordeste" },
  { uf: "PE", nome: "Pernambuco", regiao: "Nordeste" },
  { uf: "PI", nome: "Piauí", regiao: "Nordeste" },
  { uf: "RN", nome: "Rio Grande do Norte", regiao: "Nordeste" },
  { uf: "SE", nome: "Sergipe", regiao: "Nordeste" },
  { uf: "DF", nome: "Distrito Federal", regiao: "Centro-Oeste" },
  { uf: "GO", nome: "Goiás", regiao: "Centro-Oeste" },
  { uf: "MT", nome: "Mato Grosso", regiao: "Centro-Oeste" },
  { uf: "MS", nome: "Mato Grosso do Sul", regiao: "Centro-Oeste" },
  { uf: "ES", nome: "Espírito Santo", regiao: "Sudeste" },
  { uf: "MG", nome: "Minas Gerais", regiao: "Sudeste" },
  { uf: "RJ", nome: "Rio de Janeiro", regiao: "Sudeste" },
  { uf: "SP", nome: "São Paulo", regiao: "Sudeste" },
  { uf: "PR", nome: "Paraná", regiao: "Sul" },
  { uf: "RS", nome: "Rio Grande do Sul", regiao: "Sul" },
  { uf: "SC", nome: "Santa Catarina", regiao: "Sul" },
];

const regioes = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"];

const regiaoCores: Record<string, string> = {
  "Norte": "#15814a",
  "Nordeste": "#e67e22",
  "Centro-Oeste": "#f1c40f",
  "Sudeste": "#e74c3c",
  "Sul": "#3498db",
};

function getEstadoFromCEP(cep: string): string | null {
  const num = parseInt(cep.replace(/\D/g, "").slice(0, 2), 10);
  if (isNaN(num)) return null;
  if (num >= 1 && num <= 19) return "SP";
  if (num >= 20 && num <= 28) return "RJ";
  if (num >= 29 && num <= 29) return "ES";
  if (num >= 30 && num <= 39) return "MG";
  if (num >= 40 && num <= 49) return "BA";
  if (num >= 50 && num <= 56) return "PE";
  if (num === 57) return "AL";
  if (num === 58) return "PB";
  if (num === 59) return "RN";
  if (num >= 60 && num <= 63) return "CE";
  if (num >= 64 && num <= 65) return "PI";
  if (num >= 65 && num <= 67) return "MA";
  if (num >= 66 && num <= 68) return "PA";
  if (num === 69) return "AP";
  if (num >= 69 && num <= 69) return "AM";
  if (num >= 70 && num <= 73) return "DF";
  if (num >= 72 && num <= 76) return "GO";
  if (num === 77) return "TO";
  if (num >= 78 && num <= 79) return "MT";
  if (num >= 79 && num <= 79) return "MS";
  if (num >= 80 && num <= 87) return "PR";
  if (num >= 88 && num <= 89) return "SC";
  if (num >= 90 && num <= 99) return "RS";
  return null;
}

function formatCEP(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export default function TransportadorasPage() {
  const [selectedUF, setSelectedUF] = useState<string | null>(null);
  const [cepInput, setCepInput] = useState("");
  const [mostrarPorCEP, setMostrarPorCEP] = useState(false);

  const cepUF = useMemo(() => {
    if (cepInput.replace(/\D/g, "").length >= 2) {
      return getEstadoFromCEP(cepInput);
    }
    return null;
  }, [cepInput]);

  const buscarCEP = () => {
    const uf = getEstadoFromCEP(cepInput);
    if (uf) {
      setSelectedUF(uf);
      setMostrarPorCEP(true);
    }
  };

  const ufAtiva = mostrarPorCEP && cepUF ? cepUF : selectedUF;

  const transportadorasFiltradas = useMemo(() => {
    if (!ufAtiva) return [];
    return transportadoras.filter((t) => t.estados.includes(ufAtiva));
  }, [ufAtiva]);

  const estadoSelecionado = estados.find((e) => e.uf === ufAtiva);
  const regiaoSelecionada = estadoSelecionado?.regiao;

  return (
    <div>
      <div className="header no-print">
        <div className="container header-inner">
          <a href="/" className="back-btn">← Voltar</a>
          <img src="/logo.jpg" alt="Tulipa" className="header-logo" />
          <div className="header-text">
            <h1>🚚 Transportadoras</h1>
            <p>Transportadoras que entregam de Curitiba para todo o Brasil</p>
          </div>
        </div>
      </div>

      <main style={{ minHeight: "calc(100vh - 60px)" }}>
        <div className="container" style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 20px" }}>

          {/* CEP Input */}
          <div style={{
            background: "#fff",
            borderRadius: 20,
            padding: 24,
            marginBottom: 28,
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            border: "1px solid #e2e8f0",
          }}>
            <p style={{ fontWeight: 700, fontSize: "1rem", color: "#0d5e35", marginBottom: 4 }}>
              📍 Buscar por CEP
            </p>
            <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: 14 }}>
              Digite o CEP de destino para ver as transportadoras que atendem a região
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <input
                type="text"
                placeholder="00000-000"
                value={cepInput}
                onChange={(e) => setCepInput(formatCEP(e.target.value))}
                onKeyDown={(e) => e.key === "Enter" && buscarCEP()}
                style={{
                  flex: 1, minWidth: 180, padding: "14px 18px", border: "2px solid #e2e8f0",
                  borderRadius: 14, fontSize: "1rem", fontFamily: "Barlow, sans-serif",
                  background: "#fff",
                }}
              />
              <button className="btn btn-primary" onClick={buscarCEP}>
                Buscar
              </button>
              {mostrarPorCEP && (
                <button
                  className="btn btn-secondary"
                  onClick={() => { setMostrarPorCEP(false); setCepInput(""); }}
                >
                  Limpar
                </button>
              )}
            </div>
            {cepUF && (
              <p style={{ marginTop: 10, fontSize: "0.85rem", color: "#15814a", fontWeight: 600 }}>
                CEP pertence a: {estados.find(e => e.uf === cepUF)?.nome} ({cepUF})
              </p>
            )}
          </div>

          {/* Mapa do Brasil */}
          <div style={{
            background: "#fff",
            borderRadius: 20,
            padding: 24,
            marginBottom: 28,
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            border: "1px solid #e2e8f0",
          }}>
            <p style={{ fontWeight: 700, fontSize: "1rem", color: "#0d5e35", marginBottom: 16 }}>
              🗺️ Selecione o estado de destino
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
              {regioes.map((regiao) => (
                <span key={regiao} style={{
                  background: `${regiaoCores[regiao]}15`,
                  color: regiaoCores[regiao],
                  padding: "4px 12px",
                  borderRadius: 20,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  border: `1px solid ${regiaoCores[regiao]}30`,
                }}>
                  {regiao}
                </span>
              ))}
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(65px, 1fr))",
              gap: 8,
            }}>
              {estados.map((est) => {
                const isSelected = ufAtiva === est.uf;
                const cor = regiaoCores[est.regiao];
                return (
                  <button
                    key={est.uf}
                    onClick={() => { setSelectedUF(est.uf); setMostrarPorCEP(false); }}
                    style={{
                      padding: "10px 4px",
                      borderRadius: 12,
                      border: isSelected ? `2px solid ${cor}` : "2px solid #e2e8f0",
                      background: isSelected ? `${cor}15` : "#fff",
                      cursor: "pointer",
                      fontWeight: isSelected ? 700 : 500,
                      fontSize: "0.82rem",
                      color: isSelected ? cor : "#2d3748",
                      transition: "all 0.2s",
                      textAlign: "center",
                      fontFamily: "Barlow, sans-serif",
                    }}
                    title={est.nome}
                  >
                    {est.uf}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Resultados */}
          {ufAtiva && (
            <div style={{
              background: "#fff",
              borderRadius: 20,
              padding: 24,
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              border: "1px solid #e2e8f0",
            }}>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                marginBottom: 20, flexWrap: "wrap", gap: 8,
              }}>
                <h2 style={{ fontSize: "1.15rem", color: "#0d5e35", fontWeight: 700 }}>
                  📦 {estadoSelecionado?.nome} ({ufAtiva})
                </h2>
                <span style={{
                  fontSize: "0.82rem", background: `${regiaoCores[regiaoSelecionada || ""]}15`,
                  color: regiaoCores[regiaoSelecionada || ""], padding: "4px 12px",
                  borderRadius: 20, fontWeight: 600,
                }}>
                  {transportadorasFiltradas.length} transportadora{transportadorasFiltradas.length !== 1 ? "s" : ""}
                </span>
              </div>

              {transportadorasFiltradas.length === 0 ? (
                <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
                  Nenhuma transportadora cadastrada para este estado.
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {transportadorasFiltradas.map((t) => (
                    <div key={t.nome} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "14px 18px", borderRadius: 14,
                      background: "#f8fafc", border: "1px solid #e2e8f0",
                      flexWrap: "wrap", gap: 8,
                    }}>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: "0.95rem", color: "#2d3748" }}>
                          {t.nome}
                        </p>
                      </div>
                      <a
                        href={`tel:${t.telefone.replace(/\D/g, "")}`}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 6,
                          background: "#15814a", color: "#fff", padding: "8px 16px",
                          borderRadius: 10, fontWeight: 600, fontSize: "0.85rem",
                          textDecoration: "none", whiteSpace: "nowrap",
                        }}
                      >
                        📞 {t.telefone}
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {mostrarPorCEP && cepUF && (
                <button
                  className="btn btn-secondary"
                  style={{ marginTop: 16, width: "100%" }}
                  onClick={() => { setMostrarPorCEP(false); setSelectedUF(null); setCepInput(""); }}
                >
                  Nova consulta
                </button>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer
      style={{
        textAlign: "center", padding: "20px", fontSize: "0.8rem",
        color: "#94a3b8", borderTop: "1px solid #e2e8f0", background: "white",
      }}
    >
      <p>
        © {new Date().getFullYear()} VENDEDORAS - TULIPA · Feito para facilitar
        seu dia a dia 🌷
      </p>
    </footer>
  );
}
