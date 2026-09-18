# Laboratório Visual (Beta)

O Laboratório é carregado somente no pacote `/beta/`. É um runtime opcional: o PWA continua funcional se ele falhar ou não for carregado.

## Arquitetura

- `visual-lab.js` mantém o schema `cronometro-beta-visual-lab-v1`, separado de `settings` e do IndexedDB do app.
- `visual-lab-bridge.css` contém somente regras protegidas por `html[data-visual-lab-active]`. Os valores chegam por CSS Custom Properties; não há seletor por posição/filhos.
- O painel usa Shadow DOM. Seu CSS não alcança páginas normais.
- APIs públicas atuais: `bottomBar.height`, `bottomBar.iconSize`, `bottomBar.gap`, `bottomBar.opacity`, `bottomBar.offsetX/Y`; `timerCard.minHeight`, `gap`, `radius`, `titleSize`, `titleAlign`, `titleOffsetX/Y`, `glow`, `shadowBlur`; `historyIcon.color`, `historyIcon.svg`.

## Adicionar ou remover integração

Cadastre defaults e controles em `visual-lab.js`, aplique-os por variáveis CSS e acrescente uma regra isolada em `visual-lab-bridge.css`. Remova ambos ao retirar uma propriedade. Não exponha estrutura interna do DOM como API.

O SVG é analisado com `DOMParser`; SVG inválido, `script`, eventos inline, conteúdo incorporado ou URLs externas são rejeitados. O markup válido é preservado, incluindo `viewBox`, fills, strokes e `currentColor`.

Configuração incompatível ou corrompida é ignorada e os defaults oficiais são usados. A exportação produz JSON `{ schemaVersion: 1, bottomBar, timerCard, historyIcon }` e um resumo copiável.

> Se modificar um componente integrado ao Laboratório Visual, preserve sua API pública de parâmetros ou atualize explicitamente a integração e execute os testes do Laboratório.
