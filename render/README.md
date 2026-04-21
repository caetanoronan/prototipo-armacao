# Render local do mapa

Servidor local para exportar PNG do mapa do protótipo usando Playwright.

## Instalação

```bash
npm install
npx playwright install chromium
```

## Uso

```bash
npm start
```

No mapa principal, a exportação PNG passa a chamar:

```text
http://127.0.0.1:3030/render.png?layers=...&ref=...&base=...
```

O servidor abre a página do mapa, espera o render real do Leaflet e captura somente a área do mapa.
