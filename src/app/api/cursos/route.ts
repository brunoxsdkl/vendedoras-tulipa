import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data: cursos, error } = await supabase
    .from("cursos")
    .select("*, alunos(*)")
    .order("criado_em", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(cursos);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { data, error } = await supabase
    .from("cursos")
    .insert({
      nome: body.nome,
      descricao: body.descricao || "",
      horario: body.carga || "",
      vagas: body.vagas || 20,
      valor: body.preco ? parseFloat(body.preco.replace(/[^\d,]/g, "").replace(",", ".")) : 0,
      data: new Date().toISOString().split("T")[0],
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
