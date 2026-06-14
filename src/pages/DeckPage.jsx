import { useEffect, useMemo, useState } from 'react';
import Button from '../components/Button';
import CardList from '../components/CardList';
import ErrorMessage from '../components/ErrorMessage';
import Loading from '../components/Loading';
import SearchBar from '../components/SearchBar';
import { mapCards } from '../mappers/cardMapper';
import { createDeck, drawCards, shuffleDeck } from '../services/deckService';

function DeckPage() {
  const [deckId, setDeckId] = useState('');
  const [cards, setCards] = useState([]);
  const [remaining, setRemaining] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [action, setAction] = useState(null);

  useEffect(() => {
    if (!action) return undefined;

    const controller = new AbortController();
    let cancelled = false;

    async function runAction() {
      try {
        setLoading(true);
        setError('');
        setSuccess('');

        if (action.type === 'create') {
          const data = await createDeck(controller.signal);
          if (cancelled) return;
          setDeckId(data.deck_id);
          setCards([]);
          setSearch('');
          setRemaining(data.remaining);
          sessionStorage.removeItem('drawnCards');
          setSuccess('Baralho criado com sucesso.');
        }
        
        if (action.type === 'draw') {
          const data = await drawCards(action.deckId, 5, controller.signal);
          if (cancelled) return;
          const mappedCards = mapCards(data.cards);
          setCards((currentCards) => {
            const updatedCards = [...currentCards, ...mappedCards];
            sessionStorage.setItem('drawnCards', JSON.stringify(updatedCards));
            return updatedCards;
          });
          setRemaining(data.remaining);
          setSuccess('Cartas compradas com sucesso.');
        }
        
        if (action.type === 'shuffle') {
          const data = await shuffleDeck(action.deckId, controller.signal);
          if (cancelled) return;
          setCards([]);
          setSearch('');
          setRemaining(data.remaining);
          sessionStorage.removeItem('drawnCards');
          setSuccess('Baralho embaralhado com sucesso.');
        }
      } catch (apiError) {
        if (!cancelled && apiError.name !== 'AbortError') {
          setError('Nao foi possivel carregar as cartas. Tente novamente.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setAction(null);
        }
      }
    }

    runAction();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [action]);

  const filteredCards = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) return cards;

    return cards.filter((card) => {
      const text = `${card.value} ${card.suit} ${card.code}`.toLowerCase();
      return text.includes(normalizedSearch);
    });
  }, [cards, search]);

  const hasDeck = Boolean(deckId);

  return (
    <section className="deck-page">
      <div className="page-title">
        <p className="eyebrow">Mesa de jogo</p>
        <h1>Meu Baralho</h1>
        <p>Controle as cartas usando os dados reais da Deck of Cards API.</p>
      </div>

      <div className="deck-panel">
        <div className="deck-actions">
          <Button onClick={() => setAction({ type: 'create' })} disabled={loading || hasDeck}>
            Criar baralho
          </Button>
          <Button
            variant="secondary"
            onClick={() => setAction({ type: 'draw', deckId })}
            disabled={loading || !hasDeck || remaining === 0}
          >
            Comprar 5 cartas
          </Button>
          <Button
            variant="outline"
            onClick={() => setAction({ type: 'shuffle', deckId })}
            disabled={loading || !hasDeck}
          >
            Embaralhar
          </Button>
        </div>

        <div className="deck-info">
          <span>Restantes: {remaining}</span>
          <span>Compradas: {cards.length}</span>
        </div>
      </div>

      <ErrorMessage message={error} />
      {success && <p className="success-message">{success}</p>}
      {loading && <Loading />}

      {!hasDeck && !loading && (
        <p className="empty-message">Clique em "Criar baralho" para iniciar.</p>
      )}

      {hasDeck && (
        <div className="cards-panel">
          <SearchBar value={search} onChange={setSearch} />
          <CardList cards={filteredCards} />
        </div>
      )}

      {hasDeck && (
        <div className="tip-panel">
          <strong>Dica</strong>
          <p>Clique em qualquer carta acima para ver os detalhes completos.</p>
        </div>
      )}
    </section>
  );
}

export default DeckPage;
