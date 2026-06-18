<div align="center">

#  Deck Manager — Jogo de Truco Paulista 

<img src="https://media.giphy.com/media/3orieUe6ejxSFxYCXe/giphy.gif" width="220" alt="Animação de cartas" />

Projeto acadêmico desenvolvido em React consumindo a Deck of Cards API.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?logo=javascript&logoColor=black)
![API](https://img.shields.io/badge/API-Deck%20of%20Cards-2E8B57)

</div>

## Identificação

- **Aluna:** Gabrielly Castro;
- **Aluno:** Gabriel Leonel;
- **API escolhida:** Deck of Cards API.

## Sobre o projeto

O Deck Manager é uma aplicação web para gerenciamento de cartas e simulação de uma partida de Truco Paulista contra uma inteligência artificial simples. O projeto utiliza uma API pública para criar, embaralhar e distribuir as cartas.

## API utilizada

- **API:** Deck of Cards API;
- **Documentação oficial:** [https://deckofcardsapi.com/](https://deckofcardsapi.com/);
- **Endpoint base:** `https://deckofcardsapi.com/api/deck`.

Para o Truco, é utilizado um baralho parcial com 40 cartas, sem coringas e sem as cartas 8, 9 e 10.

## Funcionalidades implementadas

### Gerenciamento de baralho

- Criação e embaralhamento de um baralho pela API;
- Compra e visualização de cartas;
- Pesquisa entre as cartas compradas;
- Exibição dos detalhes de cada carta;
- Tratamento de carregamento e falhas nas requisições.

### Jogo de Truco Paulista

- Distribuição de três cartas para o jogador e três para o oponente;
- Definição da vira e cálculo automático da manilha;
- Ordem correta das cartas e das manilhas por naipe;
- Comparação das cartas jogadas;
- Tratamento de empate;
- Disputa em melhor de três rodadas;
- Pontuação acumulada até 12 pontos;
- Pedidos de Truco, Seis, Nove e Doze;
- Opções de aceitar ou correr;
- Nova distribuição somente após o encerramento da mão.

## Tecnologias utilizadas

- React 19;
- Vite 8;
- JavaScript e JSX;
- React Router DOM;
- Fetch API;
- CSS.

## Como instalar e executar o projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) instalado;
- npm, instalado juntamente com o Node.js;
- Git instalado;
- Conexão com a internet para acessar a Deck of Cards API.

### 1. Clonar o repositório

Abra um terminal e execute:

```bash
git clone https://github.com/eigabycastro/faculdade_react.git
```

### 2. Acessar a pasta do projeto

```bash
cd faculdade_react
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Executar o projeto

```bash
npm run dev
```

### 5. Abrir no navegador

Após iniciar o servidor, o Vite exibirá um endereço semelhante a:

```text
Local: http://localhost:5173/
```

Abra o endereço informado no navegador. Normalmente será:

[http://localhost:5173](http://localhost:5173)

### 6. Utilizar a aplicação

Após abrir o sistema, será possível:

- Criar e embaralhar baralhos;
- Comprar cartas;
- Visualizar os detalhes das cartas;
- Pesquisar entre as cartas compradas;
- Jogar uma partida completa de Truco Paulista contra a Maquina.

## Scripts disponíveis

```bash
npm run dev      # Executa o projeto em modo de desenvolvimento
npm run build    # Gera a versão de produção
npm run lint     # Verifica o código com ESLint
npm run preview  # Visualiza localmente a versão de produção
```

## Observação

A aplicação depende da Deck of Cards API. Portanto, é necessário possuir conexão com a internet durante sua execução. Caso uma requisição falhe, a aplicação apresenta uma mensagem de erro para que o usuário possa tentar novamente.

---

<div align="center">

 Feito por **Gabrielly Castro** e **Gabriel Leonel** 

<img src="https://media.giphy.com/media/26BRuo6sLetdllPAQ/giphy.gif" width="150" alt="Animação decorativa" />

</div>
