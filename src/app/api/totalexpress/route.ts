import { NextResponse } from "next/server";

const TOTAL_EXPRESS_URL =
  process.env.TOTAL_EXPRESS_URL ||
  "https://apis.totalexpress.com.br/ics-tracking-encomenda-lv/v1/tracking";

function basicAuthHeader() {
  const user = process.env.TOTAL_EXPRESS_USER;
  const pass = process.env.TOTAL_EXPRESS_PASS;
  if (!user || !pass) return null;
  return "Basic " + Buffer.from(user + ":" + pass).toString("base64");
}

export async function POST(req: Request) {
  const auth = basicAuthHeader();
  if (!auth) {
    return NextResponse.json(
      { error: "Credenciais da Total Express não configuradas (TOTAL_EXPRESS_USER / TOTAL_EXPRESS_PASS)" },
      { status: 500 },
    );
  }

  let body: { notasFiscais?: string[]; awbs?: string[]; pedidos?: string[]; comprovanteEntrega?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const notasFiscais = Array.isArray(body.notasFiscais) ? body.notasFiscais.filter(Boolean) : [];
  if (notasFiscais.length === 0) {
    return NextResponse.json({ error: "Informe ao menos uma nota fiscal" }, { status: 400 });
  }

  const payload = {
    notasFiscais: notasFiscais.slice(0, 50),
    comprovanteEntrega: true,
  };

  try {
    const resp = await fetch(TOTAL_EXPRESS_URL, {
      method: "POST",
      headers: {
        "Authorization": auth,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Connection": "keep-alive",
      },
      body: JSON.stringify(payload),
    });

    const text = await resp.text();
    if (!resp.ok) {
      return NextResponse.json({ error: `Total Express retornou ${resp.status}`, detail: text }, { status: resp.status });
    }

    let json: any = null;
    try {
      json = JSON.parse(text);
    } catch {
      json = { raw: text };
    }

    return NextResponse.json(json, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Erro ao consultar Total Express", detail: err?.message || String(err) },
      { status: 502 },
    );
  }
}
