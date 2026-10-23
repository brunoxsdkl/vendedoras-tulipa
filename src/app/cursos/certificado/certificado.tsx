"use client";

import { useEffect, useState } from "react";
import styles from "./certificado.module.css";

type Aluno = { id: string; nome: string };
type Curso = {
  id: string;
  nome: string;
  horario?: string | null;
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
        setCargaHoraria(encontrado.horario?.trim() || "");
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
        {!pronto && <span>Preencha a carga horária e a data para imprimir.</span>}
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
          <div className={`${styles.text} ${styles.courseLabel}`}>No curso prático:</div>
          <div
            className={`${styles.text} ${styles.courseName}`}
            style={{ fontSize: tamanhoTexto(curso.nome, 17, 11, 46) }}
          >
            {curso.nome}
          </div>
          <div className={`${styles.text} ${styles.workload}`}>Carga horária: {cargaHoraria || "_______________"}</div>
          <div className={`${styles.text} ${styles.dateLabel}`}>Realizado na data de:</div>
          <div className={`${styles.text} ${styles.date}`}>{data ? dataBrasil(data) : "___/___/______"}</div>
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
