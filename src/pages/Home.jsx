import { Link } from 'react-router-dom';
import Button from '../components/Button';
import deckManagerLarge from '../assets/DeckManagerGG.png';
import deckIcon from '../assets/deck-icon.png';
import drawCardIcon from '../assets/draw-icon.png';

function Home() {
  return (
    <section className="home-page">
      <div className="home-hero">
        <div className="home-text">
          <p className="eyebrow">React + Deck of Cards API</p>
          <h1>Gerenciador de Baralho</h1>
          <p>
            Crie um baralho, embaralhe, compre cartas e veja os detalhes de cada
            carta em uma SPA simples e moderna.
          </p>
          <Link to="/deck">
            <Button variant="secondary">Comecar agora</Button>
          </Link>
        </div>

        <div className="home-preview" aria-label="Imagem principal do Deck Manager">
          <img
            className="home-logo-large"
            src={deckManagerLarge}
            alt="Deck Manager"
          />
        </div>
      </div>

      <div className="home-info">
        <div className="feature-card">
          <img src={deckIcon} alt="Ícone de baralho" />
          <h2>Crie seu baralho</h2>
          <p>Gere um novo baralho.</p>
        </div>
        <div className="feature-card">
          <img src={drawCardIcon} alt="Ícone de comprar carta " />
          <h2>Compre cartas</h2>
          <p>Compre cartas do baralho e visualize suas cartas compradas.</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">i</span>
          <h2>Veja detalhes</h2>
          <p>Clique em uma carta para ver valor, naipe e codigo.</p>
        </div>
      </div>

    </section>
  );
}

export default Home;
