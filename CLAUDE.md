# Allaser — projeto Pefaz

Site estático em construção pra substituir o WordPress atual em [allaser.com.br](https://allaser.com.br). Hospedagem: Napoleon (Brasil).

> **Pra Claude lendo este arquivo**: este projeto é colaborativo entre 2 devs. Antes de qualquer alteração maior, rode `git log --oneline -15` pra ver os commits recentes. Mantenha este arquivo atualizado quando tomar decisões arquiteturais ou concluir páginas/features.

---

## Equipe e fluxo

- **Rodrigo Carfon** (`@rodrigo-carfon`) — owner do repo, fez o design da home + setup inicial
- **Facure** (`@f4cure-collab`) — collaborator, atua em pares com Claude

Ambos com push access direto na `main`. Não usamos PRs (apenas 2 pessoas). Para mudanças grandes, comunicar antes via WhatsApp.

**Fluxo padrão:**
1. `git pull` ANTES de editar (evita conflitos)
2. Editar
3. Commits atômicos com mensagens descritivas em PT-BR (minúsculo)
4. `git push`

---

## Stack

- **Site público**: HTML5 + CSS3 + Vanilla JS. Sem framework. Sem build step. Abre direto no navegador (com servidor estático).
- **Admin**: PHP 8.1+ apenas em `/admin/`. Justificativa: editar credenciados sem mexer em código.
- **Externos**: Google Fonts (Plus Jakarta Sans + Outfit + DM Sans), three.js via CDN (hero), API do IBGE (mapa do buscador).

---

## Estrutura

```
Pefaz/
├── CLAUDE.md                      ← este arquivo (contexto do projeto)
├── index.html                     ← home (única página de conteúdo pronta)
├── encontre.html                  ← busca de credenciados
├── _template.html                 ← esqueleto pra novas páginas
├── assets/
│   ├── shared.css                 ← reset + tokens + header/footer + responsivo
│   ├── components.js              ← injeta header+footer compartilhados
│   ├── shared.js                  ← scroll header, menu mobile, FAQ accordion
│   ├── cursos-data.js             ← catálogo centralizado de cursos (window.CURSOS_DATA)
│   ├── images/                    ← assets locais (logo, fotos, thumbs, banners)
│   └── data/
│       └── credenciados.json      ← profissionais (editado via admin)
└── admin/                         ← painel PHP (auth + CRUD + multi-user)
    ├── _auth.php                  ← helpers + CSRF + sessão (include)
    ├── _header.php                ← header visual compartilhado (include)
    ├── admin.css                  ← visual do painel (segue identidade do site)
    ├── credenciados-importar.php  ← upload de CSV pra criar credenciados em massa
    ├── editar.php                 ← form de credenciado
    ├── index.php                  ← lista credenciados
    ├── login.php / logout.php
    ├── meus-dados.php             ← trocar nome/senha próprios
    ├── salvar.php                 ← endpoint CRUD credenciado
    ├── setup.php                  ← cria 1º admin (auto-bloqueia)
    ├── usuario-novo.php           ← form de usuário
    ├── usuario-salvar.php         ← endpoint CRUD usuário
    ├── usuarios.php               ← lista usuários
    ├── .htaccess                  ← protege users.json e includes
    └── backups/
        └── .htaccess              ← bloqueia listagem dos backups
```

---

## Convenções

- **Variáveis CSS globais** ficam em `:root` no `shared.css` (paleta `--lime`, `--dark-*`, `--gray-*`).
- **Componentes com paleta própria** isolam sob seletor (ex: `.buscador-wrap` usa `--brand`, `--s0`–`--s9`). Padrão a seguir pra novos componentes que tragam estilo próprio.
- **Caminhos**: absolutos a partir da raiz (`/assets/...`, `/admin/...`). Assume hospedagem na raiz do domínio. **Subpath quebraria** todo o site.
- **Header/footer do site público**: NÃO duplicar em páginas. Usar placeholders `<div id="site-header"></div>` e `<div id="site-footer"></div>` que o `components.js` preenche.
- **Header do admin**: NÃO duplicar entre páginas do `/admin/`. Usar `<?php $active_page = 'X'; include __DIR__ . '/_header.php'; ?>` no topo do `<body>` (X = `'credenciados'`, `'usuarios'` ou `'meus-dados'`). Editar `admin/_header.php` propaga a mudança em todas as páginas do admin.
- **Item de menu ativo**: cada página chama `setActiveNav('home')` (ou `'cursos'`, `'encontre'`...) no fim do `<body>`.
- **Commits**: PT-BR, minúsculo, atômicos (1 unidade de trabalho por commit), corpo explica o porquê não o quê.

---

## Páginas

| Estado | Página | Arquivo | Notas |
|---|---|---|---|
| ✅ | Home | `index.html` | **Refocada em conversão de cursos**: Hero V2 (foto Daiane + fundo abstrato em .webp) → catálogo no mesmo padrão do hub `/cursos.html` (sidebar de filtro por categoria + resultados agrupados com títulos de seção, pôsteres 9:16). Reaproveita as classes `.cursos-explorer/.cursos-filter/.filter-item/.cursos-results/.course-card` do hub — se atualizar layout num, replicar no outro. → seção Professora Daiane (#professores). Carrossel de destaques e catálogo em grid único removidos em 2026-06/07. Modal de captura ainda no DOM mas órfão (sem trigger). |
| ✅ | Encontre profissional | `encontre.html` | Mapa SVG do Brasil (IBGE), filtros, JSON com 35 credenciados |
| ❌ | ~~Cursos~~ | ~~`cursos.html`~~ | **Deletada em 2026-07-21** — Home já lista todos os 30 cursos em `#cursos-home` no mesmo padrão. Links pra `/cursos.html` no site foram redirecionados pra `/index.html#cursos-home`. Item "Cursos" removido do menu (desktop+mobile+footer) e botão "Ver Cursos" do header também. |
| ✅ | Sobre / Quem Somos | `sobre.html` | Tema claro. Hero + Missão/Visão/Valores + fundadora (Dra. Daiane) + CTA. **Recebeu (2026-06-09)** seções movidas da home: Por que Allaser, Depoimentos em vídeo, FAQ (#faq). A seção Professora Daiane (#professores) voltou pra home em 2026-06-26. Reorganizar depois. |
| 🔲 | Professores | `professores.html` | |
| 🔲 | FAQ completo | `faq.html` | |
| ✅ | Sobre o Laser | `sobre-o-laser.html` | Recriada do WP. Sub-nav sticky com scrollspy. Âncoras: #historia, #reparacao, #analgesico, #antiinflamatorio, #contraindicacoes, #tiposdelaser, #equipamentos. Imagens locais `laser-*` em `/assets/images/` |
| 🔲 | Contato | `contato.html` | |
| ✅ | Blog (index + posts) | `blog.html` + `blog/` | Estático, gerado por `scripts/generate-blog.js` a partir da API WP. 78 posts com imagem, sidebar Start Laser, posts relacionados, filtros por categoria. **Autonomia do WP concluída em 2026-07-04**: 187 imagens do `wp-content/uploads/` baixadas pra `assets/images/blog/` e 990 URLs reescritas nos posts. Zero refs WP restantes — pode desligar o WordPress sem quebrar o blog. |
| ✅ | Categorias do blog | filtro local no `blog.html?cat=<slug>` | Reaproveita o filtro por `data-cat` que já existia. Adicionado `data-cat-slug` em cada botão + suporte a `?cat=<slug>` na URL (JS lê no load, aplica filtro, cliques atualizam URL via `history.replaceState`). Footer aponta pra `/blog.html?cat=X` — não gera páginas separadas por categoria. |
| ✅ | LP Fotobiomodulação na Oncologia (curso completo) | `lps/cursos/fotobiomodulacao-na-oncologia.html` | Criada em 2026-06-26 a partir da LP da masterclass de oncologia. Mesma identidade visual, mesmas imagens, mesmos 6 tópicos. Adapta copy para "curso completo" (CTA "Quero me matricular", "Acesso imediato após a inscrição"). Form posta em `/lps/cursos/submit-lead.php`, redirect pós-submit para `https://allasercursos.odoo.com/shop/fotobiomodulacao-na-oncologia-293`. A LP da masterclass (`lps/masterclasses/fotobiomodulacao-oncologia.html`) permanece intacta. |
| ✅ | LPs de curso replicadas do WP | `lps/cursos/*.html` + `lps/masterclasses/*.html` | **Reescritas do zero em 2026-07-05** — HTML/CSS enxuto (~18KB cada, era 1.5MB no clone Elementor). 4 iterações: (1) reescrita base; (2) ajustes manuais; (3) workflow multiperspectiva 3 lentes (27 análises → 108 findings → 52 fixes paralelos); (4) workflow adversarial 3 juízes céticos + fixes manuais nas 2 mais fracas. Scores adversariais finais (média 65/100): rinite 82, os outros 72, fotoneuro/pos-parto corrigidos manualmente pós-score. Cada LP com paleta e layout próprios: laserpuntura (branco/verde vibrante + estátua + 3 fotos profs reais), start-laser (dark + lime + Daiane + glow), feridas (creme + hero mão + 4 profs), fisioterapia (branco/lime + foto joelho fisio2.png), fotoneuromodulacao (dark neuro + bullets sobre card), pos-parto (branco + banner real das alunas), especialidades-medicas (dark + dourado + 2 fotos médicos + depoimentos), rinite (dark + vermelho + Daiane + instrutora), bronquiolite (dark + pulmões + oliva + benefícios). Todas com GTM/Pixel, modal submit-lead, redirect Odoo. Refs WP em `_wp_refs/*.png`, prod em `_prod_shots/*.png`. |
| ✅ | Política de Privacidade | `politica-de-privacidade.html` | LGPD completa: dados coletados, uso, compartilhamento, cookies, direitos do titular, retenção, segurança. Contato: contato@allaser.com.br. |
| ✅ | Termos e Condições | `termos-e-condicoes.html` | Aceite, serviços, cadastro, pagamento, política de cancelamento (art. 49 CDC — 7 dias), propriedade intelectual, foro Campinas-SP. |
| ✅ | Meu carrinho | `carrinho.html` | Lista items via `Api.cartList()`, permite mudar qty, remover. Botão "Finalizar compra" faz `window.location = Api.URLS.checkout` (redireciona pro checkout do backend em `cursos.allaser.com.br/checkout`). Cupom, login, pagamento — tudo lá. |

> **Menu enxuto** (atualizado 2026-07-21): header lista Home, Quem Somos, Sobre o Laser, Blog, Encontre um Profissional. **Item "Cursos" foi removido** — Home já tem o catálogo completo em `#cursos-home`. Botão "Entrar" no header abre popup de login (via `Api.login()`) em vez de redirecionar.

---

## Admin (`/admin/`)

Sistema próprio em PHP pra gerenciar credenciados sem mexer em código.

### Pra rodar localmente

```bash
# instala PHP 8.3 se não tiver
winget install PHP.PHP.8.3

# servidor (serve estático + processa PHP):
php -S localhost:8000 -t Pefaz
```

Depois acessa `http://localhost:8000/admin/setup.php` pra criar TEU usuário local. Cada ambiente (dev local + servidor de produção) tem seu próprio `users.json` (gitignored).

### Funcionalidades
- Login bcrypt + sessão 1h + CSRF + regeneração de session ID
- CRUD de credenciados (lista com busca client-side, add/edit/del)
- Backup automático antes de cada save (mantém últimos 10 em `/admin/backups/`)
- Multi-usuário: `usuarios.php` (lista + add/del), `meus-dados.php` (trocar nome/senha próprios)
- Setup primeiro uso: `setup.php` cria 1º admin e auto-bloqueia depois

### Em produção (Napoleon)
1. `git pull` no servidor
2. Visitar `https://allaser.com.br/admin/setup.php` UMA vez pra criar conta master
3. Deletar `setup.php` por segurança extra
4. Conferir que `assets/data/credenciados.json` é gravável pelo PHP, e `/admin/backups/` é criável

---

## Decisões arquiteturais

1. **Site estático + PHP só onde precisa**. WordPress descartado (mantém o design novo, ganha velocidade, perde dor de manutenção).
2. **Imagens locais** (em `/assets/images/`) — site é autônomo do servidor antigo.
3. **Multi-usuário desde o início** — `users.json` é array de usuários, não senha única. Estrutura preparada pra muitos.
4. **Blog vai virar estático também** (decidido, não implementado).
5. **Email noreply do GitHub** nos commits (privacidade dos devs).
6. **Variáveis CSS isoladas por componente** quando trazem paleta própria.
7. **Admin segue identidade do site público** — mesma logo, mesmas fontes (Plus Jakarta Sans + Outfit), mesma paleta lime/dark, mesmo padrão de header sticky branco. Diferenciado por uma badge "Admin" verde-lima ao lado do logo.
8. **Catálogo de cursos centralizado em `assets/cursos-data.js`** (`window.CURSOS_DATA`) — único ponto de verdade para nome, descrição, thumb, URL e categoria de cada produto. `cursos.html` consome esse arquivo via JS e renderiza dinamicamente. Para adicionar ou editar um curso, edite apenas `cursos-data.js`.
9. **Checkout dos cursos via Odoo** (`allazercursos.odoo.com.br`) — todos os links de inscrição apontam para o Odoo. O site estático é vitrine; a transação ocorre fora.
10. **Página de cursos usa tema claro** (mesma paleta da home: branco/cinza + lime-dark) — não segue o estilo dark das seções de destaque internas. Decisão visual para manter coerência com o restante do site.
11. **Capas de curso no formato pôster 9:16** — 30 capas oficiais em `/assets/images/capas-cursos/`. Tanto a home (`index.html`) quanto o hub (`cursos.html`) usam fundo branco com cards-pôster verticais sem moldura, hover scale + sombra + borda lime. **Cursos sem capa foram removidos do catálogo** (2026-06-26) — agora só aparecem os 30 com pôster. Para adicionar curso novo, providencie capa 9:16, copie para `/assets/images/capas-cursos/`, adicione entrada em `cursos-data.js` com `thumb` apontando para o arquivo.
12. **Ecommerce — front do catálogo + carrinho** (contrato v2, 2026-07-02). Backend já no ar em `cursos.allaser.com.br` (subdomínio aponta pro VPS Pefaz). **Escopo do site allaser: SÓ catálogo + carrinho + botão "Finalizar compra"**. Login, cadastro, checkout, pagamento, matrícula, minhas compras — TUDO servido pelo backend em `cursos.allaser.com.br`. O site allaser só linka pra lá. Regras invioláveis do contrato: (a) TODO fetch com `credentials:'include'` — cookies com `Domain=.allaser.com.br` são compartilhados; (b) Front NUNCA calcula nem manda preço — só `product_slug`, `offer_id?` e `qty`. Preços vêm de `/api/catalog.php` e são sincronizados nos cards via `Api.syncPrices()`; (c) Todo POST precisa do header `X-CSRF` — token vem de `/api/me.php` no boot e fica guardado no `Api`; (d) NÃO disparar `fbq('track','Purchase')` — o backend faz isso na página de checkout dele. Endpoints em uso: `GET /api/me.php`, `GET /api/catalog.php`, `GET /api/cart-list.php`, `POST /api/cart-add.php`, `POST /api/cart-update.php` (qty 0 = remove), `POST /api/cart-remove.php`. Cliente e URLs do backend em `assets/api.js` (`Api.URLS.checkout|login|logout|account|myOrders`).

---

## Gotchas conhecidos

- **`users.json` e `admin/backups/credenciados-*.json` são gitignored** — cada ambiente tem o seu. Não tente "sincronizar".
- **Mapa do buscador** depende da API do IBGE (`servicodados.ibge.gov.br`). Sem internet, mostra erro com botão de retry.
- **WhatsApp `5519984231452`** está hardcoded em vários lugares (header, modal, footer, CTAs). Mudança = busca-e-substitui.
- **URLs absolutas em todo o site** (`/assets/...`, `/admin/...`). Quebra se hospedar em subpath.
- **`100vh` em iOS Safari** pode dar layout shift pela barra do navegador. Considerar `100dvh` se virar problema.
- **CRLF warnings** ao commitar — `core.autocrlf=true` do Git for Windows convertendo line endings. Normal, não é erro.
- **YouTube embed em vídeo "Não listado"**: a flag **"Permitir incorporação"** é uma configuração SEPARADA da visibilidade — está em Detalhes → Mostrar mais. Sem ela ligada, o embed mostra "Vídeo indisponível" mesmo o vídeo estando no ar. Verificar por vídeo no YouTube Studio quando algum embed falhar.
- **`cursos-data.js` tem 30 entradas** — todos com capa 9:16 em `/assets/images/capas-cursos/`. Cursos sem capa (presenciais com data específica, fóruns gravados, materiais avulsos, plantão start-laser, combos ocultos, avançados) foram removidos em 2026-06-26 quando padronizamos o pôster 9:16. Se precisar reativar algum, providencie a capa antes de re-adicionar no `cursos-data.js`.
- **`body { overflow-x: clip }`** (não `hidden`) em `shared.css` — necessário para que `position: sticky` funcione dentro de containers com overflow. Não reverter para `hidden`.
- **Pipeline de otimização de imagens**: as capas em `/assets/images/capas-cursos/` foram redimensionadas in-place de 1080×1920 (~190 KB cada) para 540×960 (~40 KB cada) em 2026-06-26 pra resolver LCP de 12,9s. Os arquivos originais 1080×1920 ficam em `C:\Users\Pichau\Documents\allaser-capas-cursos\imagens\` — fonte de verdade caso precise regerar. Hero usa `.webp` (era `.png` de 1,2 MB → 25 KB). Comando padrão: `ffmpeg -i in.webp -vf "scale=540:960:flags=lanczos" -c:v libwebp -quality 78 -compression_level 6 out.webp`. Pra adicionar capa nova, redimensione para 540×960 antes de copiar pro repo.

---

## Tarefas pendentes

Lista oficial de pendências está em **[GitHub Issues](https://github.com/rodrigo-carfon/Pefaz/issues)**.

No terminal:
```bash
gh issue list                  # ver todas as abertas
gh issue view 3                # detalhes da #3
gh issue close 3               # fechar (manual)
```

Pra **fechar uma issue automaticamente** ao terminar a tarefa, inclua `closes #N` na mensagem do commit:
```bash
git commit -m "constroi pagina cursos.html — closes #1"
git push
# → Issue #1 fecha sozinha quando o push chega no GitHub
```

Labels usadas: `page` (pendente), `bug`, `backend`, `admin`, `priority:high`, `easy`.

---

## Pra Claude começando agora

Quando entrar no projeto, faz isto:

```bash
# entender o que mudou recentemente
git log --oneline -15

# estado atual
git status

# ver tarefas pendentes priorizadas
gh issue list --label priority:high
gh issue list                            # todas as abertas
```

Lê esses arquivos primeiro pra contexto:
1. Este `CLAUDE.md` (já está fazendo)
2. `index.html` (entender o estilo e padrões)
3. `assets/shared.css` (tokens visuais)
4. `assets/components.js` (estrutura do header/footer compartilhada)
5. `admin/_auth.php` (se for mexer no admin)

Mantenha este `CLAUDE.md` atualizado quando:
- Concluir uma página (mover de 🔲 pra ✅ na tabela acima)
- Tomar decisão arquitetural nova (adicionar em "Decisões")
- Descobrir gotcha novo (adicionar em "Gotchas")
- Adicionar/remover dependência externa
