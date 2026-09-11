# Allaser News

Revista mensal estática, integrada ao site Allaser. Não depende de Canva, iframe, serviço de flipbook ou API para leitura.

## Edição inaugural

- Arquivo: `agosto2026.html`; URL pública: `/allasernews/agosto2026`.
- Edição original: agosto de 2026, especial #35, 17 páginas.
- Originais do Canva preservados como imagens WebP de 1414 × 2000, sem cortes.
- Conteúdo e links: `/assets/allasernews/agosto2026.json`.
- Miniaturas: `/assets/images/allasernews/agosto2026/miniatura-XX.webp`.
- Páginas: `/assets/images/allasernews/agosto2026/pagina-XX.webp`.
- Leitor compartilhado: `/assets/allasernews/revista.js` e `revista.css`.
- Animação: StPageFlip 2.0.7, auto-hospedado; licença MIT em `/assets/vendor/page-flip/LICENSE.txt`.

## Publicar o próximo mês

1. Receber exportação PDF e PNG de todas as páginas da edição aprovada.
2. Confirmar mês/ano e ordem das páginas pelo conteúdo, não pela data de exportação.
3. Otimizar as imagens sem aumentar a resolução nem cortar bordas; gerar miniaturas.
4. Criar nova pasta de imagens e novo JSON no mesmo esquema de agosto. URLs devem vir do original ou ser confirmadas. `hotspots` usa coordenadas percentuais com origem superior esquerda.
5. Duplicar a página HTML e atualizar `data-edition`, caminhos de capa/fallback, título, metadados, mês, número da edição e total de páginas. Não alterar os arquivos de agosto.
6. Adicionar o cartão da nova edição em `index.html`, primeiro na lista, e a URL no `sitemap.xml`.
7. Conferir abertura, todas as páginas, fim/início, índice, links, zoom, modo texto, celular e desktop.
8. Publicar pelo fluxo normal do repositório. A regra existente de URLs limpas já atende essas páginas.

## Comportamento e acessibilidade

No celular, uma página por vez; telas largas usam pares. Há setas, gesto de virada, navegação por teclado, índice, zoom com seletor de página e leitura textual ampliada. A preferência de movimento reduzido desativa a virada animada. O cabeçalho e rodapé são os componentes existentes do site. O WhatsApp flutuante é ocultado apenas durante a leitura. Sem JavaScript, há links diretos para as 17 páginas.

## Pendências do original preservadas

- Página 9: o curso de São Paulo tem URL com slug de Porto Alegre; confirmar destino com a equipe.
- Página 14: os cartões de ILIB/paciente oncológico e síndrome de Down não possuem URLs no PDF.
- Página 17: a chamada de newsletter aponta à home; não foi criada integração nova. O link é identificado como visita ao site.
- Grafias e afirmações editoriais foram preservadas, não revisadas cientificamente. A edição é arquivo histórico, não agenda atualizada automaticamente.
