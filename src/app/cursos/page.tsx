"use client";

import { useState, useEffect, useCallback } from "react";

type Aluno = {
  id: string;
  nome: string;
  telefone: string;
  whatsapp?: string;
  data_inscricao: string;
  cpf?: string;
  email?: string;
  data_nascimento?: string;
  cidade?: string;
  valor_curso?: number;
  forma_pagamento?: string;
  parcelas?: number;
  valor_parcela?: number;
  status_pagamento?: string;
  pago?: boolean;
  pendente?: boolean;
  data_pagamento?: string;
};

type Curso = {
  id: string;
  nome: string;
  descricao: string;
  horario: string;
  vagas: number;
  valor: number;
  data?: string | null;
  alunos: Aluno[];
};

type Interessado = {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  cursos: string[];
  status?: string;
  observacao?: string;
  criado_em: string;
};

const uid = () => Math.random().toString(36).slice(2, 10);
const today = () => new Date().toLocaleDateString("pt-BR");

const NOMES_CURSOS_BLOG = [
  "Saboaria Artesanal – Módulo 1",
  "Velas Artesanais – Apostila Completa",
  "Cosméticos & Perfumaria Artesanal",
  "Produtos de Limpeza Artesanais",
];

async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Erro ${res.status}`);
  }
  return res.json();
}

const api = {
  getCursos(): Promise<Curso[]> { return apiFetch("/api/cursos"); },
  createCurso(data: Partial<Curso>) { return apiFetch("/api/cursos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); },
  updateCurso(id: string, data: Partial<Curso>) { return apiFetch(`/api/cursos/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); },
  deleteCurso(id: string) { return apiFetch(`/api/cursos/${id}`, { method: "DELETE" }); },
  createAluno(data: Record<string, unknown>) { return apiFetch("/api/alunos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); },
  updateAluno(id: string, data: Record<string, unknown>) { return apiFetch(`/api/alunos/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); },
  deleteAluno(id: string) { return apiFetch(`/api/alunos/${id}`, { method: "DELETE" }); },
  getInteressados(): Promise<Interessado[]> { return apiFetch("/api/interessados"); },
  updateInteressado(id: string, data: Record<string, unknown>) { return apiFetch(`/api/interessados/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); },
  deleteInteressado(id: string) { return apiFetch(`/api/interessados/${id}`, { method: "DELETE" }); },
};

export default function CursosPage() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<"dashboard" | "detail">("dashboard");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [showCursoModal, setShowCursoModal] = useState(false);
  const [editingCurso, setEditingCurso] = useState<Curso | null>(null);
  const [formNome, setFormNome] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formCarga, setFormCarga] = useState("");
  const [formVagas, setFormVagas] = useState("20");
  const [formPreco, setFormPreco] = useState("150");
  const [formData, setFormData] = useState("");

  const [showInscricaoModal, setShowInscricaoModal] = useState(false);
  const [iCursoId, setICursoId] = useState("");
  const [iNome, setINome] = useState("");
  const [iTel, setITel] = useState("");
  const [iEmail, setIEmail] = useState("");
  const [iCidade, setICidade] = useState("");
  const [iStatus, setIStatus] = useState("Pendente");
  const [iEnviando, setIEnviando] = useState(false);
  const [iSucesso, setISucesso] = useState(false);

  const [showInteressadosModal, setShowInteressadosModal] = useState(false);
  const [interessados, setInteressados] = useState<Interessado[]>([]);
  const [interessadosLoading, setInteressadosLoading] = useState(false);
  const [matriculandoId, setMatriculandoId] = useState<string | null>(null);

  const [showAlunoModal, setShowAlunoModal] = useState(false);
  const [editingAluno, setEditingAluno] = useState<Aluno | null>(null);
  const [aNome, setANome] = useState("");
  const [aTel, setATel] = useState("");
  const [aCPF, setACPF] = useState("");
  const [aEmail, setAEmail] = useState("");
  const [aDataNasc, setADataNasc] = useState("");
  const [aCidade, setACidade] = useState("");
  const [aValorCurso, setAValorCurso] = useState("");
  const [aFormaPagamento, setAFormaPagamento] = useState("PIX");
  const [aParcelas, setAParcelas] = useState("1");
  const [aValorParcela, setAValorParcela] = useState("");
  const [aStatusPagamento, setAStatusPagamento] = useState("Pendente");
  const [aDataPagamento, setADataPagamento] = useState("");

  const carregar = useCallback(async () => {
    try {
      const data = await api.getCursos();
      setCursos(data);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar();
    setMounted(true);
  }, [carregar]);

  const selected = cursos.find((c) => c.id === selectedId) || null;
  const ocupadasDe = (c: Curso) => c.alunos.filter((a) => a.status_pagamento === "Pago").length;

  const openNewCurso = () => {
    setEditingCurso(null);
    setFormNome(""); setFormDesc(""); setFormCarga(""); setFormVagas("20"); setFormPreco("150"); setFormData("");
    setShowCursoModal(true);
  };
  const openEditCurso = (c: Curso) => {
    setEditingCurso(c);
    setFormNome(c.nome); setFormDesc(c.descricao); setFormCarga(c.horario);
    setFormVagas(String(c.vagas)); setFormPreco(String(c.valor || 0)); setFormData(c.data || "");
    setShowCursoModal(true);
  };
  const saveCurso = async () => {
    if (!formNome.trim()) { alert("Preencha o nome do curso"); return; }
    const payload = { nome: formNome.trim(), descricao: formDesc.trim(), horario: formCarga.trim(), vagas: Number(formVagas) || 20, preco: `R$ ${formPreco.replace("R$", "").trim()}`, data: formData.trim() || null };
    try {
      if (editingCurso) {
        await api.updateCurso(editingCurso.id, payload);
      } else {
        await api.createCurso(payload);
      }
      await carregar();
      setShowCursoModal(false);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Erro ao salvar curso");
    }
  };
  const deleteCurso = async (id: string) => {
    if (!confirm("Excluir este curso e todos os alunos?")) return;
    await api.deleteCurso(id);
    await carregar();
    if (selectedId === id) { setView("dashboard"); setSelectedId(null); }
  };

  const openNewAluno = () => {
    setEditingAluno(null); setANome(""); setATel(""); setACPF(""); setAEmail(""); setADataNasc(""); setACidade("");
    setAValorCurso(""); setAFormaPagamento("PIX"); setAParcelas("1"); setAValorParcela(""); setAStatusPagamento("Pendente"); setADataPagamento("");
    setShowAlunoModal(true);
  };
  const openEditAluno = (a: Aluno) => {
    setEditingAluno(a); setANome(a.nome); setATel(a.telefone || a.whatsapp || ""); setACPF(a.cpf || "");
    setAEmail(a.email || ""); setADataNasc(a.data_nascimento || ""); setACidade(a.cidade || "");
    setAValorCurso(a.valor_curso ? String(a.valor_curso) : "");
    setAFormaPagamento(a.forma_pagamento || "PIX"); setAParcelas(a.parcelas ? String(a.parcelas) : "1");
    setAValorParcela(a.valor_parcela ? String(a.valor_parcela) : "");
    setAStatusPagamento(a.status_pagamento || "Pendente"); setADataPagamento(a.data_pagamento || "");
    setShowAlunoModal(true);
  };
  const saveAluno = async () => {
    if (!selected || !aNome.trim()) return;
    const payload: Record<string, unknown> = {
      nome: aNome.trim(),
      telefone: aTel.trim(),
      cpf: aCPF.trim(),
      email: aEmail.trim(),
      data_nascimento: aDataNasc.trim(),
      cidade: aCidade.trim(),
      valor_curso: aValorCurso.trim() ? parseFloat(aValorCurso.trim().replace(",", ".")) : null,
      forma_pagamento: aFormaPagamento,
      parcelas: aParcelas.trim() ? parseInt(aParcelas.trim()) : 1,
      valor_parcela: aValorParcela.trim() ? parseFloat(aValorParcela.trim().replace(",", ".")) : null,
      status_pagamento: aStatusPagamento,
      data_pagamento: aDataPagamento.trim() || null,
    };
    if (editingAluno) {
      await api.updateAluno(editingAluno.id, payload);
    } else {
      await api.createAluno({ ...payload, curso_id: selected.id });
    }
    await carregar();
    setShowAlunoModal(false);
  };
  const deleteAluno = async (aid: string) => {
    await api.deleteAluno(aid);
    await carregar();
  };

  const saveInscricao = async () => {
    if (!iCursoId || !iNome.trim() || !iTel.trim()) { alert("Selecione um curso e preencha nome e telefone"); return; }
    const origemMatricula = matriculandoId;
    setIEnviando(true);
    try {
      await api.createAluno({ curso_id: iCursoId, nome: iNome.trim(), telefone: iTel.trim(), email: iEmail.trim() || null, cidade: iCidade.trim() || null, status_pagamento: iStatus });
      if (origemMatricula) {
        await api.updateInteressado(origemMatricula, { status: "Matriculado" });
      }
      setISucesso(true);
      await carregar();
      if (interessados.length > 0) await carregarInteressados();
    } catch (e: unknown) { alert(e instanceof Error ? e.message : "Erro"); }
    finally { setIEnviando(false); }
  };

  const carregarInteressados = useCallback(async () => {
    setInteressadosLoading(true);
    try {
      const data = await api.getInteressados();
      setInteressados(data || []);
    } catch { /* ignore */ } finally {
      setInteressadosLoading(false);
    }
  }, []);

  const openInteressados = () => {
    setShowInteressadosModal(true);
    carregarInteressados();
  };

  const whatsInteressado = (i: Interessado) => {
    const tel = (i.telefone || "").replace(/\D/g, "");
    if (!tel) return;
    window.open("https://wa.me/55" + tel + "?text=" + encodeURIComponent("Olá " + i.nome + "! Aqui é da Tulipa. Vimos seu interesse em nossos cursos. Entraremos em contato quando abrir a turma!"), "_blank");
  };

  const excluirInteressado = async (id: string) => {
    if (!confirm("Excluir este interessado?")) return;
    await api.deleteInteressado(id);
    await carregarInteressados();
  };

  const matricularInteressado = (i: Interessado) => {
    setMatriculandoId(i.id);
    setICursoId("");
    setINome(i.nome);
    setITel(i.telefone || "");
    setIEmail(i.email || "");
    setICidade("");
    setIStatus("Pago");
    setISucesso(false);
    setShowInteressadosModal(false);
    setShowInscricaoModal(true);
  };

  const gerarPDF = (c: Curso) => {
    let rows = "";
    c.alunos.forEach((a, i) => {
      rows += '<tr><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;text-align:center;color:#64748b;font-size:11px;">' + (i + 1) + '</td><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;font-weight:600;color:#1a202c;font-size:12px;">' + a.nome + '</td><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:11px;">' + (a.telefone || "-") + '</td><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:11px;">' + a.data_inscricao + '</td></tr>';
    });
    const html = '<div id="pdf-content"><div style="text-align:center;margin-bottom:24px;"><div style="font-size:11px;color:#64748b;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:4px;">TULIPA VENDEDORAS</div><div style="font-size:22px;font-weight:900;color:#0d5e35;margin-bottom:2px;">' + c.nome + '</div><div style="font-size:12px;color:#64748b;">' + c.descricao + '</div></div><div style="display:flex;justify-content:space-between;margin-bottom:20px;font-size:11px;color:#64748b;"><span>Data: ' + today() + '</span><span>Carga: ' + c.horario + '</span><span>Vagas: ' + c.alunos.filter(a => a.status_pagamento === "Pago").length + '/' + c.vagas + '</span></div><table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;"><thead><tr style="background:#0d5e35;color:#fff;"><th style="padding:10px 12px;text-align:center;font-size:11px;font-weight:700;width:40px;">N&#186;</th><th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;">NOME DO ALUNO</th><th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;width:140px;">TELEFONE</th><th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;width:100px;">INSCRICAO</th></tr></thead><tbody>' + rows + '</tbody></table><div style="margin-top:30px;text-align:center;font-size:10px;color:#94a3b8;"><p>Gerado em ' + today() + ' - Tulipa Vendedoras</p></div></div>';
    const fileName = "lista-" + c.nome.toLowerCase().replace(/\s+/g, "-") + ".pdf";
    const win = window.open("", "_blank");
    if (!win) return;
    const s1 = '<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"><\/script>';
    const s2 = '<script>document.body.innerHTML=\'' + html.replace(/'/g, "\\'") + '\';document.body.style.opacity="1";window.onload=function(){html2pdf().set({margin:[15,15,15,15],filename:"' + fileName + '",image:{type:"jpeg",quality:0.98},html2canvas:{scale:2,useCORS:true},jsPDF:{unit:"mm",format:"a4",orientation:"portrait"}}).from(document.getElementById("pdf-content")).save().then(function(){window.close();});};<\/script>';
    win.document.write("<html><head><title>Lista - " + c.nome + "</title></head><body>" + s1 + s2 + "</body></html>");
    win.document.close();
  };

  const gerarChamada = (c: Curso) => {
    const alunosPago = c.alunos.filter((a) => a.status_pagamento === "Pago");
    let rows = "";
    if (alunosPago.length === 0) {
      rows = '<tr><td colspan="4" style="padding:20px;text-align:center;color:#94a3b8;font-size:12px;">Nenhum aluno com pagamento confirmado (Pago)</td></tr>';
    }
    alunosPago.forEach((a, i) => {
      rows += '<tr><td style="padding:9px 12px;border-bottom:1px solid #e2e8f0;text-align:center;color:#64748b;font-size:11px;">' + (i + 1) + '</td><td style="padding:9px 12px;border-bottom:1px solid #e2e8f0;font-weight:600;color:#1a202c;font-size:12px;">' + a.nome + '</td><td style="padding:9px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:11px;">' + (a.telefone || "-") + '</td><td style="padding:9px 12px;border-bottom:1px solid #e2e8f0;text-align:center;"><div style="width:20px;height:20px;border:2px solid #64748b;border-radius:4px;margin:0 auto;"></div></td></tr>';
    });
    const html = '<div id="pdf-content"><div style="text-align:center;margin-bottom:20px;"><div style="font-size:11px;color:#64748b;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:4px;">TULIPA VENDEDORAS</div><div style="font-size:20px;font-weight:900;color:#0d5e35;margin-bottom:2px;">CHAMADA - ' + c.nome + '</div><div style="font-size:12px;color:#64748b;">' + c.descricao + '</div></div><div style="display:flex;justify-content:space-between;margin-bottom:20px;font-size:11px;color:#64748b;"><span>Data: ' + today() + '</span><span>Carga: ' + c.horario + '</span><span>Alunos: ' + alunosPago.length + '/' + c.vagas + '</span></div><table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;"><thead><tr style="background:#0d5e35;color:#fff;"><th style="padding:10px 12px;text-align:center;font-size:11px;font-weight:700;width:40px;">N&#186;</th><th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;">NOME DO ALUNO</th><th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;width:140px;">TELEFONE</th><th style="padding:10px 12px;text-align:center;font-size:11px;font-weight:700;width:60px;">PRESEN&#199;A</th></tr></thead><tbody>' + rows + '</tbody></table><div style="margin-top:26px;font-size:11px;color:#94a3b8;"><p style="margin-bottom:16px;">Legenda: marque com um "X" no quadrado os alunos presentes no dia.</p></div><div style="margin-top:40px;display:flex;justify-content:space-between;font-size:11px;color:#64748b;"><span>__________________________________</span><span>__________________________________</span></div><div style="display:flex;justify-content:space-between;font-size:10px;color:#94a3b8;"><span>Instrutora</span><span>Responsavel</span></div></div>';
    const fileName = "chamada-" + c.nome.toLowerCase().replace(/\s+/g, "-") + ".pdf";
    const win = window.open("", "_blank");
    if (!win) return;
    const s1 = '<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"><\/script>';
    const s2 = '<script>document.body.innerHTML=\'' + html.replace(/'/g, "\\'") + '\';document.body.style.opacity="1";window.onload=function(){html2pdf().set({margin:[15,15,15,15],filename:"' + fileName + '",image:{type:"jpeg",quality:0.98},html2canvas:{scale:2,useCORS:true},jsPDF:{unit:"mm",format:"a4",orientation:"portrait"}}).from(document.getElementById("pdf-content")).save().then(function(){window.close();});};<\/script>';
    win.document.write("<html><head><title>Chamada - " + c.nome + "</title></head><body>" + s1 + s2 + "</body></html>");
    win.document.close();
  };

  const whatsAluno = (a: Aluno) => {
    const tel = (a.telefone || a.whatsapp || "").replace(/\D/g, "");
    if (!tel) return;
    window.open("https://wa.me/55" + tel + "?text=" + encodeURIComponent("Olá " + a.nome + "! Aqui é da Tulipa Vendedoras."), "_blank");
  };
  const whatsCurso = (c: Curso) => {
    let texto = "*Lista de Alunos - " + c.nome + "*\n";
    texto += "Descricao: " + c.descricao + "\n";
    texto += "Carga: " + c.horario + " | Vagas: " + c.alunos.filter(a => a.status_pagamento === "Pago").length + "/" + c.vagas + "\n\n";
    texto += "*Alunos:*\n";
    c.alunos.forEach((a, i) => { texto += (i + 1) + ". " + a.nome + (a.telefone ? " - " + a.telefone : "") + "\n"; });
    texto += "\nGerado em " + today() + " - Tulipa Vendedoras";
    window.open("https://wa.me/?text=" + encodeURIComponent(texto), "_blank");
  };

  if (!mounted) return null;

  return (
    <div>
      <div className="header no-print">
        <div className="container header-inner">
          <a href="/" className="back-btn">&#8592; Voltar</a>
          <img src="/logo.jpg" alt="Tulipa" className="header-logo" />
          <div className="header-text">
            <h1>&#127891; Cursos</h1>
            <p>Painel de gerenciamento de cursos e alunos</p>
          </div>
        </div>
      </div>

      <main className="container" style={{ paddingTop: 24, paddingBottom: 48 }}>
        {loading ? (
          <div className="empty-state"><p>Carregando...</p></div>
        ) : view === "dashboard" ? (
          <>
            <div className="top-actions">
              <button className="btn btn-primary" onClick={openNewCurso}>+ Novo Curso</button>
              <button className="btn btn-secondary" onClick={() => { const url = window.location.origin + "/cursos/inscricao"; navigator.clipboard.writeText(url); alert("Link copiado: " + url); }}>&#128279; Link inscrição</button>
              <button className="btn btn-secondary" onClick={() => { setICursoId(""); setINome(""); setITel(""); setIEmail(""); setICidade(""); setIStatus("Pendente"); setMatriculandoId(null); setISucesso(false); setShowInscricaoModal(true); }}>&#128221; Cadastrar aluno</button>
              <button className="btn btn-secondary" onClick={openInteressados}>&#128101; Interessados</button>
              <span style={{ color: "#64748b", fontSize: "0.9rem", alignSelf: "center" }}>
                {cursos.length} curso(s) cadastrado(s)
              </span>
            </div>

            {cursos.length > 0 && (
              <>
                {(() => {
                  const todos = cursos.flatMap(c => c.alunos);
                  const recibido = todos.filter(a => a.status_pagamento === "Pago").reduce((s, a) => s + (a.valor_curso || 0), 0);
                  const pendente = todos.filter(a => a.status_pagamento === "Pendente").reduce((s, a) => s + (a.valor_curso || 0), 0);
                  const cancelado = todos.filter(a => a.status_pagamento === "Cancelado").reduce((s, a) => s + (a.valor_curso || 0), 0);
                  return (
                    <div className="fin-summary">
                      <div className="fin-card"><div className="fin-label">Recebido</div><div className="fin-value" style={{color:"#16a34a"}}>R$ {recibido.toFixed(2).replace(".", ",")}</div></div>
                      <div className="fin-card"><div className="fin-label">Pendente</div><div className="fin-value" style={{color:"#eab308"}}>R$ {pendente.toFixed(2).replace(".", ",")}</div></div>
                      <div className="fin-card"><div className="fin-label">Cancelado</div><div className="fin-value" style={{color:"#dc2626"}}>R$ {cancelado.toFixed(2).replace(".", ",")}</div></div>
                      <div className="fin-card"><div className="fin-label">Alunos</div><div className="fin-value" style={{color:"#0d5e35"}}>{todos.length}</div></div>
                      <div className="fin-card"><div className="fin-label">Total</div><div className="fin-value" style={{color:"#0d5e35"}}>R$ {(recibido + pendente).toFixed(2).replace(".", ",")}</div></div>
                    </div>
                  );
                })()}
              </>
            )}
            {cursos.length === 0 ? (
              <div className="empty-state">
                <div className="icon">&#127891;</div>
                <p>Nenhum curso cadastrado ainda</p>
              </div>
            ) : (
              <div className="cursos-dashboard">
                {cursos.map((c) => {
                  const ocupadas = ocupadasDe(c);
                  const livres = Math.max(0, c.vagas - ocupadas);
                  const pct = c.vagas > 0 ? (ocupadas / c.vagas) * 100 : 0;
                  const statusClass = pct >= 100 ? "lotado" : pct >= 70 ? "quase" : "ok";
                  const statusLabel = pct >= 100 ? "Lotado" : pct >= 70 ? "Quase cheio" : "Vagas abertas";
                  return (
                    <div key={c.id} className="curso-card" onClick={() => { setSelectedId(c.id); setView("detail"); }}>
                      <div className="curso-card-top">
                        <span className={"curso-card-badge " + statusClass}>{statusLabel}</span>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button className="action-btn edit" title="Editar" onClick={(e) => { e.stopPropagation(); openEditCurso(c); }}>&#9998;&#65039;</button>
                          <button className="action-btn del" title="Excluir" onClick={(e) => { e.stopPropagation(); deleteCurso(c.id); }}>&#128465;&#65039;</button>
                        </div>
                      </div>
                      <h3>{c.nome}</h3>
                      <p className="desc">{c.descricao}</p>
                      <div className="curso-card-info">
                        <span>&#9202; {c.horario}</span>
                        <span>&#128101; {ocupadas}/{c.vagas} vagas</span>
                        {c.valor > 0 && <span style={{fontWeight:800,color:"#0d5e35",fontSize:"0.95rem"}}>R$ {c.valor.toFixed(2).replace(".", ",")}</span>}
                      </div>
                      {c.alunos.length > 0 && (
                        <div className="curso-card-fin">
                          <span style={{color:"#16a34a"}}>R$ {c.alunos.filter(a=>a.status_pagamento==="Pago").reduce((s,a)=>s+(a.valor_curso||0),0).toFixed(2).replace(".", ",")} recebido</span>
                          <span style={{color:"#eab308"}}>R$ {c.alunos.filter(a=>a.status_pagamento==="Pendente").reduce((s,a)=>s+(a.valor_curso||0),0).toFixed(2).replace(".", ",")} pendente</span>
                        </div>
                      )}
                      <div className="vaga-bar">
                        <div className={"vaga-bar-fill " + statusClass} style={{ width: Math.min(pct, 100) + "%" }} />
                      </div>
                      <div className="vaga-text">
                        <span>{livres} vaga(s) livre(s)</span>
                        <span>{Math.round(pct)}% ocupado</span>
                      </div>
                      <div className="curso-card-footer" onClick={(e) => e.stopPropagation()}>
                        <button className="btn btn-primary" onClick={() => { setSelectedId(c.id); setView("detail"); }}>Ver alunos</button>
                        {ocupadas > 0 && <button className="btn" style={{ background: "#25D366", color: "#fff" }} onClick={() => whatsCurso(c)}>&#128241; WhatsApp</button>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : selected ? (
          <>
            <div className="detail-top">
              <button className="back" onClick={() => { setView("dashboard"); setSelectedId(null); }}>&#8592; Voltar</button>
              <div className="detail-info">
                <h2>{selected.nome}</h2>
                <p>{selected.descricao} | {selected.horario} {selected.valor > 0 && <span style={{fontWeight:800,color:"#0d5e35"}}> | R$ {selected.valor.toFixed(2).replace(".", ",")}</span>}</p>
              </div>
              <div className="detail-stats">
                <div className="stat-box">
                  <div className="num">{selected.vagas}</div>
                  <div className="label">Vagas</div>
                </div>
                <div className="stat-box">
                  <div className="num">{ocupadasDe(selected)}</div>
                  <div className="label">Preenchidas</div>
                </div>
                <div className="stat-box">
                  <div className="num" style={{ color: ocupadasDe(selected) >= selected.vagas ? "#dc2626" : "#16a34a" }}>
                    {Math.max(0, selected.vagas - ocupadasDe(selected))}
                  </div>
                  <div className="label">Livres</div>
                </div>
              </div>
            </div>

            <div className="top-actions">
              <button className="btn btn-primary" onClick={openNewAluno} disabled={ocupadasDe(selected) >= selected.vagas}>+ Novo Aluno</button>
              <button className="btn btn-primary" onClick={() => gerarChamada(selected)}>&#128203; Imprimir Chamada de Alunos</button>
              {selected.alunos.length > 0 && (
                <>
                  <button className="btn btn-primary" onClick={() => gerarPDF(selected)}>&#128196; Gerar PDF</button>
                  <button className="btn" style={{ background: "#25D366", color: "#fff" }} onClick={() => whatsCurso(selected)}>&#128241; WhatsApp</button>
                  <button className="btn btn-secondary" onClick={() => window.print()}>&#128424;&#65039; Imprimir</button>
                </>
              )}
              <button className="btn btn-secondary" onClick={() => openEditCurso(selected)}>&#9998;&#65039; Editar Curso</button>
              <button className="btn btn-secondary" onClick={() => { const url = window.location.origin + "/cursos/inscricao"; navigator.clipboard.writeText(url); alert("Link copiado: " + url); }}>&#128279; Link inscrição</button>
              <button className="btn btn-secondary" onClick={() => { setICursoId(selected.id); setINome(""); setITel(""); setIEmail(""); setICidade(""); setIStatus("Pendente"); setMatriculandoId(null); setISucesso(false); setShowInscricaoModal(true); }}>&#128221; Cadastrar aluno</button>
            </div>

            <div className="aluno-form-card">
              <h3>{editingAluno ? "Editar Aluno" : "+ Adicionar Aluno"} {ocupadasDe(selected) >= selected.vagas && !editingAluno ? "(Vagas esgotadas)" : ""}</h3>
              <div className="aluno-form-row">
                <input className="aluno-input" placeholder="Nome completo" value={aNome} onChange={(e) => setANome(e.target.value)} disabled={ocupadasDe(selected) >= selected.vagas && !editingAluno} />
                <input className="aluno-input phone" placeholder="Telefone" value={aTel} onChange={(e) => setATel(e.target.value)} disabled={ocupadasDe(selected) >= selected.vagas && !editingAluno} />
                {editingAluno ? (
                  <>
                    <button className="btn btn-primary" onClick={saveAluno}>Salvar</button>
                    <button className="btn btn-secondary" onClick={() => { setEditingAluno(null); setANome(""); setATel(""); }}>Cancelar</button>
                  </>
                ) : (
                  <button className="btn btn-primary" onClick={saveAluno} disabled={ocupadasDe(selected) >= selected.vagas}>Adicionar</button>
                )}
              </div>
            </div>

            {selected.alunos.length === 0 ? (
              <div className="empty-state">
                <div className="icon">&#128101;</div>
                <p>Nenhum aluno inscrito neste curso</p>
              </div>
            ) : (
              <div className="alunos-table-card">
                <div className="alunos-table-header">
                  <h3>Alunos inscritos ({selected.alunos.length})</h3>
                </div>
                <table className="alunos-table">
                  <thead>
                    <tr>
                      <th style={{ width: 32 }}>N&#186;</th>
                      <th>Nome</th>
                      <th style={{ width: 130 }}>Telefone</th>
                      <th style={{ width: 90 }}>Pgto</th>
                      <th style={{ width: 90 }}>Status</th>
                      <th style={{ width: 90 }}>Inscricao</th>
                      <th style={{ width: 100 }}>Acoes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.alunos.map((a, i) => {
                      const statusColor = a.status_pagamento === "Pago" ? "#16a34a" : a.status_pagamento === "Cancelado" ? "#dc2626" : "#eab308";
                      const formaIcon = a.forma_pagamento === "PIX" ? "\uD83D\uDCB5" : a.forma_pagamento === "CARTÃO" ? "\uD83D\uDCB3" : a.forma_pagamento === "DINHEIRO" ? "\uD83D\uDCB0" : "";
                      return (
                      <tr key={a.id}>
                        <td style={{ textAlign: "center", color: "#94a3b8" }}>{i + 1}</td>
                        <td style={{ fontWeight: 600 }}>{a.nome}</td>
                        <td style={{ color: "#64748b", fontSize: "0.82rem" }}>{a.telefone || a.whatsapp || "-"}</td>
                        <td style={{ fontSize: "0.82rem" }}>{formaIcon} {a.forma_pagamento || "-"}</td>
                        <td><span className={"pag-badge " + (a.status_pagamento || "pendente").toLowerCase()} style={{ background: statusColor + "22", color: statusColor }}>{a.status_pagamento || "Pendente"}</span></td>
                        <td style={{ color: "#64748b", fontSize: "0.78rem" }}>{a.data_inscricao ? new Date(a.data_inscricao).toLocaleDateString("pt-BR") : "-"}</td>
                        <td>
                          <div style={{ display: "flex", gap: 4 }}>
                            <button className="action-btn edit" onClick={() => openEditAluno(a)} title="Editar">&#9998;&#65039;</button>
                            <button className="action-btn del" onClick={() => deleteAluno(a.id)} title="Excluir">&#128465;&#65039;</button>
                            {(a.telefone || a.whatsapp) && <button className="action-btn whats" onClick={() => whatsAluno(a)} title="WhatsApp">&#128172;</button>}
                          </div>
                        </td>
                      </tr>
                    );})}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : null}
      </main>

      {showCursoModal && (
        <div className="modal-overlay" onClick={() => setShowCursoModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCurso ? "Editar Curso" : "Novo Curso"}</h2>
              <button className="modal-close" onClick={() => setShowCursoModal(false)}>&#10005;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nome do curso (sincronizado com o blog)</label>
                <select value={formNome} onChange={(e) => setFormNome(e.target.value)}>
                  <option value="">Selecione o curso do blog...</option>
                  {NOMES_CURSOS_BLOG.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <p style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: 6 }}>
                  Use um destes nomes para o curso aparecer na aba "Consulte as Vagas" do blog.
                </p>
              </div>
              <div className="form-group">
                <label>Descricao</label>
                <textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} placeholder="Breve descricao do curso" />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Horario / Carga</label>
                  <input value={formCarga} onChange={(e) => setFormCarga(e.target.value)} placeholder="Ex: 08:30 as 12:00" />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Vagas</label>
                  <input type="number" min="1" value={formVagas} onChange={(e) => setFormVagas(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Valor (R$)</label>
                  <input value={formPreco} onChange={(e) => setFormPreco(e.target.value)} placeholder="Ex: 150,00" />
                </div>
              </div>
              <div className="form-group">
                <label>Data do curso</label>
                <input type="date" value={formData} onChange={(e) => setFormData(e.target.value)} />
              </div>
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setShowCursoModal(false)}>Cancelar</button>
                <button className="btn btn-primary" onClick={saveCurso}>{editingCurso ? "Salvar" : "Criar Curso"}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAlunoModal && (
        <div className="modal-overlay" onClick={() => setShowAlunoModal(false)}>
          <div className="modal modal-aluno" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingAluno ? "Editar Aluno" : "Novo Aluno"}</h2>
              <button className="modal-close" onClick={() => setShowAlunoModal(false)}>&#10005;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nome completo</label>
                <input value={aNome} onChange={(e) => setANome(e.target.value)} placeholder="Nome do aluno" />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Telefone</label>
                  <input value={aTel} onChange={(e) => setATel(e.target.value)} placeholder="(00) 00000-0000" />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>CPF</label>
                  <input value={aCPF} onChange={(e) => setACPF(e.target.value)} placeholder="000.000.000-00" />
                </div>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>E-mail</label>
                  <input value={aEmail} onChange={(e) => setAEmail(e.target.value)} placeholder="aluno@email.com" />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Data Nascimento</label>
                  <input type="date" value={aDataNasc} onChange={(e) => setADataNasc(e.target.value)} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Cidade</label>
                  <input value={aCidade} onChange={(e) => setACidade(e.target.value)} placeholder="Cidade do aluno" />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Valor Curso (R$)</label>
                  <input value={aValorCurso} onChange={(e) => setAValorCurso(e.target.value)} placeholder="150,00" />
                </div>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Forma Pagamento</label>
                  <select value={aFormaPagamento} onChange={(e) => setAFormaPagamento(e.target.value)}>
                    <option value="PIX">PIX</option>
                    <option value="CARTÃO">Cartão</option>
                    <option value="DINHEIRO">Dinheiro</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Status Pagamento</label>
                  <select value={aStatusPagamento} onChange={(e) => setAStatusPagamento(e.target.value)}>
                    <option value="Pendente">Pendente</option>
                    <option value="Pago">Pago</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Data Pagamento</label>
                  <input type="date" value={aDataPagamento} onChange={(e) => setADataPagamento(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Parcelas</label>
                  <input type="number" min="1" max="24" value={aParcelas} onChange={(e) => setAParcelas(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Valor Parcela (R$)</label>
                  <input value={aValorParcela} onChange={(e) => setAValorParcela(e.target.value)} placeholder="75,00" />
                </div>
              </div>
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setShowAlunoModal(false)}>Cancelar</button>
                <button className="btn btn-primary" onClick={saveAluno}>{editingAluno ? "Salvar" : "Adicionar"}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showInscricaoModal && (
        <div className="modal-overlay" onClick={() => { setShowInscricaoModal(false); setMatriculandoId(null); }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{iSucesso ? "✅ Inscrição realizada" : "📋 Nova inscrição"}</h2>
              <button className="modal-close" onClick={() => { setShowInscricaoModal(false); setMatriculandoId(null); }}>&#10005;</button>
            </div>
            <div className="modal-body">
              {iSucesso ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <p style={{ color: "#64748b", marginBottom: 20 }}>{matriculandoId ? "Aluno matriculado (vaga preenchida) com sucesso!" : "Aluno cadastrado com sucesso!"}</p>
                  <button className="btn btn-primary" onClick={() => { setISucesso(false); setINome(""); setITel(""); setIEmail(""); setICidade(""); setIStatus("Pendente"); setMatriculandoId(null); }}>Nova inscrição</button>
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label>Curso</label>
                    <select value={iCursoId} onChange={(e) => setICursoId(e.target.value)} required>
                      <option value="">Selecione um curso</option>
                      {cursos.filter(c => ocupadasDe(c) < c.vagas).map((c) => (
                        <option key={c.id} value={c.id}>{c.nome} - {c.horario} ({c.vagas - ocupadasDe(c)} vagas)</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Nome completo</label>
                    <input value={iNome} onChange={(e) => setINome(e.target.value)} placeholder="Nome do aluno" />
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>Telefone</label>
                      <input value={iTel} onChange={(e) => setITel(e.target.value)} placeholder="(00) 00000-0000" />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>E-mail</label>
                      <input value={iEmail} onChange={(e) => setIEmail(e.target.value)} placeholder="opcional" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Status pagamento</label>
                    <select value={iStatus} onChange={(e) => setIStatus(e.target.value)}>
                      <option value="Pendente">Pendente</option>
                      <option value="Pago">Pago</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Cidade</label>
                    <input value={iCidade} onChange={(e) => setICidade(e.target.value)} placeholder="opcional" />
                  </div>
                  <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={() => { setShowInscricaoModal(false); setMatriculandoId(null); }}>Fechar</button>
                    <button className="btn btn-primary" onClick={saveInscricao} disabled={iEnviando}>{iEnviando ? "Salvando..." : "Inscrever"}</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {showInteressadosModal && (
        <div className="modal-overlay" onClick={() => setShowInteressadosModal(false)}>
          <div className="modal modal-interessados" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>&#128101; Interessados ({interessados.length})</h2>
              <button className="modal-close" onClick={() => setShowInteressadosModal(false)}>&#10005;</button>
            </div>
            <div className="modal-body">
              {interessadosLoading ? (
                <p style={{ textAlign: "center", color: "#64748b", padding: "20px 0" }}>Carregando...</p>
              ) : interessados.length === 0 ? (
                <p style={{ textAlign: "center", color: "#94a3b8", padding: "20px 0" }}>
                  Nenhum interessado ainda. Os cadastros do formulário do blog aparecem aqui.
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {interessados.map((i) => {
                    const statusColor = i.status === "Matriculado" ? "#16a34a" : i.status === "Contatado" ? "#eab308" : "#0d5e35";
                    return (
                      <div key={i.id} style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 14, background: "#f8fafc" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
                          <div style={{ fontWeight: 700, color: "#0d5e35", fontSize: "0.95rem" }}>{i.nome}</div>
                          <span className="pag-badge" style={{ background: statusColor + "22", color: statusColor, flexShrink: 0 }}>{i.status || "Interessado"}</span>
                        </div>
                        <div style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: 6 }}>
                          <div>{i.telefone || "-"} {i.email ? " | " + i.email : ""}</div>
                          <div style={{ color: "#94a3b8", fontSize: "0.75rem" }}>
                            {i.criado_em ? new Date(i.criado_em).toLocaleDateString("pt-BR") + " " + new Date(i.criado_em).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : ""}
                          </div>
                        </div>
                        {Array.isArray(i.cursos) && i.cursos.length > 0 && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                            {i.cursos.map((c) => (
                              <span key={c} className="pag-badge" style={{ background: "#e0f2fe", color: "#0369a1" }}>{c}</span>
                            ))}
                          </div>
                        )}
                        <div style={{ display: "flex", gap: 8 }}>
                          {(i.telefone || "").replace(/\D/g, "").length >= 10 && (
                            <button className="btn btn-secondary" style={{ fontSize: "0.8rem", padding: "8px 12px" }} onClick={() => whatsInteressado(i)}>&#128172; WhatsApp</button>
                          )}
                          {i.status !== "Matriculado" && (
                            <button className="btn btn-primary" style={{ fontSize: "0.8rem", padding: "8px 12px" }} onClick={() => matricularInteressado(i)}>&#127891; Matricular</button>
                          )}
                          <button className="btn btn-secondary" style={{ fontSize: "0.8rem", padding: "8px 12px" }} onClick={() => excluirInteressado(i.id)}>&#128465; Excluir</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{pageCss}</style>
    </div>
  );
}

const pageCss = `
.cursos-dashboard{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px;margin-bottom:32px;}
.curso-card{background:#fff;border-radius:24px;padding:28px;border:2px solid #e8f5ee;transition:all 0.25s ease;cursor:pointer;position:relative;overflow:hidden;}
.curso-card:hover{border-color:#15814a;transform:translateY(-4px);box-shadow:0 16px 40px rgba(13,94,53,0.12);}
.curso-card-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;}
.curso-card-badge{padding:5px 12px;border-radius:20px;font-size:0.75rem;font-weight:700;letter-spacing:0.04em;}
.curso-card-badge.livre{background:#dcfce7;color:#166534;}
.curso-card-badge.lotado{background:#fee2e2;color:#dc2626;}
.curso-card-badge.quase{background:#fef9c3;color:#854d0e;}
.curso-card h3{font-size:1.2rem;color:#0d5e35;font-weight:800;margin-bottom:6px;}
.curso-card .desc{font-size:0.88rem;color:#64748b;margin-bottom:16px;line-height:1.4;}
.curso-card-info{display:flex;gap:16px;margin-bottom:16px;font-size:0.82rem;color:#64748b;}
.curso-card-info span{display:flex;align-items:center;gap:4px;}
.vaga-bar{height:8px;background:#e2e8f0;border-radius:99px;overflow:hidden;margin-bottom:8px;}
.vaga-bar-fill{height:100%;border-radius:99px;transition:width 0.4s ease;}
.vaga-bar-fill.ok{background:linear-gradient(90deg,#22c55e,#16a34a);}
.vaga-bar-fill.quase{background:linear-gradient(90deg,#eab308,#f59e0b);}
.vaga-bar-fill.lotado{background:linear-gradient(90deg,#ef4444,#dc2626);}
.vaga-text{display:flex;justify-content:space-between;font-size:0.82rem;color:#64748b;font-weight:600;}
.curso-card-footer{display:flex;gap:8px;margin-top:16px;}
.curso-card-footer .btn{flex:1;font-size:0.85rem;padding:10px 12px;border-radius:12px;}
.fin-summary{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;margin-bottom:24px;}
.fin-card{background:#fff;border-radius:16px;padding:18px 20px;border:1px solid #e2e8f0;text-align:center;}
.fin-card .fin-label{font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#64748b;margin-bottom:4px;}
.fin-card .fin-value{font-size:1.2rem;font-weight:900;}
.curso-card-fin{display:flex;gap:12px;margin-bottom:10px;font-size:0.78rem;font-weight:700;justify-content:space-between;}
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.4);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;z-index:1000;padding:20px;}
.modal{background:#fff;border-radius:24px;width:100%;max-width:520px;max-height:90vh;overflow-y:auto;box-shadow:0 24px 60px rgba(0,0,0,0.2);}
.modal-header{padding:24px 28px 0;display:flex;justify-content:space-between;align-items:center;}
.modal-header h2{font-size:1.3rem;color:#0d5e35;font-weight:800;}
.modal-close{width:36px;height:36px;border-radius:10px;border:none;background:#f1f5f9;cursor:pointer;font-size:1.1rem;display:flex;align-items:center;justify-content:center;transition:background 0.15s;}
.modal-close:hover{background:#e2e8f0;}
.modal-body{padding:24px 28px 28px;}
.modal-body .form-group{margin-bottom:18px;}
.modal-body label{display:block;font-weight:700;font-size:0.88rem;color:#334155;margin-bottom:6px;}
.modal-body input,.modal-body textarea{width:100%;padding:12px 16px;border:2px solid #e2e8f0;border-radius:12px;font-size:0.95rem;font-family:Barlow,sans-serif;transition:all 0.2s;background:#fff;}
.modal-body input:focus,.modal-body textarea:focus{outline:none;border-color:#15814a;box-shadow:0 0 0 3px rgba(21,129,74,0.1);}
.modal-body textarea{resize:vertical;min-height:70px;}
.modal-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:24px;}
.detail-top{display:flex;align-items:center;gap:16px;margin-bottom:28px;flex-wrap:wrap;}
.detail-top .back{padding:10px 18px;border-radius:12px;border:2px solid #e2e8f0;background:#fff;cursor:pointer;font-weight:700;font-size:0.9rem;font-family:Barlow,sans-serif;transition:all 0.15s;display:flex;align-items:center;gap:6px;}
.detail-top .back:hover{border-color:#15814a;background:#f0fdf4;}
.detail-info{flex:1;}
.detail-info h2{font-size:1.5rem;color:#0d5e35;font-weight:900;}
.detail-info p{color:#64748b;font-size:0.9rem;}
.detail-stats{display:flex;gap:12px;flex-wrap:wrap;}
.stat-box{padding:12px 20px;border-radius:14px;background:#f8fafc;border:1px solid #e2e8f0;text-align:center;min-width:100px;}
.stat-box .num{font-size:1.4rem;font-weight:900;color:#0d5e35;}
.stat-box .label{font-size:0.75rem;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;}
.aluno-form-card{background:#fff;border-radius:20px;padding:24px;margin-bottom:20px;border:1px solid #e2e8f0;box-shadow:0 1px 3px rgba(0,0,0,0.04);}
.aluno-form-card h3{font-size:1rem;font-weight:700;color:#0d5e35;margin-bottom:14px;}
.aluno-form-row{display:flex;gap:10px;flex-wrap:wrap;}
.aluno-input{flex:1;min-width:180px;padding:12px 16px;border:2px solid #e2e8f0;border-radius:12px;font-size:0.95rem;font-family:Barlow,sans-serif;transition:all 0.2s;}
.aluno-input:focus{outline:none;border-color:#15814a;box-shadow:0 0 0 3px rgba(21,129,74,0.1);}
.aluno-input.phone{max-width:180px;}
.alunos-table-card{background:#fff;border-radius:20px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 1px 3px rgba(0,0,0,0.04);}
.alunos-table-header{padding:16px 24px;background:linear-gradient(135deg,#0d5e35,#15814a);color:#fff;display:flex;justify-content:space-between;align-items:center;}
.alunos-table-header h3{font-size:1rem;font-weight:700;}
.alunos-table{width:100%;border-collapse:collapse;}
.alunos-table th{padding:12px 20px;text-align:left;font-size:0.75rem;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;background:#f8fafc;border-bottom:1px solid #e2e8f0;}
.alunos-table td{padding:12px 20px;border-bottom:1px solid #f1f5f9;font-size:0.9rem;}
.alunos-table tr:last-child td{border-bottom:none;}
.alunos-table tr:hover td{background:#f8fafc;}
.action-btn{width:30px;height:30px;border-radius:8px;border:none;cursor:pointer;font-size:0.8rem;display:inline-flex;align-items:center;justify-content:center;transition:all 0.15s;}
.action-btn.edit{background:#e0f2fe;color:#0369a1;}
.action-btn.edit:hover{background:#bae6fd;}
.action-btn.del{background:#fee2e2;color:#dc2626;}
.action-btn.del:hover{background:#fecaca;}
.action-btn.whats{background:#dcfce7;color:#16a34a;}
.action-btn.whats:hover{background:#bbf7d0;}
.pag-badge{display:inline-block;padding:3px 10px;border-radius:99px;font-size:0.72rem;font-weight:700;letter-spacing:0.03em;}
.modal-aluno{max-width:580px!important;}
.modal-interessados{max-width:640px!important;}
.modal-body select{width:100%;padding:12px 16px;border:2px solid #e2e8f0;border-radius:12px;font-size:0.95rem;font-family:Barlow,sans-serif;background:#fff;transition:all 0.2s;cursor:pointer;appearance:auto;}
.modal-body select:focus{outline:none;border-color:#15814a;box-shadow:0 0 0 3px rgba(21,129,74,0.1);}
.empty-state{text-align:center;padding:60px 20px;color:#94a3b8;}
.empty-state .icon{font-size:3rem;opacity:0.3;margin-bottom:12px;}
.empty-state p{font-size:1rem;}
.top-actions{display:flex;gap:10px;margin-bottom:24px;flex-wrap:wrap;}
.top-actions .btn{display:inline-flex;align-items:center;gap:6px;}
@media print{.no-print{display:none!important;}body{background:#fff!important;}@page{size:A4 portrait;margin:15mm;}}
@media(max-width:700px){.cursos-dashboard{grid-template-columns:1fr;}.detail-top{flex-direction:column;align-items:stretch;}.detail-stats{justify-content:center;}.aluno-form-row{flex-direction:column;}.aluno-input.phone{max-width:100%;}.top-actions{flex-direction:column;}.top-actions .btn{width:100%;}}
`;
