"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type Catalogo = {
  id: string;
  nome: string;
  descricao: string;
  pdf: string;
};

const catalogos: Catalogo[] = [
  {
    id: "oleos-odorizantes",
    nome: "Óleos Odorizantes",
    descricao: "Catálogo de fragrâncias para odorizantes e perfumaria",
    pdf: "/catalogos/oleos-odorizantes.pdf",
  },
];

export default function CatalogosPage() {
  const [selected, setSelected] = useState<Catalogo>(catalogos[0]);
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pdfRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setPageNum(1);
    setTotalPages(0);

    async function load() {
      if (typeof window === "undefined") return;
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
      const doc = await pdfjsLib.getDocument(selected.pdf).promise;
      if (cancelled) return;
      pdfRef.current = doc;
      setTotalPages(doc.numPages);
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [selected]);

  const renderPage = useCallback(async (num: number) => {
    const pdf = pdfRef.current;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!pdf || !canvas || !container) return;

    const page = await pdf.getPage(num);
    const containerW = container.clientWidth - 48;
    const containerH = container.clientHeight - 48;
    const vp = page.getViewport({ scale: 1 });
    const s = Math.min(containerW / vp.width, containerH / vp.height, 1.8);
    const scaled = page.getViewport({ scale: s });

    canvas.width = scaled.width;
    canvas.height = scaled.height;
    setScale(s);

    const ctx = canvas.getContext("2d");
    await page.render({ canvasContext: ctx, viewport: scaled }).promise;
  }, []);

  useEffect(() => {
    if (!loading && pdfRef.current) renderPage(pageNum);
  }, [pageNum, loading, renderPage]);

  useEffect(() => {
    const onResize = () => { if (pdfRef.current) renderPage(pageNum); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [pageNum, renderPage]);

  const prev = () => setPageNum((p) => Math.max(1, p - 1));
  const next = () => setPageNum((p) => Math.min(totalPages, p + 1));

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") prev();
    else if (e.key === "ArrowRight") next();
  }, []); // eslint-disable-line

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div className="header no-print" style={{ flexShrink: 0 }}>
        <div className="container header-inner">
          <a href="/" className="back-btn">← Voltar</a>
          <img src="/logo.jpg" alt="Tulipa" className="header-logo" />
          <div className="header-text">
            <h1>📖 Catálogos</h1>
            <p>Navegue pelos catálogos de produtos</p>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 12, gap: 12, minHeight: 0 }}>
        {catalogos.length > 1 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {catalogos.map((c) => (
              <button key={c.id}
                onClick={() => setSelected(c)}
                style={{
                  padding: "10px 20px", borderRadius: 12, border: selected.id === c.id ? "2px solid #15814a" : "2px solid #e2e8f0",
                  background: selected.id === c.id ? "#f0f7f3" : "#fff", cursor: "pointer", fontWeight: selected.id === c.id ? 700 : 500,
                  color: "#2d3748", fontSize: "0.9rem", fontFamily: "Barlow, sans-serif",
                }}
              >{c.nome}</button>
            ))}
          </div>
        )}

        <div ref={containerRef}
          style={{
            flex: 1, background: "#fff", borderRadius: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", minHeight: 0, overflow: "hidden",
          }}
        >
          {loading && (
            <div style={{ textAlign: "center", color: "#94a3b8" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📄</div>
              <p>Carregando catálogo...</p>
            </div>
          )}

          <canvas ref={canvasRef}
            style={{
              display: loading ? "none" : "block",
              maxWidth: "100%", maxHeight: "100%",
              boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
              borderRadius: 4,
            }}
          />

          {!loading && totalPages > 1 && (
            <>
              <button onClick={prev} disabled={pageNum <= 1}
                style={{
                  position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                  width: 48, height: 48, borderRadius: "50%", border: "none",
                  background: pageNum <= 1 ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.9)",
                  color: pageNum <= 1 ? "#bbb" : "#0d5e35",
                  fontSize: 24, cursor: pageNum <= 1 ? "default" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)", transition: "all 0.15s",
                  opacity: pageNum <= 1 ? 0.4 : 1, zIndex: 10,
                }}
              >‹</button>
              <button onClick={next} disabled={pageNum >= totalPages}
                style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  width: 48, height: 48, borderRadius: "50%", border: "none",
                  background: pageNum >= totalPages ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.9)",
                  color: pageNum >= totalPages ? "#bbb" : "#0d5e35",
                  fontSize: 24, cursor: pageNum >= totalPages ? "default" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)", transition: "all 0.15s",
                  opacity: pageNum >= totalPages ? 0.4 : 1, zIndex: 10,
                }}
              >›</button>
            </>
          )}
        </div>

        {!loading && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, padding: "4px 0", flexShrink: 0 }}>
            <button onClick={prev} disabled={pageNum <= 1}
              style={{ padding: "8px 16px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", cursor: pageNum <= 1 ? "default" : "pointer", fontWeight: 600, color: pageNum <= 1 ? "#cbd5e1" : "#0d5e35", fontFamily: "Barlow, sans-serif", opacity: pageNum <= 1 ? 0.5 : 1 }}
            >← Anterior</button>
            <span style={{ fontWeight: 700, color: "#2d3748", fontSize: "0.9rem", minWidth: 120, textAlign: "center" }}>
              Página {pageNum} de {totalPages}
            </span>
            <button onClick={next} disabled={pageNum >= totalPages}
              style={{ padding: "8px 16px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", cursor: pageNum >= totalPages ? "default" : "pointer", fontWeight: 600, color: pageNum >= totalPages ? "#cbd5e1" : "#0d5e35", fontFamily: "Barlow, sans-serif", opacity: pageNum >= totalPages ? 0.5 : 1 }}
            >Próxima →</button>
          </div>
        )}
      </div>
    </div>
  );
}
