# Deck Manager

SPA simples de gerenciamento de baralho criada com React + Vite, consumindo a API publica Deck of Cards API.

## Tecnologias

- React
- Vite
- React Router DOM
- Hooks: useState e useEffect
- Fetch API
- CSS comum organizado

## Descricao

O projeto permite criar um baralho, embaralhar, comprar cartas, pesquisar cartas compradas localmente e abrir uma pagina de detalhes para cada carta.

## Como instalar

```bash
npm install
```

## Como executar

```bash
npm run dev
```

Depois, acesse o endereco exibido no terminal pelo Vite.

## API utilizada

[Deck of Cards API](https://deckofcardsapi.com/)

Endpoints usados:

- Criar baralho: `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`
- Comprar cartas: `https://deckofcardsapi.com/api/deck/{deck_id}/draw/?count=5`
- Embaralhar: `https://deckofcardsapi.com/api/deck/{deck_id}/shuffle/`

## Funcionalidades

- Criar um novo baralho
- Comprar 5 cartas por vez
- Embaralhar o baralho
- Visualizar cartas compradas
- Pesquisar cartas localmente
- Abrir detalhes de uma carta
- Exibir loading durante requisicoes
- Exibir mensagem amigavel em caso de erro
- Navegacao com React Router DOM
- Pagina 404 amigavel
