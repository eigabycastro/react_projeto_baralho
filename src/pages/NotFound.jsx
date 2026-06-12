import { Link } from 'react-router-dom';
import Button from '../components/Button';

function NotFound() {
  return (
    <section className="not-found-page">
      <h1>404</h1>
      <p>A pagina que voce tentou acessar nao existe.</p>
      <Link to="/">
        <Button>Voltar para Home</Button>
      </Link>
    </section>
  );
}

export default NotFound;
