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
