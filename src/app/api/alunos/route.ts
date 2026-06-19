import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();
  const id = crypto.randomUUID();
  const data_inscricao = new Date().toISOString();
  const { data, error } = await supabase
    .from("alunos")
    .insert({
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
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (body.status_pagamento === "Pago" && body.data_pagamento) {
    await supabase.from("pagamentos").insert({
      id: crypto.randomUUID(),
      aluno_id: id,
      data: body.data_pagamento,
      valor: body.valor_curso || null,
      forma: body.forma_pagamento || null,
      observacao: "Pagamento registrado no cadastro",
    });
  }

  return NextResponse.json(data);
}
