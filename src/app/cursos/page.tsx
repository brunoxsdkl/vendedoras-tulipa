"use client";

import { useState, useEffect, useCallback } from "react";

/* ────────── Types ────────── */
type Aluno = {
  id: string;
  nome: string;
  telefone: string;
  dataInscricao: string;
};

type Curso = {
  id: string;
  nome: string;
  descricao: string;
  carga: string;
  vagas: number;
  preco: string;
  alunos: Aluno[];
};

/* ────────── Helpers ────────── */
const uid = () => Math.random().toString(36).slice(2, 10);
const today = () => new Date().toLocaleDateString("pt-BR");
const STORAGE_KEY = "tulipa-cursos-v2";

function loadCursos(): Curso[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultCursos();
  } catch {
    return defaultCursos();
  }
}

function saveCursos(c: Curso[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
}

function defaultCursos(): Curso[] {
  return [
    { id: uid(), nome: "Cosmeticos e Perfumes", descricao: "Aprenda a criar cosméticos e perfumes do zero", carga: "08:30 as 12:00", vagas: 20, preco: "R$ 150,00", alunos: [] },
    { id: uid(), nome: "Velas", descricao: "Producao de velas artesanais e aromatizacao", carga: "08:30 as 12:00", vagas: 20, preco: "R$ 150,00", alunos: [] },
    { id: uid(), nome: "Saboaria", descricao: "Criacao de sabonetes artesanais e presentes", carga: "08:30 as 12:00", vagas: 20, preco: "R$ 150,00", alunos: [] },
  ];
}

/* ────────── CSS ────────── */
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

.empty-state{text-align:center;padding:60px 20px;color:#94a3b8;}
.empty-state .icon{font-size:3rem;opacity:0.3;margin-bottom:12px;}
.empty-state p{font-size:1rem;}

.top-actions{display:flex;gap:10px;margin-bottom:24px;flex-wrap:wrap;}
.top-actions .btn{display:inline-flex;align-items:center;gap:6px;}

@media print{.no-print{display:none!important;}body{background:#fff!important;}@page{size:A4 portrait;margin:15mm;}}
@media(max-width:700px){.cursos-dashboard{grid-template-columns:1fr;}.detail-top{flex-direction:column;align-items:stretch;}.detail-stats{justify-content:center;}.aluno-form-row{flex-direction:column;}.aluno-input.phone{max-width:100%;}.top-actions{flex-direction:column;}.top-actions .btn{width:100%;}}
`;

/* ────────── Page ────────── */
export default function CursosPage() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<"dashboard" | "detail">("dashboard");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  /* modal curso */
  const [showCursoModal, setShowCursoModal] = useState(false);
  const [editingCurso, setEditingCurso] = useState<Curso | null>(null);
  const [formNome, setFormNome] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formCarga, setFormCarga] = useState("");
  const [formVagas, setFormVagas] = useState("20");
  const [formPreco, setFormPreco] = useState("R$ 150,00");

  /* modal aluno */
  const [showAlunoModal, setShowAlunoModal] = useState(false);
  const [editingAluno, setEditingAluno] = useState<Aluno | null>(null);
  const [aNome, setANome] = useState("");
  const [aTel, setATel] = useState("");

  useEffect(() => {
    setCursos(loadCursos());
    setMounted(true);
  }, []);

  const persist = useCallback((c: Curso[]) => {
    setCursos(c);
    saveCursos(c);
  }, []);

  const selected = cursos.find((c) => c.id === selectedId) || null;

  /* ── Curso CRUD ── */
  const openNewCurso = () => {
    setEditingCurso(null);
    setFormNome("");
    setFormDesc("");
    setFormCarga("");
    setFormVagas("20");
    setFormPreco("R$ 150,00");
    setShowCursoModal(true);
  };
  const openEditCurso = (c: Curso) => {
    setEditingCurso(c);
    setFormNome(c.nome);
    setFormDesc(c.descricao);
    setFormCarga(c.carga);
    setFormVagas(String(c.vagas));
    setFormPreco(c.preco || "");
    setShowCursoModal(true);
  };
  const saveCurso = () => {
    if (!formNome.trim()) return;
    if (editingCurso) {
      persist(cursos.map((c) => c.id === editingCurso.id ? { ...c, nome: formNome.trim(), descricao: formDesc.trim(), carga: formCarga.trim(), vagas: Number(formVagas) || c.vagas, preco: formPreco.trim() } : c));
    } else {
      const nc: Curso = { id: uid(), nome: formNome.trim(), descricao: formDesc.trim(), carga: formCarga.trim(), vagas: Number(formVagas) || 20, preco: formPreco.trim(), alunos: [] };
      persist([...cursos, nc]);
    }
    setShowCursoModal(false);
  };
  const deleteCurso = (id: string) => {
    if (!confirm("Excluir este curso e todos os alunos?")) return;
    persist(cursos.filter((c) => c.id !== id));
    if (selectedId === id) { setView("dashboard"); setSelectedId(null); }
  };

  /* ── Aluno CRUD ── */
  const openNewAluno = () => {
    setEditingAluno(null);
    setANome("");
    setATel("");
    setShowAlunoModal(true);
  };
  const openEditAluno = (a: Aluno) => {
    setEditingAluno(a);
    setANome(a.nome);
    setATel(a.telefone);
    setShowAlunoModal(true);
  };
  const saveAluno = () => {
    if (!selected || !aNome.trim()) return;
    if (editingAluno) {
      const updated = selected.alunos.map((a) => a.id === editingAluno.id ? { ...a, nome: aNome.trim(), telefone: aTel.trim() } : a);
      persist(cursos.map((c) => c.id === selected.id ? { ...c, alunos: updated } : c));
    } else {
      if (selected.alunos.length >= selected.vagas) return;
      const na: Aluno = { id: uid(), nome: aNome.trim(), telefone: aTel.trim(), dataInscricao: today() };
      persist(cursos.map((c) => c.id === selected.id ? { ...c, alunos: [...c.alunos, na] } : c));
    }
    setShowAlunoModal(false);
  };
  const deleteAluno = (aid: string) => {
    if (!selected) return;
    persist(cursos.map((c) => c.id === selected.id ? { ...c, alunos: c.alunos.filter((a) => a.id !== aid) } : c));
  };

  /* ── PDF ── */
  const gerarPDF = (c: Curso) => {
    let rows = "";
    c.alunos.forEach((a, i) => {
      rows += '<tr><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;text-align:center;color:#64748b;font-size:11px;">' + (i + 1) + '</td><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;font-weight:600;color:#1a202c;font-size:12px;">' + a.nome + '</td><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:11px;">' + (a.telefone || "-") + '</td><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:11px;">' + a.dataInscricao + '</td></tr>';
    });
    const html = '<div id="pdf-content"><div style="text-align:center;margin-bottom:24px;"><div style="font-size:11px;color:#64748b;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:4px;">TULIPA VENDEDORAS</div><div style="font-size:22px;font-weight:900;color:#0d5e35;margin-bottom:2px;">' + c.nome + '</div><div style="font-size:12px;color:#64748b;">' + c.descricao + '</div></div><div style="display:flex;justify-content:space-between;margin-bottom:20px;font-size:11px;color:#64748b;"><span>Data: ' + today() + '</span><span>Carga: ' + c.carga + '</span><span>Vagas: ' + c.alunos.length + '/' + c.vagas + '</span></div><table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;"><thead><tr style="background:#0d5e35;color:#fff;"><th style="padding:10px 12px;text-align:center;font-size:11px;font-weight:700;width:40px;">N&#186;</th><th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;">NOME DO ALUNO</th><th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;width:140px;">TELEFONE</th><th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;width:100px;">INSCRICAO</th></tr></thead><tbody>' + rows + '</tbody></table><div style="margin-top:30px;text-align:center;font-size:10px;color:#94a3b8;"><p>Gerado em ' + today() + ' - Tulipa Vendedoras</p></div></div>';
    const fileName = "lista-" + c.nome.toLowerCase().replace(/\s+/g, "-") + ".pdf";
    const win = window.open("", "_blank");
    if (!win) return;
    const s1 = '<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"><\/script>';
    const s2 = '<script>document.body.innerHTML=\'' + html.replace(/'/g, "\\'") + '\';document.body.style.opacity="1";window.onload=function(){html2pdf().set({margin:[15,15,15,15],filename:"' + fileName + '",image:{type:"jpeg",quality:0.98},html2canvas:{scale:2,useCORS:true},jsPDF:{unit:"mm",format:"a4",orientation:"portrait"}}).from(document.getElementById("pdf-content")).save().then(function(){window.close();});};<\/script>';
    win.document.write("<html><head><title>Lista - " + c.nome + "</title></head><body>" + s1 + s2 + "</body></html>");
    win.document.close();
  };

  /* ── WhatsApp ── */
  const whatsAluno = (a: Aluno) => {
    const tel = a.telefone.replace(/\D/g, "");
    window.open("https://wa.me/55" + tel + "?text=" + encodeURIComponent("Olá " + a.nome + "! Aqui é da Tulipa Vendedoras."), "_blank");
  };
  const whatsCurso = (c: Curso) => {
    let texto = "*Lista de Alunos - " + c.nome + "*\n";
    texto += "Descricao: " + c.descricao + "\n";
    texto += "Carga: " + c.carga + " | Vagas: " + c.alunos.length + "/" + c.vagas + "\n\n";
    texto += "*Alunos:*\n";
    c.alunos.forEach((a, i) => { texto += (i + 1) + ". " + a.nome + (a.telefone ? " - " + a.telefone : "") + "\n"; });
    texto += "\nGerado em " + today() + " - Tulipa Vendedoras";
    window.open("https://wa.me/?text=" + encodeURIComponent(texto), "_blank");
  };

  if (!mounted) return null;

  /* ────────── RENDER ────────── */
  return (
    <div>
      {/* Header */}
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
        {view === "dashboard" && (
          <>
            <div className="top-actions">
              <button className="btn btn-primary" onClick={openNewCurso}>+ Novo Curso</button>
              <span style={{ color: "#64748b", fontSize: "0.9rem", alignSelf: "center" }}>
                {cursos.length} curso(s) cadastrado(s)
              </span>
            </div>

            {cursos.length === 0 ? (
              <div className="empty-state">
                <div className="icon">&#127891;</div>
                <p>Nenhum curso cadastrado ainda</p>
              </div>
            ) : (
              <div className="cursos-dashboard">
                {cursos.map((c) => {
                  const ocupadas = c.alunos.length;
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
                        <span>&#9202; {c.carga}</span>
                        <span>&#128101; {ocupadas}/{c.vagas} vagas</span>
                        {c.preco && <span style={{fontWeight:800,color:"#0d5e35",fontSize:"0.95rem"}}>{c.preco}</span>}
                      </div>
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
        )}

        {view === "detail" && selected && (
          <>
            <div className="detail-top">
              <button className="back" onClick={() => { setView("dashboard"); setSelectedId(null); }}>&#8592; Voltar</button>
              <div className="detail-info">
                <h2>{selected.nome}</h2>
                <p>{selected.descricao} | {selected.carga} {selected.preco && <span style={{fontWeight:800,color:"#0d5e35"}}> | {selected.preco}</span>}</p>
              </div>
              <div className="detail-stats">
                <div className="stat-box">
                  <div className="num">{selected.vagas}</div>
                  <div className="label">Vagas</div>
                </div>
                <div className="stat-box">
                  <div className="num">{selected.alunos.length}</div>
                  <div className="label">Preenchidas</div>
                </div>
                <div className="stat-box">
                  <div className="num" style={{ color: selected.alunos.length >= selected.vagas ? "#dc2626" : "#16a34a" }}>
                    {Math.max(0, selected.vagas - selected.alunos.length)}
                  </div>
                  <div className="label">Livres</div>
                </div>
              </div>
            </div>

            <div className="top-actions">
              <button className="btn btn-primary" onClick={openNewAluno} disabled={selected.alunos.length >= selected.vagas}>+ Novo Aluno</button>
              {selected.alunos.length > 0 && (
                <>
                  <button className="btn btn-primary" onClick={() => gerarPDF(selected)}>&#128196; Gerar PDF</button>
                  <button className="btn" style={{ background: "#25D366", color: "#fff" }} onClick={() => whatsCurso(selected)}>&#128241; WhatsApp</button>
                  <button className="btn btn-secondary" onClick={() => window.print()}>&#128424;&#65039; Imprimir</button>
                </>
              )}
              <button className="btn btn-secondary" onClick={() => openEditCurso(selected)}>&#9998;&#65039; Editar Curso</button>
            </div>

            <div className="aluno-form-card">
              <h3>{editingAluno ? "Editar Aluno" : "+ Adicionar Aluno"} {selected.alunos.length >= selected.vagas && !editingAluno ? "(Vagas esgotadas)" : ""}</h3>
              <div className="aluno-form-row">
                <input className="aluno-input" placeholder="Nome completo" value={aNome} onChange={(e) => setANome(e.target.value)} disabled={selected.alunos.length >= selected.vagas && !editingAluno} />
                <input className="aluno-input phone" placeholder="Telefone" value={aTel} onChange={(e) => setATel(e.target.value)} disabled={selected.alunos.length >= selected.vagas && !editingAluno} />
                {editingAluno ? (
                  <>
                    <button className="btn btn-primary" onClick={saveAluno}>Salvar</button>
                    <button className="btn btn-secondary" onClick={() => { setEditingAluno(null); setANome(""); setATel(""); }}>Cancelar</button>
                  </>
                ) : (
                  <button className="btn btn-primary" onClick={saveAluno} disabled={selected.alunos.length >= selected.vagas}>Adicionar</button>
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
                  <h3>Alunos inscritos ({selected.alunos.length}/{selected.vagas})</h3>
                </div>
                <table className="alunos-table">
                  <thead>
                    <tr>
                      <th style={{ width: 40 }}>N&#186;</th>
                      <th>Nome</th>
                      <th style={{ width: 150 }}>Telefone</th>
                      <th style={{ width: 110 }}>Inscricao</th>
                      <th style={{ width: 110 }}>Acoes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.alunos.map((a, i) => (
                      <tr key={a.id}>
                        <td style={{ textAlign: "center", color: "#94a3b8" }}>{i + 1}</td>
                        <td style={{ fontWeight: 600 }}>{a.nome}</td>
                        <td style={{ color: "#64748b" }}>{a.telefone || "-"}</td>
                        <td style={{ color: "#64748b", fontSize: "0.82rem" }}>{a.dataInscricao}</td>
                        <td>
                          <div style={{ display: "flex", gap: 4 }}>
                            <button className="action-btn edit" onClick={() => openEditAluno(a)} title="Editar">&#9998;&#65039;</button>
                            <button className="action-btn del" onClick={() => deleteAluno(a.id)} title="Excluir">&#128465;&#65039;</button>
                            {a.telefone && <button className="action-btn whats" onClick={() => whatsAluno(a)} title="WhatsApp">&#128172;</button>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal Curso */}
      {showCursoModal && (
        <div className="modal-overlay" onClick={() => setShowCursoModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCurso ? "Editar Curso" : "Novo Curso"}</h2>
              <button className="modal-close" onClick={() => setShowCursoModal(false)}>&#10005;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nome do curso</label>
                <input value={formNome} onChange={(e) => setFormNome(e.target.value)} placeholder="Ex: Limpeza Basica" />
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
                  <label>Valor</label>
                  <input value={formPreco} onChange={(e) => setFormPreco(e.target.value)} placeholder="Ex: R$ 150,00" />
                </div>
              </div>
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setShowCursoModal(false)}>Cancelar</button>
                <button className="btn btn-primary" onClick={saveCurso}>{editingCurso ? "Salvar" : "Criar Curso"}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Aluno */}
      {showAlunoModal && (
        <div className="modal-overlay" onClick={() => setShowAlunoModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingAluno ? "Editar Aluno" : "Novo Aluno"}</h2>
              <button className="modal-close" onClick={() => setShowAlunoModal(false)}>&#10005;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nome completo</label>
                <input value={aNome} onChange={(e) => setANome(e.target.value)} placeholder="Nome do aluno" />
              </div>
              <div className="form-group">
                <label>Telefone</label>
                <input value={aTel} onChange={(e) => setATel(e.target.value)} placeholder="(00) 00000-0000" />
              </div>
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setShowAlunoModal(false)}>Cancelar</button>
                <button className="btn btn-primary" onClick={saveAluno}>{editingAluno ? "Salvar" : "Adicionar"}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{pageCss}</style>
    </div>
  );
}
