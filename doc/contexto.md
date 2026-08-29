# TFT Openers — Resumo do Projeto

## Visão Geral

Projeto para visualizar e gerenciar "openers" (composições iniciais) de TFT (Teamfight Tactics). Cada opener é um conjunto de 3-4 campeões, e cada campeão possui traits (características) associadas.

## Arquivos

### `openers.json`
Lista dos 18 openers, cada um com um array de `units`. Os nomes com `/` foram expandidos em entradas separadas (ex: `aurora/illaoi` virou 2 openers distintos).

### `traits.json`
Mapeamento de cada campeão para suas traits (array de strings). Traits vazias foram removidas.

### `index.html`
Estrutura HTML enxuta (~22 linhas). Importa `style.css` e `app.js`. Contém apenas a marcação da página (search, tableau, dots).

### `style.css`
Todos os estilos da aplicação: dark theme, cards, busca, dots, botão limpar favoritos, responsivo (media query para <=700px).

### `app.js`
Toda a lógica JavaScript: dados hardcoded (openers + traits), renderização dos cards, navegação (teclado, scroll, clique), filtro por busca com score por contagem de trait, favoritos (localStorage) com navegação inteligente (favoritar → primeira posição, desfavoritar primeira → mantém na posição), animação de slide, dots de paginação, botão limpar favoritos.

### `tft_openers.html` (auto-contido)
Versão completa em arquivo único (HTML + CSS + JS inline) para compartilhar. Gerado a partir dos arquivos separados.

### `traits.html`
Ferramenta auxiliar para cadastro de traits via formulário:
- Exibe um campeão por vez
- 3 inputs para preencher traits
- Salva em `localStorage` (chave `tft_champion_traits`)
- Avança automaticamente ao salvar
- Botão de reset para limpar dados salvos

## Dados

### Openers (18)
| # | Units |
|---|-------|
| 1 | ezreal, rek'sai, pantheon, samira |
| 2 | aatrox, twisted fate, talon, jax |
| 3 | nasus, teemo, mordekaiser, gwen |
| 4 | leona, teemo, mordekaiser, zoe |
| 5 | teemo, leona, mordekaiser, zoe |
| 6 | briar, jinx, aurora |
| 7 | briar, jinx, illaoi |
| 8 | leona, lissandra, mordekaiser, zoe |
| 9 | briar, rek'sai, bel'veth, jinx |
| 10 | cho'gath, rek'sai, briar, bel'veth |
| 11 | rek'sai, milio, pantheon, lulu |
| 12 | briar, cho'gath, rek'sai, kai'sa |
| 13 | aatrox, twisted fate, caitlyn, jax |
| 14 | cho'gath, ezreal, lissandra, pantheon |
| 15 | lissandra, poppy, veigar, mipim |
| 16 | aatrox, poppy, mipim, gnar |
| 17 | rek'sai, ezreal, gnar, pantheon |
| 18 | cho'gath, lissandra, pantheon, miss fortune |

### Traits (30 campeões)
Cada campeão tem 1-3 traits. As traits existentes:
anima, árbitro, astromante, atirador de elite, bastião, conduíte, desafiante, embalos do espaço, embalos no espaço, estrela negra, ladino, lutador, mipo, n.o.v.a, pastor, primordiano, rasga-tempo, replicador, saqueador, tecelão do destino, vanguarda, viajante

## Tech Stack
- HTML + CSS + JavaScript puro (sem frameworks/dependências)
- localStorage para persistência no navegador
- Dark mode (background `#0d0d0d`)
- Fonte: Inter (via fallback system fonts)

## Imagens

### Champions
`images/champions/*.png` — 30 arquivos, 256x128 px cada. Exibidas dentro do card à direita do nome do campeão, cropadas para 40x40 px mostrando apenas a metade direita da imagem original. O crop é feito via wrapper `champ-img-wrap` (40x40, `overflow: hidden`) com a `<img>` em 100%x100% e `object-fit: cover; object-position: right`.

### Traits
`images/traits/*.png` — 22 arquivos. Exibidas dentro do card à esquerda do nome da trait, em 20x20 px sem crop. Nomes de arquivo convertidos: espaços → underscores, pontos removidos (ex: `n.o.v.a` → `nova.png`).
