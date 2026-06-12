import { Link } from 'react-router-dom';

function CardItem({ card }) {
  return (
    <article className="card-item">
      <Link to={`/card/${card.code}`} state={{ card }} className="card-link">
        <img src={card.image} alt={`${card.value} de ${card.suit}`} />
        <div>
          <h3>{card.value}</h3>
          <p>{card.suit}</p>
          <span>{card.code}</span>
        </div>
      </Link>
    </article>
  );
}

export default CardItem;
