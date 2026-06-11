# SIM Admin CMS

## Fase 1 — Mapeamento
- Entrada: `src/App.tsx`.
- Navegação pública: state-based (`home`, `work`, `studio`, `estimate`) sem React Router.
- Rotas admin: controladas por `window.location.pathname` em `src/admin/AdminApp.tsx`.
- Textos hardcoded principais: `Hero`, `Nav`, `Footer`, `Manifesto`, `Services`, `AIAgent`, `Estimate`, `WorkGrid`, `StudioPage`.
- Imagens: `Hero`, `src/data/projects.ts`, `StudioPage`, `WorkGrid`, `CaseStudy`.
- Vídeos: não havia vídeo renderizado no site público; foi criado slot editável `video.reel`.
- Dependências originais: React, React DOM, Vite, Tailwind v4, clsx, tailwind-merge.

## Fase 2 — Arquitetura
- Supabase client: `src/lib/supabase.ts`.
- Auth: `src/contexts/AuthContext.tsx`.
- CMS Provider: `src/hooks/useCMS.tsx`.
- Repositório local/Supabase: `src/lib/cmsRepository.ts`.
- Seed: `src/data/cmsSeed.ts`.
- Tipos: `src/types/cms.ts`.

## Fase 3 — Rotas Admin
- `/admin/login`
- `/admin/dashboard`
- `/admin/content`
- `/admin/media`
- `/admin/settings`

## Fase 4 — Banco Supabase
Execute:
- `src/supabase/schema.sql`
- `src/supabase/storage-policies.sql`

Tabelas:
- `content_items`: textos e campos editáveis.
- `media_assets`: imagens, vídeos e documentos.
- `site_settings`: configurações globais.

Campos principais:
- `id`
- `friendly_name` / `name`
- `category`
- `type` / `kind`
- `value` / `url`
- `mime_type`
- `size`
- `width`, `height`, `duration`, `ratio`
- `created_at`, `updated_at`, `updated_by`

## Fase 5 — Storage
Buckets:
- `images`
- `videos`
- `documents`

Leitura pública e escrita apenas para usuários autenticados.

## Fase 6 — Upload e Crop
- Validação de tipo e limite de 50MB em `src/lib/mediaUtils.ts`.
- Imagens PNG/JPG/JPEG/WEBP são recortadas e exportadas como WEBP.
- SVG e AVIF são preservados.
- Crop obrigatório com `react-easy-crop` em `src/admin/components/CropModal.tsx`.
- Vídeos mostram metadados: formato, peso, resolução, duração e preview.

## Fase 7 — Edit Mode
- Botão discreto no site público quando o admin está logado.
- Arquivo: `src/components/EditMode.tsx`.
- Edita conteúdo por modal sem sair da página.

## Fase 8 — Como acessar
1. Configure `.env` usando `.env.example`.
2. Crie um usuário no Supabase Auth.
3. Acesse `/admin/login`.
4. Após login, vá para `/admin/dashboard`.

Credencial demo opcional local:
- Por padrão, funciona quando Supabase não estiver configurado. Para desativar, defina `VITE_ENABLE_DEMO_ADMIN=false`.
- Email: `jay@admin.com.br`
- Senha: `JayAdmin01`

## Fase 9 — Uso
Adicionar conteúdo:
- Inserir item em `content_items` ou ampliar `src/data/cmsSeed.ts`.
- Use ID único, nome amigável, categoria, tipo e valor.

Substituir imagens:
- `/admin/media` → selecione imagem → upload → crop obrigatório → confirmar.

Substituir vídeos:
- `/admin/media` → filtre por video → upload MP4/WEBM/MOV → salvar.

Deploy Vercel:
- Configure env vars no painel Vercel.
- `vercel.json` já redireciona `/admin/*` para SPA.
- Build command: `npm run build`.

## Variáveis de ambiente
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_ENABLE_DEMO_ADMIN` opcional para desenvolvimento.

## Observação visual
O layout público foi preservado. Conteúdo dinâmico usa fallback igual ao texto/imagem original quando Supabase/localStorage não tem alteração.