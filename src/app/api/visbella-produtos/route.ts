import { NextResponse } from 'next/server';
import produtos from '@/data/visbella-produtos.json';

export async function GET() {
  return NextResponse.json(produtos);
}
