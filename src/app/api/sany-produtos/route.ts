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

        const fragrancias: string[] = [];
        const $content = $col.find(".elementor-tab-content");
        const contentHtml = $content.html() || "";

        if (contentHtml.includes("fragrância") || contentHtml.includes("Fragrância")) {
          $content.find("b, strong").each((_, el) => {
            const texto = $(el).text().replace(/[\s\u00A0]+/g, " ").replace(/[–\-—›]/g, "").trim();
            if (texto && texto.length < 40 && !texto.match(/^(dispon[v|í]vel|fragrância)/i)) {
              const limpo = texto.replace(/^\s*[\u2022\u2023\u25E6\u2043\u2219*]\s*/, "").trim();
              if (limpo && !fragrancias.includes(limpo)) fragrancias.push(limpo);
            }
          });

          const conhecidas = ["Original", "Campestre", "Floral", "Máxima Limpeza"];
          const hasConhecidas = conhecidas.filter((f) => contentHtml.includes(f));
          if (hasConhecidas.length >= 2) {
            produtos.push({
              id: nome.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
              nome,
              imagem,
              categoria,
              fragrancias: hasConhecidas,
            });
            return;
          }
        }

        if (fragrancias.length === 0) {
          const conhecidas = ["Original", "Campestre", "Floral", "Máxima Limpeza", "Lavanda", "Citronela", "Eucalipto", "Bebê", "Neve", "Frescor do Mar", "Primavera"];
          const found = conhecidas.filter((f) => contentHtml.includes(f));
          if (found.length >= 2) {
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
          fragrancias: fragrancias.length > 0 ? [...new Set(fragrancias)] : undefined,
        });
      });
    });

    const categorias = [...new Set(produtos.map((p) => p.categoria))];
    return NextResponse.json({ produtos, categorias });
  } catch (err) {
    return NextResponse.json({ erro: "Falha ao buscar produtos", produtos: [], categorias: [] }, { status: 500 });
  }
}
