'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styled from 'styled-components';

const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
  font-family: 'Arial', sans-serif;
`;

const Title = styled.h1`
  color: white;
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
`;

const Input = styled.input`
  padding: 1rem;
  margin: 0.5rem 0;
  width: 300px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: 0.3s;

  &:focus {
    border-color: #4facfe;
  }

  @media (max-width: 600px) {
    width: 250px;
  }
`;

const Button = styled.button`
  padding: 1rem;
  margin: 0.5rem 0;
  width: 300px;
  background-color: #4facfe;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background-color: #00f2fe;
  }

  @media (max-width: 600px) {
    width: 250px;
  }
`;

const ButtonLink = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  text-decoration: underline;
  transition: 0.3s;

  &:hover {
    color: #00f2fe;
  }
`;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    if (!email || !password) {
      alert('Preencha todos os campos!');
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');

    const user = storedUsers.find((u: { email: string }) => u.email === email);

    if (user) {
      if (user.password === password) {
        localStorage.setItem('user', JSON.stringify({ email }));
        localStorage.setItem('lastLogin', Date.now().toString());
        router.push('/dashboard');
      } else {
        alert('Senha incorreta!');
      }
    } else {
      alert('Usuário não encontrado. Por favor, cadastre-se.');
    }
  };

  return (
    <LoginWrapper>
      <Title>Login</Title>
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={handleLogin}>Entrar</Button>
      <ButtonLink onClick={() => router.push('/signup')}>Cadastrar</ButtonLink>
    </LoginWrapper>
  );
}
