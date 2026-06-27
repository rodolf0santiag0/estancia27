-- =========================================================================
-- BANCO DE DADOS - PLATAFORMA ESTÂNCIA 27
-- Arquitetura Híbrida: E-Commerce Premium & Sistema de Rifas/Ações
-- =========================================================================

-- 1. ENUMS E TIPOS CUSTOMIZADOS
create type public.product_category as enum ('Corte', 'Mate', 'Termicos', 'Outros');
create type public.raffle_status as enum ('Rascunho', 'Ativa', 'Concluida');
create type public.payment_status as enum ('Pendente', 'Pago', 'Cancelado');
create type public.ticket_status as enum ('Reservado', 'Pago');

-- 2. TABELA: PROFILES (Extensão do auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  nome_completo text,
  telefone text,
  cpf text unique,
  role text not null default 'user' check (role in ('user', 'admin')),
  criado_em timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. TABELA: PRODUCTS (E-commerce & Inventário)
create table public.products (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  descricao text,
  preco numeric(10,2) not null check (preco >= 0),
  categoria public.product_category not null default 'Outros',
  estoque integer not null default 0 check (estoque >= 0),
  sku text unique,
  erp_id text unique,
  imagem_url text,
  criado_em timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. TABELA: RAFFLES (Campanhas de Rifas)
create table public.raffles (
  id uuid default gen_random_uuid() primary key,
  titulo text not null,
  descricao text,
  produto_premio_id uuid references public.products(id) on delete set null,
  valor_cota numeric(10,2) not null check (valor_cota >= 0),
  total_cotas integer not null check (total_cotas > 0),
  cotas_vendidas integer not null default 0 check (cotas_vendidas >= 0),
  status public.raffle_status not null default 'Rascunho',
  data_sorteio timestamp with time zone,
  criado_em timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. TABELA: ORDERS (Pedidos de Compras e Rifas)
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  valor_total numeric(10,2) not null check (valor_total >= 0),
  status_pagamento public.payment_status not null default 'Pendente',
  gateway_id text,
  criado_em timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. TABELA: TICKETS (Números da Sorte das Rifas)
create table public.tickets (
  id uuid default gen_random_uuid() primary key,
  raffle_id uuid references public.raffles(id) on delete cascade not null,
  profile_id uuid references public.profiles(id) on delete set null,
  order_id uuid references public.orders(id) on delete set null,
  numero integer not null check (numero >= 0),
  status public.ticket_status not null default 'Reservado',
  
  -- REGRA CRÍTICA: Garante que o mesmo número não seja vendido duas vezes na mesma rifa
  constraint unique_raffle_numero unique (raffle_id, numero)
);

-- =========================================================================
-- INDEXAÇÃO PARA PERFORMANCE
-- =========================================================================
create index idx_products_sku on public.products(sku);
create index idx_products_categoria on public.products(categoria);
create index idx_raffles_status on public.raffles(status);
create index idx_orders_profile_id on public.orders(profile_id);
create index idx_tickets_raffle_id on public.tickets(raffle_id);
create index idx_tickets_profile_id on public.tickets(profile_id);
create index idx_tickets_order_id on public.tickets(order_id);

-- =========================================================================
-- CRIAÇÃO AUTOMÁTICA DE PROFILES (TRIGGER & FUNCTION)
-- =========================================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nome_completo, telefone, cpf, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome_completo', new.raw_user_meta_data->>'full_name'),
    new.raw_user_meta_data->>'telefone',
    new.raw_user_meta_data->>'cpf',
    'user'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger para criar o perfil logo após a criação do usuário no Auth
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =========================================================================
-- CONFIGURAÇÃO DE SEGURANÇA (RLS)
-- =========================================================================

-- Habilitando RLS em todas as tabelas
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.raffles enable row level security;
alter table public.orders enable row level security;
alter table public.tickets enable row level security;

-- Função auxiliar para validar se o usuário é administrador
create or replace function public.is_admin()
returns boolean security definer as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql;

-- -------------------------------------------------------------------------
-- POLÍTICAS: PROFILES
-- -------------------------------------------------------------------------
create policy "Profiles are viewable by owner or admin"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "Profiles are updatable by owner or admin"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin());

create policy "Profiles can be inserted by owner or admin"
  on public.profiles for insert
  with check (auth.uid() = id or public.is_admin());

-- -------------------------------------------------------------------------
-- POLÍTICAS: PRODUCTS
-- -------------------------------------------------------------------------
create policy "Products are viewable by everyone"
  on public.products for select
  using (true);

create policy "Products are manageable by admin"
  on public.products for all
  using (public.is_admin())
  with check (public.is_admin());

-- -------------------------------------------------------------------------
-- POLÍTICAS: RAFFLES
-- -------------------------------------------------------------------------
create policy "Raffles are viewable by everyone"
  on public.raffles for select
  using (true);

create policy "Raffles are manageable by admin"
  on public.raffles for all
  using (public.is_admin())
  with check (public.is_admin());

-- -------------------------------------------------------------------------
-- POLÍTICAS: ORDERS
-- -------------------------------------------------------------------------
create policy "Orders are viewable by owner or admin"
  on public.orders for select
  using (auth.uid() = profile_id or public.is_admin());

create policy "Orders can be created by owner or admin"
  on public.orders for insert
  with check (auth.uid() = profile_id or public.is_admin());

create policy "Orders can be updated by admin"
  on public.orders for update
  using (public.is_admin())
  with check (public.is_admin());

-- -------------------------------------------------------------------------
-- POLÍTICAS: TICKETS
-- -------------------------------------------------------------------------
create policy "Tickets are viewable by everyone"
  on public.tickets for select
  using (true);

create policy "Tickets can be inserted by owner or admin"
  on public.tickets for insert
  with check (auth.uid() = profile_id or public.is_admin());

create policy "Tickets can be updated by admin"
  on public.tickets for update
  using (public.is_admin())
  with check (public.is_admin());
