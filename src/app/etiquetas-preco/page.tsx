"use client"

import { useState, useRef } from "react"
import Script from "next/script"

const LABEL_W_MM = 50
const LABEL_H_MM = 20
const GAP_MM = 2
const MARGIN_MM = 10
const COLS = 3
const ROWS = 8

interface Product {
  produto: string
  preco: string
}

function wrapText(
  text: string,
  size: number,
  maxWidth: number,
  doc: any
): [string, string] {
  const words = text.split(" ")
  if (words.length === 1) {
    return doc.getTextWidth(text) <= maxWidth ? [text, ""] : [text.slice(0, -1), ""]
  }
  let line1 = ""
  let rest: string[] = []
  for (let i = 0; i < words.length; i++) {
    const test = (line1 + " " + words[i]).trim()
    if (doc.getTextWidth(test) <= maxWidth) {
      line1 = test
    } else {
      rest = words.slice(i)
      break
    }
  }
  if (!line1) {
    line1 = words[0]
    rest = words.slice(1)
  }
  return [line1, rest.join(" ")]
}

function drawLabels(products: Product[], doc: any) {
  const lw = LABEL_W_MM
  const lh = LABEL_H_MM

  for (let i = 0; i < products.length; i++) {
    const col = i % COLS
    const row = Math.floor(i / COLS) % ROWS
    if (i > 0 && col === 0 && row === 0) doc.addPage()

    const x = MARGIN_MM + col * (lw + GAP_MM)
    const y = MARGIN_MM + ROWS * (lh + GAP_MM) - row * (lh + GAP_MM) - lh

    doc.setFillColor(0, 107, 63)
    doc.rect(x, y, lw, lh, "F")

    const pw = products[i].produto.toUpperCase()
    const pr = products[i].preco

    doc.setTextColor(255, 255, 255)
    const aw = lw * 0.92

    for (let fs = 9; fs >= 6; fs--) {
      doc.setFont("Helvetica", "bold")
      doc.setFontSize(fs)
      const [l1, l2] = wrapText(pw, fs, aw, doc)
      const line2W = l2 ? doc.getTextWidth(l2) : 0
      if (!l2 || line2W <= aw) {
        if (l2) {
          const l1W = doc.getTextWidth(l1)
          doc.text(l1, x + (lw - l1W) / 2, y + lh * 0.75)
          doc.text(l2, x + (lw - line2W) / 2, y + lh * 0.55)
        } else {
          const l1W = doc.getTextWidth(l1)
          doc.text(l1, x + (lw - l1W) / 2, y + lh * 0.65)
        }
        break
      }
    }

    doc.setFont("Helvetica", "bold")
    doc.setFontSize(14)
    const priceText = "R$ " + pr
    const priceW = doc.getTextWidth(priceText)
    doc.text(priceText, x + (lw - priceW) / 2, y + lh * 0.25)
  }
}

