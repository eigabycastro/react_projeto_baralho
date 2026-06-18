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
const RAISE_VALUES = [3, 6, 9, 12];
const RANK_NAMES = {
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  Q: 'Rainha',
  J: 'Valete',
  K: 'Rei',
  A: 'Ás',
  2: '2',
  3: '3',
};

const cardStyle = {
  width: 'clamp(82px, 10vw, 126px)',
  aspectRatio: '5 / 7',
  objectFit: 'contain',
  filter: 'drop-shadow(0 10px 12px rgba(15, 27, 47, 0.2))',
};

function randomFraction() {
  return Math.random();
}

function TrucoPage() {
  const [playerCards, setPlayerCards] = useState([]);
  const [aiCards, setAiCards] = useState([]);
  const [vira, setVira] = useState(null);
  const [manilha, setManilha] = useState('');
  const [table, setTable] = useState({ player: null, ai: null });
  const [roundResults, setRoundResults] = useState([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [handValue, setHandValue] = useState(1);
  const [status, setStatus] = useState('dealing');
  const [message, setMessage] = useState('Preparando a mesa...');
  const [pendingRaise, setPendingRaise] = useState(null);
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

  const startHand = useCallback(async ({ resetMatch = false, initial = false } = {}) => {
    clearTimers();
    controllerRef.current?.abort();

    const controller = new AbortController();
    controllerRef.current = controller;

    if (initial) setLoading(true);
    setError('');
    setStatus('dealing');
    setMessage('Distribuindo uma nova mão...');
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
      setHandValue(1);
      setPendingRaise(null);
      setStatus('player');
      setMessage('Sua vez: escolha uma carta.');

      if (resetMatch) {
        setPlayerScore(0);
        setAiScore(0);
      }
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
      startHand({ resetMatch: true, initial: true });
    }, 0);

    return () => {
      clearTimeout(initialTimer);
      clearTimers();
      controllerRef.current?.abort();
    };
  }, [clearTimers, startHand]);

  function finishHand(winner, points = handValue) {
    const nextPlayerScore = playerScore + (winner === 'player' ? points : 0);
    const nextAiScore = aiScore + (winner === 'ai' ? points : 0);
    setPlayerScore(nextPlayerScore);
    setAiScore(nextAiScore);
    setPendingRaise(null);

    if (nextPlayerScore >= 12 || nextAiScore >= 12) {
      setStatus('gameOver');
      setMessage(winner === 'player' ? 'Você venceu a partida!' : 'A IA venceu a partida.');
      return;
    }

    setStatus('handOver');
    setMessage(winner === 'tie'
      ? 'A mão cangou. Ninguém marcou pontos.'
      : `${winner === 'player' ? 'Você' : 'A IA'} venceu a mão e marcou ${points} ponto${points > 1 ? 's' : ''}.`);
    schedule(() => startHand(), 1800);
  }

  function resolveRound(playerCard, aiCard, currentHandValue = handValue) {
    const roundWinner = determineRoundWinner(playerCard, aiCard, manilha);
    const updatedResults = [...roundResults, roundWinner];
    const handWinner = determineHandWinner(updatedResults);
    setRoundResults(updatedResults);
    setStatus('resolving');
    setMessage(roundWinner === 'tie'
      ? 'Cangou! As cartas têm a mesma força.'
      : `${roundWinner === 'player' ? 'Você' : 'A IA'} venceu a rodada.`);

    schedule(() => {
      if (handWinner) {
        finishHand(handWinner, currentHandValue);
        return;
      }

      setTable({ player: null, ai: null });
      setStatus('player');
      setMessage('Sua vez: escolha uma carta.');
    }, 1200);
  }

  function playAiCard(playerCard, availableCards = aiCards, currentHandValue = handValue) {
    if (!playerCard || !availableCards.length) return;

    const index = Math.floor(randomFraction() * availableCards.length);
    const aiCard = availableCards[index];
    setAiCards(availableCards.filter((_, cardIndex) => cardIndex !== index));
    setTable({ player: playerCard, ai: aiCard });
    setStatus('resolving');
    setMessage('A IA jogou. Comparando as cartas...');
    schedule(() => resolveRound(playerCard, aiCard, currentHandValue), 700);
  }

  function aiMayRaise(playerCard, availableCards) {
    const strongestCard = Math.max(
      ...availableCards.map((card) => getCardStrength(card, manilha)),
    );
    const shouldRaise = handValue < 12 && strongestCard >= 9 && randomFraction() < 0.32;

    if (!shouldRaise) {
      playAiCard(playerCard, availableCards, handValue);
      return;
    }

    const requestedValue = RAISE_VALUES.find((value) => value > handValue);
    setPendingRaise({ requestedValue, playerCard, availableCards });
    setStatus('responding');
    setMessage(`A IA pediu ${requestedValue === 3 ? 'TRUCO' : requestedValue}! Você aceita?`);
  }

  function playPlayerCard(card) {
    if (status !== 'player') return;

    const remainingPlayerCards = playerCards.filter((item) => item.code !== card.code);
    const currentAiCards = [...aiCards];
    setPlayerCards(remainingPlayerCards);
    setTable({ player: card, ai: null });
    setStatus('ai');
    setMessage('A IA está pensando...');
    schedule(() => aiMayRaise(card, currentAiCards), 650);
  }

  function requestRaise() {
    const requestedValue = RAISE_VALUES.find((value) => value > handValue);
    if (!requestedValue || status !== 'player') return;

    const strongestCard = Math.max(
      ...aiCards.map((card) => getCardStrength(card, manilha)),
    );
    const threshold = { 3: 6, 6: 8, 9: 10, 12: 12 }[requestedValue];
    const accepts = strongestCard >= threshold || randomFraction() < 0.22;
    setStatus('resolving');
    setMessage(`Você pediu ${requestedValue === 3 ? 'TRUCO' : requestedValue}!`);

    schedule(() => {
      if (accepts) {
        setHandValue(requestedValue);
        setStatus('player');
        setMessage(`A IA aceitou. A mão agora vale ${requestedValue} pontos.`);
      } else {
        setMessage('A IA correu!');
        finishHand('player', handValue);
      }
    }, 700);
  }

  function acceptAiRaise() {
    if (!pendingRaise) return;

    const { requestedValue, playerCard, availableCards } = pendingRaise;
    setHandValue(requestedValue);
    setPendingRaise(null);
    setStatus('ai');
    setMessage(`Você aceitou. A mão vale ${requestedValue} pontos.`);
    schedule(() => playAiCard(playerCard, availableCards, requestedValue), 500);
  }

  function runFromAiRaise() {
    if (!pendingRaise) return;

    setPendingRaise(null);
    setMessage('Você correu da mão.');
    finishHand('ai', handValue);
  }

  const nextRaise = RAISE_VALUES.find((value) => value > handValue);
  const roundNumber = Math.min(roundResults.length + 1, 3);

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
        <p>Primeiro a alcançar 12 pontos vence a partida.</p>
      </div>

      <ErrorMessage message={error} />
      {error && (
        <Button onClick={() => startHand({ resetMatch: true, initial: true })}>
          Tentar novamente
        </Button>
      )}

      {!error && (
        <>
          <div className="deck-panel">
            <div className="deck-info" aria-label="Placar e informações da mão">
              <span>Você: {playerScore}</span>
              <span>IA: {aiScore}</span>
              <span>Rodada: {roundNumber}/3</span>
              <span>Valor da mão: {handValue}</span>
              <span>Manilha: {RANK_NAMES[manilha] || '-'}</span>
            </div>

            <p
              className={status === 'gameOver' ? 'success-message' : 'tip-panel'}
              aria-live="polite"
            >
              {message}
            </p>

            <div className="deck-actions">
              {nextRaise && (
                <Button variant="secondary" onClick={requestRaise} disabled={status !== 'player'}>
                  Pedir {nextRaise === 3 ? 'Truco' : nextRaise}
                </Button>
              )}

              {pendingRaise && (
                <>
                  <Button onClick={acceptAiRaise}>Aceitar</Button>
                  <Button variant="outline" onClick={runFromAiRaise}>Correr</Button>
                </>
              )}

              {status === 'gameOver' && (
                <Button onClick={() => startHand({ resetMatch: true, initial: true })}>
                  Nova partida
                </Button>
              )}
            </div>
          </div>

          <div className="cards-panel">
            <div>
              <p className="eyebrow">Mão da IA</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                {aiCards.map((card) => (
                  <img
                    key={card.code}
                    src={CARD_BACK}
                    alt="Carta fechada da IA"
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
                <strong>IA na mesa</strong>
                <div>
                  {table.ai
                    ? <img src={table.ai.image} alt={`${table.ai.value} de ${table.ai.suit}`} style={cardStyle} />
                    : <p className="empty-message">Aguardando</p>}
                </div>
              </div>

              <div>
                <strong>Vira</strong>
                <div>
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
              {[0, 1, 2].map((index) => (
                <span key={index}>
                  R{index + 1}: {{ player: 'Você', ai: 'IA', tie: 'Cangou' }[roundResults[index]] || '-'}
                </span>
              ))}
            </div>

            <div>
              <p className="eyebrow">Suas cartas</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
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
        </>
      )}
    </section>
  );
}

export default TrucoPage;
