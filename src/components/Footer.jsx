import deckManagerLogo from '../assets/DeckManagerpp.png';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <img src={deckManagerLogo} alt="Deck Manager" />
        <strong>Deck Manager</strong>
      </div>
    </footer>
  );
}

export default Footer;
