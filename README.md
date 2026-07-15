# Organograma

Organograma interativo da empresa, atualizado automaticamente via Notion + Make + GitHub Pages.

## Stack

- **Frontend**: React 18 + React Flow + Dagre (layout automático)
- **Build**: Vite
- **Deploy**: GitHub Pages (via GitHub Actions)
- **Dados**: Notion → Make.com → organograma.json → GitHub

## Setup Local

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173/organograma/`

## Deploy

Basta fazer push na branch `main`. O GitHub Actions faz build e deploy automático.

Acesse: `https://SEUUSUARIO.github.io/organograma/`

## Estrutura do organograma.json

```json
{
  "nodes": [
    { "id": "Nome", "data": { "label": "Nome\nCargo", "area": "Área" } }
  ],
  "edges": [
    { "id": "Gestor-Funcionario", "source": "Gestor", "target": "Funcionario" }
  ]
}
```

## Setup Make.com

1. Importar `make-scenario.json` no Make
2. Conectar conta Notion
3. Conectar conta GitHub
4. Configurar o ID da database e o repo
5. Ativar o scenario

## Notion Database

Campos obrigatórios:

| Campo  | Tipo   |
|--------|--------|
| Nome   | Title  |
| Cargo  | Text   |
| Gestor | Text   |
| Área   | Select |
