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
    fragrancias: ["Cloro", "Lavanda", "Floral", "Limão", "Eucalipto"],
    tipos: ["300ml", "500ml", "1L"],
  },
  "saponáceo em pó": {
    fragrancias: ["Cloro", "Lavanda", "Floral", "Limão", "Eucalipto"],
    tipos: ["500g", "1kg"],
  },
  "desinfetante sany mix 2l": {
    fragrancias: ["Pinho", "Mil Flores"],
    tipos: ["2L"],
  },
  "desinfetante sany mix 5l": {
    fragrancias: ["Pinho", "Mil Flores"],
    tipos: ["5L"],
  },
  "amaciante sany baby 2l": {
    fragrancias: ["Aconchego", "Intenso"],
    tipos: ["2L"],
  },
  "amaciante sany baby 5l": {
    fragrancias: ["Aconchego", "Intenso"],
    tipos: ["5L"],
  },
  "evita mofo 180g": {
    fragrancias: ["Lavanda", "Sonhos de Infância"],
    tipos: ["180g"],
  },
  "evita mofo 100g": {
    fragrancias: ["Lavanda", "Sonhos de Infância"],
    tipos: ["100g"],
  },
  "água sanitária": {
    tipos: ["2L", "5L"],
  },
  "gel adesivo": {
    fragrancias: ["Lavanda", "Marine", "Citrus"],
  },
  "gel adesivo em blister": {
    fragrancias: ["Lavanda", "Marine", "Citrus"],
  },
  "pastilha adesiva": {
    fragrancias: ["Lavanda", "Pinho", "Floral"],
  },
  "pastilha para caixa acoplada": {
    fragrancias: ["Lavanda", "Pinho", "Floral"],
  },
  "bloco odorizante": {
    fragrancias: ["Floral", "Lavanda", "Eucalipto"],
  },
  "bloco odorizante refil em blister": {
    fragrancias: ["Floral", "Lavanda", "Eucalipto"],
  },
  "pedra sanitária": {
    fragrancias: ["Floral", "Lavanda", "Eucalipto", "Jasmim"],
  },
  "pedra perfumada": {
    fragrancias: ["Floral", "Lavanda", "Eucalipto"],
  },
  "limpa vidros": {
    fragrancias: ["Original", "Marine"],
  },
  "desengordurantes": {
    fragrancias: ["Original", "Citronela", "Laranja"],
  },
  "tira limo": {
    fragrancias: ["Original", "Cloro Ativo"],
  },
  "anti mofo": {
    fragrancias: ["Original", "Lavanda"],
  },
  "pasta rosa multiuso": {
    tipos: ["500g"],
  },
};

const TODAS_FRAGANCIAS = [
  "Original", "Campestre", "Floral", "Máxima Limpeza",
  "Lavanda", "Citronela", "Eucalipto", "Bebê",
  "Neve", "Frescor do Mar", "Primavera", "Marine",
  "Cloro Ativo", "Cloro", "Limão", "Jasmim",
  "Aconchego", "Intenso", "Sonhos de Infância",
  "Pinho", "Mil Flores", "Laranja", "Citrus",
];

function extrairVariacoesDoTexto(html: string): { fragrancias: string[]; tipos: string[] } {
  const result: { fragrancias: string[]; tipos: string[] } = { fragrancias: [], tipos: [] };
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

  const fragMatch = text.match(/fragrância[s]?:?\s*([^\.]+)/i);
  if (fragMatch) {
    const parts = fragMatch[1].split(/[–\-—›,;]/).map((s) => s.trim()).filter(Boolean);
    for (const p of parts) {
      for (const k of TODAS_FRAGANCIAS) {
        if (p.toLowerCase().includes(k.toLowerCase()) && !result.fragrancias.includes(k)) {
          result.fragrancias.push(k);
        }
      }
    }
  }

  if (result.fragrancias.length === 0) {
    result.fragrancias = TODAS_FRAGANCIAS.filter((f) => text.includes(f));
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
