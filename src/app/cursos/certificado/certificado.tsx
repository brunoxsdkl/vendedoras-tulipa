"use client";

import { useEffect, useState } from "react";
import styles from "./certificado.module.css";

type Aluno = { id: string; nome: string };
type Curso = {
  id: string;
  nome: string;
  horario?: string | null;
  horario_inicio?: string | null;
  horario_termino?: string | null;
  data?: string | null;
  alunos: Aluno[];
};

function dataBrasil(data: string) {
  const partes = data.split("-");
  return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : data;
}

function tamanhoTexto(texto: string, padrao: number, minimo: number, limite: number) {
  return `${Math.max(minimo, Math.min(padrao, (padrao * limite) / Math.max(texto.length, 1)))}pt`;
}

function cargaHorariaDoCurso(curso: Curso) {
  if (curso.horario?.trim()) return curso.horario.trim();

  const inicio = /^(\d{1,2}):(\d{2})$/.exec(curso.horario_inicio || "");
  const termino = /^(\d{1,2}):(\d{2})$/.exec(curso.horario_termino || "");
  if (!inicio || !termino) return "";

  const minutos = Number(termino[1]) * 60 + Number(termino[2])
    - Number(inicio[1]) * 60 - Number(inicio[2]);
  if (minutos <= 0 || minutos > 24 * 60) return "";

  const horas = Math.floor(minutos / 60);
  const restantes = minutos % 60;
  return restantes ? `${horas}h${String(restantes).padStart(2, "0")}` : `${horas} hora${horas === 1 ? "" : "s"}`;
}

export default function Certificado({ cursoId, alunoId }: { cursoId: string; alunoId: string }) {
  const [curso, setCurso] = useState<Curso | null>(null);
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [cargaHoraria, setCargaHoraria] = useState("");
  const [data, setData] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!cursoId || !alunoId) {
      setErro("Curso ou aluno não informado.");
      return;
    }

    const controller = new AbortController();
    fetch("/api/cursos", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Não foi possível carregar o curso.");
        return (await response.json()) as Curso[];
      })
      .then((cursos) => {
        const encontrado = cursos.find((item) => item.id === cursoId);
        const participante = encontrado?.alunos?.find((item) => item.id === alunoId);
        if (!encontrado || !participante) throw new Error("Curso ou aluno não encontrado.");
        setCurso(encontrado);
        setAluno(participante);
        setCargaHoraria(cargaHorariaDoCurso(encontrado));
        setData(encontrado.data?.slice(0, 10) || "");
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setErro(error instanceof Error ? error.message : "Erro ao carregar certificado.");
      });
    return () => controller.abort();
  }, [cursoId, alunoId]);

  const imprimir = async () => {
    await document.fonts.ready;
    await Promise.all(
      Array.from(document.images).map((img) =>
        img.complete ? Promise.resolve() : new Promise<void>((resolve) => {
          img.addEventListener("load", () => resolve(), { once: true });
          img.addEventListener("error", () => resolve(), { once: true });
        }),
      ),
    );
    window.print();
  };

  if (erro) return <main className={styles.message}>{erro}</main>;
  if (!curso || !aluno) return <main className={styles.message}>Preparando certificado...</main>;

  const pronto = Boolean(cargaHoraria.trim() && data);
  const cursoDescricao = `No curso prático “${curso.nome}”`;

  return (
    <main className={styles.page}>
      <div className={styles.toolbar}>
        <a href="/cursos">← Voltar aos cursos</a>
        <label>
          Carga horária
          <input
            value={cargaHoraria}
            onChange={(event) => setCargaHoraria(event.target.value)}
            placeholder="Ex.: 04 horas"
            aria-label="Carga horária do curso"
          />
        </label>
        <label>
          Data de realização
          <input
            type="date"
            value={data}
            onChange={(event) => setData(event.target.value)}
            aria-label="Data de realização do curso"
          />
        </label>
        <button type="button" onClick={imprimir} disabled={!pronto}>
          Imprimir / salvar PDF
        </button>
        {!pronto && <span>Preencha {(!cargaHoraria.trim() && !data) ? "a carga horária e a data" : !cargaHoraria.trim() ? "a carga horária" : "a data"} para imprimir.</span>}
      </div>

      <div className={styles.preview}>
        <article className={styles.sheet} aria-label={`Certificado de ${aluno.nome}`}>
          {/* A arte e a assinatura vêm dos arquivos fornecidos pela usuária. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.background} src="/certificado/fundo.webp" alt="" />
          <div className={`${styles.text} ${styles.title}`}>CERTIFICADO</div>
          <div className={`${styles.text} ${styles.intro}`}>Certificamos a participação de:</div>
          <div
            className={`${styles.text} ${styles.participant}`}
            style={{ fontSize: tamanhoTexto(aluno.nome, 18, 12, 30) }}
          >
            {aluno.nome}
          </div>
          <div
            className={`${styles.text} ${styles.courseDescription}`}
            style={{ fontSize: tamanhoTexto(cursoDescricao, 17, 12, 56) }}
          >
            {cursoDescricao}
          </div>
          <div
            className={`${styles.text} ${styles.workload}`}
            style={{ fontSize: tamanhoTexto(`Carga horária: ${cargaHoraria}`, 16, 11, 25) }}
          >Carga horária: {cargaHoraria}</div>
          <div className={`${styles.text} ${styles.dateLabel}`}>Realizado na data de:</div>
          <div className={`${styles.text} ${styles.date}`}>{data ? dataBrasil(data) : ""}</div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.signature} src="/certificado/assinatura.webp" alt="Assinatura de Andréia Freitas" />
          <div className={`${styles.text} ${styles.instructor}`}>INSTRUTORA: ANDRÉIA FREITAS</div>
          <div className={`${styles.text} ${styles.registration}`}>CRQ: 09.403.803 – 9ª REGIÃO &nbsp;&nbsp; CRTH-BR: 10617</div>
          <div className={`${styles.text} ${styles.profession}`}>QUÍMICA E AROMATERAPEUTA</div>
        </article>
      </div>
    </main>
  );
}
