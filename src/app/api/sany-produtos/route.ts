import { NextResponse } from "next/server";

type Produto = {
  id: string;
  nome: string;
  imagem: string;
  categoria: string;
  fragrancias?: string[];
};

const produtos: Produto[] = [
  // LIMPADORES MULTIUSO
  { id: "multiusos", nome: "Multiusos", imagem: "https://sanydobrasil.com.br/wp-content/uploads/2024/06/Site-Sany_Multiusos.png", categoria: "Limpadores Multiuso", fragrancias: ["Original", "Campestre", "Floral", "Máxima Limpeza"] },
  { id: "limpa-vidros", nome: "Limpa Vidros", imagem: "https://sanydobrasil.com.br/wp-content/uploads/2024/06/Site-Sany_Limpa-Vidros.png", categoria: "Limpadores Multiuso" },
  { id: "saponaceo-cremoso", nome: "Saponáceo Cremoso", imagem: "https://sanydobrasil.com.br/wp-content/uploads/2024/06/Site-Sany_Saponaceo-Cremoso-1.png", categoria: "Limpadores Multiuso" },
  { id: "lava-roupas-liquido", nome: "Lava Roupas Líquido", imagem: "https://sanydobrasil.com.br/wp-content/uploads/2024/06/Site-Sany_Lava-roupas-liquido.png", categoria: "Limpadores Multiuso" },

  // COZINHA
  { id: "limpa-aluminio", nome: "Limpa Alumínio", imagem: "https://sanydobrasil.com.br/wp-content/uploads/2024/06/Site-Sany_Limpa-Aluminio.png", categoria: "Cozinha" },
  { id: "desengordurantes", nome: "Desengordurantes", imagem: "https://sanydobrasil.com.br/wp-content/uploads/2024/06/Site-Sany_Desengordurantes.png", categoria: "Cozinha" },
  { id: "esponja-dupla-face", nome: "Esponja Dupla Face", imagem: "https://sanydobrasil.com.br/wp-content/uploads/2024/06/Site-Sany_Esponja-Dupla-Face.png", categoria: "Cozinha" },
  { id: "lava-loucas-liquido", nome: "Lava Louças Líquido", imagem: "https://sanydobrasil.com.br/wp-content/uploads/2024/06/Site-Sany_Lava-Loucas-Liquido.png", categoria: "Cozinha" },

  // LAVANDERIA
  { id: "anti-mofo", nome: "Anti Mofo", imagem: "https://sanydobrasil.com.br/wp-content/uploads/2024/06/Lavanderia_Anti-Mofo.png", categoria: "Lavanderia" },
  { id: "amaciante-2l", nome: "Amaciante Sany Baby 2L", imagem: "https://sanydobrasil.com.br/wp-content/uploads/2024/06/Site-Sany_Amaciante-2l.png", categoria: "Lavanderia" },
  { id: "amaciante-5l", nome: "Amaciante Sany Baby 5L", imagem: "https://sanydobrasil.com.br/wp-content/uploads/2024/06/Lavanderia_Amaciante-5l.png", categoria: "Lavanderia" },
  { id: "agua-sanitaria", nome: "Água Sanitária", imagem: "https://sanydobrasil.com.br/wp-content/uploads/2024/06/Site-Sany_Agua-Sanitaria.png", categoria: "Lavanderia" },

  // DESINFETANTE
  { id: "desinfetante-2l", nome: "Desinfetante Sany Mix 2L", imagem: "https://sanydobrasil.com.br/wp-content/uploads/2024/06/Desinfetante_Desinfetante-2l.png", categoria: "Desinfetante" },
  { id: "desinfetante-5l", nome: "Desinfetante Sany Mix 5L", imagem: "https://sanydobrasil.com.br/wp-content/uploads/2024/06/Desinfetante_Desinfetante-5l.png", categoria: "Desinfetante" },

  // OUTROS
  { id: "gel-acendedor", nome: "Gel Acendedor", imagem: "https://sanydobrasil.com.br/wp-content/uploads/2024/06/Outros_Gel-Acendedor.png", categoria: "Outros" },
  { id: "naftalina", nome: "Naftalina", imagem: "https://sanydobrasil.com.br/wp-content/uploads/2024/06/Outros_Anti-Mofo-copia.png", categoria: "Outros" },
];

export async function GET() {
  const categorias = [...new Set(produtos.map((p) => p.categoria))];
  return NextResponse.json({ produtos, categorias });
}
