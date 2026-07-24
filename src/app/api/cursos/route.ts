import { NextResponse } from "next/server";

// Mock data store - em memoria (reset a cada deploy)
let cursos: Array<{
  id: string;
  nome: string;
  slug: string | null;
  descricao: string;
  horario: string;
  vagas: number;
  valor: number;
  data: string;
  criado_em: string;
  alunos: Array<{
    id: string;
    curso_id: string;
    nome: string;
    telefone: string;
    whatsapp: string;
    cpf: string | null;
    email: string | null;
    data_nascimento: string | null;
    cidade: string | null;
    valor_curso: number | null;
    forma_pagamento: string | null;
    parcelas: number;
    valor_parcela: number | null;
    status_pagamento: string;
    pago: number;
    pendente: number;
    data_pagamento: string | null;
    data_inscricao: string;
  }>;
}> = [];

export async function GET() {
  return NextResponse.json(cursos);
}

export async function POST(req: Request) {
  const body = await req.json();
  const id = crypto.randomUUID();
  const valor = body.preco ? parseFloat(body.preco.replace(/[^\d,]/g, "").replace(",", ".")) : 0;

  const novoCurso = {
    id,
    nome: body.nome,
    slug: body.slug || null,
    descricao: body.descricao || "",
    horario: body.horario || "",
    vagas: body.vagas || 20,
    valor,
    data: new Date().toISOString().split("T")[0],
    criado_em: new Date().toISOString(),
    alunos: [],
  };

  cursos.push(novoCurso);
  return NextResponse.json(novoCurso);
}
