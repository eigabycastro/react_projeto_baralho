import { Link, useLocation, useParams } from 'react-router-dom';
import Button from '../components/Button';

function CardDetails() {
  const { code } = useParams();
  const location = useLocation();
  const savedCards = JSON.parse(sessionStorage.getItem('drawnCards') || '[]');
  const card = location.state?.card || savedCards.find((item) => item.code === code);

  if (!card) {
    return (
      <section className="details-page">
        <h1>Carta nao encontrada</h1>
        <p>Compre uma carta primeiro para visualizar seus detalhes.</p>
        <Link to="/deck">
          <Button>Voltar ao baralho</Button>
        </Link>
      </section>
    );
  }

  return (
    <section className="details-page">
      <img className="details-image" src={card.image} alt={`${card.value} de ${card.suit}`} />
      <div className="details-content">
        <p className="eyebrow">Detalhes da carta</p>
        <h1>{card.value}</h1>
        <p>Naipe: {card.suit}</p>
        <p>Codigo: {card.code}</p>
        <Link to="/deck">
          <Button>Voltar ao baralho</Button>
        </Link>
      </div>
    </section>
  );
}

export default CardDetails;
