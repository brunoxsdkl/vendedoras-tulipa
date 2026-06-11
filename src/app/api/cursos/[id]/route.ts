import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  const { data, error } = await supabase
    .from("cursos")
    .update({
      nome: body.nome,
      descricao: body.descricao || "",
      horario: body.carga || "",
      vagas: body.vagas || 20,
      valor: body.preco ? parseFloat(body.preco.replace(/[^\d,]/g, "").replace(",", ".")) : 0,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { error } = await supabase.from("cursos").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
