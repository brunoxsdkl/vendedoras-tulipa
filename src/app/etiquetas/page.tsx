"use client"

import { useState } from "react"

const LABEL_W = 60
const LABEL_H = 25
const GAP = 2
const MARGIN = 10
const PAGE_W = 210
const PAGE_H = 297
const COLS = Math.floor((PAGE_W - 2 * MARGIN + GAP) / (LABEL_W + GAP))
const ROWS = Math.floor((PAGE_H - 2 * MARGIN + GAP) / (LABEL_H + GAP))
const PER_PAGE = COLS * ROWS

export default function EtiquetasPage() {
  const [texts, setTexts] = useState<string[]>([""])
  const [fontSize, setFontSize] = useState(11)
  const [fileName, setFileName] = useState("etiquetas")

  const addText = () => setTexts([...texts, ""])

  const updateText = (i: number, v: string) => {
    const next = [...texts]
    next[i] = v
    setTexts(next)
  }

  const removeText = (i: number) => {
    if (texts.length <= 1) return
    setTexts(texts.filter((_, idx) => idx !== i))
  }

  const clearAll = () => setTexts([""])

  const importBulk = () => {
    const input = prompt("Cole os textos separados por linha:")
    if (!input) return
    const lines = input.split("\n").map((l) => l.trim()).filter(Boolean)
    if (lines.length > 0) setTexts(lines)
  }

  const nonEmpty = texts.filter((t) => t.trim())

  const pages: string[][] = []
  for (let i = 0; i < nonEmpty.length; i += PER_PAGE) {
    pages.push(nonEmpty.slice(i, i + PER_PAGE))
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div>
      <div className="header no-print">
        <div className="container header-inner">
          <a href="/" className="back-btn" style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem" }}>
            ← Voltar
          </a>
          <img src="/logo.jpg" alt="Tulipa" className="header-logo" />
          <div className="header-text">
            <h1>Etiquetas 6×2,5cm</h1>
            <span>{nonEmpty.length} etiqueta{nonEmpty.length !== 1 ? "s" : ""} · {pages.length} página{pages.length !== 1 ? "s" : ""} A4</span>
          </div>
        </div>
      </div>

      <div className="container no-print">
        <div className="controls">
          <div className="control-group">
            <label>Tamanho da fonte</label>
            <div className="font-controls">
              <input
                type="range"
                min={6}
                max={28}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
              />
              <span className="font-value">{fontSize}pt</span>
            </div>
          </div>

          <div className="control-group">
            <label>Nome do arquivo</label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="text-input"
            />
          </div>

          <div className="control-actions">
            <button className="btn btn-primary" onClick={handlePrint} disabled={nonEmpty.length === 0}>
              🖨️ Imprimir / Salvar PDF
            </button>
            <button className="btn btn-secondary" onClick={importBulk}>
              📋 Importar em lote
            </button>
            <button className="btn btn-secondary" onClick={addText}>
              + Adicionar linha
            </button>
            <button className="btn btn-secondary" onClick={clearAll}>
              🗑️ Limpar
            </button>
          </div>
        </div>

        <div className="text-list">
          {texts.map((t, i) => (
            <div key={i} className="text-row">
              <span className="text-index">{i + 1}</span>
              <input
                type="text"
                value={t}
                onChange={(e) => updateText(i, e.target.value)}
                placeholder="Texto da etiqueta..."
                className="text-input"
              />
              <button
                className="btn-icon btn-icon-remove"
                onClick={() => removeText(i)}
                disabled={texts.length <= 1}
                title="Remover"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="print-area">
        {pages.length === 0 ? (
          <div className="empty-print no-print">
            <p>Adicione textos para visualizar as etiquetas</p>
          </div>
        ) : (
          pages.map((page, pIdx) => (
            <div key={pIdx} className="sheet">
              <div className="sheet-label no-print">
                Página {pIdx + 1} de {pages.length}
              </div>
              <div className="label-grid">
                {page.map((text, lIdx) => (
                  <div key={lIdx} className="label" style={{ fontSize: `${fontSize}pt` }}>
                    <span>{text}</span>
                  </div>
                ))}
                {Array.from({ length: PER_PAGE - page.length }).map((_, eIdx) => (
                  <div key={`e-${eIdx}`} className="label empty" />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        .controls {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 24px;
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .control-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .control-group label {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .font-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .font-controls input[type="range"] {
          flex: 1;
          accent-color: var(--green-700);
        }
        .font-value {
          font-size: 1rem;
          font-weight: 800;
          color: var(--green-700);
          min-width: 40px;
        }
        .control-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .text-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 24px;
        }
        .text-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .text-index {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--muted);
          min-width: 28px;
          text-align: right;
        }
        .text-input {
          flex: 1;
          padding: 10px 14px;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          font-family: Barlow, sans-serif;
          font-size: 0.95rem;
          background: var(--surface);
          color: var(--text);
          outline: none;
          transition: border-color 0.2s;
        }
        .text-input:focus {
          border-color: var(--green-600);
        }
        .btn-icon-remove {
          width: 34px;
          height: 34px;
          border: 1px solid transparent;
          border-radius: 8px;
          background: transparent;
          color: var(--muted);
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .btn-icon-remove:hover:not(:disabled) {
          background: #fee2e2;
          color: #dc2626;
          border-color: #fca5a5;
        }
        .btn-icon-remove:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .print-area {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          margin-bottom: 32px;
        }
        .empty-print {
          padding: 80px 32px;
          text-align: center;
          color: var(--muted);
        }
        .sheet {
          border-bottom: 1px solid var(--border);
          padding: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .sheet:last-child {
          border-bottom: none;
        }
        .sheet-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--muted);
          margin-bottom: 12px;
          text-align: center;
        }
        .label-grid {
          display: grid;
          grid-template-columns: repeat(${COLS}, ${LABEL_W}mm);
          grid-template-rows: repeat(${ROWS}, ${LABEL_H}mm);
          gap: ${GAP}mm;
          justify-content: center;
        }
        .label {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          border: 1px dashed #cbd5e1;
          border-radius: 4px;
          padding: 2px;
          font-weight: 700;
          font-family: Arial, Helvetica, sans-serif;
          color: #000;
          line-height: 1.2;
          overflow: hidden;
          word-break: break-word;
        }
        .label span {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .label.empty {
          border-color: transparent;
        }

        @media print {
          .no-print { display: none !important; }
          @page {
            size: A4 portrait;
            margin: ${MARGIN}mm;
          }
          body {
            margin: 0;
            padding: 0;
            background: #fff;
          }
          .print-area {
            border: none;
            border-radius: 0;
            box-shadow: none;
            margin: 0;
            padding: 0;
            background: none;
          }
          .sheet {
            border: none;
            padding: 0;
            page-break-after: always;
            break-after: page;
            display: block;
          }
          .sheet:last-child {
            page-break-after: avoid;
            break-after: avoid;
          }
          .label-grid {
            display: grid;
            grid-template-columns: repeat(${COLS}, ${LABEL_W}mm);
            grid-template-rows: repeat(${ROWS}, ${LABEL_H}mm);
            gap: ${GAP}mm;
          }
          .label {
            border: 1px solid #ccc;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            font-weight: 700;
            font-family: Arial, Helvetica, sans-serif;
            color: #000;
            line-height: 1.2;
            overflow: hidden;
            word-break: break-word;
          }
          .label.empty {
            border-color: transparent;
          }
        }
      `}</style>
    </div>
  )
}
