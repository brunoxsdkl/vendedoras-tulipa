import { NextResponse } from "next/server";
import produtos from "@/data/flashlimp-produtos.json";

export async function GET() {
  const categorias = [...new Set(produtos.map((p) => p.categoria))];
  return NextResponse.json({ produtos, categorias });
}
