const BASE_URL = 'https://deckofcardsapi.com/api/deck';

async function requestJson(url, signal) {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error('Nao foi possivel acessar a API.');
  }

  return response.json();
}

export function createDeck(signal) {
  return requestJson(`${BASE_URL}/new/shuffle/?deck_count=1`, signal);
}

export function drawCards(deckId, count = 5, signal) {
  return requestJson(`${BASE_URL}/${deckId}/draw/?count=${count}`, signal);
}

export function shuffleDeck(deckId, signal) {
  return requestJson(`${BASE_URL}/${deckId}/shuffle/`, signal);
}

export function returnCards(deckId, cards = [], signal) {
  const cardCodes = cards.join(',');
  return requestJson(`${BASE_URL}/${deckId}/draw/?cards=${cardCodes}`, signal);
}

const TRUCO_RANKS = ['4', '5', '6', '7', 'Q', 'J', 'K', 'A', '2', '3'];
const TRUCO_SUITS = ['S', 'D', 'C', 'H'];
const MANILHA_SUIT_STRENGTH = { D: 1, S: 2, H: 3, C: 4 };

function getCardRank(card) {
  if (typeof card === 'string') return card.slice(0, -1);
  return card?.code?.slice(0, -1) || '';
}

export function createTrucoDeck(signal) {
  const cards = TRUCO_RANKS.flatMap((rank) =>
    TRUCO_SUITS.map((suit) => `${rank}${suit}`),
  ).join(',');

  return requestJson(`${BASE_URL}/new/shuffle/?cards=${cards}`, signal);
}

export function dealTrucoCards(deckId, signal) {
  return drawCards(deckId, 7, signal);
}

export function calculateManilha(vira) {
  const viraRank = getCardRank(vira);
  const viraIndex = TRUCO_RANKS.indexOf(viraRank);

  if (viraIndex === -1) return '';
  return TRUCO_RANKS[(viraIndex + 1) % TRUCO_RANKS.length];
}

export function getCardStrength(card, manilha) {
  const rank = getCardRank(card);
  const suit = card?.code?.slice(-1) || '';

  if (rank === manilha) {
    return TRUCO_RANKS.length + MANILHA_SUIT_STRENGTH[suit];
  }

  return TRUCO_RANKS.indexOf(rank) + 1;
}

export function compareCards(firstCard, secondCard, manilha) {
  const firstStrength = getCardStrength(firstCard, manilha);
  const secondStrength = getCardStrength(secondCard, manilha);

  if (firstStrength > secondStrength) return 1;
  if (firstStrength < secondStrength) return -1;
  return 0;
}

export function determineRoundWinner(playerCard, aiCard, manilha) {
  const result = compareCards(playerCard, aiCard, manilha);
  if (result > 0) return 'player';
  if (result < 0) return 'ai';
  return 'tie';
}

export function determineHandWinner(roundResults = []) {
  const [first, second, third] = roundResults;

  if (roundResults.length >= 2) {
    if (first === 'tie' && second !== 'tie') return second;
    if (first !== 'tie' && (second === first || second === 'tie')) return first;
  }

  if (roundResults.length < 3) return null;
  if (first === 'tie' && second === 'tie') return third;
  if (third === 'tie') return first !== 'tie' ? first : second;
  if (first === third || second === third) return third;
  return first;
}

export function createDeckWithTrucoCards(signal) {
  return createTrucoDeck(signal);
}
