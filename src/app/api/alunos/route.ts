import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();
  const id = Date.now().toString() + Math.random().toString(36).slice(2, 6);
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
      data_inscricao: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
