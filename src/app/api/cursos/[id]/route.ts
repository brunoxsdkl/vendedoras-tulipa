import { NextResponse } from "next/server";

// Mock data store - referência ao array global
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

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const valor = body.preco ? parseFloat(body.preco.replace(/[^\d,]/g, "").replace(",", ".")) : 0;

  const index = cursos.findIndex(c => c.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Curso não encontrado" }, { status: 404 });
  }

  cursos[index] = {
    ...cursos[index],
    nome: body.nome,
    slug: body.slug || null,
    descricao: body.descricao || "",
    horario: body.horario || "",
    vagas: body.vagas || 20,
    valor,
  };

  return NextResponse.json(cursos[index]);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  cursos = cursos.filter(c => c.id !== id);
  return NextResponse.json({ ok: true });
}
