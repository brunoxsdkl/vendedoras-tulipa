import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { data, error } = await supabase
    .from("alunos")
    .update({
      nome: body.nome,
      telefone: body.telefone || "",
      cpf: body.cpf || null,
      email: body.email || null,
      data_nascimento: body.data_nascimento || null,
      cidade: body.cidade || null,
      valor_curso: body.valor_curso || null,
      forma_pagamento: body.forma_pagamento || null,
      parcelas: body.parcelas || 1,
      valor_parcela: body.valor_parcela || null,
      status_pagamento: body.status_pagamento || "Pendente",
      pago: body.status_pagamento === "Pago",
      pendente: body.status_pagamento !== "Pago" && body.status_pagamento !== "Cancelado",
      data_pagamento: body.data_pagamento || null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { error } = await supabase.from("alunos").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
