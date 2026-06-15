import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/">Home</NavLink>
      <NavLink to="/deck">Baralho</NavLink>
      <NavLink to="/truco">Truco</NavLink>
    </nav>
  );
}

export default Navbar;
