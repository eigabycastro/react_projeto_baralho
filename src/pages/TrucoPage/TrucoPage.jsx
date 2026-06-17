import { useEffect, useState } from 'react';
import { returnCards } from '../../services/deckService';
import { mapCard } from '../../mappers/cardMapper';
import './trucoPage.css';

function TrucoPage() {
    const [myCards, setMyCards] = useState(null);
    const [deckCard, setDeckCard] = useState(null);
    const [enemyCards, setEnemyCards] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCards = async (setter, count) => {
        try {
            setLoading(true);
            const deckId = 'new';
            // TODO: Implementar lógica para puxar cartas específicas do baralho
            const response = await returnCards(deckId, count);
            if (response.cards && response.cards.length > 0) {
                const mappedCards = response.cards.map(mapCard);
                setter(mappedCards.length === 1 ? mappedCards[0] : mappedCards);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchEnemyCards = () => fetchCards(setEnemyCards, 3);
    const fetchMyCards = () => fetchCards(setMyCards, 3);
    const fetchDeckCard = () => fetchCards(setDeckCard, 1);

    useEffect(() => {
        fetchEnemyCards();
        fetchMyCards();
        fetchDeckCard();
    }, []);

    return (
        <section className="truco-page">
            <div className="truco-section" id="section-enemy">
                <div className="truco-image-slot"><img src="https://i0.wp.com/espaferro.com.br/wp-content/uploads/2024/06/placeholder-588.png?ssl=1" alt="" srcSet="" /></div>
                <div className="truco-cards-slot">
                    {loading && <p>Carregando cartas...</p>}
                    {error && <p>Erro: {error}</p>}
                    {enemyCards && Array.isArray(enemyCards) && (
                        <div className="cards-container">
                            {enemyCards.map((card) => (
                                <div key={card.code} className="enemy-card">
                                    <img src={card.image} alt={`${card.value} de ${card.suit}`} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="truco-section" id="section-deck">
                <div className="truco-deck-image-slot"><img src="https://i0.wp.com/espaferro.com.br/wp-content/uploads/2024/06/placeholder-588.png?ssl=1" alt="" srcSet="" /></div>
                <div className="truco-deck-card-slot">
                    {loading && <p>Carregando carta...</p>}
                    {error && <p>Erro: {error}</p>}
                    {deckCard && (
                        <div className="deck-card">
                            <img src={deckCard.image} alt={`${deckCard.value} de ${deckCard.suit}`} />
                        </div>
                    )}
                </div>
            </div>
            <div className="truco-section" id="section-player">
                <div className="truco-image-slot"><img src="https://i0.wp.com/espaferro.com.br/wp-content/uploads/2024/06/placeholder-588.png?ssl=1" alt="" srcSet="" /></div>
                <div className="truco-cards-slot">
                    {loading && <p>Carregando cartas...</p>}
                    {error && <p>Erro: {error}</p>}
                    {myCards && Array.isArray(myCards) && (
                        <div className="cards-container">
                            {myCards.map((card) => (
                                <div key={card.code} className="my-card">
                                    <img src={card.image} alt={`${card.value} de ${card.suit}`} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default TrucoPage;