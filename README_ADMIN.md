# SIM Studio - Admin Panel Documentation

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Pré-requisitos](#pré-requisitos)
3. [Configuração do Supabase](#configuração-do-supabase)
4. [Variáveis de Ambiente](#variáveis-de-ambiente)
5. [Instalação](#instalação)
6. [Acesso ao Admin](#acesso-ao-admin)
7. [Gerenciamento de Conteúdo](#gerenciamento-de-conteúdo)
8. [Gerenciamento de Mídia](#gerenciamento-de-mídia)
9. [Deploy na Vercel](#deploy-na-vercel)

---

## Visão Geral

Sistema administrativo completo para gerenciamento de conteúdo do site SIM Studio.

### Rotas do Admin

- `/admin/login` - Login administrativo
- `/admin/dashboard` - Visão geral
- `/admin/content` - Gerenciar textos
- `/admin/media` - Gerenciar imagens/vídeos
- `/admin/settings` - Configurações do site

---

## Pré-requisitos

- Node.js 18+
- Conta no Supabase (gratuita)
- Conta na Vercel (para deploy)

---

## Configuração do Supabase

### 1. Criar Projeto

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "New Project"
3. Preencha os dados do projeto
4. Aguarde a criação (2-3 minutos)

### 2. Executar Schema SQL

1. No dashboard do Supabase, vá em **SQL Editor**
2. Copie o conteúdo de `supabase/schema.sql`
3. Cole e execute
4. Confirme que todas as tabelas foram criadas

### 3. Criar Usuário Admin

1. Vá em **Authentication** > **Users**
2. Clique em **Add user**
3. Use as credenciais abaixo (ou crie as suas):
   - **Email:** `jay@admin.com.br`
   - **Senha:** `JayAdmin01`
4. **Importante:** Guarde estas credenciais em local seguro

### 4. Configurar Storage

1. Vá em **Storage**
2. Crie 3 buckets públicos:
   - `images` (público)
   - `videos` (público)
   - `documents` (privado)

3. Para cada bucket, em **Policies**:
   - Adicione policy para permitir upload de usuários autenticados

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Como obter:

1. No Supabase, vá em **Settings** > **API**
2. Copie **Project URL** → `VITE_SUPABASE_URL`
3. Copie **anon public** key → `VITE_SUPABASE_ANON_KEY`

---

## Instalação

```bash
# Instalar dependências
npm install

# Iniciar desenvolvimento
npm run dev

# Build de produção
npm run build
```

---

## Acesso ao Admin

### Métodos de Acesso

**1. URL Direta:**
- Acesse: `http://localhost:5173/admin`

**2. Botão Discreto (Footer):**
- No rodapé do site, há um pequeno ponto (`•`) quase invisível
- Passe o mouse sobre ele para revelar
- Clique para acessar o admin

**3. Atalho de Teclado:**
- Pressione `Ctrl + Shift + A` (Windows/Linux)
- Ou `Cmd + Shift + A` (Mac)
- Acesso imediato ao admin

### Login

1. Acesse uma das formas acima
2. Use as credenciais:
   - **Email:** `jay@admin.com.br`
   - **Senha:** `JayAdmin01`
3. Redirecionado para `/admin/dashboard`

---

## Gerenciamento de Conteúdo

### Editar Textos

1. Vá em **Conteúdo**
2. Encontre o conteúdo desejado
3. Clique em **Editar**
4. Modifique o valor
5. Pressione Enter ou clique em **Salvar**

### Categorias de Conteúdo

- `hero` - Textos da seção hero
- `about` - Textos sobre/manifesto
- `services` - Cards de serviço
- `footer` - Rodapé
- `config` - Configurações gerais

---

## Gerenciamento de Mídia

### Upload de Imagens

1. Vá em **Mídia**
2. Clique em **Upload** (em desenvolvimento)
3. Selecione o arquivo
4. Crop automático será aberto
5. Ajuste e confirme
6. Imagem será otimizada para WebP

### Formatos Suportados

- **Imagens:** PNG, JPG, JPEG → WebP | SVG, AVIF (mantidos)
- **Vídeos:** MP4, WEBM, MOV

### Otimização

- Conversão automática para WebP
- Redução de peso sem perda perceptível
- Manutenção de qualidade visual

---

## Deploy na Vercel

### 1. Preparar

```bash
# Testar build localmente
npm run build
```

### 2. Conectar na Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Importe o repositório
3. Configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### 3. Deploy

```bash
# Instale a CLI da Vercel
npm i -g vercel

# Deploy
vercel
```

### 4. Pós-Deploy

- O site público estará em `seu-domínio.vercel.app`
- O admin estará em `seu-domínio.vercel.app/admin`
- Configure domínio personalizado nas configurações da Vercel

---

## Estrutura de Arquivos

```
src/
├── admin/                    # Painel administrativo
│   ├── components/
│   │   └── AdminLayout.tsx
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── ContentList.tsx
│   │   ├── MediaLibrary.tsx
│   │   └── Settings.tsx
│   └── AdminApp.tsx
├── hooks/
│   ├── useAuth.ts           # Autenticação
│   └── useContent.ts        # Conteúdo dinâmico
├── lib/
│   └── supabase.ts          # Cliente Supabase
├── types/
│   └── admin.ts             # Tipos TypeScript
└── main.tsx                 # Entry point com rotas
```

---

## Segurança

### Proteção de Rotas

- Todas as rotas `/admin/*` requerem autenticação
- Redirecionamento automático para login
- Sessão persistente via Supabase Auth

### Boas Práticas

- Nunca exponha chaves secretas no frontend
- Use apenas `anon key` no cliente
- RLS (Row Level Security) habilitado no banco
- Validação de uploads de arquivos

---

## Solução de Problemas

### Erro: "Supabase credentials not configured"

- Verifique se o arquivo `.env` existe
- Confirme que as variáveis estão corretas
- Reinicie o servidor de desenvolvimento

### Erro: "Failed to fetch content"

- Verifique conexão com Supabase
- Confirme que o schema SQL foi executado
- Verifique políticas de RLS

### Build falha na Vercel

- Confirme variáveis de ambiente no dashboard da Vercel
- Execute `npm run build` localmente primeiro
- Verifique logs de erro no dashboard da Vercel

---

## Suporte

Para dúvidas ou problemas:

1. Verifique esta documentação
2. Consulte logs do console no navegador
3. Verifique logs do Supabase Dashboard
4. Revise políticas de RLS e permissões

---

**Versão:** 1.0.0  
**Última atualização:** 2026
