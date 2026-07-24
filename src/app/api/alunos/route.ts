import { NextResponse } from "next/server";

// Mock data store - referência ao array global de cursos
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

export async function POST(req: Request) {
  const body = await req.json();
  const id = crypto.randomUUID();
  const data_inscricao = new Date().toISOString();

  const novoAluno = {
    id,
    curso_id: body.curso_id,
    nome: body.nome,
    telefone: body.telefone || "",
    whatsapp: body.telefone || "",
    cpf: body.cpf || null,
    email: body.email || null,
    data_nascimento: body.data_nascimento || null,
    cidade: body.cidade || null,
    valor_curso: body.valor_curso || null,
    forma_pagamento: body.forma_pagamento || null,
    parcelas: body.parcelas || 1,
    valor_parcela: body.valor_parcela || null,
    status_pagamento: body.status_pagamento || "Pendente",
    pago: body.status_pagamento === "Pago" ? 1 : 0,
    pendente: body.status_pagamento !== "Pago" && body.status_pagamento !== "Cancelado" ? 1 : 0,
    data_pagamento: body.data_pagamento || null,
    data_inscricao,
  };

  const cursoIndex = cursos.findIndex(c => c.id === body.curso_id);
  if (cursoIndex !== -1) {
    cursos[cursoIndex].alunos.push(novoAluno);
  }

  return NextResponse.json(novoAluno);
}
