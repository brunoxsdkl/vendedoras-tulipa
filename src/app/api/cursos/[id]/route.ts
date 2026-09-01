import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  const { data, error } = await supabase
    .from("cursos")
    .update({
      nome: body.nome,
      slug: body.slug || null,
      descricao: body.descricao || "",
      horario: body.horario || "",
      vagas: body.vagas || 20,
      valor: body.preco ? parseFloat(body.preco.replace(/[^\d,]/g, "").replace(",", ".")) : 0,
      data: body.data || null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await supabase.from("pagamentos").delete().in("aluno_id", (await supabase.from("alunos").select("id").eq("curso_id", id)).data?.map(a => a.id) || []);
  await supabase.from("alunos").delete().eq("curso_id", id);
  const { error } = await supabase.from("cursos").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
