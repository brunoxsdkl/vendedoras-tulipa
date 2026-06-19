"use client";

import { useState, useEffect } from "react";

type Curso = {
  id: string;
  nome: string;
  horario: string;
  vagas: number;
};

export default function InscricaoPage() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [cursoId, setCursoId] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [cidade, setCidade] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    fetch("/api/cursos")
      .then((r) => r.json())
      .then((data) => { setCursos(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cursoId || !nome.trim() || !telefone.trim()) {
      setErro("Preencha curso, nome e telefone");
      return;
    }
    setEnviando(true);
    setErro("");
    try {
      const res = await fetch("/api/alunos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          curso_id: cursoId,
          nome: nome.trim(),
          telefone: telefone.trim(),
          email: email.trim() || null,
          cidade: cidade.trim() || null,
          status_pagamento: "Pendente",
        }),
      });
      if (!res.ok) throw new Error("Erro ao cadastrar");
      setSucesso(true);
    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : "Erro ao cadastrar");
    } finally {
      setEnviando(false);
    }
  };

  if (sucesso) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f9f6", padding: 20 }}>
        <div style={{ background: "#fff", borderRadius: 24, padding: 40, maxWidth: 440, width: "100%", boxShadow: "0 24px 60px rgba(0,0,0,0.1)", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>✅</div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#0d5e35" }}>Inscrição enviada!</h1>
          <p style={{ color: "#64748b", marginTop: 8 }}>Entraremos em contato em breve.</p>
          <button onClick={() => { setSucesso(false); setCursoId(""); setNome(""); setTelefone(""); setEmail(""); setCidade(""); }}
            style={{ marginTop: 24, padding: "14px 26px", fontSize: "1rem", fontWeight: 800, fontFamily: "Barlow, sans-serif", borderRadius: 10, border: "none", cursor: "pointer", background: "linear-gradient(135deg,#15814a,#1a9e5a)", color: "#fff" }}>
            Nova inscrição
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f9f6", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 24, padding: 40, maxWidth: 480, width: "100%", boxShadow: "0 24px 60px rgba(0,0,0,0.1)" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#0d5e35" }}>📋 Inscrição</h1>
          <p style={{ color: "#64748b", marginTop: 4 }}>Preencha para se inscrever em um curso</p>
        </div>
        {loading ? (
          <p style={{ textAlign: "center", color: "#64748b" }}>Carregando cursos...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontWeight: 700, fontSize: "0.88rem", color: "#334155", marginBottom: 6 }}>Curso</label>
              <select value={cursoId} onChange={(e) => setCursoId(e.target.value)} required
                style={{ width: "100%", padding: "12px 16px", border: "2px solid #e2e8f0", borderRadius: 12, fontSize: "0.95rem", fontFamily: "Barlow, sans-serif", background: "#fff" }}>
                <option value="">Selecione um curso</option>
                {cursos.map((c) => (
                  <option key={c.id} value={c.id}>{c.nome} - {c.horario} ({c.vagas} vagas)</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontWeight: 700, fontSize: "0.88rem", color: "#334155", marginBottom: 6 }}>Nome completo</label>
              <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome" required
                style={{ width: "100%", padding: "12px 16px", border: "2px solid #e2e8f0", borderRadius: 12, fontSize: "0.95rem", fontFamily: "Barlow, sans-serif", background: "#fff", boxSizing: "border-box" }} />
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ marginBottom: 18, flex: 1 }}>
                <label style={{ display: "block", fontWeight: 700, fontSize: "0.88rem", color: "#334155", marginBottom: 6 }}>Telefone</label>
                <input value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(00) 00000-0000" required
                  style={{ width: "100%", padding: "12px 16px", border: "2px solid #e2e8f0", borderRadius: 12, fontSize: "0.95rem", fontFamily: "Barlow, sans-serif", background: "#fff", boxSizing: "border-box" }} />
              </div>
              <div style={{ marginBottom: 18, flex: 1 }}>
                <label style={{ display: "block", fontWeight: 700, fontSize: "0.88rem", color: "#334155", marginBottom: 6 }}>E-mail</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="opcional"
                  style={{ width: "100%", padding: "12px 16px", border: "2px solid #e2e8f0", borderRadius: 12, fontSize: "0.95rem", fontFamily: "Barlow, sans-serif", background: "#fff", boxSizing: "border-box" }} />
              </div>
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontWeight: 700, fontSize: "0.88rem", color: "#334155", marginBottom: 6 }}>Cidade</label>
              <input value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="opcional"
                style={{ width: "100%", padding: "12px 16px", border: "2px solid #e2e8f0", borderRadius: 12, fontSize: "0.95rem", fontFamily: "Barlow, sans-serif", background: "#fff", boxSizing: "border-box" }} />
            </div>
            {erro && <p style={{ color: "#dc2626", marginBottom: 12, fontWeight: 600 }}>{erro}</p>}
            <button type="submit" disabled={enviando}
              style={{ width: "100%", padding: "14px 26px", fontSize: "1rem", fontWeight: 800, fontFamily: "Barlow, sans-serif", borderRadius: 10, border: "none", cursor: enviando ? "not-allowed" : "pointer", background: "linear-gradient(135deg,#15814a,#1a9e5a)", color: "#fff", opacity: enviando ? 0.7 : 1 }}>
              {enviando ? "Enviando..." : "Enviar inscrição"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
