# Prototipo_Armação

Protótipo de campo do Projeto de Mestrado (PPGOceano/UFSC) para validação cartográfica, usabilidade em coleta e exportação de mapas em PNG.

## Página principal

Abra `index.html` para visualizar:

- Mapa A: clone operacional
- Mapa B: infra clone com fluxo de render
- Explicação pública dos objetivos de teste em campo

## Estrutura essencial

- `05_gis_mapas/mapa_prototipo_armacao_clone.html`
- `05_gis_mapas/mapa_prototipo_armacao_infra_clone.html`
- `05_gis_mapas/pagina_impressao_prototipo_armacao.html`
- `04_dados_campo/raw/referencias_prototipo_armacao.csv`
- `render/server.js`

## Exportação PNG com render local

No diretório `render`:

```bash
npm install
npx playwright install chromium
npm start
```

Com o serviço ativo em `http://127.0.0.1:3030`, a versão infra do mapa exporta PNG com alinhamento cartográfico mais estável.

## Autoria e programa

Projeto de Mestrado — PPGOceano/UFSC · 2026  
Autor: Ronan Armando Caetano  
Programa: Pós-Graduação em Oceanografia (PPGOceano/UFSC) / CAPES
