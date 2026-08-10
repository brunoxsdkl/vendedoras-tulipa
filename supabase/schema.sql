-- Tulipa Vendedoras - schema do banco de cursos
-- Rode este script no SQL Editor do Supabase (Dashboard > SQL Editor > New query)

create table if not exists public.cursos (
  id uuid primary key,
  nome text not null,
  slug text,
  descricao text default '',
  horario text default '',
  vagas int default 20,
  valor numeric default 0,
  data date,
  criado_em timestamptz not null default now()
);

create table if not exists public.alunos (
  id uuid primary key,
  curso_id uuid references public.cursos (id) on delete cascade,
  nome text not null,
  telefone text default '',
  whatsapp text default '',
  cpf text,
  email text,
  data_nascimento text,
  cidade text,
  valor_curso numeric,
  forma_pagamento text,
  parcelas int default 1,
  valor_parcela numeric,
  status_pagamento text default 'Pendente',
  pago int default 0,
  pendente int default 0,
  data_pagamento text,
  data_inscricao timestamptz not null default now()
);

create table if not exists public.pagamentos (
  id uuid primary key,
  aluno_id uuid references public.alunos (id) on delete cascade,
  data text,
  valor numeric,
  forma text,
  observacao text
);

create table if not exists public.interessados (
  id uuid primary key,
  nome text not null,
  email text default '',
  telefone text default '',
  cursos text[] default '{}',
  status text default 'Interessado',
  observacao text default '',
  criado_em timestamptz not null default now()
);

create index if not exists alunos_curso_id_idx on public.alunos (curso_id);
create index if not exists pagamentos_aluno_id_idx on public.pagamentos (aluno_id);

-- RLS: libera acesso total para a chave anon (usada pelo site)
alter table public.cursos enable row level security;
alter table public.alunos enable row level security;
alter table public.pagamentos enable row level security;
alter table public.interessados enable row level security;

drop policy if exists "cursos_all_anon" on public.cursos;
create policy "cursos_all_anon" on public.cursos
  for all to anon using (true) with check (true);

drop policy if exists "alunos_all_anon" on public.alunos;
create policy "alunos_all_anon" on public.alunos
  for all to anon using (true) with check (true);

drop policy if exists "pagamentos_all_anon" on public.pagamentos;
create policy "pagamentos_all_anon" on public.pagamentos
  for all to anon using (true) with check (true);

drop policy if exists "interessados_all_anon" on public.interessados;
create policy "interessados_all_anon" on public.interessados
  for all to anon using (true) with check (true);
