import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET() {
  try {
    const res = await fetch("https://sanydobrasil.com.br/produtos/", { next: { revalidate: 3600 } });
    const html = await res.text();
    const $ = cheerio.load(html);

    const produtos: { id: string; nome: string; imagem: string; categoria: string; fragrancias?: string[] }[] = [];

    $(".elementor-top-section").each((_, section) => {
      const $section = $(section);

      const catEl = $section.find("> .elementor-container > .elementor-column > .elementor-widget-wrap > .elementor-widget-heading h2");
      let categoria = catEl.text().trim();
      if (!categoria) return;

      categoria = categoria.charAt(0).toUpperCase() + categoria.slice(1).toLowerCase();

      $section.find(".elementor-inner-section .elementor-column").each((_, col) => {
        const $col = $(col);

        const imgEl = $col.find(".elementor-widget-image img");
        const imagem = imgEl.attr("src") || imgEl.attr("data-src") || "";

        const nomeEl = $col.find(".elementor-toggle-title");
        let nome = nomeEl.text().trim();
        if (!nome || !imagem) return;

        const conteudo = $col.find(".elementor-tab-content").text();
        const fragrancias: string[] = [];
        const fragMatch = conteudo.match(/fragrância[s]?:?\s*([^\.]+)/i);
        if (fragMatch) {
          fragMatch[1].split(/[–\-—,]/).forEach((f) => {
            const fTrim = f.replace(/[–\-—]/g, "").trim();
            if (fTrim) fragrancias.push(fTrim);
          });
        }
        if (conteudo.includes("Original") && conteudo.includes("Campestre")) {
          const found: string[] = [];
          for (const f of ["Original", "Campestre", "Floral", "Máxima Limpeza"]) {
            if (conteudo.includes(f)) found.push(f);
          }
          if (found.length > 0) {
            produtos.push({
              id: nome.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
              nome,
              imagem,
              categoria,
              fragrancias: found,
            });
            return;
          }
        }

        produtos.push({
          id: nome.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
          nome,
          imagem,
          categoria,
          fragrancias: fragrancias.length > 0 ? fragrancias : undefined,
        });
      });
    });

    const categorias = [...new Set(produtos.map((p) => p.categoria))];
    return NextResponse.json({ produtos, categorias });
  } catch (err) {
    return NextResponse.json({ erro: "Falha ao buscar produtos", produtos: [], categorias: [] }, { status: 500 });
  }
}
