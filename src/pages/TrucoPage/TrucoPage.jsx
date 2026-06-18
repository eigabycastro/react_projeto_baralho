import { useCallback, useEffect, useRef, useState } from 'react';
import Button from '../../components/Button';
import ErrorMessage from '../../components/ErrorMessage';
import Loading from '../../components/Loading';
import { mapCards } from '../../mappers/cardMapper';
import {
  calculateManilha,
  createTrucoDeck,
  dealTrucoCards,
  determineHandWinner,
  determineRoundWinner,
  getCardStrength,
} from '../../services/deckService';
import './trucoPage.css';

const CARD_BACK = 'https://deckofcardsapi.com/static/img/back.png';

const cardStyle = {
  width: 'clamp(82px, 10vw, 126px)',
  aspectRatio: '5 / 7',
  objectFit: 'contain',
  filter: 'drop-shadow(0 10px 12px rgba(15, 27, 47, 0.2))',
};

function TrucoPage() {
  const [playerCards, setPlayerCards] = useState([]);
  const [aiCards, setAiCards] = useState([]);
  const [vira, setVira] = useState(null);
  const [manilha, setManilha] = useState('');
  const [table, setTable] = useState({ player: null, ai: null });
  const [roundResults, setRoundResults] = useState([]);
  const [status, setStatus] = useState('dealing');
  const [message, setMessage] = useState('Preparando a mesa...');
  const [lastHandWinner, setLastHandWinner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const controllerRef = useRef(null);
  const timersRef = useRef([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const schedule = useCallback((callback, delay) => {
    const timer = setTimeout(callback, delay);
    timersRef.current.push(timer);
  }, []);

  const startHand = useCallback(async ({ initial = false } = {}) => {
    clearTimers();
    controllerRef.current?.abort();

    const controller = new AbortController();
    controllerRef.current = controller;

    if (initial) setLoading(true);
    setError('');
    setStatus('dealing');
    setMessage('Distribuindo uma nova mão...');
    setLastHandWinner(null);
    setPlayerCards([]);
    setAiCards([]);
    setVira(null);
    setTable({ player: null, ai: null });

    try {
      const deck = await createTrucoDeck(controller.signal);
      const dealt = await dealTrucoCards(deck.deck_id, controller.signal);
      const cards = mapCards(dealt.cards);

      if (cards.length !== 7) {
        throw new Error('A API não devolveu as sete cartas da mão.');
      }

      const newVira = cards[6]; 
      setPlayerCards(cards.slice(0, 3)); 
      setAiCards(cards.slice(3, 6)); 
      setVira(newVira);
      setManilha(calculateManilha(newVira));
      setRoundResults([]);
      setStatus('player');
      setMessage('Sua vez: escolha uma carta.');
    } catch (apiError) {
      if (apiError.name !== 'AbortError') {
        setError(apiError.message || 'Não foi possível iniciar o Truco.');
        setStatus('error');
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [clearTimers]);

  useEffect(() => {
    const initialTimer = setTimeout(() => {
      startHand({ initial: true });
    }, 0);

    return () => {
      clearTimeout(initialTimer);
      clearTimers();
      controllerRef.current?.abort();
    };
  }, [clearTimers, startHand]);

  function finishHand(winner) {
    setLastHandWinner(winner);
    setStatus('handOver');
    setMessage(winner === 'tie'
      ? 'A mão empatou. Nova mão em seguida.'
      : `${winner === 'player' ? 'Você' : 'O oponente'} venceu a mão.`);
  }

  function resolveRound(playerCard, aiCard) {
    const roundWinner = determineRoundWinner(playerCard, aiCard, manilha);
    const updatedResults = [...roundResults, roundWinner];
    const handWinner = determineHandWinner(updatedResults);
    setRoundResults(updatedResults);
    setStatus('resolving');
    setMessage(roundWinner === 'tie'
      ? 'Empate!'
      : `${roundWinner === 'player' ? 'Você' : 'O oponente'} venceu a rodada.`);

    schedule(() => {
      if (handWinner) {
        finishHand(handWinner);
        return;
      }

      setTable({ player: null, ai: null });
      setStatus('player');
      setMessage('Sua vez: escolha uma carta.');
    }, 3000);
  }

  function playAiCard(playerCard, availableCards = aiCards) {
    if (!playerCard || !availableCards.length) return;

    const index = Math.floor(Math.random() * availableCards.length);
    const aiCard = availableCards[index];
    setAiCards(availableCards.filter((_, cardIndex) => cardIndex !== index));
    setTable({ player: playerCard, ai: aiCard });
    setStatus('resolving');
    setMessage('O oponente jogou. Comparando as cartas...');
    schedule(() => resolveRound(playerCard, aiCard), 700);
  }

  function playPlayerCard(card) {
    if (status !== 'player') return;

    const remainingPlayerCards = playerCards.filter((item) => item.code !== card.code);
    const currentAiCards = [...aiCards];
    setPlayerCards(remainingPlayerCards);
    setTable({ player: card, ai: null });
    setStatus('ai');
    setMessage('O oponente está pensando...');
    schedule(() => playAiCard(card, currentAiCards), 650);
  }

  function getDotStyle(result) {
    const base = { width: 14, height: 14, borderRadius: '50%', display: 'inline-block' };
    if (result === 'player') return { ...base, background: '#28a745' }; // verde
    if (result === 'ai') return { ...base, background: '#dc3545' }; // vermelho
    if (result === 'tie') return { ...base, background: '#ffffff', border: '1px solid #ccc' }; // branco
    return { ...base, background: '#e9ecef' }; // não jogado
  }

  if (loading) {
    return (
      <section className="truco-page deck-page">
        <Loading message="Preparando o jogo de Truco..." />
      </section>
    );
  }

  return (
    <section className="truco-page deck-page">
      <div className="page-title">
        <p className="eyebrow">Truco Paulista</p>
        <h1>Mesa de Truco</h1>
      </div>

      <ErrorMessage message={error} />
      {error && (
        <Button onClick={() => startHand({ initial: true })}>
          Tentar novamente
        </Button>
      )}

      {!error && (
        <>

          <div className="cards-panel">
            <div>
              <p className="eyebrow">Mão do oponente</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
                {aiCards.map((card) => (
                  <img
                    key={card.code}
                    src={CARD_BACK}
                    alt="Carta fechada do oponente"
                    style={cardStyle}
                  />
                ))}
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: 20,
                alignItems: 'end',
              }}
            >
              <div>
                <strong>O oponente na mesa</strong>
                <div>
                  {table.ai
                    ? <img src={table.ai.image} alt={`${table.ai.value} de ${table.ai.suit}`} style={cardStyle} />
                    : <p className="empty-message">Aguardando</p>}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  {vira && (
                    <img
                      src={vira.image}
                      alt={`Vira: ${vira.value} de ${vira.suit}`}
                      style={cardStyle}
                    />
                  )}
                </div>
              </div>

              <div>
                <strong>Você na mesa</strong>
                <div>
                  {table.player
                    ? <img src={table.player.image} alt={`${table.player.value} de ${table.player.suit}`} style={cardStyle} />
                    : <p className="empty-message">Aguardando</p>}
                </div>
              </div>
            </div>

            <div className="deck-info" aria-label="Resultados das rodadas">
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', alignItems: 'center' }}>
                {[0, 1, 2].map((index) => (
                  <span
                    key={index}
                    style={getDotStyle(roundResults[index])}
                    aria-label={roundResults[index] || 'não jogado'}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="eyebrow">Suas cartas</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
                {playerCards.map((card) => (
                  <button
                    key={card.code}
                    type="button"
                    onClick={() => playPlayerCard(card)}
                    disabled={status !== 'player'}
                    aria-label={`Jogar ${card.value} de ${card.suit}`}
                    style={{
                      padding: 0,
                      border: 0,
                      background: 'transparent',
                      cursor: status === 'player' ? 'pointer' : 'default',
                    }}
                  >
                    <img src={card.image} alt={`${card.value} de ${card.suit}`} style={cardStyle} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {status === 'handOver' && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(5, 10, 20, 0.72)',
                display: 'grid',
                placeItems: 'center',
                padding: 24,
                zIndex: 50,
              }}
              role="dialog"
              aria-modal="true"
              aria-label="Fim da rodada"
            >
              <div
                style={{
                  width: 'min(92vw, 420px)',
                  borderRadius: 24,
                  background: 'rgba(13, 20, 33, 0.98)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: '0 24px 80px rgba(0, 0, 0, 0.45)',
                  padding: 24,
                  textAlign: 'center',
                  display: 'grid',
                  gap: 18,
                }}
              >
                <img
                  src={lastHandWinner === 'player'
                    ? new URL('../../assets/gato-joia.png', import.meta.url).href
                    : new URL('../../assets/to-frito.jpg', import.meta.url).href}
                  alt={lastHandWinner === 'player' ? 'Você ganhou' : 'Você perdeu'}
                  style={{ width: '100%', maxHeight: 220, objectFit: 'contain', borderRadius: 16 }}
                />

                <Button onClick={() => window.location.reload()}>
                  Mais uma rodada?
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default TrucoPage;
