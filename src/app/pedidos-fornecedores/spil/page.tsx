"use client";

import { useState } from "react";

type Produto = {
  id: number;
  nome: string;
  preco: number;
  categoria: string;
  desc: string;
  imagem?: string;
};

type ItemPedido = {
  produto: Produto;
  caixas: number;
  estoque: number | null;
};

const CDN = "https://cdn.prod.website-files.com/68dd5a3ac8a92418e5e080ab";

const produtos: Produto[] = [
  { id: 1, nome: "EMB. ACETATO CORAÇÃO 4UN", preco: 14.50, categoria: "Acetato", desc: "Diversos" },
  { id: 2, nome: "EMB. ACETATO KIT C/2 SABONETE", preco: 7.80, categoria: "Acetato", desc: "Diversos" },
  { id: 3, nome: "EMB. ACETATO SABONETE ARTESAL", preco: 3.95, categoria: "Acetato", desc: "1 UN" },
  { id: 4, nome: "EMB. COSM. 100 ML MOD.18 CRISTAL", preco: 2.30, categoria: "Cosmético", desc: "R. 20/410", imagem: `${CDN}/68ff7381570649b8af667bf8_68ff5555dfd6632ee07f7421_Frasco-18-100ml-20-410-300.0100.018.avif` },
  { id: 5, nome: "EMB. COSM. 140 ML MOD.64 CRISTAL", preco: 4.69, categoria: "Cosmético", desc: "", imagem: `${CDN}/68ff7386e6863e6aae386085_68ff5a9149e80530bb73ddcd_Frasco-64-140ml-24-415-307.0140.064.avif` },
  { id: 6, nome: "EMB. COSM. 15 ML MOD.33 CRISTAL", preco: 1.80, categoria: "Cosmético", desc: "R. 18", imagem: `${CDN}/68ff738432efe2e47fc167a5_68ff5780f0d554b8fc67a251_Frasco-33-15ml-18-415-140.0015.033.avif` },
  { id: 7, nome: "EMB. COSM. 240 ML MOD.35 CRISTAL", preco: 1.70, categoria: "Cosmético", desc: "", imagem: `${CDN}/68ff73848b19e742b6add1b3_68ff57acf18b504c36503ecc_Frasco-35-240ml-R22-313.0240.035.avif` },
  { id: 8, nome: "EMB. COSM. 30 ML MOD. 33 CRISTAL", preco: 1.45, categoria: "Cosmético", desc: "R. 18", imagem: `${CDN}/68ff7384d1d85b6f098ae2cb_68ff578e7c4d61b14dce8867_Frasco-33-30ml-18-415-160.0030.033.avif` },
  { id: 9, nome: "EMB. COSM. 45ML MOD. 67 CRISTAL", preco: 2.15, categoria: "Cosmético", desc: "", imagem: `${CDN}/68ff73883c123d680ccba883_68ff5bca5a75f9528c9387e5_Frasco-67-45ml-18-415-140.0045.067.avif` },
  { id: 10, nome: "EMB. COSM. MOD. 01 - 100 ML CRISTAL", preco: 4.65, categoria: "Cosmético", desc: "R. 20/415", imagem: `${CDN}/68ff7378ae4e6a188e2ff2b5_68fba670512b60fa3d38b4fa_Frasco-1-100ml-20-410-305.0100.001-branco.avif` },
  { id: 11, nome: "EMB. COSM. MOD. 01 - 140ML AMBAR", preco: 1.65, categoria: "Cosmético", desc: "R. 24/415", imagem: `${CDN}/68ff7378945814c4d856ed5e_68fba688365ab9d1e375be2c_Frasco-1-140ml-24-415-302.0140.001-branco.avif` },
  { id: 12, nome: "EMB. COSM. MOD. 01 - 140 ML CRISTAL", preco: 4.20, categoria: "Cosmético", desc: "R. 24/415", imagem: `${CDN}/68ff7378945814c4d856ed5e_68fba688365ab9d1e375be2c_Frasco-1-140ml-24-415-302.0140.001-branco.avif` },
  { id: 13, nome: "EMB. COSM. MOD. 01 - 240 ML CRISTAL", preco: 1.60, categoria: "Cosmético", desc: "R. 24/415", imagem: `${CDN}/68ff737af18b504c3659d0ea_68ff4cce6a330717f356121c_Frasco-1-240ml-24-415-302.0240.001.avif` },
  { id: 14, nome: "EMB. COSM. MOD. 01 - 30 ML CRISTAL", preco: 1.50, categoria: "Cosmético", desc: "R. 20/415", imagem: `${CDN}/68ff7378348032ceecc5695c_68fba517d9bbe55c5f53b585_Frasco-1-30ml-18-415-140.0030.001-branco-.avif` },
  { id: 15, nome: "EMB. COSM. MOD. 01 - 30 ML MAIS FLIPTOP", preco: 1.20, categoria: "Cosmético", desc: "", imagem: `${CDN}/68ff7378348032ceecc5695c_68fba517d9bbe55c5f53b585_Frasco-1-30ml-18-415-140.0030.001-branco-.avif` },
  { id: 16, nome: "EMB. COSM. MOD. 01 - 60 ML CRISTAL", preco: 2.20, categoria: "Cosmético", desc: "R. 20/415", imagem: `${CDN}/68ff7378cf7869c22cdb6d0b_68fba536b00511c68fbcdd6f_Frasco-1-60ml-20-410-300.0060.001-branco.avif` },
  { id: 17, nome: "EMB. COSM. MOD. 01 - 60ML ROXO", preco: 0.85, categoria: "Cosmético", desc: "R.20", imagem: `${CDN}/68ff7378cf7869c22cdb6d0b_68fba536b00511c68fbcdd6f_Frasco-1-60ml-20-410-300.0060.001-branco.avif` },
  { id: 18, nome: "EMB. COSM. MOD. 02 - 120 ML CRISTAL", preco: 3.25, categoria: "Cosmético", desc: "R. 24/415", imagem: `${CDN}/68ff737b9ec3f2cc264000fc_68ff4e8d88835c5190b79f96_Frasco-2-120ml-20-410-305.0120.002.avif` },
  { id: 19, nome: "EMB. COSM. MOD. 02 - 200 ML CRISTAL", preco: 4.95, categoria: "Cosmético", desc: "R. 24/415", imagem: `${CDN}/68ff737b6382f95444ba99d4_68ff4e9fec269ed20842d701_Frasco-2-200ml-24-415-302.0200.002.avif` },
  { id: 20, nome: "EMB. COSM. MOD. 02 - 240 ML CRISTAL", preco: 4.59, categoria: "Cosmético", desc: "R 24", imagem: `${CDN}/68ff737c6382f95444ba9a1e_68ff4ed35ddb00250d49ae42_Frasco-2-240ml-24-415-302.0240.002.avif` },
  { id: 21, nome: "EMB. COSM. MOD. 02 - 30 ML CRISTAL", preco: 1.89, categoria: "Cosmético", desc: "R. 20/415", imagem: `${CDN}/68ff737a893105d44ae58bae_68ff4d1809a25359ae6f0980_Frasco-2-30ml-18-415-140.0030.002.avif` },
  { id: 22, nome: "EMB. COSM. MOD. 02 - 60 ML CRISTAL", preco: 2.15, categoria: "Cosmético", desc: "R. 20/415", imagem: `${CDN}/68ff737baea04faf10d72246_68ff4ddcd8d21ba32f9735dc_Frasco-2-60ml-20-410-300.0060.002.avif` },
  { id: 23, nome: "EMB. COSM. MOD. 03 - 100 ML CRISTAL", preco: 2.35, categoria: "Cosmético", desc: "R. 20/415", imagem: `${CDN}/68ff737d261e257d5fd4522f_68ff5165b66af4f86cc20164_Frasco-3-100ml-20-410-337.0100.003.avif` },
  { id: 24, nome: "EMB. COSM. MOD. 03 - 140 ML AMBAR", preco: 1.80, categoria: "Cosmético", desc: "R. 24/415", imagem: `${CDN}/68ff737d8814bd3df7ae2de0_68ff522224a1c7acfefc0edb_Frasco-3-140ml-24-415-302.0140.003.avif` },
  { id: 25, nome: "EMB. COSM. MOD. 03 - 140 ML CRISTAL", preco: 4.65, categoria: "Cosmético", desc: "R. 24/415", imagem: `${CDN}/68ff737d8814bd3df7ae2de0_68ff522224a1c7acfefc0edb_Frasco-3-140ml-24-415-302.0140.003.avif` },
  { id: 26, nome: "EMB. COSM. MOD. 03 - 200 ML CRISTAL", preco: 3.70, categoria: "Cosmético", desc: "R. 24/415", imagem: `${CDN}/68ff737e6ca40486c1f15596_68ff5255ea1905d0bf0b4d9a_Frasco-3-200ml-24-415-302.0200.003.avif` },
  { id: 27, nome: "EMB. COSM. MOD. 03 - 30 ML CRISTAL", preco: 1.50, categoria: "Cosmético", desc: "R. 20/415", imagem: `${CDN}/68ff737d1d0625a0dce68472_68ff510f0d5e94237e6b3c48_Frasco-3-30ml-20-410-250.0030.003.avif` },
  { id: 28, nome: "EMB. COSM. MOD. 03 - 60 ML CRISTAL", preco: 1.60, categoria: "Cosmético", desc: "R. 20/410", imagem: `${CDN}/68ff737c9ec3f2cc2640015c_68ff512277862e7e750dfcda_Frasco-3-60ml-20-410-300.0060.003.avif` },
  { id: 29, nome: "EMB. COSM. MOD. 04 - 100 ML CRISTAL", preco: 2.45, categoria: "Cosmético", desc: "R 20/415", imagem: `${CDN}/68ff737ec56b522134ff3c1c_68ff52c3330df82db1e639ca_Frasco-4-100ml-20-410-300.0100.004.avif` },
  { id: 30, nome: "EMB. COSM. MOD. 04 - 180 ML CRISTAL", preco: 1.65, categoria: "Cosmético", desc: "R. 24", imagem: `${CDN}/69ea207477cef79e3cfd82b7_Frasco-4-180ml-24-415-307.0180.004.avif` },
  { id: 31, nome: "EMB. COSM. MOD. 04 - 250 ML CRISTAL", preco: 1.56, categoria: "Cosmético", desc: "R. 24", imagem: `${CDN}/68ff737efd889fd60fe4740f_68ff5321fed131e8cf26e39b_Frasco-4-250ml-24-415-302.0250.004%2520(1).avif` },
  { id: 32, nome: "EMB. COSM. MOD. 05 - 100 ML CRISTAL", preco: 2.45, categoria: "Cosmético", desc: "R 20/415", imagem: `${CDN}/68ff737fb93e39fd3c84c1f5_68ff545bbecabe066f4d8aba_Frasco-5-100ml-20-410-300.0100.005.avif` },
  { id: 33, nome: "EMB. COSM. MOD. 05 - 200 ML CRISTAL", preco: 4.95, categoria: "Cosmético", desc: "R. 24/415", imagem: `${CDN}/68ff737f675206a13537b0f2_68ff547f0ddfca807071e671_Frasco-5-200ml-24-415-306.0200.005.avif` },
  { id: 34, nome: "EMB. COSM. MOD. 05 - 60 ML CRISTAL", preco: 1.98, categoria: "Cosmético", desc: "R. 20", imagem: `${CDN}/68ff737fc56b522134ff3ce0_68ff536177862e7e750ea5a3_Frasco-5-60ml-20-410-300.0060.005.avif` },
  { id: 35, nome: "EMB. COSM. MOD. 07 - 250 ML CRISTAL", preco: 5.80, categoria: "Cosmético", desc: "R. 24/415", imagem: `${CDN}/68ff7380ec269ed2084ed446_68ff54c921316023b61ead93_Frasco-7-250ml-24-415-302.0250.007.avif` },
  { id: 36, nome: "EMB. COSM. MOD. 07 - 60 ML AMBAR", preco: 1.45, categoria: "Cosmético", desc: "R. 20/415", imagem: `${CDN}/68ff737f269d3943d1968518_68ff54a949b0cd31fd6bb00e_Frasco-7-60ml-20-410-300.0060.007.avif` },
  { id: 37, nome: "EMB. COSM. MOD. 07 - 60 ML CRISTAL", preco: 2.30, categoria: "Cosmético", desc: "R. 20/410", imagem: `${CDN}/68ff737f269d3943d1968518_68ff54a949b0cd31fd6bb00e_Frasco-7-60ml-20-410-300.0060.007.avif` },
  { id: 38, nome: "EMB. COSM. MOD.19 - 120 ML AMBAR", preco: 2.70, categoria: "Cosmético", desc: "R. 24/415", imagem: `${CDN}/68ff7381af3d450f6b4a53b9_68ff55b61c37ca5dec6829d1_Frasco-19-120ml-24-415-307.0120.019.avif` },
  { id: 39, nome: "EMB. COSM. MOD. 19 - 120 ML CRISTAL", preco: 2.80, categoria: "Cosmético", desc: "R. 24/415", imagem: `${CDN}/68ff7381af3d450f6b4a53b9_68ff55b61c37ca5dec6829d1_Frasco-19-120ml-24-415-307.0120.019.avif` },
  { id: 40, nome: "EMB. COSM. MOD. 19 - 120 ML PRETO", preco: 2.80, categoria: "Cosmético", desc: "R. 24/415", imagem: `${CDN}/68ff7381af3d450f6b4a53b9_68ff55b61c37ca5dec6829d1_Frasco-19-120ml-24-415-307.0120.019.avif` },
  { id: 41, nome: "EMB. COSM. MOD. 19 - 210 ML CRISTAL", preco: 4.50, categoria: "Cosmético", desc: "R. 24/415", imagem: `${CDN}/68ff7382163fc1f2bba99223_68ff560e10079b2635bdcda9_Frasco-19-210ml-24-415-302.0210.019.avif` },
  { id: 42, nome: "EMB. COSM. MOD. 19 - 30 ML CRISTAL", preco: 1.85, categoria: "Cosmético", desc: "R. 18/415", imagem: `${CDN}/68ff738198b6e3a5f33f7a8a_68ff5576ea496252845c58a9_Frasco-19-30ml-18-415-140.0030.019.avif` },
  { id: 43, nome: "EMB. COSM. MOD. 19 - 80 ML CRISTAL", preco: 2.30, categoria: "Cosmético", desc: "R. 20/415", imagem: `${CDN}/68ff73813b9a14401356d1bd_68ff558cac7845deb715d7b1_Frasco-19-80ml-20-410-300.0080.019.avif` },
  { id: 44, nome: "EMB. COSM. MOD. 84 35ML", preco: 1.55, categoria: "Cosmético", desc: "", imagem: `${CDN}/68ff7389e18d239b985e792c_68ff5c63a3b994823c76cc76_Frasco-84-35ml-18-415-140.0035.084.avif` },
  { id: 45, nome: "EMB. SABON. 200 ML MOD.3 CRISTAL", preco: 2.95, categoria: "Sabonete", desc: "R.28" },
  { id: 46, nome: "EMB. SABON. 260 ML MOD. 05 CRISTAL", preco: 3.40, categoria: "Sabonete", desc: "" },
  { id: 47, nome: "EMB. SABON. 300ML MOD 40 BRANCO 23G", preco: 0.95, categoria: "Sabonete", desc: "" },
  { id: 48, nome: "EMB. SABON. 300 ML MOD.40 CRISTAL", preco: 4.20, categoria: "Sabonete", desc: "" },
  { id: 49, nome: "EMB. SABON. 300ML MOD.40 VIOLETA", preco: 0.95, categoria: "Sabonete", desc: "" },
  { id: 50, nome: "EMB. SABON. 300 ML MOD.4 BRANCO", preco: 1.25, categoria: "Sabonete", desc: "" },
  { id: 51, nome: "EMB. SABON. 300 ML MOD.4 CRISTAL", preco: 1.95, categoria: "Sabonete", desc: "PROMOÇÃO" },
  { id: 52, nome: "EMB. SABON. 300ML MOD.4 PRETO", preco: 1.95, categoria: "Sabonete", desc: "PROMOÇÃO" },
  { id: 53, nome: "EMB. SABON. 315 ML MOD. 01 BRANCO", preco: 1.25, categoria: "Sabonete", desc: "" },
  { id: 54, nome: "EMB. SABON. 315 ML MOD.1 CRISTAL", preco: 1.95, categoria: "Sabonete", desc: "PROMOÇÃO" },
  { id: 55, nome: "EMB. SABON. 380ML MOD.3 AZUL R.28", preco: 3.20, categoria: "Sabonete", desc: "" },
  { id: 56, nome: "LEMBRANCINHA DE NATAL SABONETE", preco: 15.90, categoria: "Sabonete", desc: "Diversos" },
];

