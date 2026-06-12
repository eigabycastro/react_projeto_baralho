import Navbar from './Navbar';
import deckManagerLogo from '../assets/DeckManagerpp.png';

function Header() {
  return (
    <header className="header">
      <div className="header-logo">
        <img src={deckManagerLogo} alt="Deck Manager" />
        <strong>Deck Manager</strong>
      </div>
      <Navbar />
    </header>
  );
}

export default Header;