export default function EtiquetasPrecoPage() {
  const [products, setProducts] = useState<Product[]>([{ produto: "", preco: "" }])
  const [importOpen, setImportOpen] = useState(false)
  const [importText, setImportText] = useState("")
  const [fileName, setFileName] = useState("etiquetas-preco")
  const modalRef = useRef<HTMLDivElement>(null)

  const addProduct = () =>
    setProducts([...products, { produto: "", preco: "" }])

  const updateProduct = (i: number, field: keyof Product, value: string) => {
    const next = [...products]
    next[i] = { ...next[i], [field]: value }
    setProducts(next)
  }

  const removeProduct = (i: number) => {
    if (products.length <= 1) return
    setProducts(products.filter((_, idx) => idx !== i))
  }

  const clearAll = () => setProducts([{ produto: "", preco: "" }])

  const handleImport = () => {
    if (!importText.trim()) return
    const lines = importText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
    const parsed: Product[] = []

    for (const line of lines) {
      try {
        const obj = JSON.parse(line)
        if (obj.produto && obj.preco) {
          parsed.push({ produto: String(obj.produto), preco: String(obj.preco) })
          continue
        }
      } catch {}
      const parts = line.split("\t")
      if (parts.length >= 2) {
        parsed.push({ produto: parts[0].trim(), preco: parts[1].trim() })
      } else {
        const cParts = line.split(",")
        if (cParts.length >= 2) {
          parsed.push({
            produto: cParts.slice(0, -1).join(",").trim(),
            preco: cParts[cParts.length - 1].trim(),
          })
        }
      }
    }

    if (parsed.length > 0) {
      setProducts(parsed)
      setImportOpen(false)
      setImportText("")
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      try {
        const data = JSON.parse(text)
        if (Array.isArray(data)) {
          const valid = data.filter(
            (item: any) => item.produto && item.preco
          )
          if (valid.length > 0) {
            setProducts(
              valid.map((item: any) => ({
                produto: String(item.produto),
                preco: String(item.preco),
              }))
            )
          }
        }
      } catch {
        setImportText(text)
        setImportOpen(true)
      }
    }
    reader.readAsText(file)
    e.target.value = ""
  }

  const nonEmpty = products.filter(
    (p) => p.produto.trim() && p.preco.trim()
  )

  const pages: Product[][] = []
  const perPage = COLS * ROWS
  for (let i = 0; i < nonEmpty.length; i += perPage) {
    pages.push(nonEmpty.slice(i, i + perPage))
  }

  const generatePDF = async () => {
    const w = window as any
    if (!w.jsPDF) {
      alert("Carregando biblioteca PDF... tente novamente em instantes.")
      return
    }
    const doc = new w.jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
    drawLabels(nonEmpty, doc)
    doc.save(fileName + ".pdf")
  }

  return (
    <>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.2/jspdf.umd.min.js" strategy="afterInteractive" />

      <div>
        <div className="header no-print">
          <div className="container header-inner">
            <a href="/" className="back-btn">← Voltar</a>
            <img src="/logo.jpg" alt="Tulipa" className="header-logo" />
            <div className="header-text">
              <h1>🏷️ Etiquetas de Preço</h1>
              <p>
                A4 retrato · {LABEL_W_MM}×{LABEL_H_MM}mm · 3 colunas · fundo
                verde
              </p>
            </div>
          </div>
        </div>

        <main className="container">
          <div className="builder">
            <div className="builder-form no-print">
              <div className="card">
                <div className="card-title">
                  <h2>Produtos</h2>
                  <span className="card-title-note">Digite e veja a folha A4 atualizar na hora</span>
                </div>

                {products.map((p, i) => (
                  <div key={i} className="product-row">
                    <span className="product-index">{i + 1}</span>
                    <input
                      type="text"
                      value={p.produto}
                      onChange={(e) =>
                        updateProduct(i, "produto", e.target.value)
                      }
                      placeholder="Nome do produto"
                      className="text-input"
                    />
                    <input
                      type="text"
                      value={p.preco}
                      onChange={(e) =>
                        updateProduct(i, "preco", e.target.value)
                      }
                      placeholder="0,00"
                      className="price-input"
                    />
                    <button
                      className="btn-icon-remove"
                      onClick={() => removeProduct(i)}
                      disabled={products.length <= 1}
                    >
                      ✕
                    </button>
                  </div>
                ))}

                <div className="form-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={addProduct}
                    style={{ flex: 1 }}
                  >
                    + Adicionar
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setImportOpen(true)}
                    style={{ flex: 1 }}
                  >
                    📋 Importar
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={clearAll}
                  >
                    🗑️
                  </button>
                </div>

                <div className="fileline">
                  <div className="form-group fileline-name">
                    <label>Nome do arquivo</label>
                    <input
                      type="text"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      className="text-input"
                    />
                  </div>
                  <label className="btn btn-secondary fileline-btn" style={{ cursor: "pointer", textAlign: "center" }}>
                    📁 JSON
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      style={{ display: "none" }}
                    />
                  </label>
                </div>

                <div className="form-actions">
                  <button
                    className="btn btn-primary btn-big"
                    onClick={generatePDF}
                    disabled={nonEmpty.length === 0}
                    style={{ flex: 1 }}
                  >
                    📄 Gerar PDF ({nonEmpty.length})
                  </button>
                </div>
              </div>
            </div>

            <div className="builder-preview">
              <div className="sheet-label no-print">
                Pré-visualização em tempo real —{" "}
                {nonEmpty.length} etiqueta{nonEmpty.length !== 1 ? "s" : ""} ·{" "}
                {pages.length} página{pages.length !== 1 ? "s" : ""} A4
              </div>

              {nonEmpty.length === 0 ? (
                <div className="empty-state no-print">
                  <span style={{ fontSize: 56, opacity: 0.2 }}>🏷️</span>
                  <p>Adicione o primeiro produto — a folha A4 aparece aqui</p>
                </div>
              ) : (
                pages.map((page, pIdx) => (
                  <div key={pIdx} className="a4-sheet">
                    <div className="label-grid">
                      {page.map((p, lIdx) => (
                        <div key={lIdx} className="label-preview">
                          <div className="preview-produto">
                            {p.produto.toUpperCase()}
                          </div>
                          <div className="preview-preco">
                            R$ {p.preco}
                          </div>
                        </div>
                      ))}
                      {Array.from({ length: perPage - page.length }).map(
                        (_, eIdx) => (
                          <div key={`e-${eIdx}`} className="label-preview empty" />
                        )
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>

        {importOpen && (
          <div className="modal-overlay" onClick={() => setImportOpen(false)}>
            <div
              className="modal-content"
              ref={modalRef}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Importar produtos</h2>
                <button
                  className="btn-close"
                  onClick={() => setImportOpen(false)}
                >
                  ✕
                </button>
              </div>
              <p className="modal-desc">
                Cole uma linha por produto:{" "}
                <code>{`{"produto": "NOME", "preco": "11,25"}`}</code> ou
                separado por tab <code>Nome [TAB] Preço</code>
              </p>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder={`{"produto": "DESINFETANTE 2L", "preco": "11,25"}\n{"produto": "AMACIANTE 2L", "preco": "7,75"}\n\nou colar do Excel/CSV:\nDESINFETANTE 2L\t11,25\nAMACIANTE 2L\t7,75`}
                rows={12}
                className="import-textarea"
              />
              <div className="modal-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setImportOpen(false)}
                >
                  Cancelar
                </button>
                <button className="btn btn-primary" onClick={handleImport}>
                  Importar {importText.trim() ? "→" : ""}
                </button>
              </div>
            </div>
          </div>
        )}

        <style>{`
          .builder { display: flex; flex-direction: column; gap: 24px; padding: 16px 0; }

          .builder-form .card { background: var(--surface); border-radius: var(--radius-lg); padding: 24px; box-shadow: var(--shadow-sm); }
          .card-title { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin-bottom: 16px; }
          .card-title h2 { font-family: Barlow, sans-serif; font-size: 1.15rem; font-weight: 800; color: var(--text); }
          .card-title-note { font-size: 0.8rem; color: var(--muted); }

          .product-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
          .product-index { font-size: 0.8rem; font-weight: 700; color: var(--muted); min-width: 22px; text-align: right; }
          .text-input { flex: 1; padding: 10px 14px; border: 1px solid var(--border); border-radius: var(--radius-sm); font-family: Barlow, sans-serif; font-size: 0.95rem; background: var(--surface); color: var(--text); outline: none; transition: border-color 0.2s; }
          .text-input:focus { border-color: var(--green-600); }
          .price-input { width: 85px; padding: 10px 12px; border: 1px solid var(--border); border-radius: var(--radius-sm); font-family: Barlow, sans-serif; font-size: 0.95rem; font-weight: 700; text-align: right; background: var(--surface); color: var(--text); outline: none; transition: border-color 0.2s; }
          .price-input:focus { border-color: var(--green-600); }

          .form-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
          .btn-big { padding: 12px 14px !important; font-size: 1rem !important; }

          .fileline { display: flex; gap: 10px; align-items: flex-end; margin-top: 16px; }
          .fileline-name { flex: 1; }
          .fileline-btn { padding: 10px 14px; white-space: nowrap; line-height: 1; }

          .hint { margin-top: 16px; font-size: 0.85rem; color: var(--muted); text-align: center; }

          .empty-state { background: var(--surface); border-radius: var(--radius-lg); padding: 80px 32px; text-align: center; color: var(--muted); box-shadow: var(--shadow-sm); }
          .empty-state p { margin-top: 12px; font-size: 1rem; }

          .builder-preview { background: var(--surface); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); overflow: hidden; border: 1px solid var(--border); }
          .sheet-label { background: var(--background); padding: 12px 16px; font-size: 0.85rem; color: var(--muted); text-align: center; border-bottom: 1px solid var(--border); font-weight: 600; }

          .a4-sheet { display: flex; justify-content: center; padding: 20px 16px; border-bottom: 1px solid var(--border-light); background: var(--background); }
          .a4-sheet:last-child { border-bottom: none; }

          .label-grid { background: #fff; box-shadow: var(--shadow-md); border-radius: 6px; padding: ${MARGIN_MM}mm; display: grid; grid-template-columns: repeat(${COLS}, ${LABEL_W_MM}mm); grid-template-rows: repeat(${ROWS}, ${LABEL_H_MM}mm); gap: ${GAP_MM}mm; }

          .label-preview { background: #006b3f; border-radius: 3px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 2px 4px; overflow: hidden; }
          .label-preview.empty { background: transparent; }
          .preview-produto { color: #fff; font-family: Arial, Helvetica, sans-serif; font-size: 7.5pt; font-weight: 700; line-height: 1.2; word-break: break-word; max-width: 100%; }
          .preview-preco { color: #fff; font-family: Arial, Helvetica, sans-serif; font-size: 12pt; font-weight: 700; margin-top: 4px; }

          .btn-icon-remove { width: 34px; height: 34px; border: 1px solid transparent; border-radius: 8px; background: transparent; color: var(--muted); cursor: pointer; font-size: 0.85rem; transition: all 0.2s; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
          .btn-icon-remove:hover:not(:disabled) { background: #fee2e2; color: #dc2626; border-color: #fca5a5; }
          .btn-icon-remove:disabled { opacity: 0.3; cursor: not-allowed; }

          .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 999; padding: 16px; }
          .modal-content { background: var(--surface); border-radius: var(--radius-lg); padding: 32px; max-width: 560px; width: 100%; max-height: 90vh; overflow-y: auto; box-shadow: var(--shadow-xl); }
          .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
          .modal-header h2 { font-family: Barlow, sans-serif; font-size: 1.2rem; font-weight: 800; color: var(--text); }
          .btn-close { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: var(--muted); padding: 4px 8px; border-radius: 6px; }
          .btn-close:hover { background: var(--background); }
          .modal-desc { font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 16px; line-height: 1.5; }
          .modal-desc code { background: var(--background); padding: 2px 6px; border-radius: 4px; font-size: 0.8rem; color: var(--green-700); }
          .import-textarea { width: 100%; padding: 14px; border: 1px solid var(--border); border-radius: var(--radius-sm); font-family: monospace; font-size: 0.85rem; background: var(--background); color: var(--text); resize: vertical; outline: none; }
          .import-textarea:focus { border-color: var(--green-600); }
          .modal-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px; }

          @media print {
            .no-print { display: none !important; }
            body { background: #fff !important; margin: 0 !important; }
            .builder { padding: 0 !important; gap: 0 !important; }
            .builder-form { display: none !important; }
            .builder-preview { box-shadow: none !important; border: none !important; border-radius: 0 !important; overflow: visible !important; }
            .sheet-label { display: none !important; }
            .a4-sheet { padding: 0 !important; border: none !important; background: #fff !important; box-shadow: none !important; border-radius: 0 !important; }
            .label-grid { box-shadow: none !important; border-radius: 0 !important; padding: ${MARGIN_MM}mm !important; }
            @page { size: A4 portrait; margin: 0; }
          }

          @media (max-width: 800px) {
            .builder-preview { overflow-x: auto; }
            .a4-sheet { justify-content: flex-start; }
          }
        `}</style>
      </div>
    </>
  )
}