const categorias = ["Todas", "Acetato", "Cosmético", "Sabonete"];

export default function SpilPage() {
  const [itens, setItens] = useState<Record<number, ItemPedido>>({});
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");
  const [busca, setBusca] = useState("");
  const [vendedor, setVendedor] = useState("");
  const [estoqueVisivel, setEstoqueVisivel] = useState<Record<number, boolean>>({});

  const produtosFiltrados = produtos.filter((produto) => {
    const matchCat = filtroCategoria === "Todas" || produto.categoria === filtroCategoria;
    const matchBusca = produto.nome.toLowerCase().includes(busca.toLowerCase()) ||
      produto.desc.toLowerCase().includes(busca.toLowerCase());
    return matchCat && matchBusca;
  });

  const updateCaixas = (produto: Produto, caixas: number) => {
    setItens((prev) => {
      const next = { ...prev };
      if (caixas <= 0) {
        delete next[produto.id];
      } else {
        next[produto.id] = {
          produto,
          caixas,
          estoque: next[produto.id]?.estoque ?? null,
        };
      }
      return next;
    });
  };

  const updateEstoque = (produtoId: number, valor: string) => {
    const num = valor === "" ? null : parseInt(valor) || null;
    setItens((prev) => {
      const item = prev[produtoId];
      if (!item) return prev;
      return { ...prev, [produtoId]: { ...item, estoque: num } };
    });
  };

  const toggleEstoqueVisivel = (produtoId: number) => {
    setEstoqueVisivel((prev) => ({ ...prev, [produtoId]: !prev[produtoId] }));
  };

  const totalItens = Object.keys(itens).length;
  const totalCaixas = Object.values(itens).reduce((s, i) => s + i.caixas, 0);
  const totalValor = Object.values(itens).reduce((s, i) => s + i.produto.preco * i.caixas, 0);

  const gerarRomaneio = () => {
    const sel = Object.values(itens);
    if (sel.length === 0) return;

    const grupos: Record<string, typeof sel> = {};
    for (const item of sel) {
      const cat = item.produto.categoria;
      if (!grupos[cat]) grupos[cat] = [];
      grupos[cat].push(item);
    }

    const catCores: Record<string, string> = {
      Acetato: "#92400e",
      "Cosmético": "#1d4ed8",
      Sabonete: "#7c3aed",
    };

    const rows: string[] = [];
    for (const [categoria, items] of Object.entries(grupos)) {
      const cor = catCores[categoria] || "#333";
      rows.push(`<tr><td colspan="5" style="padding:8px 10px;font-weight:800;font-size:14px;color:${cor};text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid ${cor};background:${cor}11;">${categoria}</td></tr>`);
      for (const item of items) {
        const temEstoque = item.estoque !== null && item.estoque !== undefined;
        rows.push(`<tr>
          <td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;font-weight:600;font-size:13px;color:#374151;">${item.produto.id}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;font-size:13px;"><strong>${item.produto.nome}</strong>${item.produto.desc ? `<br/><small style="color:#9ca3af;font-size:11px;">${item.produto.desc}</small>` : ""}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;text-align:center;font-weight:800;font-size:15px;color:${cor};">${item.caixas} CAIXA${item.caixas > 1 ? "S" : ""}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;text-align:right;font-size:13px;color:#6b7280;">R$ ${item.produto.preco.toFixed(2)}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:700;font-size:13px;">R$ ${(item.produto.preco * item.caixas).toFixed(2)}</td>
        </tr>`);
        if (temEstoque) {
          rows.push(`<tr><td colspan="5" style="padding:2px 10px 6px;font-size:11px;color:#d97706;background:#fffbeb;">Estoque atual: ${item.estoque}</td></tr>`);
        }
      }
    }

    const dataAtual = new Date().toLocaleDateString("pt-BR");
    const horaAtual = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      @page { size: A4 portrait; margin: 12mm; }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: Arial, Helvetica, sans-serif; color: #1f2937; font-size: 13px; }
      .header { background: linear-gradient(135deg, #92400e, #b45309); color: white; padding: 20px 24px; margin-bottom: 20px; }
      .header h1 { font-size: 22px; font-weight: 800; letter-spacing: -0.3px; }
      .header p { font-size: 12px; opacity: 0.85; margin-top: 4px; }
      .meta { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 16px; padding: 10px 14px; background: #f9fafb; border-radius: 6px; }
      .meta strong { color: #92400e; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
      th { background: #92400e; color: white; padding: 8px 10px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
      .total-row { background: #fef3c7; font-weight: 800; }
      .total-row td { padding: 10px; border-top: 2px solid #92400e; font-size: 14px; }
      .sig { margin-top: 40px; display: flex; justify-content: space-between; font-size: 12px; color: #9ca3af; }
      .sig div { text-align: center; }
      .sig hr { border: none; border-top: 1px solid #d1d5db; width: 200px; margin: 40px auto 6px; }
      .footer { text-align: center; margin-top: 30px; padding-top: 12px; border-top: 1px solid #e5e7eb; font-size: 10px; color: #9ca3af; }
    </style></head><body>
      <div class="header">
        <h1>SPIL FRASCOS</h1>
        <p>Romaneio de Pedido</p>
      </div>
      <div class="meta">
        <span><strong>Data:</strong> ${dataAtual} ${horaAtual}</span>
        <span><strong>Vendedor(a):</strong> ${vendedor || "_______________"}</span>
        <span><strong>Total:</strong> ${totalCaixas} CAIXA${totalCaixas > 1 ? "S" : ""} | R$ ${totalValor.toFixed(2)}</span>
      </div>
      <table>
        <thead><tr>
          <th style="width:40px;">#</th>
          <th>Produto</th>
          <th style="width:90px;text-align:center;">Qtd</th>
          <th style="width:70px;text-align:right;">Unit.</th>
          <th style="width:80px;text-align:right;">Total</th>
        </tr></thead>
        <tbody>
        ${rows.join("")}
        <tr class="total-row">
          <td colspan="2" style="text-align:right;">TOTAL GERAL</td>
          <td style="text-align:center;font-size:16px;color:#92400e;">${totalCaixas} CX</td>
          <td></td>
          <td style="text-align:right;font-size:16px;color:#92400e;">R$ ${totalValor.toFixed(2)}</td>
        </tr>
        </tbody>
      </table>
      <div class="sig">
        <div><hr/>Assinatura / Carimbo</div>
        <div><hr/>Data da Entrega</div>
      </div>
      <div class="footer">Tulipa Fragrâncias - Rua Amador Bueno, 44 - Cajuru - Curitiba/PR - CEP: 82.960-020</div>
    </body></html>`;

    const iframe = document.createElement("iframe");
    iframe.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;border:none;z-index:9999;";
    document.body.appendChild(iframe);
    const doc = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document);
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();
      iframe.contentWindow!.focus();
      iframe.contentWindow!.print();
      setTimeout(() => { try { document.body.removeChild(iframe); } catch {} }, 30000);
    } else {
      document.body.removeChild(iframe);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div className="header">
        <div className="container header-inner">
          <a href="/pedidos-fornecedores" className="back-btn">← Voltar</a>
          <img src="/logo.jpg" alt="Tulipa" className="header-logo" />
          <div className="header-text">
            <h1>🧴 SPIL Frascos</h1>
            <p>Frascos plásticos cosméticos, sabonete e acetatos</p>
          </div>
        </div>
      </div>

      <main style={{ flex: 1 }}>
        <div className="container" style={{ paddingTop: 20 }}>

          <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Buscar frasco..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={{ flex: 1, minWidth: 200, padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: "0.95rem" }}
            />
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {categorias.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFiltroCategoria(cat)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                    background: filtroCategoria === cat ? "#92400e" : "white",
                    color: filtroCategoria === cat ? "white" : "#333",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
            {produtosFiltrados.map((produto) => {
              const item = itens[produto.id];
              const caixas = item?.caixas || 0;
              const temItem = caixas > 0;
              const estoqueOn = estoqueVisivel[produto.id] || false;

              const catColor: Record<string, string> = {
                Acetato: "#92400e",
                "Cosmético": "#1d4ed8",
                Sabonete: "#7c3aed",
              };
              const cor = catColor[produto.categoria] || "#333";

              return (
                <div
                  key={produto.id}
                  style={{
                    background: "white",
                    borderRadius: 14,
                    border: temItem ? `2px solid ${cor}` : "1px solid #e2e8f0",
                    overflow: "hidden",
                    boxShadow: temItem ? `0 4px 16px ${cor}22` : "0 1px 4px rgba(0,0,0,0.06)",
                    transition: "all 0.15s",
                  }}
                >
                  {produto.imagem && (
                    <div style={{
                      height: 130,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#f8f9fa",
                      padding: 10,
                      borderBottom: "1px solid #f1f5f9",
                    }}>
                      <img
                        src={produto.imagem}
                        alt={produto.nome}
                        style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                        loading="lazy"
                      />
                    </div>
                  )}
                  {!produto.imagem && (
                    <div style={{
                      height: 60,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#f8f9fa",
                      borderBottom: "1px solid #f1f5f9",
                    }}>
                      <span style={{ fontSize: "0.7rem", color: "#cbd5e1" }}>Sem foto</span>
                    </div>
                  )}

                  <div style={{ padding: "10px 12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6, marginBottom: 6 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span style={{
                          display: "inline-block",
                          padding: "2px 7px",
                          background: `${cor}11`,
                          color: cor,
                          borderRadius: 4,
                          fontSize: "0.6rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.3px",
                          marginBottom: 3,
                        }}>
                          {produto.categoria}
                        </span>
                        <h3 style={{ margin: 0, fontSize: "0.8rem", fontWeight: 700, lineHeight: 1.3, color: "#111" }}>
                          {produto.nome}
                        </h3>
                        {produto.desc && (
                          <p style={{ margin: "2px 0 0", fontSize: "0.65rem", color: "#9ca3af" }}>{produto.desc}</p>
                        )}
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: "0.95rem", fontWeight: 800, color: cor }}>
                          R$ {produto.preco.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #f1f5f9", paddingTop: 8, gap: 6, flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 0, border: "2px solid #e2e8f0", borderRadius: 10, overflow: "hidden" }}>
                        <button
                          onClick={() => updateCaixas(produto, caixas - 1)}
                          disabled={caixas === 0}
                          style={{
                            width: 34, height: 34, border: "none", background: "#f9fafb",
                            cursor: caixas === 0 ? "not-allowed" : "pointer",
                            fontSize: "1.1rem", fontWeight: 700, opacity: caixas === 0 ? 0.3 : 1,
                            color: cor,
                          }}
                        >−</button>
                        <input
                          type="number"
                          min={0}
                          value={caixas}
                          onChange={(e) => updateCaixas(produto, parseInt(e.target.value) || 0)}
                          style={{
                            width: 44, height: 34, textAlign: "center", border: "none",
                            borderLeft: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0",
                            fontSize: "1rem", fontWeight: 800, fontFamily: "inherit",
                          }}
                        />
                        <button
                          onClick={() => updateCaixas(produto, caixas + 1)}
                          style={{
                            width: 34, height: 34, border: "none", background: "#f9fafb",
                            cursor: "pointer", fontSize: "1.1rem", fontWeight: 700, color: cor,
                          }}
                        >+</button>
                        <span style={{ fontSize: "0.65rem", color: "#9ca3af", fontWeight: 600, paddingLeft: 5, paddingRight: 7 }}>cx</span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <label style={{ fontSize: "0.65rem", color: "#9ca3af", cursor: "pointer", userSelect: "none" }}>Estoque</label>
                        <div
                          onClick={() => toggleEstoqueVisivel(produto.id)}
                          style={{
                            width: 30, height: 16, borderRadius: 8, cursor: "pointer",
                            background: estoqueOn ? cor : "#d1d5db",
                            position: "relative", transition: "background 0.2s",
                          }}
                        >
                          <div style={{
                            width: 12, height: 12, borderRadius: "50%", background: "white",
                            position: "absolute", top: 2, left: estoqueOn ? 16 : 2,
                            transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                          }} />
                        </div>
                        {estoqueOn && (
                          <input
                            type="number"
                            min={0}
                            placeholder="0"
                            value={item?.estoque ?? ""}
                            onChange={(e) => updateEstoque(produto.id, e.target.value)}
                            style={{
                              width: 48, height: 24, textAlign: "center",
                              border: "1px solid #e2e8f0", borderRadius: 6,
                              fontSize: "0.75rem", background: "#fffbeb",
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {totalItens > 0 && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          background: "white", borderTop: "1px solid #e2e8f0",
          padding: "12px 16px", display: "flex", justifyContent: "space-between",
          alignItems: "center", boxShadow: "0 -4px 16px rgba(0,0,0,0.08)",
          zIndex: 50, flexWrap: "wrap", gap: 10,
        }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ textAlign: "center", background: "#fef3c7", padding: "6px 14px", borderRadius: 10 }}>
              <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "#92400e" }}>{totalItens}</div>
              <div style={{ fontSize: "0.55rem", color: "#92400e", textTransform: "uppercase", fontWeight: 700 }}>itens</div>
            </div>
            <div style={{ textAlign: "center", background: "#fef3c7", padding: "6px 14px", borderRadius: 10 }}>
              <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "#92400e" }}>{totalCaixas}</div>
              <div style={{ fontSize: "0.55rem", color: "#92400e", textTransform: "uppercase", fontWeight: 700 }}>caixas</div>
            </div>
            <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#374151" }}>
              R$ {totalValor.toFixed(2)}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="text"
              placeholder="Vendedor(a)"
              value={vendedor}
              onChange={(e) => setVendedor(e.target.value)}
              style={{ padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: "0.85rem", width: 150 }}
            />
            <button
              onClick={gerarRomaneio}
              style={{
                padding: "10px 18px", borderRadius: 10, border: "none",
                background: "linear-gradient(135deg, #92400e, #b45309)",
                color: "white", cursor: "pointer", fontWeight: 800, fontSize: "0.9rem",
                boxShadow: "0 4px 12px rgba(146,64,14,0.25)",
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              📄 Gerar Romaneio
            </button>
          </div>
        </div>
      )}

      <div style={{ height: totalItens > 0 ? 70 : 0 }} />

      <footer style={{ textAlign: "center", padding: "20px", fontSize: "0.8rem", color: "#94a3b8", borderTop: "1px solid #e2e8f0", background: "white" }}>
        <p>© {new Date().getFullYear()} VENDEDORAS - TULIPA 🌷</p>
      </footer>
    </div>
  );
}
