import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();
  const { data, error } = await supabase
    .from("alunos")
    .insert({
      curso_id: body.curso_id,
      nome: body.nome,
      telefone: body.telefone || "",
      whatsapp: body.telefone || "",
      data_inscricao: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
