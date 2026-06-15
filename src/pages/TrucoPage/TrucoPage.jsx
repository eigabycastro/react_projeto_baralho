import './trucoPage.css';

function TrucoPage() {
    return (
        <section className="truco-page">
            <div className="truco-section" id="section-enemy">
                <div className="truco-image-slot"><img src="https://i0.wp.com/espaferro.com.br/wp-content/uploads/2024/06/placeholder-588.png?ssl=1" alt="" srcset="" /></div>
                <div className="truco-cards-slot">Enemy cards</div>
            </div>
            <div className="truco-section" id="section-deck">
                <div className="truco-deck-image-slot"><img src="https://i0.wp.com/espaferro.com.br/wp-content/uploads/2024/06/placeholder-588.png?ssl=1" alt="" srcset="" /></div>
                <div className="truco-deck-card-slot">Card</div>
            </div>
            <div className="truco-section" id="section-player">
                <div className="truco-image-slot"><img src="https://i0.wp.com/espaferro.com.br/wp-content/uploads/2024/06/placeholder-588.png?ssl=1" alt="" srcset="" /></div>
                <div className="truco-cards-slot">Player cards</div>
            </div>
        </section>
    );
}

export default TrucoPage;