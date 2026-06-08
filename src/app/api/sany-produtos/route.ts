import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

const VARIACOES_CONHECIDAS: Record<string, { fragrancias?: string[]; tipos?: string[] }> = {
  "multiusos": {
    fragrancias: ["Original", "Campestre", "Floral", "Máxima Limpeza"],
  },
  "pedra encartelada": {
    fragrancias: ["Floral", "Lavanda", "Eucalipto"],
  },
  "saponáceo cremoso": {
    tipos: ["500ml", "1L"],
  },
  "saponáceo em pó": {
    tipos: ["500g", "1kg"],
  },
  "desinfetante sany mix 2l": {
    tipos: ["2L"],
  },
  "desinfetante sany mix 5l": {
    tipos: ["5L"],
  },
  "amaciante sany baby 2l": {
    fragrancias: ["Bebê", "Original"],
    tipos: ["2L"],
  },
  "amaciante sany baby 5l": {
    fragrancias: ["Bebê", "Original"],
    tipos: ["5L"],
  },
  "evita mofo 180g": {
    tipos: ["180g"],
  },
  "evita mofo 100g": {
    tipos: ["100g"],
  },
  "água sanitária": {
    tipos: ["2L", "5L"],
  },
  "gel adesivo": {
    tipos: ["Tradicional"],
  },
  "gel adesivo em blister": {
    tipos: ["Blister"],
  },
  "bloco odorizante": {
    tipos: ["Tradicional"],
  },
  "bloco odorizante refil em blister": {
    tipos: ["Blister"],
  },
  "pedra sanitária": {
    fragrancias: ["Floral", "Lavanda", "Eucalipto"],
  },
  "pedra perfumada": {
    fragrancias: ["Floral", "Lavanda", "Eucalipto"],
  },
  "limpa vidros": {
    fragrancias: ["Original", "Marine"],
  },
  "desengordurantes": {
    fragrancias: ["Original", "Citronela"],
  },
  "tira limo": {
    fragrancias: ["Original", "Cloro Ativo"],
  },
  "anti mofo": {
    fragrancias: ["Original", "Lavanda"],
  },
  "gel acendedor": {
    tipos: ["Tradicional", "Ecológico"],
  },
};

function extrairVariacoesDoTexto(html: string): { fragrancias: string[]; tipos: string[] } {
  const result: { fragrancias: string[]; tipos: string[] } = { fragrancias: [], tipos: [] };
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

  const fragMatch = text.match(/fragrância[s]?:?\s*([^\.]+)/i);
  if (fragMatch) {
    const parts = fragMatch[1].split(/[–\-—›,;]/).map((s) => s.trim()).filter(Boolean);
    const conhecidas = ["Original", "Campestre", "Floral", "Máxima Limpeza", "Lavanda", "Citronela", "Eucalipto", "Bebê", "Neve", "Frescor do Mar", "Primavera", "Marine", "Cloro Ativo"];
    for (const p of parts) {
      for (const k of conhecidas) {
        if (p.toLowerCase().includes(k.toLowerCase()) && !result.fragrancias.includes(k)) {
          result.fragrancias.push(k);
        }
      }
    }
  }

  if (result.fragrancias.length === 0) {
    const conhecidas = ["Original", "Campestre", "Floral", "Máxima Limpeza", "Lavanda", "Citronela", "Eucalipto", "Bebê", "Neve", "Frescor do Mar", "Primavera", "Marine", "Cloro Ativo"];
    result.fragrancias = conhecidas.filter((f) => text.includes(f));
  }

  return result;
}

export async function GET() {
  try {
    const res = await fetch("https://sanydobrasil.com.br/produtos/", { next: { revalidate: 3600 } });
    const html = await res.text();
    const $ = cheerio.load(html);

    const produtos: { id: string; nome: string; imagem: string; categoria: string; fragrancias?: string[]; tipos?: string[] }[] = [];

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

        const id = nome.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
        const $content = $col.find(".elementor-tab-content");
        const contentHtml = $content.html() || "";

        let fragrancias: string[] | undefined;
        let tipos: string[] | undefined;

        const extraidas = extrairVariacoesDoTexto(contentHtml);
        if (extraidas.fragrancias.length > 0) fragrancias = extraidas.fragrancias;

        const conhecida = Object.entries(VARIACOES_CONHECIDAS).find(([key]) =>
          nome.toLowerCase().includes(key)
        );
        if (conhecida) {
          if (conhecida[1].fragrancias && conhecida[1].fragrancias!.length > 0) {
            fragrancias = [...new Set([...(fragrancias || []), ...conhecida[1].fragrancias!])];
          }
          if (conhecida[1].tipos && conhecida[1].tipos!.length > 0) {
            tipos = conhecida[1].tipos;
          }
        }

        produtos.push({
          id,
          nome,
          imagem,
          categoria,
          fragrancias: fragrancias && fragrancias.length > 0 ? [...new Set(fragrancias)] : undefined,
          tipos: tipos && tipos.length > 0 ? tipos : undefined,
        });
      });
    });

    const categorias = [...new Set(produtos.map((p) => p.categoria))];
    return NextResponse.json({ produtos, categorias });
  } catch (err) {
    return NextResponse.json({ erro: "Falha ao buscar produtos", produtos: [], categorias: [] }, { status: 500 });
  }
}
