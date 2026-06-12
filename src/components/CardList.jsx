import CardItem from './CardItem';

function CardList({ cards }) {
  if (cards.length === 0) {
    return <p className="empty-message">Nenhuma carta encontrada.</p>;
  }

  return (
    <section className="cards-grid">
      {cards.map((card) => (
        <CardItem key={card.id} card={card} />
      ))}
    </section>
  );
}

export default CardList;
