import { useRouter } from 'next/navigation';
import './header.css';

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  return (
    <header className="header-wrapper">
      <h1 className="header-title">Teste Franq: Gabriel Freire</h1>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </header>
  );
}
