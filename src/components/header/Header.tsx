import { useRouter } from 'next/navigation';
import styled from 'styled-components';

const HeaderWrapper = styled.header`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 8px;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    padding: 10px 15px;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 1.5rem;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const LogoutButton = styled.button`
  background-color: #e60000;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #ff3b3b;
  }
`;

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    // Redirect to login page
    router.push('/');
  };

  return (
    <HeaderWrapper>
      <HeaderTitle>Teste Franq: Gabriel Freire</HeaderTitle>
      <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
    </HeaderWrapper>
  );
}
