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
│   ├── images/                    ← assets locais (logo, fotos, thumbs)
│   └── data/
│       └── credenciados.json      ← profissionais (editado via admin)
└── admin/                         ← painel PHP (auth + CRUD + multi-user)
    ├── _auth.php                  ← helpers + CSRF + sessão (include)
    ├── admin.css                  ← visual do painel
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
- **Header/footer**: NÃO duplicar em páginas. Usar placeholders `<div id="site-header"></div>` e `<div id="site-footer"></div>` que o `components.js` preenche.
- **Item de menu ativo**: cada página chama `setActiveNav('home')` (ou `'cursos'`, `'encontre'`...) no fim do `<body>`.
- **Commits**: PT-BR, minúsculo, atômicos (1 unidade de trabalho por commit), corpo explica o porquê não o quê.

---

## Páginas

| Estado | Página | Arquivo | Notas |
|---|---|---|---|
| ✅ | Home | `index.html` | Hero 3D (three.js), cursos, depoimentos, prof, FAQ, modal de captura |
| ✅ | Encontre profissional | `encontre.html` | Mapa SVG do Brasil (IBGE), filtros, JSON com 35 credenciados |
| 🔲 | Cursos | `cursos.html` | Linkado no menu — dá 404 |
| 🔲 | Sobre / Quem Somos | `sobre.html` | |
| 🔲 | Professores | `professores.html` | |
| 🔲 | FAQ completo | `faq.html` | |
| 🔲 | Sobre o Laser | `sobre-o-laser.html` | Com âncoras: #historia, #tiposdelaser, #equipamentos |
| 🔲 | Contato | `contato.html` | |
| 🔲 | Blog (index + posts) | `blog.html` + posts/ | Decisão: vai virar estático também |
| 🔲 | Categorias | odontologia, medicina, enfermagem, veterinária, oncologia | |

> **Cuidado**: o menu (`assets/components.js`) já tem links pra TODAS essas páginas. As que não existem dão 404.

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

---

## Gotchas conhecidos

- **`users.json` e `admin/backups/credenciados-*.json` são gitignored** — cada ambiente tem o seu. Não tente "sincronizar".
- **Mapa do buscador** depende da API do IBGE (`servicodados.ibge.gov.br`). Sem internet, mostra erro com botão de retry.
- **WhatsApp `5519984231452`** está hardcoded em vários lugares (header, modal, footer, CTAs). Mudança = busca-e-substitui.
- **URLs absolutas em todo o site** (`/assets/...`, `/admin/...`). Quebra se hospedar em subpath.
- **`100vh` em iOS Safari** pode dar layout shift pela barra do navegador. Considerar `100dvh` se virar problema.
- **Bug pendente**: tanto no buscador (`encontre.html`, função `rR()`) quanto possivelmente em outros, plural de "profissional" sai como "profissionalis" em vez de "profissionais". Já corrigido no admin, no buscador ainda não.
- **CRLF warnings** ao commitar — `core.autocrlf=true` do Git for Windows convertendo line endings. Normal, não é erro.

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
