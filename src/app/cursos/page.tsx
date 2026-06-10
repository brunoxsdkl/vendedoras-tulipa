"use client";

import { useState } from "react";

type Aluno = {
  nome: string;
  telefone: string;
};

type Curso = {
  id: string;
  nome: string;
  descricao: string;
  carga: string;
};

const cursos: Curso[] = [
  { id: "limpeza-basico", nome: "Limpeza Basica", descricao: "Produtos essenciais de limpeza", carga: "4h" },
  { id: "limpeza-avancado", nome: "Limpeza Avancada", descricao: "Formulas e tecnicas avancadas", carga: "8h" },
  { id: "cosmeticos", nome: "Cosmeticos", descricao: "Criacao de produtos cosmeticos", carga: "6h" },
  { id: "velas", nome: "Velas e Aromatizacao", descricao: "Producao de velas e essencias", carga: "4h" },
  { id: "amaciante", nome: "Amaciante e Tecidos", descricao: "Amaciante e tratamento de roupas", carga: "4h" },
  { id: "personalizado", nome: "Curso Personalizado", descricao: "Conteudo sob demanda", carga: "Personalizado" },
];

export default function CursosPage() {
  const [cursoSelecionado, setCursoSelecionado] = useState<Curso | null>(null);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [editandoIdx, setEditandoIdx] = useState<number | null>(null);
  const [editNome, setEditNome] = useState("");
  const [editTelefone, setEditTelefone] = useState("");

  const adicionarAluno = () => {
    if (!nome.trim()) return;
    setAlunos([...alunos, { nome: nome.trim(), telefone: telefone.trim() }]);
    setNome("");
    setTelefone("");
  };

  const removerAluno = (idx: number) => {
    setAlunos(alunos.filter((_, i) => i !== idx));
  };

  const iniciarEdicao = (idx: number) => {
    setEditandoIdx(idx);
    setEditNome(alunos[idx].nome);
    setEditTelefone(alunos[idx].telefone);
  };

  const salvarEdicao = () => {
    if (editandoIdx === null) return;
    const copia = [...alunos];
    copia[editandoIdx] = { nome: editNome.trim(), telefone: editTelefone.trim() };
    setAlunos(copia);
    setEditandoIdx(null);
  };

  const gerarPDF = () => {
    if (!cursoSelecionado || alunos.length === 0) return;
    const dataAtual = new Date().toLocaleDateString("pt-BR");
    let linhasTabela = "";
    alunos.forEach((a, i) => {
      linhasTabela += '<tr><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;text-align:center;color:#64748b;font-size:11px;">' + (i + 1) + '</td><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;font-weight:600;color:#1a202c;font-size:12px;">' + a.nome + '</td><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:11px;">' + (a.telefone || "-") + '</td></tr>';
    });
    const htmlContent = '<html><head><style>@page{size:A4 portrait;margin:15mm;}*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;color:#1a202c;}</style></head><body><div id="pdf-content"><div style="text-align:center;margin-bottom:24px;"><div style="font-size:11px;color:#64748b;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:4px;">TULIPA VENDEDORAS</div><div style="font-size:22px;font-weight:900;color:#0d5e35;margin-bottom:2px;">' + cursoSelecionado.nome + '</div><div style="font-size:12px;color:#64748b;">' + cursoSelecionado.descricao + '</div></div><div style="display:flex;justify-content:space-between;margin-bottom:20px;font-size:11px;color:#64748b;"><span>Data: ' + dataAtual + '</span><span>Carga: ' + cursoSelecionado.carga + '</span><span>Total: ' + alunos.length + ' aluno(s)</span></div><table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;"><thead><tr style="background:#0d5e35;color:#fff;"><th style="padding:10px 12px;text-align:center;font-size:11px;font-weight:700;width:40px;">No</th><th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;">NOME DO ALUNO</th><th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;width:140px;">TELEFONE</th></tr></thead><tbody>' + linhasTabela + '</tbody></table><div style="margin-top:30px;text-align:center;font-size:10px;color:#94a3b8;"><p>Gerado em ' + dataAtual + ' - Tulipa Vendedoras</p></div></div></body></html>';
    const scriptContent = '<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"><\/script>';
    const fullHtml = '<html><head><title>Lista - ' + cursoSelecionado.nome + '</title></head><body>' + scriptContent + '<script>document.body.innerHTML=\'' + htmlContent.replace(/'/g, "\\'").replace(/\n/g, "") + '\';document.body.style.opacity="1";window.onload=function(){html2pdf().set({margin:[15,15,15,15],filename:"lista-' + cursoSelecionado.id + '-' + dataAtual.replace(/\//g, "-") + '.pdf",image:{type:"jpeg",quality:0.98},html2canvas:{scale:2,useCORS:true},jsPDF:{unit:"mm",format:"a4",orientation:"portrait"}}).from(document.getElementById("pdf-content")).save().then(function(){window.close();});};<\/script></body></html>';
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(fullHtml);
    win.document.close();
  };

  const compartilharWhatsApp = () => {
    if (!cursoSelecionado || alunos.length === 0) return;
    let texto = "*Lista de Alunos - " + cursoSelecionado.nome + "*\n";
    texto += "Descricao: " + cursoSelecionado.descricao + "\n";
    texto += "Carga horaria: " + cursoSelecionado.carga + "\n";
    texto += "Total: " + alunos.length + " aluno(s)\n\n";
    texto += "*Alunos:*\n";
    alunos.forEach((a, i) => {
      texto += (i + 1) + ". " + a.nome + (a.telefone ? " - " + a.telefone : "") + "\n";
    });
    texto += "\nGerado em " + new Date().toLocaleDateString("pt-BR") + " - Tulipa Vendedoras";
    window.open("https://wa.me/?text=" + encodeURIComponent(texto), "_blank");
  };

  return (
    <div>
      <div className="header no-print">
        <div className="container header-inner">
          <a href="/" className="back-btn">&larr; Voltar</a>
          <img src="/logo.jpg" alt="Tulipa" className="header-logo" />
          <div className="header-text">
            <h1>Cursos</h1>
            <p>Gerencie listas de alunos e gere PDFs</p>
          </div>
        </div>
      </div>
      <main className="container">
        {!cursoSelecionado ? (
          <div>
            <h2 className="page-title">Selecione o Curso</h2>
            <p className="page-subtitle">Escolha o curso para gerenciar a lista de alunos</p>
            <div className="cursos-grid">
              {cursos.map((curso) => (
                <button key={curso.id} type="button" className="curso-card" onClick={() => setCursoSelecionado(curso)}>
                  <div className="curso-icon">🎓</div>
                  <h3>{curso.nome}</h3>
                  <p>{curso.descricao}</p>
                  <span className="curso-carga">{curso.carga}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="curso-header-bar">
              <button className="btn btn-secondary" onClick={() => setCursoSelecionado(null)}>&larr; Trocar Curso</button>
              <div>
                <h2 className="page-title" style={{marginBottom:0}}>{cursoSelecionado.nome}</h2>
                <p style={{color:"#64748b",fontSize:"0.9rem"}}>{cursoSelecionado.descricao} · {cursoSelecionado.carga}</p>
              </div>
              <div className="curso-actions">
                {alunos.length > 0 && (
                  <>
                    <button className="btn btn-primary" onClick={gerarPDF}>📄 Gerar PDF</button>
                    <button className="btn" style={{background:"#25D366",color:"#fff"}} onClick={compartilharWhatsApp}>📱 WhatsApp</button>
                    <button className="btn btn-secondary" onClick={() => window.print()}>🖨️ Imprimir</button>
                  </>
                )}
              </div>
            </div>
            <div className="curso-form-card">
              <h3 style={{fontSize:"1rem",fontWeight:700,color:"#0d5e35",marginBottom:16}}>
                {editandoIdx !== null ? "✏️ Editar Aluno" : "➕ Adicionar Aluno"}
              </h3>
              <div className="curso-form-row">
                <input value={editandoIdx !== null ? editNome : nome} onChange={(e) => editandoIdx !== null ? setEditNome(e.target.value) : setNome(e.target.value)} placeholder="Nome do aluno" className="curso-input" />
                <input value={editandoIdx !== null ? editTelefone : telefone} onChange={(e) => editandoIdx !== null ? setEditTelefone(e.target.value) : setTelefone(e.target.value)} placeholder="Telefone (opcional)" className="curso-input curso-input-phone" />
                {editandoIdx !== null ? (
                  <>
                    <button className="btn btn-primary" onClick={salvarEdicao}>Salvar</button>
                    <button className="btn btn-secondary" onClick={() => setEditandoIdx(null)}>Cancelar</button>
                  </>
                ) : (
                  <button className="btn btn-primary" onClick={adicionarAluno}>Adicionar</button>
                )}
              </div>
            </div>
            {alunos.length === 0 ? (
              <div className="curso-empty">
                <span style={{fontSize:48,opacity:0.2}}>📋</span>
                <p>Nenhum aluno adicionado ainda</p>
              </div>
            ) : (
              <div className="curso-table-card">
                <div className="curso-table-header">
                  <span>📋 Lista de Alunos ({alunos.length})</span>
                </div>
                <table className="curso-table">
                  <thead>
                    <tr>
                      <th style={{width:50}}>Nº</th>
                      <th>Nome</th>
                      <th style={{width:160}}>Telefone</th>
                      <th style={{width:100}}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alunos.map((aluno, idx) => (
                      <tr key={idx}>
                        <td style={{textAlign:"center",color:"#94a3b8"}}>{idx + 1}</td>
                        <td style={{fontWeight:600}}>{aluno.nome}</td>
                        <td style={{color:"#64748b"}}>{aluno.telefone || "-"}</td>
                        <td>
                          <div style={{display:"flex",gap:6}}>
                            <button className="curso-action-btn edit" onClick={() => iniciarEdicao(idx)}>✏️</button>
                            <button className="curso-action-btn delete" onClick={() => removerAluno(idx)}>🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
      <style>{
        .cursos-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;}
        .curso-card{background:#fff;border:2px solid #e2e8f0;border-radius:20px;padding:24px;text-align:left;cursor:pointer;transition:all 0.2s;display:flex;flex-direction:column;gap:8px;font-family:Barlow,sans-serif;}
        .curso-card:hover{border-color:#15814a;transform:translateY(-3px);box-shadow:0 8px 24px rgba(13,94,53,0.1);}
        .curso-icon{font-size:2rem;margin-bottom:4px;}
        .curso-card h3{font-size:1.1rem;color:#0d5e35;font-weight:800;}
        .curso-card p{font-size:0.88rem;color:#64748b;}
        .curso-carga{display:inline-block;margin-top:4px;padding:4px 10px;border-radius:20px;background:#e8f5ee;color:#0d5e35;font-size:0.78rem;font-weight:700;width:fit-content;}
        .curso-header-bar{display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-bottom:24px;padding:16px 0;}
        .curso-actions{display:flex;gap:8px;margin-left:auto;}
        .curso-form-card{background:#fff;border-radius:20px;padding:24px;margin-bottom:20px;box-shadow:0 1px 3px rgba(0,0,0,0.06);border:1px solid #e2e8f0;}
        .curso-form-row{display:flex;gap:10px;flex-wrap:wrap;}
        .curso-input{flex:1;min-width:200px;padding:12px 16px;border:2px solid #e2e8f0;border-radius:12px;font-size:0.95rem;font-family:Barlow,sans-serif;transition:all 0.2s;}
        .curso-input:focus{outline:none;border-color:#15814a;box-shadow:0 0 0 3px rgba(21,129,74,0.1);}
        .curso-input-phone{max-width:200px;}
        .curso-empty{background:#fff;border-radius:20px;padding:60px;text-align:center;color:#94a3b8;box-shadow:0 1px 3px rgba(0,0,0,0.06);}
        .curso-empty p{margin-top:12px;}
        .curso-table-card{background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);border:1px solid #e2e8f0;}
        .curso-table-header{padding:16px 24px;background:#f8fafc;border-bottom:1px solid #e2e8f0;font-weight:700;color:#0d5e35;font-size:0.95rem;}
        .curso-table{width:100%;border-collapse:collapse;}
        .curso-table th{padding:12px 24px;text-align:left;font-size:0.78rem;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;background:#f8fafc;border-bottom:1px solid #e2e8f0;}
        .curso-table td{padding:12px 24px;border-bottom:1px solid #f1f5f9;font-size:0.9rem;}
        .curso-table tr:last-child td{border-bottom:none;}
        .curso-table tr:hover td{background:#f8fafc;}
        .curso-action-btn{width:32px;height:32px;border-radius:8px;border:none;cursor:pointer;font-size:0.85rem;display:inline-flex;align-items:center;justify-content:center;transition:all 0.15s;}
        .curso-action-btn.edit{background:#e8f5ee;color:#0d5e35;}
        .curso-action-btn.edit:hover{background:#d0f0dd;}
        .curso-action-btn.delete{background:#fee2e2;color:#dc2626;}
        .curso-action-btn.delete:hover{background:#fecaca;}
        @media print{.no-print{display:none!important;}body{background:#fff!important;}@page{size:A4 portrait;margin:15mm;}}
        @media(max-width:700px){.curso-header-bar{flex-direction:column;align-items:stretch;}.curso-actions{margin-left:0;flex-wrap:wrap;}.curso-form-row{flex-direction:column;}.curso-input-phone{max-width:100%;}}
      }</style>
    </div>
  );
}
