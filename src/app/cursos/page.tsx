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
  { id: "limpeza-basico", nome: "Limpeza Básica", descricao: "Produtos essenciais de limpeza", carga: "4h" },
  { id: "limpeza-avancado", nome: "Limpeza Avançada", descricao: "Fórmulas e técnicas avançadas", carga: "8h" },
  { id: "cosmeticos", nome: "Cosméticos", descricao: "Criação de produtos cosméticos", carga: "6h" },
  { id: "velas", nome: "Velas e Aromatização", descricao: "Produção de velas e essências", carga: "4h" },
  { id: "amaciante", nome: "Amaciante e Tecidos", descricao: "Amaciante e tratamento de roupas", carga: "4h" },
  { id: "personalizado", nome: "Curso Personalizado", descricao: "Conteúdo sob demanda", carga: "Personalizado" },
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
      linhasTabela += "
        <tr>
          <td style=\"padding:8px 12px;border-bottom:1px solid #e2e8f0;text-align:center;color:#64748b;font-size:11px;\">" + (i + 1) + "</td>
          <td style=\"padding:8px 12px;border-bottom:1px solid #e2e8f0;font-weight:600;color:#1a202c;font-size:12px;\">" + a.nome + "</td>
          <td style=\"padding:8px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:11px;\">" + (a.telefone || "-") + "</td>
        </tr>";
    });
    const htmlContent = "
      <html>
      <head>
        <style>
          @page { size: A4 portrait; margin: 15mm; }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, Helvetica, sans-serif; color: #1a202c; }
        </style>
      </head>
      <body>
        <div id=\\"pdf-content\\">
          <div style=\\"text-align:center;margin-bottom:24px;\\">
            <div style=\\"font-size:11px;color:#64748b;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:4px;\\">TULIPA VENDEDORAS</div>
            <div style=\\"font-size:22px;font-weight:900;color:#0d5e35;margin-bottom:2px;\\">" + cursoSelecionado.nome + "</div>
            <div style=\\"font-size:12px;color:#64748b;\\">" + cursoSelecionado.descricao + "</div>
          </div>
          <div style=\\"display:flex;justify-content:space-between;margin-bottom:20px;font-size:11px;color:#64748b;\\">
            <span>Data: " + dataAtual + "</span>
            <span>Carga: " + cursoSelecionado.carga + "</span>
            <span>Total: " + alunos.length + " aluno(s)</span>
          </div>
          <table style=\\"width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;\\">
            <thead>
              <tr style=\\"background:#0d5e35;color:#fff;\\">
                <th style=\\"padding:10px 12px;text-align:center;font-size:11px;font-weight:700;width:40px;\\">Nº</th>
                <th style=\\"padding:10px 12px;text-align:left;font-size:11px;font-weight:700;\\">NOME DO ALUNO</th>
                <th style=\\"padding:10px 12px;text-align:left;font-size:11px;font-weight:700;width:140px;\\">TELEFONE</th>
              </tr>
            </thead>
            <tbody>" + linhasTabela + "</tbody>
          </table>
          <div style=\\"margin-top:30px;text-align:center;font-size:10px;color:#94a3b8;\\">
            <p>Gerado em " + dataAtual + " — Tulipa Vendedoras</p>
          </div>
        </div>
      </body>
      </html>";
    const scriptTag = \"<script src=\\\"https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js\\\"><\\/script>\";
    const fullHtml = \"<html><head><title>Lista - " + cursoSelecionado.nome + "</title></head><body>\" + scriptTag + \"<script>document.body.innerHTML='" + htmlContent.replace(/'/g, "\\'") + "';document.body.style.opacity='1';window.onload=function(){html2pdf().set({margin:[15,15,15,15],filename:'lista-" + cursoSelecionado.id + "-" + dataAtual.replace(/\//g, "-") + ".pdf',image:{type:'jpeg',quality:0.98},html2canvas:{scale:2,useCORS:true},jsPDF:{unit:'mm',format:'a4',orientation:'portrait'}}).from(document.getElementById('pdf-content')).save().then(function(){window.close();});};<\\/script></body></html>\";
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(fullHtml);
    win.document.close();
  };

  const compartilharWhatsApp = () => {
    if (!cursoSelecionado || alunos.length === 0) return;
    let texto = "*Lista de Alunos - " + cursoSelecionado.nome + "*\n";
    texto += "Descrição: " + cursoSelecionado.descricao + "\n";
    texto += "Carga horária: " + cursoSelecionado.carga + "\n";
    texto += "Total: " + alunos.length + " aluno(s)\n\n";
    texto += "*Alunos:*\n";
    alunos.forEach((a, i) => {
      texto += (i + 1) + ". " + a.nome + (a.telefone ? " — " + a.telefone : "") + "\n";
    });
    texto += "\nGerado em " + new Date().toLocaleDateString("pt-BR") + " — Tulipa Vendedoras";
    window.open("https://wa.me/?text=" + encodeURIComponent(texto), "_blank");
  };

  return (
    <div>
      <div className="header no-print">
        <div className="container header-inner">
          <a href="/" className="back-btn">← Voltar</a>
          <img src="/logo.jpg" alt="Tulipa" className="header-logo" />
          <div className="header-text">
            <h1>🎓 Cursos</h1>
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
              <button className="btn btn-secondary" onClick={() => setCursoSelecionado(null)}>← Trocar Curso</button>
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
    </div>
  );
}
