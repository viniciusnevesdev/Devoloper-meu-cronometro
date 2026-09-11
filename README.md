# Cronômetro — estrutura oficial do projeto

Este é o repositório principal do Cronômetro pessoal.

## Ambientes

- **Oficial** — versão estável de uso diário. Dados reais em `cronometro_local_v1`.
- **Beta** — ambiente de testes em `/beta/`. Dados isolados em `cronometro_beta_v1`.
- **Menu Geral** — `/menu.html`, ponto central de acesso a Oficial, Beta, diagnóstico, recuperação e histórico.
- **Histórico de versões** — `/versoes/`, somente para consulta e recuperação visual de versões anteriores.

As versões exibidas no Menu Geral são lidas automaticamente de `version.json` e `beta/version.json`.

## Demonstração pública

A demonstração usada para apresentação do trabalho fica separada em:

`viniciusnevesdev/cronometro-app`

Ela usa dados fictícios e não deve ser confundida com o app pessoal.

## Regra de desenvolvimento

1. Mudanças novas devem ser testadas primeiro na Beta quando houver risco funcional.
2. A Beta não deve gravar no banco Oficial.
3. Mudanças aprovadas podem ser promovidas para o Oficial.
4. Versões antigas permanecem preservadas em `/versoes/`.
5. Os repositórios `NOVO` e `Meu-cron-metro` são legados e não devem receber desenvolvimento novo.
