const values = {
  ACE: 'As',
  KING: 'Rei',
  QUEEN: 'Rainha',
  JACK: 'Valete',
};

const suits = {
  SPADES: 'Espadas',
  HEARTS: 'Copas',
  DIAMONDS: 'Ouros',
  CLUBS: 'Paus',
};

export function mapCard(apiCard) {
  return {
    id: apiCard.code,
    code: apiCard.code,
    image: apiCard.image,
    value: values[apiCard.value] || apiCard.value,
    suit: suits[apiCard.suit] || apiCard.suit,
  };
}

export function mapCards(apiCards = []) {
  return apiCards.map(mapCard);
}
